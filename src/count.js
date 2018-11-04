/*-------------------------------------------------------------------------------------------*/
/*------------------------------------------- Count -----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

window.plugin.jais.countPortals = function() {
    var self = window.plugin.jais;
    if(self.checkForDrawTools()) {
        var portalsInPolygon = self.getPortalsFromPolygon(),
        portalStatistics = {
            fieldCount: self.getFieldCountFromPolygon(portalsInPolygon),
            linkCount: self.getLinkCountFromPolygon(portalsInPolygon),
            resoCount: [0, 0, 0],
            potentialAP: [0, 0],
            portalCount: [0, [], []],
            totalPerTeam: [0, 0, 0],
            total: portalsInPolygon.length,
        };
        for(var i = 0; i <= window.MAX_PORTAL_LEVEL; i++) {
            portalStatistics.portalCount[1][i] = 0;
            portalStatistics.portalCount[2][i] = 0;
        }
        for(var p = 0; p < portalsInPolygon.length; p++) {
            var team = portalsInPolygon[p].options.team,
            level = portalsInPolygon[p].options.level,
            resosOnPortal = portalsInPolygon[p].options.data.resCount;
            if(team !== 0) {
                portalStatistics.portalCount[team][level] += 1;
                portalStatistics.totalPerTeam[team] += 1;
                if(resosOnPortal) {
                    portalStatistics.resoCount[team] += resosOnPortal;
                }
            } else {
                portalStatistics.portalCount[0]++;
            }
        }
        var openResoSlots = (portalStatistics.portalCount[1] * 8) - portalStatistics.resoCount[1] + portalStatistics.resoCount[2];
        portalStatistics.potentialAP[0] = portalStatistics.resoCount[2] * self.RESO_SCORE
            + portalStatistics.fieldCount[2] * self.FIELD_SCORE + portalStatistics.linkCount[2] * self.LINK_SCORE;
        portalStatistics.potentialAP[1] = portalStatistics.resoCount[1] * self.RESO_SCORE
            + portalStatistics.fieldCount[1] * self.FIELD_SCORE + portalStatistics.linkCount[1] * self.LINK_SCORE;

        self.createCountDialog(portalStatistics);
    }
    else {
        return;
    }
};