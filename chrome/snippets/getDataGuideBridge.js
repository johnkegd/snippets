var guideResultObject;


(function () {
    var guideResultObject = {};

    var prettifyXml = function (sourceXml) {
        var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
        var xsltDoc = new DOMParser().parseFromString([
            // describes how we want to modify the XML - indent everything
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '  <xsl:strip-space elements="*"/>',
            '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
            '    <xsl:value-of select="normalize-space(.)"/>',
            '  </xsl:template>',
            '  <xsl:template match="node()|@*">',
            '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '  </xsl:template>',
            '  <xsl:output indent="yes"/>',
            '</xsl:stylesheet>',
        ].join('\n'), 'application/xml');

        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
        var resultXml = new XMLSerializer().serializeToString(resultDoc);
        return resultXml;
    };


    guideBridge.getDataXML({
        success: function (guideResultObject) {
            this.guideResultObject = guideResultObject.data;
            var xmlDoc = new DOMParser().parseFromString(this.guideResultObject, "application/xml");
            xmlDoc.documentElement.childNodes.forEach(function (children) { console.log(children) });
        },
        error: function (guideResultObject) {
            console.error("guideBridge API Failed");
            var msg = guideResultObject.getNextMessage();
            while (msg != null) {
                console.error(msg.message);
                msg = guideResultObject.getNextMessage();
            }
        }
    });

})();

