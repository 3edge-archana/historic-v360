/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions

*/

d3.componentsPie = function d3ComponentsPie(params) {
    // exposed variables
    var attrs = {
      id : 0,
      width: 0,
      height: 0,
      marginTop: 10,
      marginBottom: 10,
      marginRight: 20,
      marginLeft: 20,
      transform: { x: 0, y: 0, k: 1 },
      labelWidth : 0, 
      pieWidth : 10,
      container: "body",
      isNested: false,
      needLabel: false,
      hoverColorImpact: 1,
      animationDuration : 1000,
      showLabelOnMoreThanPercent : 50,
      labelFontSize : '8pt',
      labelFontFamily : 'proxima_nova_a_regular',
      labelStroke : '#B4B4B4',
      labelLineStroke : '#B4B4B4',
      labelLineStrokeWidth : 1,
      pieSegmentStroke : 'white',
      pieSegmentStrokeWidth : 1,

      data: []
    };
  
    /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */
    
    var attrKeys = Object.keys(attrs);
    attrKeys.forEach(function(key) {
      if (params && params[key]) {
        attrs[key] = params[key];
      }
    });
   

    //innerFunctions which will update visuals
    var updateData;
    var displayPie;
    var hidePie;
  
    //main chart object
    var main = function(selection) {
      selection.each(function scope() {
    
      //  ############## calculated properties  ##############
        var calc = {};
  
        calc.id = "ID" + Math.floor(Math.random() * 1000000);  // id for event handlings
        calc.chartWidth = attrs.width - attrs.marginRight - attrs.marginLeft;
        calc.chartHeight = attrs.height - attrs.marginBottom - attrs.marginTop;
        calc.pieOuterRadius = Math.min(calc.chartWidth, calc.chartHeight) / 2 - ( attrs.needLabel ? attrs.labelWidth : 0);
        calc.pieInnerRadius = calc.pieOuterRadius - attrs.pieWidth;
    

      //  ##############   ARCS   ###############
      var arcs = {}
      arcs.pie = d3.arc()
                  .outerRadius(calc.pieOuterRadius)
                  .innerRadius(calc.pieInnerRadius);

      arcs.outerArc = d3.arc()
                    .outerRadius(calc.pieOuterRadius * 1.2)
                    .innerRadius(calc.pieOuterRadius * 1.2);


      //  ##########     layouts  #######
      var layouts = {};
      layouts.pie = d3.pie()
                      .sort(null)
                      .value(function (d) { return d.value; });
      
      //###############  STARTUP ANIMATIONS ###############
      var tweens = {}
      tweens.pieIn = function (endData) {
            var startData = { startAngle: 0, endAngle: 0 };
            var interpolation = d3.interpolate(startData, endData);
            this._currentData = interpolation(0);  // for continuous transition out + in
            return function (currentData) {
                return arcs.pie(interpolation(currentData));
            }
      };

      tweens.pieOut = function (endData) {
            var endData = { startAngle: 2 * Math.PI, endAngle: 2 * Math.PI };
            var interpolation = d3.interpolate(this._currentData, endData); // for continuous transition out + in
            return function (t) {
                return arcs.pie(interpolation(t));
            }
      };
        
      // ##################### UTILITY FUNCTIONS ################# //
      var utils = {};
      utils.humanizeAngle = function humanizeAngle(angle) {
            return angle * 180 / Math.PI;
      };

      utils.getProportionByAngles = function (angles) {
            var angleDiff = angles.endAngle - angles.startAngle;
            var humanizedDiffAngle = utils.humanizeAngle(angleDiff);
            var proportion = Math.round(humanizedDiffAngle / 360 * 100);
            return proportion;
      };
      

      //  ####################### CHART HELPER FUNCS #################### //
      var chartHelpers = {};
      chartHelpers.isLabelDisplayed = function isLabelDisplayed(d) {
          var proportion = utils.getProportionByAngles(d);
          return proportion >= attrs.showLabelOnMoreThanPercent
      };

      chartHelpers.pieText = function pieText(d) {
          var proportion = utils.getProportionByAngles(d);
          var propText = ' ' + proportion + '%';
          var labelDisplayed = chartHelpers.isLabelDisplayed(d)
          if (!labelDisplayed) {
              return propText;
          }
          return d.data.label + propText;
      };


      chartHelpers.rotateByAngles = function rotateByAngles(d) {

          var medianAngle = (d.startAngle + d.endAngle) / 2;
          var humamizedAngle = utils.humanizeAngle(medianAngle);
          var result = humamizedAngle;
          if (humamizedAngle < 180) {
              result -= 90;
          } else if (humamizedAngle >= 180) {
              result += 90;
          }
          return ' rotate(' + result + ')';
      };
          
      
      chartHelpers.translateByCentroid = function translateByCentroid(angles) {
          var centroid = arcs.pie.centroid(angles);
          var left = centroid[0];
          var top = centroid[1];
          var translate = "translate(" + left + "," + top + ") ";
          return translate
      };
      
      chartHelpers.transformPieText = function transformPieText(d) {
          var translate = chartHelpers.translateByCentroid(d);
          var rotate = chartHelpers.rotateByAngles(d);
          return translate + rotate;;
      };

      chartHelpers.midAngle = function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
      }

      //  ##########   hide pie  #######
      hidePie = function() {
          attrs.container.selectAll(".pieContent" + attrs.id).remove();
      };
  
      //  ##########   show pie  #######
      displayPie = function() {
 
        attrs.data =  attrs.data.filter(d => d.value > 0);

        //  ##############   process data for nested pie  ###############
        if(attrs.isNested){
          attrs.data.forEach(function (p, i) {
            p.id = 'p' + i;
            if (p.children) {
                p.children.forEach(function (ch, j) {
                    ch.id = "ch" + j;
                    ch.backgroundColor = p.backgroundColor;
                    ch.parents = attrs.data;
                })
             }
           }); 
        }
        
      
          //check container type first and transform if necessary
          if (!(attrs.container instanceof d3.selection)) {
            attrs.container = d3.select(attrs.container);
          }

          // remove pie content if exists
          attrs.container.selectAll(".total-wrapper" + attrs.id).remove();

          
          // total content wrapper
          var totalWrapper = attrs.container.patternify({ tag: 'g', selector : 'total-wrapper' + attrs.id})
                                  .attr("transform", ` translate(${calc.chartWidth/2}, ${calc.chartHeight/2})`);


          //pie wrapper
          var pieWrapper = totalWrapper.patternify({ tag : "g", selector : "pie-wrapper" + attrs.id});
         
         
         var pieData = layouts.pie(attrs.data);

         pieData.map(function(d){
             d.label = attrs.data[d.index].label;
             return d;

         });
          var segmentGroups = pieWrapper.patternify({ tag: 'g', selector : 'segment-group' + attrs.id, data : pieData })
                                            .on('mouseover', segmentMouseOver)
                                            .on('mouseout', segmentMouseOut);
                                           
          
          if(attrs.isNested){
             segmentGroups
             .style("cursor", "pointer")
             .on('click', segmentMouseClick);
          }

          var segmentPaths = segmentGroups.patternify({ tag : 'path', 
                                                        selector: 'segment-path' + attrs.id, 
                                                        data: d => [d] })
                                            .attr('fill', function (d, i) { return d.data.backgroundColor; })
                                            .attr('stroke-width', attrs.pieSegmentStrokeWidth)
                                            .attr('stroke', attrs.pieSegmentStroke)
                                            .attr('d', arcs.pie)
                                            .transition()
                                            .duration(attrs.animationDuration)
                                            .attrTween('d', tweens.pieIn)
                                            .on("end", function (d) {
                                                d._animationEnded = true; // set flag, to prevent clicks when transitioning
                                            })
          
        if(attrs.needLabel) {

          var labelLines = segmentGroups.patternify({ tag : 'polyline', selector: 'segment-line' + attrs.id, data: d => [d] })
                                            .attr('stroke', attrs.labelLineStroke)
                                            .attr('stroke-width', attrs.labelLineStrokeWidth)
                                            .attr('fill', 'none')
                                            .attr("points", function(d) {  
                                                   var pos = arcs.outerArc.centroid(d);
                                                   pos[0] = pos[0] > 0 ?  pos[0] - 10 : pos[0] + 10;
                                                   
                                                   var pos1 = arcs.outerArc.centroid(d);
                                                   pos1[0] = pos1[0] > 0 ?  pos1[0] - 5 : pos1[0] + 5;
                                                return [arcs.pie.centroid(d), pos, pos1]; 
                                              })
                                            .attr('opacity', 0)
                                            .transition()
                                            .delay((attrs.animationDuration))
                                            .attr('opacity', 1);

          var labels = segmentGroups.patternify({ tag : 'text', selector: 'segment-text' + attrs.id, data: d => [d] })
                                            //.text(d => chartHelpers.pieText )                   // text format with percent 
                                            //.attr('transform', chartHelpers.transformPieText)   // text rotation by angle
                                            .text(d => d.label) 
                                            .attr('fill', attrs.labelStroke)
                                            .attr('font-size',  attrs.labelFontSize)
                                            .attr('font-family', attrs.labelFontFamily)
                                            .attr('text-anchor', 'middle')
                                            .attr('alignment-baseline', 'middle')
                                            .attr("transform", function(d) { 
                                                return "translate(" + arcs.outerArc.centroid(d) + ")";
                                             })
                                            .attr('opacity', 0)
                                            .transition()
                                            .delay((attrs.animationDuration))
                                            .attr('opacity', 1);
       }                            
      };   // <----- display end 
  
        
      // smoothly handle data updating
      updateData = function() {
        displayPie();
      };
  
    /*#########################   EVENT LISTENERS  ####################*/

      function segmentMouseClick(d) {
           if (d._animationEnded) { //prevent clicking when animating
              var children = d.data.children;
              var color = d.data.backgroundColor;

              if (children) {
                  attrs.data = children; 
                  updateData();
              } else {
                  attrs.data = d.data.parents;
                  updateData();
              }
          }
      }


      function segmentMouseOut(d) {
        if (d._animationEnded)  //prevent mouse out when animating
        {
            var currSegment = d3.select(this)

            var path = currSegment.select('path');

            var oldPathColor = d3.rgb(path.attr('fill'))
                .darker(-attrs.hoverColorImpact);

            path.attr('fill', d.data.backgroundColor);
        }
      }


     function segmentMouseOver(d, i) {
        if (d._animationEnded) { //prevent mouse over when animating
            var currSegment = d3.select(this)

            var path = currSegment.select('path');

            var newPathColor = d3.rgb(path.attr('fill'))
                .darker(attrs.hoverColorImpact);

            path.attr('fill', newPathColor);
        }
      }



      //#########################################  UTIL FUNCS ##################################
  
        // catch scope variables and assign it to global variable for runtime variable inspection
        function debug() {
          if (attrs.isDebug) {
            //stringify func
            var stringified = scope + "";
  
            // parse variable names
            var groupVariables = stringified
              //match var x-xx= {};
              .match(/var\s+([\w])+\s*=\s*{\s*}/gi)
              //match xxx
              .map(d => d.match(/\s+\w*/gi).filter(s => s.trim()))
              //get xxx
              .map(v => v[0].trim());
  
            //assign local variables to the scope
            groupVariables.forEach(v => {
              main["P_" + v] = eval(v);
            });
          }
        }
        debug();
      });
    };
  
    //----------- PROTOTYEPE FUNCTIONS  ----------------------
    d3.selection.prototype.patternify = function(params) {
      var container = this;
      var selector =  params.selector;
      var elementTag = params.tag;
      var data = params.data || [selector];
  
      // pattern in action
      var selection = container.selectAll("." + selector).data(data);
      selection.exit().remove();
      selection = selection
        .enter()
        .append(elementTag)
        .merge(selection);
      selection.attr("class", selector);
      return selection;
    };
  
    //dinamic keys functions
    Object.keys(attrs).forEach(key => {
      // Attach variables to main function
      return (main[key] = function(_) {
        var string = `attrs['${key}'] = _`;
        if (!arguments.length) {
          return eval(` attrs['${key}'];`);
        }
        eval(string);
        return main;
      });
    });
  
    //set attrs as property
    main.attrs = attrs;
  
    //debugging visuals
    main.debug = function(isDebug) {
      attrs.isDebug = isDebug;
      if (isDebug) {
        if (!window.charts) window.charts = [];
        window.charts.push(main);
      }
      return main;
    };
  
    //exposed update functions
    main.data = function(value) {
      if (!arguments.length) return attrs.data;
      attrs.data = value;
      if (typeof updateData === "function") {
        updateData();
      }
      return main;
    };
  
    main.show = function(data) {
      if (data) {
        attrs.data = data;
      }
      displayPie();
    };
  
    main.hide = function() {
      hidePie();
    };

    // run  visual
    main.run = function() {
      d3.selectAll(attrs.container).call(main);
      return main;
    };
  
    return main.run();
  };
  
  