/*-------------------------------------------------------------------------------------------*/
/*----------------------------------- Get stuff from polygon --------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.getFieldCountFromPolygon = function(thePortals) {
    var self = window.plugin.jais,
    fieldCount = [0, 0, 0],
    fieldArray = [];
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

window.plugin.jais.getLinkCountFromPolygon = function(portals) {
    var self = window.plugin.jais,
    linkCount = [0, 0, 0],
    linkArray = [];
    for(var linkKey in window.links) {
        var currentLink = window.links[linkKey];
        for(var i = 0; i < portals.length; i++) {
            var currentPortal = portals[i];
            if(!self.arrayContains(linkArray, currentLink)) {
                if(currentPortal.options.guid == currentLink.options.ent[2][2]
                || currentPortal.options.guid == currentLink.options.ent[2][5]) {
                    linkArray.push(currentLink);
                    linkCount[currentLink.options.team] += 1;
                }
            }
        }
    }
    return linkCount;
};

window.plugin.jais.inside = function(point, vs) {
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

window.plugin.jais.portalOnCorner = function(latLng, cornerData) {
    for(var d = 0; d < cornerData.length; d++) {
        if(latLng[0] == cornerData[d][0] && latLng[1] == cornerData[d][1]) {
            return true;
        }
    }
    return false;
}

window.plugin.jais.getPortalsFromPolygon = function() {
    var self = window.plugin.jais;
    var portalArray = [],
    layers = window.plugin.drawTools.drawnItems.getLayers();
    for (var i = 0; i < layers.length; i++) {
        var drawnItem = layers[i],
        cornerDataArray = [];
        for(var points = 0; points < drawnItem._latlngs.length; points++) {
            cornerDataArray.push([drawnItem.getLatLngs()[points].lat, drawnItem.getLatLngs()[points].lng]);
        }

        for(var portalKey in window.portals) {
            var currentPortal = window.portals[portalKey];
            var latLng = [currentPortal.getLatLng().lat, currentPortal.getLatLng().lng];
            if(self.inside(latLng, cornerDataArray) || self.portalOnCorner(latLng, cornerDataArray)) {
                portalArray.push(currentPortal);
            }
        }
    }
    return portalArray;
};