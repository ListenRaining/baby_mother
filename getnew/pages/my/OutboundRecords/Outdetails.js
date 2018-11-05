//申请成为教师
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    information: [],

    ins_address: '',      //机构地址
    ins_name: '',         //机构名称
    ins_category: '',     //机构性质
    ins_students: '',     //机构生源数量
    ins_matching: '',     //是否有匹配教室
    ins_cooperation: '',  //合作意愿
    summary: '',          //情况汇总
    advice: '',           //合作建议
    room_long: '',        //教室长度
    room_wide: '',        //教室宽度
    room_height: '',      //教室房高
    ins_network: '',      //是否有50～100M网络
    ins_wall: '',         //是否有实体墙
    students_age: '',     //学员年龄段
    ins_years: '',        //经营年限
    head_resources: '',   //负责人所有资源

    category: ['艺术培训', '早教', '综合体', '其他'],
    proportion: ['请选择机构面积', '100平米以下', '100-200平米', '200-300平米', '300平米以上'],
    proportionIndex: 0,
    matching: ['是', '否'],
    network: ['是', '否'],
    wall: ['是', '否'],
    cooperation: ['愿意', '不愿意', '会考虑'],
    citylist: [],
    cityIndex: 0,

    //本地路径
    insDoorVal: '',        //机构门口照片
    insSurroundingVal: '',  //周边环境照片
    insReceptionVal: '',    //机构前台照片
    insClassroomVal: '',    //匹配教室照片
    insGroupphotoVal: '',   //与负责人合影照片

    //真实图片地址
    DoorImg: '',            //机构门口照片
    SurroundingImg: '',     //周边环境照片
    ReceptionImg: '',       //机构前台照片
    ClassroomImg: '',       //匹配教室照片
    GroupphotoImg: '',      //与负责人合影照片
  },

  onLoad: function (options) {

    var that = this;

    //编辑外访记录
    if (options.id) {
      //获取城市列表
      wx.request({
        url: app.globalData.baseUrl + 'little/operate/getcityList',
        data: {
          id: options.id
        },
        success: function (res) {
          that.setData({
            id: options.id,
            citylist: res.data.info,
            ins_address: res.data.information.ins_address,
            ins_name: res.data.information.ins_name,
            cityIndex: res.data.information.cityid,
            ins_area: res.data.information.ins_area,
            ins_category: res.data.information.ins_category,
            proportionIndex: res.data.information.ins_proportion,
            ins_students: res.data.information.ins_students,
            ins_matching: res.data.information.ins_matching,
            ins_cooperation: res.data.information.ins_cooperation,
            summary: res.data.information.summary,
            advice: res.data.information.advice,
            insDoorVal: res.data.information.doorImg,
            insSurroundingVal: res.data.information.surroundingImg,
            insReceptionVal: res.data.information.receptionImg,
            insClassroomVal: res.data.information.classroomImg,
            insGroupphotoVal: res.data.information.groupphotoImg,
            room_long: res.data.information.room_long,
            room_wide: res.data.information.room_wide,
            room_height: res.data.information.room_height,
            ins_network: res.data.information.ins_network,
            ins_wall: res.data.information.ins_wall,
            students_age: res.data.information.students_age,
            ins_years: res.data.information.ins_years,
            head_resources: res.data.information.head_resources
          })
        }
      })
    } else {
      //获取城市列表
      wx.request({
        url: app.globalData.baseUrl + 'little/operate/getcityList',
        data: {},
        success: function (res) {
          that.setData({
            citylist: res.data.info
          })
        }
      })
    }
  },

  //获取定位
  getAddress: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log('地址定位成功：', res);
        that.setData({
          ins_address: res.address
        })
      },
      fail: function (res2) {
        console.log('地址定位失败', res2);
      }
    })
  },

  /**
   * 提交验证信息
   */
  formSubmit: function (e) {

    var that = this;

    if (e.detail.value.ins_address == '') {
      wx.showModal({
        title: '请输入机构地址！',
        showCancel: false,
      })
      return false;
    }

    if (e.detail.value.ins_name == '') {
      wx.showModal({
        title: '请输入机构名称！',
        showCancel: false,
      })
      return false;
    }

    if (e.detail.value.cityid == 0) {
      wx.showModal({
        title: '请选择机构所在城市！',
        showCancel: false,
      })
      return false;
    }

    if (e.detail.value.ins_area == '') {
      wx.showModal({
        title: '请输入机构所在区域！',
        showCancel: false,
      })
      return false;
    }

    wx.getStorage({
      key: 'userinfo',
      success: function (info) {
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/addInsOutbound',
          data: {
            id: that.data.id,
            uid: info.data.uid,
            ins_address: e.detail.value.ins_address,
            ins_name: e.detail.value.ins_name,
            cityid: e.detail.value.cityid,
            ins_area: e.detail.value.ins_area,
            ins_category: e.detail.value.ins_category,
            ins_proportion: e.detail.value.ins_proportion,
            ins_students: e.detail.value.ins_students,
            ins_matching: e.detail.value.ins_matching,
            ins_cooperation: e.detail.value.ins_cooperation,
            summary: e.detail.value.summary,
            advice: e.detail.value.advice,
            doorImg: that.data.DoorImg,
            surroundingImg: that.data.SurroundingImg,
            receptionImg: that.data.ReceptionImg,
            classroomImg: that.data.ClassroomImg,
            groupphotoImg: that.data.GroupphotoImg,

            room_long: e.detail.value.room_long,
            room_wide: e.detail.value.room_wide,
            room_height: e.detail.value.room_height,
            ins_network: e.detail.value.ins_network,
            ins_wall: e.detail.value.ins_wall,
            students_age: e.detail.value.students_age,
            ins_years: e.detail.value.ins_years,
            head_resources: e.detail.value.head_resources
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          success: function (res) {
            if (res.data.result == 'succ') {

              if (that.data.id > 0) {
                var title = '机构信息修改成功';
              } else {
                var title = '机构信息添加成功';
              }

              wx.showModal({
                title: title,
                showCancel: false,
                success: function (result) {
                  if (result.confirm == true) {
                    wx.redirectTo({
                      url: '/pages/my/outbound/list'
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: res.data.reason,
                showCancel: false,
              })
              return false;
            }
          }
        })
      }
    })
  },

  /**
   * 机构门口照
   */
  addDoorImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],      //可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: app.globalData.baseUrl + 'little/operate/uploadimage',
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: function (result) {
            var img = JSON.parse(result.data);

            that.setData({
              insDoorVal: res.tempFilePaths[0],
              DoorImg: img.info[750]
            })
          },
          fail: function (resp) {
            console.log('机构门口照上传失败', resp)
            wx.showModal({
              title: '机构门口照上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除图片--机构门口照
   */
  delDoorImg: function (e) {
    this.setData({
      insDoorVal: '',
      DoorImg: ''
    })
  },


  /**
   * 周边环境照片
   */
  addSurroundingImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],      //可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: app.globalData.baseUrl + 'little/operate/uploadimage',
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: function (result) {
            var img = JSON.parse(result.data);

            that.setData({
              insSurroundingVal: res.tempFilePaths[0],
              SurroundingImg: img.info[750]
            })
          },
          fail: function (resp) {
            console.log('周边环境照片上传失败', resp)
            wx.showModal({
              title: '周边环境照片上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除图片--周边环境照片
   */
  delSurroundingImg: function (e) {
    this.setData({
      insSurroundingVal: '',
      SurroundingImg: ''
    })
  },

  /**
   * 机构前台照片
   */
  addReceptionImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],      //可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: app.globalData.baseUrl + 'little/operate/uploadimage',
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: function (result) {
            var img = JSON.parse(result.data);

            that.setData({
              insReceptionVal: res.tempFilePaths[0],
              ReceptionImg: img.info[750]
            })
          },
          fail: function (resp) {
            console.log('机构前台照片上传失败', resp)
            wx.showModal({
              title: '机构前台照片上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除图片--机构前台照片
   */
  delReceptionImg: function (e) {
    this.setData({
      insReceptionVal: '',
      ReceptionImg: ''
    })
  },

  /**
   * 匹配教室照片
   */
  addClassroomImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],      //可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: app.globalData.baseUrl + 'little/operate/uploadimage',
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: function (result) {
            var img = JSON.parse(result.data);

            that.setData({
              insClassroomVal: res.tempFilePaths[0],
              ClassroomImg: img.info[750]
            })
          },
          fail: function (resp) {
            console.log('匹配教室照片上传失败', resp)
            wx.showModal({
              title: '匹配教室照片上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除图片--机构前台照片
   */
  delClassroomImg: function (e) {
    this.setData({
      insClassroomVal: '',
      ClassroomImg: ''
    })
  },

  /**
   * 与负责人合影照片
   */
  addGroupphotoImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],      //可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: app.globalData.baseUrl + 'little/operate/uploadimage',
          filePath: res.tempFilePaths[0],
          name: 'image',
          success: function (result) {
            var img = JSON.parse(result.data);

            that.setData({
              insGroupphotoVal: res.tempFilePaths[0],
              GroupphotoImg: img.info[750]
            })
          },
          fail: function (resp) {
            console.log('与负责人合影照片上传失败', resp)
            wx.showModal({
              title: '与负责人合影照片上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除图片--与负责人合影照片
   */
  delGroupphotoImg: function (e) {
    this.setData({
      insGroupphotoVal: '',
      GroupphotoImg: ''
    })
  },

  /**
   * 机构所在城市
   */
  bindCityChange: function (e) {
    this.setData({
      cityIndex: e.detail.value
    })
  },

  /**
   * 机构面积
   */
  bindProportionChange: function (e) {
    this.setData({
      proportionIndex: e.detail.value
    })
  }
})