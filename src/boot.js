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
        '.textareadiv {display:none; padding: 0;} .textareadiv textarea {margin-bottom:5%; width: 100%; min-height: 80px;}' +
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
        '.jais-message-box {font-size: 15px; width: 80%; margin: 10px 0px; padding: 10px 10%; display: block;} .jais-hidden {display: none}' +
        '.jais-message-info {color: #00529B; background-color: #BDE5F8;} .jais-message-succes {color: #4F8A10;background-color: #DFF2BF;}' +
        '.jais-message-warning {color: #9F6000; background-color: #FEEFB3; } .jais-message-error {color: ##D8000C; background-color: #FF4D4D;}' +
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
