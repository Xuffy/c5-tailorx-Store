<template>
  <div class="tx-container">

    <div class="tx-content">

      <h2 class="tx-title">基本信息</h2>
      <div class="tx-content-box">
        <Row class="info">
          <Col span="6">
          <label>订单编号：</label>{{orderInfo.sampleNo}}</Col>
          <Col span="6">
          <label>订单创建时间：</label>{{orderInfo.createTimeStr}}</Col>
          <Col span="6">
          <label>单价：</label>{{orderInfo.price}}</Col>
          <Col span="6">
          <label>系统标签：</label>{{orderInfo._systemTag}}</Col>
        </Row>
        快捷入口：
        <ButtonGroup size="small">
          <Button type="ghost" @click="$router.push({path: '/order/sample/detail/edit', query: {sid: orderInfo.id, id: orderInfo.sampleNo}})">
            样衣工单
          </Button>
          <Button type="ghost" :disabled="!orderInfo.expressNo" @click="shortcut">物流信息</Button>
        </ButtonGroup>
      </div>

      <h2 class="tx-title">处理进度</h2>
      <div class="tx-content-box">
        <Timeline class="step-list">
          <TimelineItem style="padding-bottom: 0" v-for="(item,index) in stepList" :key="index"
                        :color="item.status == 0 ? '#f90' : (item.status == 1 ? 'green' : 'red')">
            <Row>
              <Col span="13">
              {{item.tacheName}}</Col>
              <Col>
              <template v-if="$route.query.type == 1 && item.operation == 2 && item.status == 0">
                <!--<Button type="success" size="small" v-if="item.tacheId == 2"
                        @click="$Modal.confirm({title: '操作提示',content: '确定用户已抵达门店？',onOk(){submitCommonModal(0,0)}})">
                  已到店
                </Button>-->
                <!--<Button type="warning" size="small" v-if="item.tacheId == 2" @click="showCommonModal(0)">取消预约
                </Button>-->
                <Button type="success" size="small" v-if="item.tacheId == 4"
                        @click="$router.push({path: '/order/sample/detail/edit', query: {sid: orderInfo.id, id: orderInfo.sampleNo}})">
                  选择面料
                </Button>
                <Button type="success" size="small" v-if="item.tacheId == 7"
                        @click="$router.push({path: '/order/sample/detail/edit', query: {sid: orderInfo.id, id: orderInfo.sampleNo}})">
                  录入量体数据
                </Button>
                <Button type="success" size="small"
                        v-if="item.tacheId == 23 || item.tacheId == 24 || item.tacheId == 28 || item.tacheId == 8"
                        @click="$router.push({path: '/order/sample/detail/edit', query: {sid: orderInfo.id, id: orderInfo.sampleNo}})">
                  编辑工单
                </Button>
                <Button type="success" size="small" v-if="item.tacheId == 9 || item.tacheId == 25"
                        @click="showCommonModal(1)">发送工厂
                </Button>
                <Button type="success" size="small" v-if="item.tacheId == 11" @click="showCommonModal(2)">通过</Button>
                <Button type="warning" size="small" v-if="item.tacheId == 11" @click="showCommonModal(3)">不通过</Button>
                <!--<Button type="success" size="small" v-if="item.tacheId == 12" @click="sendToCustomerModal.show = true">
                  门店发货
                </Button>-->
                <Button type="success" size="small" v-if="item.tacheId == 20 && item.orderReceiptStatus != 1"
                        @click="$Modal.confirm({title: '操作提示',content: '是否确定收货？',onOk:submitTakeDelivery})">
                  收货
                </Button>
                <Button type="success" size="small" v-if="item.tacheId == 21" @click="sendToFactoryModal.show = true">
                  发货
                </Button>
              </template>
              </Col>
            </Row>
            <Row style="line-height: 30px;margin-top: 10px">
              <Col span="5">
              操作人：{{item.operatorName || '--'}}</Col>
              <Col span="8">
              执行结果：{{item.statusName || '--'}}</Col>
              <Col span="7">
              操作时间：{{item.updateDateStr || '--'}}</Col>
              <Col span="24" v-if="item.storeRemark || item.img">
              备注：{{item.storeRemark}}<br>
              <template v-if="item.img">
                <div style="display: inline-block;vertical-align: middle;margin-right: 10px"
                     v-for="(imgItem,imgIndex) in item.img.split(',')">
                  <v-image :width="60" :height="40" :key="imgIndex"
                           :src="imgItem"
                           @click.native="$refs.previewImage.show(item.img.split(','),imgIndex)"></v-image>
                </div>
              </template>
              </Col>
            </Row>
          </TimelineItem>
        </Timeline>
      </div>


      <!--通用弹窗-->
      <Modal v-model="commonModal.show" :width="commonModal.type === 2||commonModal.type === 3 ? 500 : 360">
        <p slot="header" style="text-align:center">
          <span v-text="commonModal.title[commonModal.type]"></span>
        </p>

        <div style="text-align:center">
          <Input v-model="commonModal.value" type="textarea" :rows="4" placeholder="请填写备注"></Input>
        </div>

        <template v-if="commonModal.type === 3">
          <div style="margin-top: 10px">
            <span>是否需要工厂返工:</span>&nbsp;&nbsp;
            <RadioGroup v-model="commonModal.checkPass.isToFactory">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </div>
          <div style="margin-top: 10px;" v-if="commonModal.checkPass.isToFactory !== 0">
            &nbsp;&nbsp;&nbsp;&nbsp;<span>是否发货到工厂:</span>&nbsp;&nbsp;
            <RadioGroup v-model="commonModal.checkPass.shipments">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </div>
        </template>

        <v-upload style="margin-top: 10px;" v-if="commonModal.type === 2 || commonModal.type === 3" :max-num="5"
                  ref="checkAcceptImages"></v-upload>


        <div slot="footer">
          <Button type="primary" size="large" long :loading="commonModal.loading" @click="submitCommonModal()">确定
          </Button>
        </div>
      </Modal>

      <!--弹窗 门店发货到工厂-->
      <Modal v-model="sendToFactoryModal.show" width="450">
        <p slot="header" style="text-align:center">
          <span>门店发货到工厂</span>
        </p>
        <Form :label-width="90" style="padding-right: 30px">
          <FormItem label="物流方式">
            <Select placeholder="请选择物流方式" v-model="sendToFactory.expressCompanyStatus" @on-change="getExpressConpany()">
              <Option :value="0">TX自物流</Option>
              <Option :value="1">第三方物流</Option>
            </Select>
          </FormItem>
          <FormItem label="物流公司" v-show="sendToFactory.expressCompanyStatus === 1" :required="true">
            <Select placeholder="请选择物流公司名称" v-model="sendToFactory.expressCompanyName">
              <Option v-for="item in expressConpanyList" :key="item.id" :value="item.companyName">{{item.companyName}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="物流单号" v-show="sendToFactory.expressCompanyStatus === 1" :required="true">
            <Input v-model="sendToFactory.expressNo" placeholder="请填写物流单号"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="sendToFactory.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请填写备注"></Input>
          </FormItem>
          <FormItem label="上传照片">
            <v-upload :max-num="5" ref="expressImages"></v-upload>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="sendToFactoryModal.loading" @click="submitSendToFactory">确定
          </Button>
        </div>
      </Modal>

      <Spin size="large" fix v-if="!orderInfo.id"></Spin>
    </div>

    <!--参考图片显示-->
    <v-preview-image ref="previewImage"></v-preview-image>

  </div>
</template>

<script>
  import VPreviewImage from 'components/common/previewImage'
  import VUpload from 'components/common/upload'
  import VImage from 'components/common/image'
  import ProvincesMap from 'lib/provinces'

  export default {
    name: 'detail',
    components: {VPreviewImage, VUpload, VImage},
    data () {
      return {
        provincesMapData: ProvincesMap,
        commonModal: {
          show: false,
          value: '',
          loading: false,
          type: 0,
          checkPass: {
            isToFactory: 1,
            shipments: 1
          },
          title: ['客户取消预约', '工艺单发送工厂', '确认验收通过', '确认验收不通过']
        }, // 客户取消预约 modal参数
        sendToFactoryModal: {show: false, loading: false}, // 发货 modal参数
        sendToFactory: { // 发送到工厂参数
          expressCompanyStatus: 0,
          expressCompanyName: '',
          expressNo: '',
          remark: '',
          img: ''
        },
        sendToCustomer: { // 发送到用户参数
          expressCompanyStatus: 1,
          expressCompanyId: '',
          expressCompanyName: '',
          expressNo: '',
          receiver: '',
          phone: '',
          province: '',
          city: '',
          district: '',
          address: '',
          _province: []
        },
        expressConpanyList: [],
        stepSpin: true,
        orderInfo: {},
//        stepType: 0,
        stepList: [],
        stepParams: [
          {icon: 'clipboard', title: '生成预约订单'},
          {icon: 'clock', title: '预约到店'},
          {icon: 'ios-paper-outline', title: '生成工艺单'},
          {icon: 'android-open', title: '工厂生产'},
          {icon: 'android-checkbox-outline', title: '生产完成'}
        ],
      }
    },
    mounted(){
      this.getOrderInfo();
    },
    methods: {
      getOrderInfo(){
        this.orderInfo = {};
        this.ajax.post('/v3/store/sampleOrder/get', {id: this.$route.query.id})
          .then(data => {
            let systemTag = [];

            data.genderName && systemTag.push(data.genderName);
            data.styleName && systemTag.push(data.styleName);
            data.seasonName && systemTag.push(data.seasonName);

            data._systemTag = systemTag.join('-');
            this.getStepInfo();
            this.orderInfo = data;
          });
      },
      getStepInfo(){
        this.stepSpin = true;
        this.ajax.post('/v3/store/sampleOrder/getOrderSampleLog', {id: this.$route.query.id})
          .then(data => {
            this.stepSpin = false;
            this.stepList = data;
          });
      },
      getExpressConpany(){
        if (!_.isEmpty(this.expressConpanyList)) {
          return;
        }
        this.ajax.get('/v3/store/order/expressConpany').then(data => {
          this.expressConpanyList = data;
        });
      },
      submitSendToFactory(){
        if (this.sendToFactory.expressCompanyStatus === 1) {
          if (!this.sendToFactory.expressCompanyName) {
            return this.$Message.warning('请选择物流公司！');
          }
          if (!this.sendToFactory.expressNo) {
            this.$Message.warning('请填写物流单号！');
          }
        }
        this.sendToFactory.img = this.$refs.expressImages.getData();
        this.sendToFactory.sampleId = this.orderInfo.id;

        this.sendToFactoryModal.loading = true;
        this.ajax.post('/v3/store/sampleOrder/storeDeliverFactory', this.sendToFactory).then(data => {
          this.sendToFactoryModal.show = false;
          this.$Message.success('发货操作成功！');
          this.$set(this.stepList, this.stepType, null);
          this.getStepInfo();
        }).catch(() => {
          this.sendToFactoryModal.loading = false;
        });
      },
      submitSendFactory(){ // 工艺单发送到工厂
        return this.ajax.post('/v3/store/sampleOrder/sendToFactory', {
          id: this.orderInfo.id,
          remark: this.commonModal.value
        });
      },
      submitTakeDelivery(){ // 收货
        return this.ajax.post('/v3/store/sampleOrder/storeReceipt', {
          id: this.orderInfo.id,
          isFitting: 0
        }).then(() => {
          this.$Message.success('操作成功！');
          this.$set(this.stepList, this.stepType, null);
          this.commonModal.show = false;
          this.getStepInfo();
        }).catch(() => {
          this.commonModal.show = false;
          this.commonModal.loading = false;
        });
      },
      submitCheckPass(){ // 验收是否通过
        let params = _.clone(this.commonModal.checkPass);

        if (this.commonModal.type === 2) { // 通过
          params.isToFactory = 0;
          params.shipments = 0;
          params.isPass = 1;
        } else {
          params.isPass = 0;
        }

        params.img = this.$refs.checkAcceptImages.getData();
        params.sampleId = this.orderInfo.id;
        params.remark = this.commonModal.value;

        return this.ajax.post('/v3/store/sampleOrder/checkTaskOrder', params).then(() => {
          this.$router.go(0);
        });
      },
      submitCommonModal(type, param){
        let submit;

        type = _.isUndefined(type) ? this.commonModal.type : type;

        switch (type) {
          /*case 0:
           submit = this.submitArrival(_.isUndefined(param) ? 1 : param);
           break;*/
          case 1:
            submit = this.submitSendFactory();
            break;
          case 2:
          case 3:
            submit = this.submitCheckPass();
            break;
          default:
            return;
        }

        if (!submit || !submit.then) return false;

        this.commonModal.loading = true;

        submit.then(() => {
          this.commonModal.loading = false;
          this.$Message.success('操作成功！');
          this.$set(this.stepList, this.stepType, null);
          this.commonModal.show = false;
          this.getStepInfo();
        }).catch(() => {
          this.commonModal.loading = false;
        });
      },
      showCommonModal(type){
        this.commonModal.type = type;
        this.commonModal.show = true;
      },
      shortcut(){
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .info {
    font-size: 14px;
    line-height: 26px;
    margin-bottom: 20px;
  }

  .info .ivu-col label {
    display: inline-block;
    /*width: 160px;*/
  }

  .step-box {
    margin-top: 30px;
    border: 1px solid #dddee1;
  }

  .step-list {
    margin: 10px 20px 20px 0;
  }

</style>
