$(function() {
    layer.close(loading);
    var rankId=sessionStorage.getItem('store-rankId');
    //初始化分页数据
    baseData();
    sortNoo();

    function baseData(e){

        $.ajax({
            type : "POST",
            url : headUrl.headUrl + "/v2/store/rank/data",
            data : {
                rankId:rankId
            },
            dataType : "json",
            success : function(data) {
                if(data.success){
                    data.data
                    $(".m-no").text(data.data.order_no);
                    $(".m-time").text(data.data.create_time);
                    $(".m-design").text(data.data.desigName);
                    $(".m-name").text(data.data.custName);
                    $(".m-orderName").text(data.data.order_name);
                    $(".m-sortNo").text(data.data.sort_no);
                    $(".m-cName").text(data.data.custName);
                    $(".m-cdName").text(data.data.cdName);
                    $(".m-phone").text(data.data.phone);
                }else{
                    layer.msg("网络故障，获取数据失败");
                    return;
                }
            },
            error:function(){
                layer.msg("服务器出错!");
                return;
            }
        });
    }

    function sortNoo(e){

        $.ajax({
            type : "POST",
            url : headUrl.headUrl + "/v2/store/rank/dataCompetition",
            data : {
                rankId:rankId,
                page:e
            },
            dataType : "json",
            success : function(data) {
                if(data.success){
                    var wrape = $("#rankNumber");
                    wrape.empty();
                    if(data.code==505){
                        $("#templatePage").empty();
                        $("#rankNumberText").show();
                        /*var aHtml="<div class='no-msg text-center no-user' style='margin-top: 100px;'>暂无交易记录信息</div>";*/
//									wrape.append(aHtml);
                        return ;
                    }

                    paginations(data.data.total,data.data.totalPages,data.data.pageNo);
                    var rowHtml = template("pageTabList", data.data);
                    wrape.append(rowHtml);
                    return;
                }else{
                    layer.msg("网络故障，获取数据失败");
                    return;
                }
            },
            error:function(){
                layer.msg("服务器出错!");
                return;
            }
        });
    }



    //排号管理跳转
    $("#rowNumber").click(function(){
        location.href = "../../modules/queue/queueV2.html";
    });


    //分页
    function paginations(total,pageLength,page){
        $('#templatePage').pagination({
            totalData: total,//总条数
            showData:pageLength,//每页显示条数
            jump: true,//跳转
            current: page,//当前页
            coping: true,//首页和尾页
            count: 4,//当前页前后分页个数
            homePage: '首页',
            endPage: '末页',
            prevContent: '上页',
            nextContent: '下页',
            callback: function (index,jq) {
                var page = index.getCurrent();//获取当前页

                sortNoo(page);
            }
        });
    }

});
