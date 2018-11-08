var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
Page({
    data: {
      type:1,       //产品类型
    },

    /**
     * 触点信息
     */
    touchHandler: function (e) {
        console.log(lineChart.getCurrentDataIndex(e));
        lineChart.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data 
            }
        });
    },    
    

    /**
     * 页面加载
     */
    onLoad: function (e) {
        this.createData(this.data.type);
    },

    /**
     * 切换产品
     */
    changeP: function(e) {
      var type = e.currentTarget.id
      var type = type==1 ? 2 : 1
      this.setData({
        type: type,
      })
      this.createData(type);
    },

    /**
     * 生成数据
     */
    createData: function(type) {
      var that = this
      var name = type == 1 ? '298产品' : '9800产品'
      
      //页面宽度
      var windowWidth = 320;
      //获取手机型号
      try {
        var res = wx.getSystemInfoSync();
        console.log()
        windowWidth = res.windowWidth;
      } catch (e) {
        console.error('getSystemInfoSync failed!');
      }
      //生成数据
      wx.request({
        url: app.globalData.baseUrl + "/little/institution/productStatistics",
        data: {
          type: type
        },
        success: function (res) {
          var categories = res.data.info.category
          var data = res.data.info.data

          //画图
          lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: categories,
            animation: true,
            // background: '#f5f5f5',
            series: [{
              name: name,
              data: data,
              format: function (val, name) {
                return val.toFixed(0) + "人";
              }
            }],
            xAxis: {
              disableGrid: true
            },
            yAxis: {
              title: '推广人数',
              format: function (val) {
                return val.toFixed(0);
              },
              min: 0
            },
            width: windowWidth,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
              lineStyle: 'curve'
            }
          });
        }
      })
    }
});