//用户管理
var app = getApp();

Page({

  data: {
    rootRelativePath: '../../../',
    share_id:0,
    share_type:0,
    tabNum:1,           //栏目切换
    userlist:[],        //用户列表
    select_all:false,   //全选标志
    selectValue:[],
    selectStr:''
  },

  onLoad: function (options) {

    var that = this;

    //分享给平台内部用户
    if(options.share_id){
      that.setData({
        share_id:options.share_id,
        share_type:options.share_type
      })
    }

    wx.getStorage({
      key: 'userinfo',
      success: function (info) {
        var timestamp = app.createTimeStamp();
        var str = "uid=" + info.data.uid + "&timestamp=" + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + 'little/index/getContactsList',
          data: {
            uid: info.data.uid,
            timestamp: timestamp,
            signature: signature
          },
          success: function (res) {
            that.setData({
              userlist:res.data.info,
              newCount:res.data.newCount,
              intentionCount:res.data.intentionCount
            })
          }
        })
      }
    })
  },

  //tab切换
  tabCheck:function(e){
    var that = this;
    var typeid = e.currentTarget.id;
    wx.getStorage({
      key: 'userinfo',
      success: function (info) {
        var timestamp = app.createTimeStamp();
        var str = "uid=" + info.data.uid + "&timestamp=" + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
          url: app.globalData.baseUrl + 'little/index/getContactsList',
          data: {
            uid: info.data.uid,
            timestamp: timestamp,
            signature: signature,
            typeid:typeid
          },
          success: function (res) {
            that.setData({
                tabNum:typeid,
                userlist:res.data.info,
                newCount:res.data.newCount,
                intentionCount:res.data.intentionCount
            })
          }
        })
      }
    })
  },

  //单个复选款勾选
  listenCheckboxChange:function (e) {

    //若全选按钮已选中，此时勾掉一个，则全选按钮为不选中状态
    if(e.detail.value.length == this.data.userlist.length){
      this.setData({
        select_all:true
      })
    }else{
      this.setData({
          select_all:false
      })
    }

    this.setData({
      selectStr:e.detail.value.join(',')
    })
  },

  //全选
  selectall:function () {
    for(var i=0;i<this.data.userlist.length;i++){
      this.data.userlist[i].checked = (!this.data.select_all);
      this.data.selectValue[i] = this.data.userlist[i].uid;
    }

    if(!this.data.select_all){
      this.setData({
        select_all:(!this.data.select_all),
        userlist:this.data.userlist,
        selectStr:this.data.selectValue.join(',')
      })
    }else{
      this.setData({
        select_all:(!this.data.select_all),
        userlist:this.data.userlist,
        selectValue:[],
        selectStr:''
      })
    }
  },
    
  //发送
  sendMessage:function () {
    var that = this;
    if(that.data.selectStr == ''){
        wx.showModal({
            title: '提示',
            content: '请勾选要发送的用户！',
            showCancel: false,
        })
        return false;
    }

    wx.getStorage({
        key: 'userinfo',
        success: function (userinfo) {
            var timestamp = app.createTimeStamp();
            var str = "uid=" + userinfo.data.uid + "&timestamp=" + timestamp;
            var signature = app.createSignatureStr(str);
            wx.request({
                url: app.globalData.baseUrl + 'little/index/sendMessage',
                data: {
                    uid: userinfo.data.uid,
                    timestamp: timestamp,
                    signature: signature,
                    share_id: that.data.share_id,
                    share_type: that.data.share_type,
                    selectStr: that.data.selectStr
                },
                success: function (res) {
                    if (res.data.result == 'succ') {
                        wx.showModal({
                            title: '提示',
                            content:'发送成功！',
                            showCancel: false
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data.reason,
                            showCancel: false,
                        })
                    }
                }
            })
        }
    })
  }
})