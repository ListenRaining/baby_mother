//待结算金额--数据汇总
var app = getApp()

Page({

    data: {
        info:[]
    },

    onShow: function (options) {
        var that = this
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                //拼装验证参数
                var timestamp = app.createTimeStamp()
                var str = "uid=" + info.data.uid + '&timestamp=' + timestamp;
                var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/thawlist',
                    data: {
                        uid:info.data.uid,
                        timestamp: timestamp,
                        signature: signature
                    },
                    success: function (res) {
                        that.setData({
                            info:res.data.info
                        })
                    }
                })
            }
        })
    },

    //查看明细
    goDetail:function(e){
        var type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: "/pages/my/wallet/frozen_detail/frozen_detail?type="+type
        })
    },
})