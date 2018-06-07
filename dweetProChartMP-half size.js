// #dweetProChart.js Freeboard Widget
//
// ## A Freeboard plugin that uses D3.js and NVD3 to visualise historical data coming from a DweetPro Datasource.
//
//

(function()
{
    var push_apply = Function.apply.bind([].push);
    var slice_call = Function.call.bind([].slice);

    Object.defineProperty(Array.prototype, "pushArrayMembers", {
        value: function() {
            for (var i = 0; i < arguments.length; i++) {
                var to_add = arguments[i];
                for (var n = 0; n < to_add.length; n+=300) {
                    push_apply(this, slice_call(to_add, n, n+300));
                }
            }
        }
    });

//  freeboard.addStyle(".tooltip","position: absolute;   text-align: left;   width:auto;   height: auto;   padding: 8px;   margin-top: -20px;   font: 10px sans-serif;   background: #d3d4d4;   pointer-events: none; z-index:3000; ");
//  freeboard.addStyle(".axis path","fill: none; stroke: #FFF;shape-rendering: crispEdges;");
//  freeboard.addStyle(".axis line","fill: none; stroke: #FFF;shape-rendering: crispEdges;");
//  freeboard.addStyle(".chart","color:#fff;");
//  freeboard.addStyle(".axis text","font-family: sans-serif; font-size:10px; font-weight:lighter; fill:none; stroke:#d3d4d4;shape-rendering: crispEdges;");
//  freeboard.addStyle(".overlay","fill: none; pointer-events: all;");
//  freeboard.addStyle(".focus circle","fill:none; stroke:white");

    freeboard.addStyle(".tick line","display: none;");
    freeboard.addStyle(".nv-axis","fill: white;");
    freeboard.addStyle(".nvd3 .nv-axis path.domain","stroke: #ffffff;");
    freeboard.addStyle(".nvd3 .nv-y .nv-axis .tick.zero line","stroke: #fff;");
    freeboard.addStyle(".nvd3 text","fill:white;");
        freeboard.addStyle(".highlight td","background-color: rgba(136, 110, 70, 0.3)");




  freeboard.loadWidgetPlugin({
    "type_name": "dPChartWidget",
    "display_name": "Dweet Historical Chart",
    "description": "Creates a multi-series line chart from DweetPro Datasource data.",
    "external_scripts": [
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.16.0/moment.js",
        "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.js",
        "https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.6/nv.d3.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.6/nv.d3.min.css"
    ],
    "fill_size": false,
    "settings": [
        {
            "name": "type",
            "display_name": "Chart Type",
            "type": "option",
            "options": [
                "Line"
            ],
            "default_value": "Line"
        },
        {
            "name": "data",
            "display_name": "JSON Data Array",
            "type": "calculated"
        },
        {
            "name": "target",
            "display_name": "Target Data Field",
            "type": "calculated"
        },
        {
        	"name": "timeframe",
        	"display_name":"Time Frame",
        	"type":"option",
        	"options":[
        		"All",
        		"Hour",
        		"Day",
        		"Week",
        		"Month"
        	],
        	"default_value":"All"
        },
        {
        	"name":"ymin",
        	"display_name":"Y-Min",
        	"type":"text"
        },
        {
        	"name":"ymax",
        	"display_name":"Y-Max",
        	"type":"text"
        },
        {
            "name": "size",
            "display_name": "Size",
            "description": "Small: 600x180, Medium: 600x420, Large: 900x600.<br><strong>NOTE: You must also set the containing Pane's COLUMNS value to 1 (Small), 2 (Medium) or 3 (Large)</strong>",
            "type": "option",
            "options": [
                "Small",
                "Medium",
                "Large",
                "X-Wide"
            ],
            "default_value": "Small"
        },
        {
            "name": "include_axis",
            "display_name": "Include Axis?",
            "type": "boolean",
            "default_value": false
        }
    ],
    newInstance   : function(settings, newInstanceCallback)
    {
      newInstanceCallback(new dPChartWidget(settings));
    }
  });

  var dPChartWidget = function(settings)
  {
    var self = this;
    var currentSettings = settings;
    var container;
    var chartElement;
    var styleSheet = null;

    this.render = function(containerElement)
    {
      // Here we append our text element to the widget container element.
      container = containerElement;

      // Load the settings:
      this.onSettingsChanged(currentSettings);
    }

    this.getHeight = function()
    {
        switch (currentSettings.size) {
            case 'Small':
                return 3;
            case  'Medium':
                return 7;
            case 'Large':
                return 10;
            case 'X-Wide':
                return 7;
        }
      return 5;
    }

    this.onSettingsChanged = function(newSettings)
    {
      currentSettings = newSettings;
        $(container).empty();
        chartElement = d3.select(container).append('svg').attr("class","chart").attr("style","height:"+currentSettings.height+"px").attr("height",currentSettings.height);

        switch (currentSettings.size) {
            case 'Small':
                currentSettings.width = 600;
                currentSettings.height = 180;
                break;
            case 'Medium':
                currentSettings.width = 600;
                currentSettings.height = 420;
                break;
            case 'Large':
                currentSettings.width = 900;
                currentSettings.height = 600;
                break;
            case 'X-Wide':
                currentSettings.width = 1200;
                currentSettings.height = 420;
                break;
            default:
                currentSettings.width = 600;
                currentSettings.height = 180;
        }

    }

    this.onCalculatedValueChanged = function(settingName, newValue)
    {
      if(settingName == "data")
      {
        // Set the data:
        var data = processDweetData(newValue.reverse());

        // Placeholder for future support of different chart types
        switch (currentSettings.type) {
//             case "Bar":
//                 createBarChart(data, targetArray, currentSettings.include_axis);
//                 break;
            case "Line":
                createLineChart(data, currentSettings.include_axis, currentSettings.ymin, currentSettings.ymax);
                break;
            default:
                createLineChart(data, currentSettings.include_axis);
        }
      }
    }

    function processDweetData(rawdata) {
    	var newData = [];
    	var format = {};

    	rawdata.forEach(function(datapoint) {
    		for (var k in datapoint["content"]) {
				if (_.isUndefined(format[k])) {
					format[k] = [];
				}
				format[k].push({'x':datapoint["created"],'y':datapoint["content"][k]});
    		}
    	});
    	for (var key in format) {
    		var obj = {};
    		obj["key"] = key;
    		obj["values"] = format[key];
    		newData.push(obj);
    	}
    	console.log(newData);
    	return newData;
    }

    function processDataNVD3(dweetProdata) {
		var newData = [];
    	dweetProdata["sensors"].forEach(function(sensor) {
    		var inobj = {"values":[]};
    		var outobj = {"values":[]};
    		inobj["key"] = sensor["info"]["Name"] + "-In";
    		inobj["sensor"] = sensor["guid"].substring(9) + "-in";
    		for (var a=0; a<sensor["data"]["history"].length; a++) {
    			inobj["values"].push({"x":sensor["data"]["history"][a]["time"],"y":sensor["data"]["history"][a]["in"]});
    		}
    		inobj["orient"] = sensor["info"]["in"];
    		inobj["dir"] = "in";
    		newData.push(inobj);

    		outobj["key"] = sensor["info"]["Name"] + "-Out";
    		outobj["sensor"] = sensor["guid"].substring(9) + "-out";
    		for (var a=0; a<sensor["data"]["history"].length; a++) {
    			outobj["values"].push({"x":sensor["data"]["history"][a]["time"],"y":sensor["data"]["history"][a]["out"]});
    		}
    		outobj["orient"] = sensor["info"]["out"];
    		outobj["dir"] = "out";
    		newData.push(outobj);
    	});
    	return newData;
    }

    function findValueByPrefix(object, prefix) {
		for (var property in object) {
			if (object.hasOwnProperty(property) && property.toString().startsWith(prefix)) {
				return object[property];
			}
		}
	}
	function findValueBySuffix(object, suffix) {
		for (var property in object) {
			if (object.hasOwnProperty(property) && property.toString().endsWith(suffix)) {
				return object[property];
			}
		}
	}

	function getKey(object,value) {
      for(var key in object){
         if(object[key]==value) return key;
      }
	}

	function getInOut(val) {
		if (val.endsWith("_in")) {
			return "In";
		} else {
			return "Out";
		}
	}

    function createLineChart(data,axis,ymin,ymax) {
        window.data = data;

		nv.addGraph(function() {

			window.chart = nv.models.lineChart()
			.x(function (d) { return new Date(d.x) })
			.y(function (d) { return +d.y })
			.xScale(d3.time.scale())
			.showLegend(true)
			.showXAxis(true)
			.useInteractiveGuideline(true);

			var x = d3.time.scale()
            .domain(d3.extent(window.data[0], function(d){return new Date(d.x)}))
            .range([0,currentSettings.width]);

			var format = d3.time.format.multi([
			  [".%L", function(d) { return d.getMilliseconds(); }],
			  [":%S", function(d) { return d.getSeconds(); }],
			  ["%I:%M", function(d) { return d.getMinutes(); }],
			  ["%I %p", function(d) { return d.getHours(); }],
			  ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
			  ["%b %d", function(d) { return d.getDate() != 1; }],
			  ["%B", function(d) { return d.getMonth(); }],
			  ["%Y", function() { return true; }]
			]);

			window.chart.xAxis
			.axisLabel('Time')
			.showMaxMin(false)
			.tickSize(10)
			.tickFormat(function (d) { return format(new Date(d)); })
			.ticks(10);

			window.chart.yAxis
			.axisLabel('Value');

			window.chart.legend
			.maxKeyLength(33);

			chartElement
		  	.datum(window.data)
			.transition().duration(750)
			.call(window.chart);

			nv.utils.windowResize(window.chart.update);

		  // set up the tooltip to display full dates
			var tsFormat = d3.time.format('%b %-d, %Y %I:%M%p');
			var contentGenerator = window.chart.interactiveLayer.tooltip.contentGenerator();
			var tooltip = window.chart.interactiveLayer.tooltip;
			tooltip.contentGenerator(function (d) { d.value = d.series[0].data.x; return contentGenerator(d); });
			tooltip.headerFormatter(function (d) { return tsFormat(new Date(d)); });

		  return window.chart;

		});

    }

    this.onDispose = function()
    {
    	window.data = null;
    	window.chart = null;
    }
  }
}());
