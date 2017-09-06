///<reference path="../../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['moment', 'lodash'], function(exports_1) {
    var moment_1, lodash_1;
    var ResponseParser;
    return {
        setters:[
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            ResponseParser = (function () {
                function ResponseParser() {
                }
                ResponseParser.parseQueryResult = function (result) {
                    var data = [];
                    for (var i = 0; i < result.data.length; i++) {
                        for (var j = 0; j < result.data[i].data.value.length; j++) {
                            data.push({
                                target: result.data[i].data.value[j].name.value,
                                datapoints: ResponseParser.convertDataToPoints(result.data[i].data.value[j].data)
                            });
                        }
                    }
                    return data;
                };
                ResponseParser.convertDataToPoints = function (timeSeriesData) {
                    var dataPoints = [];
                    for (var k = 0; k < timeSeriesData.length; k++) {
                        var epoch = ResponseParser.dateTimeToEpoch(timeSeriesData[k].timeStamp);
                        var aggKey = ResponseParser.getKeyForAggregationField(timeSeriesData[k]);
                        if (aggKey) {
                            dataPoints.push([timeSeriesData[k][aggKey], epoch]);
                        }
                    }
                    return dataPoints;
                };
                ResponseParser.dateTimeToEpoch = function (dateTime) {
                    return moment_1.default(dateTime).valueOf();
                };
                ResponseParser.getKeyForAggregationField = function (dataObj) {
                    var keys = lodash_1.default.keys(dataObj);
                    if (keys.length < 2) {
                        return;
                    }
                    return lodash_1.default.intersection(keys, ['total', 'average', 'maximum']);
                };
                ResponseParser.parseResponseValues = function (result, textFieldName, valueFieldName) {
                    var list = [];
                    for (var i = 0; i < result.data.value.length; i++) {
                        list.push({
                            text: lodash_1.default.get(result.data.value[i], textFieldName),
                            value: lodash_1.default.get(result.data.value[i], valueFieldName)
                        });
                    }
                    return list;
                };
                return ResponseParser;
            })();
            exports_1("default", ResponseParser);
        }
    }
});
//# sourceMappingURL=response_parser.js.map