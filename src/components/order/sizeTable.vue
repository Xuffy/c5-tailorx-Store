<template>
  <div class="tx-order-size-table">
    <Row class="data-list" v-if="dataList" ref="sizeTable">
      <Col :span="24 / column" v-for="item in total()" :key="item"
           style="line-height: 32px;border-top: solid 1px #dddee1">
      <Row v-if="dataList[item - 1]">
        <Col span="12" style="background-color: #eeeeee;"
             v-text="dataList[item - 1][labelKey]"></Col>
        <Col span="12">
        <Input class="input-data" v-model="dataList[item - 1][valueKey]"
               :readonly="readonly"
               @on-focus="inputActive($event,true)"
               @on-blur="inputActive($event,false)"
               @on-keydown="inputChange($event,item)"></Input></Col>
        <!--@on-focus="test($event)"-->
      </Row>
      <Row v-else>
        <Col span="12" style="background-color: #eeeeee;">
        --</Col>
        <Col span="12">
        --</Col>
      </Row>
      </Col>
    </Row>

    <Spin size="large" fix v-else></Spin>
  </div>

</template>

<script>
  // 录入量体数据组件

  export default {
    name: 'sizeTable',
    props: {
      dataList: Array,         // 数据集合
      labelKey: String,        // label字段key
      valueKey: String,        // value字段key
      column: {                // 显示列数
        type: Number,
        default: 6,
        validator: value => {
          return 24 % value === 0;
        }
      },
      readonly: {              // 是否只读
        type: Boolean,
        default: false,
      }
    },
    data () {
      return {
        total: () => {
          return Math.ceil(this.dataList.length / this.column) * this.column;
        }
      }
    },
    created() {
    },
    methods: {
      getData(){
        return this.dataList;
      },
      inputChange(e, index){
        let row = Math.ceil(index / this.column) // 行
          , col = index % this.column           // 列
          , total = this.dataList.length;

        col = col === 0 ? index / row : col;

        switch (e.which) {
          case 37: // 触发左键
            if (index === 1) return;
            index--;
            break;
          case 39: // 触发右键
            if (index === total) return;
            index++;
            break;
          case 38: // 触发上键
            if (row === 1) return;
            index = index - this.column;
            break;
          case 40: // 触发下键
            if (Math.ceil(total / this.column) === row || index + this.column > total) return;
            index = index + this.column;
            break;
          default:
            return;
        }
        index--;
        this.$refs.sizeTable.$el.getElementsByTagName('input')[index].focus();
      },
      inputActive(e, type){
        if (type) {
          e.path[3].className = 'ivu-row active';
        } else {
          e.path[3].className = 'ivu-row';
        }
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .tx-order-size-table {
    position: relative;
    width: 100%;
    min-height: 50px;
  }

  .tx-order-size-table .data-list .input-data input {
    text-align: center;
  }

  .tx-order-size-table .data-list {
    border: solid 1px #dddee1;
    text-align: center;
    border-top: none;
  }

  .tx-order-size-table .data-list .input-data input {
    border: none;
    font-size: 14px;
    border-radius: 0;
  }

  .tx-order-size-table .ivu-row.active .ivu-col:first-child {
    color: #FFFFFF;
    background-color: #2d8cf0 !important;
  }
</style>
