//申请成为教师
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    ins_matchingIndex: 0,
    ins_matchingSelect: ["请选择有无匹配教室", "有", "无",],  //教室选择
    statusIndex: 0,
    statusSelect: ["请选择审核结果", "通过", "未通过", "待定"],  //审核结果
    //定义多文本输入字符数
    textareamin: 0,//最少字数
    textareamax: 100,//最多字数

    //匹配教室如果选择有那么久显示匹配教室照片
    show_classroomImg:false,
    //审核结果如果选择未通过显示未通过原因文本框
    show_comment: false,
  },

  onLoad: function (options) {
    var that = this;
    //编辑外访记录
    if (options.id) {
      var timestamp = app.createTimeStamp()
      var str = "id=" + options.id + '&timestamp=' + timestamp
      var signature = app.createSignatureStr(str);

      wx.request({
        url: app.globalData.baseUrl + 'little/operate/getoutboundInfo',
        data: {
          id: options.id,
          timestamp: timestamp,
          signature: signature,
        },
        success: function (res) {
          console.log(res);
          that.setData({
            id:res.data.info.id,
            cid:res.data.info.cid,
            //+++
            ins_name: options.ins_name,
            username: options.username,
            mobile: options.mobile,
            address: options.address,
            //+++
            doorImg_big:res.data.info.doorImg, //机构门头照片
            receptionImg_big:res.data.info.receptionImg, //机构前台照片
            ins_matchingIndex: res.data.info.ins_matching ? that.findindexof(that.data.ins_matchingSelect, res.data.info.ins_matching) : 0, //选择有无匹配教室
            classroomImg_big:res.data.info.classroomImg, //匹配教室照片
            surroundingImg_big:res.data.info.surroundingImg, //周围环境照片
            groupphotoImg_big:res.data.info.groupphotoImg, //与负责人合影
            statusIndex: res.data.info.status == 9 ? 0 : res.data.info.status, //审评结果
            comment:res.data.info.comment, //未通过原因
            //选填内容
            businessImgOne_big:res.data.info.businessImgOne, //负责人身份证(正面)
            businessImgTwo_big:res.data.info.businessImgTwo, //负责人身份证(反面)
            licenseImg_big:res.data.info.licenseImg, //营业执照
            legalImg_big:res.data.info.legalImg, //场地合法使用证明
            head_resources:res.data.info.head_resources, //负责人所有资源

            dotime: res.data.info.dotime
          })
        }
      })
    }
  },

 
  /**
   * 提交验证信息
   */
  formSubmit: function (e) {
    var that = this;
    //必填内容
    var doorImg = that.data.doorImg_big //机构门头照片
    var receptionImg = that.data.receptionImg_big //机构前台照片
    var ins_matching = e.detail.value.ins_matching //选择有无匹配教室
    var classroomImg = that.data.classroomImg_big //匹配教室照片
    var surroundingImg = that.data.surroundingImg_big //周围环境照片
    var groupphotoImg = that.data.groupphotoImg_big //与负责人合影
    var status = e.detail.value.status //审评结果
    var comment= e.detail.value.comment //未通过原因
    //选填内容
    var businessImgOne = that.data.businessImgOne_big //负责人身份证(正面)
    var businessImgTwo = that.data.businessImgTwo_big //负责人身份证(反面)
    var licenseImg = that.data.licenseImg_big //营业执照
    var legalImg = that.data.legalImg_big //场地合法使用证明
    var head_resources=e.detail.value.head_resources //负责人所有资源

    if (!doorImg) {
      wx.showModal({
        title: '请上传机构门头照片！',
        showCancel: false,
      })
      return false;
    }

    if (!receptionImg) {
      wx.showModal({
        title: '请上传机构前台照片！',
        showCancel: false,
      })
      return false;
    }

    if (that.findindexof(that.data.ins_matchingSelect, ins_matching) == 0) {
      wx.showModal({
        title: '选择有无匹配教室！',
        showCancel: false,
      })
      return false;
    }

    if (ins_matching =='有'  && !classroomImg ) {
      wx.showModal({
        title: '请上传匹配教室照片',
        showCancel: false,
      })
      return false;
    }

    if (!surroundingImg) {
      wx.showModal({
        title: '请上传周围环境照片',
        showCancel: false,
      })
      return false;
    }

    if (!groupphotoImg) {
      wx.showModal({
        title: '请上传与负责人合影照片',
        showCancel: false,
      })
      return false;
    }

    if (that.findindexof(that.data.statusSelect, status) == 0) {
      wx.showModal({
        title: '请选择审核结果',
        showCancel: false,
      })
      return false;
    }

    if (status =='2' &&  !comment) {
      wx.showModal({
        title: '请填写未通过原因!',
        showCancel: false,
      })
      return false;
    }
    
    wx.getStorage({
      key: 'userinfo',
      success: function (info) {
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/updateInsOutbound',
          data: {
            id: that.data.id,//
            //uid: info.data.uid,
            doorImg: doorImg,//机构门头照片
            receptionImg: receptionImg,//机构前台照片
            ins_matching: ins_matching,//选择有无匹配教室
            classroomImg: classroomImg ? classroomImg : '',//匹配教室照片
            surroundingImg: surroundingImg,//周围环境照片
            groupphotoImg: groupphotoImg,//与负责人合影
            status: status,//审评结果
            comment: comment ? comment : '',//未通过原因

            businessImgOne: businessImgOne ? businessImgOne :'',//负责人身份证(正面)
            businessImgTwo: businessImgTwo ? businessImgTwo : '',//负责人身份证(反面)
            licenseImg: licenseImg ? licenseImg : '',//营业执照
            legalImg: legalImg ? legalImg : '',//场地合法使用证明
            head_resources: head_resources ? head_resources : '' //负责人所有资源
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          success: function (res) {
            if (res.data.result == 'succ') {
              wx.showModal({
                title: '保存成功',
                showCancel: false,
                success: function (result) {
                  if (result.confirm == true) {
                    wx.redirectTo({
                      url: '/pages/my/outboundv10/list'
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

  //查看机构详情
  showInsCooper: function (e) {
    var cid=e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '/pages/my/outboundv10/insdetails?cid=' + cid
    })
  },

  //+++以下自定义函数/方法++++++++++++++++++++++++++++++++++

  /**
    上传机构门头口照
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
            console.log(img);
            that.setData({
              //doorImg_small: res.tempFilePaths[0],
              doorImg_small: img.info[375],
              doorImg_big: img.info[750]
            })
          },
          fail: function (resp) {
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
    删除机构门头口照
   */
  delDoorImg: function (e) {
    this.setData({
      doorImg_small: '',
      doorImg_big: ''
    })
  },

  /**
   * 上传机构前台照片
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
              receptionImg_small: img.info[375],
              receptionImg_big: img.info[750]
            })
          },
          fail: function (resp) {
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
   * 删除机构前台照片
   */
  delReceptionImg: function (e) {
    this.setData({
      receptionImg_small: '',
      receptionImg_big:''
    })
  },

  /**
  匹配教室
  */
  bindInsmatchingChange: function (e) {
    var ins_matchingIndex = e.detail.value;
    var ins_matchingName = this.data.ins_matchingSelect[ins_matchingIndex];
    this.setData({
      ins_matchingIndex: ins_matchingIndex,
      ins_matchingName: ins_matchingName,
    })

    if (ins_matchingName =='有'){
      this.setData({
        show_classroomImg: true
      })
    }else{
      this.setData({
        show_classroomImg: false
      })
    }

  },


  /**
   * 上传匹配教室照片
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
              classroomImg_small: img.info[375],
              classroomImg_big: img.info[750]
            })
          },
          fail: function (resp) {
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
      //classroomImg_small: '',
      classroomImg_big: ''
    })
  },
  
  /**
   * 上传周围环境照片
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
              //surroundingImg_small: img.info[375],
              surroundingImg_big: img.info[750]
            })
          },
          fail: function (resp) {
            wx.showModal({
              title: '周围环境照片上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除周围环境照片
   */
  delSurroundingImg: function (e) {
    this.setData({
      //surroundingImg_small: '',
      surroundingImg_big: ''
    })
  },


  /**
   * 上传与负责人合影照片
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
              //groupphotoImg_small: img.info[375],
              groupphotoImg_big: img.info[750]
            })
          },
          fail: function (resp) {
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
   * 删除与负责人合影照片
   */
  delGroupphotoImg: function (e) {
    this.setData({
      //groupphotoImg_small: '',
      groupphotoImg_big: ''
    })
  },

  /**
   审核结果
  */

  bindStatusChange: function (e) {
    var statusIndex = e.detail.value;
    var statusName = this.data.statusSelect[statusIndex];
    this.setData({
      statusIndex: statusIndex,
      statusName: statusName,
    })

    if (statusIndex == '2') {
      this.setData({
        show_comment: true
      })
    } else {
      this.setData({
        show_comment: false
      })
    }
  },

  //判断文本框字数
  inputComment: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //最少字数限制
    if (len <= this.data.textareamin)
      this.setData({
        texts: "请输入一定的审核内容"
      })
    else if (len > this.data.textareamin)
      this.setData({
        texts: " "
      })

    //最多字数限制
    if (len > this.data.textareamax) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      commentworld: len //当前字数  
    });
  },

  /**
   * 上传负责人身份证(正面)
   */
  addBusinessImgOne: function () {
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
              //businessImgOne_small: img.info[375],
              businessImgOne_big: img.info[750]
            })
          },
          fail: function (resp) {
            wx.showModal({
              title: '负责人身份证(正面)上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除负责人身份证(正面)
   */
  delBusinessImgOne: function (e) {
    this.setData({
      //businessImgOne_small: '',
      businessImgOne_big: ''
    })
  },


  /**
    上传负责人身份证(反面)
  */
  addBusinessImgTwo: function () {
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
              //businessImgTwo_small: img.info[375],
              businessImgTwo_big: img.info[750]
            })
          },
          fail: function (resp) {
            wx.showModal({
              title: '负责人身份证(反面)上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除负责人身份证(反面)
   */
  delBusinessImgTwo: function (e) {
    this.setData({
      //businessImgTwo_small: '',
      businessImgTwo_big: ''
    })
  },


  /**
   上传营业执照照片
  */
  addLicenseImg: function () {
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
              //licenseImg_small: img.info[375],
              licenseImg_big: img.info[750]
            })
          },
          fail: function (resp) {
            wx.showModal({
              title: '负责人身份证(反面)上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除营业执照照片
   */
  delLicenseImg: function (e) {
    this.setData({
      //licenseImg_small: '',
      licenseImg_big: ''
    })
  },


   /*
   * 上传场地合法使用证明
   */
  addLegalImg: function () {
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
              //legalImg_small: img.info[375],
              legalImg_big: img.info[750]
            })
          },
          fail: function (resp) {
            wx.showModal({
              title: '场地合法使用证明上传失败',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 删除场地合法使用证明
   */
  deLegalImg: function (e) {
    this.setData({
      //legalImg_small: '',
      legalImg_big: ''
    })
  },

  inputHeadResources: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //最少字数限制
    if (len <= this.data.textareamin)
      this.setData({
        texts: "请输入一定的审核内容"
      })
    else if (len > this.data.textareamin)
      this.setData({
        texts: " "
      })

    //最多字数限制
    if (len > this.data.textareamax) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      resourcesworld: len //当前字数  
    });
  },

  //通过value查找该值的key
  findindexof: function (arr, value) {
    if (arr.length == 0) {
      return false;
    }
    for (var i = 0; i <= arr.length; i++) {
      if (arr[i] === value) {
        return i;
      }
    }
  },

})