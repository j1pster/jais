/*-------------------------------------------------------------------------------------------*/
/*----------------------------------------- Linkplan ----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.saveLinkOrder = function() {
    var self = window.plugin.jais;
    var length = self.links.length;
    for(var i = 0; i < length; i++) {
        var input = document.getElementById("link" + self.links[i].idx).getElementsByTagName('input')[0];
        self.links[i].order = input.valueAsNumber;
    }
    self.links.sort(self.orderSort);
    var linkTable = document.getElementById("linkAnchor");
    var portalTable = document.getElementById("portalAnchor");
    var parent = linkTable.parentElement;
    parent.removeChild(linkTable);
    parent.removeChild(portalTable)
    var newLinkTable = document.createElement('div');
    var newPortalTable = document.createElement('div');
    newLinkTable.id = "linkAnchor";
    newLinkTable.innerHTML = self.linkHTML();
    newPortalTable.id = "portalAnchor";
    newPortalTable.innerHTML = self.portalsInPlan();
    parent.appendChild(newLinkTable);
    parent.appendChild(newPortalTable)
};

window.plugin.jais.deleteLink = function(idx) {
    var self = window.plugin.jais;
    self.links.splice(idx, 1);
    var theLink = document.getElementById("link" + idx);
    theLink.parentElement.removeChild(theLink);
    self.saveLinkOrder();
};

window.plugin.jais.swapLink = function(idx) {
    var self = window.plugin.jais;
    self.links[idx].swapLink();
    self.saveLinkOrder();
};

window.plugin.jais.clearLinks = function() {
    var table = document.getElementById("linkTable");
    table.parentElement.removeChild(table);
    window.plugin.jais.links = [];
};

window.plugin.jais.convertLayerToLinks = function(layer) {
    console.log(layer);
    var pi = [];
    var self = window.plugin.jais;
    var latlngs = layer.getLatLngs();
    var visibleBounds = map.getBounds();
    var visiblePortals = {};
    for(var guid in window.portals) {
        var portal = window.portals[guid];
        var ll = portal.getLatLng();
        if(visibleBounds.contains(ll)) {
            visiblePortals[guid] = map.project(ll);
        }
    }

    var linkDoesntExistYet = function(origin, destination) {
        for(var l = 0; l < self.links.length; l++) {
            var cl = self.links[l];
            if((cl.from.guid === origin.options.guid && cl.to.guid === destination.options.guid)
            || (cl.to.guid === origin.options.guid && cl.from.guid === destination.options.guid)) {
                return [false, cl];
            }
        }
        return [true, undefined];
    };

    for(var ll = 0; ll < latlngs.length; ll++) {
        var cp = self.findClosestPortalInObject(latlngs[ll], visiblePortals);
        if(!self.arrayContains(pi, cp)) {
            pi.push(cp);
        }
    }
    if(pi.length === 2) {
        var linkCheck = linkDoesntExistYet(pi[0], pi[1]);
        if(linkCheck[0]) {
            var newLink = Object.create(self.link);
            var order = self.links.length !== 0 ? self.links[self.links.length - 1].order + 1 : 0;
            newLink.init(pi[0], pi[1], layer.options.color, order);
            self.links.push(newLink);
        } else {
            linkCheck[1].layerCounter += 1;
        }
    } else if (pi.length === 3) {
        var possibleLinks = [[pi[0], pi[1]], [pi[0], pi[2]], [pi[1], pi[2]]];
        var order = self.links.length !== 0 ? self.links[self.links.length - 1].order + 1 : 0;
        for(var i = 0; i < possibleLinks.length; i++) {
            var linkCheck = linkDoesntExistYet(possibleLinks[i][0], possibleLinks[i][1]);
            if(linkCheck[0]) {
                newLink = Object.create(self.link);
                newLink.init(possibleLinks[i][0], possibleLinks[i][1], layer.options.color, order);
                self.links.push(newLink);
            } else {
                linkCheck[1].layerCounter += 1;
            };
        }
    };
};

window.plugin.jais.save = function() {
    localStorage['plugin-jais-links'] = JSON.stringify(window.plugin.jais.links);
};

window.plugin.jais.load = function() {
    console.log("Jais: trying to load links from localStorage");
    var self = window.plugin.jais;
    try {
        var dataStr = localStorage['plugin-jais-links'];
        if(dataStr === undefined) return;

        var data = JSON.parse(dataStr);
        for(var i = 0; i < data.length; i++) {
            var currentLink = data[i];
            var newLink = Object.create(self.link);
            newLink.initFromLocalStorage(currentLink);
            self.links.push(newLink);
        }
        self.drawToolsDataLoaded = true;
    } catch(e) {
        console.warn('Jais: failed to load data from localStorage: ' + e);
    }
};

window.plugin.jais.portalsInPlan = function() {
    var self = window.plugin.jais;
    var thePortals = {}
    var portalArray = [];

    function addPortal(portal, outgoing, incoming) {
        console.log(portal);
        thePortals[portal.guid] = {
            guid: portal.guid,
            title: portal.title,
            lat: portal.getLatLng().lat,
            lng: portal.getLatLng().lng,
            outgoingLinks: outgoing,
            keysNeeded: incoming
        };
        portalArray.push(portal);
    }

    for(var i = 0; i < self.links.length; i++) {
        var theLink = self.links[i];
        if(!self.portalAlreadyInOp(portalArray, theLink.from)) {
            addPortal(theLink.from, 1, 0);
        } else {
            thePortals[theLink.from.guid].outgoingLinks++;
        }
        if(!self.portalAlreadyInOp(portalArray, theLink.to)) {
            addPortal(theLink.to, 0, 1);
        } else {
            thePortals[theLink.to.guid].keysNeeded++;
        }
    }
    self.thePortalsInPlan = thePortals;
    return self.portalHTML(thePortals);
}