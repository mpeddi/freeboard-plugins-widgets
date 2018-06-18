(function () {
    freeboard.addStyle('.added-header', "background: #CFCCCB;");
    freeboard.addStyle('.tweetButton', "position:absolute; right:0; bottom:0");
    var twitterWidget = function (settings) {
        var self = this;
        var currentSettings = settings;
        var stateObject = {};
        var currRowElements = [];
        var init = true;

        function tweetTableData(TimeOnOff) {
            var dataString = "?text=Check+out+my+live+sensor+data:+" + TimeOnOff;
            dataString = dataString.concat('&url=' + window.location.href + '&via=buglabs');
            if (dataString.length > 140) {
                freeboard.showDialog($("<div>Alert: Too much data to Tweet! Please remove one or more sensors from the widget configuration</div>"), "Error", "OK", null, function () { });
            } else {
                window.open('http://twitter.com/intent/tweet' + dataString);
            }
        }

        this.render = function (element) {
            var tweetButton = $('<button class="tweetButton" style="margin-right:60px;color:black" id="tweet">!   Program the Time Switch   !</button>');
            var myTime1 = $('<input class="myTime1" type="time" style="margin-left:5px;width:50px;hight:10px"; name="TimeOn" id="time3"></input type="submit">');
            var myTime2 = $('<input class="myTime2" type="time" style="margin-left:5px;width:50px;hight:10px"; name="TimeOff" id="time2"></input type="submit">');
            var myText1 = $('<text class="myText1" style="margin-left:5px;" >Turn ON:  </input type="submit">');
            var myText2 = $('<text class="myText2" style="margin-left:5px;" >Turn OFF:  </input type="submit">');
            var SendString = "AT^MTXTUNNEL=SETPARAM,OUTPUT_config2,";
            $(element).append(myText1).append(myTime1).append(myText2).append(myTime2).append(tweetButton).on('click', '#tweet', function () { tweetTableData(SendString + String(time3.value).replace(":", ";") + ";" + String(time2.value).replace(":", ";")) });
        }  

        //this.onSettingsChanged = function (newSettings) {
        //    currentSettings = newSettings;
        //    titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
        //    clearTable();

        //    var re = /\["?(.+?)"?\]/g;
        //    var regexArray = new Array();
        //    var elementArray = new Array();
        //    while ((matches = re.exec(currentSettings["value"])) != null) {
        //        regexArray.push(matches[1]);
        //    }
        //    for (var x = 0; x < regexArray.length; x++) {
        //        elementArray.push(regexArray[x + 1]);
        //        x++;
        //    }
        //    initTable(elementArray);

        //}

        //this.onCalculatedValueChanged = function (settingName, newValue) {
        //    stateObject[settingName] = newValue;
        //    updateTableValues();
        //}

        //this.onDispose = function () {
        //}

        //this.getHeight = function () {
        //    //             if (currentSettings["height"] && currentSettings["height"] !== 0) {
        //    //                 return currentSettings["height"];
        //    //             } else {
        //    // 			    var height = Math.ceil(stateElement.height() / 50);
        //    //                 //height = 3;
        //    // 			    return (height > 0 ? height : 3);
        //    // 			}
        //    return 3;
        //}

        //this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "heroku_time",
        display_name: "Heroku_Time",
        //         external_scripts : [
        //          "plugins/thirdparty/jquery.tablescroll.js",
        //          "plugins/thirdparty/jquery.timeago.js"
        //          ],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
			{
			    name: "value",
			    display_name: "Value",
			    type: "calculated",
			    multi_input: "true"
			}
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new twitterWidget(settings));
        }
    });
}());
