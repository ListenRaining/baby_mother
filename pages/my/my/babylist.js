//宝宝列表
var app = getApp();

Page({

    data: {
        info: []
    },

    onShow: function () {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                var timestamp = app.createTimeStamp();
                var str = "uid=" + res.data.uid + "&timestamp=" + timestamp;
                var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'api/member/babylist',
                    data: {
                        uid: res.data.uid,
                        timestamp: timestamp,
                        signature: signature
                    },
                    success: function (result) {
                        that.setData({
                            info: result.data.info
                        })
                    }
                })
            }
        })
    },

    //查看宝宝信息
    seeBaby: function (e) {
        wx.navigateTo({
            url: '/pages/my/my/babyinfo?mid=' + e.currentTarget.id
        })

    },

    //添加宝宝
    addBaby: function () {
        wx.navigateTo({
            url: '/pages/my/my/babyinfo'
        })
    }
})