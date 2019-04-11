/**
 * 引入模块
 */
const common = require("../../../lib/common.js")

Page({
  data: {},

  onLoad: function() {},
  /**
   * 获取用户信息
   */
  readUserInfo: function(result) {
    var userInfo = result.detail.userInfo;
    var user = {
      "rawData": result.detail.rawData,
      "signature": result.detail.signature
    }
    var query = this.data.query;
    common.setLocationStorag('userInfo', userInfo);
    if (common.setLocationStorag('user', user)) {
      common.readyLogin();
    }
  }
})