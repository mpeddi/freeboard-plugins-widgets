(function () {
  freeboard.loadDatasourcePlugin({
    type_name: "lifx bulb",
    display_name: "LIFX Bulb",
    settings: [
      {
        name: "access_token",
        display_name: "Access Token",
        type: "text",
        description: "Your personal access token generated from <a href='https://cloud.lifx.com/settings' target='_blank'>here</a>.",
      },
      {
        name: "label",
        display_name: "Label (required)",
        type: "text",
        description: "The name of your bulb exactly as it appears in your LIFX app (case sensitive)"
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
      newInstanceCallback(new lifxDatasource(settings, updateCallback));
    }
  });

  var lifxDatasource = function (settings, updateCallback) {
    var self = this,
        refreshTimer,
        currentSettings = settings;

    function getData () {
      $.ajax({
        url: "https://api.lifx.com/v1/lights/label:" + currentSettings.label,
        dataType: "JSON",
        success: function (data) {
          // data is always returned as an array
          data = data[0];
          var colorInRgb = self.hsvToRgb(data.color.hue, data.color.saturation, data.brightness);

          var newData = {
            id: data.id,
            uuid: data.uuid,
            label: data.label,
            connected: data.connected,
            power: data.power === "on" ? true : false,
            hue: data.color.hue,
            saturation: data.color.saturation,
            kelvin: data.color.kelvin,
            brightness: data.brightness,
            color_html: self.getColorElement(colorInRgb),
            color_in_rgb: colorInRgb,
            group_id: data.group.id,
            group_name: data.group.name,
            location_id: data.location.id,
            location_name: data.location.name,
            product_name: data.product.name,
            product_identifier: data.product.identifier,
            company: data.product.company,
            has_color: data.product.capabilities.has_color,
            has_variable_color_temp: data.product.capabilities.has_variable_color_temp,
            last_seen: data.last_seen,
            seconds_since_seen: data.seconds_since_seen
          };

          if (newData.seconds_since_seen > (currentSettings.refresh * 2)) {
            newData.power = "off";
            newData.connected = false;
          }

          updateCallback(newData);
        },
        error: function (xhr, status, error) {
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa(currentSettings.access_token + ":"));
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

  lifxDatasource.prototype.hsvToRgb = function (h, s, v) {
  	var r, g, b;
  	var i;
  	var f, p, q, t;

  	if(s == 0) {
      // Achromatic (grey)
  		r = g = b = v;
  		return ("rgb(" + Math.round(r * 255) + ", " + Math.round(g * 255) + ", " + Math.round(b * 255) + ")");
  	}

  	h /= 60; // sector 0 to 5
  	i = Math.floor(h);
  	f = h - i;
  	p = v * (1 - s);
  	q = v * (1 - s * f);
  	t = v * (1 - s * (1 - f));

  	switch(i) {
  		case 0: r = v; g = t; b = p; break;
  		case 1: r = q; g = v; b = p; break;
  		case 2: r = p; g = v; b = t; break;
  		case 3: r = p; g = q; b = v; break;
  		case 4: r = t; g = p; b = v; break;
  		case 5: r = v; g = p; b = q; break;
  	}

  	return ("rgb(" + Math.round(r * 255) + ", " + Math.round(g * 255) + ", " + Math.round(b * 255) + ")");
  };

  lifxDatasource.prototype.getColorElement = function (color) {
    return ("<div style=\"background-color: " + color + "; height: 100%; width: 100%;\"></div>");
  };
}());
