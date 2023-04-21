const url = "https://engrids.soc.cmu.ac.th/api";
let latlng = {
    lat: 13.3234652,
    lng: 101.7580673
};
let map = L.map("map", {
    center: latlng,
    zoom: 8
});
const mapbox = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZG9va2RhIiwiYSI6ImNsZzMxb2wzczBiNGUzaG8zOGIyaGtnaWcifQ.5FWK75zRTcH_LT4Z2b8eYQ",
    {
        maxZoom: 18,
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/light-v9",
        tileSize: 512,
        zoomOffset: -1
    }
);

const ghyb = L.tileLayer("https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

const tam = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:tam_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const amp = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:amp_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 14,
    // minZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:prov_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const w_reserve_63 = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eec/wms?", {
    layers: "eec:a__54_9w_reserve_63",
    format: "image/png",
    transparent: true,
    maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const main_river_rid9 = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eec/wms?", {
    layers: "eec:a__54_main_river_rid9",
    format: "image/png",
    transparent: true,
    maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

var baseMaps = {
    "Mapbox": mapbox.addTo(map),
    "Google Hybrid": ghyb
};

const overlayMaps = {
    "ขอบเขตจังหวัด": pro.addTo(map),
    "ขอบเขตอำเภอ": amp,
    "ขอบเขตตำบล": tam,
    "แม่น้ำสายหลัก": main_river_rid9,
    "อ่างเก็บน้ำ": w_reserve_63
};

const lyrControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);

let loadWtrl2 = async () => {
    let sta = [
        {
            staname: "station_01",
            latlon: [13.691624, 101.442835]

        }, {
            staname: "station_02",
            latlon: [13.0465397, 100.9197114]
        }, {
            staname: "station_03",
            latlon: [12.8291659, 101.3244348]
        }]
    let sum_data = []
    sta.map(async (i) => {
        let dat_ec = axios.post('https://engrids.soc.cmu.ac.th/p3500/api/getone', { param: "ec", sort: "DESC", stname: i.staname, limit: 1 });
        dat_ec.then(r => {
            let A1 = r.data.data;
            console.log(A1[0])

            let dat_ph = axios.post('https://engrids.soc.cmu.ac.th/p3500/api/getone', { param: "ph", sort: "DESC", stname: i.staname, limit: 1 });
            dat_ph.then(r => {
                let B1 = r.data.data;

                let dat_do = axios.post('https://engrids.soc.cmu.ac.th/p3500/api/getone', { param: "do", sort: "DESC", stname: i.staname, limit: 1 });
                dat_do.then(r => {
                    let C1 = r.data.data;

                    let dat_tmp = axios.post('https://engrids.soc.cmu.ac.th/p3500/api/getone', { param: "tmp", sort: "DESC", stname: i.staname, limit: 1 });
                    dat_tmp.then(r => {
                        let D1 = r.data.data;
                        sum_data.push({ staname: i.staname, latlon: i.latlon, ec: Number(A1[0].val_ec), ph: Number(B1[0].val_ph), do: Number(C1[0].val_do), tmp: Number(D1[0].val_tmp), });
                        console.log(sum_data)
                        if (sum_data.length == '3') {
                            createmarker(sum_data)
                        }
                    })
                })
            })
        })
    })

}
loadWtrl2()
let createmarker = (e) => {
    var sta = e
    let iconblue = L.icon({
        iconUrl: './marker/marker2.png',
        iconSize: [45, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    var markergroup = L.layerGroup([]);
    sta.map(async (i) => {
        console.log(i)
        let marker = L.marker(i.latlon, {
            icon: iconblue,
            name: 'marker',
            // data: dat
        });
        // console.log(i.staname)
        marker.addTo(map)
        marker.bindPopup(`<div style="font-family:'Kanit'"> 
                        ชื่อสถานี : ${i.staname} <br>
                        ค่าการนำไฟฟ้า (EC) : ${Number(i.ec).toFixed(1)} mS/cm <br>
                        ค่าออกซิเจนละลายน้ำ (DO) : ${Number(i.do).toFixed(1)} mg/L <br>
                        อุณหภูมิ (tmp) : ${Number(i.tmp).toFixed(1)} องศาเซลเซียส<br>
                        ค่าความเป็นกรด-ด่าง (pH) : ${Number(i.ph).toFixed(1)} <br>
                        </div>`
        )
        markergroup.addLayer(marker)
    })
    markergroup.addTo(map)
    lyrControl.addOverlay(markergroup, "จุดตรวจวัดคุณภาพน้ำอัตโนมัติ");

}

let param, unit, dat, sta
var ecchart = (sta) => {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("ecchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "DD-MM-YYYY HH:mm:ss";
    var data = [];
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
    };
    dateAxis.dateFormats.setKey("DD MMMM YYYY");
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.tooltipDateFormat = "DD-MM-YYYY HH:mm:ss";

    axios.post("https://engrids.soc.cmu.ac.th/p3500/api/wtrq-data", { param: "val_ec", sort: "DESC", stname: sta, limit: 10 }).then((r) => {
        console.log(r.data.data)
        r.data.data.forEach(i => {
            // console.log(i.datetime)

            data.push({ date: i.datetime, value: Number(i.val_ec) });
        });

        // console.log(data)

        chart.data = data;

        // Create axes

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "EC (mS/cm)";


        // Create series

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 10;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#009900");
        series.name = 'Ec'

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        bullet.circle.stroke = am4core.color("#009900");

        var range = valueAxis.createSeriesRange(series);
        // range.value = 35;
        // range.endValue = 100;
        range.contents.stroke = am4core.color("#009900");
        range.contents.fill = range.contents.stroke;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.fullWidthLineX = true;
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        chart.legend = new am4charts.Legend();


        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
        chart.exporting.adapter.add("data", function (data, target) {
            var data = [];
            chart.series.each(function (series) {
                for (var i = 0; i < series.data.length; i++) {
                    series.data[i].name = series.name;
                    data.push(series.data[i]);
                }
            });
            return { data: data };
        });
    })
};

var dochart = function (sta, min1, max1, min2, max2) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end


    var chart = am4core.create("dochart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "DD-MM-YYYY HH:mm:ss";
    var data = [];
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
    };
    dateAxis.dateFormats.setKey("DD MMMM YYYY");
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.tooltipDateFormat = "DD-MM-YYYY HH:mm:ss";

    axios.post("https://engrids.soc.cmu.ac.th/p3500/api/wtrq-data", { param: "val_do", sort: "DESC", stname: sta, limit: 10 }).then((r) => {
        // console.log(r.data.data)
        r.data.data.forEach(i => {
            // console.log(i.value)
            data.push({ date: i.datetime, value: Number(i.val_do) });
        });


        // console.log(data)

        chart.data = data;

        // Create axes

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "DO (mg/L)";


        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 10;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#009900");
        series.name = 'Do'

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        // bullet.circle.stroke = am4core.color("#00bcd4");
        bullet.adapter.add("stroke", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#009900");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#009900");
            } return fill;

        })

        var bullet2 = series.bullets.push(new am4charts.Bullet());
        bullet2.tooltipText = `{dateX}: [bold]{valueY.formatNumber('###,###,###.##')} ${unit}[/]`;
        bullet2.adapter.add("fill", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#009900");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#009900");
            } return fill;
        })


        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        var range = valueAxis.createSeriesRange(series);
        range.value = min1;
        range.endValue = max1;
        range.contents.stroke = am4core.color("#009900");
        range.contents.fill = range.contents.stroke;

        var range2 = valueAxis.createSeriesRange(series);
        range2.value = min2;
        range2.endValue = max2;
        range2.contents.stroke = am4core.color("#009900");
        range2.contents.fill = range.contents.stroke;


        chart.cursor = new am4charts.XYCursor();
        chart.cursor.fullWidthLineX = true;
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        chart.legend = new am4charts.Legend();


        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
        chart.exporting.adapter.add("data", function (data, target) {
            var data = [];
            chart.series.each(function (series) {
                for (var i = 0; i < series.data.length; i++) {
                    series.data[i].name = series.name;
                    data.push(series.data[i]);
                }
            });
            return { data: data };
        });
    })
};


var tmpchart = function (sta, min1, max1, min2, max2) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end


    var chart = am4core.create("tmpchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "DD-MM-YYYY HH:mm:ss";
    var data = [];
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
    };
    dateAxis.dateFormats.setKey("DD MMMM YYYY");
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.tooltipDateFormat = "DD-MM-YYYY HH:mm:ss";

    axios.post("https://engrids.soc.cmu.ac.th/p3500/api/wtrq-data", { param: "val_tmp", sort: "DESC", stname: sta, limit: 10 }).then((r) => {
        // console.log(r.data.data)
        r.data.data.forEach(i => {
            // console.log(i.t)
            data.push({ date: i.datetime, value: Number(i.val_tmp) });
        });

        // console.log(data)

        chart.data = data;

        // Create axes

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "Temp (°C)";


        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 10;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#009900");
        series.name = 'Temp'

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        // bullet.circle.stroke = am4core.color("#00bcd4");
        bullet.adapter.add("stroke", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#009900");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#009900");
            } return fill;

        })

        var bullet2 = series.bullets.push(new am4charts.Bullet());
        bullet2.tooltipText = `{dateX}: [bold]{valueY.formatNumber('###,###,###.##')} ${unit}[/]`;
        bullet2.adapter.add("fill", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#009900");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#009900");
            } return fill;
        })


        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        var range = valueAxis.createSeriesRange(series);
        range.value = min1;
        range.endValue = max1;
        range.contents.stroke = am4core.color("#009900");
        range.contents.fill = range.contents.stroke;

        var range2 = valueAxis.createSeriesRange(series);
        range2.value = min2;
        range2.endValue = max2;
        range2.contents.stroke = am4core.color("#009900");
        range2.contents.fill = range.contents.stroke;


        chart.cursor = new am4charts.XYCursor();
        chart.cursor.fullWidthLineX = true;
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        chart.legend = new am4charts.Legend();


        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
        chart.exporting.adapter.add("data", function (data, target) {
            var data = [];
            chart.series.each(function (series) {
                for (var i = 0; i < series.data.length; i++) {
                    series.data[i].name = series.name;
                    data.push(series.data[i]);
                }
            });
            return { data: data };
        });
    })
};

var phchart = function (sta, min1, max1, min2, max2) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("phchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "DD-MM-YYYY HH:mm:ss";

    var data = [];
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
    };
    dateAxis.dateFormats.setKey("DD MMMM YYYY");
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.tooltipDateFormat = "DD-MM-YYYY HH:mm:ss";

    axios.post("https://engrids.soc.cmu.ac.th/p3500/api/wtrq-data", { param: "val_ph", sort: "DESC", stname: sta, limit: 10 }).then((r) => {
        // console.log(r.data.data) 
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.datetime, value: Number(i.val_ph) });
        });

        // console.log(data)

        chart.data = data;

        // Create axes

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 30;
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "pH";


        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 10;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#009900");
        series.name = 'pH'

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        // bullet.circle.stroke = am4core.color("#03a9f4");
        bullet.adapter.add("stroke", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#009900");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#009900");
            } return am4core.color("#009900");

        })

        var bullet2 = series.bullets.push(new am4charts.Bullet());
        bullet2.tooltipText = `{dateX}: [bold]{value.formatNumber('###,###,###.##')} ${unit}[/]`;
        bullet2.adapter.add("fill", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#009900");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#009900");
            } return am4core.color("#009900");
        })

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        var range = valueAxis.createSeriesRange(series);
        range.value = min1;
        range.endValue = max1;
        range.contents.stroke = am4core.color("#009900");
        range.contents.fill = range.contents.stroke;

        var range2 = valueAxis.createSeriesRange(series);
        range2.value = min2;
        range2.endValue = max2;
        range2.contents.stroke = am4core.color("#009900");
        range2.contents.fill = range.contents.stroke;

        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        // // chart.scrollbarY = new am4core.Scrollbar();
        // chart.scrollbarX = new am4core.Scrollbar();

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        chart.legend = new am4charts.Legend();


        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
        chart.exporting.adapter.add("data", function (data, target) {
            var data = [];
            chart.series.each(function (series) {
                for (var i = 0; i < series.data.length; i++) {
                    series.data[i].name = series.name;
                    data.push(series.data[i]);
                }
            });
            return { data: data };
        });
    })
};

$("#sta").on('change', function () {


    axios.post("https://engrids.soc.cmu.ac.th/p3500/api/wtrq-data", { param: "val_ec", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        console.log(r.data.data)
        let val_ec = r.data.data[0].val_ec;
        $("#ec").text(`${val_ec !== null ? val_ec : '-'}`)

        var testDate = r.data.data[0].datetime
        console.log(testDate)
        // var datenow = moment(testDate).format('MM/DD/YYYY')
        // var timenow = moment(testDate).format('HH:mm')
        // console.log(datenow)
        // console.log(timenow)
        $("#datenow").text(moment(r.data.data[0].ts).format('DD/MM/YYYY'))
        $("#timenow").text(moment(r.data.data[0].ts).format('HH:mm'))

    })
    axios.post("https://engrids.soc.cmu.ac.th/p3500/api/wtrq-data", { param: "val_do", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        console.log(r.data.data)
        let val_do = r.data.data[0].val_do;
        $("#do").text(`${val_do !== null ? val_do : '-'}`)
    })
    axios.post("https://engrids.soc.cmu.ac.th/p3500/api/wtrq-data", { param: "val_tmp", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        console.log(r.data.data)
        let val_tmp = r.data.data[0].val_tmp;
        $("#tmp").text(`${val_tmp !== null ? val_tmp : '-'}`)
    })

    axios.post("https://engrids.soc.cmu.ac.th/p3500/api/wtrq-data", { param: "val_ph", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        console.log(r.data.data)
        let val_ph = r.data.data[0].val_ph;
        $("#ph").text(`${val_ph >= 0 && val_ph !== null ? val_ph : '-'}`)
    })


    var sta = $("#sta").val()
    if (sta == "station_01") {
        $('#info_sta').html('<span style="color: #B30D02; font-weight: bold; font-size: 28px"> สถานีตรวจวัดที่ 1 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลเกาะขนุน อำเภอพนมสารคาม จังหวัดฉะเชิงเทรา <br> วันที่: <span id="datenow"></span> เวลา: <span id="timenow"></span> น. </span>')
        $('#info_table').html('<a type="button" class="btn btn-primary" style="text-align: right;"href="./data-wq1/index.html"> ตารางแสดงข้อมูลย้อนหลัง</a>')

    }
    else if (sta == "station_02") {
        $('#info_sta').html('<span style="color: #B30D02; font-weight: bold; font-size: 28px"> สถานีตรวจวัดที่ 2 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลบางละมุง อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow"></span> เวลา: <span id="timenow"></span> น. </span>')
        $('#info_table').html('<a type="button" class="btn btn-primary" style="text-align: right;"href="./data-wq2/index.html"> ตารางแสดงข้อมูลย้อนหลัง</a>')

    }
    else if (sta == "station_03") {
        $('#info_sta').html('<span style="color: #B30D02; font-weight: bold; font-size: 28px"> สถานีตรวจวัดที่ 3 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลบางบุตร อำเภอบ้านค่าย จังหวัดระยอง <br> วันที่: <span id="datenow"></span> เวลา: <span id="timenow"></span> น. </span> ')
        $('#info_table').html('<a type="button" class="btn btn-primary" style="text-align: right;"href="./data-wq3/index.html"> ตารางแสดงข้อมูลย้อนหลัง</a>')

    }
    else {
        $('#info_sta').text('')
        $('#info_table').text('')

    }


    if ($("#sta").val() == "station_01") {
        var sta = $("#sta").val()
        ecchart(sta);
        dochart("station_01", 0, 2.1, 1000, 10000);
        tmpchart("station_01", 0, 0, 35, 100);
        phchart("station_01", 0, 5, 9, 100);

    }
    else if ($("#sta").val() == "station_02") {
        var sta = $("#sta").val()
        ecchart(sta);
        dochart("station_02", 0, 2.1, 1000, 10000);
        tmpchart("station_02", 0, 0, 35, 100);
        phchart("station_02", 0, 5, 9, 100);

    }
    else if ($("#sta").val() == "station_03") {
        var sta = $("#sta").val()
        ecchart(sta);
        dochart("station_03", 0, 2.1, 1000, 10000);
        tmpchart("station_03", 0, 0, 35, 100);
        phchart("station_03", 0, 5, 9, 100);

    } else {
    }
})


ecchart()
dochart()
phchart()
tmpchart()