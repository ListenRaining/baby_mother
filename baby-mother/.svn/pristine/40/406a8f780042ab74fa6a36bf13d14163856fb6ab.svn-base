let wxCharts = require('./wxcharts-min.js');
//let lineChart = '';
let lineChartArr = ['lineChartA', 'lineChartB', 'lineChartC', 'lineChartD', 'lineChartE', 'lineChartF', 'lineChartG', 'lineChartH', 'lineChartI', 'lineChartJ', 'lineChartK', , 'lineChartL'];



/**
 * 折线图
 */
function lineCharts(index, id, xDate, data, title) {
 
  var windowWidth ;
  let series = [];
  try {
    var res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
  } catch (e) {
    console.error('getSystemInfoSync failed!');
  }

  if (data && data.length > 0) {
    let color;
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        if(i==0){
          color ='#4f7081'
        }
        if (i == 1) {
          color = '#df9440'
        }
        if (i == 2) {
          color = '#e9cb58'
        }
        if (i == 3) {
          color = '#8b455b'
        }
        series.push(
          {
            name: title[i],
            data: data[i].length > 0 ? data[i] : [''],
            color: color
          }
        )
      }

    }

    lineChartArr[index] = new wxCharts({
      canvasId: id,
      type: 'line',
      categories: xDate,
      animation: true,
      width: windowWidth,
      height: 220,
      dataLabel: false,      //是否在图表中显示数据内容值
      dataPointShape: true, //是否在图表中显示数据点图形标识
      extra: {
        lineStyle: 'default'    //直线
      },
      legend: true,
      offsetX:10,
      series: series,
      xAxis: {
        disableGrid: true,
        fontColor: "#b6b6b6",
        gridColor: "#faf5f5"
      },
      yAxis: {
        min: 0,
        max: 10,
        fontColor: "#b6b6b6",
        gridColor: "#fdefef",
        format: function (val) {
          return (val > 100000000 ? ((val / 100000000).toFixed(1) + '亿') : (val > 10000 ? ((val / 10000).toFixed(1) + '万') : val))
        },
      },
    });

  }

}

function touchCharts(e, index) {
  lineChartArr[index].showToolTip(e, {
    format: function (item, category) {
      return category + ' ' + item.name + ':' + (item.data > 0 ? item.data : '0')

    }
  });
}
module.exports = {
  "lineCharts": lineCharts,
  "touchCharts": touchCharts
}

