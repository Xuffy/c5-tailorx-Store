var loading;
var TICKET = null;

var checkMsg = true;
var loadNumber = 0;
(function ($) {
  //首先备份下jquery的ajax方法
  var _ajax = $.ajax;
  var getUserLoading = false;


  //重写jquery的ajax方法
  $.ajax = function (opt) {
    //备份opt中error和success方法
    var fn = {
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
      success: function (data, textStatus) {
      }
    }
    if (opt.error) {
      fn.error = opt.error;
    }
    if (opt.success) {
      fn.success = opt.success;
    }

    //扩展增强处理
    var _opt = $.extend(opt, {
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        layer.close(loading);
        layer.msg("网络异常，请稍后再试！");
        //错误方法增强处理
        fn.error(XMLHttpRequest, textStatus, errorThrown);
      },
      success: function (data, textStatus) {
        if (typeof data != "object" && isJson(data)) {
          data = JSON.parse(data);
        }
        if (!data.success) {
          if (data.code == '501' || data.code == '417') {
            loadNumber = 0;
            layer.close(loading);
            if (checkMsg) {
              checkMsg = false;
              layer.msg(data.msg);
              sessionStorage.setItem('tailorx-location-herf', window.location.href);
              /*setTimeout(function () {
               window.location.href = "../../index.html";
               }, 500);*/
              var TICKET = $.getUrlParam('st') || localStorage.getItem('tailorx-store-ticket');
              var userInfo = localStorage.getItem('tailorx-store-user');

              if (TICKET) {
                localStorage.setItem('tailorx-store-ticket', TICKET);
              }

              if (!userInfo && !getUserLoading) {
                getUserLoading = true;
                getUserInfo().then(function () {
                  getUserLoading = false;
                });
              }

            }
            return false;
          }
        }
        loadNumber--;
        if (loadNumber == 0) {
          layer.close(loading);
        }
        //成功回调方法增强处理
        fn.success(data, textStatus);
        checkMsg = true;
      },
      beforeSend: function (XHR) {
        if (loadNumber == 0) {
          loading = layer.load(2, {offset: '50%'});
        }
        loadNumber++;
        var TICKET = $.getUrlParam('st') || localStorage.getItem('tailorx-store-ticket');
        var userInfo = localStorage.getItem('tailorx-store-user');

        if (TICKET) {
          localStorage.setItem('tailorx-store-ticket', TICKET);
        }


        /*if (TICKET == null && checkUrl(opt.url)) {
         if (checkMsg) {
         checkMsg = false;
         layer.msg('请登录！');
         sessionStorage.setItem('tailorx-location-herf', window.location.href);
         setTimeout(function () {
         window.location.href = "../../index.html";
         }, 500);
         }
         return false;
         }*/
        XHR.setRequestHeader('utouu-open-client-ticket', TICKET, true);
        if (!userInfo && !getUserLoading) {
          getUserLoading = true;
          getUserInfo().then(function () {
            getUserLoading = false;
          });
        }


        //提交前回调方法
//              $('body').append("<div id='ajaxInfo' style=''>正在加载,请稍后...</div>");
      },
      complete: function (XHR, TS) {
        //请求完成后回调函数 (请求成功或失败之后均调用)。
//              $("#ajaxInfo").remove();
      }
    });
    return _ajax(_opt);
  };


  function getUserInfo() {
    return $.ajax({
      type: "post",
      url: headUrl.headIp + headUrl.headPort + "/v2/store/user/getUserInfo",
      data: {},
      success: function (data) {
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (data.code === '200') {
          localStorage.setItem('tailorx-store-user', JSON.stringify(data.data));
          layer.msg('正在更新当前登陆状态');
          setTimeout(function () {
            // history.go(0);
            window.location.href = window.location.href.split('?')[0];
          }, 1000);
        }
      }
    });
  }
})(jQuery);
function checkUrl(url) {
  if (url == headUrl.headUrl + "/v2/store/user/sendSmsCode") {
    return false;
  } else if (url == headUrl.headUrl + "/v2/store/user/loginUser") {
    return false;
  } else if (url == headUrl.headUrl + "/v2/store/user/forget-pwd") {
    return false;
  } else if (url == headUrl.headUrl + "/v2/store/user/forgetSmsCode") {
    return false;
  }
  return true;
}
//判断定金金额只能为数字和小数
function clearNoNum(obj, type) {
//		//得到第一个字符是否为负号
//		var t = obj.value.charAt(0);
  //先把非数字的都替换掉，除了数字和.
  if (type == 1) {//1表示不要小数点
    obj.value = obj.value.replace(/[^\d]/g, '');
  } else {
    obj.value = obj.value.replace(/[^\d\.]/g, '');
  }

  //必须保证第一个为数字而不是.
  obj.value = obj.value.replace(/^\./g, '');
  //保证只有出现一个.而没有多个.
  obj.value = obj.value.replace(/\.{2,}/g, '.');
  //保证.只出现一次，而不能出现两次以上
  obj.value = obj.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  //如果第一位是负号，则允许添加
  obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
  if (obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    obj.value = parseFloat(obj.value);
  }
}
function isJson(obj) {
  var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
  return isjson;
}
//账号
if (localStorage.getItem('tailorx-store-user')) {
  var user = JSON.parse(localStorage.getItem('tailorx-store-user'));
  var nameStr = "";
  switch (user.userType) {
    case 1 :
      nameStr = '店长';
      break;
    case 2 :
      nameStr = '设计师';
      break;
    case 3 :
      nameStr = '管理员';
      break;
  }
  /*$('.tailorx-user-name').before("<span>欢迎" + nameStr + "：</span><div class='merchant-msg'><img src='" + (user.photo == null ? "../../img/temp.png" : user.photo) + "'/></div>");
   $(".tailorx-user-name").html('' + user.nickName + '<i class="fa fa-sort-desc ut-mar-l5 ut-pointer" id="sort-name"></i>');*/
}
function replace(doc) {
  doc.value = doc.value.replace(/\D/g, '');
}
//加载侧边栏
$(function () {
  var st = $.getUrlParam('st') || localStorage.getItem('is_child_iframe');

  if (!st) {
    // $("#headload").load("../dist/tree.html");
    $('.htmleaf-container').css({'padding-left': '180px'});
  } else {
    localStorage.setItem('is_child_iframe', st)
  }
});
//账号 ,名字
$('#sort-name').on('click', function () {
  $('.merchant-userName').removeClass('ut-none');
});
$('.merchant-userName').on('mouseover', function () {
  $(this).removeClass('ut-none');
});
$('.merchant-userName').on('mouseout', function () {
  $(this).addClass('ut-none');
});
$('#merchant-out').on('click', function () {
  $.ajax({
    type: "get",
    url: headUrl.headUrl + "/v2/store/user/logout",
    dataType: 'json',
    data: {},
    async: true,
    success: function (res) {
      localStorage.removeItem('tailorx-ticket');
      window.location.href = "../../index.html";
    }
  });
});
$('#merchant-PassAgain').on('click', function () {
  $('#layer-pass').css('display', 'block');
  account.init();
});

/*jquery extend*************************************************************/
(function () {
  /**
   * 获取地址参数
   * @param name
   * @returns {null}
   */
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;

  }

  /**
   * 阿里OSS图片服务参数设置
   * @param url      string   'http://...'
   * @param params   string   'crop,w_240,h_180'
   * ps: oss api url
   * https://help.aliyun.com/document_detail/44705.html?spm=5176.doc44957.6.957.JQrRmS
   */
  function ossImage(url, params) {
    url += url.indexOf('?') > -1 ? '&' : '?';
    return url + 'x-oss-process=image/' + params;
  }


  $.extend({
    getUrlParam: getUrlParam,
    ossImage: ossImage
  });


  /*var st = $.getUrlParam('st');
  if (window.location.pathname === '/modules/homePage/homePage.html' && st) {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('tailorx-store-ticket', st);
    localStorage.setItem('is_child_iframe', true);
  }*/

})();


