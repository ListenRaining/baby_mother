//提现明细
var app = getApp()

Page({

    data: {
        uid:0,
        list:[]
    },

    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                var timestamp = app.createTimeStamp()
                var str = "uid=" + info.data.uid + '&timestamp=' + timestamp
                var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/withdrawalList',
                    data: {
                        uid: info.data.uid,
                        timestamp: timestamp,
                        signature: signature
                    },
                    success: function (result) {
                        that.setData({
                            list: result.data.info
                        })
                    }
                })
            }
        })
    }
})