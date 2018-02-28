<template>
  <div class="tx-order-add-material">
    <Form :label-width="90">
      <FormItem :label="'搜索' + type + '：'">
        <AutoComplete
          v-model="dataInfo.serialNumber"
          :data="materialNumberList"
          @on-search="getMaterialNumber"
          @on-select="getMaterialList"
          placeholder="输入编号搜索"
          style="width:250px"></AutoComplete>&nbsp;&nbsp;
        <Button type="ghost" :loading="searchLoading" @click="getMaterialList()">查询</Button>
      </FormItem>
      <FormItem>
        <div class="list-box" v-for="item in materialList" :class="{active:item.barCode === selectMaterial.barCode}"
             @click="clickSelect(item)">
          <Tooltip placement="bottom" style="position: relative">
            <v-image :src="item.picture" :width="98" :height="98" back-color="none"></v-image>
            <Icon type="checkmark" class="selected"></Icon>
            <div class="material-info">
              <p v-text="item.barCode"></p>
              <p v-text="'库存：' + item.stock + item.unit"></p>
            </div>
            <div slot="content">
              {{item.barCode}}<br>
              {{'库存：' + item.stock + item.unit}}
            </div>
          </Tooltip>
        </div>
      </FormItem>
      <FormItem label="选择标签：" v-if="type === '面料'">
        <Row>
          <Col span="5" style="padding-right: 10px">
          <Select v-model="dataInfo.genderName" placeholder="性别" @on-change="getPrice()">
            <Option v-for="item in tagList.sex" :key="item.tagId" :value="item.tagName">{{item.tagName}}</Option>
          </Select>
          </Col>
          <Col span="5" style="padding-right: 10px">
          <Select v-model="dataInfo.styleName" placeholder="款式" @on-change="getPrice()">
            <Option value="短款">短款</Option>
            <Option value="中长款">中长款</Option>
            <Option value="长款">长款</Option>
            <Option value="超长款">超长款</Option>
            <Option value="非常规款">非常规款</Option>
          </Select>
          </Col>
          <Col span="5" style="padding-right: 10px">
          <Select v-model="dataInfo.typeName" placeholder="分类" @on-change="getPrice()">
            <Option v-for="item in tagList.type" :key="item.tagId" :value="item.tagName">{{item.tagName}}</Option>
          </Select>
          </Col>
          <Col span="5">
          <Select v-model="dataInfo.seasonName" placeholder="季节">
            <Option v-for="item in tagList.season" :key="item.tagId" :value="item.tagName">{{item.tagName}}</Option>
          </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="价格：" v-if="type === '面料'">
        <span v-if="!priceParam.price1" style="color: rgb(230, 230, 230);">请选择标签查询价格</span>
        <RadioGroup v-model="dataInfo.price" v-else>
          <Radio :label="priceParam.price1">¥{{priceParam.price1}}</Radio>
          <Radio :label="priceParam.price2">¥{{priceParam.price2}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="用量：">
        <InputNumber v-model="dataInfo.dosage" :min="0" :precision="0"></InputNumber>&nbsp;&nbsp;{{unit}}
      </FormItem>
      <FormItem label="折扣：" v-if="type === '面料'">
        <InputNumber v-model="dataInfo.discount" :min="0" :max="1" :step="0.01"></InputNumber>&nbsp;&nbsp;请输入0~1的小数
      </FormItem>
      <FormItem label="备注：">
        <Row>
          <Col span="20">
          <Input v-model="dataInfo.remark" type="textarea" :rows="4" placeholder="请填写备注"></Input>
          </Col>
        </Row>
      </FormItem>
    </Form>
  </div>

</template>

<script>
  // 添加面料组件
  import VImage from 'components/common/image'

  export default {
    name: 'addMaterial',
    components: {VImage},
    props: {
      data: {
        type: Object,
        default: {}
      },
      type: {
        type: String, // 面料 里料 辅料
        default: '面料'
      },
    },
    data () {
      return {
        dataInfo: {
          serialNumber: '',
          barCode: '',
          picture: '',
          genderName: '',
          styleName: '',
          typeName: '',
          seasonName: '',
          price: 0,
          discount: 1,
          dosage: 0,
          remark: ''
        },
        unit: '',
        priceParam: {}, // 查询的价格对象
        selectMaterial: {}, // 当前选择的面料对象
        searchLoading: false,
        materialList: [],
        materialNumberList: [],
        getMaterialNumber: null,
        tagList: {sex: null, type: null, season: null}
      }
    },
    created(){
      let _this = this;

      this.getMaterialNumber = _.throttle((value) => {
        let type;
        switch (this.type) {
          case '面料':
            type = 1;
            break;
          case '里料':
            type = 2;
            break;
          case '辅料':
            type = 3;
            break;
        }
        _this.ajax.post('/v3/store/material/materialNoTypeahead', {
          searchTerm: value,
          type: type
        }).then(data => {
          _this.materialNumberList = data;
        });
      }, 500);
    },
    mounted() {
      if (!_.isEmpty(this.data)) {
        this.dataInfo = _.clone(this.data);
      } else {
        this.materialList = [];
        this.dataInfo = this.$options.data().dataInfo;
      }
      this.getTagList();
    },
    watch: {
      data(val){
        if (!_.isEmpty(val)) {
          this.dataInfo = _.clone(val);
          this.getMaterialList();
        } else {
          this.materialList = [];
          this.dataInfo = this.$options.data().dataInfo;
        }
      }
    },
    methods: {
      getData(){
        if (!this.dataInfo.discount) {
          this.dataInfo.discount = 0;
        }

        this.dataInfo.barCode = this.selectMaterial.barCode;
        this.dataInfo.serialNumber = this.selectMaterial.no;
        this.dataInfo.picture = this.selectMaterial.picture;
        this.dataInfo._type = this.type;

        return this.dataInfo;
      },
      validate(){
        if (_.isEmpty(this.selectMaterial)) {
          this.$Message.warning(`请选择${this.type}！`);
          return false;
        }
        if (this.type === '面料' && (!this.dataInfo.genderName || !this.dataInfo.styleName || !this.dataInfo.typeName || !this.dataInfo.seasonName)) {
          this.$Message.warning('请选择标签！');
          return false;
        }
        if (this.type === '面料' && !this.dataInfo.price) {
          this.$Message.warning('请选择价格！');
          return false;
        }
        if (!this.dataInfo.dosage) {
          this.$Message.warning(`请输入${this.type}用量！`);
          return false;
        }
        if (this.type === '面料' && this.dataInfo.discount.toString().split('.')[1] && this.dataInfo.discount.toString().split('.')[1].length > 2) {
          this.$Message.warning(`折扣最多输入两位小数！`);
          return false;
        }
        return true;

      },
      getTagList(){
        if (!_.isEmpty(this.tagList.sex)) return;
        this.ajax.get('/v3/store/tag/getSearchTagList').then(data => {
          this.tagList.sex = _.where(data, {tagType: 1});
          this.tagList.type = _.where(data, {tagType: 2});
          this.tagList.season = _.where(data, {tagType: 3});
        });
      },
      getMaterialList(value){
        let type = 0;

        if (value) {
          this.dataInfo.serialNumber = value;
        }

        if (!this.dataInfo.serialNumber) {
          return this.$Message.warning(`请输入${this.type}编号`);
        }
        this.getMaterialNumber(this.dataInfo.serialNumber);

        this.searchLoading = true;
        this.materialList = [];

        switch (this.type) {
          case '面料':
            type = 1;
            break;
          case '里料':
            type = 2;
            break;
          case '辅料':
            type = 3;
            break;
        }

        this.ajax.post('/v3/store/material/search', {
          materialNo: this.dataInfo.serialNumber.trim(),
          type: type
        }).then(data => {
          let item;
          if (_.isEmpty(data)) {
            this.$Message.warning(`没有对应的${this.type}信息！`);
          }
          this.materialList = data;
          this.searchLoading = false;

          item = _.findWhere(data, {barCode: this.dataInfo.barCode});

          this.selectMaterial = _.isEmpty(item) ? {} : item;
          this.getPrice();
        }).catch(() => {
          this.searchLoading = false;
        });
      },
      getPrice(){
        if (this.type !== '面料' || !this.dataInfo.serialNumber || !this.dataInfo.genderName || !this.dataInfo.typeName || !this.dataInfo.styleName) {
          this.priceParam = {};
          this.dataInfo.price = 0;
          return;
        }

        this.ajax.post('/v3/store/material/getPriceInfo', {
          materialNo: this.dataInfo.serialNumber,
          genderName: this.dataInfo.genderName,
          typeName: this.dataInfo.typeName,
          styleName: this.dataInfo.styleName,
        }).then(data => {
          this.priceParam = data;
        }).catch(() => {
          this.priceParam = {};
          this.dataInfo.price = 0;
        });
      },
      clickSelect(item){
        this.selectMaterial = item;
        this.unit = item.unit;
      }
    }
  }
</script>

<style>
  .tx-order-add-material .ivu-select-dropdown.ivu-auto-complete {
    z-index: 999999;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tx-order-add-material .ivu-form-item {
    margin-bottom: 10px;
  }

  .tx-order-add-material .list-box {
    width: 100px;
    display: inline-block;
    height: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    border: 1px solid #ededed;
    border-radius: 5px;
    cursor: pointer;
  }

  .tx-order-add-material .material-info {
    position: absolute;
    bottom: 12px;
    left: 0;
    width: 100%;
    line-height: 20px;
    text-align: center;
    background-color: rgba(0, 0, 0, .5);
    color: #FFFFFF;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .tx-order-add-material .material-info p {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tx-order-add-material .list-box .selected {
    position: absolute;
    top: 40%;
    left: 50%;
    font-size: 30px;
    opacity: 0;
    transform: translate(-50%, -50%);
  }

  .tx-order-add-material .list-box.active {
    border-color: #2d8cf0;
  }

  .tx-order-add-material .list-box.active .selected {
    opacity: 1;
    color: #2d8cf0;
  }

  /*.tx-order-add-material .list-box:hover .material-info{
    opacity: 0;
  }*/
</style>
