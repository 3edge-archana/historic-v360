/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions

*/

d3.componentsLegend = function d3ComponentsLegend(params) {
    // exposed variables
    var attrs = {
      id : 0,
      width: 0,
      height: 0,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 5,
      marginLeft: 5,
      container: "body",
      textColor : '#B4B4B4',
      textFont : 'proxima_nova_a_regular',
      textFontSize: 10,
      symbol: 'rect', // circle, line
      symbolSize : 10,
      symbolPosition : 'left', // 'right'
      direction : 'vertical', // 'horizontal'
      textSymbolDistance : 5,
      verticalDistance : 20,
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
    var displayLegend;
    var hideLegend;
  
    //main chart object
    var main = function(selection) {
      selection.each(function scope() {
      
      //  ############## calculated properties  ##############
        var calc = {};
  
        calc.id = "ID" + Math.floor(Math.random() * 1000000);  // id for event handlings
        calc.chartWidth = attrs.width - attrs.marginRight - attrs.marginLeft;
        calc.chartHeight = attrs.height - attrs.marginBottom - attrs.marginTop;
        calc.legendOuterRadius = Math.min(calc.chartWidth, calc.chartHeight) / 2 - ( attrs.needLabel ? attrs.labelWidth : 0);
        calc.legendInnerRadius = calc.legendOuterRadius - attrs.legendWidth;
    

      //  ####################### CHART HELPER FUNCS #################### //
      var chartHelpers = {};
      
      //  ##########   hide legend  #######
      hideLegend = function() {
          attrs.container.selectAll(".legendContent" + attrs.id).remove();
      };
  
      //  ##########   show legend  #######
      displayLegend = function() {

          //check container type first and transform if necessary
          if (!(attrs.container instanceof d3.selection)) {
            attrs.container = d3.select(attrs.container);
          }

          // remove legend content if exists
          attrs.container.selectAll(".legend-total-wrapper" + attrs.id).remove();

          
          // total content wrapper
          var totalWrapper = attrs.container.patternify({ tag: 'g', selector : 'legend-total-wrapper' + attrs.id});

          // add dummy text for width and remove
          var dummyTexts =  totalWrapper.patternify({ tag: 'text', selector : 'dummy-text' + attrs.id, data : attrs.data})
                                        .attr("font-family", attrs.textFont)
                                        .attr("font-size", attrs.textFontSize)
                                        .text(d => d.label)
                                        .each(function(d,i) {
                                            var thisWidth = this.getComputedTextLength()
                                            d.textWidth  = thisWidth;
                                            this.remove(); // remove them just after displaying them
                                        });
          
          
          var maxLabelWidth = d3.max(attrs.data.map(d => d.textWidth)) * 1.2;
          var legendItemWidth = attrs.symbolSize + attrs.textSymbolDistance + maxLabelWidth + 2;
          var legendItemCountInRow = Math.floor(calc.chartWidth / legendItemWidth); 

          // console.log("chartWidth " + calc.chartWidth);
          // console.log("maxLabelWidth " + maxLabelWidth);  
          // console.log("legendItemWidth " + legendItemWidth);  
          // console.log("legendItemCountInRow " + legendItemCountInRow);  
          // console.log("----------");

          if(attrs.direction == 'vertical'){
            var legendItem = totalWrapper.patternify({ tag: 'g', selector : 'legend-item' + attrs.id, data : attrs.data})
                                            .attr('transform', function(d,i) { 
                                                var x = 0;
                                                var y = i * attrs.verticalDistance;
                                                
                                                // console.log('x ' + Math.floor(x))
                                                // console.log('y ' + Math.floor(y))
                                                // console.log("----------");

                                                return `translate ( ${ Math.floor(x) }, ${ Math.floor(y) }  )`;
                                            })

          }
          else{
            var legendItem = totalWrapper.patternify({ tag: 'g', selector : 'legend-item' + attrs.id, data : attrs.data})
                                        .attr('transform', function(d,i) { 
                                            var x = (i < legendItemCountInRow ? i * legendItemWidth : (Math.floor(i % legendItemCountInRow)  ) * legendItemWidth);
                                            var y = Math.floor(i / legendItemCountInRow) * attrs.verticalDistance;
                                            
                                            // console.log('x ' + Math.floor(x))
                                            // console.log('y ' + Math.floor(y))
                                            // console.log("----------");

                                            return `translate ( ${ Math.floor(x) }, ${ Math.floor(y) }  )`;
                                        })

          }

         
          var legendSymbol = legendItem.patternify({ tag : 'rect', selector : 'legend-symbol' + attrs.id, data: d => [d]})
                              .attr('x', 0)
                              .attr('y', 0)
                              .attr('width', attrs.symbolSize)
                              .attr('height', attrs.symbolSize)
                              .attr('fill', d => d.color);

         var legendText = legendItem.patternify({ tag : 'text', selector : 'legend-text' + attrs.id, data: d => [d]})
                                    .text(d => d.label)
                                    .attr('fill', attrs.textColor)
                                    .attr("font-family", attrs.textFont)
                                    .attr("font-size", attrs.textFontSize)
                                    .attr('alignment-baseline', 'middle')
                                    .attr('x', attrs.symbolSize + attrs.textSymbolDistance + 2)
                                    .attr('y', attrs.symbolSize / 2);

                           
      };   // <----- display end 
  
        
      // smoothly handle data updating
      updateData = function() {
        displayLegend();
      };
  
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
      displayLegend();
    };
  
    main.hide = function() {
      hideLegend();
    };

    // run  visual
    main.run = function() {
      d3.selectAll(attrs.container).call(main);
      return main;
    };
  
    return main.run();
  };
  
  