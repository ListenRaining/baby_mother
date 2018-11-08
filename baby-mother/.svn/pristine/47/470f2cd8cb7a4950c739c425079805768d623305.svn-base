//扫pos机二维码进行注册
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:[],
        second: 60,
        selected1:true,
        selected:false,
        mobile:'',       //已绑定手机号
        mobiles:'',      //输入要绑定的手机号
        address:'',      //定位地址
        longitude:'',    //经度
        latitude:'',     //纬度
        is_show:0,       //页面是否显示
        memberList:[],   //宝宝列表
        gender: ['请选择宝宝性别', '男', '女'],
        genderIndex: 0,
        birthday: '请输入宝宝出生年月日',
        memberLength:0   //宝宝数量
    },

    getUserInfo: function () {
        var that = this
        //调用登录接口
        wx.login({
            success: function (res) {
                var code = res.code
                wx.getUserInfo({
                    success: function (res2) {

                        wx.showLoading({
                            title: '加载中',
                            mask: true
                        })

                        var encryptedData = res2.encryptedData;
                        var iv = res2.iv;
                        // 调用接口获取用户信息
                        wx.request({
                            url: app.globalData.baseUrl + 'api/operate/checkcode',
                            data: {
                                code: code,
                                encryptedData: encryptedData,
                                iv: iv,
                            },
                            success: function (data) {
                                var info = data.data.trim()
                                info = JSON.parse(info)
                                console.log('userinfo:',info);
                                wx.request({
                                    url: app.globalData.baseUrl + 'api/member/adduser',
                                    data: {
                                        username: info.nickName,
                                        unionid: info.unionId
                                    },
                                    success: function (code) {
                                        info.uid = code.data.uid

                                        //拼装验证参数
                                        var timestamp = app.createTimeStamp()
                                        var str = "uid=" + code.data.uid + '&timestamp=' + timestamp;
                                        var signature = app.createSignatureStr(str);
                                        wx.request({
                                            url: app.globalData.baseUrl + 'little/operate/getUserInfo',
                                            data: {
                                                uid: code.data.uid,
                                                timestamp: timestamp,
                                                signature: signature,
                                            },
                                            method: 'post',
                                            header: {
                                                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                            },
                                            success: function (res2) {

                                                console.log('res2:',res2)

                                                if(res2.data.info.level > 0 && res2.data.info.level < 7){
                                                    wx.switchTab({
                                                        url: '/pages/find/index/index'
                                                    })
                                                    return false;
                                                }

                                                that.setData({
                                                    info: res2.data.info,
                                                    mobile: res2.data.info.mobile,
                                                    address: res2.data.info.address,
                                                    longitude: res2.data.info.lng,
                                                    latitude: res2.data.info.lat,
                                                    is_show: 1,
                                                    memberList:res2.data.memberList,
                                                    memberLength:res2.data.memberList.length
                                                })
                                            }
                                        })
                                        //隐藏加载中的提示语
                                        wx.hideLoading()

                                        wx.setStorage({
                                            key: 'userinfo',
                                            data: info,
                                        })
                                    }
                                })
                            }
                        })
                    },
                    fail: function (res3) {
                        //拒绝授权,跳转到小程序授权管理页面
                        that.openSetting()
                    }
                })
            }
        })
    },

    //页面加载
    onLoad: function () {
        this.getUserInfo()
    },

    //跳转设置页面授权
    openSetting: function () {
        var that = this
        wx.openSetting({
            success: function (res) {
                that.getUserInfo()
            }
        })
    },

    //表单提交
    formSubmit: function(e) {
        if (e.detail.value.username == '') {
            wx.showToast({
                title: '您还没有填写姓名'
            })
            return false;
        }
        if (e.detail.value.mobile == '') {
            wx.showToast({
                title: '您还没有填写手机号'
            })
            return false;
        }
        if (e.detail.value.address == '') {
            wx.showToast({
                title: '您还没有获取定位'
            })
            return false;
        }
        if (e.detail.value.orderid == '') {
            wx.showToast({
                title: '您还没有填写订单号'
            })
            return false;
        }

        if (e.detail.value.memberLength>0 && e.detail.value.mid == '') {
            wx.showModal({
                title: '请勾选要上课的宝宝',
                showCancel:false
            })
            return false;
        }

        if (e.detail.value.memberLength==0 && (e.detail.value.babyname == '' || e.detail.value.babygender == 0 || e.detail.value.birthday == '请输入宝宝出生年月日')) {
            wx.showModal({
                title: '宝宝信息不能为空',
                showCancel:false
            })
            return false;
        }

        //手机号格式检测
        var regMobile = /^1\d{10}$/;
        if(!regMobile.test(e.detail.value.mobile)){
            wx.showToast({
                title:'手机号格式不正确！'
            })
            return false;
        }

        //从缓存里获取用户的unionId信息
        var that = this;
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/register',
                    data: {
                        unionid:res.data.unionId,
                        username: e.detail.value.username,
                        mobile: e.detail.value.mobile,
                        code: e.detail.value.code,
                        address: e.detail.value.address,
                        longitude: e.detail.value.longitude,
                        latitude: e.detail.value.latitude,
                        orderid: e.detail.value.orderid,
                        mid: e.detail.value.mid,
                        babyname: e.detail.value.babyname,
                        babygender: that.data.gender[that.data.genderIndex],
                        birthday: e.detail.value.birthday,
                    },
                    method: 'post',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    success: function (result) {
                        if (result.data.result == 'succ') {
                            wx.redirectTo({
                                url: '/pages/register/register_success'
                            })
                        } else {
                            wx.showModal({
                                title: result.data.reason,
                                showCancel:false
                            })
                            return false;
                        }
                    }
                })
            },
        })
    },

    //发送验证码
    getphone: function (e) {
        var that = this
        var mobiles = this.data.mobiles
        var regMobile = /^1\d{10}$/;
        if (!regMobile.test(mobiles)) {
            wx.showToast({
                title: '手机号格式不正确！'
            })
            return false;
        }

        wx.request({
            url: app.globalData.baseUrl + 'little/operate/sendcode',
            data: {
                mobile: mobiles
            },
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (res) {
                if (res.data.result == 'fail') {
                    wx.showToast({
                        title: res.data.reason
                    })
                    return false;
                } else {
                    wx.showToast({
                        title: '验证码已发送'
                    })
                    that.setData({
                        selected1: false,
                        selected: true
                    });
                    countdown(that);
                }
            }
        })
    },

    //获取定位
    getAddress: function (e) {
        var that = this
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    address:res.address,
                    longitude:res.longitude,
                    latitude:res.latitude
                })
            },
            fail:function(res2){
                console.log(res2);
            }
        })
    },

    mobileInputEvent: function (e) {
        this.setData({
            mobiles: e.detail.value
        })
    },

    //勾选宝宝
    bindRadioChange: function (e) {
        console.log(e.detail.value)
    },

    bindGenderChange:function (e) {
        this.setData({
            genderIndex:e.detail.value
        })
    },
    bindBirthdayChange:function (e) {
        this.setData({
            birthday:e.detail.value
        })
    }
})

//60秒倒计时
function countdown(that) {
    var second = that.data.second;
    if (second == 0) {
        that.setData({
            selected1:true,
            selected:false,
            second: 60,
        });
        return;
    }
    var time = setTimeout(function () {
            that.setData({
                second: second - 1
            });
            countdown(that);
        }
        , 1000)
}