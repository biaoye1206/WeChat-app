const common = require("./lib/common.js")

App({
  user: {
    isLogin: false,
    session: ''
  },
  onLaunch: function() { 
    this.init();
    common.checkUpdate();
  },
  init: function() {
    const _this = this;
    wx.checkSession({
      success() {
        _this.user.isLogin = true;
      }
    });
  }
})


// color0: #9DD3FA__RGB(157,211,250)
// color1: #1F6FB5__RGB(31,111,181)
// color2: #FCD692__RGB(252,214,146)
// color3: #FAFFEB__RGB(250,255,235)
// color4: #FFFFFF__RGB(255,255,255)