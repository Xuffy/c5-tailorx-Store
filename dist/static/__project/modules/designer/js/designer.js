layer.close(loading);
var designer = {

  // 发送请求，获取数据
  getStoreDesignerList: function (params) {
    loading = layer.load(2);
    $.ajax({
      url: headUrl.headIp + headUrl.headPort + "/v2/store/designer/findDesignerList",
      type: "post",
      dataType: "json",
      data: params,
      success: function (res) {
        layer.close(loading);
        if (res.success == false) {
          layer.msg(res.msg);
        }
        designer.pagination(res.totalSize, res.pageLength, res.page);
        $(".ut-pad-10 .ut-color-e").html(res.totalSize);
        var html = "";
        $(".designer-table tbody").html("");

        $.each(res.data.data, function (i, value) {
          html += "<tr>";
          if (value.photo != null && value.photo != "") {
            html += "<div class='dd-t-image'><td><div class='dd-t-image-out'><img src='" + value.photo + "' alt=''></div></td></div>";
          } else {
            html += "<div class='dd-t-image'><td><div class='dd-t-image-out'><img src='../../img/temp.png' alt='请上传头像'></div></td></div>";
          }
          html += "<td>" + value.name + "(" + value.id + ")</td>";
          if (value.level != null) {
            html += "<td>" + value.level + "</td>";
          } else {
            html += "<td></td>";
          }
          html += "<td>" + value.order_count + "</td>";
          html += "<td>￥" + (value.deal_count == null ? 0 : value.deal_count) + "</td>";
          html += "<td>" + value.max_design + "</td>";
          html += "<td>" + laydate.now(value.createDate).slice(2) + "</td>";
          html += "<td>" + value.appointmentAmount + "</td>";
          html += "<td>" + (value.status == 1 ? "在职" : "已离职") + "</td>";
          html += "<td><div><a href='javascript:;' onclick='designer.editDesigner(" + value.id + ")'>编辑</a>" +
            "<a href='javascript:;' onclick='designer.deleteDesigner(" + value.id + ")' class='ut-mar-l10'>删除</a></div>" +
            "<div><a href='javascript:;' onclick='designer.detailDesigner(" + value.id + ")'>查看详情</a>" +
            "<a href='javascript:;'  class='ut-mar-l10' onclick='designer.updateStatus(" + value.id + "," + value.status + ")'>" + (value.status == 1 ? "离职" : "在职") + "</a></div></td>";
          html += "</tr>";
        });
        $(".designer-table tbody").append(html);

      },
      error: function () {
        layer.close(loading);
        layer.alert("网络故障！");
      }
    });
  },
  //设计师编辑页面跳转
  editDesigner: function (id) {
    loading = layer.load(2);
    sessionStorage.setItem('designerId', id);
    location.href = "designerEdit.html";
  },
  //设计师详情页面跳转
  detailDesigner: function (id) {
    loading = layer.load(2);
    sessionStorage.setItem('designerId', id);
    location.href = "designerDetail.html?designerId=" + id;
  },
  //删除设计师
  deleteDesigner: function (id) {
    if (!confirm("确定要删除该设计师？")) return;
    loading = layer.load(2);
    $.ajax({
      url: headUrl.headIp + headUrl.headPort + "/v2/store/designer/deleteDesigner",
      type: "post",
      dataType: "json",
      data: {designerId: id},
      success: function (result) {
        layer.close(loading);
        if (result.success) {

          designer.getStoreDesignerList();
        } else {
          layer.msg(result.msg);
        }
      },
      error: function () {
        layer.close(loading);
        layer.alert("网络故障！")
      }
    })
  },
  //删除设计师
  updateStatus: function (id, status) {
    var statusStr = "已离职";
    if (status == 0) {
      statusStr = "在职";
      status = 1;
    } else {
      status = 0;
    }
    if (!confirm("确定设计师" + statusStr)) return;
    loading = layer.load(2);
    $.ajax({
      url: headUrl.headIp + headUrl.headPort + "/v2/store/designer/updateStatus",
      type: "post",
      dataType: "json",
      data: {designerId: id, status: status},
      success: function (result) {
        layer.close(loading);
        if (result.success) {
          designer.getStoreDesignerList();
        } else {
          layer.msg(result.msg);
        }
      },
      error: function () {
        layer.close(loading);
        layer.alert("网络故障！")
      }
    })
  },
  //添加设计师
  addDesigner: function () {
    var telephone = $("#phone").val();

    //验证手机号
    var myreg = /(1[3-9]\d{9}$)/;
    if (!myreg.test(telephone)) {
      layer.msg("手机号格式有误", {offset: '50%'});
      return false;
    }
    loading = layer.load(2);
    $.ajax({
      url: headUrl.headIp + headUrl.headPort + "/v2/store/designer/addDesigner",
      type: "post",
      dataType: "json",
      data: {
        name: $("#name").val(),
        phone: $("#phone").val()
      },
      success: function (result) {
        layer.close(loading);
        if (result.success) {
          designer.getStoreDesignerList();
          $(".layer").addClass("ut-none");
          layer.msg("设计师添加成功", {offset: '50%'});
        } else {
          $(".layer").addClass("ut-none");
          layer.msg(result.msg);
        }
      },
      error: function () {
        layer.close(loading);
        layer.alert("网络故障！");
      }
    })
  },

  //分页
  pagination: function (total, pageLength, page) {
    $('#templatePage').pagination({
      totalData: total,//总条数
      showData: pageLength,//每页显示条数
      jump: true,//跳转
      current: page + 1,//当前页
      coping: true,//首页和尾页
      count: 3,//当前页前后分页个数
      homePage: '首页',
      endPage: '末页',
      prevContent: '上页',
      nextContent: '下页',
      callback: function (index) {
        designer.getStoreDesignerList(designer.getParams(index.getCurrent() - 1, 5));
      }
    });
  },

  getParams: function (page, pageLength) {
    var params = new Object();
    var name = $(".ut-input").val();
    var level = $("#level .active").html();
    var minOrderCount = $("#min-order-count").val();
    var maxOrderCount = $("#max-order-count").val();
    var minAmount = $("#min-amount").val();
    var maxAmount = $("#max-amount").val();
    var maxDesign1 = $("#min-designer").val();
    var maxDesign2 = $("#max-designer").val();
    var designerStatus = $("#designer-status .active").html();

    if (designerStatus == "在职") {
      params.status = 1;
    } else if (designerStatus == "已离职") {
      params.status = 0;
    }

    if (name != "" && name != null) {
      params.name = name;
    }
    if (level != "全部") {
      params.level = level;
    }

    if (minOrderCount != "") {
      params.minOrderCount = minOrderCount;
    }

    if (maxOrderCount != "") {
      params.maxOrderCount = maxOrderCount;
    }

    if (minAmount != "") {
      params.minAmount = minAmount;
    }

    if (maxAmount != "") {
      params.maxAmount = maxAmount;
    }

    if (maxDesign1 != "") {
      params.maxDesign1 = maxDesign1;
    }

    if (maxDesign2 != "") {
      params.maxDesign2 = maxDesign2;
    }
    if (page != null) {
      params.page = page;
    } else {
      params.page = 0;
    }
    if (pageLength != null) {
      params.pageLength = pageLength;
    } else {
      params.pageLength = 5;
    }
    return params;
  },

  //判断字符是否为中文
  isChinese: function (value) {
    var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
    return reg.test(value);
  },

};

$(function () {
  //a标签点击变色
  $('.ut-border-dashed a').on('click', function () {
    $(this).addClass('active').siblings('a').removeClass('active')
  });
  //添加设计师
  $(".add-designer").on("click", function () {
    $(".add-designer-show").removeClass('ut-none');
    $("#name").val("");
    $("#phone").val("");
  });
//    $("#addDesignerBtn").on("click",function(){
//
//    });
  $("#cancelDesignerBtn").on("click", function () {
    $(".add-designer-show").addClass("ut-none");
  });

  //全部自定义
  $('.all').on('click', function () {
    $(this).siblings('.all-self').addClass('hide');
    $(this).siblings('.all-self').children('.money-input').val('')
    designer.getStoreDesignerList(designer.getParams());
  });
  $('.self').on('click', function () {
    $(this).siblings('.all-self').removeClass('hide');
  });

  // 获取设计师数据
  designer.getStoreDesignerList();

  // 点击搜索
  $(".btn-5").on("click", function () {
    designer.getStoreDesignerList(designer.getParams());
  });
  // 设计师等级选择
  $("#level .ut-pad-r10").on("click", function () {
    designer.getStoreDesignerList(designer.getParams());
  });
  //设计师状态选择
  $("#designer-status .ut-pad-r10").on("click", function () {
    designer.getStoreDesignerList(designer.getParams());
  });

  // 点击确认
  $(".ut-pad-10 .btn-1").on("click", function () {
    var minOrderCount = $("#min-order-count").val();
    var maxOrderCount = $("#max-order-count").val();
    if (maxOrderCount) {
      if (minOrderCount > maxOrderCount) {
        return layer.msg('成交量输入不合法');
      }
    }
    var minAmount = $("#min-amount").val();
    var maxAmount = $("#max-amount").val();
    if (maxAmount) {
      if (minAmount > maxAmount) {
        return layer.msg('收益金额输入不合法');
      }
    }
    var minDesigner = $("#min-designer").val();
    var maxDesigner = $("#max-designer").val();
    if (maxDesigner) {
      if (minDesigner > maxDesigner) {
        return layer.msg('每日最大设计量输入不合法');
      }
    }
    designer.getStoreDesignerList(designer.getParams());
  });
  //点击确定添加设计师
  $("#addDesignerBtn").on("click", function () {
    var nameVal = $("#name").val();
    if (nameVal == "") {
      layer.msg("请输入姓名！");
      return;
    }

    var boolean = designer.isChinese(nameVal);
    if (boolean) {
      if (nameVal.length > 4) {
        layer.msg("姓名最多能输入4个中文字符或者8个英文字符！");
        return;
      }
    } else {
      if (nameVal.length > 8) {
        layer.msg("姓名最多能输入4个中文字符或者8个英文字符！");
        return;
      }
    }


    var phoneVal = $("#phone").val();
    if (phoneVal == "") {
      layer.msg("请输入手机号！");
      return;
    }
    designer.addDesigner();
  });

});

// var headUrl = {
//     headIp: 'http://localhost:',
//     headPort: 30704
// }
