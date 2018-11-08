//宝宝详情页
var app = getApp();

Page({

    data: {
        rootRelativePath: '../../../../',
        img: '',
        avatar: '',
        gender: ['请选择宝宝性别', '男', '女'],
        genderIndex: 0,
        dateValue: '请选择宝宝出生年月',
        name: '',
        mid:0,
        is_class:0, //是不是上课宝宝

        //兴趣爱好
        lists: [
            { name: '唱歌', checked: false },
            { name: '跳舞', checked: false },
            { name: '画画', checked: false },
            { name: '乐高', checked: false },
            { name: '阅读', checked: false },
            { name: '手工', checked: false },
            { name: '游泳', checked: false },
            { name: '绘本', checked: false },
            { name: '拼图', checked: false },
            { name: '听音乐', checked: false },
            { name: '模仿表演', checked: false },
            { name: '芭比娃娃', checked: false },
            { name: '养小动物', checked: false },
            { name: '智力游戏', checked: false },
        ]
    },

    onLoad: function (options) {
        var that = this;
        if (options.mid) {
            var timestamp = app.createTimeStamp();
            var str = "mid=" + options.mid + "&timestamp=" + timestamp;
            var signature = app.createSignatureStr(str);
            wx.request({
                url: app.globalData.baseUrl + 'api/member/babyinfo',
                data: {
                    mid: options.mid,
                    timestamp: timestamp,
                    signature: signature,
                },
                success: function (res) {

                    if (res.data.info.avatar) {
                        that.setData({
                            img:app.globalData.baseUrl + res.data.info.avatar
                        })
                    }

                    var gender = res.data.info.gender;
                    var genderIndex;
                    if (gender === '男') {
                        genderIndex = 1;
                    } else {
                        genderIndex = 2;
                    }

                    //兴趣爱好
                    if(res.data.info.hobby) {
                        var hobby = res.data.info.hobby;
                        var hobbys = hobby.split(',');
                        var array = that.data.lists;
                        for (var i = 0; i < hobbys.length; i++) {
                            var index = parseInt(hobbys[i]);
                            array[index].checked = true;
                        }

                        that.setData({
                            mid:options.mid,
                            genderIndex: genderIndex,
                            is_class: res.data.info.is_class,
                            dateValue: res.data.info.birthday,
                            name: res.data.info.name,
                            lists: array
                        });
                    }else{
                        that.setData({
                            mid:options.mid,
                            genderIndex: genderIndex,
                            is_class: res.data.info.is_class,
                            dateValue: res.data.info.birthday,
                            name: res.data.info.name
                        });
                    }
                }
            })
        }
    },

    /**
     * 信息提交
     */
    formSubmit: function (e) {

        var that = this;

        if (e.detail.value.baby_name == '' || that.data.genderIndex == 0 || e.detail.value.baby_date == '请选择宝宝出生年月' || e.detail.value.hobby.length == 0){
            wx.showModal({
                title: '提示',
                content:'信息填写不完整！',
                showCancel: false,
            })
            return false;
        }

        var hobby = e.detail.value.hobby;
        var hobby_string = hobby.join(',');
        var is_class = e.detail.value.is_class[0] == 1 ? 1 : 0;

        wx.getStorage({
            key: 'userinfo',
            success: function (userinfo) {

                var timestamp = app.createTimeStamp();
                var str = "uid=" + userinfo.data.uid + "&timestamp=" + timestamp;
                var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'api/member/domember',
                    data: {
                        uid: userinfo.data.uid,
                        timestamp: timestamp,
                        signature: signature,
                        mid: that.data.mid,
                        avatar: e.detail.value.avatar,
                        name: e.detail.value.baby_name,
                        gender: that.data.gender[that.data.genderIndex],
                        birthday: e.detail.value.baby_date,
                        hobby: hobby_string,
                        is_class: is_class
                    },
                    success: function (res) {
                        if (res.data.result == 'succ') {
                            wx.showModal({
                                title: '提示',
                                content:'保存成功！',
                                showCancel: false,
                                success: function(res) {
                                    if (res.confirm) {
                                        wx.redirectTo({
                                            url: '/pages/my/my/babylist'
                                        })
                                    }
                                }
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '保存失败！',
                                showCancel: false,
                            })
                            return false;
                        }
                    }
                })
            }
        })
    },

    //性别选择
    bindGenderChange: function (e) {
        this.setData({
            genderIndex: e.detail.value
        })
    },

    //日期选择
    datePickerBindchange: function (e) {
        this.setData({
            dateValue: e.detail.value
        })
    },

    //上传头像
    change_icon: function () {
        var that = this;
        wx.chooseImage({
            count:1,
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: app.globalData.baseUrl + 'api/member/uploadavatar',
                    filePath: tempFilePaths[0],
                    name: 'avatar',
                    success: function (result) {
                        var data = JSON.parse(result.data.trim());
                        if (data.result == 'succ') {
                            that.setData({
                                img: tempFilePaths[0],
                                avatar:data.info
                            })

                            wx.showModal({
                                title: '提示',
                                content:'上传成功！',
                                showCancel: false,
                            })
                        }else{
                            wx.showModal({
                                title: '提示',
                                content:data.reason,
                                showCancel: false,
                            })
                            return false;
                        }
                    }
                })
            }
        })
    }
})