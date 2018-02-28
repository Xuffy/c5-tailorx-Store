<template>
  <div class="tx-container order-edit">
    <div class="tx-content">

      <!--基本信息-->
      <h2 class="tx-title">基本信息</h2>
      <div class="tx-content-box" v-if="jacketList.length">
        <Form :label-width="90">
          <FormItem label="定制数量：">
            <ul class="size-list" :class="{edit:checkTache && checkMaterialTache}">
              <template v-for="item in customizedList">
                <li v-if="checkTache && checkMaterialTache">
                  <Input type="text" size="small" v-model="item.val" :number="true">
                  <span slot="prepend">{{item.str}}</span>
                  <span slot="append">件</span>
                  </Input>
                </li>
                <li v-else-if="item.val">
                  <Tag type="border">
                    {{item.str}}：{{item.val}}件
                  </Tag>
                </li>
              </template>
            </ul>
          </FormItem>
          <FormItem label="订单等级：">
            D级
          </FormItem>
          <FormItem label="订单价格：" v-if="orderParams.price">
            ¥{{orderParams.price}}
          </FormItem>
          <FormItem label="定制品类：" v-if="orderParams._systemTag">
            {{orderParams._systemTag}}
          </FormItem>
        </Form>
        <v-add-tag ref="addTag" :data-list="orderParams.tagsCommon"
                   :readonly="!checkTache || !checkMaterialTache"></v-add-tag>
      </div>

      <!--面辅料信息-->
      <h2 class="tx-title">面辅料信息</h2>
      <div class="tx-content-box">
        <Button icon="android-add" @click="showModal('面料',true)" v-if="checkMaterialTache">面料</Button>
        <h3 v-else class="tx-title">面料</h3>
        <Table border :columns="materialTitle" :data="materialList"
               style="margin-top: 20px;margin-bottom: 20px"></Table>

        <Button icon="android-add" @click="showModal('里料',true)" v-if="checkMaterialTache">里料</Button>
        <h3 v-else class="tx-title">里料</h3>
        <Table border :columns="materialTitle" :data="liningList" style="margin-top: 20px;margin-bottom: 20px"></Table>

        <Button icon="android-add" @click="showModal('辅料',true)" v-if="checkMaterialTache">辅料</Button>
        <h3 v-else class="tx-title">辅料</h3>
        <Table border :columns="materialTitle" :data="accessoryList"
               style="margin-top: 20px;margin-bottom: 20px"></Table>
      </div>

      <!--客户信息-->
      <h2 class="tx-title">客户信息</h2>
      <div class="tx-content-box">
        <h3 class="tx-title">客户量体数据</h3>
        <v-size-table ref="customerBodySize" :data-list="customerBodySize" style="max-width: 500px"
                      :column="2"
                      :readonly="!checkTache"
                      label-key="labelName"
                      value-key="size"></v-size-table>

      </div>

      <!--设计信息-->
      <h2 class="tx-title">设计信息</h2>
      <div class="tx-content-box">
        <ul>
          <li style="width: 500px;display: inline-block">
            <h3 class="tx-title">上衣尺寸表</h3>
            <v-size-table :data-list="jacketList" label-key="name" value-key="designerSize" style="max-width: 90%"
                          :column="2"
                          ref="jacketSize"
                          :readonly="!checkTache"></v-size-table>
          </li>
          <li style="width: 500px;display: inline-block">
            <h3 class="tx-title">下衣/裙装尺寸表</h3>
            <v-size-table :data-list="dressList" label-key="name" value-key="designerSize" style="max-width: 90%"
                          :column="2"
                          ref="dressSize"
                          :readonly="!checkTache"></v-size-table>
          </li>
        </ul>
        <br>
        <h3 class="tx-title">设计稿及设计说明</h3>
        <v-upload ref="designUpload" :data-list="orderParams._designUrl" :max-num="20" :width="248"
                  :readonly="!checkTache"
                  :height="144"></v-upload>
        <br>
        <h3 class="tx-title">版式图</h3>
        <v-upload-file ref="cadFile" :data-list="orderParams._cadFiles" :max-num="5"
                       :readonly="!checkTache"></v-upload-file>
        <h3 class="tx-title">设计师要求</h3>
        <Input v-if="checkTache" v-model="orderParams.designDescription" type="textarea" :rows="4"
               placeholder="填写客户需求"></Input>
        <h4 v-else v-html="$textToHtml(orderParams.designDescription)"></h4>
      </div>

      <!--操作按钮-->
      <Row style="margin-top: 30px">
        <Col span="3">
        <Button type="ghost" style="width: 80%" @click="$router.go(-1)">返回</Button>
        </Col>
        <template v-if="checkTache">
          <Col span="3">
          <Button type="primary" style="width: 80%" @click="saveData()" :loading="saveLoading">保存</Button>
          </Col>
          <Col span="3">
          <Button type="success" style="width: 80%"
                  @click="$Modal.confirm({title: '提交确认',content: '是否确认提交？',onOk: submitData})"
                  :loading="saveLoading">提交
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
  import VSystemTag from 'components/order/systemTag'
  import VAddMaterial from 'components/order/addMaterial'
  import VSizeTable from 'components/order/sizeTable'
  import VAddTag from 'components/order/addTag'
  import VUpload from 'components/common/upload'
  import VImage from 'components/common/image'
  import VUploadFile from 'components/common/uploadFile'
  import CustomerBody from 'lib/customerBodySize'

  export default {
    name: 'edit',
    components: {VAddTag, VSizeTable, VAddMaterial, VUpload, VUploadFile, VSystemTag, VImage},
    data () {
      return {
        materialModal: {
          show: false,
          type: '面料', // 面料 里料 辅料
          isAdd: true
        },
        customizedList: [
          {size: 1, str: 'XXS', val: ''},
          {size: 2, str: 'XS', val: ''},
          {size: 3, str: 'S', val: ''},
          {size: 4, str: 'M', val: ''},
          {size: 5, str: 'L', val: ''},
          {size: 6, str: 'XL', val: ''},
          {size: 7, str: 'XXL', val: ''},
          {size: 8, str: 'XXXL', val: ''},
          {size: 0, str: '均码', val: ''}
        ],
        materialList: [],
        liningList: [],
        accessoryList: [],
        materialItem: {},
        dataLoading: false,
        saveLoading: false,
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
        customerBodySize: CustomerBody,
        checkMaterialTache: false,
        checkTache: false,
        orderParams: {
          price: 0,
          designDescription: '',
          tagsCommon: [],
          _cadFiles: [],
          _designUrl: []
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
                this.showModal(params.row._type, false);
              }));

              btns.push(this.createBtn(h, '删除', () => {
                this.deleteMaterial(params.row._type, params.index);
              }));

              return h('div', btns);
            }
          },
        ]
      }
    },
    mounted(){
      if (this.$route.query.sid) {
        this.getDataInfo();
      } else {
        this.$sessionStore.remove('cache_router_param')
        this.checkTache = true;
        this.checkMaterialTache = true;

        this.jacketList = _.filter(this.designSizeData.jacket, val => {
          return !val.old || val.designerSize ? true : false;
        });

        this.dressList = _.filter(this.designSizeData.dress, val => {
          return !val.old || val.designerSize ? true : false;
        });
      }
    },
    methods: {
      getDataInfo(){
        this.dataLoading = true;
        this.orderParams = this.$options.data().orderParams;
        this.ajax.post('/v3/store/sampleOrder/edit', {id: this.orderParams.id || this.$route.query.sid})
          .then(data => {
            this.checkTache = false;
            this.checkMaterialTache = false;
            switch (data.tacheId) {
              case 7:
              case 8:
                this.checkMaterialTache = true;
              case 23:
              case 24:
              case 28:
                this.checkTache = true;
                break;
            }
            /*基本信息********************************************************************************/
            data._systemTag = _.pluck(_.indexBy(data.tagsSystem, 'type'), 'tagName').join(' - ');
            data._sexTag = _.findWhere(data.tagsSystem, {type: 1}) || {};
            data._styleTag = _.findWhere(data.tagsSystem, {type: 2}) || {};
            data._seasonTag = _.findWhere(data.tagsSystem, {type: 3}) || {};

            this.customizedList = _.map(this.customizedList, val => {
              let item = _.findWhere(data.sampleSizeCount, {size: val.size});
              if (item) {
                val.val = item.count;
              }
              return val;
            });

            /*面辅料信息********************************************************************************/
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


            /*客户信息********************************************************************************/
            if (!this.checkTache || !this.checkMaterialTache) {
              this.materialTitle = _.initial(this.materialTitle);
            }
            this.customerBodySize = data.customerBody ? JSON.parse(data.customerBody) : [];

            /*设计信息********************************************************************************/
            let ob = JSON.parse(data.designBody);
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

            data._cadFiles = data.cadUrlSize ? JSON.parse(data.cadUrlSize) : [];
            data._designUrl = data.designUrl ? data.designUrl.split(',') : [];
            data.designDescription = this.$htmlToText(data.designDescription);


            this.orderParams = _.extend(this.orderParams, data);

            this.dataLoading = false;
          });
      },
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
              this.materialList = _.map(this.materialList, val => {
                return val.barCode === item.barCode ? item : val;
              });
              break;
            case '里料':
              this.liningList = _.map(this.liningList, val => {
                return val.barCode === item.barCode ? item : val;
              });
              break;
            case '辅料':
              this.accessoryList = _.map(this.accessoryList, val => {
                return val.barCode === item.barCode ? item : val;
              });
              break;
          }
        }
        this.materialModal.show = false;
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
      saveData(type){ // type：  1、只是保存   2、保存后需要提交
        let params = {}
          , sizeCount = []
          , jacket, dress;

        _.map(this.customizedList, val => {
          val.val && sizeCount.push({size: val.size, count: val.val});
        });

        if (_.isEmpty(sizeCount)) {
          return this.$Message.warning('请输入定制数量！');
        }

        if (_.isEmpty(this.materialList)) {
          this.$Message.warning('请选择面料！');
          return null;
        }

        jacket = _.clone(this.$refs.jacketSize.getData());
        dress = _.clone(this.$refs.dressSize.getData());
        _.map(jacket, val => {
          dress.push(_.clone(val));
        });

        params.sizeCount = JSON.stringify(sizeCount);
        params.commonTags = this.$refs.addTag.getData(3).join(',');
        params.materials = JSON.stringify(this.materialList);
        params.linings = JSON.stringify(this.liningList);
        params.accessory = JSON.stringify(this.accessoryList);
        params.customerBody = JSON.stringify(this.$refs.customerBodySize.getData());
        params.designBody = JSON.stringify(dress);
        params.designUrl = this.$refs.designUpload.getData();
        params.cadUrlSize = JSON.stringify(this.$refs.cadFile.getData());
        params.designDescription = this.$textToHtml(this.orderParams.designDescription);
        params.id = this.orderParams.id || this.$route.query.sid || '';

        this.saveLoading = true;


        return this.ajax.post(`/v3/store/sampleOrder/addOrUpdate`, params).then(data => {
          if (type !== 2) {
            this.$Message.success('保存成功！');
            if (!this.$route.query.sid && data) {
              return this.$router.push({path: '/order/sample/detail', query: {id: data.sampleId, type: 1}});
            }
            this.getDataInfo();
            this.saveLoading = false;
          }
          return data;
        }).catch(() => {
          this.saveLoading = false;
        });

      },
      submitData(){
        let save = this.saveData(2);

        if (!save.then) return false;

        save.then(data => {
          let id = this.orderParams.id || data.sampleId;
          this.ajax.post('/v3/store/sampleOrder/commit', {id: id})
            .then(() => {
              this.$Message.success('提交成功！');
              this.$router.push({path: '/order/sample/detail', query: {id: id, type: 1}});
            }).catch(() => {
            this.saveLoading = false;
          });
        });

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
<style>
  .order-edit .size-list .ivu-input-small {
    border-radius: 0;
  }
</style>
<style scoped>
  .order-edit .size-list.edit {
    padding-top: 3px;
  }

  .order-edit .size-list.edit li {
    width: 120px;
  }

  .order-edit .size-list li {
    display: inline-block;
    margin-right: 10px;
  }

  .ivu-form-item {
    margin-bottom: 0;
  }
</style>
