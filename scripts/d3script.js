/*  
 
 This code is based on following convention:
 
 https://github.com/bumbeishvili/d3-coding-conventions/blob/84b538fa99e43647d0d4717247d7b650cb9049eb/README.md
 
 
 */

function renderChart(params) {

    // Exposed variables
    var attrs = {
        id: "ID" + Math.floor(Math.random() * 1000000), // Id for event handlings
        svgWidth: 1120,
        svgHeight: 1400,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 0,
        marginLeft: 10,
        container: 'body',
        data: null,
        fontBold: 'proxima_nova_bold',
        fontregular: 'proxima_nova_a_regular',
        colorGrey1: '#B4B4B4',
        colorBlue1: '#21578A',
        colorBlue2: '#64A0C8',
        slider1SelectedValue: {},
        slider2SelectedValue: {},
        colors: ["#21578A", "#006890", "#3095B4", "#64A0C8", "#9760C2", "#FFA02F", "#ED2939", "#7AB800", ],
        // for slider 
        symbol: 'circle', // circle, line
        symbolSize: 4,
        symbolColor: '#21578A',
        sliderColor: '#64A0C8',
        sliderHeight: 5,
        textColor: '#B4B4B4',
        textFont: 'proxima_nova_a_regular',
        textFontSize: 5,
    };



    //InnerFunctions which will update visuals
    var updateData;

    //Main chart object
    var main = function (selection) {
        selection.each(function scope() {

            var browserInfo = GetBrowserInfo();
            var isFirefox = browserInfo.startsWith('Firefox')

            
            
            // count current date
            var lastTimeStampNewCurr = new Date();           
            lastTimeStampNewCurr.setHours('00');
            lastTimeStampNewCurr.setMinutes('00');
            lastTimeStampNewCurr.setSeconds('00');
            // -----------------------------
            var filteredvisitorCountCent = attrs.data.visitorCountCent.filter(d => d.timestamp > lastTimeStampNewCurr);
            //-----------------------------
            var filteredentryCountNew = attrs.data.entryCountNew.filter(d => d.timestamp > lastTimeStampNewCurr);
            // ----------------------------           
            var filteredwashRoomCountData = attrs.data.washRoomCountData.filter(d => d.timestamp > lastTimeStampNewCurr);
            // ------------------------------           
            var filteredVisitorData = attrs.data.visitorInfo.filter(d => d.timestamp > lastTimeStampNewCurr);


            if (attrs.isUpdate) {
                var sliderFilterDate = new Date();
                if (attrs.slider1SelectedValue.xVal != undefined) {
                    if (attrs.slider1SelectedValue.x == 0) {
                        sliderFilterDate.setDate(sliderFilterDate.getDate() - 1);
                    }
                    if (attrs.slider1SelectedValue.xVal == 1) {
                        sliderFilterDate.setDate(sliderFilterDate.getDate() - 7);
                    }
                    if (attrs.slider1SelectedValue.xVal == 2) {
                        sliderFilterDate.setDate(sliderFilterDate.getDate() - 30);
                    }
                    if (attrs.slider1SelectedValue.xVal == 3) {
                        sliderFilterDate.setDate(sliderFilterDate.getDate() - 365);
                    }
                    filteredVisitorData = attrs.data.visitorInfo.filter(d => d.timestamp > sliderFilterDate);
                    filteredwashRoomCountData = attrs.data.washRoomCountData.filter(d => d.timestamp > sliderFilterDate);
                    filteredentryCountNew = attrs.data.entryCountNew.filter(d => d.timestamp > sliderFilterDate);

                }

                if (attrs.slider2SelectedValue.xVal != undefined) {

                    filteredVisitorData = filteredVisitorData.filter(d => d.timestamp.getHours() < attrs.slider2SelectedValue.xVal * 2);
                    filteredwashRoomCountData = filteredwashRoomCountData.filter(d => d.timestamp.getHours() < attrs.slider2SelectedValue.xVal * 2);
                    filteredentryCountNew = filteredentryCountNew.filter(d => d.timestamp.getHours() < attrs.slider2SelectedValue.xVal * 2);
                }

            }

            // if(filteredVisitorData.length < 1){
            //        filteredVisitorData = attrs.data.visitorInfo;
            // }

            var nestedByGenderAndCam = d3.nest()
                    .key(function (d) {
                        return d.Gender;
                    })
                    .key(function (d) {
                        return d.Cam_id;
                    })
                    .entries(filteredVisitorData);

            var mappednestedByGenderAndCam = nestedByGenderAndCam.map(function (d, i) {

                var parent = {
                    "legend": d.key,
                    "backgroundColor": attrs.colors[i],
                }

                var total = d.values.reduce(function (accumulator, currentValue) {
                    return accumulator + currentValue.values.length;
                }, 0)

                parent.label = total;
                parent.value = Math.round(total / filteredVisitorData.length * 100);

                parent.children = d.values.map(function (c, i) {
                    return {
                        "legend": c.key,
                        "label": c.values.length,
                        "value": Math.round(c.values.length / total * 100)
                    }
                })

                return parent;

            })


            var nestedByEthnicityAndCam = d3.nest()
                    .key(function (d) {
                        return d.Ethnicity;
                    })
                    .key(function (d) {
                        return d.Cam_id;
                    })
                    .entries(filteredVisitorData);

            var mappednestedByEthnicityAndCam = nestedByEthnicityAndCam.map(function (d, i) {

                var parent = {
                    "legend": d.key,
                    "backgroundColor": attrs.colors[i],
                }

                var total = d.values.reduce(function (accumulator, currentValue) {
                    return accumulator + currentValue.values.length;
                }, 0)

                parent.label = total;
                parent.value = Math.round(total / filteredVisitorData.length * 100);

                parent.children = d.values.map(function (c, i) {
                    return {
                        "legend": c.key,
                        "label": c.values.length,
                        "value": Math.round(c.values.length / total * 100)
                    }
                })

                return parent;

            })

            var nestedByAgeAndCam = d3.nest()
                    .key(function (d) {
                        return d.Age;
                    })
                    .key(function (d) {
                        return d.Cam_id;
                    })
                    .entries(filteredVisitorData);

            var mappednestedByAgeAndCam = nestedByAgeAndCam.map(function (d, i) {

                var parent = {
                    "legend": d.key,
                    "backgroundColor": attrs.colors[i],
                }

                var total = d.values.reduce(function (accumulator, currentValue) {
                    return accumulator + currentValue.values.length;
                }, 0)

                parent.label = total;
                parent.value = Math.round(total / filteredVisitorData.length * 100);

                parent.children = d.values.map(function (c, i) {
                    return {
                        "legend": c.key,
                        "label": c.values.length,
                        "value": Math.round(c.values.length / total * 100)
                    }
                })

                return parent;

            })

            meanAnger = d3.mean(filteredVisitorData, function (d) {
                return d.Anger
            });
            meanDisappointed = d3.mean(filteredVisitorData, function (d) {
                return d.Disappointed
            });
            meanDisgust = d3.mean(filteredVisitorData, function (d) {
                return d.Disgust
            });
            meanFear = d3.mean(filteredVisitorData, function (d) {
                return d.Fear
            });
            meanJoy = d3.mean(filteredVisitorData, function (d) {
                return d.Joy
            });
            meanLaughing = d3.mean(filteredVisitorData, function (d) {
                return d.Laughing
            });
            meanRage = d3.mean(filteredVisitorData, function (d) {
                return d.Rage
            });
            meanSadness = d3.mean(filteredVisitorData, function (d) {
                return d.Sadness
            });
            meanSmiley = d3.mean(filteredVisitorData, function (d) {
                return d.Smiley
            });


            var pie4Data = [
                {
                    legend: "Anger",
                    value: (meanAnger),
                    label: (meanAnger),
                    backgroundColor: attrs.colors[0]
                },
                {
                    legend: "Disappointed",
                    value: (meanDisappointed),
                    label: (meanDisappointed),
                    backgroundColor: attrs.colors[0]
                },
                {
                    legend: "Disgust",
                    value: (meanDisgust),
                    label: (meanDisgust),
                    backgroundColor: attrs.colors[1]
                },
                {
                    legend: "Fear",
                    value: (meanFear),
                    label: (meanFear),
                    backgroundColor: attrs.colors[2]
                },
                {
                    legend: "Jou",
                    value: (meanJoy),
                    label: (meanJoy),
                    backgroundColor: attrs.colors[3]
                },
                {
                    legend: "Laughing",
                    value: (meanLaughing),
                    label: (meanLaughing),
                    backgroundColor: attrs.colors[4]
                },
                {
                    legend: "Rage",
                    value: (meanRage),
                    label: (meanRage),
                    backgroundColor: attrs.colors[5]
                },
                {
                    legend: "Sadness",
                    value: (meanSadness),
                    label: (meanSadness),
                    backgroundColor: attrs.colors[6]
                }, {
                    legend: "Smiley",
                    value: (meanSmiley),
                    label: (meanSmiley),
                    backgroundColor: attrs.colors[7]
                }];

            var total = pie4Data.reduce(function (accumulator, currentValue) {
                return accumulator + currentValue.value;
            }, 0)

            pie4Data.map(function (d) {
                d.value = Math.round((d.value / total * 100));
                d.label = (d.label + "").substring(0, 3);
                return d;
            });


            // test data
            var entryTotal = filteredentryCountNew.reduce(function (accumulator, currentValue) {
                return accumulator + (+currentValue.entryCount);
            }, 0);

            var exitTotal = filteredentryCountNew.reduce(function (accumulator, currentValue) {
                return accumulator + (+currentValue.exitCount)
            }, 0)


            var totalVisitors = entryTotal;


            var totalCountCent = filteredvisitorCountCent.reduce(function (accumulator, currentValue) {
                return accumulator + (+currentValue.count);
            }, 0)

            var rangeVisitors = totalCountCent;


            var maxEthnicity = Math.max.apply(Math, mappednestedByEthnicityAndCam.map(function (o) {
                return o.value;
            }))
            var max1 = mappednestedByEthnicityAndCam.find(function (o) {
                return o.value == maxEthnicity;
            });
            var ethnicity = max1 != undefined ? max1.legend : "N/A";

            var maxAge = Math.max.apply(Math, mappednestedByAgeAndCam.map(function (o) {
                return o.value;
            }))
            var max2 = mappednestedByAgeAndCam.find(function (o) {
                return o.value == maxAge;
            });
            var ageGroup = max2 != undefined ? max2.legend : "N/A";

            var maxSat = Math.max.apply(Math, pie4Data.map(function (o) {
                return o.value;
            }))
            if (isNaN(maxSat)) {
                maxSat='N/A';
              }
            var max3 = pie4Data.find(function (o) {
                return o.value == maxSat;
            });
            var satisfactionIndex = max3 != undefined ? max3.legend : "";


            var camIds = filteredentryCountNew.map(d => d.cam_id).filter(onlyUnique) //[198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208,209, 210];
            var restRoomIds = filteredwashRoomCountData.map(d => d.cam_id).filter(onlyUnique)  // [181,182,183,184,185,186,187,188,189,190, 191, 192, 193, 194];

            var slider1Data = ["Day", "Week", "Month", "Year"];
            var slider2Data = ["12:00 AM", "2:00 AM", "4:00 AM", "6:00 AM", "8:00 AM", "10:00 AM",
                "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM", "10:00 PM", "12:00 AM"];

            var timeRange = "last 15 minutes";


            var groupedZoneData = d3.nest().key(function (d) {
                return d.cam_id;
            })
                    .entries(filteredentryCountNew);

            var groupedRestroomData = d3.nest().key(function (d) {
                return d.cam_id;
            })
                    .entries(filteredwashRoomCountData);



            var zoneData1 = camIds.map(function (d, i) {
                var zoneValue = groupedZoneData.filter(z => z.key == d)[0];

                var total = 0;
                if (zoneValue != undefined) {
                    total = zoneValue.values.reduce(function (accumulator, currentValue) {
                        return accumulator + (+currentValue.entryCount);
                    }, 0)
                }

                return {
                    label: attrs.data.feedData.find(function (o) {
                        return o.cam_id == d;
                    }).location,
                    value: total
                }
            });

            var zoneData1Max = d3.max(zoneData1.map(function (d) {
                return d.value
            }));

            var zoneData2 = restRoomIds.map(function (d, i) {
                var restroomValue = groupedRestroomData.filter(z => z.key == d)[0];

                var total = 0;
                if (restroomValue != undefined) {
                    total = restroomValue.values.reduce(function (accumulator, currentValue) {
                        return accumulator + (+currentValue.count);
                    }, 0)
                }

                return {
                    label: attrs.data.feedData.find(function (o) {
                        return o.cam_id == d;
                    }).location,
                    value: total
                }
            });

            var zoneData2Max = d3.max(zoneData2.map(function (d) {
                return d.value
            }));

            var maxRestroom = Math.max.apply(Math, zoneData2.map(function (o) {
                return o.value;
            }))
            if (maxRestroom > 0) {
                var maxRestroomLabel = zoneData2.find(function (o) {
                    return o.value == maxRestroom;
                }).label
            }
            else
            {
                var maxRestroomLabel =  'N/A';                
            }

            var zoneCount1 = camIds.length;
            var zoneCount2 = restRoomIds.length;


            var legend1Data = mappednestedByGenderAndCam.map(function (d) {
                return  {"label": d.legend, "color": d.backgroundColor}
            });
            var legend2Data = mappednestedByEthnicityAndCam.map(function (d) {
                return  {"label": d.legend, "color": d.backgroundColor}
            });
            var legend3Data = mappednestedByAgeAndCam.map(function (d) {
                return  {"label": d.legend, "color": d.backgroundColor}
            });
            var legend4Data = pie4Data.map(function (d) {
                return  {"label": d.legend, "color": d.backgroundColor}
            });





            attrs.svgWidth = attrs.svgWidth > 1150 ? 1120 : (attrs.svgWidth < 600 ? 600 : attrs.svgWidth);

            //Calculated properties
            var calc = {}
            calc.id = "ID" + Math.floor(Math.random() * 1000000);  // id for event handlings
            calc.chartLeftMargin = attrs.marginLeft;
            calc.chartTopMargin = attrs.marginTop;
            calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
            calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;

            calc.chartFontSize1 = Math.floor(attrs.svgWidth / 40);
            calc.chartfontSize2 = Math.floor(attrs.svgWidth / 62);
            calc.chartfontSize3 = Math.floor(attrs.svgWidth / 80);
            calc.chartfontSize4 = Math.floor(attrs.svgWidth / 93);
            calc.chartfontSize5 = Math.floor(attrs.svgWidth / 124);

            //Drawing containers
            var container = d3.select(this);

            //Add svg
            var svg = container.patternify({tag: 'svg', selector: 'svg-chart-container'})
                    .attr('width', attrs.svgWidth)
                    .attr('height', attrs.svgHeight)
                    .attr('font-family', attrs.fontregular);



            //Add container g element
            var chart = svg.patternify({tag: 'g', selector: 'chart'})
                    .attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');

            // chart.patternify({ tag: 'rect', selector : 'header-background'})
            //       .attr('x', 0)
            //       .attr('y', 0)
            //       .attr('width', attrs.svgWidth)
            //       .attr('height', 50)
            //       .attr('fill', attrs.colorGrey1);

            // -----------------  layout by groups ------------------------// 



            var group4 = chart.patternify({tag: 'g', selector: 'little-pies'})
                    .attr('transform', 'translate(' + 0 + ',' + 250 + ')');

            var statGroup8 = group4.patternify({tag: 'g', selector: 'statistic-item8'})
                    .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

            var pie1Group = group4.patternify({tag: 'g', selector: 'little-pie1'})
                    .attr('transform', 'translate(' + (calc.chartWidth / 4) + ',' + 0 + ')');
            var pie1LegendGroup = group4.patternify({tag: 'g', selector: 'little-pie1-legend'})
                    .attr('transform', 'translate(' + (calc.chartWidth / 4) + ',' + 180 + ')');

            var pie2Group = group4.patternify({tag: 'g', selector: 'little-pie2'})
                    .attr('transform', 'translate(' + (calc.chartWidth / 2) + ',' + 0 + ')');
            var pie2LegendGroup = group4.patternify({tag: 'g', selector: 'little-pie2-legend'})
                    .attr('transform', 'translate(' + (calc.chartWidth / 2) + ',' + 180 + ')');

            var pie3Group = group4.patternify({tag: 'g', selector: 'little-pie3'})
                    .attr('transform', 'translate(' + (3 * calc.chartWidth / 4) + ',' + 0 + ')');
            var pie3LegendGroup = group4.patternify({tag: 'g', selector: 'little-pie3-legend'})
                    .attr('transform', 'translate(' + (3 * calc.chartWidth / 4) + ',' + 180 + ')');

            var group5 = chart.patternify({tag: 'g', selector: 'big-pies'})
                    .attr('transform', 'translate(' + 0 + ',' + 550 + ')');

            var statGroup7 = group5.patternify({tag: 'g', selector: 'statistic-item7'})
                    .attr('transform', 'translate(' + 0 + ',' + 0 + ')');
            var pie4Group = group5.patternify({tag: 'g', selector: 'big-pie4'})
                    .attr('transform', 'translate(' + calc.chartWidth / 3 + ',' + 0 + ')');
            var pie4LegendGroup = group5.patternify({tag: 'g', selector: 'little-pie4-legend'})
                    .attr('transform', 'translate(' + ((2 * calc.chartWidth / 3) - 100) + ',' + 50 + ')');

            var group6 = chart.patternify({tag: 'g', selector: 'visitor-count-bars'})
                    .attr('transform', 'translate(' + calc.chartWidth / 2 + ',' + 900 + ')');
            var barGroup1 = group6.patternify({tag: 'g', selector: 'visitor-count-bar1'})
                    .attr('transform', 'translate(' + 30 + ',' + 0 + ')');
            var barGroup2 = group6.patternify({tag: 'g', selector: 'visitor-count-bar2'})
                    .attr('transform', 'translate(' + (calc.chartWidth / 4 + 30) + ',' + 0 + ')');




            // and of layout


            // -------------  add elements to groups -----------------------//



            statGroup7.patternify({tag: 'text', selector: 'stat-value7'})
                    .text(maxSat + " % ")
                    .attr('x', calc.chartWidth / 6 + 30)
                    .attr('y', 150)
                    .attr('fill', attrs.colorBlue1)
                    .attr('font-family', attrs.fontBold)
                    .attr('font-size', calc.chartFontSize1);
            statGroup7.patternify({tag: 'text', selector: 'stat-value71'})
                    .text(satisfactionIndex)
                    .attr('x', calc.chartWidth / 6 + 50)
                    .attr('y', 180)
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', calc.chartfontSize3);

            statGroup7.patternify({tag: 'text', selector: 'stat-value7-text1', data: ['Visitor', 'Satisfaction', 'Index']})
                    .text(d => d)
                    .attr('x', calc.chartWidth / 7)
                    .attr('y', (d, i) => 100 + (i * 20))
                    .attr('text-anchor', 'end')
                    .attr('fill', attrs.colorBlue2)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', '18pt');

            statGroup7.patternify({tag: 'text', selector: 'stat-value7-text2', data: ['Visitor emotion snapshot', 'based visits in zones']})
                    .text(d => d)
                    .attr('x', calc.chartWidth / 7)
                    .attr('y', (d, i) => 160 + (i * 10))
                    .attr('text-anchor', 'end')
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', '9pt');


            statGroup8.patternify({tag: 'text', selector: 'stat-value8-text1', data: ['Visitor', 'Insights']})
                    .text(d => d)
                    .attr('x', calc.chartWidth / 7)
                    .attr('y', (d, i) => 50 + (i * 20))
                    .attr('text-anchor', 'end')
                    .attr('fill', attrs.colorBlue2)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', '18pt');

            statGroup8.patternify({tag: 'text', selector: 'stat-value8-text2', data: ['Visitor snapshot based on the', 'demographicts and ethnicity']})
                    .text(d => d)
                    .attr('x', calc.chartWidth / 7)
                    .attr('y', (d, i) => 90 + (i * 10))
                    .attr('text-anchor', 'end')
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', '9pt');

            statGroup8.patternify({tag: 'text', selector: 'stat-value8-text3', data: [ageGroup]})
                    .text(d => d)
                    .attr('x', calc.chartWidth / 7)
                    .attr('y', (d, i) => 130 + (i * 20))
                    .attr('text-anchor', 'end')
                    .attr('fill', attrs.colorBlue1)
                    .attr('font-family', attrs.fontBold)
                    .attr('font-size', '12pt');

            statGroup8.patternify({tag: 'text', selector: 'stat-value8-text4', data: ['Most visiting age', 'group']})
                    .text(d => d)
                    .attr('x', calc.chartWidth / 7)
                    .attr('y', (d, i) => 150 + (i * 15))
                    .attr('text-anchor', 'end')
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', '12pt');

            barGroup1.patternify({tag: 'text', selector: 'bar1-text'})
                    .text('Entry / Exit numbers')
                    .attr('x', 5)
                    .attr('y', -10)
                    .attr('font-family', attrs.fontregular)
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-size', calc.chartfontSize3)

            barGroup2.patternify({tag: 'text', selector: 'bar2-text'})
                    .text('Restroom numbers')
                    .attr('x', 5)
                    .attr('y', -10)
                    .attr('font-family', attrs.fontregular)
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-size', calc.chartfontSize3)

            barGroup1.patternify({tag: 'line', selector: 'bar1-line'})
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('y1', 0)
                    .attr('y2', (zoneCount1) * 27)
                    .attr('stroke', attrs.colorGrey1)
                    .attr('stroke-width', 1);

            barGroup2.patternify({tag: 'line', selector: 'bar2-line'})
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('y1', 0)
                    .attr('y2', (zoneCount2) * 27)
                    .attr('stroke', attrs.colorGrey1)
                    .attr('stroke-width', 1);


            barGroup1.patternify({tag: 'text', selector: 'bar1-zone-id', data: zoneData1})
                    .text(d => d.label)
                    .attr('font-size', '12px')
                    .attr('font-family', attrs.fontregular)
                    .attr('x', 5)
                    .attr('y', (d, i) => 12 + i * 27)
                    .attr('fill', attrs.colorGrey1);
            barGroup1.patternify({tag: 'rect', selector: 'bar1-rects', data: zoneData1})
                    .attr('x', 5)
                    .attr('y', (d, i) => (i + 1 / 2) * 27)
                    .attr('width', d => d.value > 0 ? (calc.chartWidth / 4 - 60) * d.value / zoneData1Max : 0)
                    .attr('height', 14)
                    .attr('fill', attrs.colorBlue2);


            barGroup1.patternify({tag: 'text', selector: 'bar1-zone-value', data: zoneData1})
                    .text(d => d.value)
                    .attr('font-size', '12px')
                    .attr('font-family', attrs.fontregular)
                    .attr('x', 10)
                    .attr('y', (d, i) => (i + 1) * 27 - 2)
                    .attr('fill', 'white');

            barGroup2.patternify({tag: 'text', selector: 'bar2-zone-id', data: zoneData2})
                    .text(d => d.label)
                    .attr('font-size', '12px')
                    .attr('font-family', attrs.fontregular)
                    .attr('x', 5)
                    .attr('y', (d, i) => 12 + i * 27)
                    .attr('fill', attrs.colorGrey1);

            barGroup2.patternify({tag: 'rect', selector: 'bar2-rects', data: zoneData2})
                    .attr('x', 5)
                    .attr('y', (d, i) => (i + 1 / 2) * 27)
                    .attr('width', d => d.value > 0 ? (calc.chartWidth / 4 - 60) * d.value / zoneData2Max : 0)
                    .attr('height', 14)
                    .attr('fill', attrs.colorBlue2);

            barGroup2.patternify({tag: 'text', selector: 'bar2-zone-value', data: zoneData2})
                    .text(d => d.value)
                    .attr('font-size', '12px')
                    .attr('font-family', attrs.fontregular)
                    .attr('x', 10)
                    .attr('y', (d, i) => (i + 1) * 27 - 2)
                    .attr('fill', 'white');
            
            /**line chart group start**/
            var lineChart = chart.patternify({tag: 'g', selector: 'line-chart'})
                    .attr('transform', 'translate(' + 50 + ',' + 1200 + ')').attr('id','lineChart');
            /**line chart group end**/
            
            var groupHeader = chart.patternify({tag: 'g', selector: 'dashboard-headermain'})
                    .attr('transform', 'translate(' + 0 + ',' + 0 + ')').attr('id','headerMain');
            var groupHRect = groupHeader.patternify({tag: 'rect', selector: 'dashboard-headerR'})
                    .attr("x", -10)
                    .attr("y", 0)
                    .attr("width", 1150)
                    .attr("height", 220)
                    .attr("fill", "#FFFFFF");
            var group1 = groupHeader.patternify({tag: 'g', selector: 'dashboard-header'})
                    .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

            var iconGroup = group1.patternify({tag: 'g', selector: 'dashboard-icon'})
                    .attr('transform', 'translate(' + calc.chartWidth / 12 + ',' + 0 + ')');
            var titleGroup = group1.patternify({tag: 'g', selector: 'dashboard-title'})
                    .attr('transform', 'translate(' + calc.chartWidth / 8 + ',' + 0 + ')');


            var group2 = groupHeader.patternify({tag: 'g', selector: 'statistic-data'})
                    .attr('transform', 'translate(' + 0 + ',' + 100 + ')');

            var statGroup1 = group2.patternify({tag: 'g', selector: 'statistic-item1'})
                    .attr('transform', 'translate(' + 10 + ',' + 0 + ')');
            var statGroup2 = group2.patternify({tag: 'g', selector: 'statistic-item2'})
                    .attr('transform', 'translate(' + calc.chartWidth / 6 + ',' + 0 + ')')
                    .attr('style', 'display:none');
            var statGroup3 = group2.patternify({tag: 'g', selector: 'statistic-item3'})
                    .attr('transform', 'translate(' + 1 * calc.chartWidth / 6 + ',' + 0 + ')');
            var statGroup4 = group2.patternify({tag: 'g', selector: 'statistic-item4'})
                    .attr('transform', 'translate(' + 2.3 * calc.chartWidth / 6 + ',' + 0 + ')');
            var statGroup5 = group2.patternify({tag: 'g', selector: 'statistic-item5'})
                    .attr('transform', 'translate(' + 3.6 * calc.chartWidth / 6 + ',' + 0 + ')');
            var statGroup6 = group2.patternify({tag: 'g', selector: 'statistic-item6'})
                    .attr('transform', 'translate(' + 5 * calc.chartWidth / 6 + ',' + 0 + ')');


            var group3 = groupHeader.patternify({tag: 'g', selector: 'sliders'})
                    .attr('transform', 'translate(' + 0 + ',' + 150 + ')');
            var sliderGroup1 = group3.patternify({tag: 'g', selector: 'slider1'})
                    .attr('transform', 'translate(' + 0 + ',' + 0 + ')');
            var sliderGroup2 = group3.patternify({tag: 'g', selector: 'slider2'})
                    .attr('transform', 'translate(' + 0 + ',' + 50 + ')');


            iconGroup.patternify({tag: 'image', selector: 'icon'})
                    .attr('xlink:href', "./assets/images/Logo_White.png")
                    .attr('width', calc.chartWidth / 24)
                    .attr('height', 50)

            titleGroup.patternify({tag: 'text', selector: 'title'})
                    .text('FOOTFALL MANAGEMENT DASHBOARD')
                    .attr('alignment-baseline', 'hanging')
                    .attr('fill', attrs.colorBlue1)
                    .attr('font-family', attrs.fontBold)
                    .attr('font-size', calc.chartFontSize1)
                    .attr('y', isFirefox ? 35 : 15)
                    .attr('x', 10);

            group1.patternify({tag: 'line', selector: 'title-line'})
                    .attr('x1', 8)
                    .attr('x2', calc.chartWidth - 18)
                    .attr('y1', 50)
                    .attr('y2', 50)
                    .attr('stroke', attrs.colorGrey1)
                    .attr('stroke-width', 1);


            statGroup1.patternify({tag: 'text', selector: 'stat-value1'})
                    .text(totalVisitors)
                    .attr('fill', attrs.colorBlue1)
                    .attr('font-family', attrs.fontBold)
                    .attr('font-size', calc.chartFontSize1);

            statGroup1.patternify({tag: 'text', selector: 'stat-label1'})
                    .attr('y', 20)
                    .text('Total Visitors')
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', calc.chartfontSize4);

            statGroup2.patternify({tag: 'text', selector: 'stat-value2'})
                    .text(rangeVisitors)
                    .attr('fill', attrs.colorBlue1)
                    .attr('font-family', attrs.fontBold)
                    .attr('font-size', calc.chartFontSize1);
            statGroup2.patternify({tag: 'text', selector: 'stat-label2'})
                    .attr('y', 20)
                    .text(timeRange)
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', calc.chartfontSize4);

            statGroup3.patternify({tag: 'text', selector: 'stat-value3'})
                    .text(ethnicity)
                    .attr('fill', attrs.colorBlue1)
                    .attr('font-family', attrs.fontBold)
                    .attr('font-size', calc.chartFontSize1);
            statGroup3.patternify({tag: 'text', selector: 'stat-label3'})
                    .attr('y', 20)
                    .text('Most Visiting Ethnicity')
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', calc.chartfontSize4);

            statGroup4.patternify({tag: 'text', selector: 'stat-value4'})
                    .text(ageGroup)
                    .attr('fill', attrs.colorBlue1)
                    .attr('font-family', attrs.fontBold)
                    .attr('font-size', calc.chartFontSize1);
            statGroup4.patternify({tag: 'text', selector: 'stat-label4'})
                    .attr('y', 20)
                    .text('Most Visiting Age Group')
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', calc.chartfontSize4);

            statGroup5.patternify({tag: 'text', selector: 'stat-value5'})
                    .text(maxSat + " % ")
                    .attr('fill', attrs.colorBlue1)
                    .attr('font-family', attrs.fontBold)
                    .attr('font-size', calc.chartFontSize1);
            statGroup5.patternify({tag: 'text', selector: 'stat-label5'})
                    .attr('y', 20)
                    .text('Visitor Satisfaction Index')
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', calc.chartfontSize4);

            if(maxRestroomLabel == 'N/A')
            {
                statGroup6.patternify({tag: 'text', selector: 'stat-value6'})
                        .text(maxRestroomLabel)
                        .attr('fill', attrs.colorBlue1)
                        .attr('font-family', attrs.fontBold)
                        .attr('font-size', 28);
            }
            else
            {
                statGroup6.patternify({tag: 'text', selector: 'stat-value6'})
                        .text(maxRestroomLabel)
                        .attr('fill', attrs.colorBlue1)
                        .attr('font-family', attrs.fontBold)
                        .attr('font-size', calc.chartFontSize2);
            }
            
            statGroup6.patternify({tag: 'text', selector: 'stat-label6'})
                    .attr('y', 20)
                    .text('Most Used Washroom')
                    .attr('fill', attrs.colorGrey1)
                    .attr('font-family', attrs.fontregular)
                    .attr('font-size', calc.chartfontSize4);

////    slider need refactor, user as component, სრული ნაგავი , წასაშლელია და კომპონენტზეა გადასაკეთებელი

            var step1 = 1;
            var rangeLabels1 = slider1Data;
            var range1 = [0, rangeLabels1.length - 1];
            var rangeValues1 = d3.range(range1[0], range1[1], step1).concat(range1[1]);


            var slider1 = sliderGroup1.patternify({tag: 'g', selector: 'slider' + 1})
                    .attr('transform', 'translate(' + 10 + ', ' + 0 + ')');

// using clamp here to avoid slider exceeding the range limits
            var xScale1 = d3.scaleLinear()
                    .domain(range1)
                    .range([0, calc.chartWidth - 30])
                    .clamp(true);

// array useful for step sliders
            var xAxis1 = d3.axisBottom(xScale1)
                    .tickValues(rangeValues1)
                    .tickFormat(function (d) {
                        return rangeLabels1[d];
                    });

            xScale1.clamp(true);
// drag behavior initialization
            var drag1 = d3.drag()
                    .on('start.interrupt', function () {
                        slider1.interrupt();
                    }).on('start drag', function () {
                dragged1(d3.event.x);
            });

// this is the main bar with a stroke (applied through CSS)
            var track1 = slider1.patternify({tag: 'line', selector: 'track' + 1})
                    .attr('x1', xScale1.range()[0])
                    .attr('x2', xScale1.range()[1])
                    .attr('stroke', attrs.sliderColor)
                    .attr('stroke-wigth', attrs.sliderHeight)
                    .attr('stroke-opacity', 1);


            var ticks = slider1.patternify({tag: 'g', selector: 'ticks' + 1})
                    .attr('transform', 'translate(0, 1)')
                    .call(xAxis1);



// this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
// try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
            var trackOverlay = d3.select(slider1.node().appendChild(track1.node().cloneNode()))
                    .attr('class', 'track-overlay1')
                    .attr('stroke', attrs.sliderColor)
                    .attr('stroke-width', attrs.sliderHeight)
                    .attr('stroke-opacity', 1)
                    .attr('cursor', 'crosshair')
                    .call(drag1);

// drag handle
            var handle1 = slider1.patternify({tag: 'circle', selector: 'handle' + 1})
                    .attr('r', attrs.symbolSize)
                    .attr('fill', attrs.symbolColor)
                    .attr('stroke', attrs.symbolColor)
                    .attr('cx', attrs.slider1SelectedValue.x != 'undefined' ? attrs.slider1SelectedValue.x : 0); // set x cord from ouside call

            d3.selectAll('.tick').selectAll('line').remove();
            d3.selectAll('.tick').selectAll('text')
                    .attr('font-family', attrs.textFont)
                    .attr('stroke', attrs.textFontSize)
                    .attr('fill', attrs.textColor);

//            var lineChart = chart.patternify({tag: 'g', selector: 'line-chart'})
//                    .attr('transform', 'translate(' + 50 + ',' + 1200 + ')').attr('id','lineChart');
            /***************line graph creation start*****************/
            var width = calc.chartWidth;
            var height = calc.chartHeight;
//            console.log("width", width);
//            console.log("height", height);
            var x = d3.scaleTime().rangeRound([0, 500]);
            
            var y = d3.scaleLinear().rangeRound([400, 0]);

            var line = d3.line()
                    .curve(d3.curveBasis)
                    .x(function (d) {
                        return x(d.date)
                    })
                    .y(function (d) {
                        return y(d.value)
                    })
            x.domain(d3.extent(attrs.data.linechartData, function (d) {
                return d.date
            }));
            y.domain(d3.extent(attrs.data.linechartData, function (d) {
                return d.value
            }));
            
            lineChart.append("g")
                    .attr("transform", "translate(0,400)")
                    .call(d3.axisBottom(x))
                    .select(".domain")
                    .remove();

            lineChart.append("g")
                    .call(d3.axisLeft(y))
                    .append("text")
                    .attr("fill", "#000")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Price ($)");

            lineChart.append("path")
                    .datum(attrs.data.linechartData)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-width", 1.5)
                    .attr("d", line);
            /***************line graph creation end*****************/

            function dragged1(value) {

                var x = xScale1.invert(value), index = null, midPoint, cx, xVal;

                if (step1) {
                    // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
                    for (var i = 0; i < rangeValues1.length - 1; i++) {
                        if (x >= rangeValues1[i] && x <= rangeValues1[i + 1]) {
                            index = i;
                            break;
                        }
                    }
                    midPoint = (rangeValues1[index] + rangeValues1[index + 1]) / 2;
                    if (x < midPoint) {
                        cx = xScale1(rangeValues1[index]);
                        xVal = rangeValues1[index];
                    } else {
                        cx = xScale1(rangeValues1[index + 1]);
                        xVal = rangeValues1[index + 1];
                    }
                } else {
                    // if step is null or 0, return the drag value as is
                    cx = xScale1(x);
                    xVal = x.toFixed(3);
                }

                // use xVal as drag value

                attrs.slider1SelectedValue = {
                    x: cx,
                    xVal: xVal
                };
                updateData();

                //handle1.attr('cx', cx);
            }


// -------------------------------------------------------------------


            var step2 = 1;
            var rangeLabels2 = slider2Data;
            var range2 = [0, rangeLabels2.length - 1];
            var rangeValues2 = d3.range(range2[0], range2[1], step2).concat(range2[1]);


            var slider2 = sliderGroup2.patternify({tag: 'g', selector: 'slider' + 2})
                    .attr('transform', 'translate(' + 10 + ', ' + 0 + ')');

// using clamp here to avoid slider exceeding the range limits
            var xScale2 = d3.scaleLinear()
                    .domain(range2)
                    .range([0, calc.chartWidth - 30])
                    .clamp(true);

// array useful for step sliders
            var xAxis2 = d3.axisBottom(xScale2)
                    .tickValues(rangeValues2)
                    .tickFormat(function (d) {
                        return rangeLabels2[d];
                    });

            xScale2.clamp(true);
// drag behavior initialization
            var drag2 = d3.drag()
                    .on('start.interrupt', function () {
                        slider2.interrupt();
                    }).on('start drag', function () {
                dragged2(d3.event.x);
            });

// this is the main bar with a stroke (applied through CSS)
            var track2 = slider2.patternify({tag: 'line', selector: 'track' + 2})
                    .attr('x1', xScale2.range()[0])
                    .attr('x2', xScale2.range()[1])
                    .attr('stroke', attrs.sliderColor)
                    .attr('stroke-opacity', 1);


            var ticks = slider2.patternify({tag: 'g', selector: 'ticks' + 2})
                    .attr('transform', 'translate(0, 1)')
                    .call(xAxis2);



// this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
// try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
            var trackOverlay = d3.select(slider2.node().appendChild(track2.node().cloneNode()))
                    .attr('class', 'track-overlay2')
                    .attr('stroke', attrs.sliderColor)
                    .attr('stroke-width', attrs.sliderHeight)
                    .attr('stroke-opacity', 1)
                    .attr('cursor', 'crosshair')
                    .call(drag2);

// drag handle
            var handle2 = slider2.patternify({tag: 'circle', selector: 'handle' + 2})
                    .attr('r', attrs.symbolSize)
                    .attr('fill', attrs.symbolColor)
                    .attr('stroke', attrs.symbolColor)
                    .attr('cx', attrs.slider2SelectedValue.x != 'undefined' ? attrs.slider2SelectedValue.x : 0); // set x cord from ouside call

            d3.selectAll('.tick').selectAll('line').remove();
            d3.selectAll('.tick').selectAll('text')
                    .attr('font-family', attrs.textFont)
                    .attr('stroke', attrs.textFontSize)
                    .attr('fill', attrs.textColor);

            function dragged2(value) {

                var x = xScale2.invert(value), index = null, midPoint, cx, xVal;

                if (step2) {
                    // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
                    for (var i = 0; i < rangeValues2.length - 1; i++) {
                        if (x >= rangeValues2[i] && x <= rangeValues2[i + 1]) {
                            index = i;
                            break;
                        }
                    }
                    midPoint = (rangeValues2[index] + rangeValues2[index + 1]) / 2;
                    if (x < midPoint) {
                        cx = xScale2(rangeValues2[index]);
                        xVal = rangeValues2[index];
                    } else {
                        cx = xScale2(rangeValues2[index + 1]);
                        xVal = rangeValues2[index + 1];
                    }
                } else {
                    // if step is null or 0, return the drag value as is
                    cx = xScale2(x);
                    xVal = x.toFixed(3);
                }

                // use xVal as drag value


                attrs.slider2SelectedValue = {
                    x: cx,
                    xVal: xVal
                };
                updateData();
                //handle2.attr('cx', cx);
            }

            // -------------- components initialize and show -----------------//
            var pie1 = d3.componentsPie({
                id: 1,
                width: calc.chartWidth / 6,
                height: 200,
                pieWidth: calc.chartWidth / 60,
                labelWidth: calc.chartWidth / 120,
                needLabel: true,
                isNested: true,
            })
                    .container(pie1Group);

            var pie2 = d3.componentsPie({
                id: 2,
                width: calc.chartWidth / 6,
                height: 200,
                pieWidth: calc.chartWidth / 60,
                labelWidth: calc.chartWidth / 120,
                needLabel: true,
                isNested: true,
            })
                    .container(pie2Group);


            var pie3 = d3.componentsPie({
                id: 3,
                width: calc.chartWidth / 6,
                height: 200,
                pieWidth: calc.chartWidth / 60,
                labelWidth: calc.chartWidth / 120,
                needLabel: true,
                isNested: true,
            })
                    .container(pie3Group);

            var pie4 = d3.componentsPie({
                id: 4,
                width: calc.chartWidth / 4,
                height: 300,
                pieWidth: calc.chartWidth / 50,
                labelWidth: calc.chartWidth / 100,
                needLabel: true,
                isNested: false,
            })
                    .container(pie4Group);

            var legend1 = d3.componentsLegend({
                id: 1,
                width: calc.chartWidth / 4,
                height: 50,
                textFontSize: calc.chartWidth / 120,
                symbolSize: calc.chartWidth / 100,
                direction: 'horizontal'
            })
                    .container(pie1LegendGroup);

            var legend2 = d3.componentsLegend({
                id: 2,
                width: calc.chartWidth / 4,
                height: 50,
                textFontSize: calc.chartWidth / 120,
                symbolSize: calc.chartWidth / 100,
                direction: 'horizontal'
            })
                    .container(pie2LegendGroup);

            var legend3 = d3.componentsLegend({
                id: 3,
                width: calc.chartWidth / 4,
                height: 50,
                textFontSize: calc.chartWidth / 120,
                symbolSize: calc.chartWidth / 100,
                direction: 'horizontal'
            }).container(pie3LegendGroup);

            var legend4 = d3.componentsLegend({
                id: 4,
                width: calc.chartWidth / 6,
                height: 200,
                direction: 'vertical',
                textFontSize: calc.chartWidth / 80,
                symbolSize: calc.chartWidth / 80,
            }).container(pie4LegendGroup);            

            // var slider1 = d3.componentsSlider({ width : calc.chartWidth - 10})
            //                  .container(sliderGroup1);
            // var slider2 = d3.componentsSlider({ width : calc.chartWidth - 10})
            //                  .container(sliderGroup2);

            pie1.show(mappednestedByGenderAndCam);
            pie2.show(mappednestedByEthnicityAndCam);
            pie3.show(mappednestedByAgeAndCam);
            pie4.show(pie4Data);
            legend1.show(legend1Data);
            legend2.show(legend2Data);
            legend3.show(legend3Data);
            legend4.show(legend4Data);
            // slider1.show(slider1Data);
            // slider2.show(slider2Data);

            // Smoothly handle data updating
            updateData = function () {
                main.run(true);                
            }

            handleWindowResize();


            //#########################################  UTIL FUNCS ##################################
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            function  GetBrowserInfo() {
                var ua = navigator.userAgent, tem,
                        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                if (/trident/i.test(M[1])) {
                    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE ' + (tem[1] || '');
                }
                if (M[1] === 'Chrome') {
                    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                    if (tem != null)
                        return tem.slice(1).join(' ').replace('OPR', 'Opera');
                }
                M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
                if ((tem = ua.match(/version\/(\d+)/i)) != null)
                    M.splice(1, 1, tem[1]);
                return M.join(' ');
            }
            ;

            function handleWindowResize() {
                d3.select(window).on('resize.' + attrs.id, function () {
                    setDimensions();
                });
            }


            function setDimensions() {
                setSvgWidthAndHeight();
                container.call(main);
            }

            function setSvgWidthAndHeight() {
                var containerRect = container.node().getBoundingClientRect();
                if (containerRect.width > 0)
                    attrs.svgWidth = containerRect.width;
                if (containerRect.height > 0)
                    attrs.svgHeight = containerRect.height;
            }


            function debug() {
                if (attrs.isDebug) {
                    //Stringify func
                    var stringified = scope + "";

                    // Parse variable names
                    var groupVariables = stringified
                            //Match var x-xx= {};
                            .match(/var\s+([\w])+\s*=\s*{\s*}/gi)
                            //Match xxx
                            .map(d => d.match(/\s+\w*/gi).filter(s => s.trim()))
                            //Get xxx
                            .map(v => v[0].trim())

                    //Assign local variables to the scope
                    groupVariables.forEach(v => {
                        main['P_' + v] = eval(v)
                    })
                }
            }            
            debug();
        });
    };

    //----------- PROTOTYEPE FUNCTIONS  ----------------------
    d3.selection.prototype.patternify = function (params) {
        var container = this;
        var selector = params.selector;
        var elementTag = params.tag;
        var data = params.data || [selector];

        // Pattern in action
        var selection = container.selectAll('.' + selector).data(data, (d, i) => {
            if (typeof d === "object") {
                if (d.id) {
                    return d.id;
                }
            }
            return i;
        })
        selection.exit().remove();
        selection = selection.enter().append(elementTag).merge(selection)
        selection.attr('class', selector);
        return selection;
    }

    //Dynamic keys functions
    Object.keys(attrs).forEach(key => {
        // Attach variables to main function
        return main[key] = function (_) {
            var string = `attrs['${key}'] = _`;
            if (!arguments.length) {
                return eval(` attrs['${key}'];`);
            }
            eval(string);
            return main;
        };
    });

    //Set attrs as property
    main.attrs = attrs;

    //Debugging visuals
    main.debug = function (isDebug) {
        attrs.isDebug = isDebug;
        if (isDebug) {
            if (!window.charts)
                window.charts = [];
            window.charts.push(main);
        }
        return main;
    }

    //Exposed update functions
    main.data = function (value) {
        if (!arguments.length)
            return attrs.data;
        attrs.data = value;
        if (typeof updateData === 'function') {
            updateData();
        }
        return main;
    }

    // Run  visual
    main.run = function (isUpdate) {
        attrs.isUpdate = isUpdate;
        d3.selectAll(attrs.container).call(main);
        return main;
    }

    return main;
}
