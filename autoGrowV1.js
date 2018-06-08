(function () {
  freeboard.loadDatasourcePlugin({
    type_name: "autogrow_plugin",
    display_name: "Huxley",
    description : "Huxley - Autogrow plugin <strong>by Bug Labs!</strong>",
    settings: [
      {
        name: "uuid",
        display_name: "Device UUID",
        type: "text",
        default_value: "370889dd1590be048e9b99ab620941af",
        description : "Autogrow UUID",
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
      newInstanceCallback(new huxleyAgDatasource(settings, updateCallback));
    }
  });
  var huxleyAgDatasource = function (settings, updateCallback) {
    var self = this;
    var	currentSettings = settings;

    var getData = function () {
        $.ajax({
        type: "GET",
        url: "https://api.autogrow.com/multi/v0/" + currentSettings.uuid + "/site",
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
    };
  };
}());
