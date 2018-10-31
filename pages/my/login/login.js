//微信授权
var app = getApp();

Page({

    data: {
        channel_id:0,
        baseurl: app.globalData.baseUrl
    },

    onLoad: function (options) {
        if(options.channel_id){
            this.setData({
                channel_id:options.channel_id
            })
        }
    },

    getuser:function(e){
        if (e.detail.encryptedData) {
            app.getUserInfoNew(e.detail.encryptedData, e.detail.iv,this.data.channel_id);
        } else {
            console.log('拒绝授权');
        }
    }
})