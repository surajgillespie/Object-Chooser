define(["webL10n",
        "sugar-web/activity/shortcut",
        "sugar-web/bus",
        "sugar-web/env",
        "sugar-web/datastore",
        "sugar-web/graphics/icon",
        "sugar-web/graphics/activitypalette"], function (
    l10n, shortcut, bus, env, datastore, icon, activitypalette) {

    var datastoreObject = null;

    var activity = {};

    activity.setup = function () {
        bus.listen();

        l10n.start();

        datastoreObject = new datastore.DatastoreObject();

        var activityButton = document.getElementById("activity-button");

        var activityPalette = new activitypalette.ActivityPalette(
            activityButton, datastoreObject);

        // Colorize the activity icon.
        activity.getXOColor(function (error, colors) {
            icon.colorize(activityButton, colors);
            invokerElem =
                document.querySelector("#activity-palette .palette-invoker");
            icon.colorize(invokerElem, colors);
        });

        // Make the activity stop with the stop button.
        var stopButton = document.getElementById("stop-button");
        stopButton.addEventListener('click', function (e) {
            activity.close();
        });

        shortcut.add("Ctrl", "Q", this.close);

        env.getEnvironment(function (error, environment) {
            datastoreObject.setMetadata({
                "activity": environment.bundleId,
                "activity_id": environment.activityId
            });
            datastoreObject.save(function () {
                datastoreObject.getMetadata(function (error, metadata) {
                    activityPalette.setTitleDescription(metadata);
                });
            });
        });

        var journal = document.getElementById("insertimage");
        
       journal.onclick = function () {
           activity.display_journal(function (error, result) {
               result1 = result.toString();
               var datastoreObject2 = new datastore.DatastoreObject(result1);
               datastoreObject2.loadAsText(function (error, metadata, data) {
                  var textdata = JSON.parse(data);
                  console.log(textdata);

                });

           });
        };
    }

    activity.getDatastoreObject = function () {
        return datastoreObject;
    };

    activity.getXOColor = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null, {
                    stroke: result[0][0],
                    fill: result[0][1]
                });
            } else {
                callback(null, {
                    stroke: "#00A0FF",
                    fill: "#8BFF7A"
                });
            }
        }

        bus.sendMessage("activity.get_xo_color", [], onResponseReceived);
    };

    activity.close = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null);
            } else {
                console.log("activity.close called");
            }
        }

        bus.sendMessage("activity.close", [], onResponseReceived);
    };

    activity.display_journal = function (callback) {
        function onResponseReceived(error, result) {
            if (error === null) {
                callback(null, result);
            } else {
                console.log("display_journal called");
            }
        }

        bus.sendMessage("datastore.display_journal", [], onResponseReceived);
    };

    return activity;
});
