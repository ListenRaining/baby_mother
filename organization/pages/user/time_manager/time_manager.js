//时间库存管理
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ins_id:0,        //机构id
    list:[],
    type:1,
    datelist:[],
    timeArr:[],
    dayArr:['周一','周二','周三','周四','周五','周六','周日'],
    appointArr:[],       //选中的单元格数组
    date:0,
    selectLength:0,      //单元格的长度
    is_join_activity:0   //是否可以参加活动 0-没有活动方案  1-有活动方案
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      var that = this

      //清空单元格数据缓存
      wx.removeStorage({
          key: 'timeManager',
          success: function(res) {
              console.log('onload:清空所有单元格数据缓存')
          }
      })

      //清空所选单元格缓存
      wx.removeStorage({
          key: 'selectValue',
          success: function(res) {
              console.log('onload:清空所选单元格缓存')
          }
      })

      wx.getStorage({
          key: 'userinfo',
          success: function (info) {
              wx.request({
                  url: app.globalData.baseUrl + 'little/institution/timeStock',
                  data: {
                      ins_id: info.data.ins_id,
                      type: that.data.type,
                      date: that.data.date
                  },
                  success: function (res) {
                      wx.setStorage({
                          key: 'timeManager',
                          data: res.data.info,
                      })
                      that.setData({
                          ins_id: info.data.ins_id,
                          list: res.data.info,
                          type: res.data.type,
                          timeArr: res.data.stock_time,
                          datelist: res.data.datelist,
                          appointArr:[],
                          is_join_activity:res.data.is_join_activity
                      })
                  }
              })
          }
      })
  },

    //切换栏目
    toggle: function (e) {
        var type = e.currentTarget.dataset.type;
        var that = this

        //切换时间段、清空单元格缓存
        wx.removeStorage({
            key: 'selectValue',
            success: function(res) {
                console.log('切换栏目、清空单元格缓存')
            }
        })

        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/institution/timeStock',
                    data: {
                        ins_id: info.data.ins_id,
                        type: type,
                        date: that.data.date
                    },
                    success: function (res) {
                        wx.setStorage({
                            key: 'timeManager',
                            data: res.data.info,
                        })
                        that.setData({
                            list: res.data.info,
                            type: type,
                            timeArr: res.data.stock_time,
                            datelist: res.data.datelist,
                            appointArr:[]
                        })
                    }
                })
            }
        })
    },

    //勾选单元格
    clickView: function (e) {

       return false;

        var that = this

        //类型
        var type = e.currentTarget.dataset.type;
        //时间段
        var time_period = e.currentTarget.dataset.time_period;
        //时间段下标
        var time_period_index = e.currentTarget.dataset.time_period_index;
        //坐标
        var mark = e.currentTarget.dataset.mark;
        //周几
        var week = e.currentTarget.dataset.week;
        //所选当天日期
        var datetime = e.currentTarget.dataset.datetime;
        //所选单元格缓存
        var selectCache;

        wx.getStorage({
            key: 'timeManager',
            success: function(res) {
                var info = res.data

                //勾选操作
                if(info[time_period][mark]['status'] == 3){

                    wx.getStorage({
                        key: 'selectValue',
                        success: function(res) {

                            //体验课和活动不能同时选两节课
                            if(type != 1){
                                wx.showModal({
                                    title: '体验课与活动一个单元格为一节课，请先确认选择。',
                                    showCancel:false
                                })
                                return false;
                            }else{

                                //魔法乐理最多选择2个单元格
                                if(that.data.selectLength >= 2){
                                    wx.showModal({
                                        title: '魔法乐理两个单元格为一节课，请先确认选择。',
                                        showCancel:false
                                    })
                                    return false;
                                }

                                //单元格缓存字符串
                                selectCache = res.data;

                                //分割为单元格缓存数组
                                var selectCacheArray = selectCache[0].split('__');

                                //魔法乐理的选择判断
                                //选择的是：已选单元格的上下相邻单元格
                                if(((selectCacheArray[0] - time_period_index == 1) || selectCacheArray[0] - time_period_index == -1) && selectCacheArray[1] == week){
                                    var endStr = selectCache.concat([time_period_index+'__'+week+'__'+datetime+'__'+time_period]);

                                    //更新单元格缓存
                                    wx.setStorage({
                                        key: 'selectValue',
                                        data: endStr
                                    })

                                    //空白单元格设置为已选择
                                    info[time_period][mark]['status'] = 2;
                                    //可以取消
                                    info[time_period][mark]['do_cancel'] = 1;

                                    //更新数据缓存
                                    wx.setStorage({
                                        key: 'timeManager',
                                        data: info
                                    })

                                    //下方同步显示勾选的时间段
                                    var appointArr = that.data.appointArr;
                                    var appointArr_str = appointArr.concat([time_period]);

                                    that.setData({
                                        list:info,
                                        selectLength:endStr.length,
                                        appointArr:appointArr_str
                                    })
                                }else{
                                    //不是选的同一天的单元格
                                    wx.showModal({
                                        title: '请选择同一天相邻的时间段',
                                        showCancel:false
                                    })
                                }
                            }
                        },

                        //单元格缓存为空
                        fail:function () {

                            //魔法乐理：同时只能有2个未开班的班级
                            if(type == 1){
                                wx.request({
                                    url: app.globalData.baseUrl + 'little/institution/getOpenClassCount',
                                    data: {
                                        ins_id:that.data.ins_id
                                    },
                                    success: function (res) {
                                        if(res.data.result == 'succ'){
                                            that.firstSelect(info,time_period_index,week,datetime,time_period,mark)
                                        }else{
                                            wx.showModal({
                                                title: res.data.reason,
                                                showCancel:false
                                            })
                                        }
                                    }
                                })
                            }else{
                                that.firstSelect(info,time_period_index,week,datetime,time_period,mark)
                            }
                        }
                    })
                }else if(info[time_period][mark]['status'] == 2){ //取消勾选

                    wx.getStorage({
                        key: 'selectValue',
                        success: function (res) {

                            selectCache = res.data;
                            var del_index = selectCache.indexOf(time_period_index+'__'+week+'__'+datetime+'__'+time_period);
                            selectCache.splice(del_index, 1);

                            //不是全部取消，则更新单元格缓存
                            if(selectCache.length>0){
                                wx.setStorage({
                                    key: 'selectValue',
                                    data: selectCache
                                })
                            }else{
                                //已全部取消勾选的单元格
                                wx.removeStorage({
                                    key: 'selectValue',
                                    success: function(res) {
                                        console.log('勾选的单元格都已取消、清空单元格缓存')
                                    }
                                })
                            }

                            //下方同步取消勾选时间段
                            var appointArr = that.data.appointArr;
                            var del_appointArr_index = appointArr.indexOf(time_period);
                            appointArr.splice(del_appointArr_index, 1);

                            info[time_period][mark]['status'] = 3;

                            //更新数据缓存
                            wx.setStorage({
                                key: 'timeManager',
                                data: info
                            })

                            that.setData({
                                list:info,
                                selectLength:selectCache.length,
                                appointArr:appointArr
                            })
                        }
                    })
                }
            }
        })
    },

    //第一次勾选单元格
    firstSelect:function (info,time_period_index,week,datetime,time_period,mark) {

        var that = this

        //如果是勾选活动，判断是否有此机构可参与的活动方案
        if(that.data.type == 3 && that.data.is_join_activity == 0){
            wx.showModal({
                title: '暂无活动方案',
                showCancel:false
            })
            return false;
        }

        var first = [time_period_index+'__'+week+'__'+datetime+'__'+time_period];
        wx.setStorage({
            key: 'selectValue',
            data: first
        })

        //设置活动时间
        if (that.data.type == 3) {
            var act_date = datetime + ' ' + time_period;
            wx.setStorage({
                key: 'act_date',
                data: act_date,
            })
        }

        //空白单元格设置为已选择
        info[time_period][mark]['status'] = 2;
        //可以取消
        info[time_period][mark]['do_cancel'] = 1;

        //更新单元格数据缓存
        wx.setStorage({
            key: 'timeManager',
            data: info
        })

        //下方同步显示勾选的时间段
        var appointArr = [time_period];

        that.setData({
            list:info,
            selectLength:first.length,
            appointArr:appointArr
        })
    },

    //最下方的取消已勾选模块
    delSelect: function (e) {

        var that = this

        wx.getStorage({
            key: 'timeManager',
            success: function (res) {
                var info = res.data
                wx.getStorage({
                    key: 'selectValue',
                    success: function (res2) {

                        var selectValue = res2.data;

                        for (var i = 0; i < selectValue.length; i++) {

                            var delValue = selectValue[i];
                            var delValueIndex = delValue.indexOf(e.currentTarget.dataset.item);

                            if(delValueIndex > 0){

                                selectValue.splice(i,1);

                                //不是全部取消，则更新单元格缓存
                                if(selectValue.length>0){
                                    wx.setStorage({
                                        key: 'selectValue',
                                        data: selectValue
                                    })
                                }else{
                                    //已全部取消勾选的单元格
                                    wx.removeStorage({
                                        key: 'selectValue',
                                        success: function(res) {
                                            console.log('勾选的单元格都已取消、清空单元格缓存')
                                        }
                                    })
                                }

                                //更新数据缓存
                                var delValueArray= delValue.split('__');
                                var coordinate = delValueArray[0]+'-'+delValueArray[1];

                                info[delValueArray[3]][coordinate]['status'] = 3;

                                //更新数据缓存
                                wx.setStorage({
                                    key: 'timeManager',
                                    data: info
                                })

                                //下方同步取消勾选时间段
                                var appointArr = that.data.appointArr;
                                var del_appointArr_index = appointArr.indexOf(e.currentTarget.dataset.item);
                                appointArr.splice(del_appointArr_index, 1);

                                that.setData({
                                    list:info,
                                    selectLength: selectValue.length,
                                    appointArr: appointArr
                                })
                            }
                        }
                    }
                })
            }
        })
    },

    //确认选择
    submitSelect:function(_e){

        var that= this;

        //判断魔法乐理所选单元格是否满足需求
        if(that.data.type == 1 && that.data.selectLength < 2){
            wx.showModal({
                title: '魔法乐理需要勾选两个单元格。',
                showCancel:false
            })
            return false;
        }else if(that.data.type != 1 && that.data.selectLength < 1){  //判断体验课和活动是否满足需求
            wx.showModal({
                title: '体验课与活动需勾选一个单元格。',
                showCancel:false
            })
            return false;
        }

        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                wx.getStorage({
                    key: 'selectValue',
                    success: function (res) {

                        if((res.data.length == 2 && that.data.type == 1) || (res.data.length == 1 && that.data.type != 1)){

                            if(that.data.type == 1){
                                var selectArr = res.data;
                                var selectArrL = selectArr[0].split('__');
                                var selectArrR = selectArr[1].split('__');
                                if(selectArrL[0] > selectArrR[0]){
                                    var SelectTitle = '您确认要在'+selectArrR[3]+'、'+selectArrL[3]+'创建班级吗？'
                                }else{
                                    var SelectTitle = '您确认要在'+selectArrL[3]+'、'+selectArrR[3]+'创建班级吗？'
                                }
                            }else{
                                var selectArr = res.data;
                                var selectArrL = selectArr[0].split('__');

                                if(that.data.type == 2){
                                    var SelectTitle = '您确认要在'+selectArrL[3]+'创建班级吗？'
                                }else if(that.data.type == 3){
                                    var SelectTitle = '您确认要在'+selectArrL[3]+'创建活动吗？'
                                }
                            }

                            wx.showModal({
                                title: '提示',
                                content: SelectTitle,
                                success: function(reshow) {
                                    if (reshow.confirm) {
                                        wx.request({
                                            url: app.globalData.baseUrl+ 'little/Institution/createClass',
                                            data:{
                                                ins_id: info.data.ins_id,
                                                type: that.data.type,
                                                date: that.data.date,
                                                selectValue:res.data
                                            },
                                            success:function(_res){
                                                console.log('班级创建成功:',_res)
                                                if (_res.data.result == 'succ') {

                                                    //提交成功、删除刚才选择的单元格缓存
                                                    wx.removeStorage({
                                                        key: 'selectValue',
                                                        success: function(res) {
                                                            console.log('确认提交、清空单元格数据')
                                                        }
                                                    })

                                                    //更新数据缓存
                                                    wx.setStorage({
                                                        key: 'timeManager',
                                                        data: _res.data.info
                                                    })

                                                    that.setData({
                                                        list:_res.data.info,
                                                        selectLength:0,
                                                        appointArr:[]
                                                    })

                                                    //如果为创建活动(type==3)，跳转到活动创建页面
                                                    if (that.data.type == 3) {
                                                        wx.getStorage({
                                                            key: 'act_date',
                                                            success: function(act) {
                                                                wx.navigateTo({
                                                                    url: '/pages/activity/activity_apply/activity_apply?act_date=' + act.data+'&class_id='+_res.data.class_id,
                                                                })
                                                            },
                                                        })
                                                    }else{
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '班级创建成功，请等待教学督导审核！',
                                                            showCancel:false
                                                        })
                                                    }

                                                } else {
                                                    wx.showModal({
                                                        title: '提示',
                                                        content: _res.data.reason,
                                                        showCancel:false
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }else{
                            wx.showModal({
                                title: '请选择单元格。',
                                showCancel:false
                            })
                            return false;
                        }
                    },
                    //单元格缓存为空
                    fail:function () {
                        wx.showModal({
                            title: '请选择单元格。',
                            showCancel:false
                        })
                        return false;
                    }
                })
            }
        })
    },

    //班级创建成功，跳转到班级详情页
    goClassDetail: function (e) {
        if(e.currentTarget.dataset.type == 3){
            wx.navigateTo({
                url: "/pages/activity/activity_detail/activity_detail?ins_act_id=" + e.currentTarget.dataset.ins_act_id + "&is_online=" + e.currentTarget.dataset.is_online
            })
        }else{
            wx.navigateTo({
                url: '/pages/class/class_message/class_message?class_id='+e.currentTarget.dataset.class_id,
            })
        }
    },

    //时间段筛选
    bindDateChange: function (e) {

        //切换时间段、清空单元格缓存
        wx.removeStorage({
            key: 'selectValue',
            success: function(res) {
                console.log('切换时间段、清空单元格缓存')
            }
        })

        var that = this

        wx.getStorage({
            key: 'userinfo',
            success: function (info) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/institution/timeStock',
                    data: {
                        ins_id: info.data.ins_id,
                        date: e.detail.value,
                        type: that.data.type
                    },
                    success: function (res) {
                        wx.setStorage({
                            key: 'timeManager',
                            data: res.data.info,
                        })
                        that.setData({
                            list: res.data.info,
                            date: res.data.date,
                            appointArr:[]
                        })
                    }
                })
            }
        })
    }
})