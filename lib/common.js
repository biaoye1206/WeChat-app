/**
 * 版本更新管理器
 */
const update = wx.getUpdateManager();

/**
 * 获取用户token
 */
function getToken() {
  return getLocationStorag("token");
}

/**
 * 通过key获取本地缓存数据
 * 
 * return: 成功返回value,失败返回null
 */
function getLocationStorag(key) {
  var value;
  wx.getStorage({
    key: key,
    success: function(res) {
      value = res.data;
    },
    fail() {
      value = null;
    }
  })
}
/**
 * 设置本地缓存数据
 * 
 * return: 成功返回true,失败返回false
 */
function setLocationStorag(key, value) {
  wx.setStorage({
    key: key,
    data: value,
    success() {
      return true;
    },
    fail() {
      return false;
    }
  })
}

/**
 * 检测小程序版本更新
 */
function checkUpdate() {
  update.onUpdateReady(function() {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否马上重启并更新小程序？',
      success: function(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          update.applyUpdate()
        }
      }
    })
  });
}
function readyLogin(){
  
}



function login(phoneData, phoneIv, code, userData, userSignature) {
  var _this = this;
  wx.request({
    url: _this.hostUrl + '/wechat/login',
    method: "GET",
    data: {
      phoneData: phoneData,
      phoneIv: phoneIv,
      code: code,
      userData: userData,
      userSignature: userSignature
    },
    success(res) {
      if (res.statusCode == 200) {
        var token = res.data.session;
        wx.setStorage({
          key: 'token',
          data: token,
        })
        _this.user.isLogin = true;
      }
    },
    fail(res) {
      wx.showToast({
        title: '登陆失败,请稍后重试',
        icon: 'warn',
        duration: 2000,
        mask: true
      })
    },
    complete() {
      wx.switchTab({
        url: '/pages/my/my'
      })
    }
  })
}




module.exports = {
  checkUpdate: checkUpdate,
  setLocationStorag: setLocationStorag,
  getLocationStorag: getLocationStorag,
  getToken: getToken
}