/*  

This code is based on following convention:

https://github.com/bumbeishvili/d3-coding-conventions

*/

d3.componentsSlider = function d3ComponentsSlider(params) {
    // exposed variables
    var attrs = {
      id : 0,
      width: 500,
      height: 50,
      marginTop: 0,
      marginBottom: 5,
      marginRight: 5,
      marginLeft: 10,
      container: "body",
      textColor : '#B4B4B4',
      textFont : 'proxima_nova_a_regular',
      textFontSize: 5,
      symbol: 'circle', // circle, line
      symbolSize : 4,
      symbolColor: '#21578A',
      sliderColor: '#64A0C8',
      sliderHeight: 8,
      sliderStartPosition : 10,
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
    var displaySlider;
    var hideSlider;
  
    //main chart object
    var main = function(selection) {
      selection.each(function scope() {
      
      //  ############## calculated properties  ##############
        var calc = {};
  
        calc.id = "ID" + Math.floor(Math.random() * 1000000);  // id for event handlings
        calc.chartWidth = attrs.width - attrs.marginRight - attrs.marginLeft;
        calc.chartHeight = attrs.height - attrs.marginBottom - attrs.marginTop;
        
      //  ####################### CHART HELPER FUNCS #################### //
      var chartHelpers = {};
      
      //  ##########   hide slider  #######
      hideSlider = function() {
          attrs.container.selectAll(".sliderContent" + attrs.id).remove();
      };
  
      //  ##########   show slider  #######
      displaySlider = function() {
        var step = 1;
        var rangeLabels = attrs.data;
        console.log("rangeLabels");
        console.log(rangeLabels);
        
        var range = [0, rangeLabels.length - 1];
        console.log("range");
        console.log(range);
       
        var rangeValues = d3.range(range[0], range[1], step).concat(range[1]);
        console.log("rangeValues");
        console.log(rangeValues);
        
        
       
        //check container type first and transform if necessary
        if (!(attrs.container instanceof d3.selection)) {
          attrs.container = d3.select(attrs.container);
        }
        // remove slider content if exists
        attrs.container.selectAll(".slider-total-wrapper" + attrs.id).remove();
        
        // total content wrapper
        var totalWrapper = attrs.container.patternify({ tag: 'g', selector : 'slider-total-wrapper' + attrs.id });

        var slider = totalWrapper.patternify({ tag: 'g', selector : 'slider' + attrs.id })
                                  .attr('transform', 'translate(' + attrs.marginLeft +', '+ 0 + ')');

        // using clamp here to avoid slider exceeding the range limits
        var xScale = d3.scaleLinear()
                        .domain(range)
                        .range([0, attrs.width - attrs.marginLeft - attrs.marginRight])
                        .clamp(true);

        // array useful for step sliders
        var xAxis = d3.axisBottom(xScale)
                      .tickValues(rangeValues)
                      .tickFormat(function (d) {
                            return rangeLabels[d];
                        });

        xScale.clamp(true);
        // drag behavior initialization
        var drag = d3.drag()
            .on('start.interrupt', function () {
                slider.interrupt();
            }).on('start drag', function () {
                dragged(d3.event.x);
            });

        // this is the main bar with a stroke (applied through CSS)
        var track = slider.patternify({ tag: 'line', selector : 'track' + attrs.id})
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1])
            .attr('stroke', attrs.sliderColor)
            .attr('stroke-wigth', attrs.sliderHeight)
            .attr('stroke-opacity', 1);

    

    var ticks = slider.patternify({ tag: 'g', selector : 'ticks' + attrs.id})
                            .attr('transform', 'translate(0, 1)')
                            .call(xAxis);

    

    // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
    // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
    var trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode()))
                        .attr('class', 'track-overlay')
                        .attr('stroke', attrs.sliderColor)
                        .attr('stroke-width', attrs.sliderHeight)
                        .attr('stroke-opacity', 1)
                        .attr('cursor', 'crosshair')
                        .call(drag);
    
    // drag handle
    var handle = slider.patternify({ tag: 'circle', selector : 'handle' + attrs.id})
                        .attr('r', attrs.symbolSize)
                        .attr('fill', attrs.symbolColor)
                        .attr('stroke', attrs.symbolColor)
                        .attr('cx', attrs.sliderStartPosition); // set x cord from ouside call
    
    d3.selectAll('.tick').selectAll('line').remove();
    d3.selectAll('.tick').selectAll('text')
    .attr('font-family', attrs.textFont)
    .attr('stroke', attrs.textFontSize)
    .attr('fill', attrs.textColor);
    
    
    function dragged(value) {
            
            var x = xScale.invert(value), index = null, midPoint, cx, xVal;
            
            if(step) {
                // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
                for (var i = 0; i < rangeValues.length - 1; i++) {
                    if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                        index = i;
                        break;
                    }
                }
                midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
                if (x < midPoint) {
                    cx = xScale(rangeValues[index]);
                    xVal = rangeValues[index];
                } else {
                    cx = xScale(rangeValues[index + 1]);
                    xVal = rangeValues[index + 1];
                }
            } else {
                // if step is null or 0, return the drag value as is
                cx = xScale(x);
                xVal = x.toFixed(3);
            }
            debugger;
            attrs.chartUpdateFunc({slider1SelectedValue : rangeLabels[xVal]});

            // console.log(xVal);
            // console.log(rangeLabels[xVal])
            // use xVal as drag value
            alert(slider1SelectedValue);
            handle.attr('cx', cx);
        }
      };   // <----- display end 
  
        
      // smoothly handle data updating
      updateData = function() {
        displaySlider();
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
  
    main.show = function(data, chartUpdateFunc) {
      if (data) {
        attrs.data = data;
      }
    
      debugger;
      if(chartUpdateFunc){
         attrs.chartUpdateFunc = chartUpdateFunc;
      }
      displaySlider();
    };
  
    main.hide = function() {
      hideSlider();
    };

    // main.onSliderChange = function (chartUpdateFunc) {
    //     debugger;
    //     attrs.chartUpdateFunc = chartUpdateFunc;
    //     return main;
    // }

    // run  visual
    main.run = function() {
      d3.selectAll(attrs.container).call(main);
      return main;
    };
  
    return main.run();
  };
  
  