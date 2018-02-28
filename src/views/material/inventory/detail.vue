<template>
  <div class="tx-container">
    <div class="tx-content">
      <div class="inventory-title">
        <div class="title-msg">
          <img style="width:100%;height: 100%" src="../../../assets/images/zhanwei.jpg"/>
        </div>
        <div class="title-detail">
          <!--<div>名称：<span>哈哈哈面料</span></div>
          <div>编号：<span>哈哈哈面料</span></div>
          <div>颜色：<span>哈哈哈面料</span></div>
          <div>面料介绍：<span>哈哈哈面料哈哈哈面料哈哈哈面料</span></div>
          <div>供应商：<span>哈哈哈面料</span></div>
          <div>联系方式：<span>哈哈哈面料</span></div>-->
          <Row class="title-info">
            <Col span="6">
            <label>名称：</label>哈哈哈面料</Col>
            <Col span="6">
            <label>编号：</label>哈哈哈面料</Col>
            <Col span="6">
            <label>颜色：</label>哈哈哈面料</Col>
            <Col span="6">
            <label>面料介绍：</label>哈哈哈面料哈哈哈面料</Col>
          </Row>
          <Row class="title-info">
            <Col span="6">
            <label>供应商：</label>哈哈哈面料</Col>
            <Col span="6">
            <label>联系方式：</label>哈哈哈面料</Col>
            <Col span="6">
            <label>颜色：</label>哈哈哈面料</Col>
            <Col span="6">
            <label>面料介绍：</label>哈哈哈面料哈哈哈面料</Col>
          </Row>
          <Row class="title-info">
            <Col span="20" style="vertical-align: middle">
            <label>选择时间：</label>
            <DatePicker type="date" placeholder="开始时间"></DatePicker>
            <DatePicker type="date" placeholder="截至时间"></DatePicker>
            </Col>
          </Row>
        </div>

      </div>
      <Table border :columns="invDetailTitle" :data="invDetailParams"></Table>
      <Row class="title-info" style="font-size: 12px;">
        <label>入库总量：</label>1000匹
        <label class="invDetail-font">使用量：</label>1000匹
        <label class="invDetail-font">库存：</label>1000匹
        <label class="invDetail-font">损耗：</label>1000匹
      </Row>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        invDetailParams:[
          {
            edit:'入库',
            name:'小胖子',
            time:'tomorrow',
            num:'70米',
            remark:'这是一条评价评价评这是一条评价评价评这是一条评价评价评这是一条评价评价评'
          }
        ],
        invDetailTitle:[
          {
            title:'序号',
            type:'index',
            align:'center',
            width:'80'
          },
          {
            title:'操作类型',
            key:'edit',
            align:'center',
          },
          {
            title:'操作人',
            key:'name',
            align:'center',
          },
          {
            title:'操作时间',
            key:'time',
            align:'center',
          },
          {
            title:'操作数量',
            key:'num',
            align:'center',
          },
          {
            title:'备注',
            key:'remark',
            align:'center',
            width:'30%'
          }
        ],
      }
    },
    created () {

    },
    methods:{

    }
  }
</script>
<style type="text/less" scoped>
  .inventory-title{
    position: relative;
    min-height: 100px;

  }
  .inventory-title .title-msg{
    position: absolute;
    top:0px;
    left: 10px;
    width: 96px;
    height: 96px;
  }
  .title-detail{
    /*display: flex;*/
    padding-left: 130px;
    padding-bottom: 30px;
  }
  .title-info{
    margin-top: 10px;
    font-size: 14px;
  }
  .invDetail-font{
    margin-left: 5px;
  }
</style>
