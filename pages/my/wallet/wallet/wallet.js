//钱包首页
var app = getApp()

Page({

    data: {
        rootRelativePath: '../../../../',
        userinfo:[]
    },

    onLoad: function() {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        console.log("当前时间戳为：" + timestamp);
        wx.setStorage({
            key: 'wallettime',
            data: timestamp,
        })
    },

    onShow: function () {
        var that = this
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
              //拼装验证参数
              var timestamp = app.createTimeStamp()
              var str = "uid=" + info.data.uid + '&timestamp=' + timestamp;
              var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/myBalance',
                    data: {
                        uid:info.data.uid,
                        timestamp: timestamp,
                        signature: signature
                    },
                    success: function (res) {
                        that.setData({
                            userinfo:res.data.info
                        })
                    }
                })
            }
        })
    },

    //提现按钮
    goWithdraw:function(){
        wx.navigateTo({
            url: "/pages/my/wallet/withdraw/withdraw"
        })
    },

    //提现明细
    withdrawalDetail: function (e) {
        wx.navigateTo({
            url: "/pages/my/wallet/gold_detail/gold_detail"
        })
    },

    //待结算金额
    frozen: function (e) {
        wx.navigateTo({
            url: "/pages/my/wallet/frozen_detail/frozen_list"
        })
    },

    //提现说明
    rules: function (e) {
        wx.navigateTo({
            url: "/pages/my/wallet/rule/rule"
        })
    },
})