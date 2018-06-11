var googlesheetDatasource = function (settings, updateCallback) {
        var self = this;
        var currentSettings = settings;
        
        function convertToJSON(value) {
            var stArray = value.split(', ');
            var obj = {};
            for (var i in stArray) {
                var sig = stArray[i].split(": ");
                obj[sig[0]] = sig[1];
            }
            return obj;
        }

        this.updateNow = function () {
            var currUrl = "https://thingproxy.freeboard.io/fetch/https://spreadsheets.google.com/feeds/list/"+currentSettings.sheet_key+"/"+currentSettings.worksheet_id+"/public/basic?alt=json";
            $.ajax({
                url: currUrl,
                dataType: "JSON",
                success: function (data) {
                    data = data.feed.entry.map(entry => convertToJSON(entry["content"]["$t"]));
                    var obj = {};

                    Object.keys(data[0]).forEach(key => obj[key] = []);
                    data.forEach(entry => Object.keys(entry).forEach(key => obj[key].push(entry[key])));

                    updateCallback(obj);
                },
                error: function (xhr, status, error) {
                }
            });
        }

        this.onDispose = function () {
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            self.updateNow();
        }
    };

    freeboard.loadDatasourcePlugin({
        "type_name": "googlesheet",
        "display_name": "Google Sheet",
        "settings": [
            {
                "name": "sheet_key",
                "display_name": "Sheet Key",
                "type": "text",
                "default_value": "1tQUMopQ4jFXAEaJ_lMEJ45YnGrBB0iYwnawQJsYPh4o"
            },
            {
                "name":"worksheet_id",
                "display_name":"Worksheet ID",
                "type":"text",
                "default_value": "1",
                description: "The number of the worksheet, 1 corresponds to the first worksheet"
            }
        ],
        newInstance: function (settings, newInstanceCallback, updateCallback) {
            newInstanceCallback(new googlesheetDatasource(settings, updateCallback));
        }
    });
