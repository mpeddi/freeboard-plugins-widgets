(function () {
  freeboard.loadDatasourcePlugin({
    type_name: "automatic_datasource_plugin",
    display_name: "Automatic",
		description: "Use automatic to keep track of your car's data!",
    settings: [
      {
        name: "verified_automatic_code",
        display_name: "Automatic Code",
        type: "text",
        description: "After getting redirected from <a href="+"https://accounts.automatic.com/oauth/authorize/?client_id=561011688577bac49576&response_type=code&scope=scope:trip%20scope:behavior%20scope:user:profile%20scope:location%20scope:vehicle:events"+" target='_blank'>here</a> copy the text after 'code='.",
      },
      {
        name: "refresh",
        display_name: "Refresh Every",
        type: "number",
        suffix: "seconds",
        default_value: 30
      }
    ],
    newInstance: function (settings, newInstanceCallback, updateCallback) {
      newInstanceCallback(new automaticDatasource(settings, updateCallback));
    }
  });

  var automaticDatasource = function (settings, updateCallback) {
    var self = this,
        refreshTimer,
        currentSettings = settings;

		function getToken(){
			$.ajax({
				url: `https://cors-anywhere.herokuapp.com/https://accounts.automatic.com/oauth/access_token`,
				type:"POST",
				data: {
					"client_id": "561011688577bac49576",
					"client_secret": "8b5b651f944a7bc274fa193d40b3a7a8810cfed3",
					"code": currentSettings.verified_automatic_code,
					"grant_type": "authorization_code"
				},
				success: function (data) {
					currentSettings.refresh_token = data.refresh_token;
					currentSettings.access_token = data.access_token;
					currentSettings.expire_time = (Date.now() + data.expires_in);
					queryAPI();
				}
			});
		}

		function refreshToken(){
			$.ajax({
				url: `https://accounts.automatic.com/oauth/access_token`,
				type:"POST",
				data: {
					"client_id": "561011688577bac49576",
					"client_secret": "8b5b651f944a7bc274fa193d40b3a7a8810cfed3",
					"refresh_token": currentSettings.refresh_token,
					"grant_type": "refresh_token"
				},
				success: function (data) {
					currentSettings.refresh_token = data.refresh_token;
					currentSettings.access_token = data.access_token;
					currentSettings.expire_time = (Date.now() + data.expires_in);
					queryAPI();
				}
			});
		}

		function formatReturnedData(automaticDataObject){
			automaticDataObject = automaticDataObject.results[0];
			formattedData = {
				"Distance (miles)" : (automaticDataObject.distance_m * 0.00062).toFixed(2),
				"Avg MPG" : (automaticDataObject.average_kmpl * 2.35).toFixed(2),
				"Fuel Cost (USD)" : automaticDataObject.fuel_cost_usd,
				"Fuel Volume (GAL)" : (automaticDataObject.fuel_volume_l * 0.265).toFixed(2),
				"Event Count" : {},
				"Duration (seconds)" : automaticDataObject.duration_s,
				"Time Idle (seconds)" : automaticDataObject.idling_time_s,
				"Fraction City" : automaticDataObject.city_fraction,
				"Fraction Highway" : automaticDataObject.highway_fraction,
				"Fraction Night Driving" : automaticDataObject.night_driving_fraction,
				"Start Address" : automaticDataObject.start_address.name,
				"End Address" : automaticDataObject.end_address.name,
				"Trip Start Time" : new Date(automaticDataObject.started_at).toLocaleString(),
				"Trip End Time" : new Date(automaticDataObject.ended_at).toLocaleString(),
				"Start Timezone" : automaticDataObject.start_timezone,
				"End Timezone" : automaticDataObject.end_timezone,
				"ID" : automaticDataObject.id,
				"Tags" : automaticDataObject.tags.join(" "),
				"URL" : automaticDataObject.url
			}
			var carEvents = automaticDataObject.vehicle_events;
			var formattedEvents = formattedData["Event Count"];
			for (i = 0; i < carEvents.length; i++){
				if (formattedEvents[carEvents[i].type] === undefined){
					formattedEvents[carEvents[i].type] = 1;
				}else{
					formattedEvents[carEvents[i].type] += 1;
				}
			}
			return formattedData;
		}

    function getData () {

			if (currentSettings.access_token === undefined){
				getToken();
			}else if (Date.now() >= currentSettings.expire_time){
				refreshToken();
			} else {
				queryAPI();
			}
    }

		function queryAPI(){
			$.ajax({
				url: "https://api.automatic.com/trip/",
				data: {
					limit: 1
				},
				type:"GET",
				success: function (data) {
					updateCallback(formatReturnedData(data));
				},
				error: function (xhr, status, error) {
				},
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization','Bearer ' + currentSettings.access_token);
				}
			});
		}

    function createRefreshTimer (interval) {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }

      refreshTimer = setInterval(function () {
        getData();
      }, interval);
    }

    createRefreshTimer(currentSettings.refresh * 1000);

    self.onSettingsChanged = function (newSettings) {
      currentSettings = newSettings;
    };

    self.updateNow = function () {
      getData();
    };

    self.onDispose = function () {
      clearInterval(refreshTimer);
      refreshTimer = undefined;
    };

  };
}());
