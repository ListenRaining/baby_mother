var app = getApp()

Page({

    data: {
        info:[],
        baseurl:app.globalData.baseUrl,
        textareaShowFlag: true,
        delId: null,
        delType: null,
        pCommentBtnColor: '#fff',
        pCommentBtnFontColor:'#bdbdbd',
        key:0,              //点赞时首页变化
        comment_num:null,   //评论数
        actionSheetData: {
            commentActionSheetFlag: false,
            itemList: [
                {
                    msg: "删除"
                }
            ]
        },

        rootRelativePath: '../../../',
        uid: 0,
        info: [],
        baseurl: app.globalData.baseUrl,
        needShowDelBtn: false,
        placedeDefault: "输入评论内容",
        placeText: "输入评论内容",
        admireCnt: 13,
        isAdmire: false,
        animation: null,
        focus: false,
        value: "",
        commentIndexTB: {
            findex: null,
            cindex: null,
        }
    },

    onLoad: function (options) {

        console.log('首页内容详情页',options);

        var that = this;

        //邀请人uid
        if (options.puid) {
            app.checkPuid(options.puid)
        }

        //判断key参数
        if (options.key) {
            that.setData({
                key: options.key
            });
        }

        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                that.setData({
                    uid: res.data.uid,
                    id: options.id
                });
            },
            fail:function () {
                that.setData({
                    id: options.id
                });
            }
        })

        //获取内容
        that.getContent(options.id,true);
    },

    getContent: function (_id, _updateViewTotal) {
        var that = this;
        wx.request({
            url: app.globalData.baseUrl + 'little/operate/getContentDetail',
            data: {
                id: _id,
                uid: that.data.uid
            },
            success: function (res) {
                wx.setNavigationBarTitle({
                    title: res.data.info.user.username + '的分享'//页面标题为路由参数
                })
                if (_updateViewTotal) {
                    var WxParse = require('../../../utils/wxParse/wxParse.js');
                    WxParse.wxParse('content', 'html', res.data.info.content, that, 15);
                    that.setData({
                        info: res.data.info
                    })
                }
                else {
                    that.setData({
                        "info.comment": res.data.info.comment
                    })
                }
            }
        })
    },

    viewLocation: function (_e) {
        var query = wx.createSelectorQuery();
        query.select('.comment').boundingClientRect()
        query.exec(function (res) {
            wx.pageScrollTo({
                scrollTop: res[0].top
            })
        })
    },

    clickCancel: function () {
        this.setData({
            'actionSheetData.commentActionSheetFlag': false,
            textareaShowFlag: true,
            delId: null,
            delType: null
        });
    },

    clickAct: function (_e) {
        var index = _e.currentTarget.dataset.index;
        var item = this.data.actionSheetData.itemList[index];
        if (item.msg == '删除') {
            var that = this;
            wx.request({
                url: app.globalData.baseUrl + '/little/operate/del_comment',
                data: {
                    id: that.data.delId,
                    type: that.data.delType,
                    cid: that.data.id
                },
                success: function (res) {
                    if (res.data.result == 'succ') {
                        that.getContent(that.data.info.id);
                        that.clearFocusData();
                        that.setData({
                            'actionSheetData.commentActionSheetFlag': false,
                            textareaShowFlag: true,
                            delId: null,
                            delType: null,
                        });
                    }
                    else {
                        wx.showToast({
                            title: res.data.reason
                        })
                    }
                }
            })
        }
    },

    clickComment: function (_e) {
        var findex = _e.currentTarget.dataset.findex;
        var cindex = _e.currentTarget.dataset.cindex;
        var newCommentIndexTB = this.data.commentIndexTB;
        var comment = this.data.info.comment[findex];
        var contentTB = comment;
        var newDelType = 1;
        if (cindex != null) {
            contentTB = comment.reply[cindex];
            newDelType = 0;
        }

        if (this.data.uid == contentTB["comment_uid"]) {
            this.setData({
                'actionSheetData.commentActionSheetFlag': true,
                textareaShowFlag: false,
                focus: false,
                delId: contentTB["id"],
                delType: newDelType
            });
            return;
        }

        if (newCommentIndexTB.findex != findex || newCommentIndexTB.cindex != cindex) {
            this.setData({
                value: ""
            });
        }

        if (!this.data.focus) {
            this.setData({
                focus: true
            });
        }

        newCommentIndexTB.findex = findex;
        newCommentIndexTB.cindex = cindex;

        this.setData({
            placeText: '回复' + contentTB["comment_name"],
            commentIndexTB: newCommentIndexTB
        });
    },

    textInput: function (_e) {
        var color = '#3db049'
        var fontcolor = '#fff'
        if (_e.detail.value == null || _e.detail.value.length == 0) {
            color = '#fff'
            fontcolor = '#bdbdbd'
        }
        this.setData({
            pCommentBtnColor: color,
            pCommentBtnFontColor: fontcolor
        });
    },
    bindTextAreaBlur: function (_e) {
        this.setData({
            focus: false
        });
        if (_e.detail.value == null || _e.detail.value.length == 0) {
            this.clearFocusData();
        }
    },

    clearFocusData: function () {
        var newCommentIndexTB = this.data.commentIndexTB;
        newCommentIndexTB.findex = null;
        newCommentIndexTB.cindex = null;
        this.setData({
            placeText: this.data.placedeDefault,
            commentIndexTB: newCommentIndexTB,
            value: ""
        });
    },

    /**
     * 发表评论
     */
    publishComment: function (_e) {
        var value = _e.detail.value;
        var commentConent = value.content;
        if (commentConent == null || commentConent.length == 0) {
            wx.showToast({
                title: '请输入完整信息',
            });
            return;
        }
        var tcid = this.data.info.id;
        var tcomment_id = null;
        var tcomment_uid = this.data.uid;
        var treply_uid = null;
        if (this.data.commentIndexTB.findex) {
            var comment = this.data.info.comment[this.data.commentIndexTB.findex];
            var contentTB = comment;
            tcomment_id = contentTB["id"];
            if (this.data.commentIndexTB.cindex != null) {
                contentTB = comment.reply[this.data.commentIndexTB.cindex];
                treply_uid = contentTB["comment_uid"];
                tcomment_id = contentTB["comment_id"];
            }

        }
        var that = this;
        wx.request({
            url: app.globalData.baseUrl + '/little/operate/comment',
            data: {
                cid: tcid,
                comment_id: tcomment_id,
                comment_uid: tcomment_uid,
                reply_uid: treply_uid,
                comment_user_uid: that.data.info.uid,
                content: commentConent,
            },
            success: function (res) {
                if (res.data.result == 'succ') {
                    that.getContent(tcid);
                    that.clearFocusData();
                    that.setData({
                        comment_num: res.data.count,
                        pCommentBtnColor: '#fff'
                    });
                    if (that.data.key != null) {
                        //更新首页评论数
                        wx.getStorage({
                            key: 'indexContent',
                            success: function (info) {
                                var list = info.data
                                list[that.data.key]['comment_num'] = res.data.count
                                wx.setStorage({
                                    key: 'indexContent',
                                    data: list,
                                })
                            },
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.reason
                    })
                }
            }
        })
    },

    clickAdmireEffect: function () {
        var newAnimation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })
        newAnimation.scale(3, 3).rotate(90).step();
        this.setData({
            //输出动画
            animation: newAnimation.export()
        })

        setTimeout(function () {
            newAnimation.scale(1, 1).rotate(0).step()
            this.setData({
                animation: newAnimation.export()
            })
        }.bind(this), 150)
    },

    //点赞
    clickAdmire: function (_e) {
        var that = this;
        if(that.data.uid == 0){
            wx.setStorage({
                key: 'gourl',
                data: '/pages/find/PGC_details/PGC_details?id='+this.data.id+'&key='+this.data.key
            })

            wx.navigateTo({
                url: '/pages/my/login/login'
            })
        }else{
            var index = _e.currentTarget.dataset.index;
            var newZanNum = this.data.info.zan_num;
            var newIsZan = !this.data.info.is_zan;
            var _url = newIsZan ? "little/operate/agree" : "little/operate/disagree"
            wx.request({
                url: app.globalData.baseUrl + _url,
                data: {
                    uid: that.data.uid,
                    cid: that.data.info.id
                },
                success: function (res2) {
                    if (res2.data.result == "fail") {
                        wx.showToast({
                            title: res2.data.reason,
                        })
                        return;
                    }
                    else {
                        newIsZan ? newZanNum++ : newZanNum--;
                        var newInfo = that.data.info;
                        newInfo.is_zan = newIsZan;
                        newInfo.zan_num = newZanNum;
                        that.setData({
                            info: newInfo
                        });
                        newIsZan ? that.clickAdmireEffect(index) : null;

                        //点赞，取消点赞首页的变化
                        if (that.data.key != null) {
                            wx.getStorage({
                                key: 'indexContent',
                                success: function (res) {
                                    var list = res.data
                                    list[that.data.key]['is_zan'] = newIsZan
                                    list[that.data.key]['zan_num'] = newZanNum
                                    wx.setStorage({
                                        key: 'indexContent',
                                        data: list,
                                    })
                                }
                            })
                        }
                    }
                }
            })   
        }
    },

    //转发
    onShareAppMessage: function () {
        return {
            title: this.data.info.title,
            path: '/pages/find/PGC_details/PGC_details?puid='+this.data.uid+'&id='+this.data.id
        }
    }
})