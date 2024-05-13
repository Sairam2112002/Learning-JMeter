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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2771194244803567, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45402276967597, 500, 1500, "S01_JMT_T04_AddTableToCart"], "isController": false}, {"data": [0.18799025207524178, 500, 1500, "S01_JMT_T05_STEP02_SelectAChair"], "isController": false}, {"data": [0.4463673749143249, 500, 1500, "S01_JMT_T05_STEP03_AddChairToCart"], "isController": false}, {"data": [0.06570079579636752, 500, 1500, "S01_JMT_T01_LaunchApplication"], "isController": false}, {"data": [0.7315544890107797, 500, 1500, "S01_JMT_T06_STEP03_SelectACountry"], "isController": false}, {"data": [0.0010284538909838875, 500, 1500, "S01_JMT_T06_STEP04_EnterDetailsAndPlaceOrder"], "isController": false}, {"data": [0.13513307695236645, 500, 1500, "S01_JMT_T03_SelectATable"], "isController": false}, {"data": [0.07162167307619084, 500, 1500, "S01_JMT_T05_STEP01_NavigateToChairs"], "isController": false}, {"data": [0.38403671821436736, 500, 1500, "S01_JMT_T06_STEP01_OpenCart"], "isController": false}, {"data": [0.09614286258234017, 500, 1500, "S01_JMT_T02_NavigateToTables"], "isController": false}, {"data": [0.4748981068830229, 500, 1500, "S01_JMT_T06_STEP02_PlaceAnOrder"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 288852, 0, 0.0, 6075.149744505955, 16, 125363, 2116.0, 9483.200000000114, 76923.0, 90724.80000000003, 19.978348696647423, 145.73781827423278, 19.090356534584885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["S01_JMT_T04_AddTableToCart", 26263, 0, 0.0, 1120.3399459315344, 23, 15696, 976.0, 1564.0, 2015.9500000000007, 3795.980000000003, 1.8250290331314032, 1.286845527710345, 1.3242154019693677], "isController": false}, {"data": ["S01_JMT_T05_STEP02_SelectAChair", 26262, 0, 0.0, 1724.9274236539495, 44, 14696, 1625.0, 2405.9000000000015, 2700.0, 3387.9900000000016, 1.824044253805666, 17.309279817978624, 0.9939616148667594], "isController": false}, {"data": ["S01_JMT_T05_STEP03_AddChairToCart", 26262, 0, 0.0, 1177.5166019343606, 22, 17366, 903.0, 1899.0, 2668.0, 6297.950000000008, 1.8223824538336024, 1.2849614433866503, 1.348990136724483], "isController": false}, {"data": ["S01_JMT_T01_LaunchApplication", 26263, 0, 0.0, 2278.5300232265845, 56, 16500, 2284.0, 3200.0, 3609.0, 4563.850000000024, 1.8279983247814917, 19.709937499112556, 0.612308032617238], "isController": false}, {"data": ["S01_JMT_T06_STEP03_SelectACountry", 26253, 0, 0.0, 579.4260846379427, 16, 8783, 521.0, 990.0, 1184.0, 1986.9600000000064, 1.8239561666920716, 1.8435682396554596, 1.1506598473467562], "isController": false}, {"data": ["S01_JMT_T06_STEP04_EnterDetailsAndPlaceOrder", 26253, 0, 0.0, 51596.03847179363, 290, 125363, 53022.5, 73375.0, 79524.55, 94795.05000000015, 1.8164764439268328, 15.01913743588052, 8.31518268101489], "isController": false}, {"data": ["S01_JMT_T03_SelectATable", 26263, 0, 0.0, 1864.7200624452805, 44, 16692, 1754.5, 2585.0, 3033.9000000000015, 4080.950000000008, 1.826974273770248, 17.18246910939665, 1.0044790196607907], "isController": false}, {"data": ["S01_JMT_T05_STEP01_NavigateToChairs", 26263, 0, 0.0, 2123.6269276167945, 50, 22188, 1909.0, 2928.0, 3502.0, 5433.970000000005, 1.8237382627620535, 16.614723399617247, 1.0026998456396836], "isController": false}, {"data": ["S01_JMT_T06_STEP01_OpenCart", 26254, 0, 0.0, 1372.386836291625, 35, 24698, 1100.0, 2101.0, 2805.9000000000015, 6802.990000000002, 1.8234261715204085, 15.452189274531069, 0.9900634290677218], "isController": false}, {"data": ["S01_JMT_T02_NavigateToTables", 26263, 0, 0.0, 1936.1713056391159, 46, 19390, 1885.0, 2683.0, 2982.9500000000007, 3582.0, 1.827805202163412, 17.749560441226734, 0.956741785507411], "isController": false}, {"data": ["S01_JMT_T06_STEP02_PlaceAnOrder", 26253, 0, 0.0, 1064.332000152359, 36, 11013, 998.0, 1604.9000000000015, 1847.0, 2822.0, 1.8239187846544047, 22.947889877121348, 1.4443262282098743], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 288852, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
