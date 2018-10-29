/*-------------------------------------------------------------------------------------------*/
/*------------------------------------------- Export ----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/
window.plugin.jais.selectPortalExport = function() {
    var textarea = document.getElementById('export-portals-textarea');
    textarea.focus();
    textarea.select();
}

window.plugin.jais.clearPortals = function() {
    window.plugin.jais.justAnotherPortalArray = [];
    document.getElementById('export-portals-textarea').value = JSON.stringify(window.plugin.jais.justAnotherPortalArray)
    return;
};

window.plugin.jais.exportPortalsFromPolygon = function() {
    document.getElementById('export-text-div').style.display = "block";
    var self = window.plugin.jais;
    if(self.checkForDrawTools()) {
        var thePortals = self.getPortalsFromPolygon();
        for(var i = 0; i < thePortals.length; i++){
            var currentPortal = self.getRelevantPortalInfo(thePortals[i]);
            window.plugin.jais.justAnotherPortalArray.push(currentPortal);
        }
        document.getElementById('export-portals-textarea').value = JSON.stringify(window.plugin.jais.justAnotherPortalArray)
    }
    return;
};

window.plugin.jais.closeTextArea = function() {
    document.getElementById('export-text-div').style.display = "none";
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