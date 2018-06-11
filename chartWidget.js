(function(){

  	var chartWidget = function (settings) {
    	var self = this;
	    var currentSettings = settings;
     	self.coordinates = {};
     	self.data = [];
     	self.colors = [
        	'rgb(255, 99, 132)',
		    'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)'
        ];
	    
	    function getRandomColor() {
		    var letters = '0123456789ABCDEF';
		    var color = '#';
		    
		    for (var i = 0; i < 6; i++ ) {
		        color += letters[Math.floor(Math.random() * 16)];
		    }
		    
		    return color;
		}

		function getDatapoints() {
            if (currentSettings.values) { var datapoints = currentSettings.values.split(/\r?\n|\r/) }
            // If the datapoints are tuples, array-ify them
            if (datapoints[0].includes('\t')) { datapoints = datapoints.map(datapoint => datapoint.split(/\t/)) }
           	if (datapoints) { return datapoints }
		}

		function updateColors() {
			if (currentSettings.colors && currentSettings.colors.length > 0) {
				self.colors = currentSettings.colors.map(obj => obj.color)
			}

            while (self.data[0].length > self.colors.length) {
            	self.colors.push(getRandomColor());
            }
		}

		function getCounts(datapoints) {
			var counts = {};

		    datapoints.forEach((datapoint, index) => {
            	if (typeof datapoint === "string") {
            		if (counts[datapoint]) {
            			counts[datapoint]++;
            		} else {
            			counts[datapoint] = 1;
            		}
            	} else if (typeof datapoint === "object") { // Array
            		if (currentSettings.type === "scatter") {
	            		if (typeof datapoint[0] ==="string") {
	            			if (!counts[datapoint[0]]) {
	            				counts[datapoint[0]] = true;
	            			}
	            		}            			
            		}
            	}
            });

            return counts;
		}

		function getGeocode(placeName, resolve) {
			$.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}`, null, (payload) => {
				resolve([payload.results[0].geometry.location.lat, payload.results[0].geometry.location.lng, placeName]);
			});
		}

		function getId() {
			if (currentSettings.title) {
				// hyphenate title to use as id for element
	      		return (currentSettings.title.includes(" ") ? 
      			 		currentSettings.title.split(" ").join("-") : 
      					currentSettings.title);
	      	}

	      	return "";
		}

		function getChartElement(id) {
		    if (currentSettings.type === "heatmap") {
		    	return $(`<div style="height:18rem;" id=${id}></div>`);
		    } else {
			    return $(`<canvas id=${id}></canvas>`);
		    }
		}

		function renderHeatmap(counts, id) {
			//console.log(counts);
			var promises = Object.keys(counts[0]).map(placeName => {
        		return new Promise((resolve, reject) => {
        			getGeocode(placeName, resolve)
        		});
        	});

			const DUBLIN_COORDINATES = [53.3498053, -6.2603097];

        	Promise.all(promises).then(values => {
        		var map = new google.maps.Map(document.getElementById(id), {
				  center: new google.maps.LatLng(DUBLIN_COORDINATES[0], DUBLIN_COORDINATES[1]),
				  zoom: 2,
				  mapTypeId: 'roadmap',
				  styles: [
						{"featureType": "water", "elementType": "geometry", "stylers": [
							{"color": "#2a2a2a"}
						]},
						{"featureType": "landscape", "elementType": "geometry", "stylers": [
							{"color": "#000000"},
							{"lightness": 20}
						]},
						{"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [
							{"color": "#000000"},
							{"lightness": 17}
						]},
						{"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [
							{"color": "#000000"},
							{"lightness": 29},
							{"weight": 0.2}
						]},
						{"featureType": "road.arterial", "elementType": "geometry", "stylers": [
							{"color": "#000000"},
							{"lightness": 18}
						]},
						{"featureType": "road.local", "elementType": "geometry", "stylers": [
							{"color": "#000000"},
							{"lightness": 16}
						]},
						{"featureType": "poi", "elementType": "geometry", "stylers": [
							{"color": "#000000"},
							{"lightness": 21}
						]},
						{"elementType": "labels.text.stroke", "stylers": [
							{"visibility": "on"},
							{"color": "#000000"},
							{"lightness": 16}
						]},
						{"elementType": "labels.text.fill", "stylers": [
							{"saturation": 36},
							{"color": "#000000"},
							{"lightness": 40}
						]},
						{"elementType": "labels.icon", "stylers": [
							{"visibility": "off"}
						]},
						{"featureType": "transit", "elementType": "geometry", "stylers": [
							{"color": "#000000"},
							{"lightness": 19}
						]},
						{"featureType": "administrative", "elementType": "geometry.fill", "stylers": [
							{"color": "#000000"},
							{"lightness": 20}
						]},
						{"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [
							{"color": "#000000"},
							{"lightness": 17},
							{"weight": 1.2}
						]}
					]
				});
        		var data = values.map(value => { 
        			return {
        				location: new google.maps.LatLng(value[0], value[1]),
        				weight: counts[0][value[2]]
        			}
				});
				
				var heatmap = new google.maps.visualization.HeatmapLayer({
				  data: data
				});

				heatmap.setMap(map);
        	});
		}
		
	    self.render = function (element) {
	    	var id = getId();
	    	self.titleElement = $(`<h2 class="section-title">${currentSettings.title}</h2>`);
			self.chartElement = getChartElement(id);		    
	        $(element).append(self.titleElement).append(self.chartElement);

	    	var ctx = $(`#${id}`);
	        var options = {};
	        
	        var datapoints = self.data;
	        //console.log(datapoints);
	        if (datapoints.length > 0) {
	        	var counts = [];

	        	datapoints.forEach(dataset => counts.push(getCounts(dataset)));

		        if (currentSettings.type === "heatmap") {
		        	renderHeatmap(counts, id);
		        } else {
		            var legend;
		            var label = "";

		    		if (currentSettings.type === "scatter") {
		    			legend = Object.keys(counts[0]);

		    			datapoints = datapoints[0].map((datapoint, index) => {
		    				return { x: legend.indexOf(datapoints[0][index]) + 1, y: datapoints[1][index] }
		    			});

					    options = {
					        scales: {
					            xAxes: [{
					                type: 'linear',
					                position: 'bottom'
					            }]
					        },
					  //       tooltips: {
					  //       	custom: function(tooltip) {
							// 		// Tooltip Element
							// 		var tooltipEl = document.getElementById('chartjs-tooltip');
							// 		if (!tooltipEl) {
							// 			tooltipEl = document.createElement('div');
							// 			tooltipEl.id = 'chartjs-tooltip';
							// 			tooltipEl.innerHTML = "<table></table>"
							// 			document.body.appendChild(tooltipEl);
							// 		}
							// 		// Hide if no tooltip
							// 		if (tooltip.opacity === 0) {
							// 			tooltipEl.style.opacity = 0;
							// 			return;
							// 		}
							// 		// Set caret Position
							// 		tooltipEl.classList.remove('above', 'below', 'no-transform');
							// 		if (tooltip.yAlign) {
							// 			tooltipEl.classList.add(tooltip.yAlign);
							// 		} else {
							// 			tooltipEl.classList.add('no-transform');
							// 		}
							// 		function getBody(bodyItem) {
							// 			return bodyItem.lines;
							// 		}
							// 		// Set Text
							// 		if (tooltip.body) {
							// 			var titleLines = tooltip.title || [];
							// 			var bodyLines = tooltip.body.map(getBody);
							// 			var innerHtml = '<thead>';
							// 			titleLines.forEach(function(title) {
							// 				innerHtml += '<tr><th>' + title + '</th></tr>';
							// 			});
							// 			innerHtml += '</thead><tbody>';
							// 			bodyLines.forEach(function(body, i) {
							// 				var colors = tooltip.labelColors[i];
							// 				var style = 'background:' + colors.backgroundColor;
							// 				style += '; border-color:' + colors.borderColor;
							// 				style += '; border-width: 2px'; 
							// 				var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
							// 				body[0] = body[0].slice(body[0].lastIndexOf(":") + 2); // TODO: Don't hard code
							// 				innerHtml += '<tr><td>' + span + body + '</td></tr>';
							// 			});
							// 			innerHtml += '</tbody>';
							// 			var tableRoot = tooltipEl.querySelector('table');
							// 			tableRoot.innerHTML = innerHtml;
							// 		}
							// 		var position = this._chart.canvas.getBoundingClientRect();
							// 		// Display, position, and set styles for font
							// 		tooltipEl.style.opacity = 1;
							// 		tooltipEl.style.left = position.left + tooltip.caretX + 'px';
							// 		tooltipEl.style.top = position.top + tooltip.caretY + 'px';
							// 		tooltipEl.style.fontFamily = tooltip._fontFamily;
							// 		tooltipEl.style.fontSize = tooltip.fontSize;
							// 		tooltipEl.style.fontStyle = tooltip._fontStyle;
							// 		tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
							// 	}
							// },
					        showLines: false
					    };

					   	legend.forEach((item, idx) => {
					   		label += (idx + 1);
					   		label += (": " + item + " ");
					   	});
		    		}

	    			// Use user's color choices
					updateColors();

					if (currentSettings.type === "bar") {
		    			options = {
		    				legend: {
		    					display: false
		    				}
		    			};
					}

		    		var data;
		    		if (currentSettings.type !== "scatter") {
		    			var datasets = [];
		            	var labels = Object.keys(counts[0]);

		    			self.data.forEach((set, index) => {
		            		var datapoints = labels.map(label => counts[index][label]);
		    				
		    				datasets.push({
		    					data: datapoints,
		    					label: currentSettings["label_" + (index + 1)] || label,
		    					backgroundColor: self.colors
		    				});
		    			});


						data = {
						    labels: labels,
						    datasets: datasets
						};
		    		} else {
		    			data = {
		    				labels: labels,
		    				datasets: [
			    				{
			    					data: datapoints,
			    					label: currentSettings.label || label,
			    					pointBackgroundColor: "#fff"
			    				}
		    				]
		    			}
		    		}
			        
			        // Scatter charts need to have a type of 'line'
		        	var type = (currentSettings.type === "scatter" ? "line" : currentSettings.type);

			        if (!self.chart) {
				        self.chart = new Chart(ctx,{
						    type: type,
						    data: data,
						    options: options
						});	        	
			        } else {
			        	self.chart.destroy();
		    	       	self.chart = new Chart(ctx,{
						    type: type,
						    data: data,
						    options: options
						});	    
			        }
		        }
	        }
	        
	    }

	    self.onSettingsChanged = function (newSettings) {
	        currentSettings = newSettings;
	        self.render();
	    }

	    self.onCalculatedValueChanged = function (settingName, newValue) {
	    	if (settingName === "dataset_1") {
	    		self.data[0] = newValue;
	    	} else if (settingName === "dataset_2") {
	    		self.data[1] = newValue;
	    	} else if (settingName === "dataset_3") {
	    		self.data[2] = newValue;
	    	}

	    	self.render();
	    }

	    self.onDispose = function () {
	    }

	    self.getHeight = function () {
	    	if (currentSettings.type === "pie") { return 5 }
	    	if (currentSettings.type === "bar") { return 3 }
	    	if (currentSettings.type === "heatmap") { return 5 }
	    	if (currentSettings.type === "scatter") { return 8 }
	    	return 6;
	    }

	    self.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "chart",
        display_name: "Chart",
        external_scripts: [
        	"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js",
        	"https://maps.googleapis.com/maps/api/js?key=AIzaSyCVfDOmScN9VwJZofh1TRO-ENgsmNfToqs&libraries=visualization"
        ],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text",
                description: "Required"
            },
            {
            	name: "dataset_1",
            	display_name: "Dataset 1",
            	type: "calculated"
            },
            {
            	name: "label_1",
            	display_name: "Label 1",
            	type: "text"
            },
	        {
            	name: "dataset_2",
            	display_name: "Dataset 2",
            	type: "calculated"
            },
            {
            	name: "label_2",
            	display_name: "Label 2",
            	type: "text"
            },
            {
            	name: "dataset_3",
            	display_name: "Dataset 3",
            	type: "calculated"
            },
            {
            	name: "label_3",
            	display_name: "Label 3",
            	type: "text"
            },
            {
            	name: "colors",
            	display_name: "Colors",
            	type: "array",
            	description: "Colors can be input in rgb, rgba, hex, or hsl format. If more colors than provided are needed, they will be generated automatically.",
            	settings: [
            		{
            			name: "color",
            			display_name: "Color",
            			type: "text"
            		}
            	]
            },
            {
            	name: "type",
            	display_name: "Type",
            	type: "option",
            	options: [
            		{
            			name: "Bar",
            			value: "bar"
            		},
            		{
            			name: "Pie",
            			value: "pie"
            		},
            		{
            			name: "Line",
            			value: "line"
            		},
            		{
            			name: "Scatter",
            			value: "scatter"
            		},
            		{
            			name: "Heatmap",
            			value: "heatmap"
            		}
            	]
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new chartWidget(settings));
        }
    });
}());
