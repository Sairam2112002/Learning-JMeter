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

    var data = {"OkPercent": 99.05694334461162, "KoPercent": 0.943056655388381};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.17054207760420417, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.17530767216548834, 500, 1500, "S01_JMT_T04_AddTableToCart"], "isController": false}, {"data": [0.14251655629139073, 500, 1500, "S01_JMT_T05_STEP02_SelectAChair"], "isController": false}, {"data": [0.19898909284384145, 500, 1500, "S01_JMT_T05_STEP03_AddChairToCart"], "isController": false}, {"data": [0.08700607902735562, 500, 1500, "S01_JMT_T01_LaunchApplication"], "isController": false}, {"data": [0.5299272040981396, 500, 1500, "S01_JMT_T06_STEP03_SelectACountry"], "isController": false}, {"data": [0.005035383777898748, 500, 1500, "S01_JMT_T06_STEP04_EnterDetailsAndPlaceOrder"], "isController": false}, {"data": [0.11046057767369243, 500, 1500, "S01_JMT_T03_SelectATable"], "isController": false}, {"data": [0.08585725572820647, 500, 1500, "S01_JMT_T05_STEP01_NavigateToChairs"], "isController": false}, {"data": [0.16257013091103392, 500, 1500, "S01_JMT_T06_STEP01_OpenCart"], "isController": false}, {"data": [0.11344321400978624, 500, 1500, "S01_JMT_T02_NavigateToTables"], "isController": false}, {"data": [0.27518130539887187, 500, 1500, "S01_JMT_T06_STEP02_PlaceAnOrder"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41673, 393, 0.943056655388381, 12417.049504475426, 4, 161006, 3926.5, 58761.600000000006, 70448.00000000003, 115291.37000000026, 23.488676984331864, 170.51667203653645, 22.157754489730152], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["S01_JMT_T04_AddTableToCart", 3819, 38, 0.9950248756218906, 6704.2977219167315, 4, 64208, 2691.0, 10396.0, 47921.0, 60965.80000000004, 2.153530543875013, 1.5192454170512928, 1.563815470796513], "isController": false}, {"data": ["S01_JMT_T05_STEP02_SelectAChair", 3775, 41, 1.086092715231788, 6893.165562913907, 4, 63771, 2471.0, 28934.400000000005, 43444.39999999999, 60643.359999999986, 2.128494536957995, 20.039776616084144, 1.1597756846915852], "isController": false}, {"data": ["S01_JMT_T05_STEP03_AddChairToCart", 3759, 25, 0.6650704974727321, 6421.052939611593, 7, 64076, 2382.0, 11813.0, 41308.0, 57295.000000000044, 2.1194874437707143, 1.4950308478739156, 1.569807278668901], "isController": false}, {"data": ["S01_JMT_T01_LaunchApplication", 3948, 84, 2.127659574468085, 27260.544326241183, 55, 67762, 29690.5, 57351.899999999994, 61676.55, 64198.2, 2.2262283305035573, 23.620880219414314, 0.7456995286745314], "isController": false}, {"data": ["S01_JMT_T06_STEP03_SelectACountry", 3709, 0, 0.0, 2994.1809112968454, 19, 61344, 890.0, 2688.0, 15557.0, 51189.500000000015, 2.092301582511089, 2.103815252562632, 1.3201381268443027], "isController": false}, {"data": ["S01_JMT_T06_STEP04_EnterDetailsAndPlaceOrder", 3674, 49, 1.3336962438758846, 55905.57702776257, 7, 161006, 55279.0, 100941.0, 122990.5, 140567.75, 2.07628687118714, 17.023816556395715, 9.508909823121437], "isController": false}, {"data": ["S01_JMT_T03_SelectATable", 3843, 26, 0.6765547749154307, 5299.698933125161, 45, 65812, 3207.0, 7078.6, 10654.19999999995, 60383.72, 2.167094672093708, 20.277514305439954, 1.1913036894110103], "isController": false}, {"data": ["S01_JMT_T05_STEP01_NavigateToChairs", 3797, 58, 1.5275217276797473, 7655.923360547798, 4, 66532, 4001.0, 12234.400000000001, 43900.899999999914, 61033.34, 2.140918322584574, 19.291535060321515, 1.1769993792069862], "isController": false}, {"data": ["S01_JMT_T06_STEP01_OpenCart", 3743, 23, 0.6144803633449105, 6727.981832754497, 9, 67182, 2347.0, 10662.199999999993, 44644.99999999988, 60657.399999999994, 2.1104492894501217, 17.804294909492565, 1.145820463415026], "isController": false}, {"data": ["S01_JMT_T02_NavigateToTables", 3883, 26, 0.6695853721349472, 6006.899304661343, 5, 65490, 2977.0, 6879.199999999997, 35653.799999999865, 53020.919999999955, 2.1896447790533946, 21.169417297488874, 1.1387871881532492], "isController": false}, {"data": ["S01_JMT_T06_STEP02_PlaceAnOrder", 3723, 23, 0.61778135911899, 5270.616975557357, 33, 62623, 1618.0, 11809.999999999998, 35340.19999999998, 57112.399999999994, 2.0991819787228767, 26.27816496314873, 1.6673256270763464], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /Added!/", 63, 16.03053435114504, 0.1511770210927939], "isController": false}, {"data": ["500/Internal Server Error", 330, 83.96946564885496, 0.791879634295587], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41673, 393, "500/Internal Server Error", 330, "Test failed: text expected to contain /Added!/", 63, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["S01_JMT_T04_AddTableToCart", 3819, 38, "Test failed: text expected to contain /Added!/", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_JMT_T05_STEP02_SelectAChair", 3775, 41, "500/Internal Server Error", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_JMT_T05_STEP03_AddChairToCart", 3759, 25, "Test failed: text expected to contain /Added!/", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_JMT_T01_LaunchApplication", 3948, 84, "500/Internal Server Error", 84, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["S01_JMT_T06_STEP04_EnterDetailsAndPlaceOrder", 3674, 49, "500/Internal Server Error", 49, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_JMT_T03_SelectATable", 3843, 26, "500/Internal Server Error", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_JMT_T05_STEP01_NavigateToChairs", 3797, 58, "500/Internal Server Error", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_JMT_T06_STEP01_OpenCart", 3743, 23, "500/Internal Server Error", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_JMT_T02_NavigateToTables", 3883, 26, "500/Internal Server Error", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["S01_JMT_T06_STEP02_PlaceAnOrder", 3723, 23, "500/Internal Server Error", 23, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
