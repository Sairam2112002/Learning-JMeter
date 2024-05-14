/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.18339753757836694, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25103820598006643, 500, 1500, "S01_JMT_T04_AddTableToCart"], "isController": false}, {"data": [0.13102159468438537, 500, 1500, "S01_JMT_T05_STEP02_SelectAChair"], "isController": false}, {"data": [0.23235049833887042, 500, 1500, "S01_JMT_T05_STEP03_AddChairToCart"], "isController": false}, {"data": [0.06478405315614617, 500, 1500, "S01_JMT_T01_LaunchApplication"], "isController": false}, {"data": [0.5756756756756757, 500, 1500, "S01_JMT_T06_STEP03_SelectACountry"], "isController": false}, {"data": [0.0014553014553014554, 500, 1500, "S01_JMT_T06_STEP04_EnterDetailsAndPlaceOrder"], "isController": false}, {"data": [0.08305647840531562, 500, 1500, "S01_JMT_T03_SelectATable"], "isController": false}, {"data": [0.049003322259136214, 500, 1500, "S01_JMT_T05_STEP01_NavigateToChairs"], "isController": false}, {"data": [0.16576651433319484, 500, 1500, "S01_JMT_T06_STEP01_OpenCart"], "isController": false}, {"data": [0.10070598006644518, 500, 1500, "S01_JMT_T02_NavigateToTables"], "isController": false}, {"data": [0.362993762993763, 500, 1500, "S01_JMT_T06_STEP02_PlaceAnOrder"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 26478, 0, 0.0, 8072.573910416202, 20, 126517, 2094.0, 9404.700000000004, 64014.700000000004, 78829.84000000003, 14.258235722378505, 104.00278403757986, 13.613741872447541], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["S01_JMT_T04_AddTableToCart", 2408, 0, 0.0, 2173.142026578076, 25, 17000, 1530.0, 4498.1, 5822.749999999993, 8403.379999999983, 1.3519355472587935, 0.9532229221640512, 0.9809454214973472], "isController": false}, {"data": ["S01_JMT_T05_STEP02_SelectAChair", 2408, 0, 0.0, 2139.3301495016553, 45, 12295, 2039.0, 3142.299999999997, 3794.649999999999, 6413.559999999998, 1.3382855828072542, 12.69863027366773, 0.7292610890687966], "isController": false}, {"data": ["S01_JMT_T05_STEP03_AddChairToCart", 2408, 0, 0.0, 2515.4435215946855, 25, 18693, 1673.5, 5179.2, 7695.199999999999, 12388.449999999986, 1.3304124665394081, 0.9380485042183137, 0.9848170406610073], "isController": false}, {"data": ["S01_JMT_T01_LaunchApplication", 2408, 0, 0.0, 2785.4069767441874, 60, 16600, 2580.0, 4306.1, 5089.949999999997, 6494.8399999999965, 1.358362248360291, 14.646240579640756, 0.4549982921753709], "isController": false}, {"data": ["S01_JMT_T06_STEP03_SelectACountry", 2405, 0, 0.0, 906.3804573804579, 20, 5675, 769.0, 1664.4, 2170.7999999999993, 3454.88, 1.3426573114250366, 1.3570803880126103, 0.8470279523247791], "isController": false}, {"data": ["S01_JMT_T06_STEP04_EnterDetailsAndPlaceOrder", 2405, 0, 0.0, 65760.50145530146, 430, 126517, 64725.0, 83061.6, 91767.89999999998, 107794.52000000003, 1.2983682669078052, 10.734309415194417, 5.936199902487414], "isController": false}, {"data": ["S01_JMT_T03_SelectATable", 2408, 0, 0.0, 2781.542774086378, 49, 12400, 2410.5, 4687.999999999999, 5699.099999999999, 9872.689999999977, 1.3550143126200338, 12.74272496620905, 0.7449932207080849], "isController": false}, {"data": ["S01_JMT_T05_STEP01_NavigateToChairs", 2408, 0, 0.0, 3439.165697674417, 51, 18480, 2876.0, 6202.0, 7973.549999999999, 12482.599999999991, 1.3397173908447453, 12.20399462708232, 0.7365829014117105], "isController": false}, {"data": ["S01_JMT_T06_STEP01_OpenCart", 2407, 0, 0.0, 2567.495222268384, 35, 22204, 1901.0, 4898.800000000001, 7013.5999999999985, 11953.040000000005, 1.334011700729134, 11.303667693050668, 0.724326665630272], "isController": false}, {"data": ["S01_JMT_T02_NavigateToTables", 2408, 0, 0.0, 2333.8484219269135, 50, 9170, 2201.5, 3580.2999999999997, 4398.199999999999, 5718.639999999999, 1.3562285132401246, 13.168930836041943, 0.7099008623991278], "isController": false}, {"data": ["S01_JMT_T06_STEP02_PlaceAnOrder", 2405, 0, 0.0, 1448.4598752598765, 35, 9390, 1284.0, 2398.8, 3099.7, 6093.72000000001, 1.3423740317324941, 16.88784172803167, 1.063009660837061], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 26478, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
