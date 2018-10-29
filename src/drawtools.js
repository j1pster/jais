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