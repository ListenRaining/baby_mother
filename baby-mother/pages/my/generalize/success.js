//提交成功页
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        rootRelativePath: '../../../',
        cityname:'',
        state: false
    },

    onLoad: function (options) {
      if (options.do == 1) {
        this.setData({
          state: true,
          cityname: options.cityname
        });
      } else {
        this.setData({
          cityname: options.cityname
        });
      }
    }
})