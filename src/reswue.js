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