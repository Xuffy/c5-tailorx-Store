<template>
  <div class="tx-container order-edit">
    <div class="tx-content">

      <!--基本信息-->
      <h2 class="tx-title">基本信息</h2>
      <div class="tx-content-box">
        <Form :label-width="90" inline>
          <FormItem label="定制数量：">
            <InputNumber v-if="dataInfo.orderTache === 4" v-model="materialParams.orderNum" :min="1"></InputNumber>
            <span v-else v-text="materialParams.orderNum"></span>
            &nbsp;&nbsp;件
          </FormItem>
          <FormItem label="订单等级：">
            <Select v-if="dataInfo.orderTache === 4" v-model="materialParams.orderGrade" clearable placeholder="全部"
                    style="width: 70px">
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
            </Select>
            <span v-else v-text="materialParams.orderGrade"></span>
          </FormItem>
          <FormItem label="定制品类：">
            {{dataInfo._systemTag}}
          </FormItem>
          <FormItem label="订单价格：" v-if="dataInfo.orderQuantity">
            <span v-if="dataInfo.orderQuantity > 1">
              {{dataInfo.orderQuantity}} ×
              ¥{{dataInfo.discountPrice}} <s style="color: rgb(223, 220, 220);">(¥{{dataInfo.listPrice}})</s>&nbsp; = ¥{{dataInfo.totalAmount}}
            </span>
            <span v-else><s style="color: #999;margin-right: 10px" v-if="parseInt(dataInfo.discountPrice) < 1">
              ¥{{dataInfo.listPrice}}</s>¥{{dataInfo.totalAmount}}</span>
          </FormItem>
        </Form>

        <br>
        <v-add-tag v-if="dataInfo.orderNo" ref="addTag" :data-list="dataInfo.commonList"
                   :readonly="dataInfo.orderTache !== 4"></v-add-tag>
      </div>

      <h2 class="tx-title">面辅料信息</h2>
      <div class="tx-content-box">
        <Button icon="android-add" @click="showModal('面料',true)" v-if="dataInfo.orderTache === 4">面料</Button>
        <h3 v-else class="tx-title">面料</h3>
        <Table border :columns="materialTitle" :data="materialList"
               style="margin-top: 20px;margin-bottom: 20px"></Table>

        <Button icon="android-add" @click="showModal('里料',true)" v-if="dataInfo.orderTache === 4">里料</Button>
        <h3 v-else class="tx-title">里料</h3>
        <Table border :columns="materialTitle" :data="liningList" style="margin-top: 20px;margin-bottom: 20px"></Table>

        <Button icon="android-add" @click="showModal('辅料',true)" v-if="dataInfo.orderTache === 4">辅料</Button>
        <h3 v-else class="tx-title">辅料</h3>
        <Table border :columns="materialTitle" :data="accessoryList"
               style="margin-top: 20px;margin-bottom: 20px"></Table>

      </div>

      <!--客户信息-->
      <h2 class="tx-title" v-if="dataInfo.orderTache !== 4 && dataInfo.orderNo">客户信息</h2>
      <div class="tx-content-box" v-if="dataInfo.orderTache !== 4 && dataInfo.orderNo">
        <h3 class="tx-title">客户量体数据</h3>
        <v-size-table ref="customerBodySize" style="max-width: 500px"
                      :column="2"
                      :data-list="dataInfo.storeCustomerBodyList"
                      :readonly="!checkBodyTache"
                      label-key="labelName"
                      value-key="strSize"></v-size-table>
        <br>

        <h3 class="tx-title">客户量体图片</h3>
        <ul class="customer-photo">
          <li>
            <v-customer-photo ref="photoFront" :src="dataInfo.customerBodyPicList[0].pictureUrl"
                              :readonly="!checkBodyTache"
                              label="正面"></v-customer-photo>
          </li>
          <li>
            <v-customer-photo ref="photoSide" :src="dataInfo.customerBodyPicList[1].pictureUrl"
                              :readonly="!checkBodyTache"
                              label="侧面"></v-customer-photo>
          </li>
          <li>
            <v-customer-photo ref="photoBack" :src="dataInfo.customerBodyPicList[2].pictureUrl"
                              :readonly="!checkBodyTache"
                              label="背面"></v-customer-photo>
          </li>
        </ul>
        <br>

        <h3 class="tx-title">客户需求</h3>

        <Row style="text-align: left;margin: 20px 10px;line-height: 24px;">
          <Col span="4">
          <Checkbox size="large" :value="dataInfo._tightness[0] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._tightness,0, dataInfo._tightness[0] == 0 ? '1' : '0')">
            偏紧
          </Checkbox>
          </Col>
          <Col span="4">
          <Checkbox size="large" :value="dataInfo._tightness[1] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._tightness,1, dataInfo._tightness[1] == 0 ? '1' : '0')">
            居中
          </Checkbox>
          </Col>
          <Col span="4">
          <Checkbox size="large" :value="dataInfo._tightness[2] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._tightness,2, dataInfo._tightness[2] == 0 ? '1' : '0')">
            偏松
          </Checkbox>
          </Col>
          <Col span="4">
          <Checkbox size="large" :value="dataInfo._chestType[0] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._chestType,0, dataInfo._chestType[0] == 0 ? '1' : '0')">
            挺胸
          </Checkbox>
          </Col>
          <Col span="6">
          <Checkbox size="large" :value="dataInfo._chestType[1] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._chestType,1, dataInfo._chestType[1] == 0 ? '1' : '0')">
            平胸
          </Checkbox>
          </Col>
          <Col span="4">
          <Checkbox size="large" :value="dataInfo._shoulderType[0] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._shoulderType,0, dataInfo._shoulderType[0] == 0 ? '1' : '0')">
            斜肩
          </Checkbox>
          </Col>
          <Col span="4">
          <Checkbox size="large" :value="dataInfo._shoulderType[1] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._shoulderType,1, dataInfo._shoulderType[1] == 0 ? '1' : '0')">
            平肩
          </Checkbox>
          </Col>
          <Col span="4">
          <Checkbox size="large" :value="dataInfo._shoulderType[2] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._shoulderType,2, dataInfo._shoulderType[2] == 0 ? '1' : '0')">
            曲背
          </Checkbox>
          </Col>
          <Col span="4">
          <Checkbox size="large"
                    :value="dataInfo._posteriorCircumference[0] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._posteriorCircumference,0, dataInfo._posteriorCircumference[0] == 0 ? '1' : '0')">
            肚大
          </Checkbox>
          </Col>
          <Col span="4">
          <Checkbox size="large"
                    :value="dataInfo._posteriorCircumference[1] === '1'"
                    :disabled="!checkBodyTache"
                    @on-change="$set(dataInfo._posteriorCircumference,1, dataInfo._posteriorCircumference[1] == 0 ? '1' : '0')">
            后围大
          </Checkbox>
          </Col>
        </Row>
        <Input v-if="checkBodyTache" v-model="customerDemand" type="textarea" :rows="4"
               placeholder="填写客户需求"></Input>
        <h4 v-else v-text="customerDemand"></h4>
        <br>
      </div>

      <!--设计信息-->
      <h2 class="tx-title" v-if="dataInfo.orderTache !== 4 && dataInfo.orderTache !== 7 && dataInfo.orderNo">设计信息</h2>
      <div class="tx-content-box" v-if="dataInfo.orderTache !== 4 && dataInfo.orderTache !== 7 && dataInfo.orderNo">
        <ul>
          <li style="width: 500px;display: inline-block">
            <h3 class="tx-title">上衣尺寸表</h3>
            <v-size-table :data-list="jacketList" style="max-width: 90%"
                          label-key="name" value-key="designerSize"
                          :column="2"
                          ref="jacketSize"
                          :readonly="!checkDesignTache"></v-size-table>
          </li>
          <li style="width: 500px;display: inline-block">
            <h3 class="tx-title">下衣/裙装尺寸表</h3>
            <v-size-table :data-list="dressList" style="max-width: 90%"
                          label-key="name" value-key="designerSize"
                          :column="2"
                          ref="dressSize"
                          :readonly="!checkDesignTache"></v-size-table>
          </li>
        </ul>
        <br>
        <h3 class="tx-title">设计稿及设计说明</h3>
        <v-upload ref="designUpload" :data-list="dataInfo._designUrl" :max-num="20" :width="248"
                  :readonly="!checkDesignTache"
                  :height="144"></v-upload>
        <br>
        <h3 class="tx-title">版式图</h3>
        <v-upload-file ref="cadFile" v-if="dataInfo.orderNo" :data-list="cadFiles" :max-num="5"
                       :readonly="!checkDesignTache"></v-upload-file>
        <h3 class="tx-title">设计师要求</h3>
        <Input v-if="checkDesignTache" v-model="dataInfo.designDescription" type="textarea" :rows="4"
               placeholder="填写客户需求"></Input>
        <h4 v-else v-html="$textToHtml(dataInfo.designDescription)"></h4>
      </div>

      <!--操作按钮-->
      <Row style="margin-top: 30px">
        <Col span="3">
        <Button type="ghost" style="width: 80%" @click="$router.go(-1)">返回</Button>
        </Col>
        <template v-if="dataInfo.orderTache === 4 || checkDesignTache  || checkBodyTache">
          <Col span="3">
          <Button type="primary" style="width: 80%" @click="saveData()" :loading="saveLoading">保存</Button>
          </Col>
          <Col span="3">
          <Button type="success" style="width: 80%"
                  @click="$Modal.confirm({title: '提交确认',content: '是否确认提交？',onOk: submitData})" :loading="saveLoading">提交
          </Button>
          </Col>
          <Col span="3" v-if="dataInfo.edbOutputFlag === 0">
          <Button type="warning" style="width: 80%"
                  @click="$Modal.confirm({title: '锁定库存确认',content: '是否确认锁定库存？',onOk: lockStock})"
                  :loading="saveLoading">锁定库存
          </Button>
          </Col>
        </template>
      </Row>

      <Spin size="large" fix v-if="dataLoading"></Spin>
    </div>

    <!--添加/编辑面料弹窗-->
    <Modal v-model="materialModal.show" width="600"
           :title="'添加' + materialModal.type">

      <v-add-material ref="addMaterial" :data="materialItem" :type="materialModal.type"></v-add-material>

      <div slot="footer">
        <Button type="ghost" @click="materialModal.show = false">取消</Button>
        <Button type="primary" @click="editMaterial()">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import VAddMaterial from 'components/order/addMaterial'
  import VSizeTable from 'components/order/sizeTable'
  import VCustomerPhoto from 'components/order/customerPhoto'
  import VAddTag from 'components/order/addTag'
  import VImage from 'components/common/image'
  import VUpload from 'components/common/upload'
  import VUploadFile from 'components/common/uploadFile'

  export default {
    name: 'measure',
    components: {VAddTag, VSizeTable, VCustomerPhoto, VAddMaterial, VImage, VUpload, VUploadFile},
    data () {
      return {
        materialModal: {
          show: false,
          type: '面料', // 面料 里料 辅料
          isAdd: true
        },
        dataInfo: {},
        materialList: [],
        liningList: [],
        accessoryList: [],
        materialItem: {},
        materialItemIndex: 0,
        dataLoading: false,
        saveLoading: false,
        customerDemand: '',
        designSizeData: {
          jacket: {
            JacketShoulderVolume: {id: 'JacketShoulderVolume', name: '总长(肩顶量)'},
            JacketFront: {id: 'JacketFront', name: '前衣长'},
            JacketBack: {id: 'JacketBack', name: '后中长'},
            JacketBust: {id: 'JacketBust', name: '胸围'},
            JacketAroundTheBelly: {id: 'JacketAroundTheBelly', name: '肚围'},
            JacketWaistline: {id: 'JacketWaistline', name: '腰围'},
            JacketHipline: {id: 'JacketHipline', name: '臀围'},
            JacketSweep: {id: 'JacketSweep', name: '摆围'},
            JacketShoulderWidth: {id: 'JacketShoulderWidth', name: '肩宽'},
            JacketShoulderSleeve: {id: 'JacketShoulderSleeve', name: '肩到袖'},
            JacketSleeveLeft: {id: 'JacketSleeveLeft', name: '袖长 左'},
            JacketSleeveRight: {id: 'JacketSleeveRight', name: '袖长 右'},
            JacketSleeveFat: {id: 'JacketSleeveFat', name: '袖肥'},
            JacketChestWidth: {id: 'JacketChestWidth', name: '前胸宽'},
            JacketBackWidth: {id: 'JacketBackWidth', name: '后背宽'},
            JacketCuff: {id: 'JacketCuff', name: '袖口'},
            JacketNeck: {id: 'JacketNeck', name: '领围'},
            JacketBustTop: {id: 'JacketBustTop', name: '上胸围', old: true},
            JacketNeckAndShoulder: {id: 'JacketNeckAndShoulder', name: '(参考)肩颈-腹高点', old: true}
          },
          dress: {
            DressPantsLong: {id: 'DressPantsLong', name: '裤/群长'},
            DressWaistlineWidth: {id: 'DressWaistlineWidth', name: '腰宽'},
            DressWaistline: {id: 'DressWaistline', name: '腰围'},
            DressHipline: {id: 'DressHipline', name: '臀围'},
            DressRise: {id: 'DressRise', name: '直裆'},
            DressTotalSize: {id: 'DressTotalSize', name: '总浪'},
            DressBigthigh: {id: 'DressBigthigh', name: '大腿围'},
            DressKneeCircumference: {id: 'DressKneeCircumference', name: '膝围'},
            DressCalfGirth: {id: 'DressCalfGirth', name: '小腿围'},
            DressPants: {id: 'DressPants', name: '裤口'},
            DressWithinLong: {id: 'DressWithinLong', name: '内长', old: true},
            DressBarre: {id: 'DressBarre', name: '横裆', old: true},
            DressBustTop: {id: 'DressBustTop', name: '上胸围', old: true},
            DressChestWidth: {id: 'DressChestWidth', name: '前胸宽', old: true},
            DressBackWidth: {id: 'DressBackWidth', name: '后背宽', old: true},
            DressCuff: {id: 'DressCuff', name: '袖口', old: true},
            DressNeck: {id: 'DressNeck', name: '领围', old: true},
          }
        },
        jacketList: [],
        dressList: [],
        checkBodyTache: false,
        checkDesignTache: false,
        cadFiles: [], // 版式图列表
        materialParams: {
          orderGrade: '',
          orderNum: 1,
          orderNo: this.$route.query.id,
          materials: '',
          linings: '',
          accessory: ''
        },
        materialTitle: [
          {
            title: '图片',
            align: 'center',
            render: (h, param) => {
              return h(VImage, {
                props: {
                  src: param.row.picture,
                  width: 50,
                  height: 50
                },
              })
            }
          },
          {
            title: '编号',
            key: 'serialNumber',
            align: 'center',
          },
          {
            title: '色号',
            key: 'barCode',
            align: 'center',
          },
          {
            title: '用量',
            key: 'dosage',
            align: 'center',
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let btns = []
                , item = params.row;

              item.barCode && btns.push(this.createBtn(h, '编辑', () => {
                this.materialItem = item;
                this.materialItemIndex = params.index;
                this.showModal(item._type, false);
              }));

              btns.push(this.createBtn(h, '删除', () => {
                this.deleteMaterial(item._type, params.index);
              }));

              return h('div', btns);
            }
          },
        ]
      }
    },
    mounted(){
      this.getDataInfo();
    },
    methods: {
      editMaterial(){
        let item;
        if (!this.$refs.addMaterial.validate()) {
          return false;
        }

        item = _.clone(this.$refs.addMaterial.getData());

        if (this.materialModal.isAdd) {
          switch (this.materialModal.type) {
            case '面料':
              this.materialList.unshift(item);
              break;
            case '里料':
              this.liningList.unshift(item);
              break;
            case '辅料':
              this.accessoryList.unshift(item);
              break;
          }
        } else {
          switch (this.materialModal.type) {
            case '面料':
              this.$set(this.materialList, this.materialItemIndex, item);
              break;
            case '里料':
              this.$set(this.liningList, this.materialItemIndex, item);
              break;
            case '辅料':
              this.$set(this.accessoryList, this.materialItemIndex, item);
              break;
          }
        }
        this.materialModal.show = false;
      },
      getDataInfo(){
        this.dataLoading = true;
        this.dataInfo = {};
        this.ajax.post('/v3/store/order/findTaskOrder', {orderNo: this.$route.query.id})
          .then(data => {
            let cl;
            /*选择面料********************************************************************************/
            data._systemTag = _.pluck(_.indexBy(data.systemList, 'type'), 'tagName').join(' - ');
            this.materialParams.orderGrade = data.orderGrade;
            this.materialParams.orderNum = data.orderQuantity || 1;
            this.materialList = data.material ? JSON.parse(data.material) : [];
            this.liningList = data.lining ? JSON.parse(data.lining) : [];
            this.accessoryList = data.accessory ? JSON.parse(data.accessory) : [];

            this.materialList = _.map(this.materialList, val => {
              val._type = '面料';
              return val;
            })
            this.liningList = _.map(this.liningList, val => {
              val._type = '里料';
              return val;
            })
            this.accessoryList = _.map(this.accessoryList, val => {
              val._type = '辅料';
              return val;
            })

            if (data.orderTache !== 4) {
              this.materialTitle = _.initial(this.materialTitle);
            }

            /*录入量体数据*****************************************************************************/
            if (_.isEmpty(data.customerBodyPicList)) {
              data.customerBodyPicList = [];
            }
            for (let i = 0; i < 3; i++) {
              data.customerBodyPicList[i] = data.customerBodyPicList[i] || {};
            }

            cl = data.customerLabel || {};

            data._tightness = this.toBinary(cl.tightness, true);
            data._chestType = this.toBinary(cl.chestType, true);
            data._shoulderType = this.toBinary(cl.shoulderType, true);
            data._posteriorCircumference = this.toBinary(cl.posteriorCircumference, true);
            this.customerDemand = cl.bodyDescription;


            /*设计信息*****************************************************************************/
            let ob = JSON.parse(data.orderBady);
            if (!_.isEmpty(ob)) {
              _.map(ob, val => {
                if (this.designSizeData.jacket[val.id]) {
                  this.designSizeData.jacket[val.id].designerSize = val.designerSize;
                }
                if (this.designSizeData.dress[val.id]) {
                  this.designSizeData.dress[val.id].designerSize = val.designerSize;
                }
              });
            }
            this.jacketList = _.filter(this.designSizeData.jacket, val => {
              return !val.old || val.designerSize ? true : false;
            });

            this.dressList = _.filter(this.designSizeData.dress, val => {
              return !val.old || val.designerSize ? true : false;
            });

            this.cadFiles = data.cadUrlSize ? JSON.parse(data.cadUrlSize) : [];
            data._designUrl = data.designUrl ? data.designUrl.split(',') : [];
            data.designDescription = this.$htmlToText(data.designDescription);

            this.checkTache(data.orderTache);

            this.dataInfo = data;
            this.dataLoading = false;
          });
      },
      showModal(type, isAdd){
        this.materialModal.type = type;
        this.materialModal.isAdd = isAdd;
        this.materialModal.show = true;
        if (isAdd) {
          this.materialItem = {};
        }
      },
      deleteMaterial(type, index){
        switch (type) {
          case '面料':
            this.materialList[index] = null;
            this.materialList = _.compact(this.materialList);
            break;
          case '里料':
            this.liningList[index] = null;
            this.liningList = _.compact(this.liningList);
            break;
          case '辅料':
            this.accessoryList[index] = null;
            this.accessoryList = _.compact(this.accessoryList);
            break;
        }
      },
      checkSaveStep(){
        let params = {};

        // 选择面料参数
        if (this.dataInfo.orderTache === 4) {
          if (!this.materialParams.orderNum) {
            this.$Message.warning('请输入定制数量！');
            return null;
          }

          if (!this.materialParams.orderGrade) {
            this.$Message.warning('请选择订单等级！');
            return null;
          }

          if (_.isEmpty(this.materialList)) {
            this.$Message.warning('请选择面料！');
            return null;
          }

          params.orderNo = this.dataInfo.orderNo;
          params.orderNum = this.materialParams.orderNum;
          params.orderGrade = this.materialParams.orderGrade;
          params.commonTags = this.$refs.addTag.getData(3).join(',');
          params.materials = JSON.stringify(this.materialList);
          params.linings = JSON.stringify(this.liningList);
          params.accessory = JSON.stringify(this.accessoryList);
        }

        // 录入量体数据参数
        if (this.dataInfo.orderTache === 7 || this.dataInfo.orderTache === 23 || this.dataInfo.orderTache === 24 || this.dataInfo.orderTache === 28) {
          let data = _.clone(this.dataInfo)
            , customerLabel = {};

          customerLabel.tightness = this.toBinary(data._tightness);
          customerLabel.chestType = this.toBinary(data._chestType);
          customerLabel.shoulderType = this.toBinary(data._shoulderType);
          customerLabel.posteriorCircumference = this.toBinary(data._posteriorCircumference);
          customerLabel.bodyDescription = this.customerDemand;
          customerLabel = JSON.stringify(_.extend(data.customerLabel, customerLabel));
          params = {
            orderNo: this.dataInfo.orderNo,
            customerId: this.dataInfo.customerId,
            bodyList: JSON.stringify(this.$refs.customerBodySize.getData()),
            bodyFront: this.$refs.photoFront.getData(),
            bodyLateral: this.$refs.photoSide.getData(),
            bodyRear: this.$refs.photoBack.getData(),
            customerLabel: customerLabel
          }
        }

        // 设计信息参数
        if (this.dataInfo.orderTache === 8 || this.dataInfo.orderTache === 23 || this.dataInfo.orderTache === 24 || this.dataInfo.orderTache === 28) {
          let jacket, dress;
          jacket = _.clone(this.$refs.jacketSize.getData());
          dress = _.clone(this.$refs.dressSize.getData());

          _.map(jacket, val => {
            dress.push(_.clone(val));
          });
          params = _.extend(params, {
            orderNo: this.dataInfo.orderNo,
            customerId: this.dataInfo.customerId,
            designUrl: this.$refs.designUpload.getData(),
            taskorderNo: this.dataInfo.orderWorkNo,
            designDescription: this.$textToHtml(this.dataInfo.designDescription),
            orderBady: JSON.stringify(dress),
            orderType: this.dataInfo.orderType,
            cadUrlSize: JSON.stringify(this.$refs.cadFile.getData())
          });


        }

        return !_.isEmpty(params) && params;
      },
      saveData(type){ // type：  1、只是保存   2、保存后需要提交
        let params = this.checkSaveStep(), api;

        if (!_.isObject(params)) return false;


        switch (this.dataInfo.orderTache) {
          case 4:
            api = 'saveFabric';
            break;
          case 7:
            api = 'addCustomerBodyData';
            break;
          case 8:
          case 23:
          case 24:
          case 28:
            api = 'updateTaskOrder';
            break;
          default:
            return false;
        }

        this.saveLoading = true;

        return this.ajax.post(`/v3/store/order/${api}`, params).then(() => {
          if (type !== 2) {
            this.$Message.success('保存成功！');
            this.getDataInfo();
            this.saveLoading = false;
          }
          return true;
        }).catch(() => {
          this.saveLoading = false;
        });

      },
      submitData(){
        let save = this.saveData(2), api;

        if (!save.then) return false;

        save.then(data => {
          if (data !== true) return;
          switch (this.dataInfo.orderTache) {
            case 4:
              api = 'commitFabric';
              break;
            case 7:
              api = 'saveCustomerBodyData';
              break;
            case 8:
            case 23:
            case 24:
            case 28:
              api = 'saveTaskOrder';
              break;
            default:
              return false;
          }

          this.ajax.post(`/v3/store/order/${api}`, {
            orderNo: this.dataInfo.orderNo,
            taskorderNo: this.dataInfo.orderWorkNo
          }).then(() => {
            this.$Message.success('提交成功！');
            switch (this.dataInfo.orderTache) {
              case 4:
              case 8:
              case 23:
              case 24:
              case 28:
                this.$router.go(-1);
                break;
              default:
                this.getDataInfo();
                this.saveLoading = false;
            }
          }).catch(() => {
            this.saveLoading = false;
          });
        });

      },
      checkTache(type){
        this.checkBodyTache = false;
        this.checkBodyTache = false;
        switch (type) {
          case 7:
            this.checkBodyTache = true;
            break;
          case 8:
            this.checkDesignTache = true;
            break;
          case 23:
          case 24:
          case 28:
            this.checkBodyTache = true;
            this.checkDesignTache = true;
            break;
        }
      },
      lockStock(){
        this.ajax.post('/v3/store/order/lockInventory', {orderNo: this.dataInfo.orderNo})
          .then(data => {
            this.$Message.success('锁定库存成功！');
            this.getDataInfo();
            this.saveLoading = false;
          })
          .catch(() => {
            this.saveLoading = false;
          });
      },
      toBinary(val, type){
        if (type) {
          let labelDefault = [0, 0, 0], ld;
          if (_.isNumber(val)) { // 数字转换二进制需要补位
            ld = val.toString(2).split('');
            for (let i = 2, n = labelDefault.length - ld.length; i > (2 - ld.length); i--) {
              labelDefault[i] = ld[i - n]
            }
          }
          return labelDefault;
        } else {
          if (_.isArray(val)) {
            return parseInt(val.join(''), 2);
          } else {
            return 0;
          }
        }
      },
      createBtn(render, label, callback){
        return render('Button', {
          props: {
            type: 'text',
            size: 'small'
          },
          on: {
            click: () => {
              callback && callback();
            }
          }
        }, label)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ivu-form-item {
    margin-bottom: 0;
  }

  .customer-photo li {
    display: inline-block;
    margin-right: 20px;
    vertical-align: middle;
  }
</style>
