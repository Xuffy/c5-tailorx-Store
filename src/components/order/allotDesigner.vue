<template>
  <div class="tx-order-allot-designer">
    <Form :label-width="90">
      <FormItem v-if="!readonly" label="分配设计师：" style="margin-bottom: 10px">
        <Row>
          <Col span="8">
          <Input v-model="designerAllot.input" placeholder="输入设计师名字" @on-keyup="getDesigners()"></Input>
          </Col>
        </Row>
      </FormItem>
      <FormItem :label="readonly ? '设计师：' : ''" style="margin-bottom: 10px">
        <div class="designer-box"
             v-for="item in designerFilterList"
             @click="selectDesigner(item)">
          <Card :padding="10" :class="{'card-active':!readonly && designerAllot.id === item.id}">
            <div style="text-align:center;line-height: 15px">
              <v-image :src="item.photo" :width="60" :height="60" :round="true"></v-image>
              <!--<img :src="item.photo" style="width: 60px;height: 60px;border-radius: 50%">-->
              <h6 v-text="item.name"></h6>
            </div>
          </Card>
        </div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  // 分配设计师组件
  import VImage from 'components/common/image'

  export default {
    name: 'allotDesigner',
    components:{VImage},
    props: {
      readonly: { // 只读
        type: Boolean,
        default: false
      },
      designer: Object // 已选择设计师
    },
    data() {
      return {
        designerAllList: [],
        designerFilterList: [],
        designerAllot: {}
      }
    },
    mounted() {
      if (!_.isEmpty(this.designer) && this.designer.name) {
        this.designerFilterList.push(this.designer);
        this.designerAllot = this.designer;
        this.selectDesigner(this.designerAllot);
      } else {
        this.getDesigners(true);
      }
    },
    watch: {
      /*designerAllot(val) {
       //        val.input = val.name;
       }*/
    },
    methods: {
      getData() {
        return this.designerAllot;
      },
      validate(){
        if (!this.designerAllot.name) {
          this.$Message.warning('请选择设计师！');
          return false;
        }
        return true;
      },
      selectDesigner(item){
        this.designerAllot = item;
        this.designerAllot.input = item.name;
      },
      getDesigners(isAll) {
        if (this.designerAllot.input !== this.designerAllot.name) {
          this.designerAllot = {input: this.designerAllot.input};
        }
        if (isAll) {
          this.designerAllot.input = '';
        }
        if (_.isEmpty(this.designerAllList)) {
          return this.ajax.get('/v2/store/news/findDesignerList', {params: {designerName: ''}}).then(data => {
            this.designerAllList = data;
            this.getDesigners(true);
          });
        }

        this.designerFilterList = [];
        _.map(this.designerAllList, val => {
          if (val.name.indexOf(this.designerAllot.input) > -1) {
            this.designerFilterList.push(val);
          }
        });

      }

    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tx-order-allot-designer .designer-box {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    margin-bottom: 10px;
    position: relative;
  }

  .tx-order-allot-designer .designer-box .card-active {
    border: solid 1px #2d8cf0;
    color: #2d8cf0;
  }

</style>
