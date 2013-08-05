define(function (require) {
    var activity = require("sugar-web/activity/activity");

    require("Markdown.Converter");
    //require("Markdown.Sanitizer");
    require("Markdown.Editor");


    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();

        inputTextContent = document.getElementById("wmd-input-second");

        //to save and resume the contents from datastore.

        var datastoreObject = activity.getDatastoreObject();
        
        console.log(datastoreObject);
        console.log(datastoreObject);

        inputTextContent.onblur = function () {
            console.log(inputTextContent.value);
            var jsonData = JSON.stringify((inputTextContent.value).toString());
            datastoreObject.setDataAsText(jsonData);
            datastoreObject.save(function () {});
        };

        
            markdownParsing();

        datastoreObject.loadAsText(function (error, metadata, data) {
            console.log(metadata);
            //console.log(data);
            markdowntext = JSON.parse(data);

            //console.log(markdowntext);

            inputTextContent.value = markdowntext;
            markdownParsing();

            //markdownParsing();//it has to parse only after the input text box has been loaded
        });
        
        function markdownParsing()
        {
            var converter2 = new Markdown.Converter();
            var help = function () {
            alert("Do you need help?");
            }
            var options = {
            helpButton: {
                handler: help
            },
            strings: {
                quoteexample: "whatever you're quoting, put it right here"
            }
        };
        var editor2 = new Markdown.Editor(converter2, "-second", options);

        editor2.run();

        }
        
        

        

        

    });

});