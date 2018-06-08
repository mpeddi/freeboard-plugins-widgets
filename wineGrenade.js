(function () {
  freeboard.loadDatasourcePlugin({
    type_name: "wine_grenade_plugin",
    display_name: "Wine Grenade",
    description : "Wine Grenade - Azure plugin <strong>by Bug Labs!</strong>",
    settings: [
      {
        name: "device_id",
        display_name: "Device ID",
        type: "text",
        default_value: "340044000d47353136383631",
        description : "Particle.io Device ID",
      },
      {
        name: "refresh",
        display_name: "Refresh Every",
        type: "number",
        suffix: "seconds",
        default_value: 10
      }
    ],
    newInstance: function (settings, newInstanceCallback, updateCallback) {
      newInstanceCallback(new wineazureDatasource(settings, updateCallback));
    }
  });
  var wineazureDatasource = function (settings, updateCallback) {
    var self = this;
    var	currentSettings = settings;

    var getData = function () {
        $.ajax({
        type: "GET",
        url: "https://thingproxy.freeboard.io/fetch/https://wgapi2017v1.azurewebsites.net/api/HttpTriggerCSharp1?code=aHdeKyKTJzlfJQCEb87svIKBTh2shpagFa9V5UkNTBCx1EX3Dk/PnQ==&i=" + currentSettings.device_id,
          success: function (payload) {
          updateCallback(JSON.parse(payload));
        },
        error: function (xhr, status, error) {
        }
      });
    }

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
