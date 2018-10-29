/*-------------------------------------------------------------------------------------------*/
/*----------------------------------------- Helpers -----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.portalAlreadyInOp = function(portalsInOp, thePortal) {
    if(!thePortal.options) {
        thePortal.options = {};
        thePortal.options.guid = thePortal.guid;
    }
    for(var i = 0; i < portalsInOp.length; i++) {
        if(!portalsInOp[i].id) {
            portalsInOp[i].id = portalsInOp[i].guid;
        }
        if(portalsInOp[i].id == thePortal.options.guid) {
            return true;
        }
    }
    return false;
};

window.plugin.jais.portalAlreadyInPlan = function(linksInPlan, thePortal, currentLink) {
    for(var i = 0; i < linksInPlan.length; i++) {
        var link = linksInPlan[i];
        if((link.from.guid === thePortal.guid || link.to.guid === thePortal.guid) && link !== currentLink) {
            return true;
        }
    }
    return false;
};

window.plugin.jais.linkAlreadyInOp = function(linksInOp, theLink) {
    var length = linksInOp.length;
    for(var i = 0; i < length; i++) {
        var link = linksInOp[i];
        if((link.portalFrom.id === theLink.from.guid && link.portalTo.id === theLink.to.guid) ||
        (link.portalTo.id === theLink.from.guid && link.portalFrom.id === theLink.to.guid)) {
            return true;
        }
    }
    return false;
};

window.plugin.jais.arrayContains = function(theArray, obj){
    for (var i = theArray.length - 1; i > -1; i--) {
        if (theArray[i] === obj) {
            return true;
        }
    }
    return false;
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

window.plugin.jais.findClosestPortalInObject = function(latlng, portals) {
    var testpoint = map.project(latlng);
    var minDistSquared = undefined;
    var minGuid = undefined;
    for (var guid in portals) {
        var p = portals[guid];
        var distSquared = (testpoint.x-p.x)*(testpoint.x-p.x) + (testpoint.y-p.y)*(testpoint.y-p.y);
        if (minDistSquared === undefined || minDistSquared > distSquared) {
        minDistSquared = distSquared;
        minGuid = guid;
        }
    }
    return minGuid ? window.portals[minGuid] : undefined;
};

window.plugin.jais.findClosestPortalInArray = function(latlng, portals) {
    var testpoint = map.project(latlng);
    var minDistSquared = undefined;
    var closestPortal = undefined
    debugger;
    for (var p = 0; p < portals.length; p++) {
        var portal = portals[p];
        var point = map.project(portal.getLatLng());
        var distSquared = (testpoint.x-point.x)*(testpoint.x-point.x) + (testpoint.y-point.y)*(testpoint.y-point.y);
        if (minDistSquared === undefined || minDistSquared > distSquared) {
        minDistSquared = distSquared;
        closestPortal = portal
        }
    }
    return closestPortal ? closestPortal : undefined;
};

window.plugin.jais.getRelevantPortalInfo = function(portal) {
    return {
        "guid": portal.options.guid,
        "location": {
            "lat": portal._latlng.lat,
            "lng": portal._latlng.lng
        },
        "name": portal.options.data.title,
        "intellink": 'https://www.ingress.com/intel?ll='+portal._latlng.lat+','+portal._latlng.lng+'&z=17&pll='+portal._latlng.lat+','+portal._latlng.lng
    };

};

window.plugin.jais.orderSort = function(a, b) {
    return a.order - b.order;
};