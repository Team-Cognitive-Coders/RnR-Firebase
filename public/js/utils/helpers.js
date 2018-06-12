(function () {
    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });

    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('showButtons', function (val, options) {
        var iShowCustombutton = false;
        jQuery.each(val, function (index, obj) {
            if (obj.active) {
                iShowCustombutton = true;
            }
        })

        var fnTrue = options.fn, fnFalse = options.inverse;
        return iShowCustombutton ? fnTrue(this) : fnFalse(this);
    });
})();