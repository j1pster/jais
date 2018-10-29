/*-------------------------------------------------------------------------------------------*/
/*-------------------------------------- homogeneous Fields ----------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.getHomogeneousFieldData = function() {
    var self = window.plugin.jais;
    if(window.confirm("This action will overwrite any drawtools that you have on your screen right now. Are you ok with this? ")) {
        var xhr = new XMLHttpRequest();
        var user = document.getElementById('loginuser').value;
        var password = document.getElementById('loginpassword').value;
        var data = self.gethomogeneousJson(user, password);

        xhr.open('POST', 'https://fields.schoentoon.com/homogeneous', true);
        xhr.setRequestHeader('Content-type', 'text/plain');

        xhr.onreadystatechange = function() {
            if(this.readyState == XMLHttpRequest.DONE) {
                if(this.status == 200) {
                    window.plugin.jais.processHomogeneousData(this.responseText);
                    window.plugin.jais.setHomogeneousMessage('succes', 'Succes, your homogeneous field should now be visible on the map. You can copy the drawtools data below')
                    window.plugin.jais.openHomogeneousExport(this.responseText);
                } else if (this.status == 400) {
                    window.plugin.jais.setHomogeneousMessage('error', this.responseText);
                } else if (this.status == 401) {
                    window.plugin.jais.setHomogeneousMessage('error', 'invalid password');
                }
            }
        }
        xhr.send(JSON.stringify(data));
    }
}

window.plugin.jais.gethomogeneousJson = function(user, password) {
    var self = window.plugin.jais,
    fielddepth = parseInt(document.getElementById('fielddepth').value),
    drawnItem = window.plugin.drawTools.drawnItems.getLayers()[0],
    allPortals = self.getPortalsFromPolygon(),
    portal1 = self.findClosestPortalInArray(drawnItem.getLatLngs()[0], allPortals),
    portal2 = self.findClosestPortalInArray(drawnItem.getLatLngs()[1], allPortals),
    portal3 = self.findClosestPortalInArray(drawnItem.getLatLngs()[2], allPortals),
    portalArray = [];

    for(var i = 0; i < allPortals.length; i++) {
        portalArray.push(self.getRelevantPortalInfo(allPortals[i]));
    }

    return {
        "user": user,
        "password": password,
        "depth": fielddepth,
        "begin": [
            portal1.options.guid, portal2.options.guid, portal3.options.guid
        ],
        "db": portalArray,
    }
}

window.plugin.jais.processHomogeneousData = function(response) {
    try {
        var data = JSON.parse(response);
        window.plugin.drawTools.drawnItems.clearLayers();
        window.plugin.drawTools.import(data);
        console.log('DRAWTOOLS: reset and imported drawn tiems');
        // to write back the data to localStorage
        window.plugin.drawTools.save();
    } catch(e) {
        console.warn('DRAWTOOLS: failed to import data: '+e);
        window.plugin.drawTools.optAlert('<span style="color: #f88">Import failed</span>');
    }
}

window.plugin.jais.setHomogeneousMessage = function(type, message) {
    var box = document.querySelector('#jais-homogeneous-message');
    box.className = "jais-message-box jais-message-" + type;
    box.innerText = message;
}

window.plugin.jais.hideHomogeneousMessage = function() {
    var box = document.querySelector('#jais-homogeneous-message');
    box.classList.add('jais-hidden');
}

window.plugin.jais.openHomogeneousExport = function (text) {
    var exportDiv = document.getElementById("homogeneous-text-div");
    var textArea = document.getElementById("homogeneous-textarea");

    exportDiv.style.display = "block";
    textArea.value = text;
}