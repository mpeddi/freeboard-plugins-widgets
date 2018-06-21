/* 
    For version 1 of OpenXC Social Template, we use this datasource simply to store the
    master's phone number, to which alerts are sent.  For future versions, we will 
    uncomment the commented lines to enable communication TO the dashboard from the 
    master's phone.
*/
  
(function () {
	var phoneDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;

		function onNewDweet(dweet) {
			updateCallback(dweet);
		}

		this.updateNow = function () {
// 			dweetio.get_latest_dweet_for(currentSettings.thing_id, function (err, dweet) {
// 				if (err) {
// 					onNewDweet({});
// 				}
// 				else {
// 					onNewDweet(dweet[0].content);
// 				}
// 			});
		}

		this.onDispose = function () {

		}

		this.onSettingsChanged = function (newSettings) {
// 			dweetio.stop_listening();

			currentSettings = newSettings;
            
            if (currentSettings.phone_numer && currentSettings.phone_number !== "") {
//              dweetio.listen_for(currentSettings.phone_number, function (dweet) {
//                  onNewDweet(dweet.content);
//              });
			}
		}

		self.onSettingsChanged(settings);
	};

	freeboard.loadDatasourcePlugin({
		"type_name": "phone",
		"display_name": "Phone Datasource",
		"external_scripts": [
			//"https://dweet.io/client/dweet.io.min.js"
		],
		"settings": [
			{
				name: "phone_number",
				display_name: "Phone Number",
				"description": "please include country code and remove all symbols e.g. 12223334444",
				type: "text"
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new phoneDatasource(settings, updateCallback));
		}
	});
}());
