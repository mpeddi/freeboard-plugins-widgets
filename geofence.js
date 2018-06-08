var runMaps = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                zoom: 18
            });
            google.maps.event.addListener(map, 'click', function(event) {
                placeMarker(event.latLng);
                console.log(event.latLng.toUrlValue(5));
            });

            function placeMarker(location) {
                var marker = new google.maps.Marker({
                    position: location,
                    map: map
                });

            }
            var all_overlays = [];
            var selectedShape;
            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        //google.maps.drawing.OverlayType.MARKER,
                        google.maps.drawing.OverlayType.CIRCLE,
                        google.maps.drawing.OverlayType.POLYGON,
                        google.maps.drawing.OverlayType.RECTANGLE
                    ]
                },
                markerOptions: {
                    icon: 'images/beachflag.png'
                },
                circleOptions: {
                    fillColor: '#ffff00',
                    fillOpacity: 0.2,
                    strokeWeight: 3,
                    clickable: false,
                    editable: true,
                    zIndex: 1
                },
                polygonOptions: {
                    clickable: true,
                    draggable: true,
                    editable: true,
                    fillColor: '#ffff00',
                    fillOpacity: 1,

                },
                rectangleOptions: {
                    clickable: true,
                    draggable: true,
                    editable: true,
                    fillColor: '#ffff00',
                    fillOpacity: 0.5,
                }
            });

            function clearSelection() {
                if (selectedShape) {
                    selectedShape.setEditable(false);
                    selectedShape = null;
                }
            }

            function setSelection(shape) {
                clearSelection();
                selectedShape = shape;
                shape.setEditable(true);
                // google.maps.event.addListener(selectedShape.getPath(), 'insert_at', getPolygonCoords(shape));
                // google.maps.event.addListener(selectedShape.getPath(), 'set_at', getPolygonCoords(shape));
            }

            function deleteSelectedShape() {
                if (selectedShape) {
                    selectedShape.setMap(null);
                }
            }

            function deleteAllShape() {
                for (var i = 0; i < all_overlays.length; i++) {
                    all_overlays[i].overlay.setMap(null);
                }
                all_overlays = [];
            }

            function CenterControl(controlDiv, map) {

                // Set CSS for the control border.
                var controlUI = document.createElement('div');
                controlUI.style.backgroundColor = '#fff';
                controlUI.style.border = '2px solid #fff';
                controlUI.style.borderRadius = '3px';
                controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                controlUI.style.cursor = 'pointer';
                controlUI.style.marginBottom = '22px';
                controlUI.style.textAlign = 'center';
                controlUI.title = 'Select to delete the shape';
                controlDiv.appendChild(controlUI);

                // Set CSS for the control interior.
                var controlText = document.createElement('div');
                controlText.style.color = 'rgb(25,25,25)';
                controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
                controlText.style.fontSize = '16px';
                controlText.style.lineHeight = '38px';
                controlText.style.paddingLeft = '5px';
                controlText.style.paddingRight = '5px';
                controlText.innerHTML = 'Delete Selected Area';
                controlUI.appendChild(controlText);

                // Setup the click event listeners: simply set the map to Chicago.
                controlUI.addEventListener('click', function() {
                    deleteSelectedShape();
                });

            }
            drawingManager.setMap(map);
            var getPolygonCoords = function(newShape) {
                console.log("We are one");
                var len = newShape.getPath().getLength();
                for (var i = 0; i < len; i++) {
                    console.log(newShape.getPath().getAt(i).toUrlValue(6));
                }
            };

            google.maps.event.addListener(drawingManager, 'polygoncomplete', function(event) {

                event.getPath().getLength();
                google.maps.event.addListener(event.getPath(), 'insert_at', function() {
                    var len = event.getPath().getLength();
                    for (var i = 0; i < len; i++) {
                        console.log(event.getPath().getAt(i).toUrlValue(5));
                    }
                });
                google.maps.event.addListener(event.getPath(), 'set_at', function() {
                    var len = event.getPath().getLength();
                    for (var i = 0; i < len; i++) {
                        console.log(event.getPath().getAt(i).toUrlValue(5));
                    }
                });
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {

                all_overlays.push(event);
                if (event.type !== google.maps.drawing.OverlayType.MARKER) {
                    drawingManager.setDrawingMode(null);
                    //Write code to select the newly selected object.

                    var newShape = event.overlay;
                    newShape.type = event.type;
                    google.maps.event.addListener(newShape, 'click', function() {
                        setSelection(newShape);
                    });

                    setSelection(newShape);
                }
            });


            var centerControlDiv = document.createElement('div');
            var centerControl = new CenterControl(centerControlDiv, map);

            centerControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
        });
    }
};
