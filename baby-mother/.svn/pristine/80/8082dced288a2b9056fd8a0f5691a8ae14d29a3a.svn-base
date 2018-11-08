//个人新闻页
var app = getApp();

Page({

    data: {
        list: null,
        baseurl: app.globalData.baseUrl,
        page: 1,
        rootRelativePath: '../../../',
        imageClassName: ['image1', 'image2', 'image3'],
        mediaClassName: ['media1', 'media2', 'media3'],
        uid:0,
        author:0,
        user_type: 0,
        username:'',
        isMy:false,
        animationArr: [],
        title:''
    },

    onLoad: function (options) {

        var that = this;

        wx.setNavigationBarTitle({
            title: options.username+'的分享'
        })

        wx.getStorage({
            key: 'userinfo',
            success: function(user) {
                //拼装验证参数
                var timestamp = app.createTimeStamp()
                var str = "uid=" + user.data.uid + "&author=" + options.author + '&timestamp=' + timestamp;
                var signature = app.createSignatureStr(str);

                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/index',
                    data: {
                        uid: user.data.uid,
                        author: options.author,
                        timestamp: timestamp,
                        user_type: options.user_type,
                        signature: signature
                    },
                    success: function (res) {
                        wx.setStorage({
                          key:'myContent',
                          data: res.data.info.list,
                        })

                        that.setData({
                            uid:user.data.uid,
                            author:options.author,
                            user_type: options.user_type,
                            username:options.username,
                            list: res.data.info.list,
                            focus: res.data.info.focus
                        })
                        that.initAnimationArr();
                    }
                })
            },
            fail:function () {
                //拼装验证参数
                var timestamp = app.createTimeStamp()
                var str = "author=" + options.author + '&timestamp=' + timestamp;
                var signature = app.createSignatureStr(str);
                wx.request({
                    url: app.globalData.baseUrl + 'little/operate/index',
                    data: {
                        author: options.author,
                        timestamp: timestamp,
                        user_type: options.user_type,
                        signature: signature
                    },
                    success: function (res) {
                        wx.setStorage({
                            key:'myContent',
                            data: res.data.info.list,
                        })
                        that.setData({
                            author:options.author,
                            user_type: options.user_type,
                            username:options.username,
                            list: res.data.info.list,
                            focus: res.data.info.focus,
                        })
                        that.initAnimationArr();
                    }
                })
            }
        })
    },

    initAnimationArr: function () {
        var newAnimationArr = this.data.animationArr;
        var list = this.data.list;
        var startIndex = (newAnimationArr.length == 0) ? 0 : (newAnimationArr.length);
        for (var i = startIndex; i < list.length; i++) {
            newAnimationArr.push({
                ani: null
            });
            this.setData({
                animationArr: newAnimationArr
            });
        }
    },

    clickAdmireEffect: function (_index) {
        var newAnimation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })
        newAnimation.scale(3, 3).rotate(90).step();
        var newAnimationArr = this.data.animationArr;
        newAnimationArr[_index].ani = newAnimation.export();

        this.setData({
            //输出动画
            animationArr: newAnimationArr
        })

        setTimeout(function () {
            newAnimation.scale(1, 1).rotate(0).step()

            var newAnimationArr = this.data.animationArr;
            newAnimationArr[_index].ani = newAnimation.export();

            this.setData({
                animationArr: newAnimationArr
            })
        }.bind(this), 150)
    },

    //点赞
    clickAdmire: function (_e) {
        var that = this;
        if(that.data.uid == 0){
            wx.setStorage({
                key: 'gourl',
                data: '/pages/find/mycontent/mycontent?author='+that.data.author+'&user_type='+that.data.user_type+'&username='+that.data.username
            })

            wx.navigateTo({
                url: '/pages/my/login/login'
            })
        }else{
            var index = _e.currentTarget.dataset.index;
            var data = this.data.list[index];
            var newZanNum = data.zan_num;
            var newIsZan = !data.is_zan;
            var newList = this.data.list;
            var _url = newIsZan ? "little/operate/agree" : "little/operate/disagree"
            wx.request({
                url: app.globalData.baseUrl + _url,
                data: {
                    uid: that.data.uid,
                    cid: newList[index].id
                },
                success: function (res2) {
                    if (res2.data.result == "fail") {
                        wx.showModal({
                            title: res2.data.reason,
                            showCancel: false,
                        })
                        return false;
                    }else {
                        newIsZan ? newZanNum++ : newZanNum--;
                        newList[index].is_zan = newIsZan;
                        newList[index].zan_num = newZanNum;
                        that.setData({
                            list: newList
                        });
                        newIsZan ? that.clickAdmireEffect(index) : null;
                    }
                }
            })   
        }
    },

    /**
    * 生命周期函数--监听页面卸载
    */
    onUnload: function () {
        wx.removeStorage({
            key: 'myContent',
        })
    },

    /**
    * 下拉刷新
    */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
        var that = this;

        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "uid=" + that.data.uid + "&author=" + that.data.author + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
            url: app.globalData.baseUrl + 'little/operate/index',
            data:{
                uid: that.data.uid,
                author:that.data.author,
                timestamp: timestamp,
                user_type: that.data.user_type,
                signature: signature
            },
            success: function (res) {
                that.setData({
                    list: res.data.info.list,
                    focus: res.data.info.focus
                })
                that.initAnimationArr();
            }
        })
    },

    /**
    * 上拉刷新
    */
    onReachBottom: function () {
        var that = this;
        var page = that.data.page + 1;

        //拼装验证参数
        var timestamp = app.createTimeStamp()
        var str = "uid=" + that.data.uid + "&author=" + that.data.author + '&timestamp=' + timestamp;
        var signature = app.createSignatureStr(str);
        wx.request({
            url: app.globalData.baseUrl + 'little/operate/index',
            data:{
                uid: that.data.uid,
                author:that.data.author,
                timestamp: timestamp,
                p: page,
                user_type: that.data.user_type,
                signature: signature
            },
            success: function (res) {
                if (res.data.info.list.length > 0) {
                    wx.getStorage({
                        key: 'myContent',
                        success: function (index) {
                            var list = index.data.concat(res.data.info.list);
                            wx.setStorage({
                                key: 'myContent',
                                data: list,
                            })

                            that.setData({
                                page: res.data.p,
                                list: list,
                                focus: res.data.info.focus
                            })
                        }
                    })
                }
            }
        })
    },

    /**
    * 跳转详情页面
    */
    toDetail: function (e) {
        var id = e.currentTarget.id;
        var user_type = e.currentTarget.dataset.user_type;
        if (id == 0) {
            return false
        }
        if (user_type == 0) {
            wx.navigateTo({
                url: '/pages/find/UGC_details/UGC_details?id=' + id,
            })
        } else {
            wx.navigateTo({
                url: '/pages/find/PGC_details/PGC_details?id=' + id,
            })
        }
    }
})