(function () {
    var guideView;
    var guideModel;
    if (xfalib.$) {
        guideView = xfalib.$($0).data("guideView");
    } else {
        guideView = $($0).data("guideView");
    }

    if (guideView) {
        guideModel = guideView._model;
        window.guideModelTarget = guideModel;
        console.log(guideModel);
    } else {
        console.debug("not guideView found in current $0 selector target: ", $0);
    }

}());
