<template>
  <div class="tx-container works-edit">
    <div class="tx-content">

      <!--基本设置-->
      <h2 class="tx-title">基本设置</h2>
      <div class="tx-content-box" style="max-width: 600px">
        <Form :label-width="90">
          <FormItem label="作品标题：">
            <Input type="text" v-model="dataInfo.title" placeholder="填写作品标题"></Input>
          </FormItem>
          <FormItem label="价格：">
            <InputNumber v-model="dataInfo.price" :min="0.01"></InputNumber>&nbsp;&nbsp;元
          </FormItem>
          <FormItem label="设计师评价：">
            <Input type="textarea" v-model="dataInfo.designerEvaluate" :rows="4" placeholder="填写设计师评价"></Input>
          </FormItem>
        </Form>

        <v-system-tag ref="systemTag" :sex-tag="systemTag.sex" :style-tag="systemTag.style"
                      :season-tag="systemTag.season"></v-system-tag>
        <v-add-tag v-if="dataInfo.commonTags" ref="addTag" :data-list="dataInfo.commonTags"></v-add-tag>
      </div>

      <!--参考图片-->
      <h2 class="tx-title">参考图片</h2>
      <div class="tx-content-box">
        <v-upload ref="referenceImages" :data-list="dataInfo.referencePictures" :max-num="3" :width="150"
                  :height="150"></v-upload>
      </div>

      <!--面料信息-->
      <h2 class="tx-title">面料信息</h2>
      <div class="tx-content-box">

        <Button icon="android-add" @click="showModal('面料',true)">面料</Button>
        <Table border :columns="materialTitle" :data="materialList"
               style="margin-top: 20px;margin-bottom: 20px"></Table>

        <Button icon="android-add" @click="showModal('里料',true)">里料</Button>
        <Table border :columns="materialTitle" :data="liningList" style="margin-top: 20px;margin-bottom: 20px"></Table>

        <Button icon="android-add" @click="showModal('辅料',true)">辅料</Button>
        <Table border :columns="materialTitle" :data="accessoryList"
               style="margin-top: 20px;margin-bottom: 20px"></Table>
      </div>

      <!--设计稿-->
      <h2 class="tx-title">设计稿</h2>
      <div class="tx-content-box">
        <v-upload ref="designImages" :data-list="dataInfo.designUrl" :max-num="20" :width="240"
                  :height="150"></v-upload>
      </div>

      <!--用户评价-->
      <h2 class="tx-title">用户评价</h2>
      <div class="tx-content-box">
        <Form :label-width="90">
          <FormItem label="评价内容">
            {{dataInfo.feedBack.content}}
          </FormItem>
          <FormItem label="综合评分">
            <Rate disabled allow-half :value="dataInfo.feedBack.overallScore"></Rate>
          </FormItem>
          <FormItem label="设计师评分">
            <Rate disabled allow-half :value="dataInfo.feedBack.designerScore"></Rate>
          </FormItem>
          <FormItem label="工厂评分">
            <Rate disabled allow-half :value="dataInfo.feedBack.factoryScore"></Rate>
          </FormItem>
        </Form>
        <v-upload ref="evaluateImages" :data-list="dataInfo.feedBackPictures" value-key="picture"
                  :max-num="3" :width="100"
                  :height="100"></v-upload>
      </div>

      <!--操作按钮-->
      <Row style="margin-top: 30px">
        <Col span="3">
        <Button type="ghost" style="width: 80%" @click="$router.go(-1)">返回</Button>
        </Col>
        <template>
          <Col span="3">
          <Button type="primary" style="width: 80%" @click="saveData()" :loading="saveLoading">保存</Button>
          </Col>
          <Col span="3">
          <Button type="success" style="width: 80%"
                  @click="$Modal.confirm({title: '发布确认',content: '是否确认发布？',onOk: submitData})"
                  :loading="saveLoading">发布
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
  import VAddTag from 'components/order/addTag'
  import VUpload from 'components/common/upload'
  import VImage from 'components/common/image'

  export default {
    name: 'edit',
    components: {VAddTag, VAddMaterial, VUpload, VSystemTag, VImage},
    data () {
      return {
        dataInfo: {
          title: '',
          price: 0,
          designerEvaluate: '',
          feedBack: {},
          commonTags: [],
          referencePictures: [],
        },
        systemTag: {
          sex: '',
          style: '',
          season: ''
        },
        materialModal: {
          show: false,
          type: '面料', // 面料 里料 辅料
          isAdd: true
        },
        materialList: [],
        liningList: [],
        accessoryList: [],
        materialItem: {},
        dataLoading: false,
        saveLoading: false,
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
      if (this.$route.query.id) {
        this.getDataInfo();
      } else {
        this.$sessionStore.remove('cache_router_param')
      }
    },
    methods: {
      getDataInfo(){
        if (!this.$route.query.id) {
          return;
        }
        this.dataLoading = true;
        this.ajax.post('/v3/store/designerWork/detail', {designerWorkId: this.$route.query.id})
          .then(data => {
            this.systemTag.sex = (_.findWhere(data.systemTags, {type: 1}) || {}).id;
            this.systemTag.style = (_.findWhere(data.systemTags, {type: 2}) || {}).id;
            this.systemTag.season = (_.findWhere(data.systemTags, {type: 3}) || {}).id;

            data.referencePictures = data.referencePictures.split(';');
            data.designUrl = data.designUrl.split(',');

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
            this.dataInfo = _.extend(this.dataInfo, data);
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

        if (!this.$refs.systemTag.validate()) return false;
        if (!this.$refs.addTag.validate()) return false;

        params.workId = this.dataInfo.id;
        params.title = this.dataInfo.title.trim();
        params.designerDescription = this.dataInfo.designerEvaluate.trim();
        params.price = this.dataInfo.price;
        params.commonTags = this.$refs.addTag.getData(3).join('||');
        params.referencePictures = this.$refs.referenceImages.getData(';');
        params.materials = JSON.stringify(this.materialList);
        params.linings = JSON.stringify(this.liningList);
        params.accessory = JSON.stringify(this.accessoryList);
        params.designUrl = this.$refs.designImages.getData(',');
        params.feedBackPictures = this.$refs.evaluateImages.getData(';');
        params = _.extend(params, this.$refs.systemTag.getData());

        this.saveLoading = true;
        return this.ajax.post('/v3/store/designerWork/addOrUpdate', params).then(data => {
          if (type !== 2) {
            this.$Message.success({
              content: '保存成功！',
              onClose: () => {
                this.saveLoading = false;
                if (!this.$route.query.id && data) {
                  return this.$router.push({path: '/works/index'});
                }
              }
            });
            this.$route.query.id && this.getDataInfo();
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
          let id = this.$route.query.id || data;
          this.ajax.post('/v3/store/designerWork/updateStatus', {designerWorkId: id, status: 2})
            .then(() => {
              this.$Message.success('发布成功！');
              this.$router.push({path: '/works/index'});
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
<style scoped>
  .works-edit .size-list.edit {
    padding-top: 3px;
  }

  .works-edit .size-list.edit li {
    width: 120px;
  }

  .works-edit .size-list li {
    display: inline-block;
    margin-right: 10px;
  }

  .ivu-form-item {
    margin-bottom: 10px;
  }
</style>
