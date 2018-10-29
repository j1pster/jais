/*-------------------------------------------------------------------------------------------*/
/*----------------------------------------- Dialogs -----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.openJaisDialog = function() {
    var html = '<p>Welcome to Jais, this plugin is mainly so you can do stuff with portals inside a polygon.' +
    'As such, you\'ll need the drawTools plugin. The plugin will use every polygon.<p>';
    if(window.plugin.drawTools) {
        var layers = window.plugin.drawTools.drawnItems.getLayers();
        if(layers.length == 0) {
            html += '<p>No polygons have been detected. Please use the drawTools plugin to draw a polygon around the portals you want to count, bookmark or export.</p>';
        } else {
            html += '<p>Please use the buttons to select what you want to do with the portals inside the polygon</p>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.countPortals();\' role=\'button\'>Count</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.exportPortalsFromPolygon();\' role=\'button\'>Export</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.bookMarkPortalsFromPolygon();\' role=\'button\'>Bookmark</button>';
            if(layers[0].getLatLngs().length == 3) {
                html += '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.createHomogenousFieldDialog();\' role=\'button\'>Homogenous fields</button>';
            }
            if(window.plugin.reswue) {
                html += '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.addPortalsToCurrentReswueOp();\' role=\'button\'>Add to Reswue</button>';
            }
            html += '<div id=\'export-text-div\' class=\'ui-dialog-content textareadiv\'><textarea id=\'export-portals-textarea\' readonly onclick="this.select();">'+ JSON.stringify(window.plugin.jais.justAnotherPortalArray) +'</textarea>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick="window.plugin.jais.selectPortalExport()" role=\'button\'>Select All</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.clearPortals();\' role=\'button\'>Clear</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.closeTextArea();\' role=\'button\'>Close</button>' +
            '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.exportPortalsInPolygon();\' role=\'button\'>Export to CSV</button></div>';
        }
        if(window.plugin.jais.links.length !== 0) {
            html += '<button type=\'button\' class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.linkDialog();\' role=\'button\'>Create Linkplan</button>';
        } else {
            html+= '<p>You can also draw a linkplan and export it directly. To do this, just start drawing triangles or links using drawtools. They will be added to the linkplan in the order you draw them automatically. Don\'t worry, you can change that later on.</p>';
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

window.plugin.jais.createCountDialog = function(statistics) {
    var html = '<div class=\'portal-count-box\'><table class=\'portal-counts\'><tbody><tr><th colspan=\'3\'>' + statistics.total + ' Portals.</th></tr>'+
    '<tr><th></th><th class=\'resistance\'>Resistance</th><th class=\'enlightened\'>Enlightened</th></tr>';
    for(var level = window.MAX_PORTAL_LEVEL; level > 0; level--) {
        html += '<tr> <td class=\'L'+level+'\' style=\'background-color: '+ COLORS_LVL[level] +';\'>Level '+ level + '</td>';
        if(getMinPortalLevel() > level) {
            html += '<td colspan=\'2\'>Zoom in to see portals in this level</td>';
        } else {
            html += '<td class=\'resistance\'>'+statistics.portalCount[1][level]+'</td><td class=\'enlightened\'>'+statistics.portalCount[2][level]+'</td>';
        }
        html += '</tr>';
    }
    html += '<tr><td>Links:</td><td class=\'resistance\'>'+statistics.linkCount[1]+'</td><td class=\'enlightened\'>'+statistics.linkCount[2]+'</td></tr>'+
            '<tr><td>Fields:</td><td class=\'resistance\'>'+statistics.fieldCount[1]+'</td><td class=\'enlightened\'>'+statistics.fieldCount[2]+'</td></tr>'+
            '<tr><td>Total Portals:</td><td class=\'resistance\'>'+statistics.totalPerTeam[1]+'</td><td class=\'enlightened\'>'+statistics.totalPerTeam[2]+'</td></tr>'+
            '<tr><td>Total Resonators: </td><td class=\'resistance\'>'+statistics.resoCount[1]+'</td><td class=\'enlightened\'>'+statistics.resoCount[2]+'</td></tr>'+
            '<tr><td>AP from destroying: </td><td class=\'resistance\'>'+statistics.potentialAP[1]+'</td><td class=\'enlightened\'>'+statistics.potentialAP[0]+'</td></tr>'+
            '<tr><td>Neutral Portals: </td><td colspan=\'2\'>'+statistics.portalCount[0]+'</td></tr>';
    dialog({
        html: html,
        width: 450,
        dialogClass: 'ui-dialog-jais-count',
        title: 'Portal count within all polygons'
    });
};

window.plugin.jais.linkDialog = function() {
    var self = window.plugin.jais;
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

window.plugin.jais.createHomogenousFieldDialog = function() {
    var html = "<div id=\'information\'><p>Create a homogeneous field plan, api courtesy of @Schoentoon</p></div>" +
    '<div id=\'jais-homogeneous-message\' class=\'jais-message-box jais-hidden\'></div>' +
    '<input id=\'fielddepth\' min=\'1\' max=\'7\' type=\'number\' placeholder=\'3\' value=\'3\'>' +
    '<input id=\'loginuser\' type=\'text\' placeholder=\'' + window.PLAYER.nickname + '\' value=\'' + window.PLAYER.nickname + '\'>' +
    '<input id=\'loginpassword\' type=\'password\' placeholder=\'password\' >' +
    '<button class=\'jais-button ui-dialog-buttonset\' onclick=\'window.plugin.jais.getHomogeneousFieldData()\' role=\'button\'>Generate</button>' +
    '<div id=\'homogeneous-text-div\' class=\'textareadiv jais-hidden\'><textarea id=\'homogeneous-textarea\' readonly onclick=\'this.select();\'></textarea></div>';
    dialog({
        html: html,
        width: 500,
        dialogClass: 'ui-dialog-jais-homogeneous',
        title: 'Generate Homogeneous field'
    });
}