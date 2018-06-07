
anychart.onDocumentReady(function () {
    // Helper function to create gauge
    function createGaugeBase() {
        // Create gauge
        var gauge = anychart.gauges.linear();
        gauge.layout('horizontal');
        gauge.background({stroke: '10 #545f69', fill: '#ffffff'});
        gauge.margin([30, 45, 30, 30]);
        gauge.padding(0);

        // Set gauge tooltip
        gauge.tooltip().useHtml(true).format('Value: {%Value}%');

        // Create label to make gauge look like battery
        var label = gauge.label();
        label.text(null).position('right').anchor('right').width(20).height('30%');
        label.offsetX('20px');
        label.background({enabled: true, fill: "#545f69"});

        // Set axis scale
        var scale = gauge.scale();
        scale.minimum(0);
        scale.maximum(100);
        scale.ticks().interval(10);

        return gauge;
    }

    function batteryBar(value) {
        // Create gauge
        var gauge = createGaugeBase();
        gauge.data([value]);

        // Create bar pointer
        var batteryEnergy = gauge.bar(0);
        batteryEnergy.name('Energy');
        batteryEnergy.width('90%').offset(0);
        batteryEnergy.fill(function () {
            if (gauge.data().get(0, 'value') >= 25) return '#545f69';
            return '#D81F05'
        });
        batteryEnergy.stroke(null);
        batteryEnergy.zIndex(11);
        return gauge
    }

    // Create layout table and set some settings
    layoutTable = anychart.standalones.table();
    layoutTable.hAlign('center')
            .vAlign('middle')
            .useHtml(true)
            .fontSize(16)
            .cellBorder(null);

    // Put gauges into the layout table
    layoutTable.contents([
        ['Battery', null],
        ['Gauge with Bar Pointer<br>' +
        '<span style="color: #212121; font-size: 12px">Charged 5%</span>',
            'Gauge with Bar Pointer<br>' +
            '<span style="color: #212121; font-size: 12px">Charged 75 %</span>'],
        [batteryBar(5), batteryBar(75)],
        ['Gauge with LED Pointer<br>' +
        '<span style="color: #212121; font-size: 12px">Charged 20%</span>',
            'Gauge with LED Pointer<br>' +
            '<span style="color: #212121; font-size: 12px">Charged 100%</span>'],
        [batteryLED(20), batteryLED(100)]
    ]);

    // Set height for first row in layout table
    layoutTable.getRow(0)
            .height(40)
            .fontSize(18);
    layoutTable.getRow(1).height(50);
    layoutTable.getRow(3).height(50);

    // Merge cells in layout table where needed
    layoutTable.getCell(0, 0).colSpan(2);

    // Set container id and initiate drawing
    layoutTable.container('container');
    layoutTable.draw();

    freeboard.loadWidgetPlugin({
    type_name: "batteryBar",
    display_name: "BatteryGauge",
    "external_scripts" : [
        "../freeboard-ui/plugins/thirdparty/raphael.2.1.0.min.js",
        "../freeboard-ui/plugins/thirdparty/justgage.1.0.1.js"
    ],
    settings: [
        {
            name: "title",
            display_name: "Title",
            type: "text"
        },
        {
            name: "value",
            display_name: "Value",
            type: "calculated"
        },
        {
            name: "units",
            display_name: "Units",
            type: "text"
        },
        {
            name: "min_value",
            display_name: "Minimum",
            type: "text",
            default_value: 0
        },
        {
            name: "max_value",
            display_name: "Maximum",
            type: "text",
            default_value: 100
        }
    ],
    newInstance: function (settings, newInstanceCallback) {
        newInstanceCallback(new batteryBarWidget(settings));
    }
});

}());
