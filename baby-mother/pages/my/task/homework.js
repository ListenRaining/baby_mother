// pages/my/task/homework.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseurl:app.globalData.baseUrl,
    info:[],
    task_play: '../../../image/play.png',
    task_status: 'audioPlay',
    complete:0,           //0: 任务未完成; 1: 发布 2：隐藏 
    imageArr:[],
    imageCntMax:3,
    audioAction:{
      method:"pause"
    },
    musicAction:{
      method: "pause"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorage({
      key: 'contentImg',
      success: function(res) {},
    })
    console.log(options)

    this.setData({
      complete:options.complete
    })
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(user) {
        wx.request({
          url: app.globalData.baseUrl + 'little/operate/homework',
          data: {
            key: options.k,
            uid: user.data.uid
          },
          success: function (res) {
            console.log(res)
            if (res.data.result == 'succ') {
              that.setData({
                info: res.data.info
              })

              this.audioCtx = wx.createAudioContext('myAudio')
              this.audioCtx.setSrc(that.data.baseurl + res.data.info.task)
              if (res.data.info.music) {
                this.music = wx.createAudioContext('music')
                this.music.setSrc(that.data.baseurl + res.data.info.music)
              }
            } else {
              wx.showLoading({
                title: '正在加载...',
                mask:false,
              })
            }
          }
        })
      },
    })
  },

  audioPlay: function () {
    this.setData({
      task_play: "../../../image/pause.png",
      task_status: "audioPause",
      audioAction:{
        method:"play"
      },
      musicAction:{
        method: "pause"
      }
    })
  },

  audioPause: function () {
    this.setData({
      task_play: "../../../image/play.png",
      task_status: "audioPlay",
      audioAction: {
        method: "pause"
      }
    })
  },

  audioPlay1: function (e) {
    console.log('e',e)
    this.audioPause()
    this.setData({
      musicAction: {
        method: "play"
      }
    })
  },

  dotask:function(e){
    console.log(e)
    var type = e.target.dataset.type
    if (type == 2) {
      this.chooseImage();
    }
    if (type == 1) {
      this.chooseVideo();
    }
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
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          imageArrTemp.push(res.tempFilePaths[i]);
        }
        that.setData({
          imageArr: imageArrTemp,
          complete:1
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
   */
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
                video: data.info,
                complete:1
              })
            } else {
              wx.showModal({
                title: '提示',
                content: data.reason,
                showCancel: false,
                success: function(es) {
                  if (es.confirm == true) {
                    that.setData({
                      video: ''
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

  /**
   * 提交信息
   */
  formSubmit: function (e) {
    var that = this
    var content = e.detail.value.content
    wx.getStorage({
      key: 'userinfo',
      success: function (user) {
        // 发布视频信息
        console.log('video', that.data.video)
        if (that.data.video) {
          wx.request({
            url: app.globalData.baseUrl + 'little/operate/sendarticle',
            data: {
              uid: user.data.uid,
              content: content,
              video: that.data.video,
              task:1,
              lesson_id:that.data.info.lesson_id
            },
            success: function (res) {
              console.log('发布视频', res)
              if (res.data.result == 'succ') {
                //发布成功提示
                wx.showToast({
                  title: '发布成功',
                })
                that.setData({
                  complete:2
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
                  task:1,
                  lesson_id: that.data.info.lesson_id
                },
                success: function (result) {
                  console.log('-----success-----', result)
                  if (result.data.result == 'succ') {
                    //发布成功提示
                    wx.showToast({
                      title: '发布成功',
                    })
                    that.setData({
                      complete: 2
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
})