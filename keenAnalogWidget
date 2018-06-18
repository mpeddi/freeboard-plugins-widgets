(function () {
    freeboard.addStyle('.added-header', "background: #CFCCCB;");
    freeboard.addStyle('.tweetButton', "position:absolute; right:0; bottom:0");

    var twitterWidget = function (settings) {
        var self = this;
        var currentSettings = settings;
        var stateObject = {};
        var currRowElements = [];
        var init = true;
        var MyPojectId = currentSettings["TheProjectId"];//"569a6c2a46f9a75e6f2b3c3d";
        var MyReadKey = currentSettings["TheReadKey"];//"ecb489cd00f02b4070eb99fc7a808fc50081c1750877e6d6d0b76c87d4a0aaa175d6acb66d935a910a05cb909972feaca703364b1d93d2e28e0e952719645f2d5b53205cc6821a2aad22dde25e75b4f4e48761a53215ef73d0cb8570017bc896";
        var MyTimeSpan = currentSettings["size"];

        var client = new Keen({
            projectId: MyPojectId, // String (required always)
            readKey: MyReadKey // String (required for querying data)
        });

        Keen.ready(function () {
            // Create a query instance
            //var count = new Keen.Query("count", {
            //    eventCollection: "4712",
            //    timeframe: "this_7_days"
            //});

            var temperature = new Keen.Query("average", {
                eventCollection: "358884050099154",//4712
                targetProperty: "AD1",
                interval: "every_10_minutes",
                //timeframe: {
                //    start: "2016-01-22T00:00:00.000",
                //    end: "2016-01-23T00:00:00.000"
                //}
                timeframe: MyTimeSpan,//"this_7_days",  //"last_week"//"today"
                filters: [
                    {
                    "property_name": "AD1",
                    "operator": "ne",
                    "property_value": 0
                    }
                ]
            });

            // Send query
            client.run(temperature, function (err, response) {
                if (err) {
                    freeboard.showDialog($("<div>Alert: ERR data </div>"), "Error", "OK", null, function () { });
                }
                else {
                    //var tRet = "test";//String(response.result);
                    //freeboard.showDialog($("<div>Alert: OK data </div>"), tRet, "OK", null, function () { });

                    // Basic charting w/ `client.draw`:
                    //client.draw(count, document.getElementById("count-pageviews-metric"), {
                    //    chartType: "metric",
                    //    title: "Total Pageviews",
                    //    colors: ["#49c5b1"]
                    //});

                    freeboard.showDialog($("<div>Alert: OK data </div>"), String(temperature), "OK", null, function () { });

                        client.draw(temperature, document.getElementById("MyLinechart"), {
                            chartType: "linechart",
                            title: "Daily revenue (7 days)"
                        });
                }
            });
        });

        self.render = function (element) {
            //var chart = $('<div id="count-pageviews-metric"></div>');
            var chart2 = $('<div id="MyLinechart"></div>');
            $(element).append(chart2);
        }

        // **getHeight()** (required) : A public function we must implement that will be called when freeboard wants to know how big we expect to be when we render, and returns a height. This function will be called any time a user updates their settings (including the first time they create the widget).
        //
        // Note here that the height is not in pixels, but in blocks. A block in freeboard is currently defined as a rectangle that is fixed at 300 pixels wide and around 45 pixels multiplied by the value you return here.
        //
        // Blocks of different sizes may be supported in the future.
        self.getHeight = function () {
                return 3;
        }

        // **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
        self.onSettingsChanged = function (newSettings) {
            // Normally we'd update our text element with the value we defined in the user settings above (the_text), but there is a special case for settings that are of type **"calculated"** -- see below.
            currentSettings = newSettings;
        }

        // **onCalculatedValueChanged(settingName, newValue)** (required) : A public function we must implement that will be called when a calculated value changes. Since calculated values can change at any time (like when a datasource is updated) we handle them in a special callback function here.
        self.onCalculatedValueChanged = function (settingName, newValue) {
            // Remember we defined "the_text" up above in our settings.
            if (settingName == "TheProjectId") {
                // Here we do the actual update of the value that's displayed in on the screen.
                MyPojectId = newValue;
            }
            else if (settingName == "TheReadKey") {
                MyReadKey = newValue;
            }
            else if (settingName == "size") {
                MyTimeSpan = newValue;
            }
        }

        // **onDispose()** (required) : Same as with datasource plugins.
        self.onDispose = function () {
        }
    };

    freeboard.loadWidgetPlugin({
        type_name: "keen_analog1",
        display_name: "keen_Analog1",
                 external_scripts : [
                  "https://d26b395fwzu5fz.cloudfront.net/3.4.0-rc/keen.min.js"
                 ],
          "fill_size": false,
        settings: [
            {
                name: "TheProjectId",
                display_name: "Project ID",
                "type": "text"
            },
			{
			    name: "TheReadKey",
			    display_name: "Read Key",
			    "type": "text"
			},
			{
			    "name": "size",
			    "display_name": "Size",
			    "type": "option",
			    "options": [
					{
					    "name": "Regular",
					    "value": "this_7_days"
					},
					{
					    "name": "Big",
					    "value": "this_3_days"
					}
			    ]
			}
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new twitterWidget(settings));
        }
    });
}());
