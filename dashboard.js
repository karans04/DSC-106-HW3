var data = new Array();
$.getJSON('https://raw.githubusercontent.com/karans04/DSC-106-HW3/master/assets/springfield_converted_json.js?token=AE32GN65TP5ZAFUSTG2ICRC52MVPI' , function(d) {
    for (var i = 0; i < d.length; i++) {
      if (d[i].type == 'power'){
        if (d[i].fuel_tech != 'rooftop_solar'){
          data.push(d[i])
        } 
      }
      
      if (d[i].type == 'price' || d[i].type == 'temperature'){
        data.push(d[i])
      }
    }
    get_vals(data); 
    
    energy_data = clean_data.slice(0,7)
    temp_data = clean_data.slice(8,9)
    price_data = clean_data.slice(7,8)
    
    

  area_options.series = energy_data.reverse();
  Highcharts.chart(area_options);
  
  price_options.series = price_data;
  Highcharts.chart(price_options);
  
  temp_options.series = temp_data;
  Highcharts.chart(temp_options);
  
  updateData(clean_data)
  renderPie(0)
     
})

var color_type = {
  'black_coal': '#130F10', 
  'distillate': '#EA4D33', 
  'gas_ccgt': '#F5B361',
  'hydro': '#4383BA',
  'wind': '#437605',
  'exports': '#845C98',
  'pumps': '#6B9DBC',
  'temperature': 'red',
  'price': 'red',
};

var clean_data = [];
var energy_data = [];
var price_data = [];
var temp_data = [];
function get_vals(jsonData) {
  clean_data = jsonData.map(function(d) {
      var data_vals = new Array();
      if (d.type === 'price' || d.type === 'temperature') {
          d.fuel_tech = d.type
          for (var i = 0; i < d.history.data.length; i = i+1) {
            data_vals.push(d.history.data[i]);
          };
      } else {
          if (d.fuel_tech === 'exports' || d.fuel_tech === 'pumps'){
            var x = 0;
            for (var i = 1; i < d.history.data.length; i = i+6) {
              data_vals.push(d.history.data[i] * (-1));
            };
            
          } else{
            for (var i = 1; i < d.history.data.length; i = i+6) {
              data_vals.push(d.history.data[i]);
            };
          }
        }
      return {
          data: data_vals,
          name: d.fuel_tech,
          pointStart: (d.history.start + 5*60) * 1000,
          pointInterval: 30*60 *1000,
          color: color_type[d.fuel_tech],
          fillOpacity: 1,
          tooltip: {
              valueSuffix: ' ' + d.units
          }
      };
      
  });
}

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
  var thisChart = this.chart;

  if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
      Highcharts.each(Highcharts.charts, function (chart) {
          if (chart !== thisChart) {
              if (chart.xAxis[0].setExtremes) { 
                  chart.xAxis[0].setExtremes(
                      e.min,
                      e.max,
                      undefined,
                      false,
                      { trigger: 'syncExtremes' }
                  );
              }
          }
      });
  }
}



/*
 to plot generated chart
*/

var area_options = {
  chart: {
      renderTo: 'generated',
      type: 'areaspline',
      backgroundColor: 'transparent'
  },

  title: {
      text: 'Generation MW',
      align: 'left',
      style: {
        color: "#333", 
        fontSize: "14px"
    },
  },
  xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%b \'%y'
      },
      crosshair: {
        color: 'red',
        zIndex: 5
      },
      events: {
          setExtremes: syncExtremes
      },
      minorTickInterval: 1000*60*30,
  },
  yAxis: {
      title: {
          enabled: false
      },
      labels: {
          formatter: function (){
              return this.value;
          },
          align: 'left',
          x: -10,
          y: 0
      },
      tickInterval: 1000,
      showLastLabel: false,
      min: -300
  },
  legend: {
      enabled: false
  },
  tooltip: {
    shared: true,
    formatter: function () {
        return Highcharts.dateFormat('%e %b, %I:%M %P',
        new Date(this.points[0].x)) + ' Total '+ this.points[0].total + ' MW'
    },
    positioner: function () {
        return {
            x: this.chart.chartWidth - this.label.width,
            y: 5
        };
    },
    borderWidth: 0,
    backgroundColor: 'none',
    shadow: false,
    style: {
        color: "#333",
        fontSize: '10px'
    },
    snap: 100
  },
  plotOptions: {
      areaspline: {
          stacking: 'normal',
          marker: {
              lineColor: '#red'
          }
      },
      series: {
          states: {
              hover: {
                  enabled: false
              }
          }
      }
  },
};



/*
 to plot price chart
*/
var price_options = {
  chart: {
      renderTo: 'price',
      type: 'line',
      backgroundColor: 'transparent'
  },
  title: {
      align: 'left',
      text: 'Price $/MWh',
      style: {
          color: "#333", 
          fontSize: "14px"
      }
  },
  xAxis: {
      type: 'datetime',
      tickInterval: 1000*60*60,
      dateTimeLabelFormats: {
          day: '%e. %b',
          month: '%b \'%y'
      },
      crosshair: {
          color: 'red'
      },
      visible: false,
      events: {
          setExtremes: syncExtremes
      }
  },
  yAxis: {
      title: {
          enabled: false
      },
      labels: {
          align: 'left',
          x: 5,
          y: -3
      },
      tickInterval: 100,
      showLastLabel: false,
      max: 350
  },
  legend: {
      enabled: false
  },
  tooltip: {
    formatter: function () {
        return Highcharts.dateFormat('%e %b, %I:%M %P',
        new Date(this.point.x)) + ' $'+ this.point.y + '.00'
    },
    positioner: function () {
        return {
            x: this.chart.chartWidth - this.label.width,
            y: 5
        };
    },
    borderWidth: 0,
    backgroundColor: 'none',
    shadow: false,
    style: {
        color: "#333",
        fontSize: '10px'
    },
    snap: 100
    },
    plotOptions: {
        line: {
            step: 'center',
            lineWidth: 1
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
};



var temp_options = {
  chart: {
      renderTo: 'temp',
      type: 'spline',
      backgroundColor: 'transparent'
  },
  title: {
      align: 'left',
      text: 'Temperature °F',
      style: {
          color: "#333", 
          fontSize: "14px"
      }
  },
  xAxis: {
      type: 'datetime',
      tickInterval: 1000*60*30,
      dateTimeLabelFormats: {
          day: '%e. %b',
          month: '%b \'%y'
      },
      crosshair: {
          color: 'red',
          width: 1
      },
      visible: false,
      events: {
          setExtremes: syncExtremes
      }
  },
  yAxis: {
      title: {
          enabled: false
      },
      tickInterval: 20,
      maxPadding: 0.001,
      min: 0, 
      max: 100,
      labels: {
          align: 'left',
          reserveSpace: false,
          x: 5,
          y: -3
      },
      showLastLabel: false
  },
  legend: {
      enabled: false
  },
  tooltip: {
    formatter: function () {
        return Highcharts.dateFormat('%e %b, %I:%M %P',
        new Date(this.point.x)) + ' ' + this.point.y + ' °F'
    },
    positioner: function () {
        return {
            x: this.chart.chartWidth - this.label.width,
            y: 5
        };
    },
    borderWidth: 0,
    backgroundColor: 'none',
    shadow: false,
    style: {
        color: "#333",
        fontSize: '10px'
    },
    snap: 100
    },
    plotOptions: {
        spline: {
            lineWidth: 1
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
};







['mouseleave'].forEach(function (eventType) {
  document.getElementById('DashboardChartElem').addEventListener(
      eventType,
      function (e) {
          var chart,
              point,
              i,
              event;
          
              for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                  chart = Highcharts.charts[i];
                  event = chart.pointer.normalize(e);
                  point = chart.series[0].searchPoint(event, true);
                  
                  if (point) {
                      point.onMouseOut(); 
                      chart.tooltip.hide(point);
                      chart.xAxis[0].hideCrosshair(); 
                  }
              }
          }
  )
});

['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
  document.getElementById('DashboardChartElem').addEventListener(
      eventType,
      function (e) {
          var chart,
              point,
              i,
              event,
              idx;

          for (i = 0; i < Highcharts.charts.length; i = i + 1) {
              chart = Highcharts.charts[i];
              event = chart.pointer.normalize(e);
              point = chart.series[0].searchPoint(event, true);
              idx = chart.series[0].data.indexOf( point );

              if (point) {
                  point.highlight(e);
                  renderPie(idx);
              }
          }
      }
  );
});


Highcharts.Point.prototype.highlight = function (event) {
  event = this.series.chart.pointer.normalize(event);
  this.onMouseOver(); 
  this.series.chart.tooltip.refresh([this]); 
  this.series.chart.xAxis[0].drawCrosshair(event, this); 
  this.series.chart.yAxis[0].drawCrosshair(event, this);
};



function renderPie(nodeId) {
  // console.log(energy_data)
  var pieData = global_data['name'].map(function(d, idx) {
    
      if (global_data['name'] != 'pumps' && global_data['name'] != 'exports') {
          return {
              name: d.split('.')[d.split('.').length - 1],
              y: global_data['data'][nodeId][idx],
              color: color_type[d.split('.')[d.split('.').length - 1]]
          }
      }
  });
  // console.log(global_data)
  var legendData = pieData
  pieData = pieData.filter(item => item['name'] != 'exports')
  pieData = pieData.filter(item => item['name'] != 'pumps')
  
  pieData = pieData.filter(item => item['name'] != 'temperature')
  priceData = pieData.filter(item => item['name'] == 'price')
  // console.log(priceData)
  pieData = pieData.filter(item => item['name'] != 'price')
  pie_options.series[0].data = pieData;
  var total = 0;
  for (var i = 0; i < pie_options.series[0].data.length; i++) {
      total = total + pie_options.series[0].data[i].y
  }
  pie_options.title.text = Math.round(total) + ' MW';
  Highcharts.chart(pie_options)
  bar_options.series[0].data = pieData
  Highcharts.chart(bar_options)
  updateLegend(legendData, total, priceData)
}




var pie_options = {
  chart: {
      renderTo: 'pieChart',
      type: 'pie',
      backgroundColor: 'transparent',
      animation: false
  },
  plotOptions: {
      pie: {
          innerSize: '50%',
          size: '75%',
          dataLabels: {
              enabled: false
          }
      },
      series: {
          animation: false
      }
  },
  title: {
      align: 'center',
      verticalAlign: 'middle',
      text: '',
      style: {
          fontSize: '13px'
      }
  },
  series: [{
      name: 'Energy',
      colorByPoint: true,
      data: []
  }]
};

var bar_options = {
  chart: {
      renderTo: 'barChart',
      type: 'bar',
      backgroundColor: 'transparent',
  },
  plotOptions: {
      series: {
          animation: false
      }
  },
  yAxis: {
    title: {
        enabled: true
    },

  },
  title: {
      align: 'center',
      verticalAlign: 'middle',
      text: '',
      style: {
          fontSize: '13px'
      }
  },
  series: [{
      name: 'Energy',
      colorByPoint: true,
      data: []
  }]
}


var global_data = {
  name: [],
  data: []
}

function updateData(data) {
  
  global_data.data = [];
  global_data['name'] = data.map(elm => elm['name']);
  for (var idx = 0; idx < data[0]['data'].length; idx ++) {
      var energyBreakup = data.map(elm => {return elm['data'][idx]});
      global_data['data'].push(energyBreakup);
    }
}

function updateLegend(data, total, price) {
  var sources = document.querySelector('#sources').querySelector('.summed');
  sources.innerHTML = Math.round(total);

  var sources_price = document.querySelector('#sources').querySelector('.price');
  sources_price.innerHTML = '$' + Math.round(price[0].y) + '.00';
  
  var renewable = 0;
  for(var i = 0; i < data.length; i++) {
      var name = '#' + data[i].name;
      
      if (data[i].name == 'price' || data[i].name == 'temperature'){
        continue
      }
      var percentage = document.querySelector(name).querySelector('.percentage');
      var percent = ((data[i].y / total) * 100);
      if (data[i].name == 'wind' || data[i].name == 'hydro'){
        renewable += percent
      }
      if (percent >= 1 || percent <= -1 || percent == 0) {
        percentage.innerHTML = percent.toFixed(1)+'%';
      } else {
        percentage.innerHTML = percent.toFixed(4)+'%';
      }
      
      var summed = document.querySelector(name).querySelector('.summed');
      if (data[i].y >= 1) {
        summed.innerHTML = Math.round(data[i].y);
      } else {
        summed.innerHTML = data[i].y.toFixed(2);
      }
  }
  var renew = document.querySelector('#renewables').querySelector('.percentage');
  renew.innerHTML = renewable.toFixed(2) + '%'

  var pumps = document.querySelector('#pumps').querySelector('.summed');
  var exports = document.querySelector('#exports').querySelector('.summed');

  var load = document.querySelector('#loads').querySelector('.summed');
  load.innerHTML = Math.round(Number(pumps.innerHTML) + Number(exports.innerHTML));
  
  var net = document.querySelector('#net').querySelector('.summed');
  net.innerHTML = Math.round(Number(sources.innerHTML) + Number(load.innerHTML));
}