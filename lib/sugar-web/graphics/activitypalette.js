define(["sugar-web/graphics/palette",
        "sugar-web/env"], function (palette, env) {

    var activitypalette = {};

    activitypalette.ActivityPalette = function (activityButton,
        datastoreObject) {

        palette.Palette.call(this, activityButton);

        var activityTitle;
        var descriptionLabel;
        var descriptionBox;

        this.getPalette().id = "activity-palette";

        this.template =
            '<div class="row">' +
            '<input type="text" id="title" class="expand">' +
            '</div>' +
            '<div class="row small">' +
            '<label>Description:</label>' +
            '</div>' +
            '<div class="row expand">' +
            '<textarea rows="8" id="description" class="expand"></textarea>' +
            '</div>';

        var containerElem = document.createElement('div');
        containerElem.innerHTML = this.template;
        this.setContent([containerElem]);

        this.titleElem = containerElem.querySelector('#title');
        this.descriptionElem = containerElem.querySelector('#description');

        this.titleElem.onblur = function () {
            datastoreObject.setMetadata({
                "title": this.value
            });
            datastoreObject.save();
        };

        this.descriptionElem.onblur = function () {
            datastoreObject.setMetadata({
                "description": this.value
            });
            datastoreObject.save();
        };
    };

    // Fill the text inputs with the received metadata.
    var setTitleDescription = function (metadata) {
        var that = this;
        if (metadata.title === undefined) {
            env.getEnvironment(function (error, environment) {
                that.titleElem.value = environment.activityName;
            });
        } else {
            this.titleElem.value = metadata.title;
        }

        if (metadata.description !== undefined) {
            this.descriptionElem.value = metadata.description;
        }
    };

    activitypalette.ActivityPalette.prototype =
        Object.create(palette.Palette.prototype, {
        setTitleDescription: {
            value: setTitleDescription,
            enumerable: true,
            configurable: true,
            writable: true
        }
    });

    return activitypalette;
});
