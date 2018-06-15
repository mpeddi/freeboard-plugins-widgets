	freeboard.addStyle('.list-unstyled','padding-left:5px;');
	freeboard.addStyle('.collapse','display:none;');
	freeboard.addStyle('.collapse.in',"display:block;");
    var timePickerWidget = function (settings) {
        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var wrapperElement = $('<div class="">');
        var pickerElement = $(`<div style="margin-bottom:10px;">
        						<h2 class='section-title' style="margin-bottom:2px;">Start Date/Time:</h2>
								<input type='text' class="form-control" style="width:200px" id='datetimepicker6'/>
							</div>
							<div style="width:200px; margin-bottom:10px;">
							    <h2 class='section-title' style="margin-bottom:2px">End Date/Time:</h2>
								<input type='text' class="form-control" style="width:200px;" id='datetimepicker7'/>
							</div>`);
		var buttonElement = $("<button id='submit'>Update</button>");
        var currentSettings = settings;
        var isOn = false;
        var onText;
        var offText;

//         function updateState() {
//             indicatorElement.toggleClass("on", isOn);
// 
//             if (isOn) {
//                 stateElement.text((_.isUndefined(onText) ? (_.isUndefined(currentSettings.on_text) ? "" : currentSettings.on_text) : onText));
//             }
//             else {
//                 stateElement.text((_.isUndefined(offText) ? (_.isUndefined(currentSettings.off_text) ? "" : currentSettings.off_text) : offText));
//             }
//         }

        this.render = function (element) {
            $(element).append(titleElement);
            pickerElement.appendTo(wrapperElement);
            buttonElement.appendTo(wrapperElement);
            $(element).append(wrapperElement);
            
			$('#datetimepicker6').datetimepicker({
			'showTodayButton': true,
			'showClose':true,
				icons: {
					time: 'fa fa-clock-o', 
					today: 'fa fa-dot-circle-o', 
					date: 'fa fa-calendar',
					up: 'fa fa-chevron-up',
					down: 'fa fa-chevron-down',
					previous: 'fa fa-chevron-left',
					next: 'fa fa-chevron-right',
					clear: 'fa fa-trash-o',
		            close: 'fa fa-times' 
				}
			});
			$('#datetimepicker7').datetimepicker({
				'showTodayButton':true,
				'debug':true,
				'showClose':true,
				//'widgetPositioning':{vertical:'bottom'},
				useCurrent: false, //Important! See issue #1075
				icons: {
					time: 'fa fa-clock-o', 
					today: 'fa fa-dot-circle-o', 
					date: 'fa fa-calendar',
					up: 'fa fa-chevron-up',
					down: 'fa fa-chevron-down',
					previous: 'fa fa-chevron-left',
					next: 'fa fa-chevron-right',
					clear: 'fa fa-trash-o',
		            close: 'fa fa-times' 
				}
			});
			
			if(currentSettings.start_date != undefined) {
				$('#datetimepicker6').data("DateTimePicker").date(new Date(currentSettings.start_date));
			}
			
			if(currentSettings.end_date != undefined) {
				$('#datetimepicker7').data("DateTimePicker").date(new Date(currentSettings.end_date));
			}
			
			$("#datetimepicker6").on("dp.change", function (e) {
            	$('#datetimepicker7').data("DateTimePicker").minDate(e.date);
            	currentSettings.start_date = e.date.utc().toISOString();
        	});
        	$("#datetimepicker7").on("dp.change", function (e) {
            	$('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
            	currentSettings.end_date = e.date.utc().toISOString();
        	});
        	
        	buttonElement.on("click", function(e) {
        		freeboard.setDatasourceSettings("UCLA",{"start":currentSettings.start_date,"end":currentSettings.end_date});        		
        	});
            
            if (currentSettings.on_change) {
            	window.clickfunc = new Function ("sensor",currentSettings.on_change);
            	$(element).delegate('select#deviceSelect',"change",function(e){
            		window.clickfunc(this.value);
//             		var optionSelected = $("option:selected", this);
// 					var valueSelected = this.value;
// 					window.selectedResource = valueSelected;
// 					console.log(window.selectedResource);	
            	});
            }
        }	

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            if (settingName == "options") {
				if (newValue.constructor === Array) {
					dropdownElement.empty();
					newValue.forEach(function(sensor){
						dropdownElement.append('<OPTION VALUE='+sensor.guid+'>'+sensor.info.Name+'</OPTION>');
					});
				}	
            }

        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return 6;
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "timepicker",
        display_name: "Date Time Picker",
        external_scripts: ["https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
        "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/css/bootstrap-datetimepicker.min.css"],
        settings: [
	        {
	            name: "title",
	            display_name: "Title",
	            type: "text"
	        },
	        {
	            name: "start_date",
	            display_name: "Initial Start Date",
	            type: "calculated"
	        },
	        {
	            name: "end_date",
	            display_name: "Initial End Date",
	            type: "calculated"
	        },
	        {
	        	name: "on_change",
	        	"display_name":"On Change Function",
	        	"type":"calculated"
	        }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new timePickerWidget(settings));
        }
    });
