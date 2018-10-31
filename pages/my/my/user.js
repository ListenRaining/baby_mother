//个人信息
var app = getApp();

Page({

    data: {
        rootRelativePath: '../../../../',
        genderOption:[
            "请选择性别",
            "男",
            "女"
        ],
        genderIndex:0,
        ageDate:"2016-09-01",
        ageDateDefual:"请选择出生日期",
        uid:0
    },

    onLoad: function (options) {
        var that= this;
        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
              //拼装验证参数
              var timestamp = app.createTimeStamp()
              var str = "uid=" + info.data.uid + '&timestamp=' + timestamp;
              var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'api/member/getuserinfo',
                    data: {
                        uid: info.data.uid,
                        timestamp: timestamp,
                        signature: signature
                    },
                    success: function (res) {
                        //性别
                        var _genderIndex = 0;
                        for (var i = 0; i < that.data.genderOption.length; i++) {
                            if (that.data.genderOption[i] == res.data.info.gender) {
                                _genderIndex = i;
                            }
                        }

                        //出生日期
                        var _ageDate = res.data.info.birthday;
                        if (_ageDate == '') {
                            _ageDate = that.data.ageDateDefual;
                        }

                        that.setData({
                            uid: info.data.uid,
                            info: res.data.info,
                            genderIndex: _genderIndex,
                            ageDate: _ageDate
                        });
                    }
                })
            }
        })
    },

    formSubmit:function(_e){
        var that = this;
        if (_e.detail.value.username == '' || _e.detail.value.gender == 0 || _e.detail.value.birthday == this.data.ageDateDefual){
            wx.showModal({
                title: '提示',
                content:'信息填写不完整！',
                showCancel: false,
            })
            return false;
        }

        //拼装验证参数提交
        var timestamp = app.createTimeStamp()
        var str = "uid=" + that.data.uid + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
            url: app.globalData.baseUrl + 'api/member/updateuser',
            data:{
                uid:that.data.uid,
                timestamp: timestamp,
                signature: signature,
                username: _e.detail.value.username,
                gender: that.data.genderOption[that.data.genderIndex],
                birthday: that.data.ageDate
            },
            success:function(_res){
                if (_res.data.result == 'succ') {
                    wx.showModal({
                        title: '提示',
                        content:'保存成功！',
                        showCancel: false,
                        success: function(res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: _res.data.reason,
                        showCancel: false
                    })
                }
            }
        })
    },

    bindGenderChange:function(_e){
        this.setData({
            genderIndex: _e.detail.value
        })
    },

    bindAeChange:function(_e){
        this.setData({
            ageDate: _e.detail.value
        });
    },

    //上传头像
    change_icon: function () {
        var that = this;
        wx.chooseImage({
            count:1,
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: app.globalData.baseUrl + 'api/member/uploadavatar',
                    filePath: tempFilePaths[0],
                    name: 'avatar',
                    success: function (res2) {
                        var data = JSON.parse(res2.data.trim());
                        if (data.result == 'succ') {
                            that.setData({
                                img: tempFilePaths[0],
                                avatar:data.info
                            })
                            wx.showToast({
                                title: '上传成功',
                                icon: 'success'
                            })
                        }else{
                            wx.showModal({
                                title: '提示',
                                content: data.reason,
                                showCancel: false
                            })
                        }
                    }
                })
            }
        })
    },
})