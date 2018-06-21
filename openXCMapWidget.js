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
        var isInit = true;
        var currentSettings = settings;
        var map;
        var marker;
        var markers = [];
        var currentPosition = {};
        var currentPositions = {1:{"latitude":"","longitude":""},2:{"latitude":"","longitude":""},3:{"latitude":"","longitude":""}};
        var poly = [];
        var polys = [];
        var postUpdateCount = 0;
        var postUpdateCounts = [0,0,0];

        function addLatLngPoly(polyidx, position) {
            var path = polys[polyidx].getPath();
            path.push(position);
        }

        function updatePosition(idx) {
            
            if (map && markers[idx-1] && currentPositions[idx].latitude && currentPositions[idx].longitude) {
                var newLatLon = new google.maps.LatLng(currentPositions[idx].latitude, currentPositions[idx].longitude);
                markers[idx-1].setPosition(newLatLon);
                if(currentSettings.drawPath) addLatLngPoly(idx-1, newLatLon);
                if (idx==1 && isInit) {
                    map.panTo(newLatLon);
                    isInit = false;
                } else if (idx > 1){
                    window.checkUserProximity(idx-1);
                }
                
            }
        }

        this.render = function (element) {
            function initializeMap() {
                var mapOptions = {
                    zoom: 11,
                    //center: new google.maps.LatLng(40.786093, -73.962086),
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

                // Implement onAdd
                Label.prototype.onAdd = function() {
                 var pane = this.getPanes().overlayLayer;
                 pane.appendChild(this.div_);

                 // Ensures the label is redrawn if the text or position is changed.
                 var me = this;
                 this.listeners_ = [
                   google.maps.event.addListener(this, 'position_changed',
                       function() { me.draw(); }),
                   google.maps.event.addListener(this, 'text_changed',
                       function() { me.draw(); })
                 ];
                };

                // Implement onRemove
                Label.prototype.onRemove = function() {
                 this.div_.parentNode.removeChild(this.div_);

                 // Label is removed from the map, stop updating its position/text.
                 for (var i = 0, I = this.listeners_.length; i < I; ++i) {
                   google.maps.event.removeListener(this.listeners_[i]);
                 }
                };

                // Implement draw
                Label.prototype.draw = function() {
                     var projection = this.getProjection();
                     var position = projection.fromLatLngToDivPixel(this.get('position'));

                     var div = this.div_;
                     if (position !== null) {
                         div.style.left = position.x + 'px';
                         div.style.top = position.y + 'px';
                         div.style.display = 'block';
                        // this.span_.innerHTML = this.get('text').toString();
                        this.span_.innerHTML = this.title;
                    }

                };
                
                var carIcon = {
                    url: "https://www.dropbox.com/s/7hwt9ra284jf3bn/car_green.png?dl=1",
                    size: new google.maps.Size(25,25),
                    origin: new google.maps.Point(0,0),
                    anchor: new google.maps.Point(12,25),
                };
                
                var label1 = new Label({
                    map:map,
                    title:"Master"
                });
                var label2 = new Label({
                    map:map,
                    title:"Sub User1"
                });
                var label3 = new Label({
                    map:map,
                    title:"Sub User2"
                });
                var polyOptions_1 = {
                    strokeColor: '#FF9900',
                    strokeOpacity: 1.0,
                    strokeWeight: 5
                };

                var polyOptions_2 = {
                    strokeColor: '#FFFFFF',
                    strokeOpacity: 1.0,
                    strokeWeight: 5
                };

                var polyOptions_3 = {
                    strokeColor: '#B3B4B4',
                    strokeOpacity: 1.0,
                    strokeWeight: 5
                };

                polys.push(new google.maps.Polyline(polyOptions_1));
                polys.push(new google.maps.Polyline(polyOptions_2));
                polys.push(new google.maps.Polyline(polyOptions_3));
                polys[0].setMap(map);
                polys[1].setMap(map);
                polys[2].setMap(map);

                google.maps.event.addDomListener(element, 'mouseenter', function (e) {
                    e.cancelBubble = true;
                    if (!map.hover) {
                        map.hover = true;
                        map.setOptions({zoomControl: true});
                    }
                });

                google.maps.event.addDomListener(element, 'mouseleave', function (e) {
                    if (map.hover) {
                        map.setOptions({zoomControl: false});
                        map.hover = false;
                    }
                });
                markers.push(new google.maps.Marker({map: map, icon: carIcon, animation: google.maps.Animation.DROP}));
                markers.push(new google.maps.Marker({map: map, icon: carIcon, animation: google.maps.Animation.DROP}));
                markers.push(new google.maps.Marker({map: map, icon: carIcon, animation: google.maps.Animation.DROP}));
                label1.bindTo('position', markers[0], 'position');
                label1.bindTo('text', markers[0], 'position');
                label2.bindTo('position', markers[1], 'position');
                label2.bindTo('text', markers[1], 'position');
                label3.bindTo('position', markers[2], 'position');
                label3.bindTo('text', markers[2], 'position');
                updatePosition(1);
                updatePosition(2);
                updatePosition(3);
                setTimeout(function() {
                    google.maps.event.trigger(map, 'resize');
                    map.setZoom( map.getZoom() );
                    map.setCenter(map.getCenter());
                },10000);  
            }

            if (window.google && window.google.maps) {
                setTimeout(function() {
                    initializeMap();
                },5000);
            }
            else {
                setTimeout(function() {
                    window.gmap_initialize = initializeMap;
                    head.js("https://maps.googleapis.com/maps/api/js?v=3.exp&scale=2&callback=gmap_initialize");  
                },5000);
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
        display_name: "OpenXC Social Map",
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
                name: "latitude_2",
                display_name: "Latitude 2",
                type: "calculated"
            },
            {
                name: "longitude_2",
                display_name: "Longitude 2",
                type: "calculated"
            },
            {   
                name: "latitude_3",
                display_name: "Latitude 3",
                type: "calculated"
            },
            {
                name: "longitude_3",
                display_name: "Longitude 3",
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
