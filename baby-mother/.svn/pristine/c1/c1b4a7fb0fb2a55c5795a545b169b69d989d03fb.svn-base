//待结算金额--查看明细
var app = getApp()

Page({

    data: {
        uid:0,
        info:[],
        list:[],
        type:1,
        explainValue:0
    },

    onLoad: function (options) {
        var that = this
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/thawwaiting',
                    data: {
                        uid:info.data.uid,
                        type:options.type
                    },
                    success: function (res) {
                        that.setData({
                            type:options.type,
                            info:res.data.info,
                            list:res.data.list,
                        })
                    }
                })
            }
        })
    },

    //结算说明--显示
    show:function(e){
        var type = e.currentTarget.dataset.type;
        this.setData({
            explainValue:type
        })
    },

    //结算说明--隐藏
    hide:function(e){
        this.setData({
            explainValue:0
        })
    }
})