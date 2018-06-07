/*****************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Sam Wilson
 * Copyright (c) 2016 Stu Fisher
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *****************************************************************************/
(function() {
    var FlotExtendedWidgetPlugin = function (settings) {
        var self = this;
        var currentSettings = settings;

        var currentData = [];
        var $holder;
        var plot;
        var myContainer;

        var tooltip = $("<div class='tooltip'></div>").css({
            position: "absolute",
            display: "none",
            padding: "2px",
            "background-color": "#111",
            "border-radius": "3px",
            opacity: 0.70,
            fontSize: "10px",
            padding: "3px",
        })


        function dispose(erase) {
            myContainer = undefined;

            if (erase) {
                currentData = [];
            }

            if (plot) {
                plot.shutdown();
                plot = undefined;
            }

            if ($holder) {
                $holder.remove();
                $holder = undefined;
            }
        }


        self.reset = function(e) {
            self.zoom(e, { 
                xaxis: {from: null, to: null},
                yaxis: {from: null, to: null},
            })
        };


        self.zoom = function (event, ranges) {
            if (!ranges.xaxis) return
            
            var opts = plot.getOptions()
            _.each(opts.xaxes, function(axis) {
                axis.min = ranges.xaxis.from
                axis.max = ranges.xaxis.to
            })
            _.each(opts.yaxes, function(axis) {
                axis.min = ranges.yaxis.from
                axis.max = ranges.yaxis.to
            })
            
            plot.setupGrid()
            plot.draw()
            plot.clearSelection()
        };


        self.hover = function(event, pos, item) {
            if (!currentSettings.tooltip) return;

            if (item) {
                var y = item.datapoint[1].toFixed(2);
                var x = item.datapoint[0].toFixed(2);

                var val = (currentSettings.plot_type == 'horiz_stacked_bar' || currentSettings.plot_type == 'horiz_bar') ? x : y

                tooltip.html(val)
                    .css({top: item.pageY+5-$(myContainer).offset().top, left: item.pageX+5-$(myContainer).offset().left})
                    .fadeIn(200);
            } else {
                tooltip.hide();
            }
        };


        self.render = function(container) {
            dispose(false);
            var $container = $(container);
            myContainer = container;
            $holder = $('<div></div>')
                .height(currentSettings.height*60 - 10)
                .appendTo($container)
                .bind("plotselected", self.zoom)
                .bind("dblclick", self.reset)
                .bind("plothover", self.hover);


            tooltip.appendTo($container);
            console.log(currentSettings.zoom, currentSettings.zoom == "")

            var options = { 
                grid: {
                    borderWidth: 0,
                    hoverable: currentSettings.tooltip,
                },
                legend: {
                    show: currentSettings.legend
                },
                series: {
                    points: {
                        show: currentSettings.points
                    },
                    lines: {
                        show: currentSettings.plot_type == 'line' || currentSettings.plot_type == 'area' || currentSettings.plot_type == 'stacked_area',
                        fill: currentSettings.plot_type == 'area' || currentSettings.plot_type == 'stacked_area',
                    },
                    bars: {
                        show: currentSettings.plot_type == 'bar' || currentSettings.plot_type == 'stacked_bar' || currentSettings.plot_type == 'horiz_bar' || currentSettings.plot_type == 'horiz_stacked_bar',
                        align: 'center',
                        horizontal: currentSettings.plot_type == 'horiz_bar' || currentSettings.plot_type == 'horiz_stacked_bar',
                    },
                    stack: currentSettings.plot_type == 'stacked_bar' || currentSettings.plot_type == 'stacked_area' || currentSettings.plot_type == 'horiz_stacked_bar',
                    pie: {
                        show: currentSettings.plot_type == 'pie',
                        radius: 1,
                        label: {
                            show: true,
                            radius: 0.6,
                            formatter: function (label, series) {
                                return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
                            }
                        }
                    },
                },
                xaxis: {},
                yaxis: {},
            };

            if (currentSettings.zoom != "") options.selection = { mode: currentSettings.zoom };

            if (currentSettings.x_timestamp) options.xaxis.mode = "time";
            plot = $.plot($holder, currentData, options);
        };

        self.getHeight = function() {
            return currentSettings.height;
        };

        self.onSettingsChanged = function(newSettings) {
            currentSettings = newSettings;
            self.render(myContainer);
            plot.getOptions().series.points.show = currentSettings.points;
        };

        self.onCalculatedValueChanged = function(settingName, newValue) {
            if (settingName == 'xticks' || settingName == 'yticks') {
                axes = plot.getAxes()
                if (settingName == 'xticks') axes.xaxis.options.ticks = newValue;
                if (settingName == 'yticks') axes.yaxis.options.ticks = newValue;
            }


            if (settingName == "value") {
                currentData = newValue;
                plot.setData(currentData);
            }


            plot.setupGrid();
            plot.draw();
        };

        self.onDispose = function() {
            dispose(true);
        };
    };

    freeboard.loadWidgetPlugin({
        type_name:          "flot_extended_plugin",
        display_name:       "Flot Extended",
        description:        "Flot Plot",
        external_scripts:   [
                                "//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.min.js",
                                "//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.selection.js",
                                "//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.resize.js",
                                "//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.pie.js",
                                "//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.stack.js",
                                "https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.time.js"
                            ],
        settings:           [
                                {
                                    name:           "plot_type",
                                    display_name:   "Plot Type",
                                    type:           "option",
                                    description:    "This can be customised per series by your datasource",
                                    options: [
                                                    { name: 'Line', value: 'line' },
                                                    { name: 'Pie', value: 'pie' },
                                                    { name: 'Bar', value: 'bar' },
                                                    { name: 'Area', value: 'area' },
                                                    { name: 'Stacked Area', value: 'stacked_area' },
                                                    { name: 'Stacked Bar', value: 'stacked_bar' },
                                                    { name: 'None (Enable Points)', value: null },
                                                    { name: 'Horizontal Bar', value: 'horiz_bar' },
                                                    { name: 'Horizontal Stacked Bar', value: 'horiz_stacked_bar' },
                                    ]
                                },
                                {
                                    name:           "legend",
                                    display_name:   "Show Legend",
                                    type:           "boolean",
                                    default_value:  true,
                                },
                                {
                                    name:           "height",
                                    display_name:   "Height",
                                    type:           "number",
                                    description:    "in blocks",
                                    default_value:  2
                                },
                                {
                                    name:           "value",
                                    display_name:   "Value",
                                    type:           "calculated",
                                },
                                {
                                    name:           "xticks",
                                    display_name:   "X Axis Ticks",
                                    type:           "calculated",
                                },
                                {
                                    name:           "yticks",
                                    display_name:   "Y Axis Ticks",
                                    type:           "calculated",
                                },
                                {
                                    name:           "x_timestamp",
                                    display_name:   "X Axis Timestamp",
                                    type:           "boolean"
                                },
                                {
                                    name:           "points",
                                    display_name:   "Show Points",
                                    type:           "boolean"
                                },
                                {
                                    name:           "tooltip",
                                    display_name:   "Show Tooltip",
                                    type:           "boolean"
                                },
                                {
                                    name:           "zoom",
                                    display_name:   "Enable Zoom",
                                    description:    "Double click to zoom out",
                                    type:           "option",
                                    options: [
                                                    { name: 'X Axis', value: 'x' },
                                                    { name: 'X and Y Axis', value: 'xy' },
                                                    { name: 'None', value: '' },
                                    ],
                                    default_value: '',
                                }
                            ],

        newInstance:        function(settings, newInstanceCB) {
                                newInstanceCB(new FlotExtendedWidgetPlugin(settings));
                            }
    });
}());