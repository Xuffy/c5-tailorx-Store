<!--type  添加 1  编辑 2  查看 3-->
<template>
  <div class="new-detail tx-container ">
    <div class="tx-content">
      <h2 class="tx-title">基本信息</h2>
      <div class="tx-content-box" style="max-width:700px">
        <Form :label-width="90">
          <FormItem label="资讯编号：" style="margin-bottom: 10px">{{formAllot.informationNo}}
            <!-- <Input style="width: 200px" v-model="formAllot.newNo" disabled></Input>-->
          </FormItem>
          <FormItem label="名称：" style="margin-bottom: 10px">
            <span v-if="newType === 3">{{formAllot.name}}</span>
            <span v-else>
              <Input style="width: 200px" v-model="formAllot.name"></Input>
            </span>

          </FormItem>
        </Form>
        <v-allot-designer v-if="selectDesigner" ref="newDetailDesigner" :readonly="newType == 3"
                          :designer="selectDesigner"></v-allot-designer>
        <v-system-tag ref="systemTag"
                      :readonly="newType == 3"
                      :sex-tag="newType == 3 ? formAllot.firstCategoryId.tagName : formAllot.firstCategoryId.id"
                      :style-tag="newType == 3 ? formAllot.secondCategoryId.tagName : formAllot.secondCategoryId.id"
                      :season-tag="newType == 3 ? formAllot.thirdCategoryId.tagName : formAllot.thirdCategoryId.id"></v-system-tag>

        <v-add-tag ref="addTag" :readonly="newType == 3" :data-list="newTagItem.information.commonList"></v-add-tag>
      </div>

      <!--封面设置-->
      <h2 class="tx-title">封面设置</h2>
      <div class="tx-content-box">
        <v-upload ref="coverImage" :width="170" :height="120" :readonly="newType == 3"
                  :data-list="newTagItem.information.coverUrl"></v-upload>
      </div>

      <h2 class="tx-title">图文设置</h2>
      <div class="tx-content-box">
        <Button type="ghost" @click="editImageText()" :class="[newType === 3 ? 'removeType':'']">添加</Button>
        <div style="margin-top: 20px;">
          <Card class="card-box" v-for="(item,index) in imageTextList" :key="index"
                :class="[newType === 3 ? 'heightType':'originalType']">
            <div class="content-top">
              <v-image :src="item.infoPic" @click.native="$refs.previewImage.show(item.infoPic)"
                       :width="310"
                       :height="190"></v-image>
              <!--<img :src="item.infoPic"/>-->
              <ul>
                <li style="line-height: 20px"><span>文字描述：</span>&nbsp;{{item.description}}</li>
              </ul>
            </div>
            <ul class="content-bottom" :class="[newType === 3 ? 'removeType':'']">
              <li style="width: 49%">
                <Button type="text" style="font-size: 16px;" @click="editImageText(item,index)"
                        :disabled="newType == 3">编辑
                </Button>
              </li>
              <li style="width: 49%">
                <Button type="text" style="font-size: 16px;" @click="deleteImageText(item,index)"
                        :disabled="newType == 3">
                  删除
                </Button>
              </li>
            </ul>
          </Card>
        </div>
      </div>
      <div style="text-align: center">
        <Button type="primary" @click="newDetaiComeBack()" style="width: 150px;">返回</Button>
        <Button type="primary" @click="newDetailSave()" style="width: 150px;" :class="[newType === 3 ? 'removeType':'']"
                :loading="ImageTextEditloading">保存
        </Button>
      </div>
      <Spin size="large" fix v-if="detailDataLoading"></Spin>
    </div>
    <!--图文设置弹框-->
    <Modal
      title="编辑图文设置"
      v-model="imageTextEdit">
      <div>
        <Form :label-width="90">
          <FormItem label="上传图片：">
            <v-upload ref="uploadImageText" :width="170" :height="90"
                      :data-list="imageTextData.infoPic"></v-upload>
          </FormItem>
          <FormItem label="文字描述：">
            <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入文字描述..."
                   v-model="imageTextData.description"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="submitImageTextEdit()" :loading="ImageTextPoploading">保存</Button>
      </div>
    </Modal>
    <v-preview-image ref="previewImage"></v-preview-image>
  </div>
</template>
<script>
  import VAllotDesigner from 'components/order/allotDesigner';
  import VSystemTag from 'components/order/systemTag';
  import VAddTag from 'components/order/addTag';
  import VUpload from 'components/common/upload';
  import VImage from 'components/common/image'
  import VPreviewImage from 'components/common/previewImage'


  export default {
    name: 'newIndex',
    components: {
      VSystemTag,
      VAddTag,
      VAllotDesigner,
      VUpload,
      VImage,
      VPreviewImage
    },
    data() {
      return {
        newId: this.$route.query.newsId,
        newType: Number(this.$route.query.type),
        newTagItem: {
          information: {
            commonList: [],
            coverUrl: '',
          },
        },
        detailDataLoading: false,
        //接口获取系统、普通标签、设计师
        systemTagsList: null,
        commonTagsList: null,
        selectDesigner: null,
        formAllot: {
          informationNo: '',
          name: '',
          firstCategoryId: '',
          secondCategoryId: '',
          thirdCategoryId: '',
        },
        imageTextList: [],
        imageTextEdit: false, //图文设置弹框
        imageTextData: {},
        ImageTextEditloading: false,
        ImageTextPoploading: false,
      }
    },
    mounted() {
//      this.detailDataLoading = true;
//      this.getsystemTage();
      this.getCcommonTage();
      switch (this.newType) {
        case 1:
          this.selectDesigner = {};
          break;
        case 2:
          this.getnewDetail();
          break;
        case 3:
          this.getnewDetail();
          break;
      }
    },
    methods: {
      /*getsystemTage() {
        this.ajax.post('/v3/store/tag/getSystemTags').then(res => {
          this.systemTagsList = res;
          this.detailDataLoading = false;
        })
      },*/
      getCcommonTage() {
        this.ajax.post('/v3/store/tag/listDefaultCommonTags').then(res => {
          this.commonTagsList = res
        })
      },
      getnewDetail() {
        this.detailDataLoading = true;
        let _this = this;
        this.orderTagItem = {};
        this.ajax.post('v2/store/news/updateNewsPage', {newsId: this.newId}).then(res => {
          //所有标签
          _this.newTagItem = res;
          //默认系统标签
          _this.formAllot.informationNo = res.information.informationNo;
          _this.formAllot.name = res.information.name;
          _this.imageTextList = res.information.desList;
          _.map(res.information.systemList, val => {
            switch (val.type) {
              case 1:
                _this.formAllot.firstCategoryId = val;
                break;
              case 2:
                _this.formAllot.secondCategoryId = val;
                break;
              case 3:
                _this.formAllot.thirdCategoryId = val;
            }
          });
          _this.selectDesigner = {
            name: res.information.designerName,
            photo: res.information.designerPhoto,
            id: res.information.designerId
          };
          this.detailDataLoading = false;

        }).catch(() => {
          this.detailDataLoading = false;
        })
      },
      //editImageText
      editImageText(item, index) {
        this.imageTextData = {};
        this.imageTextEdit = true;
        this.imageTextData.infoPic = [];
        if (item) {
          this.imageTextData = _.clone(item);
          this.imageTextData.index = index;
        }
      },
      //弹框提交
      submitImageTextEdit() {
        if (!this.$refs.uploadImageText.validate()) {
          this.$Message.warning('请上传图片!');
          return false;
        }
        this.ImageTextPoploading = true;
        this.imageTextData.infoPic = this.$refs.uploadImageText.getData();

        this.ImageTextPoploading = false;
        this.imageTextEdit = false;

        // 判断是否为添加
        if (!this.imageTextData.id && _.isUndefined(this.imageTextData.index)) {
          return this.imageTextList.push(this.imageTextData);
        }

        // 判断是否编辑
        if (!_.isUndefined(this.imageTextData.index)) {
          this.imageTextList[this.imageTextData.index] = this.imageTextData;
        }

      },
      //图文列表删除
      deleteImageText(item, index) {
        this.imageTextList = _.filter(this.imageTextList, (val, ind) => {
          return ind !== index;
        });
      },
      //保存
      newDetailSave() {
        if (_.isEmpty(this.formAllot.name)) {
          this.$Message.warning('请填写名称！');
          return
        }
        if (!this.$refs.newDetailDesigner.validate()) return;
        if (!this.$refs.systemTag.validate()) return;
        if (!this.$refs.addTag.validate()) return;

        let _this = this
          , commonTags = this.$refs.addTag.getData()
          , designerDetail = this.$refs.newDetailDesigner.getData()
          , systemTags = this.$refs.systemTag.getData()
          , coverUrl = this.$refs.coverImage.getData()
          , newDetailParams = {}
          , newDetailParamsStr = ''
          , descriptionsList = [];

        this.ImageTextEditloading = true;
        newDetailParams.pic = {infoPic: coverUrl, isFirst: 1, width: 1024, height: 768};
        _this.formAllot.designerId = designerDetail.id;
        _this.formAllot.commonTags = commonTags;
        _this.formAllot.systemTags = [systemTags.sexTagId, systemTags.styleTagId, systemTags.seasonTagId];

        _.map(this.imageTextList, val => {
          delete val.id;
          descriptionsList.push(val);
        })
        newDetailParams.descriptions = descriptionsList;
        newDetailParams.information = _.clone(this.formAllot);
        newDetailParams.banner = {};

        delete newDetailParams.information.firstCategoryId;
        delete newDetailParams.information.secondCategoryId;
        delete newDetailParams.information.thirdCategoryId;


        newDetailParamsStr = JSON.stringify(newDetailParams);
        if (this.newType === 2) {
          return this.ajax.post(`/v2/store/news/updateNews?newsId=${this.newId}`, {newsInfo: newDetailParamsStr})
            .then(res => {
              this.$Message.success('编辑成功！');
              this.$router.push({path: '/new/index'});
              this.ImageTextEditloading = false;
            }).catch(err => {
              this.ImageTextEditloading = false;
            })
        } else if (this.newType === 1) {
          return this.ajax.post('/v2/store/news/addNews', {newsInfo: newDetailParamsStr}).then(res => {
            this.$Message.success('添加成功！');
            this.$router.push({path: '/new/index'});
            this.ImageTextEditloading = false;
          }).catch(err => {
            this.ImageTextEditloading = false;
          })
        }

      },
      newDetaiComeBack(){
        this.$router.go(-1)
      }
    }
  }
</script>
<style type="text/css" scoped>

  .iconEdit {
    position: absolute;
    font-size: 14px;
    top: -10px;
    right: 10px;
  }

  .new-detail .card-box {
    width: 350px;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 12px;
    overflow: hidden;
  }

  .card-box .content-top img {
    width: 100%;
    height: 270px;
    display: inline-block;
    vertical-align: middle;
  }

  .card-box .content-top {
    height: 180px;
  }

  .card-box .content-top ul {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    margin-left: 10px;
  }

  .card-box .content-top ul li {
    font-size: 12px;
    position: relative;
    padding-left: 65px;
    line-height: 26px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }

  .card-box .content-top ul li span {
    position: absolute;
    left: 0;
    top: 0;
    width: 60px;
    text-align: right;
  }

  .card-box .content-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #EAE5E5;
  }

  .card-box .content-bottom li {
    display: inline-block;
    font-size: 18px;
    cursor: pointer;
    width: 32%;
    text-align: center;
    line-height: 60px;
    color: #495060;
  }

  .card-box .content-bottom li:hover {
    color: #57a3f3
  }

  .removeType {
    display: none;
  }

  .heightType {
    height: 330px;
  }

  .originalType {
    height: 360px;
  }
</style>
