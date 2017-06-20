// ==UserScript==
// @name Just Another Intel Script Lite
// @namespace http://jips.website
// @version 0.42.44
// @description Does Something
// @updateURL      http://jips.website/Ingress/JaisLite.user.js
// @downloadURL    http://jips.website/Ingress/JaisLite.user.js
// @include        https://ingress.com/intel*
// @include        http://ingress.com/intel*
// @match          https://ingress.com/intel*
// @match          http://ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @copyright 2015+ JL
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};
// Create own namespace for plugin
window.plugin.jais = {
    FIELD_SCORE: 750,
    LINK_SCORE: 187,
    RESO_SCORE: 75,
    BUILD_SCORE: 1750,
    MOD_SCORE: 250
};

window.plugin.jais.boot = function() {
    $('#toolbox').append('<a onclick="window.plugin.jais.openJaisDialog()" title=>Jais</a>');
    window.plugin.jais.justAnotherPortalArray = [];
    window.plugin.jais.addEventListeners();
    window.plugin.jais.jsonOutput = {
        "portals": window.plugin.jais.justAnotherPortalArray
    };
    window.plugin.jais.links = [];
    window.plugin.jais.link = {
        init: function(o, d, layer, order) {
            this.from = o;
            this.to = d;
            this.layer = layer;
            this.order = order !== undefined ? order : window.plugin.jais.links.length;
            this.oLat = o.getLatLng().lat;
            this.oLng = o.getLatLng().lng;
            this.dLat = d.getLatLng().lat;
            this.dLng = d.getLatLng().lng;
        }
    };
    $('head').append('<style>' +
        '.ui-dialog-jais-export textarea { width:96%; height:150px; resize:vertical; }'+
        '.ui-dialog-jais-export.optionBox a {display: block; width: 80%; margin: 10px auto; text-align: center; background-color: rgba(27, 50, 64, 0.9); padding: 3px;}'+
        '#textareadiv {display:none; padding: 0;} #textareadiv textarea {margin-bottom:5%;}' +
        '.jais-button {width: 45%; height: 40px; text-align: center; margin-left: 2.5%; margin-right: 2.5%; margin-bottom: 5%;}'+
        '.portal-count-box {display: block; width: 95%; margin:5px auto;}'+
        'table.portal-counts {margin-top:5px; border-collapse: collapse; empty-cells: show; width: 100%; clear: both;}'+
        '.portal-count-box tr {width:95%; margin:0 auto;}'+
        '.portal-count-box td, th{text-align:center; color:white; vertical-align:middle; border-bottom: 1px solid #0b314e; padding: 3px;}'+
        'td.resistance {background-color: #0088FF;}'+
        'td.enlightened {background-color: #03DC03;}'+
        '</style>');
};

window.plugin.jais.arrayContains = function(theArray, obj){
    for (var i = theArray.length - 1; i > -1; i--) {
        if (theArray[i] === obj) {
            return true;
        }
    }
    return false;
};

window.plugin.jais.getRelevantInfoFromClickedPortal = function(request) {
    /*if(request.responseURL == "https://www.ingress.com/r/getPortalDetails") {
        response = JSON.parse(request.responseText);
        storedRequest = JSON.parse(request.storedReq);
        var currentPortal = {
            "guid": storedRequest.guid,
            "location": {
            "lat": response.result[2] * 0.000001,
            "lng": response.result[3] * 0.000001
            },
            "name": response.result[8]
        };
        window.plugin.jais.justAnotherPortalArray.push(currentPortal);
    }*/
};

window.plugin.jais.GetInfoAndAddToArray = function(portal) {
    var currentPortal = {
        "guid": portal.options.guid,
        "location": {
            "lat": portal._latlng.lat,
            "lng": portal._latlng.lng
        },
        "name": portal.options.data.title,
        "intellink": 'https://www.ingress.com/intel?ll='+portal._latlng.lat+','+portal._latlng.lng+'&z=17&pll='+portal._latlng.lat+','+portal._latlng.lng
    };
    window.plugin.jais.justAnotherPortalArray.push(currentPortal);
};

window.plugin.jais.openJaisDialog = function() {
    var html = '<p>Welcome to Jais, this plugin is mainly so you can do stuff with portals inside a polygon.'
    + 'As such, you\'ll need the drawTools plugin. The plugin will use every polygon.<p>';
    if(window.plugin.drawTools) {
        if(Object.keys(window.plugin.drawTools.drawnItems._layers).length === 0) {
            html += '<p>No polygons have been detected. Please use the drawTools plugin to draw a polygon around the portals you want to use.</p>';
        } else {
            html += '<p>Please use the buttons to select what you want to do with the portals inside the polygon</p>'
            + '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.countPortals();\' role=\'button\'>Count</button>'
            + '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.exportPortalsFromPolygon();\' role=\'button\'>Export</button>'
            + '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.bookMarkPortalsFromPolygon();\' role=\'button\'>Bookmark</button>';
            if(window.plugin.reswue) {
                html += '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.addPortalsToCurrentReswueOp();\' role=\'button\'>Add to Reswue</button>';
            }
            html += '<div id=\'textareadiv\' class=\'ui-dialog-content\'><textarea readonly onclick="$(\'#textareadiv textarea\').select();">'+ JSON.stringify(window.plugin.jais.justAnotherPortalArray) +'</textarea>'
            + '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick="$(\'#textareadiv textarea\').focus().select();" role=\'button\'>Select All</button>'
            + '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.clearPortals();\' role=\'button\'>Clear</button>'
            + '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.closeTextArea();\' role=\'button\'>Close</button></div>';
        }
    } else {
        html += "<p>Drawtools doesn't seem to be installed. You can find it <a href=\'https://static.iitc.me/build/release/plugins/draw-tools.user.js\'>here</a>.</p>";
    }
	dialog({
        html: html,
        width: 450,
        dialogClass: 'ui-dialog-jais-export',
        title: 'Just Another Intel Script'
   });
   return;
};

window.plugin.jais.countPortals = function() {
    var self = window.plugin.jais;
    if(self.checkForDrawTools()) {
        var thePortals = self.getPortalsFromPolygon(),
        fieldCount = self.getFieldsFromPolygon(thePortals),
        linkCount = self.getLinksFromPolygon(thePortals);
        self.lowestVisibleLevel = getMinPortalLevel();
        self.portalArray = [0, [], []];
        self.portalCount = [0, 0, 0];
        self.resoCount = [0, 0, 0];
        for(var i = 0; i <= window.MAX_PORTAL_LEVEL; i++) {
            self.portalArray[1][i] = 0;
            self.portalArray[2][i] = 0;
        }
        for(var thePortal = 0; thePortal < thePortals.length; thePortal++) {
            var team = thePortals[thePortal].options.team;
            var level = thePortals[thePortal].options.level,
            resCount = thePortals[thePortal].options.data.resCount;
            if(team !== 0) {
                self.portalArray[team][level]++;
                self.portalCount[team]++;
                if(resCount) {
                    self.resoCount[team] += resCount;
                }
            } else {
                self.portalCount[0]++;
            }
        }
        console.log(self.portalCount, self.resoCount);
        var openResoSlots = (self.portalCount[1] * 8) - self.resoCount[1] + self.resoCount[2];
        var potentialAP = [0, 0];
        potentialAP[0] = self.resoCount[2] * self.RESO_SCORE + fieldCount[2] * self.FIELD_SCORE + linkCount[2] * self.LINK_SCORE;
        potentialAP[1] = self.resoCount[1] * self.RESO_SCORE + fieldCount[1] * self.FIELD_SCORE + linkCount[1] * self.LINK_SCORE;
        var html = '<div class=\'portal-count-box\'><table class=\'portal-counts\'><tbody><tr><th colspan=\'3\'>' + thePortals.length + ' Portals.</th></tr>'+
        '<tr><th></th><th class=\'resistance\'>Resistance</th><th class=\'enlightened\'>Enlightened</th></tr>';
        for(var level2 = window.MAX_PORTAL_LEVEL; level2 > 0; level2--) {
            html += '<tr> <td class=\'L'+level2+'\' style=\'background-color: '+ COLORS_LVL[level2] +';\'>Level '+ level2 + '</td>';
            if(self.lowestVisibleLevel > level2) {
                html += '<td colspan=\'2\'>Zoom in to see portals in this level</td>';
            } else {
                html += '<td class=\'resistance\'>'+self.portalArray[1][level2]+'</td><td class=\'enlightened\'>'+self.portalArray[2][level2]+'</td>';
            }
            html += '</tr>';
        }
        html += '<tr><td>Links:</td><td class=\'resistance\'>'+linkCount[1]+'</td><td class=\'enlightened\'>'+linkCount[2]+'</td></tr>'+
                '<tr><td>Fields:</td><td class=\'resistance\'>'+fieldCount[1]+'</td><td class=\'enlightened\'>'+fieldCount[2]+'</td></tr>'+
                '<tr><td>Total Portals:</td><td class=\'resistance\'>'+self.portalCount[1]+'</td><td class=\'enlightened\'>'+self.portalCount[2]+'</td></tr>'+
                '<tr><td>Total Resonators: </td><td class=\'resistance\'>'+self.resoCount[1]+'</td><td class=\'enlightened\'>'+self.resoCount[2]+'</td></tr>'+
                '<tr><td>AP from destroying: </td><td class=\'resistance\'>'+potentialAP[1]+'</td><td class=\'enlightened\'>'+potentialAP[0]+'</td></tr>'+
                '<tr><td>Neutral Portals: </td><td colspan=\'2\'>'+self.portalCount[0]+'</td></tr>'+
                '<tr><td>Magnus Builder open reso slots: </td><td colspan=\'2\'>'+openResoSlots+'</td></tr></tbody></table></div>';
        dialog({
            html: html,
            width: 450,
            dialogClass: 'ui-dialog-jais-count',
            title: 'Portal count within all polygons'
        });
    }
    else {
        return;
    }
};

window.plugin.jais.clearPortals = function() {
    window.plugin.jais.justAnotherPortalArray = [];
    $(".ui-dialog-jais-export textarea").val(JSON.stringify(window.plugin.jais.justAnotherPortalArray));
    return;
};

window.plugin.jais.exportPortalsFromPolygon = function() {
    $('#textareadiv').show();
    var self = window.plugin.jais;
    if(self.checkForDrawTools()) {
        thePortals = self.getPortalsFromPolygon();
        for(var i = 0; i < thePortals.length; i++){
            self.GetInfoAndAddToArray(thePortals[i]);
        }
        $(".ui-dialog-jais-export textarea").val(JSON.stringify(self.justAnotherPortalArray));
    }
    return;
};

window.plugin.jais.closeTextArea = function() {
    $('#textareadiv').hide();
    return;
};

window.plugin.jais.bookMarkPortalsFromPolygon = function() {
    self = window.plugin.jais;
    var html = "";
    if(window.plugin.bookmarks) {
        self = window.plugin.jais;
        var thePortals = self.getPortalsFromPolygon();
        var bkmrkCount = 0;
        var alreadyBkmrkd = 0;
        for(var i = 0; i < thePortals.length; i++) {
            var thePortal = thePortals[i];
            var ll = thePortal.getLatLng();
            if(self.PortalNotYetBookmarked(thePortal)) {
                plugin.bookmarks.addPortalBookmark(thePortal.options.guid, ll.lat+','+ll.lng, thePortal.options.data.title);
                bkmrkCount++;
            } else {
                alreadyBkmrkd++;
            }
        }
        var portalOrPortals = "Portals",
        portalOrPortals2 = "Portals were";
        if(bkmrkCount === 1) {
            portalOrPortals = "Portal";
        } if(alreadyBkmrkd === 1) {
            portalOrPortals2 = "Portal was";
        }
        html += "<p>"+ bkmrkCount+ " " + portalOrPortals +" succesfully added to Bookmarks.</p>"
        + "<p>" + alreadyBkmrkd + " " + portalOrPortals2 + " already bookmarked.</p>";
    } else {
        html += "<p>Please install the Bookmarks plugin, you can find it <a href=\'https://static.iitc.me/build/release/plugins/bookmarks-by-zaso.user.js\'>here</a>";
    }
    dialog({
        html: html,
        width: 300,
        dialogClass: 'ui-dialog-jais-bookmarks',
        title: 'Add Portals to bookmarks'
    });
    return;
};

window.plugin.jais.PortalNotYetBookmarked = function(portal) {
    self = window.plugin.jais;
    for(var i = 0; i < Object.keys(window.plugin.bookmarks.bkmrksObj.portals).length; i++) {
        var bkmrkFolder = window.plugin.bookmarks.bkmrksObj.portals[Object.keys(window.plugin.bookmarks.bkmrksObj.portals)[i]]['bkmrk'];
        console.log("Bookmark Folder: ", bkmrkFolder);
        for(var j = 0; j < Object.keys(bkmrkFolder).length; j++) {
            var bkmrkdPortal = bkmrkFolder[Object.keys(bkmrkFolder)[j]];
            console.log("Bookmark Portal: ", bkmrkdPortal);
            if(portal.options.guid === bkmrkdPortal.guid) {
                return false;
            }
        }
    }
    return true;
};

window.plugin.jais.getFieldsFromPolygon = function(thePortals) {
    var fieldCount = [0, 0, 0],
    fieldArray = [],
    self = window.plugin.jais;
    var theField;
    var thePortal;
    for (var i = 0; i < Object.keys(window.fields).length; i++) {
        theField = window.fields[Object.keys(window.fields)[i]];
        for (var j = 0; j < thePortals.length; j++) {
            thePortal = thePortals[j];
            if(!self.arrayContains(fieldArray, theField)){
                if(thePortal.options.guid == theField.options.ent[2][2][0][0]){
                    fieldArray.push(theField);
                    fieldCount[theField.options.team]++;
                } else if (thePortal.options.guid == theField.options.ent[2][2][1][0]) {
                    fieldArray.push(theField);
                    fieldCount[theField.options.team]++;
                } else if (thePortal.options.guid == theField.options.ent[2][2][2][0]) {
                    fieldArray.push(theField);
                    fieldCount[theField.options.team]++;
                }
            }
        }
    }
    return fieldCount;
};

window.plugin.jais.getLinksFromPolygon = function(thePortals) {
    var linkCount = [0, 0, 0],
    linkArray = [],
    self = window.plugin.jais;
    var theLink;
    var thePortal;
    for (var i = 0; i < Object.keys(window.links).length; i++) {
        theLink = window.links[Object.keys(window.links)[i]];
        for (var j = 0; j < thePortals.length; j++) {
            var check = false;
            thePortal = thePortals[j];
            if(!self.arrayContains(linkArray, theLink)) {
                if(thePortal.options.guid == theLink.options.ent[2][2]) {
                    linkArray.push(theLink);
                    linkCount[theLink.options.team]++;
                } else if (thePortal.options.guid == theLink.options.ent[2][5]) {
                    linkArray.push(theLink);
                    linkCount[theLink.options.team]++;
                }
            }
        }
    }
    return linkCount;
};

window.plugin.jais.getPortalsFromPolygon = function() {
    var portalCount = 0,
    portalArray = [],
    self = window.plugin.jais;
    var drawItemArray = [];

    function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        var x = point[0], y = point[1];
        var inside2 = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside2 = !inside2;
        }
        return inside2;
    }

    for (var i = 0; i < Object.keys(window.plugin.drawTools.drawnItems._layers).length; i++) {
        obj = window.plugin.drawTools.drawnItems._layers;
        var drawnItem = window.plugin.drawTools.drawnItems._layers[Object.keys(obj)[i]];
        drawItemArray = [];

        for(var drawings = 0; drawings < drawnItem._latlngs.length; drawings++) {
            drawItemArray.push([drawnItem._latlngs[drawings].lat, drawnItem._latlngs[drawings].lng]);
        }
        for(var thePortals = 0; thePortals < Object.keys(window.portals).length; thePortals++) {
            thePortal = window.portals[Object.keys(window.portals)[thePortals]];
            if(inside([thePortal._latlng.lat, thePortal._latlng.lng], drawItemArray)) {
                portalArray.push(thePortal);
            } else {
                for(var j = 0; j < drawItemArray.length; j++) {
                    if(thePortal._latlng.lat === drawItemArray[j][0] && thePortal._latlng.lng === drawItemArray[j][1]) {
                        portalArray.push(thePortal);
                    }
                }
            }
        }
    }
    return portalArray;
};

window.plugin.jais.checkForDrawTools = function() {
    if(typeof(window.plugin.drawTools) != 'function') {
        alert("drawTools is not installed, please install the drawtools plugin.");
        return false;
    }
    else {
        return true;
    }
};

window.plugin.jais.addPortalsToCurrentReswueOp = function() {
    if(window.plugin.reswue.core.selectedOperation !== undefined) {
        var self = window.plugin.jais;
        self.thePortals = self.getPortalsFromPolygon();
        self.selectedOperation = window.plugin.reswue.core.selectedOperation.data.operationName;
        self.currentLayer = window.plugin.reswue.layerManager.activeLayer;
        self.portalOrPortals = self.thePortals.length == 1 ? "Portal" : "Portals";
        if(self.selectedOperation && self.currentLayer) {
            if(confirm("Are you sure you want to add " + self.thePortals.length + " " + self.portalOrPortals + " to layer \"" + self.currentLayer + "\" in operation " + self.selectedOperation + "?")) {
                self.reswuePortalsDescription = prompt("Add a description (optional)", "");
                if(!self.reswuePortalsDescription){
                    self.reswuePortalsDescription = "";
                }
                var portalsAlreadyInOpPromise = window.plugin.reswue.core.selectedOperation.portalService.getPortals();
                portalsAlreadyInOpPromise.then(function(result) {
                    window.plugin.jais.portalsInOpArray = result;
                    for(var i = 0; i < self.thePortals.length; i++) {
                        self.currentPortal = self.thePortals[i];
                        if(!self.portalAlreadyInOp(self.portalsInOpArray, self.currentPortal)){
                            window.plugin.reswue.core.selectedOperation.portalService.addPortal(self.currentPortal.options.guid, self.currentPortal.options.data.title, self.currentLayer, self.currentPortal._latlng.lat, self.currentPortal._latlng.lng, false, window.plugin.reswue.localConfig.nickname, self.reswuePortalsDescription);
                        } else {
                            console.log('portal '+self.currentPortal.options.data.title+' is already in this operation');
                        }
                    }
                });
            }
            else {
                return;
            }
        }
    } else {
        alert("You don't have a reswue op selected. Please select an operation before adding portals to it.");
    }
};

window.plugin.jais.addEventListeners = function() {
    var self = window.plugin.jais;
    window.addHook('iitcLoaded', function() {
        window.addHook('pluginDrawTools', self.drawToolsHandler);
    });
};

window.plugin.jais.drawToolsHandler = function(e) {
    var self = window.plugin.jais;
    if(e.event === "layerCreated") {
        self.layerCreatedHandler(e);
    }
};

window.plugin.jais.layerCreatedHandler = function(e) {
    console.log(e);
    self = window.plugin.jais;
    var pi = [];
    var latlngs = e.layer.getLatLngs();
    var visibleBounds = map.getBounds();
    var visiblePortals = {};
    for(var guid in window.portals) {
        var portal = window.portals[guid];
        var ll = portal.getLatLng();
        if(visibleBounds.contains(ll)) {
            visiblePortals[guid] = map.project(ll);
        }
    }

    var findClosestPortal = function(latlng) {
        var testpoint = map.project(latlng);
        var minDistSquared = undefined;
        var minGuid = undefined;
        for (var guid in visiblePortals) {
          var p = visiblePortals[guid];
          var distSquared = (testpoint.x-p.x)*(testpoint.x-p.x) + (testpoint.y-p.y)*(testpoint.y-p.y);
          if (minDistSquared === undefined || minDistSquared > distSquared) {
            minDistSquared = distSquared;
            minGuid = guid;
          }
        }
        return minGuid ? portals[minGuid] : undefined;
    };

    var linkDoesntExistYet = function(origin, destination) {
        for(var l = 0; l < self.links.length; l++) {
            var cl = self.links[l];
            console.log(cl.from._leaflet_id, origin._leaflet_id, cl.to._leaflet_id, destination._leaflet_id);
            if((cl.from._leaflet_id === origin._leaflet_id && cl.to._leaflet_id === destination._leaflet_id) ||
            (cl.to._leaflet_id === origin._leaflet_id && cl.from._leaflet_id === destination._leaflet_id)) {
                return false;
            }
        }
        return true;
    };

    for(var ll = 0; ll < latlngs.length; ll++) {
        var cp = findClosestPortal(latlngs[ll]);
        if(!self.arrayContains(pi, cp)) {
            pi.push(cp);
        }
    }
    if(pi.length === 2) {
        if(linkDoesntExistYet(pi[0], pi[1])) {
            newLink = Object.create(self.link);
            var order = self.links.length !== 0 ? self.links[self.links.length - 1].order + 1 : 0;
            newLink.init(pi[0], pi[1], e.layer, order);
            self.links.push(newLink);
        }
    } else if (pi.length === 3) {
        var possibleLinks = [[pi[0], pi[1]], [pi[1], pi[2]], [pi[2], pi[0]]];
        var order = self.links.length !== 0 ? self.links[self.links.length - 1].order + 1 : 0;
        for(var i = 0; i < possibleLinks.length; i++) {
            if(linkDoesntExistYet(possibleLinks[i][0], possibleLinks[i][1])) {
                newLink = Object.create(self.link);
                newLink.init(possibleLinks[i][0], possibleLinks[i][1], e.layer, order);
                self.links.push(newLink);
            }
        }
    }
};

window.plugin.jais.portalAlreadyInOp = function(portalsInOp, thePortal) {
    for(var i = 0; i < portalsInOp.length; i++) {
        if(portalsInOp[i].id == thePortal.options.guid) {
            return true;
        }
    }
    return false;
};

XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(value) {
    this.addEventListener("progress", function(){
        window.plugin.jais.getRelevantInfoFromClickedPortal(this);
    }, false);
    this.realSend(value);
};

var setup=function(){
window.plugin.jais.boot();
};

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} //Wrapper end
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
