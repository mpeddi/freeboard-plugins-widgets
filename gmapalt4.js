(function () {

// Define the overlay, derived from google.maps.OverlayView
function Label(opt_options) {
 // Initialization
 this.setValues(opt_options);
var span = this.span_ = document.createElement('span');
 span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
                      'white-space: nowrap; border: none; ' +
                      'padding: 2px; background-color: transparent; color:blue;';

 var div = this.div_ = document.createElement('div');
 div.appendChild(span);
 div.style.cssText = 'position: absolute; display: none';
};


 var gmapColors = ["#FF9900", "#B3B4B4", "#6B6B6B", "#28DE28", "#13F7F9", "#E6EE18", "#C41204", "#CA3CB8", "#0B1CFB"];
 freeboard.addStyle(".sub-section-height-5","height: 300px;");
 freeboard.addStyle(".sub-section-height-6","height: 360px;");

 var googleMapAltWidget = function (settings) {
        var self = this;
        var currentSettings = settings;
        var map;
        var currentPosition = {};

        this.render = function (element) {
            function initializeMap() {
                var mapOptions = {
                    disableDefaultUI: true,
                    draggable: true,
                    styles: [
                    {
                    "featureType": "all",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "gamma": 0.26
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": -50
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#e8efcf"
                }
            ]
        },
        {
            "featureType": "landscape.natural.landcover",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.government",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.medical",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.place_of_worship",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.school",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "poi.sports_complex",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#d1e5d1"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#efefef"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 40
                },
                {
                    "hue": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#dcb4b4"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#dcb4b4"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 15
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#bbe0ed"
                }
            ]
        }

                    ]
                };

                map = new google.maps.Map(element, mapOptions);

                Label.prototype = new google.maps.OverlayView;
              }

            if (window.google && window.google.maps) {
                initializeMap();
            }
            else {
                window.gmap_initialize = initializeMap;
                head.js("https://maps.googleapis.com/maps/api/js?v=3.exp&scale=2&callback=gmap_initialize");
            }
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            var substr = settingName.split('_');
            var idx = substr[1];
            var setting = substr[0];

            if (setting == "latitude") {
                currentPositions[idx]["latitude"] = newValue;
            }
            else if (setting == "longitude") {
                currentPositions[idx]["longitude"] = newValue;
            }
            postUpdateCounts[idx-1]++;

            if(postUpdateCounts[idx-1] >= 2)
            {
                postUpdateCounts[idx-1] = 0;
                updatePosition(idx);
            }
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return 5;
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "google_map_alt",
        display_name: "Google Map Alternate - test",
        fill_size: true,
        settings: [
            {
                name: "latitude_1",
                display_name: "Latitude 1",
                type: "calculated"
            },
            {
                name: "longitude_1",
                display_name: "Longitude 1",
                type: "calculated"
            },
            {
                "name": "drawPath",
                "display_name": "Draw Path(s)",
                "type": "boolean"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new googleMapAltWidget(settings));
        }
    });


}());
