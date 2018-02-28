layer.close(loading);

var detail = {

    init: function () {
        this.getWorkData();
        this.getEduData();
        this.getStyleData();
    },

    //设计师编辑页面跳转
    listDesigner: function (id) {
        sessionStorage.removeItem('designerId');
        location.href='designerV2.html';
    },

    getWorkData: function () {
        // 获取工作经历
        var WData = $("#workData").val();
        var dataObj = "";
        if (WData != "" && WData != null) {
            dataObj = eval("(" + WData + ")");
        } else {
            dataObj = [{"position": "", "company": ""}, {"position": "", "company": ""}];
        }
        var Wtemplate = $("#work_experience").html();
        var arr2 = [];
        if (dataObj.length == 1) {
            arr2.push(detail.formatTemplate(dataObj[0], Wtemplate));
        } else {
            for (i = 0; i < dataObj.length; i++) {
                arr2.push(detail.formatTemplate(dataObj[i], Wtemplate));
            }
        }
        $("#work_experience_div").append(arr2.join(''));
    },

    getEduData: function () {
        // 获取教育经历
        var EData = $("#educationData").val();
        var dataObj = "";
        if (EData != "" && EData != null) {
            dataObj = eval("(" + EData + ")");
        } else {
            dataObj = [{"specialty": "", "school": ""}];
        }
        var Etemplate = $("#education_experience").html();
        var arr1 = [];
        arr1.push(detail.formatTemplate(dataObj[0], Etemplate));
        $("#education_experience_div").append(arr1.join(''));
    },

    getStyleData: function () {
        // 获取善常风格
        var gsData = $("#styleData").val();
        var data = gsData.split("、");
        var gs = $("#goodStyle");
        var html = "";
        for (i = 0; i < data.length; i++) {
            if (data[i] != "") {
                html += '<div class="ut-mar-t10 ut-mar-b10 ut-pad-l10"><span class="glyphicon glyphicon-tag"></span><span>' + data[i] + '</span></div>';
            }
        }
        gs.append(html);
    },

    editDesigner: function () {
        var id = sessionStorage.getItem('designerId');
        sessionStorage.removeItem('designerId');
        sessionStorage.setItem('designerId',id);
        location.href='designerEdit.html';
    },

    //替换template中的数据
    formatTemplate: function (dta, tmpl) {
        var format = {
            name: function (x) {
                return x;
            }
        };
        return tmpl.replace(/{(\w+)}/g, function (m1, m2) {
            if (!m2 ||!dta)
                return "";
            return (format && format[m2]) ? format[m2](dta[m2]) : dta[m2];
        });
    },
}
$(function () {
    var designerId = sessionStorage.getItem("designerId");
    $.ajax({
        url: headUrl.headIp + headUrl.headPort + '/v2/store/designer/getDesignerInfo',
        type: 'post',
        data: 'designerId=' + designerId,
        dataType: 'json',
        success: function (data) {
            if (data !== null) {
                var designerInfo = data['data'];
                $("#id").text(designerInfo['id']);
                $("#name").text(designerInfo['name']);
                $("#qq").text(designerInfo['qq']);
                $("#phone").text(designerInfo['phone']);
                $("#we_chat").text(designerInfo['weChat']);

                //设计师简介
                $("#introduction").text(designerInfo['introduction']);
                $("#workData").val(designerInfo['workExperience']);
                $("#educationData").val(designerInfo['educationExperience']);
                $("#order_count").text(designerInfo['order_count']);
                $("#appointmentAmount").text(designerInfo['appointmentAmount']);
                $("#deal_count").text(designerInfo['deal_count']);

                //
                $("#styleData").val(designerInfo['goodStyle']);
                $("#max_design").text(designerInfo['max_design']+'单/天');

                if (designerInfo['photo'] !== null) {
                    $("#photoImg").attr('src', designerInfo['photo']);
                }
                $("#level").text(designerInfo['level']);

                // productions
                var designerProductions = designerInfo['designerProductions'];

                if (designerProductions !== null) {
                    var html = '';
                    $.each(designerProductions, function (index, item) {
                        html += '<div class="col-md-3 col-xs-5 opus-upload ut-mar-b20" data-id="' + item['id'] + '">';
                        html += '<div class="img-outer">';
                        html += '<img src="' + item['productionImg'] + '" alt="">';
                        html += '</div>';
                        html += '</div>';
                        html += '<div class="col-xs-1" data-id="' + item['id'] + '"></div>';
                    })
                    $("#productions").html(html);
                }
            }

            detail.init();
        },
        error: function (msg) {
            console.log(msg);
        }
    });
    // detail.init();
})

// var headUrl = {
//     headIp: 'http://localhost:',
//     headPort: 30704
// }
