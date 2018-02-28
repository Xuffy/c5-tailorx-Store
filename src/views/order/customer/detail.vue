<template>
  <div class="tx-container">

    <div class="tx-content">

      <h2 class="tx-title">基本信息</h2>
      <div class="tx-content-box">
        <Row class="info">
          <Col span="6">
          <label>用户昵称：</label>{{orderInfo.customerName}}</Col>
          <Col span="6">
          <label>用户手机：</label>{{orderInfo.customerPhone}}</Col>
          <Col span="6">
          <label>预约门店：</label>{{orderInfo.storeName}}</Col>
          <Col span="6">
          <label>预约设计师：</label>{{orderInfo.designerName}}</Col>
          <Col span="6">
          <label>定金金额：</label>{{orderInfo.deposit}}</Col>

          <Col span="6" v-if="orderInfo.delivery === '2'">
          <label>物流方式：</label>第三方物流</Col>
          <Col span="6" v-else-if="orderInfo.delivery === '1'">
          <label>物流方式：</label>上门自取</Col>
          <Col span="6" v-else="">
          <label>物流方式：</label>--</Col>


          <Col span="6" v-if="orderInfo.delivery === '2'">
          <label>收货人姓名：</label>{{orderInfo.consigneeName || '--'}}</Col>
          <Col span="6" v-if="orderInfo.delivery === '2'">
          <label>收货人电话：</label>{{orderInfo.consigneePhone || '--'}}</Col>
          <Col span="6" v-if="orderInfo.delivery === '2'">
          <label>收货地址：</label>{{orderInfo.expressAddress || '--'}}</Col>
          <Col span="6" v-if="orderInfo.delivery === '2'">
          <label>物流公司：</label>{{orderInfo.expressName || '--'}}</Col>
          <Col span="6" v-if="orderInfo.delivery === '2'">
          <label>物流单号：</label>{{orderInfo.expressNo || '--'}}</Col>
          <Col span="6">
          <label>订单编号：</label>{{orderInfo.orderNo}}</Col>
          <Col span="6">
          <label>订单创建时间：</label>{{orderInfo.createDateStr}}</Col>
          <Col span="6">
          <label>系统标签：</label>{{orderInfo._systemTag}}</Col>
          <Col span="6">
          <label>订单金额：</label>
          <span v-if="orderInfo.orderNum > 1">
              {{orderInfo.orderNum}} ×
              ¥{{orderInfo.discountPrice}} <s style="color: rgb(223, 220, 220);">(¥{{orderInfo.listPrice}})</s>&nbsp; = ¥{{orderInfo.totalAmount}}
            </span>
          <span v-else><s style="color: #999">
              ¥{{orderInfo.listPrice}}</s>&nbsp;&nbsp;¥{{orderInfo.totalAmount}}</span>
          </FormItem>

          </Col>
          <Col span="6">
          <label>工单编号：</label>{{orderInfo.taskOrderNo || '--'}}</Col>
          <Col span="6">
          <label>订单等级：</label>{{orderInfo.orderGrade}}</Col>
        </Row>

        <div>
          快捷入口：
          <ButtonGroup size="small">
            <Button type="ghost" :disabled="orderInfo.informationNo == 0" @click="showInfoModal(3)">资讯来源</Button>
            <Button type="ghost" :disabled="!orderInfo.pictures"
                    @click="$refs.previewImage.show(orderInfo._pictures)">参考图片
            </Button>
            <Button type="ghost" :disabled="orderInfo.orderWorkUpdateStatus != 0 && orderInfo.orderWorkUpdateStatus != 1"
                    @click="$router.push({path: '/order/customer/detail/edit', query: {id: orderInfo.orderNo}})">
              工艺单
            </Button>
            <Button type="ghost" :disabled="!orderInfo.isEvaluate" @click="showInfoModal(1)">客户评价</Button>
            <Button type="ghost" :disabled="!orderInfo.expressNo" @click="showInfoModal(2)">物流信息</Button>
          </ButtonGroup>
        </div>
      </div>

      <h2 class="tx-title">处理进度</h2>
      <div class="tx-content-box" style="position: relative">
        <Tabs class="step-box" v-model="stepType" @on-click="getStepInfo">
          <TabPane v-for="(stepItem,stepIndex) in stepList" :key="stepIndex" :label="stepParams[stepIndex].title"
                   :icon="stepParams[stepIndex].icon" :disabled="orderInfo._flowCode < stepIndex + 1">
            <Timeline class="step-list">
              <TimelineItem style="padding-bottom: 0" v-for="(item,index) in stepItem" :key="index"
                            :color="item.status == 0 ? '#f90' : (item.status == 1 ? 'green' : 'red')">
                <Row>
                  <Col span="13">
                  {{item.tacheName}}</Col>
                  <Col>
                  <template v-if="$route.query.type == 1 && item.operation == 2 && item.status == 0">
                    <Button type="success" size="small" v-if="item.tacheId == 2"
                            @click="$Modal.confirm({title: '操作提示',content: '确定用户已抵达门店？',onOk(){submitCommonModal(0,0)}})">
                      已到店
                    </Button>
                    <Button type="warning" size="small" v-if="item.tacheId == 2" @click="showCommonModal(0)">取消预约
                    </Button>
                    <Button type="success" size="small" v-if="item.tacheId == 4"
                            @click="$router.push({path: '/order/customer/detail/edit', query: {id: orderInfo.orderNo}})">
                      选择面料
                    </Button>
                    <Button type="success" size="small" v-if="item.tacheId == 7"
                            @click="$router.push({path: '/order/customer/detail/edit', query: {id: orderInfo.orderNo}})">
                      录入量体数据
                    </Button>
                    <Button type="success" size="small" v-if="item.tacheId == 8 && item.orderWorkUpdateOrCreate != 1"
                            @click="$router.push({path: '/order/customer/detail/edit', query: {id: orderInfo.orderNo}})">
                      创建工单
                    </Button>
                    <Button type="success" size="small"
                            v-if="item.tacheId == 23 || item.tacheId == 24 || item.tacheId == 28 || (item.tacheId == 8 && item.orderWorkUpdateOrCreate == 1)"
                            @click="$router.push({path: '/order/customer/detail/edit', query: {id: orderInfo.orderNo}})">
                      编辑工单
                    </Button>
                    <Button type="success" size="small" v-if="item.tacheId == 9 || item.tacheId == 25"
                            @click="showCommonModal(1)">发送工厂
                    </Button>
                    <Button type="success" size="small" v-if="item.tacheId == 11" @click="showCommonModal(2)">通过
                    </Button>
                    <Button type="warning" size="small" v-if="item.tacheId == 11" @click="showCommonModal(3)">不通过
                    </Button>
                    <!-- todo 判断是否重做-->
                    <Button type="success" size="small" v-if="item.tacheId == 12"
                            @click="sendToCustomerModal.show = true">
                      门店发货
                    </Button>
                    <Button type="success" size="small" v-if="item.tacheId == 20 && item.orderReceiptStatus != 1"
                            @click="$Modal.confirm({title: '操作提示',content: '是否确定收货？',onOk:submitTakeDelivery})">
                      收货
                    </Button>
                    <Button type="success" size="small" v-if="item.tacheId == 21"
                            @click="sendToFactoryModal.show = true">
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
          </TabPane>
        </Tabs>
        <Spin size="large" fix v-if="stepSpin"></Spin>
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

      <!--弹窗 门店发货到用户-->
      <Modal v-model="sendToCustomerModal.show" width="450">
        <p slot="header" style="text-align:center">
          <span>门店发货到用户</span>
        </p>
        <Form :label-width="90" style="padding-right: 30px;min-height: 150px">
          <FormItem label="物流方式">
            <Select placeholder="请选择物流方式" v-model="sendToCustomer.expressCompanyStatus"
                    @on-change="getExpressConpany()">
              <Option :value="1">用户上门取货</Option>
              <Option :value="0">第三方物流</Option>
            </Select>
          </FormItem>
          <FormItem label="物流公司" v-show="sendToCustomer.expressCompanyStatus === 0" :required="true">
            <Select placeholder="请选择物流公司名称" v-model="sendToCustomer.expressCompanyId">
              <Option v-for="item in expressConpanyList" :key="item.id" :value="item.id">{{item.companyName}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="物流单号" :required="true" v-show="sendToCustomer.expressCompanyStatus === 0">
            <Input v-model="sendToCustomer.expressNo" placeholder="请填写物流单号"></Input>
          </FormItem>
          <FormItem label="收货人姓名" :required="true" v-if="orderInfo.delivery == 1"
                    v-show="sendToCustomer.expressCompanyStatus === 0">
            <Input v-model="sendToCustomer.receiver" placeholder="请填写收货人姓名"></Input>
          </FormItem>
          <FormItem label="收货人电话" :required="true" v-if="orderInfo.delivery == 1"
                    v-show="sendToCustomer.expressCompanyStatus === 0">
            <Input v-model="sendToCustomer.phone" placeholder="请填写收货人电话"></Input>
          </FormItem>
          <FormItem label="收货人地址" :required="true" v-if="orderInfo.delivery == 1"
                    v-show="sendToCustomer.expressCompanyStatus === 0">
            <Cascader :data="provincesMapData" v-model="sendToCustomer._province"></Cascader>
          </FormItem>
          <FormItem label="详细地址" :required="true" v-if="orderInfo.delivery == 1"
                    v-show="sendToCustomer.expressCompanyStatus === 0">
            <Input v-model="sendToCustomer.address" placeholder="请填写详细地址"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="sendToCustomerModal.loading" @click="submitSendToCustomer">
            确定
          </Button>
        </div>
      </Modal>

      <!--弹窗 资讯来源/客户评价/物流信息-->
      <Modal v-model="infoModal.show" width="450">
        <p slot="header" style="text-align:center">
          <span v-if="infoModal.type === 1">客户评价</span>
          <span v-else-if="infoModal.type === 2">物流信息</span>
          <span v-else>资讯来源</span>
        </p>

        <div v-if="infoModal.type ===  1">
          <h3>客户评分</h3>
          <Form :label-width="90">
            <FormItem label="综合评分" style="margin-bottom: 0">
              <Rate allow-half :disabled="true" :value="infoModal.data.overallScore"></Rate>
            </FormItem>
            <FormItem label="设计师评分" style="margin-bottom: 0">
              <Rate allow-half :disabled="true" :value="infoModal.data.designerScore"></Rate>
            </FormItem>
            <FormItem label="工厂评分" style="margin-bottom: 0">
              <Rate allow-half :disabled="true" :value="infoModal.data.factoryScore"></Rate>
            </FormItem>
          </Form>
          <h3>客户评价</h3>&nbsp;&nbsp;&nbsp;&nbsp;
          <span v-text="infoModal.data.content"></span><br><br>
          <h3>上传图片</h3><br>
          <v-image v-for="item in infoModal.data.pics" :key="item" :src="item" :width="120" :height="120"
                   @click.native="$refs.previewImage.show(item)"
                   style="margin-right: 10px;margin-bottom: 10px"></v-image>
        </div>
        <div v-else-if="infoModal.type ===  2">
          <p>{{infoModal.data.company}}：{{infoModal.data.no}}</p><br>
          <Timeline>
            <TimelineItem v-for="(item,index) in infoModal.data.data" :key="index"
                          :color="index === 0 ? 'green' : '#cccccc'">
              <p class="time" v-text="item.context"></p>
              <p class="content" v-text="item.time"></p>
            </TimelineItem>
          </Timeline>
        </div>
        <div v-else>
          <h3 v-text="infoModal.data.name"></h3><br>
          <p>资讯编号：{{infoModal.data.informationNo}}</p><br>
          <template v-for="item in infoModal.data.desList">
            <v-image :src="item.infoPic" :width="400" :height="400"></v-image>
            <p v-text="item.description"></p><br>
          </template>
        </div>

        <div slot="footer">
          <Button type="primary" size="large" long @click="infoModal.show = false">关闭
          </Button>
        </div>

        <Spin size="large" fix v-if="infoModal.loading"></Spin>
      </Modal>

      <Spin size="large" fix v-if="!orderInfo.orderNo"></Spin>
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
        infoModal: {
          loading: false,
          show: false,
          type: 1,
          data: {}
        },
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
        sendToCustomerModal: {show: false, loading: false}, // 发送到用户 modal参数
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
        stepSpin: false,
        orderInfo: {},
        stepType: 0,
        stepList: [null, null, null, null, null],
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
        this.ajax.get('/v3/store/order/getOrderInfoDetail', {params: {orderNo: this.$route.query.id}})
          .then(data => {
            let systemTag = [];

            data.genderTagName && systemTag.push(data.genderTagName);
            data.typeTagName && systemTag.push(data.typeTagName);
            data.seasonTagName && systemTag.push(data.seasonTagName);

            data._systemTag = systemTag.join('-');

            if (data.pictures && _.isString(data.pictures)) {
              data._pictures = data.pictures.split(';');
            }

            data._flowCode = parseInt(data.flowCode);
            this.stepType = data._flowCode - 1;

            this.getStepInfo();
            this.orderInfo = data;
          });
      },
      getStepInfo(){
        if (!_.isEmpty(this.stepList[this.stepType]) || this.stepSpin) {
          return;
        }

        this.stepSpin = true;
        this.ajax.get('/v3/store/order/getOrderInfoLog', {
          params: {
            orderNo: this.$route.query.id,
            flowCode: this.stepType + 1
          }
        }).then(data => {
          this.$set(this.stepList, this.stepType, data.reverse());
          this.stepSpin = false;
        }).catch(() => {
          this.stepSpin = false;
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
      submitSendToCustomer(){
        let params = _.clone(this.sendToCustomer);

        if (params.expressCompanyStatus === 0) {
          if (!params.expressCompanyId) {
            return this.$Message.warning('请选择物流公司！')
          }
          if (!params.expressNo) {
            return this.$Message.warning('请填写物流单号！')
          }

          if (this.orderInfo.delivery == 1) {
            if (!params.receiver) {
              return this.$Message.warning('请填写收货人姓名！')
            }
            if (!params.phone) {
              return this.$Message.warning('请填写收货人电话！')
            }
            if (_.isEmpty(params._province)) {
              return this.$Message.warning('请选择收货人地址！')
            }
            if (!params.address) {
              return this.$Message.warning('请填写详细地址！')
            }
            params.province = params._province[0];
            params.city = params._province[1];
            params.district = params._province[2];
          }
          params.expressCompanyName = _.findWhere(this.expressConpanyList, {id: params.expressCompanyId}).companyName;
        } else {
          params = this.$options.data().sendToCustomer;
        }

        params.orderNo = this.orderInfo.orderNo;

        this.sendToCustomerModal.loading = true;
        this.ajax.post('/v3/store/order/orderDelivery', params).then(data => {
          this.sendToCustomerModal.show = false;
          this.$Message.success('发货成功！');
          this.$set(this.stepList, this.stepType, null);
          this.getStepInfo();
        }).catch(() => {
          this.sendToCustomerModal.loading = false;
        });
      },
      submitSendToFactory(){
        let params = _.clone(this.sendToFactory);

        if (params.expressCompanyStatus === 1) {
          if (!params.expressCompanyName) {
            return this.$Message.warning('请选择物流公司！');
          }
          if (!params.expressNo) {
            this.$Message.warning('请填写物流单号！');
          }
        }
        params.img = this.$refs.expressImages.getData();
        params.orderNo = this.orderInfo.orderNo;

        this.sendToFactoryModal.loading = true;
        this.ajax.post('/v3/store/order/storeDeliverFactory', params).then(data => {
          this.sendToFactoryModal.show = false;
          this.$Message.success('发货操作成功！');
          this.$set(this.stepList, this.stepType, null);
          this.getStepInfo();
        }).catch(() => {
          this.sendToFactoryModal.loading = false;
        });
      },
      submitArrival(type){ // 已到店/客户取消预约
        if (type === 1 && (!this.commonModal.value || this.commonModal.value.length > 200)) {
          this.$Message.warning('请填写200字以内的备注');
          return false;
        }

        return this.ajax.post('/v3/store/order/customerToStore', {
          orderNo: this.orderInfo.orderNo,
          type: type || 0,
          reson: this.commonModal.value,
          customerId: this.orderInfo.customerId
        });
      },
      submitSendFactory(){ // 工艺单发送到工厂
        return this.ajax.post('/v3/store/order/taskOrderToFactory', {
          orderNo: this.orderInfo.orderNo,
          remark: this.commonModal.value
        });
      },
      submitTakeDelivery(){ // 收货
        return this.ajax.post('/v3/store/order/storeReceiptFitting', {
          orderNo: this.orderInfo.orderNo,
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
        params.orderNo = this.orderInfo.orderNo;
        params.remark = this.commonModal.value;

        return this.ajax.post('/v3/store/order/checkTaskOrder', params).then(() => {
          this.$router.go(0);
        });
      },
      submitCommonModal(type, param){
        let submit;

        type = _.isUndefined(type) ? this.commonModal.type : type;

        switch (type) {
          case 0:
            submit = this.submitArrival(_.isUndefined(param) ? 1 : param);
            break;
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
      showInfoModal(type){
        let param = {orderNo: this.orderInfo.orderNo}, res;
        this.infoModal.show = true;
        this.infoModal.type = type;

        this.infoModal.data = {};
        this.infoModal.loading = true;
        switch (type) {
          case 1:
            res = this.ajax.post('/v3/store/order/findOrderFeedBack', param);
            break;
          case 2:
            res = this.ajax.post('/v3/store/order/express', param);
            break;
          case 3:
            res = this.ajax.post('/v2/store/news/getInformationDetailByNo', {informationNo: this.orderInfo.informationNo});
            break;
          default:
            return;
        }

        res.then(data => {
          this.infoModal.data = data;
          this.infoModal.loading = false;
        }).catch(() => {
          this.infoModal.loading = false;
        });
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
    margin: 10px 20px 20px 20px;
  }

</style>
