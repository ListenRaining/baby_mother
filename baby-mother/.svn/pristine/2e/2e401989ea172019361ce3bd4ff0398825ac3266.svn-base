//成长收益
var app = getApp();

Page({

    data: {
        uid:0,
        list:[]
    },

    onShow: function () {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                that.setData({
                    uid: info.data.uid
                })

                that.getData(info.data.uid,'');
            }
        })
    },

    //筛选日期
    bindDateChange:function (e) {
        this.getData(this.data.uid,e.detail.value);
    },

    //获取数据
    getData:function (uid,date) {
        var that = this;
        var timestamp = app.createTimeStamp();
        var str = "uid=" + uid + "&timestamp=" + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
            url: app.globalData.baseUrl + 'little/index/getEarnings',
            data: {
                uid: uid,
                timestamp: timestamp,
                signature: signature,
                date:date
            },
            success: function (result) {
                console.log('成长收益',result);
                that.setData({
                    date:result.data.date,
                    list:result.data.info,
                    allfreezeMoney:result.data.allfreezeMoney,
                    withdrawalMoney:result.data.withdrawalMoney,
                    oneLevelIncome:result.data.oneLevelIncome,
                    twoLevelIncome:result.data.twoLevelIncome,
                })
            }
        })
    },

    //去提现
    toWithdrawal:function () {
        wx.navigateTo({
            url: '/pages/my/wallet/wallet/wallet'
        })
    }
})