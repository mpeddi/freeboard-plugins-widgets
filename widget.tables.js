(function()
{
    freeboard.addStyle('table.list-table', "width: 100%; white-space: normal !important; ");
    freeboard.addStyle('table.tablescroll_head', "width:279px!important;border-collapse: collapse;");
    freeboard.addStyle('table.tablescroll_head th', " font-size: 11px;");
    freeboard.addStyle('table.tablescroll_body', " 276px!important;");
    freeboard.addStyle('table.tablescroll_body .td-0', " width:106px!important;");
    freeboard.addStyle('table.tablescroll_body .td-1', " width:91px!important;");
    freeboard.addStyle('table.tablescroll_body .td-2', " width:69px!important;");
    freeboard.addStyle('table.tablescroll_wrapper', " width:280px!important;");
    freeboard.addStyle('.added-header', "background: #CFCCCB;");
    freeboard.addStyle('table.list-table thead', "background: #CFCCCB;");
    freeboard.addStyle('table.list-table tr', "display: table-row; vertical-align: inherit; border-color: inherit;");
    freeboard.addStyle('table.list-table th', "padding: .3em; border: 2px #545454 solid; font-size: 11px;");
    freeboard.addStyle('table.list-table tbody', "display: table-row-group;  vertical-align: middle; border-color: inherit;");
    freeboard.addStyle('table.list-table td, table.list-table th', "padding: .3em; border: 2px #545454 solid; font-size: 11px; ");
    freeboard.addStyle('table.list-table td, table.list-table th', "padding: 2px 2px 2px 2px; vertical-align: top; ");
    freeboard.addStyle('table.tablescroll_head th', "padding: 2px 2px 2px 2px; vertical-align: top; ");
	var tableWidget = function (settings) {
	        var self = this;
	        var titleElement = $('<h2 class="section-title"></h2>');
	        var stateElement = $('<div><table class="list-table"><thead/></table></div>');
	        var currentSettings = settings;
		//store our calculated values in an object
		var stateObject = {};
        
		function updateState() {            			
			var bodyHTML = $('<tbody/>');
			var classObject = {};
			var classCounter = 0;

		    var replaceValue = (_.isUndefined(currentSettings.replace_value) ? '' : currentSettings.replace_value);
			
			//only proceed if we have a valid JSON object
			if (stateObject.value) {
				var headerRow = $('<tr class="added-header"/>');
				var templateRow = $('<tr/>');
				var rowHTML = $('<tr/>');
				//var rowHTML;
                //Loop through the 'header' array, building up our header row and also a template row
				try {					
					//$.each(stateObject.value.header, function(headerKey, headerName){
						classObject[stateObject.header] = 'td-' + classCounter;
						headerRow.append($('<th/>').addClass('td-'+0).html("Timestamp"));
						headerRow.append($('<th/>').addClass('td-'+1).html((stateObject.header) ? stateObject.header:"Value"));
						//templateRow.append($('<td/>').addClass('td-' + 0).html(replaceValue));		
						//classCounter++;		
						//rowHTML = templateRow.clone();														
						//rowHTML.find('.' + classObject[stateObject.header]).html(stateObject.value);
						rowHTML.append($('<td/>').addClass('td-' + 0).html((new Date()).toISOString()));
						rowHTML.append($('<td/>').addClass('td-' + 1).html(stateObject.value));

						bodyHTML.append(rowHTML);				
					//})					
				} catch (e) {
					console.log(e);
				}
				//Loop through each 'data' object, cloning the templateRow and using the class to set the value in the correct <td>
				try {
					//$.each(stateObject.value.data, function(k, v){

				} catch (e) {
					console.log(e)
				}	
				//Append the header and body
                if(stateElement.find('.added-header').length > 0){
                }else{
        		//stateElement.find('thead').append(timestampRow);
				stateElement.find('thead').append(headerRow);
                }
                stateElement.find('.list-table').prepend(bodyHTML);
                if($(stateElement).find('.list-table').hasClass('tablescroll_head')){
                }else{
                    $(stateElement).find('.list-table').tableScroll({height:200});
                }
				//show or hide the header based on the setting
				if (currentSettings.show_header) {					
					stateElement.find('thead').show();
				} else {
					stateElement.find('thead').hide();
				}
			}
        }

        this.render = function (element) {
            $(element).append(titleElement).append(stateElement);
        }		



        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));			
            updateState();			
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            //whenver a calculated value changes, stored them in the variable 'stateObject'
			stateObject[settingName] = newValue;
            updateState();
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
			var height = Math.ceil(stateElement.height() / 50);
            height = 4;
			return (height > 0 ? height : 3);
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "list",
        display_name: "Table",
//         external_scripts : [
//          "./table-widget/jquery.tablescroll.js"
//          ],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
			{
                name: "show_header",
                display_name: "Show Headers",
				default_value: true,
                type: "boolean"
            },
			{
                name: "replace_value",
                display_name: "Replace blank values",
                type: "text"
            },
            {
                name: "header",
                display_name: "Header",
                type: "calculated"
            },
			{
                name: "value",
                display_name: "Value",
                type: "calculated",
                multi_input: "true"
            }
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new tableWidget(settings));
        }
    });
}());	
