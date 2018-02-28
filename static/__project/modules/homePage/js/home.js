/**
 * Created by Windows on 2017/3/29.
 */
$(function () {
  // var headUrl = {
  //     headIp: 'http://localhost:',
  //     headPort: 30704
  // }


  var _ajax = function (url, type, dataType, success, error) {
    $.ajax({
      url: headUrl.headIp + headUrl.headPort + url,
      type: type,
      dataType: dataType,
      success: success,
      error: error
    });
  };

  var ajax = function (url, success) {
    _ajax(url, 'post', 'json', success, function (msg) {

    });
  }


  /** 初始化数据 **/
  var initData = function () {
    var url = '/v2/store/homePage/data';
    ajax(url, function (data) {
      var data = data['data'];
      if (data && data !== null) {
        var store = data['store'];
        if (store && store !== '') {
          $("#store_name").text(store['name']);
          var status = store['status'];
          if (status === 0) {
            $("#store_img").attr('src', '../../img/building.png').attr('alt', '建设中');
            $("#store_status").text("建设中");
          } else if (status === 1) {
            $("#store_img").attr('src', '../../img/opening.png').attr('alt', '营业中');
            $("#store_status").text("营业中");
          }
          $("#store_totalOrderCount").html(store['totalOrderCount']);
          $("#store_totalAppointmentCount").html(store['totalAppointmentCount']);
          $("#store_totalOrderAmount").html(store['allOrderAmount']);
          $("#store_totalTradeCount").html(store['totalTradeCount']);
          $("#store_todayTradeCount").html("今日交易量：" + store['todayTradeCount']);
          $("#store_todayOrderCount").html("今日订单量：" + store['todayOrderCount']);
          $("#store_todayAppointmentCount").html("今日预约量：" + store['todayAppointmentCount']);
        }

        var moreTrade = data['moreTrade'];
        if (moreTrade !== '') {
          if (moreTrade >= 0) {
            $("#moreTrade").html("同比昨日交易量增长 " + Math.abs(moreTrade));
          } else {
            $("#moreTrade").html("同比昨日交易量减少 " + Math.abs(moreTrade));
          }

        }


        var moreOrder = data['moreOrder'];
        if (moreOrder !== '') {
          if (moreOrder >= 0) {
            $("#moreOrder").html("同比昨日订单量增长 " + Math.abs(moreOrder));
          } else {
            $("#moreOrder").html("同比昨日订单量减少 " + Math.abs(moreOrder));
          }

        }

        var moreAppointment = data['moreAppointment'];
        if (moreAppointment !== '') {
          if (moreAppointment >= 0) {
            $("#moreAppointment").html("同比昨日预约量增长 " + Math.abs(moreAppointment));
          } else {
            $("#moreAppointment").html("同比昨日预约量减少 " + Math.abs(moreAppointment));
          }

        }

        //今日上班人员
        var onWorkDesignerList = store['onWorkDesignerList'];
        if (onWorkDesignerList && onWorkDesignerList !== null) {
          var html = '';
          $.each(onWorkDesignerList, function (index, item) {
            html += '<div class="ut-fl ut-mar-r10 ut-mar-l10 ut-mar-t5 ut-mar-b5">';
            html += '<div class="portrait">';
            if (item['photo'] == null) {
              html += '<img src="../../img/temp.png" alt="">';
            } else {
              html += '<img src="' + item['photo'] + '" alt="">';
            }
            html += '</div>';
            html += '<div class="ut-text-center">' + item['name'] + '</div>';
            html += '</div>';

          })
          $("#store_onWorkDesignerList").html(html);
        }

        orderStr = data['orderStr'];
        tradeStr = data['tradeStr'];
        appointmentStr = data['appointmentStr'];
        hourStr = data['hourStr'];

        initPage()

      } else {
        console.log("服务器忙，请稍后再试")
      }

    });
  }

  //初始化页面
  var initPage = function () {
    var orderArray = orderStr.split(",");
    var tradeArray = tradeStr.split(",");
    var appointmentArray = appointmentStr.split(",");
    var hourArray = hourStr.split(",");
    //点击账号设置
    $(".account-set").on("click", function () {
      $(".layer").removeClass("ut-none");
    });
    $(".submit-password").on("click", function () {
      $(".layer").addClass("ut-none");
    });
    //颜色数组
    var colors = ['#EE7523', '#69A0D8', '#9D9D9D'];

    //订单量折线图
    var orderChartL = echarts.init(document.getElementById('line'));
    var orderOptionL = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['订单量', '交易量', '预约量']
      },
      color: colors,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: hourArray
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单量',
          type: 'line',
          data: orderArray
        },
        {
          name: '交易量',
          type: 'line',
          data: tradeArray
        }, {
          name: '预约量',
          type: 'line',
          data: appointmentArray
        }
      ]
    };
    orderChartL.setOption(orderOptionL);
    layer.close(loading);

  }

  //调用初始化方法
  initData();
})
