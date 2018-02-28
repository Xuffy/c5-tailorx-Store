$(function () {
    var arrange = {
        init: function () {
            this.bindEvent();

        },
        bindEvent: function () {
            //点击新建排班
            $("#addNew").click(function () {
                $("#submitBtn").attr("data-id", "");
                arrange.renderEditHtml();
                $("#continue").show();
                $("#cancel").hide();
                $('.help-tips').hide();
                $("#edit-new-add").show();
                $(".addCla-nameInput").focus();
            });
            //点击继续添加
            $("#continue").click(function () {
                var data = arrange.getEditData();
                if (typeof data != "object") return;
                arrange.addNewClassAjax(data, function () {
                    arrange.renderEditHtml();
                    $(".addCla-nameInput").focus();
                });
            });


            //添加和删除中间休息时段
            this.addAndReduce();
            //是否显示休息时间段
            $(".rest-time").click(function () {
                var $ele = $(".addClaF");
                if ($(this).val() == 1) {
                    if ($ele.length != 0) {
                        $ele.show();
                    } else {
                        $("#cancel").before(getRelaxTime(false, true));
                        arrange.addAndReduce();
                        judgement();
                    }
                } else {
                    $ele.hide();
                }
            });

            //点击提交新建、编辑班次
            $("#submitBtn").click(function () {
                loading = layer.load(2);
                var data = arrange.getEditData();
                if (typeof data != "object") return;
                var id = $(this).attr("data-id");
                if (id) {
                    arrange.editClassAjax(data);
                } else {
                    arrange.addNewClassAjax(data);
                }
            })
        },
        //提交编辑class
        editClassAjax: function (data) {
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/class/edit",
                dataType: "json",
                data: data,
                success: function (res) {
                    if (res.success) {
                        showList();
                        layer.alert("修改成功");
                        $('.change.help-tips').show().siblings('#edit-new-add').hide();
                    } else {
                        layer.alert(res.msg);
                    }
                    layer.close(loading);
                }
            });
        },
        //新增排班
        addNewClassAjax: function (data, callback) {
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/class/add",
                dataType: "json",
                data: data,
                success: function (res) {
                    if (res.success) {
                        showList();
                        layer.alert("添加成功");
                        if (callback) {
                            callback();
                            return;
                        }
                        $('.change.help-tips').show().siblings('#edit-new-add').hide();
                    } else {
                        layer.alert(res.msg);
                    }
                    layer.close(loading);
                }
            });
        },
        //获取新建或者编辑弹窗里的内容
        getEditData: function () {
            var name = $(".addCla-nameInput").val();
            if (!name.trim()) return layer.msg("请输入班次名称");
            var onTime = $(".on-time-hour").val() + ":" + $(".on-time-min").val();
            var offTime = $(".off-time-hour").val() + ":" + $(".off-time-min").val();
            if (onTime >= offTime) return layer.msg("下班时间不能小于上班时间");
            var val = $(".rest-time:checked").val();
            var arr = ["", "", ""];
            if (val == 1) {
                var valid = true;
                $(".addClaF").each(function (i) {
                    var $this = $(this);
                    var on = $this.find(".on-hour").val() + ":" + $this.find(".on-min").val();
                    var off = $this.find(".off-hour").val() + ":" + $this.find(".off-min").val();
                    if (on >= off || on < onTime || on >= offTime || off <= onTime || off > offTime) {
                        valid = false;
                    }
                    arr[i] = on + "~" + off;
                });
                if (!valid) return layer.alert("休息时间设置有误");
            }
            if (!noRepeat()) return layer.alert("休息时间之间设置冲突");

            var data = {
                classId: $("#submitBtn").attr("data-id"),
                className: name,
                onTime: onTime,
                offTime: offTime,
                restTime1: arr[0],
                restTime2: arr[1],
                restTime3: arr[2]
            }
            return data;
        },
        //点击编辑事件
        editClass: function () {
            $(".again-title-edit").off("click");
            $(".again-title-edit").click(function () {
                $("#continue").hide();
                $("#cancel").show();
                var $this = $(this);
                $('.help-tips').hide();
                $("#edit-new-add").show();
                $("#submitBtn").attr("data-id", $this.attr('data-id'));
                arrange.getById($this.attr('data-id'));
            });
        },
        //添加和删除中间休息时段
        addAndReduce: function () {
            $("#edit-new-add .add").off("click");
            $("#edit-new-add .add").click(function () {
                if ($("#edit-new-add .addClaF").length >= 3) return;
                $("#cancel").before(getRelaxTime());
                judgement();
                arrange.addAndReduce();
            });
            $("#edit-new-add .remove").off("click");
            $("#edit-new-add .remove").click(function () {
                $(this).parent().parent().parent().remove();
                judgement();
            });
        },
        //通过ID获取需要编辑的班次信息
        getById: function (classId) {
            loading = layer.load(2);
            $.ajax({
                type: "post",
                url: headUrl.headIp + headUrl.headPort + "/v2/store/class/showStoreClassesById",
                dataType: "JSON",
                data: {
                    classId: classId
                },
                success: function (res) {
                    layer.close(loading);
                    if (res.success) {
                        var data = res.data[0];
                        //渲染新建页面
                        arrange.renderEditHtml(data);
                    } else {
                        layer.alert(res.errorMsg);
                    }
                }
            });
        },
        //渲染新建或者编辑班次页面
        renderEditHtml: function (data) {
            if (!data) {
                var data = {
                    name: "",
                    ontime: "00:00",
                    offtime: "00:00"
                };
            }

            $(".addCla-nameInput").val(data.name);
            $(".on-time-hour option[value=" + data.ontime.slice(0, 2) + "]").prop("selected", "selected");
            $(".on-time-min option[value=" + data.ontime.slice(3, 5) + "]").prop("selected", "selected");
            $(".off-time-hour option[value=" + data.offtime.slice(0, 2) + "]").prop("selected", "selected");
            $(".off-time-min option[value=" + data.offtime.slice(3, 5) + "]").prop("selected", "selected");

            $(".addClaF").remove();
            if (data.rest_time1) {
                $("#cancel").before(getRelaxTime(data.rest_time1, true));
                $(".rest-time[value=1]").click();
            } else {
                $(".rest-time[value=0]").click();
            }
            if (data.rest_time2) $("#cancel").before(getRelaxTime(data.rest_time2, true));
            if (data.rest_time3) $("#cancel").before(getRelaxTime(data.rest_time3, true));
            judgement();

            //渲染之后调用增加和减少休息时间的方法
            arrange.addAndReduce()
        }
    }

    arrange.init();
    //关闭添加班次函数
    $('#edit-new-add .close-add.cur').on('click', function () {
        $('.change.help-tips').show().siblings('#edit-new-add').hide();
    });


    $('.cancel-edit').on('click', function () {
        $('#edit-new-add').hide();
        $('.help-tips').show();
    });

    $('.add-submit').on('click', function () {
        addClass();
    });


    showList();
//将时间转换为分钟计算
    function toMin(time) {
        if (time == null) {
            time = "";
        }
        var hour = time.split(":")[0];
        var min = time.split(":")[1];
        var countMin = hour * 60 + min * 1;
        return countMin;
    }

//时间先后判断
    function compareTime(time1, time2, name) {
        toMin1 = toMin(time1);
        toMin2 = toMin(time2);
        if (toMin1 >= toMin2) {
            layer.alert(name + "设置有误，" + time2 + "不能早于" + time1 + "请重新设置！");
            return false;
        }
        return true;

    }

    /* 计算工作时间 */
    function caculateWorkTime(ontime, offtime) {
        var on = ontime.split(":");
        var ontimeHour = parseInt(on[0]);
        var ontimeMin = parseInt(on[1]);
        var off = offtime.split(":");
        var offtimeHour = parseInt(off[0]);
        var offtimeMin = parseInt(off[1]);
        if (offtimeMin < ontimeMin) {
            var hour = offtimeHour - 1 - ontimeHour;
            var min = offtimeMin + 60 - ontimeMin;
            var workTime = hour + (min / 60);
        } else {
            var hour = offtimeHour - ontimeHour;
            var min = offtimeMin - ontimeMin;
            var workTime = hour + (min / 60);
        }
        return workTime;
    }

    function showList() {
        $.ajax({
            type: "post",
            url: headUrl.headIp + headUrl.headPort + "/v2/store/class/findStoreClassList",
            dataType: "JSON",
            data: {},
            success: function (json) {
                layer.close(loading);
                var infoList = json.data;
                if (infoList == null) {
                    return;
                }
                var total = infoList.length - 1;
                var foreMark = "";
                var behdMark = "</div>"
                var betMark = "";
                var astr = '';
                if (total > 0) {
                    for (var i = 0; i < total; i++) {
                        var a1 = infoList[i].rest_time1;
                        var b1 = infoList[i].rest_time2;
                        var c1 = infoList[i].rest_time3;
                        var a = typeof (infoList[i].rest_time1);
                        var b = typeof (infoList[i].rest_time2);
                        var c = typeof (infoList[i].rest_time3);
                        var bl = a == str;
                        var str = "undefined";
                        if (a == str || a1 == "") {
                            betMark = "";
                        } else if (b == str || b1 == "") {
                            betMark = infoList[i].rest_time1;
                        } else if (c == str || c1 == "") {
                            betMark = infoList[i].rest_time1 + "/"
                                + infoList[i].rest_time2;
                        } else {
                            betMark = infoList[i].rest_time1 + "/"
                                + infoList[i].rest_time2 + "/"
                                + infoList[i].rest_time3;
                        }
                        var on = infoList[i].ontime;
                        var off = infoList[i].offtime;
                        var time = caculateWorkTime(on, off);// 上下班之间间隔
                        if (a == str || a1 == "") {
                            var workTime = time;
                        } else if (b == str || b1 == "") {
                            var time1 = a1.split("~");
                            var rTime1 = caculateWorkTime(time1[0], time1[1]);// restTime1的时间间隔
                            var workTime = time - rTime1;
                        } else if (c == str || c1 == "") {
                            var time1 = a1.split("~");
                            var rTime1 = caculateWorkTime(time1[0], time1[1]);// restTime1的时间间隔
                            var time2 = b1.split("~");
                            var rTime2 = caculateWorkTime(time2[0], time2[1]);// restTime2的时间间隔
                            var workTime = time - rTime1 - rTime2;
                        } else {
                            var time1 = a1.split("~");
                            var rTime1 = caculateWorkTime(time1[0], time1[1]);// restTime1的时间间隔
                            var time2 = b1.split("~");
                            var rTime2 = caculateWorkTime(time2[0], time2[1]);// restTime2的时间间隔
                            var time3 = c1.split("~");
                            var rTime3 = caculateWorkTime(time3[0], time3[1]);// restTime3的时间间隔
                            var workTime = time - rTime1 - rTime2 - rTime3;
                        }
                        var classNone = '';
                        if (betMark == '') {
                            classNone = "ut-none";
                        }
                        astr += foreMark
                            + " <div class='panel panel-default' data-id='" + infoList[i].id + "'>"
                            + "<div class='panel-heading'>"
                            + "<span class='again-title' style='color:" + infoList[i].colour + "'>" + infoList[i].name + "</span>"
                            + "<span class='glyphicon glyphicon-edit again-title-edit' style='cursor:pointer;' aria-hidden='true' data-id=" + infoList[i].id + "></span>"
                            + "</div>"
                            + "<div class='panel-body'>"
                            + "<div class='col-md-5 again-font'>上班时间:" + infoList[i].ontime + "</div>"
                            + "<div class='col-md-7 again-font'>下班时间:" + infoList[i].offtime + "</div>"
                            + "</div>"
                            + "<div class='panel-body'>"
                            + "<div class='col-md-5 again-font'>工作时长:" + workTime + "</div>"
                            + "<div class='col-md-7 again-font " + classNone + "'>休息时段:" + betMark + "</div>"
                            + "</div>"
                            + behdMark;
                        $("#noinfo-out").hide();
                    }
                } else {
                    $("#have-data").hide();
                }
                $("#have-data").empty().append(astr).show();
                arrange.editClass();
                layer.close(loading);

            },

            error: function () {
            }
        });
    }

    function getRelaxTime(time) {
        if (!time) var time = "00:00~00:00";
        var hour = time.slice(0, 2);
        var min = time.slice(3, 5);
        var hour2 = time.slice(6, 8);
        var min2 = time.slice(9, 11);

        var str = "", onHour = "", onMin = "", offHour = "", offMin = "";
        for (var i = 0; i < 24; i++) {
            var hVal = i < 10 ? "0" + i : i
            onHour += '<option value="' + hVal + '" ' + (hour == hVal ? "selected" : "") + '>' + hVal + '</option>';
            offHour += '<option value="' + hVal + '" ' + (hour2 == hVal ? "selected" : "") + '>' + hVal + '</option>';
        }
        for (var j = 0; j < 4; j++) {
            var mVal = j == 0 ? "00" : j * 15;
            onMin += '<option value="' + mVal + '" ' + (min == hVal ? "selected" : "") + '>' + mVal + '</option>';
            offMin += '<option value="' + mVal + '" ' + (min2 == hVal ? "selected" : "") + '>' + mVal + '</option>';
        }


        str += '<div class="addClaF">' +
            '<div class="col-md-12 cal-class-name ut-mar-l20">' +
            '<select class="on-hour">' +
            onHour +
            '</select> ' +
            '<span>:</span> ' +
            '<select class="on-min">' +
            onMin +
            '</select> ' +
            '<span>--</span> ' +
            '<select class="off-hour">' +
            offHour +
            '</select> ' +
            '<span>:</span> ' +
            '<select class="off-min">' +
            offMin +
            '</select> ' +
            '<div class="ut-inline-block add-remove-span">' +
            '<span class="glyphicon glyphicon-plus cur add" aria-hidden="true"></span> ' +
            '<span class="glyphicon glyphicon-minus cur remove" aria-hidden="true"></span>' +
            '</div>' +
            '</div>' +
            '</div>';

        return str;
    }

//判断休息时间之间是否重复
    function noRepeat() {
        var $ele = $(".addClaF");
        var len = $ele.length;
        if (len <= 1) {
            return true;
        } else {
            var valid = true;
            $ele.each(function (i) {
                var $this = $(this);
                var onTime = $this.find(".on-hour").val() + ":" + $this.find(".on-min").val();
                var offTime = $this.find(".off-hour").val() + ":" + $this.find(".off-min").val();
                for (var j = i + 1; j < len; j++) {
                    var on = $($ele[j]).find(".on-hour").val() + ":" + $($ele[j]).find(".on-min").val();
                    var off = $($ele[j]).find(".off-hour").val() + ":" + $($ele[j]).find(".off-min").val();
                    if (!(on >= offTime || off <= onTime)) {
                        valid = false;
                        return;
                    }
                }
            });
            return valid;
        }
    }

//判断加号和减号的出现
    function judgement() {
        $(".add").show();
        $(".remove").show();
        var len = $(".addClaF").length;
        if (len == 1) {
            $(".remove").hide();
        } else if (len == 3) {
            $(".add").hide();
        } else {
            $(".addClaF").each(function (i) {
                if (i + 1 == len) return;
                $(this).find(".add").hide();
            });
        }
    }
});

// var headUrl = {
//     headIp: 'http://localhost:',
//     headPort: 30704
// }
