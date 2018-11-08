//机构申请
var app = getApp()

Page({

  data: {
    Type: [
      '请选择机构类型',
      '艺术培训机构',
      '亲子早教机构',
      '综合培训中心',
      '其他',
    ],
    //imageArr: [],
    areaIndex:0,      //机构类型下标
    insType: '',      //机构类型
    wallIndex:0,      //机构实体墙
    invoiceIndex:0,   //发票类型
    ageRange:'',      //年龄段
    sub_state: false,
    info:''
  },

    onLoad: function () {
        var that = this
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/institution/checkApply',
                    data: {
                        unionId: res.data.unionId
                    },
                    success: function (result) {
                        if (result.data.result == 'succ') {
                            that.setData({
                                info:result.data.info,
                                areaIndex:result.data.info.areaIndex,
                                insType:result.data.info.type,
                                wallIndex:result.data.info.ins_wall,
                                ageRange:result.data.info.agestr,
                                invoiceIndex:result.data.info.invoice_type
                            })
                        }
                    }
                })
            },
        })
    },

    /**
     * 提交信息
     */
    formSubmit: function (e) {
        console.log('表单提交信息',e)
        var that = this
        var name = e.detail.value.name
        var mobile = e.detail.value.mobile
        var email = e.detail.value.email
        var ins_name = e.detail.value.ins_name
        var insType = that.data.insType
        var ins_address = e.detail.value.ins_address
        var ins_area = e.detail.value.ins_area
        var ins_high = e.detail.value.ins_high
        var ins_wall = that.data.wallIndex
        var room_long = e.detail.value.room_long
        var room_wide = e.detail.value.room_wide
        var room_floor = e.detail.value.room_floor
        var stu_num = e.detail.value.stu_num
        var ageRange = that.data.ageRange
        var invoice_type = that.data.invoiceIndex
        var formId = e.detail.formId

        if (!name) {
            wx.showModal({
                title: '联系人不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!mobile) {
            wx.showModal({
                title: '联系人电话不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!email) {
            wx.showModal({
                title: '联系人邮箱不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!ins_name) {
            wx.showModal({
                title: '机构名称不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!insType) {
            wx.showModal({
                title: '请选择机构类型！',
                showCancel: false,
            })
            return false;
        }

        if (!ins_address) {
            wx.showModal({
                title: '机构地址不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!ins_area) {
            wx.showModal({
                title: '机构面积不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!ins_high) {
            wx.showModal({
                title: '机构层高不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!ins_wall) {
            wx.showModal({
                title: '请选择机构实体墙类型！',
                showCancel: false,
            })
            return false;
        }

        if (!room_long) {
            wx.showModal({
                title: '目标教室长不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!room_wide) {
            wx.showModal({
                title: '目标教室宽不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!room_floor) {
            wx.showModal({
                title: '目标教室所在楼层！',
                showCancel: false,
            })
            return false;
        }

        if (!stu_num) {
            wx.showModal({
                title: '生源数量不能为空！',
                showCancel: false,
            })
            return false;
        }

        if (!ageRange) {
            wx.showModal({
                title: '请选择现在生源年龄段！',
                showCancel: false,
            })
            return false;
        }

        if (!invoice_type) {
            wx.showModal({
                title: '请选择发票类型！',
                showCancel: false,
            })
            return false;
        }

        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrl + 'little/institution/apply',
                    data: {
                        name: name,
                        mobile: mobile,
                        email: email,
                        ins_name: ins_name,
                        insType: insType,
                        ins_address: ins_address,
                        ins_area: ins_area,
                        ins_high: ins_high,
                        ins_wall: ins_wall,
                        room_long: room_long,
                        room_wide: room_wide,
                        room_floor: room_floor,
                        stu_num: stu_num,
                        ageRange: ageRange,
                        invoice_type: invoice_type,
                        unionId:res.data.unionId,
                        openId:res.data.openId,
                        formId:formId
                    },
                    success: function (result) {
                        if (result.data.result == 'succ') {
                            wx.redirectTo({
                                url: '/pages/teamwork/success'
                            })
                            /*wx.showModal({
                             title: '提交成功，请耐心等待',
                             showCancel: false
                             })

                             that.setData({
                             sub_state: true
                             })

                             wx.removeStorage({
                             key: 'ApplyImg',
                             })*/
                        } else {
                            wx.showModal({
                                title: result.data.reason,
                                showCancel: false
                            })
                        }
                    },
                })
            }
        })

        //获取缓存中图片信息
        /*wx.getStorage({
            key: 'ApplyImg',
            success: function (res) {
                console.log('----image----',res.data)
                var img = [];
                for (var i = 0; i < res.data.length; i++) {
                    console.log("-----------------res.data-------------------", JSON.stringify(res.data));
                    img.push(res.data[i][750]);
                }

                wx.request({
                    url: app.globalData.baseUrl + 'little/institution/cooperation',
                    data: {
                        name: name,
                        mobile: mobile,
                        ageRange: ageRange,
                        insType: insType,
                        ins_address: ins_address,
                        ins_name: ins_name,
                        stu_num: stu_num,
                        img: img,
                    },
                    //method: 'post',
                    success: function (result) {
                        console.log('-----success-----', result)
                        if (result.data.result == 'succ') {
                            wx.showModal({
                                title: '提交成功，请耐心等待',
                                showCancel: false
                            })

                            wx.removeStorage({
                                key: 'ApplyImg',
                            })
                            that.setData({
                                sub_state: true
                            })
                        } else {
                            wx.showModal({
                                title: result.data.reason,
                                showCancel: false
                            })
                        }
                    },
                })
            },
            fail: function (res) {
                wx.showModal({
                    title: '忘传图片了呦！',
                    showCancel: false,
                })
            },
        })*/
    },

  /**
   * 选择机构类型
   */
  bindPickerChange: function(e) {
      var areaIndex = e.detail.value;
      var insType = this.data.Type[areaIndex];
      this.setData({
          areaIndex: areaIndex,
          insType: insType
      })
  },

  /**
   * 机构实体墙
   */
  wallChange: function(e) {
      this.setData({
          wallIndex: e.detail.value
      })
  },

  /**
   * 发票类型
   */
  invoiceChange: function(e) {
      this.setData({
          invoiceIndex: e.detail.value
      })
  },

  /**
   * 选择年龄段
   */
  checkboxChange: function(e) {
    var rangeArr = e.detail.value;
    var range = JSON.stringify(rangeArr);
    this.setData({
      ageRange:range
    })
  },

  /**
 * 选择图片
 */
  /*addImg: function () {
    if (this.data.imageArr.length >= 2) {
      wx.showModal({
        title: '图片已达上限',
        showCancel: false
      })
      return;
    }
    var imageCnt = 2 - this.data.imageArr.length;
    var that = this;
    wx.chooseImage({
      count: imageCnt, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '正在上传...',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imageArrTemp = that.data.imageArr;
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          imageArrTemp.push(res.tempFilePaths[i]);
        }
        that.setData({
          imageArr: imageArrTemp
        })

        //上传图片
        that.multi_upload(res.tempFilePaths, 0, res.tempFilePaths.length)
        console.log("-----------------res.tempFilePaths----------------", res.tempFilePaths);
      }
    })
  },*/

  //上传多张图
  /*multi_upload(files, i, length) {
    var that = this
    if (i == length) {
      //隐藏loading，激活发布按钮
      wx.hideLoading()
      return false
    }
    wx.uploadFile({
      url: app.globalData.baseUrl + 'little/institution/uploadimage',
      filePath: files[i],
      name: 'image',
      success: function (res) {
        var img = JSON.parse(res.data);
        var tmp = [];
        tmp.push(img.info);

        // 将返回的服务器图片路径存入缓存
        wx.getStorage({
          key: 'ApplyImg',
          success: function (res2) {
            var tmps = res2.data
            console.log("-----------------tmps------------------", JSON.stringify(tmps));
            tmps.push(img.info)
            console.log('--storage--', tmps)
            wx.setStorage({
              key: 'ApplyImg',
              data: tmps,
            })
          },
          fail: function (res) {
            wx.setStorage({
              key: 'ApplyImg',
              data: tmp,
            })
          }
        })

      },
      fail: function (resp) {
        wx.showToast({
          title: '上传图片失败',
        })
      },
      complete: function () {
        i++
        that.multi_upload(files, i, length)
      }
    })
  },*/
})
