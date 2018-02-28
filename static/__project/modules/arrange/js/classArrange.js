$(function () {
    var setClass = {
        init: function () {
            //获取已有的设计师信息
            this.getDesignerAjax();
            //获取当前已有排班
            this.getArrangeInfo();
            this.bindEvent();
        },
        currentClass: {},
        designers: [],
        allArrange: [],
        bindEvent: function () {
            //点击新建排班按钮
            $('.add-new-class').on('click', function () {
                $('.help-tips').hide().siblings('.add-arrange-outer').show();

                //设置抬头内容
                $(".addArrange-setName-shuruName").val("");
                $("#start").val(laydate.now());
                $("#end").val(laydate.now(+6));
                $("#start").attr("data-type", "0");
                $(".add-submit").attr("data-id", "");
                var time = new Date(laydate.now());
                time = time.getTime();
                //新建排班的内容
                setClass.newArrangeHtml(time);
            });

            // 新建排班 关闭
            $('.fa-addArr-close').click(function () {
                $(this).parents('.arrange-ma-bg-outer').hide();
                $('.help-tips').show();
            });


            //根据状态查询排班
            $(".over-status span").click(function () {
                var $this = $(this);
                $this.addClass("ut-color-g").siblings().removeClass("ut-color-g");
                var signal = $this.attr("type");
                setClass.getArrangeInfo({signal: signal});
            });
            $(".arrange-Wblue").click(function () {
                $(".over-status span").removeClass("ut-color-g");
                setClass.getArrangeInfo({signal: 3});
            });

            //绑定laydate的初始化事件
            this.bindDateEvent();
            //提交新建排班或者编辑排班
            $(".add-submit").click(function () {
                var val = $(".addArrange-setName-shuruName").val();
                var type = $("#start").attr("data-type");
                if (!val.trim()) return layer.alert("请输入排班名称");
                var start = new Date($("#start").val());
                start = start.getTime();
                var end = new Date($("#end").val());
                end = end.getTime();
                var str = "";


                $("#addNewTable option:selected").each(function (i, value) {
                    var $this = $(this);
                    var time = $this.attr("time"), arrange = $this.val(), person = $this.attr("data-id");

                    str += time + "," + arrange + "," + person + ";";
                });
                var data = {
                    name: val,
                    startDate: start,
                    endDate: end,
                    list: str
                }
                loading = layer.load(2);
                if (type == "0") {
                    setClass.addArrangeAjax(data);
                } else if (type == "1") {
                    data = {
                        arrangeName: val,
                        startDate: start,
                        endDate: end,
                        list: str,
                        arrangeId: $(this).attr("data-id")
                    };
                    setClass.updateArrangeAjax(data);
                }
            });
        },
        //绑定日历事件
        bindCalendar: function () {
            var arr = [];
            $(".over-cut-circle[status=1]").each(function () {
                for (var j = 0; j < 7; j++) {
                    arr.push(Number($(this).attr("start")) + 24 * 60 * 60 * 1000 * j);
                }
            });
            $(".arrange-menology").remove();
            $(".class-content").prepend($("<div class='arrange-menology'>"));
            calendar(arr);
        },
        //修改排班的ajax
        updateArrangeAjax: function (data) {
            var arraneName = data.arrangeName;
            if (arraneName.length > 16) {
                layer.alert("排班名称最多输入16字");
                layer.close(loading);
                return;
            }
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/arrange/updateArrange",
                dataType: "json",
                data: data,
                success: function (res) {
                    layer.close(loading);
                    if (res.success) {
                        $('.arrange-ma-bg-outer').hide();
                        $('.help-tips').show();
                        layer.alert("修改成功");
                        setClass.getArrangeInfo();
                    } else {
                        layer.alert(res.errorMsg);
                    }
                },
                error: function () {
                    layer.close(loading);
                    layer.alert('网络故障，修改失败！');
                }
            });
        },
        //新建排班的ajax
        addArrangeAjax: function (data) {
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/arrange/addArrange",
                dataType: "json",
                data: data,
                success: function (res) {
                    layer.close(loading);
                    if (res.success) {
                        $('.arrange-ma-bg-outer').hide();
                        $('.help-tips').show();
                        layer.alert("添加成功");
                        setClass.getArrangeInfo();
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function () {
                    layer.close(loading);
                    layer.alert("网络故障，添加失败！");
                }
            });
        },
        //选择是新建还是编辑然后渲染不同的html
        choiceType: function (time, type) {
            if (type == "0") {
                setClass.newArrangeHtml(time);
            } else if (type == "1") {
                setClass.editArrangeHtml(setClass.currentClass, time);
            }
        },
        //绑定laydate的初始化事件
        bindDateEvent: function () {
            var start = {
                elem: '#start',
                format: 'YYYY/MM/DD',
                min: laydate.now(), // 设定最小日期为当前日期
                max: laydate.now(+20), // 最大日期
                istime: true,
                istoday: false,
                choose: function (datas) {
                    $("#end").val(laydate.now(getSevenDay(datas, 1)));
                    var time = new Date(datas);
                    time = time.getTime();
                    var type = $("#start").attr("data-type");
                    setClass.choiceType(time, type);
                }
            };
            var end = {
                elem: '#end',
                format: 'YYYY/MM/DD',
                min: laydate.now(+6),
                max: laydate.now(+26),
                istime: true,
                istoday: false,
                choose: function (datas) {
                    var time = getSevenDay(datas, -1);
                    $("#start").val(laydate.now(time));
                    var type = $("#start").attr("data-type");
                    setClass.choiceType(time, type);
                }
            };
            laydate(start);
            laydate(end);
        },
        //点击编辑排班
        editArrange: function () {
            $(".glyphicon-edit").off("click");
            $(".glyphicon-edit").click(function () {
                var $this = $(this);
                if ($this.siblings(".over-start").css("display") != "none") return layer.alert("无法修改开启中的排班");

                var id = $this.attr("data-id");
                $("#start").attr("data-type", "1");
                $(".add-submit").attr("data-id", id);
                loading = layer.load(2);
                setClass.editArrangeInfo(id);
            });
        },
        //获取指定的排班信息
        editArrangeInfo: function (id) {
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/arrange/getArrangeById",
                dataType: "json",
                data: {arrangeId: id},
                success: function (res) {
                    if (res.success) {
                        layer.close(loading);
                        setClass.currentClass = res.data;
                        setClass.editArrangeHtml(res.data);

                        $(".addArrange-setName-shuruName").val(res.data.name);
                        $("#start").val(laydate.now(res.data.start_time));
                        $("#end").val(laydate.now(res.data.end_time));
                        $('.help-tips').hide().siblings('.add-arrange-outer').show();
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function () {
                    layer.close(loading);
                    layer.alert("网络故障，操作失败！")
                }
            });
        },
        //复制副本的按钮
        copyArrange: function () {
            var $ele = $(".class-copy");
            $ele.off("click");
            $ele.click(function () {
                loading = layer.load(2);
                var id = $(this).attr("data-id");
                $.ajax({
                    type: "post",
                    url: headUrl.headIp + headUrl.headPort + "/v2/store/arrange/copyArrange",
                    dataType: "json",
                    data: {arrangeId: id},
                    success: function (res) {
                        if (res.success) {
                            setClass.getArrangeInfo();
                        } else {
                            layer.alert(res.msg);
                        }
                    },
                    error: function () {
                        layer.close(loading);
                        layer.alert('网络故障，操作失败！');
                    }

                });
            });
        },
        //开启和关闭排班的按钮事件
        openArrange: function () {
            var $ele = $(".over-cut-circle");
            $ele.off("click");
            $ele.click(function () {
                loading = layer.load(2);
                var $this = $(this);
                var id = $this.attr("data-id");
                var status = $this.attr("status");
                setClass.openArrangeAjax({arrangeId: id}, $this, status);
            });
        },
        //改变排班的状态
        changeArrageStatus: function (status, $ele) {
            var $parent = $ele.parent().parent();
            if (status == 1) {
                $parent.attr("class", "over-disabled");
                $ele.attr("status", "0");
            } else {
                $parent.attr("class", "over-active");
                $ele.attr("status", "1");
            }
            //改变日历
            setClass.bindCalendar();
            //获取未开启和已开启的排班数
            setClass.getClassNum();

        },
        //获取未开启和已开启的排班数
        getClassNum: function () {
            $("#openArrangeNum").html($(".over-cut-circle[status=1]").length);
            $("#closeArramgenum").html($(".over-cut-circle[status=0]").length);
        },
        //开启和关闭排班的ajax
        openArrangeAjax: function (data, $ele, status) {
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/arrange/openOrCloseArrange",
                data: data,
                dataType: "json",
                success: function (res) {
                    layer.close(loading);
                    if (res.success) {
                        setClass.changeArrageStatus(status, $ele);
                    } else if (res.msg == "have") {
                        if (!confirm("您还有未完成的预约，确认关闭已开启的排班？")) return;
                        setClass.closeAppoArrange(data, $ele, status);
                    } else {
                        layer.alert(res.msg,{offset:'50%'});
                    }
                },
                error: function () {
                    layer.close(loading);
                    layer.alert("网络故障，修改失败！")
                }
            });
        },
        //关闭有预约的排班的ajax
        closeAppoArrange: function (data, $ele, status) {
            loading = layer.load(2);
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/arrange/closeArrange",
                data: data,
                dataType: "json",
                success: function (res) {
                    layer.close(loading);
                    if (res.success) {
                        setClass.changeArrageStatus(status, $ele);
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function () {
                    layer.close(loading);
                    layer.alert('网络故障，操作失败！')
                }
            });
        },
        //获取所有设计师的信息
        getDesignerAjax: function () {
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/arrange/findDesignerInfo",
                dataType: "json",
                success: function (res) {
                    if (res.success) {
                        setClass.designers = res.data.designer;
                        setClass.allArrange = res.data.classes;
                    }
                }
            });
        },
        //编辑排班的html
        editArrangeHtml: function (data, time) {
            if (!time) var time = data.start_time;
            var classes = setClass.allArrange;
            //获取日期信息
            var arr = getDate(time);
            var dateStr = "";
            $.each(arr, function (a, val) {
                dateStr += '<th>周' + val.week + '(' + val.month + '/' + val.day + ')</th>';
            });

            var str = '<tr><th>人员名称</th>' + dateStr + '</tr>';
            $.each(data.arrangeDetails, function (i, value) {
                var subStr = "";
                //循环天数
                for (var j = 0; j < 7; j++) {
                    var detail = value.details;
                    var classStr = "";
                    var today = time + j * 24 * 60 * 60 * 1000;
                    var className = "";
                    $.each(detail, function (k, deVal) {
                        if (deVal.arrange_date == today) {
                            className = deVal.classes_id;
                        }
                    });
                    $.each(classes, function (k, classVal) {
                        classStr += '<option data-id="' + value.designer_id + '" ' + (className == classVal.classes_id ? "selected" : "") + ' time="' + today + '" value="' + classVal.classes_id + '">' + classVal.classes_name + '</option>';
                    });

                    subStr += '<td>' +
                        '<select>' +
                        classStr +
                        '</select>' +
                        '</td>';
                }


                str += '<tr class="odd gradeX">' +
                    '<td>' + value.designer_name + '</td>' +
                    subStr +
                    '</tr>';
            });

            $("#addNewTable").html(str);
        },
        //新建排班的html
        newArrangeHtml: function (time) {
            var data = {
                classes: setClass.allArrange,
                designer: setClass.designers
            };

            //获取日期信息
            var arr = getDate(time);
            var dateStr = "";
            $.each(arr, function (a, val) {
                dateStr += '<th>周' + val.week + '(' + val.month + '/' + val.day + ')</th>';
            });
            var classes = data.classes, desginers = data.designer, str = '<tr><th>人员名称</th>' + dateStr + '</tr>';


            //循环设计师
            $.each(desginers, function (i, val) {
                var subStr = "";
                for (var j = 0; j < 7; j++) {
                    var classStr = "";
                    var today = time + j * 24 * 60 * 60 * 1000;
                    $.each(classes, function (k, classVal) {
                        classStr += '<option time="' + today + '" data-id="' + val.id + '" value="' + classVal.classes_id + '" ' + (classVal.classes_name == "休" ? "selected" : "") + '>' + classVal.classes_name + '</option>';
                    })

                    subStr += '<td>' +
                        '<select>' +
                        classStr +
                        '</select>' +
                        '</td>';
                }

                str += '<tr class="odd gradeX">' +
                    '<td>' + val.name + '</td>' +
                    subStr +
                    '</tr>';
            });
            $("#addNewTable").html(str);

        },
        //获取已有的排班信息
        getArrangeInfo: function (data) {
            if (!data) var data = {signal: 0};
            $.ajax({
                async: false,
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/arrange/findArrangeList",
                dataType: "json",
                data: data,
                success: function (res) {
                    layer.close(loading);
                    if (res.success) {
                        if (res.data.arrangeList.length) {
                            $("#arrangeNum").html(res.data.totalNum);
                            setClass.arrangeListHtml(res.data.arrangeList);
                        } else {
                            layer.msg("暂无数据");
                        }
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function () {
                    layer.close(loading);
                    layer.alert('网络故障，操作失败！')
                }
            });
        },
        //排班列表的html
        arrangeListHtml: function (data) {
            $("#no-data").hide();
            $("#have-arrange-data").show();
            var str = "";
            $.each(data, function (i, value) {
                //获取日期信息
                var arr = getDate(value.startTime);
                var dateStr = "";
                $.each(arr, function (a, val) {
                    dateStr += '<th>周' + val.week + '(' + val.month + '/' + val.day + ')</th>';
                });


                var designerStr = "";
                //设计师
                $.each(value.objArray, function (j, desiValue) {
                    var arrangeStr = "";
                    $.each(desiValue, function (k, arraValue) {
                        arrangeStr += '<td style="background:' + arraValue.colour + '">' + arraValue.className + '</td>';
                    });

                    designerStr += '<tr>' +
                        '<td>' + desiValue[0].designerName + '</td>' +
                        arrangeStr +
                        '</tr>';
                });

                //班次的时间
                var countStr = "", totalStr = "";
                $.each(value.countList, function (a, countVal) {
                    countStr += '<span class="over-font-weight" style="color:' + countVal.colour + '">' + countVal.className + '&ensp;</span>';
                    if ((countVal.ontime != null && countVal.ontime != "") && (countVal.offtime != null && countVal.offtime != "")) {
                        countStr += countVal.ontime + '-' + countVal.offtime + ' &emsp;';
                    } else {
                        countStr += '00:00-23:59 &emsp;';
                    }

                    totalStr += '共计：<span style="color:' + countVal.colour + '">' + countVal.className + '</span> <span>' + countVal.num + '个</span>&emsp;';
                });

                //整体的页面
                str += '<div class="ut-border over-tatle-cont ut-mar-b20">' +
                    '<div class="' + (value.status == 1 ? "over-active" : "over-disabled") + '">' +
                    '<span class="over-set ut-mar-r10">' + value.name + '</span>' +
                    '<span class="over-start">已开启</span>' +
                    '<span class="over-end">未开启</span>' +
                    '<span class="glyphicon glyphicon-edit over-logo-right show-edit-box" aria-hidden="true" data-id="' + value.id + '"></span>' +
                    '<span class="glyphicon glyphicon-duplicate over-logo-right ut-mar-l10 class-copy" aria-hidden="true" data-id="' + value.id + '"></span>' +
                    '<span class="over-cut">' +
                    '<span class="over-cut-circle" end="' + value.endTime + '" start="' + value.startTime + '" data-id="' + value.id + '" status="' + value.status + '"></span>' +
                    '</span>' +
                    '</div>' +
                    '<div class="ut-mar-t5 ut-mar-b5">' +
                    countStr +
                    '</div>' +
                    '<div class="bs-example ut-mar-t10" data-example-id="simple-table">' +
                    '<table class="table ut-border over-td">' +
                    '<tr>' +
                    '<th>人员名称</th>' +
                    dateStr +
                    '</tr>' +
                    designerStr +
                    '</table>' +
                    '</div>' +
                    '<div>' +
                    totalStr +
                    '</div>' +
                    '</div>';
            });
            $("#allArrange").html(str);
            layer.close(loading);

            //开启和关闭按钮事件
            setClass.openArrange();
            //复制按钮的事件
            setClass.copyArrange();
            //改变未开和已开启的数量
            setClass.getClassNum();
            //点击编辑排班事件
            setClass.editArrange();
            //绑定
            setClass.bindCalendar();
        }
    }


    setClass.init();
});
//日历
function calendar(arr) {
    var today = new Date(laydate.now());
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    $(".arrange-menology").pickmeup({
        flat: true,
        format: "Y-m-d",
        render: function (date) {
            if (day == date.getDate() && month == date.getMonth() && year == date.getFullYear()) {
                return {disabled: true, class_name: "pmu-selected today"}
            }
            for (var i = 0, len = arr.length; i < len; i++) {
                var that = new Date(arr[i]);
                if (that.getDate() == date.getDate() && that.getMonth() == date.getMonth() && that.getFullYear() == date.getFullYear()) return {
                    disabled: true,
                    class_name: "pmu-selected"
                }
            }
            return {disabled: true}
        }
    });
}

//获取7天的时间戳
function getDate(start) {
    var weeks = ["日", "一", "二", "三", "四", "五", "六"];
    var arr = [];
    for (var i = 0; i < 7; i++) {
        var date = new Date(start + i * 24 * 60 * 60 * 1000);
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var week = weeks[date.getDay()];
        var obj = {
            day: day,
            month: month,
            week: week
        }
        arr.push(obj);
    }
    return arr;
}

//获取7天前后的时间戳 i=-1表示七天前 i=1表示七天后
function getSevenDay(date, i) {
    var time = new Date(date);
    return time.getTime() + i * 24 * 60 * 60 * 1000 * 6;
}

// var headUrl = {
//     headIp: 'http://localhost:',
//     headPort: 30704
// }


