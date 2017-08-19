// ==UserScript==
// @name Just Another Intel Script Lite
// @namespace http://jips.website
// @version 0.42.52.20170815
// @description Does Something
// @updateURL      http://j1pster.github.io/jais/JaisLite.user.js
// @downloadURL    http://j1pster.github.io/jais/JaisLite.user.js
// @include        https://ingress.com/intel*
// @include        http://ingress.com/intel*
// @match          https://ingress.com/intel*
// @match          http://ingress.com/intel*
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @copyright      2017+ JL
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

/*-------------------------------------------------------------------------------------------*/
/*----------------------------------------- Start -------------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.boot = function() {
    $('#toolbox').append('<a onclick="window.plugin.jais.openJaisDialog()" title=>Jais</a>');
    window.plugin.jais.justAnotherPortalArray = [];
    window.plugin.jais.addEventListeners();
    window.plugin.jais.jsonOutput = {
        "portals": window.plugin.jais.justAnotherPortalArray
    };
    window.plugin.jais.drawToolsDataLoaded = false;
    window.plugin.jais.links = [];
    window.plugin.jais.link = {
        init: function(o, d, color, order) {
            this.from = Object.create(window.plugin.jais.portal);
            this.from.init(o);
            this.to = Object.create(window.plugin.jais.portal);
            this.to.init(d);
            this.order = order !== undefined ? order : window.plugin.jais.links.length;
            this.oLat = o.getLatLng().lat;
            this.oLng = o.getLatLng().lng;
            this.dLat = d.getLatLng().lat;
            this.dLng = d.getLatLng().lng;
            this.idx = 0; 
            this.color = color;
            this.layerCounter = 1;
        }, 
        initFromLocalStorage: function(link) {
            this.from = Object.create(window.plugin.jais.portal);
            this.from.initFromLocalStorage(link.from);
            this.to = Object.create(window.plugin.jais.portal);
            this.to.initFromLocalStorage(link.to);
            this.order = link.order;
            this.oLat = link.oLat;
            this.oLng = link.oLng;
            this.dLat = link.dLat;
            this.dLng = link.dLng;
            this.idx = link.idx;
            this.color = link.color;
            this.layerCounter = link.layerCounter;
        },
        swapLink: function() {
            var temp = this.from;
            this.from = this.to;
            this.to = temp;
        }
    };
    window.plugin.jais.portal = {
        init: function(portal) {
            this.guid = portal.options.guid;
            this.title = portal.options.data.title;
            this.image = portal.options.data.image;
            this.latlng = portal.getLatLng();
        },
        initFromLocalStorage: function(portal) {
            this.guid = portal.guid;
            this.title = portal.title;
            this.image = portal.image;
            this.latlng = portal.latlng;
        },
        getLatLng: function() {
            return {lat: this.latlng.lat, lng: this.latlng.lng};
        }
    };
    $('head').append('<style>' +
        '.ui-dialog-jais-export textarea { width:96%; height:150px; resize:vertical; }'+
        '.ui-dialog-jais-export.optionBox a {display: block; width: 80%; margin: 10px auto; text-align: center; background-color: rgba(27, 50, 64, 0.9); padding: 3px;}'+
        '#textareadiv {display:none; padding: 0;} #textareadiv textarea {margin-bottom:5%;}' +
        '.jais-button {width: 45%; height: 40px; text-align: center; margin: 2.5%;}' +
        '.jais-button2 {width: 31%; height: 40px; text-align: center; margin: 1.15%}' +
        '.portal-count-box {display: block; width: 95%; margin:5px auto;}'+
        'table.portal-counts {margin-top:5px; border-collapse: collapse; empty-cells: show; width: 100%; clear: both;}'+
        '.portal-count-box tr {width:95%; margin:0 auto;}'+
        '.portal-count-box td, th{text-align:center; color:white; vertical-align:middle; border-bottom: 1px solid #0b314e; padding: 3px;}'+
        '.portal-counts td input[type=\"number\"] {width: 66px;} .portalName {margin-top: 5px; width: 150px; height: 25px; overflow:hidden; white-space: nowrap; text-overflow: ellipsis;}' +
        '.tableWrapper {max-height: 300px; overflow: auto;}' +
        'td .deleteButton {min-width: 25px; height: 25px; background-repeat: no-repeat; background-size: 19px; border: none; background-position: 3px 3px; margin-left: 8px; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAASFBMVEUAAAD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgD/zgCmumIqAAAAF3RSTlMA4ijmJSL66RMKnoE1h9ubljERCIg5N1HUlncAAADCSURBVDjLfdNLDsIwDEXRlwbyadLSD+D975RCVT1iS/HMOncWB79JNUNNficuUxB3a31wEsq1jCKiisHLMQ86C/pVTCIs6OcUIAVhoV1CQhVRxeGcin1uCuUuA3fXFI37AVBFjMpNoZxFz1lYZ9F1FtZZ+H+PxjHEJuDLmfexb0u3hXVbWO/chy2sR28K9b53p4rsGtf3kVH79/HCFnr3ERJQevfx/K4LXRfjuS50FvRjShCn72OWMHHd1gw1+3p+/w+X6C/xVVv7WAAAAABJRU5ErkJggg==\')}' + 
        'td .swapButton {min-width: 25px; height: 25px; background-repeat: no-repeat; background-size: 19px; border: none; background-position: 3px 3px; margin-left: 8px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNBRkNFNDc1N0YzQTExRTc5QkFGRkE2NDU4RDMyMEE1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNBRkNFNDc2N0YzQTExRTc5QkFGRkE2NDU4RDMyMEE1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0FGQ0U0NzM3RjNBMTFFNzlCQUZGQTY0NThEMzIwQTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0FGQ0U0NzQ3RjNBMTFFNzlCQUZGQTY0NThEMzIwQTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz47EZP0AAABNUlEQVR42mL8//8/w0ACJoYBBqMOYGE4zzgaBbgAGxBHUcGOKKhZJDtgAhDbUMEBNlCzSHJAMhBnUjGkM6FmEuUACyCeRoPongY1Gy0XoAJJIF6DFGfsQCxIocXsSGkKZLYpED+HSTL+P4eS6PYDsRWNE/4xIHYE4l/oUTCFDpYzQO2YjJ4GUqGYXiANiFNgUWAJpA/gy6s0AqAocAA54AyQYTxABeFZUBTkwRLEAIRAHhM0VeYMgANAdh6DJcLZUEwvALdvwMsBZAfASsLTQCwN5c8D4hIKLewB4iQo+xkQmyCXhOhFMUgiFClb/gTi9xQ64CdSogtBthxXZXQciLNpEPTZULPxVkYwMAcaVNQCM6FmktQgAZUPR6lg+VGoWVgBeiIceY1SxtGu2agDBtoBAAEGAG7yQdhjkxD6AAAAAElFTkSuQmCC);}' + 
        'td.resistance {background-color: #0088FF;}'+
        'td.enlightened {background-color: #03DC03;}'+
        'th.tableHeader {font-size: 15px; padding: 20px;}' +
        '</style>');
};

window.plugin.jais.addEventListeners = function() {
    var self = window.plugin.jais;
    window.addHook('mapDataRefreshEnd', function() {
        if(!self.drawToolsDataLoaded) {
            window.addHook('pluginDrawTools', self.drawToolsHandler);
            if(window.plugin.drawTools) {
                window.plugin.jais.load();
                map.on('draw:deleted', function(e) {
                    window.plugin.drawTools.save();
                    runHooks('pluginDrawTools', {event:'layersDeleted', layers: e.layers});
                });
            }
        }
    });
};

/*-------------------------------------------------------------------------------------------*/
/*----------------------------------------- Dialogs -----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.openJaisDialog = function() {
    var html = '<p>Welcome to Jais, this plugin is mainly so you can do stuff with portals inside a polygon.' +
    'As such, you\'ll need the drawTools plugin. The plugin will use every polygon.<p>';
    if(window.plugin.drawTools) {
        if(Object.keys(window.plugin.drawTools.drawnItems._layers).length === 0) {
            html += '<p>No polygons have been detected. Please use the drawTools plugin to draw a polygon around the portals you want to use.</p>';
        } else {
            html += '<p>Please use the buttons to select what you want to do with the portals inside the polygon</p>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.countPortals();\' role=\'button\'>Count</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.exportPortalsFromPolygon();\' role=\'button\'>Export</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.bookMarkPortalsFromPolygon();\' role=\'button\'>Bookmark</button>';
            if(window.plugin.reswue) {
                html += '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.addPortalsToCurrentReswueOp();\' role=\'button\'>Add to Reswue</button>';
            }
            html += '<div id=\'textareadiv\' class=\'ui-dialog-content\'><textarea readonly onclick="$(\'#textareadiv textarea\').select();">'+ JSON.stringify(window.plugin.jais.justAnotherPortalArray) +'</textarea>' + 
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick="$(\'#textareadiv textarea\').focus().select();" role=\'button\'>Select All</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.clearPortals();\' role=\'button\'>Clear</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.closeTextArea();\' role=\'button\'>Close</button>' + 
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.exportPortalsInPolygon();\' role=\'button\'>Export to CSV</button></div>';
        }
        if(window.plugin.jais.links.lenght !== 0) {
            html += '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.linkDialog();\' role=\'button\'>Create Linkplan</button>';
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

window.plugin.jais.createCountDialog = function(thePortals, portalArray, linkCount, fieldCount, portalCount, resoCount, potentialAP) {
    var html = '<div class=\'portal-count-box\'><table class=\'portal-counts\'><tbody><tr><th colspan=\'3\'>' + thePortals.length + ' Portals.</th></tr>'+
    '<tr><th></th><th class=\'resistance\'>Resistance</th><th class=\'enlightened\'>Enlightened</th></tr>';
    for(var level2 = window.MAX_PORTAL_LEVEL; level2 > 0; level2--) {
        html += '<tr> <td class=\'L'+level2+'\' style=\'background-color: '+ COLORS_LVL[level2] +';\'>Level '+ level2 + '</td>';
        if(getMinPortalLevel() > level2) {
            html += '<td colspan=\'2\'>Zoom in to see portals in this level</td>';
        } else {
            html += '<td class=\'resistance\'>'+portalArray[1][level2]+'</td><td class=\'enlightened\'>'+portalArray[2][level2]+'</td>';
        }
        html += '</tr>';
    }
    html += '<tr><td>Links:</td><td class=\'resistance\'>'+linkCount[1]+'</td><td class=\'enlightened\'>'+linkCount[2]+'</td></tr>'+
            '<tr><td>Fields:</td><td class=\'resistance\'>'+fieldCount[1]+'</td><td class=\'enlightened\'>'+fieldCount[2]+'</td></tr>'+
            '<tr><td>Total Portals:</td><td class=\'resistance\'>'+portalCount[1]+'</td><td class=\'enlightened\'>'+portalCount[2]+'</td></tr>'+
            '<tr><td>Total Resonators: </td><td class=\'resistance\'>'+resoCount[1]+'</td><td class=\'enlightened\'>'+resoCount[2]+'</td></tr>'+
            '<tr><td>AP from destroying: </td><td class=\'resistance\'>'+potentialAP[1]+'</td><td class=\'enlightened\'>'+potentialAP[0]+'</td></tr>'+
            '<tr><td>Neutral Portals: </td><td colspan=\'2\'>'+portalCount[0]+'</td></tr>';
    dialog({
        html: html,
        width: 450,
        dialogClass: 'ui-dialog-jais-count',
        title: 'Portal count within all polygons'
    });
};

window.plugin.jais.linkDialog = function() {
    self = window.plugin.jais;
    var html = "<div id=\'linkplanner\'><p>Build your own linkplan.</p>";
    if(self.links.length === 0) {
        html += "<p id=\'nolinks\'>You don't appear to have any links in your plan. To add links, simply use the drawtools plugin and draw triangles or single links. they will appear in this dialog</p>";
    } else {
        html += "<button type=\'button\' id=\'saveLinks\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.saveLinkOrder();\' role=\'button\'>Save</button>" +
        "<button type=\'button\' id=\'clearLinks\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.clearLinks();\' role=\'button\'>Clear</button>";
        html += "<div id=\'tableWrapper\'><div id=\'linkAnchor\'>" + self.linkHTML() + "</div><div id=\'portalAnchor\'>" + self.portalsInPlan() + "</div></div>"; 
    }
    html += "<button id=\'linksToReswue\' class=\'jais-button2 ui-dialog-buttonset\' onClick=\'window.plugin.jais.addLinksToCurrentReswueOp();\' role=\'button\'>Add to Reswue</button>" + 
    "<button id=\'exportToCsv\' class=\'jais-button2 ui-dialog-buttonset\' onClick=\'window.plugin.jais.exportLinksToCSV(); \' role=\'button\'>Export to CSV</button>" + 
    "<button class=\'jais-button2 ui-dialog-buttonset\' onClick=\'window.plugin.jais.exportPortalsInPlan();\' role=\'button\'>Export Portals</button></div>";
    dialog({
        html: html,
        width: 500,
        dialogClass: 'ui-dialog-jais-links',
        title: 'Linkplan Builder'
    });
};

window.plugin.jais.linkHTML = function() {
    var html = "<table id=\'linkTable\' class=\'portal-counts\'><tbody><tr><th class=\'tableHeader\' colspan=\'5\'>Links</th></tr>" +
    "<tr><th>order</th><th>from</th><th>to</th><th>delete</th><th>swap</th></tr>";
    for(var i = 0; i < window.plugin.jais.links.length; i++) {
        var link = window.plugin.jais.links[i];
        link.idx = i;
        html += "<tr id=\'link" + i + "\' class=\'link\'><td width=\'15%\' class=\'input\'><input type=\'number\' min=\'0\' data-idx=\'" + i + "\' value=\'" + link.order +
        "\'></td><td><div class=\'portalName\'><a onClick=\'renderPortalDetails(\"" + link.from.guid + "\");\'>" + link.from.title + "</a></div></td>" +
        "<td><div class=\'portalName\'><a onClick=\'renderPortalDetails(\""+ link.to.guid + "\");\'>" + link.to.title + "</a></div></td>" +
        "<td><button class=\'deleteButton\' onclick=\'window.plugin.jais.deleteLink(" + i + ");\' role=\'button\'></button></td>" +
        "<td><button class=\'swapButton\' onclick=\'window.plugin.jais.swapLink(" + i + ");\' role=\'button\'></button></td></tr>";
    }
    html += "</tbody></table>";
    return html;
};

window.plugin.jais.portalHTML = function(portals) {
    var html = "<table id=\'portalTable\' class=\'portal-counts\'><tbody><tr><th class=\'tableHeader\' colspan=\'5\'>Portals</th></tr>" +
    "<tr><tr><th>title</th><th>Outgoing Links</th><th>Keys Needed</th><th>lat</th><th>lng</th></tr>";
    for(var key in portals) {
        var currentPortal = portals[key];
        html += "<tr id=\'portal_" + currentPortal.guid + "\' class=\'portal\'>" + 
        "<td><div class=\'portalName\'><a onClick=\'renderPortalDetails(\'" + currentPortal.guid + "\');\'>" + currentPortal.title + "</a></div></td>" + 
        "<td><div class=\'amount\'>" + currentPortal.outgoingLinks + "</div></td>" + 
        "<td><div class=\'amount\'>" + currentPortal.keysNeeded + "</div></td>" + 
        "<td><div class=\'coords\'>" + currentPortal.lat + "</div></td>" + 
        "<td><div class=\'coords\'>" + currentPortal.lng + "</div></td></tr>";
    }
    html += "</tbody></table>";
    return html;
}

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

window.plugin.jais.orderSort = function(a, b) {
    return a.order - b.order;
};

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
        return minGuid ? window.portals[minGuid] : undefined;
    };

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
        var cp = findClosestPortal(latlngs[ll]);
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
            linkCheck[1].layerCounter++;
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
                linkCheck[1].layerCounter++;
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

/*-------------------------------------------------------------------------------------------*/
/*------------------------------------------- Count -----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.countPortals = function() {
    var self = window.plugin.jais;
    if(self.checkForDrawTools()) {
        var thePortals = self.getPortalsFromPolygon(),
        fieldCount = self.getFieldsFromPolygon(thePortals),
        linkCount = self.getLinksFromPolygon(thePortals),
        portalArray = [0, [], []],
        portalCount = [0, 0, 0],
        resoCount = [0, 0, 0];
        for(var i = 0; i <= window.MAX_PORTAL_LEVEL; i++) {
            portalArray[1][i] = 0;
            portalArray[2][i] = 0;
        }
        for(var thePortal = 0; thePortal < thePortals.length; thePortal++) {
            var team = thePortals[thePortal].options.team;
            var level = thePortals[thePortal].options.level,
            resCount = thePortals[thePortal].options.data.resCount;
            if(team !== 0) {
                portalArray[team][level]++;
                portalCount[team]++;
                if(resCount) {
                    resoCount[team] += resCount;
                }
            } else {
                portalCount[0]++;
            }
        }
        var openResoSlots = (portalCount[1] * 8) - resoCount[1] + resoCount[2];
        var potentialAP = [0, 0];
        potentialAP[0] = resoCount[2] * self.RESO_SCORE + fieldCount[2] * self.FIELD_SCORE + linkCount[2] * self.LINK_SCORE;
        potentialAP[1] = resoCount[1] * self.RESO_SCORE + fieldCount[1] * self.FIELD_SCORE + linkCount[1] * self.LINK_SCORE;

        self.createCountDialog(thePortals, portalArray, linkCount, fieldCount, portalCount, resoCount, potentialAP);
    }
    else {
        return;
    }
};

/*-------------------------------------------------------------------------------------------*/
/*------------------------------------------- Export ----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.clearPortals = function() {
    window.plugin.jais.justAnotherPortalArray = [];
    $(".ui-dialog-jais-export textarea").val(JSON.stringify(window.plugin.jais.justAnotherPortalArray));
    return;
};

window.plugin.jais.exportPortalsFromPolygon = function() {
    $('#textareadiv').show();
    var self = window.plugin.jais;
    if(self.checkForDrawTools()) {
        var thePortals = self.getPortalsFromPolygon();
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

window.plugin.jais.exportLinksToCSV = function() {
    var self = window.plugin.jais;
    var headers = {
        column1: "From Portal",
        column2: "Intel link from Portal",
        column3: "To Portal",
        column4: "Intel link to Portal",
        column5: "Link order"
    };
    var formattedData = self.links.map(function(obj) {
        var rObj = {};
        rObj.column1 = obj.from.title.replace(/,/g, '');
        rObj.column2 = "\"https://www.ingress.com/intel?ll=" + obj.oLat + "," + obj.oLng + "&pll=" + obj.oLat + "," + obj.oLng + "\"";
        rObj.column3 = obj.to.title.replace(/,/g, '');
        rObj.column4 = "\"https://www.ingress.com/intel?ll=" + obj.dLat + "," + obj.dLng + "&pll=" + obj.dLat + "," + obj.dLng + "\"";
        rObj.column5 = obj.order;
        return rObj;
    });
    var filename = window.prompt("Please enter a name for your CSV file: ", "LinkplanExport");
    self.buildCSV(headers, formattedData, filename);
};

window.plugin.jais.exportPortalsInPlan = function() {
    var self = window.plugin.jais;
    var headers = {
        column1: "Name",
        column2: "Keys Needed", 
        column3: "Outgoing Links",
        colmun4: "Latitude",
        colmun5: "Longitude",
        column6: "Intel link", 
        colmun7: "GUID"
    }
    var formattedData = [];
    for(var key in self.thePortalsInPlan) {
        var currentPortal = self.thePortalsInPlan[key];
        var rObj = {
            column1: currentPortal.title.replace(/,/g, ""),
            column2: currentPortal.keysNeeded,
            column3: currentPortal.outgoingLinks,
            column4: currentPortal.lat,
            column5: currentPortal.lng,
            column6: "\"https://www.ingress.com/intel?ll=" + currentPortal.lat + "," + currentPortal.lng + "&pll=" + currentPortal.lat + "," + currentPortal.lng + "\"",
            column7: currentPortal.guid
        }
        formattedData.push(rObj);
    }
    var filename = window.prompt("Please enter a name for your CSV file: ", "PortalExport");
    self.buildCSV(headers, formattedData, filename);
}

window.plugin.jais.exportPortalsInPolygon = function() {
    var self = window.plugin.jais;
    var headers = {
        column1: "Name", 
        column2: "Latitude", 
        column3: "Longituge",
        column4: "Intel link",
        column5: "GUID"
    }
    var formattedData = self.justAnotherPortalArray.map(function(obj) {
        return {
            column1: obj.name.replace(/,/g, ''),
            column2: obj.location.lat,
            column3: obj.location.lng,
            column4: "\"" + obj.intellink + "\"",
            column5: obj.guid
        }
    });
    var filename = window.prompt("Please enter a name for your CSV file: ", "PortalExport");
    self.buildCSV(headers, formattedData, filename);
}

window.plugin.jais.buildCSV = function(headers, data, filename) {
    data.unshift(headers);
    var jsonData = JSON.stringify(data);
    var str = "";
    for(var i = 0; i < data.length; i++) {
        var line = "";
        for(var index in data[i]) {
            if(line !== "") line += ","
            
            line += data[i][index];
        }
        str += line + '\r\n';
    }
    filename += ".csv";
    var blob = new Blob([str], {type: 'text/csv;charset=utf-8;' });
    if(navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if(link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};

/*-------------------------------------------------------------------------------------------*/
/*------------------------------------------ Bookmarks --------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.bookMarkPortalsFromPolygon = function() {
    var self = window.plugin.jais;
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
                window.plugin.bookmarks.addPortalBookmark(thePortal.options.guid, ll.lat+','+ll.lng, thePortal.options.data.title);
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
        + "<p>" + alreadyBkmrkd + " " + portalOrPortals2 + " were already bookmarked.</p>";
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
        for(var j = 0; j < Object.keys(bkmrkFolder).length; j++) {
            var bkmrkdPortal = bkmrkFolder[Object.keys(bkmrkFolder)[j]];
            if(portal.options.guid === bkmrkdPortal.guid) {
                return false;
            }
        }
    }
    return true;
};

/*-------------------------------------------------------------------------------------------*/
/*----------------------------------- Get stuff from polygon --------------------------------*/
/*-------------------------------------------------------------------------------------------*/

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
        var obj = window.plugin.drawTools.drawnItems._layers;
        var drawnItem = window.plugin.drawTools.drawnItems._layers[Object.keys(obj)[i]];
        drawItemArray = [];

        for(var drawings = 0; drawings < drawnItem._latlngs.length; drawings++) {
            drawItemArray.push([drawnItem._latlngs[drawings].lat, drawnItem._latlngs[drawings].lng]);
        }
        for(var thePortals = 0; thePortals < Object.keys(window.portals).length; thePortals++) {
            var thePortal = window.portals[Object.keys(window.portals)[thePortals]];
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

/*-------------------------------------------------------------------------------------------*/
/*------------------------------------------- ResWue ----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

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

window.plugin.jais.addLinksToCurrentReswueOp = function() {
    if(window.plugin.reswue.core.selectedOperation !== undefined) {
        var self = window.plugin.jais;
        self.selectedOperation = window.plugin.reswue.core.selectedOperation.data.operationName;
        self.currentLayer = window.plugin.reswue.layerManager.activeLayer;
        self.linkOrLinks = self.links.length == 1 ? "Link" : "Links";
        if(self.selectedOperation && self.currentLayer) {
            if(confirm("Are you sure you want to add " + self.links.length + " " + self.linkOrLinks + " to layer \"" + self.currentLayer + "\" in operation " + self.selectedOperation + "?")) {
                Promise.all([window.plugin.reswue.core.selectedOperation.portalService.getPortals(), 
                window.plugin.reswue.core.selectedOperation.linkService.getLinks()]).then(function(values) {
                    self.portalsAlreadyInOp = values[0];
                    self.linksAlreadyInOp = values[1];
                    var length = self.links.length;
                    var linksInPlan = [];
                    for(var i = 0; i < length; i++) {
                        var currentLink = self.links[i];
                        linksInPlan.push(currentLink);
                        if(!self.linkAlreadyInOp(self.linksAlreadyInOp, currentLink)) {
                            Promise.all([
                                self.portalAlreadyInOp(self.portalsAlreadyInOp, currentLink.from) || self.portalAlreadyInPlan(linksInPlan, currentLink.from, currentLink) ? currentLink : window.plugin.reswue.core.selectedOperation.portalService.addPortal(currentLink.from.guid, currentLink.from.title, self.currentLayer, currentLink.from.latlng.lat, currentLink.from.latlng.lng, false, window.plugin.reswue.localConfig.nickname, "").then(function(response) {
                                    self.portalsAlreadyInOp = response;
                                }), 
                                self.portalAlreadyInOp(self.portalsAlreadyInOp, currentLink.to) || self.portalAlreadyInPlan(linksInPlan, currentLink.to, currentLink) ? currentLink : window.plugin.reswue.core.selectedOperation.portalService.addPortal(currentLink.to.guid, currentLink.to.title, self.currentLayer, currentLink.to.latlng.lat, currentLink.to.latlng.lng, false, window.plugin.reswue.localConfig.nickname, "").then(function(response) {
                                    self.portalsAlreadyInOp = response;
                                }),
                                currentLink
                            ]).then(function(results) {
                                var currentLink = results[2];
                                window.plugin.reswue.core.selectedOperation.linkService.addLink(currentLink.from.guid, currentLink.to.guid, self.currentLayer, false, window.plugin.reswue.localConfig.nickname, currentLink.order + "");
                            });
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

/*-------------------------------------------------------------------------------------------*/
/*------------------------------------ Drawtools integration --------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.drawToolsHandler = function(e) {
    var self = window.plugin.jais;
    console.log(e);
    if(e.event === "layerCreated") {
        self.layerCreatedHandler(e);
    }else if(e.event === "layersDeleted" && e.layers) {
        self.layerDeletedHandler(e.layers.getLayers());
    }
};

window.plugin.jais.layerCreatedHandler = function(e) {
    var self = window.plugin.jais;
    var layer = e.layer;
    self.convertLayerToLinks(layer);
    window.plugin.jais.save();
};

window.plugin.jais.layerDeletedHandler = function(layers) {
    console.log("Jais: Deleted drawtools layers: ", layers);
    var self = window.plugin.jais,
    length = layers.length;
    for(var i = 0; i < length; i++) {
        var layer = layers[i];
        var linksLength = self.links.length;
        for(var j = linksLength -1 ; j >= 0; j--) {
            var currentLink = self.links[j];
            if(currentLink.layerCounter > 1) {
                currentLink.layerCounter--;
            } else {
                self.links.splice(j, 1);
            }
        }
    }
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
