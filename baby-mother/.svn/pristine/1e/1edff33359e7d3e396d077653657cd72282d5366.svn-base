var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rootRelativePath: '../../../',
    imageCntMax: 3,
    imageArr: [],
    imageUrl: [],
    csign: 0,    //是否是任务
    mycontent: '', //保存的文字内容
    disabled: true,
    mission_type: ['勇闯音乐岛', '唱儿歌','跳舞','成长图'],
    mission_index: 0,
    add: 0,        //默认不知道图文还是视频
    content_type: ['图文'],
    video: '',     //上传视频后的链接
  },

  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'mycontent',
      success: function (res) {
        that.setData({
          mycontent: res.data
        })
      },
    })

    // /**
    //  * 安卓版本提示视频10S
    //  */
    // wx.getSystemInfo({
    //   success: function(res) {
    //     var system = res.system.slice(0,3)
    //     if (system == 'iOS') {
    //       that.setData({
    //         content_type: ['图文', '视频'],
    //       })
    //     } else {
    //       that.setData({
    //         content_type: ['图文', '视频(10秒)'],
    //       })
    //     }
    //   },
    // })
  },

  /**
   * 页面卸载时清除图片缓存
   */
  onHide: function () {
    wx.removeStorage({
      key: 'contentImg',
      success: function () { },
    })
  },

  /**
   * 移除选择的图片
   */
  removeImage: function (_event) {
    var that = this
    var index = _event.currentTarget.dataset.index;
    console.log("-----------------_event.currentTarget.dataset----------------", index);
    var imageArrTemp = this.data.imageArr;
    imageArrTemp.splice(index, 1);
    this.setData({
      imageArr: imageArrTemp
    })
    //同时删除缓存中的上传信息
    wx.getStorage({
      key: 'contentImg',
      success: function (res) {
        var arr = res.data
        arr.splice(index, 1);
        console.log(arr)
        if (arr.length == 0) {
          that.setData({
            add: 2
          })
        }
        wx.setStorage({
          key: 'contentImg',
          data: arr,
        })
        
      },
    })
  },

  /**
   * 选择图片
   */
  chooseImage: function () {
    if (this.data.imageArr.length >= this.data.imageCntMax) {
      wx.showModal({
        title: '图片已达上限',
        showCancel: false
      })
      return;
    }
    var imageCnt = this.data.imageCntMax - this.data.imageArr.length;
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
  },


  //上传多张图
  multi_upload(files, i, length) {
    var that = this
    if (i == length) {
      //隐藏loading，激活发布按钮
      wx.hideLoading()
      that.setData({
        disabled: false
      })
      return false
    }
    wx.uploadFile({
      url: app.globalData.baseUrl + 'little/operate/uploadimage',
      filePath: files[i],
      name: 'image',
      success: function (res) {
        var img = JSON.parse(res.data);
        var tmp = [];
        tmp.push(img.info);

        // 将返回的服务器图片路径存入缓存
        wx.getStorage({
          key: 'contentImg',
          success: function (res2) {
            var tmps = res2.data
            console.log("-----------------tmps------------------", JSON.stringify(tmps));
            tmps.push(img.info)
            console.log('--storage--', tmps)
            wx.setStorage({
              key: 'contentImg',
              data: tmps,
            })
          },
          fail: function (res) {
            wx.setStorage({
              key: 'contentImg',
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
  },

  /**
   * 选择视频
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      // sourceType: ['camera',],
      maxDuration: 10,
      camera: 'back',
      success: function (res) {
        console.log(res)
        that.setData({
          disabled: false,
          src: res.tempFilePath
        })
        wx.showLoading({
          title: '正在上传...',
          mask:true,
        })
        //上传
        wx.uploadFile({
          url: app.globalData.baseUrl + 'little/operate/uploadVideo',
          filePath: res.tempFilePath,
          name: 'video',
          success: function (e) {
            wx.hideLoading();
            console.log(e.data)
            var data = JSON.parse(e.data.trim())
            if (data.result == 'succ') {
              that.setData({
                video: data.info
              })
            } else {
              wx.showModal({
                title: '提示',
                content: data.reason,
                showCancel: false,
                success: function(es) {
                  if (es.confirm == true) {
                    that.setData({
                      src: ''
                    })
                  }
                }
              })
              
            }
          },
          fail: function () {
            wx.showModal({
              title: '提示',
              content: '上传视频失败',
              showCancel: false,
            })
            wx.hideLoading()
          }
        })

      }
    })
  },
   */

  /**
   * 提交信息
   */
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var content = e.detail.value.content
    wx.getStorage({
      key: 'userinfo',
      success: function (user) {
        // 发布视频信息
        console.log('video',that.data.video)
        if (that.data.video) {
          wx.request({
            url: app.globalData.baseUrl + 'little/operate/sendarticle',
            data: {
              uid: user.data.uid,
              content: content,
              video: that.data.video,
              video_type: that.data.mission_index,   //任务类型
              csign: that.data.csign                //是否任务
            },
            success: function(res) {
              console.log('发布视频',res)
              if (res.data.result == 'succ') {
                //发布成功刷新页面
                wx.setStorage({
                  key: 'reload',
                  data: 1,
                })
                //跳转首页
                wx.switchTab({
                  url: '/pages/find/index/index',
                })

                //清除文字缓存
                wx.removeStorage({
                  key: 'mycontent',
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
        } else {
          // 获取缓存中图片信息
          wx.getStorage({
            key: 'contentImg',
            success: function (res) {
              console.log(res.data)
              var thumb_img = [];
              var img = [];
              var uid = user.data.uid;
              for (var i = 0; i < res.data.length; i++) {
                console.log("-----------------res.data-------------------", JSON.stringify(res.data));
                thumb_img.push(res.data[i][375]); //配置的图片大小
                img.push(res.data[i][750]);
              }

              wx.request({
                url: app.globalData.baseUrl + 'little/operate/sendarticle',
                data: {
                  uid: uid,
                  content: content,
                  thumb_img: thumb_img,
                  img: img,
                },
                success: function (result) {
                  console.log('-----success-----', result)
                  if (result.data.result == 'succ') {
                    //发布成功刷新页面
                    wx.setStorage({
                      key: 'reload',
                      data: 1,
                    })

                    wx.switchTab({
                      url: '/pages/find/index/index',
                    })
                    //清除文字缓存
                    wx.removeStorage({
                      key: 'mycontent',
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: result.data.reason,
                      showCancel: false,
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
            }
          })
        }
      },
    })


  },

  /**
   * 检查是否为投稿文章
   */
  is_csign: function (res) {
    console.log(res)
    var text = res.detail.value;
    console.log(text.length)
    wx.setStorage({
      key: 'mycontent',
      data: text,
    })
  },

  /**
   * 是否传任务
   */
  checkboxChange: function (e) {
    console.log(e)
    if (e.detail.value[0] == 1) {
      var csign=1
    } else {
      var csign=0
    }

    //如果选择任务，默认第一个任务类型
    if (csign == 1) {
      this.setData({
        mission_index: 0,
        add: 1,
      })
    } else {
      //取消任务
      this.setData({
        add: 2,
      })
    }
    this.setData({
      csign: csign
    })


  },

  /**
   * 选择任务类型
   */
  bindPickerChange: function (e) {
    console.log(e)
    var val = e.detail.value

    /**
     * 判断‘+’的上传类型
     */
    if (val == 3) {
      var add = 0;       //图文信息
    }
    if (val < 3) {
      var add = 1        //视频信息
    }

    this.setData({
      mission_index: val,
      add: add,
    })

  },

  /**
   * 非任务内容类型
   */
  choosecontent: function (e) {
    console.log(e)
    if (e.detail.value == 0) {
      this.chooseImage();
      this.setData({
        add:0
      })
    }
    if (e.detail.value == 1) {
      this.chooseVideo();
    }
  }

})