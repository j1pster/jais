/*-------------------------------------------------------------------------------------------*/
/*------------------------------------------ Bookmarks --------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.bookMarkPortalsFromPolygon = function() {
    var self = window.plugin.jais;
    var html = "";
    if(window.plugin.bookmarks) {
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
    var self = window.plugin.jais;
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