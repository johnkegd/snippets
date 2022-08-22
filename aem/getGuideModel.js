(function() {
    const viewName = "guideView";
    var guideModel;
    var guideJqueryContext = getGuideJqueryContext();
    var guideFieldNode = getGuideFieldNode();
    var guideView = xfalib.$ ? xfalib.$(guideFieldNode).data(viewName) : $(guideFieldNode).data(viewName);

    if (guideView) {
        window.guideModel = guideView._model;
        window.guideView = guideView;
        console.log("Type guideModel in console to manipulate the guide :", window.guideModel);
        console.log("Current component value: ", window.guideModel.value);
    } else {
        console.debug("not guideView found in current $0 selector target: ", $0);
    }

    function getGuideJqueryContext() {
        if (xfalib.$) {
            return xfalib.$;
        } else {
            return $;
        }
    }

    function getGuideFieldNode() {
        return $0.classList.contains("guideFieldNode") ? $0 : getParentElement();
    }

    function getParentElement() {
        var parentsUntilGuideField = $($0).parentsUntil(".guidefield");
        return parentsUntilGuideField[parentsUntilGuideField.length - 1];
    }

}());
