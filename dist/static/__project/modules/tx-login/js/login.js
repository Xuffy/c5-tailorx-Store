var UI = {
  username: $("#username"),
  password: $("#password"),
  remember: $("#rememberMe"),
  btnSubmit: $("#btnSubmit"),
  imgVCode: $("#v-img-code"),
  vImg: $("#v-img")
};

var cookieKey = 'utouu_user_remember_cookie';
var accept_agreemt = false;
var storage = window.sessionStorage;
var SERVICE = {
  // 事件
  event: function () {
    UI.username.blur(function () {
      SERVICE.validate.username();
    });
    UI.password.blur(function () {
      SERVICE.validate.password();
    });

    var thisUrl = getUrlParam("service");
    if (!JsUtil.isStrNull(thisUrl) && thisUrl.indexOf("xunions") != "-1") {
      $(".jumpbtn").attr("href", "/register?platform=xunions");
    } else if (!JsUtil.isStrNull(thisUrl) && thisUrl.indexOf("stock") != "-1") {
      $(".jumpbtn").attr("href", "/register?platform=stock");
    }
    //读取协议值
    if (window.sessionStorage && storage.getItem("agreemt") != null) {
      $("input[name=accept_agreemt]").val(storage.getItem("agreemt"));
    }

  },
  loadCookie: function () {
    var str = $.cookie(cookieKey);
    if (undefined != str && str.trim().length > 0) {
      var val = JSON.parse(str);
      UI.username.val(val.username);
      UI.password.val(val.password);
      UI.remember.attr("checked", "checked");
      //var tailorxUrl = getUrlParam("service");
      //if(!JsUtil.isStrNull(tailorxUrl) && tailorxUrl.indexOf("tailorx") != "-1"){
      //$(".material-field").each(function(){
      //	if($(this).val() != "")return $(this).closest('.form-group-material').addClass('has-value');
      // });
      //}
    }
  },
  validate: {
    username: function () {
      var username = UI.username.val();
      if (username == undefined || username.replace(" ", "").length == 0) {
        SERVICE.textError(UI.username, 'username', "请输入用户名");
        return false;
      }
      SERVICE.textSuccess(UI.username);
      return true;
    },
    password: function () {
      var password = UI.password.val();
      if (password == undefined || password.replace(" ", "").length == 0) {
        SERVICE.textError(UI.password, 'password', "请输入密码");
        return false;
      }
      SERVICE.textSuccess(UI.password);
      return true;
    }
  },
  // 登录 //点击enter提交
  codeLogin: function () {

    $(document).keydown(function (event) {
      if (event.keyCode == 13) {
        SERVICE.doSubmit()
      }
    });
  },
  //登录
  doSubmit: function () {
    if (UI.btnSubmit.hasClass("checked")) {
      return false;
    }
    var remember = UI.remember.prop("checked");
    if (!remember) {
      $.removeCookie(cookieKey); // => true
      UI.remember.removeAttr("checked", "checked");
    }
    var flag = SERVICE.validate.username() && SERVICE.validate.password();
    if (flag == true) {
      UI.btnSubmit.addClass("checked");
    }
//		alert(UI.password.val());
    //存储
    if (window.sessionStorage) {
      storage.setItem("loginKey", JsUtil.base64encode(UI.password.val()));
    }
    /*SERVICE.adwq();*/
    if (flag) {
      $.ajax({
        type: "post",
        url: headUrl.headIp + headUrl.headPort + "/v2/store/user/loginUser",
        data: {
          username: UI.username.val(),
          password: UI.password.val()
        },
        success: function (data) {
          if (data.success == null) {
            data = eval('(' + data + ')');
          }
          if (data.success) {
            var res = data.data;
            TICKET = res.ticket;
            localStorage.setItem('tailorx-store-ticket', TICKET);
            var user = JSON.stringify(res.user);
            localStorage.setItem('tailorx-store-user', user);
            var url = sessionStorage.getItem('tailorx-location-herf');
            if (url == null) {
              url = "modules/homePage/homePage.html";
            }
            window.location.href = url;
            sessionStorage.removeItem('tailorx-location-herf');
          } else {
            if (data.msg != null) {
              layer.msg(data.msg);
            }
          }
        }
      });
    }
    /*return flag; */
  },
  // 文本框错误
  textError: function (obj, player, text, dialog) {
    var icon = obj.next().removeClass("success").addClass("tip-ico error");

    JsUtil.artDialogTooltip(player, text, 'right', function () {
      icon.removeClass("tip-ico error");
    });
  },
  // 文本框正确
  textSuccess: function (obj, dialog) {
    obj.next().removeClass("error").addClass("tip-ico success");
  },
  wechatRedirect: function () {
    var url = "/login/weixin-redirect";
    var service = getUrlParam("service");
    if (!JsUtil.isStrNull(service)) {
      url += "?service=" + getUrlParam("service");
    }
    window.location.href = url;
  },
  qqRedirect: function () {
    var url = "/login/qq-redirect";
    var service = getUrlParam("service");
    if (!JsUtil.isStrNull(service)) {
      url += "?service=" + getUrlParam("service");
    }
    window.location.href = url;
  },
  loginImgCode: function () {
    if (login_error_msg) {
      var msg = jQuery.parseJSON(login_error_msg);
//			if(msg.msg != null && msg.msg != undefined){
//				$.alert(msg.msg,"error");
//			}
//			if(msg.code == "-10020" || msg.code == "-10021"){
//				$.alert(msg.msg,"error");
//			}

      if (msg.code == "-10021" || msg.code == "-10020") {
        if (!JsUtil.isStrNull(msg.username)) {
          $("#username").val(msg.username);
        }
        if (!JsUtil.isStrNull(msg.password)) {
          $("#password").val(msg.password);
        }

        $("#imgcodeWarp").html(template("imgCodeTemplate", null));
        $(".login-contents").css("height", "auto");
        SERVICE.getImgCode();
        $("#v-img").click(function () {
          SERVICE.getImgCode();
        });
      }
      if (msg.code == "-10021") {
        $.alert(msg.msg, "error");
      } else if (msg.code == "-10020") {
        $.alert(msg.msg, "error");
      }
      if (msg.code == "-522") {
        var agreement = dialog({
          id: "dialogagreement",
          skin: "mission-detail-dialog",
          fixed: true,
          title: "温馨提示",
          content: template("agreementTemplate"),
          cancel: false
        });
        agreement.showModal();

        var companyChange = dialog({
          id: "companyChange",
          skin: "mission-detail-dialog",
          fixed: true,
          title: "温馨提示",
          content: template("companyChangeTemplate"),
          cancel: false
        });
        companyChange.showModal();
        var str = $.cookie(cookieKey);
        if (undefined != str && str.trim().length > 0) {
          var val = JSON.parse(str);
          UI.username.val(val.username);
          //var key = JsUtil.base64decode(storage.getItem("loginKey"));
          //UI.password.val(key);
//					UI.remember.attr("checked", "checked");
        }
        $(".agreement-wrap .agreement-submitbtn.btn2").off().on("click", function () {
          companyChange.close();
        });
        $(".agreement-wrap .agreement-submitbtn.btn1").off().on("click", function () {
          agreement.close();
          $("input[name=accept_agreemt]").val("true");
          //存储协议值
          if (window.sessionStorage) {
            storage.setItem("agreemt", "true");
          }
          //$("#btnSubmit").click();
        });
      }


    }
  },
  getImgCode: function () {
    var key = SERVICE.getImgCodeKey();
    $("#v-img").attr("src", "https://passport.utouu.com/proxy-msg/img/code?key=" + key + "&width=105&height=33");
    $("#imgVKey").val(key);
    UI.key = key;
  },
  getImgCodeKey: function () {
    var imgCode = Date.parse(new Date()) + Math.random();
    return imgCode;
  },
  adwq: function () {
    var service = getUrlParam("service");
    var platform = getUrlParam("platform");
    var userName = UI.username.val();
    if (!JsUtil.isStrNull(service) && service.indexOf("bestkeep") != "-1" && userName != "") {
      _adwq.push([
        '_setAction', '7p11tp',
        '' + faultylabs.MD5(userName) + '' //请填入登录用户名 或 登录用户ID (请强制转换成字符串类型 )
      ]);
      //_adwq.push(['_setDomainName', '.bestkeep.cn']);
    }
  }
};

$(function () {
  var winHeight = $(window).height();
  //$(".main-wrap").css({
  //	"height" : winHeight + "px"
  //});
  SERVICE.codeLogin();//点击enter提交
  SERVICE.loadCookie();
  SERVICE.event();
  SERVICE.loginImgCode();
});
window.onload = function () {
  var username = $("#username").val();
  if (username != null && username != "") {
    $('.form-group-material').addClass('has-value');
  }
}