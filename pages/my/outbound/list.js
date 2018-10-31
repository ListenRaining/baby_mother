//机构外访列表
var app = getApp();

Page({

    data: {
        list:[],
        infocount:0
    },

    onShow: function (options) {
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function(info) {

                var timestamp = app.createTimeStamp()
                var str = "uid=" + info.data.uid + '&timestamp=' + timestamp
                var signature = app.createSignatureStr(str);
                
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/insOutboundList',
                    data: {
                        uid:info.data.uid,
                        timestamp:timestamp,
                        signature:signature
                    },
                    success: function (result) {
                        that.setData({
                            list:result.data.info,
                            infocount:result.data.infocount
                        })
                    }
                })
            },
        })
    },

    /**
     * 添加机构外访记录
     */
    createOutbound: function (res) {
        wx.navigateTo({
            url: '/pages/my/outbound/add'
        })
    },

    /**
     * 编辑外访信息
     */
    goChange: function (res) {
        var id = res.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/my/outbound/add?id='+id
        })
    },
})