<template>
  <div class="store-picture tx-container">
    <div class="tx-form-search" style="padding-bottom: 0">
      <Form :label-width="65" inline>
        <FormItem label="设计师">
          <Input v-model="searchForm.designerTerm" placeholder="输入设计师名称"></Input>
        </FormItem>
        <FormItem label="关键字">
          <Input v-model="searchForm.searchKey" placeholder="请输入关键字搜索"></Input>
        </FormItem>
        <FormItem :label="(searchForm.status === 1 ? '分配' : '发布') + '时间'">
          <Row>
            <Col span="11">
            <DatePicker type="date" v-model="searchForm.startTime" placeholder="开始时间"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">
            -</Col>
            <Col span="11">
            <DatePicker type="date" v-model="searchForm.endTime" placeholder="截至时间"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <br>
        <FormItem>
          <Button type="primary" @click="getDataList()">查询</Button>
          <Button type="ghost" style="margin-left: 8px" @click="formReset">重置</Button>
        </FormItem>
      </Form>
    </div>

    <div class="tx-content">
      <Tabs @on-click="changeTab">
        <TabPane label="未发布" name="1" style="padding: 5px">
          <Card class="card-box" v-for="item in noData.data" :key="item.id">
            <div class="content-top">
              <v-image :src="item.imgUrl" @click.native="$refs.previewImage.show(item.imgUrl)"
                       style="vertical-align: middle"
                       :width="120"
                       :height="180"></v-image>
              <ul>
                <li><span>设计师：</span>&nbsp;{{item.designerName}}</li>
                <li style="line-height: 20px"><span>描述：</span>&nbsp;{{item.description}}</li>
                <li><span>标签：</span>
                  <Tag v-for="tagItem in stringSplit(item.tagsName)" :key="tagItem">{{tagItem}}
                  </Tag>
                </li>
                <li><span>分配时间：</span>&nbsp;{{item.assignTimeString}}</li>
              </ul>
            </div>
            <ul class="content-bottom">
              <li @click="showEditModal(item)">编辑</li>
              <li @click="publishPicture(item)">发布</li>
              <li @click="deletePicture(item)">删除</li>
            </ul>
          </Card>

          <div style="text-align: right;width: 100%;margin-top: 30px">
            <Page :total="noData.totalSize" :page-size="searchForm.pageLength" show-total
                  :current="(noData.page || 0) + 1"
                  show-elevator placement="top"
                  @on-change="getDataList"
                  @on-page-size-change="changePageSize"></Page>
          </div>
        </TabPane>
        <TabPane label="已发布" name="2">
          <Card class="card-box" v-for="item in yesData.data" :key="item.id">
            <div class="content-top">
              <v-image :src="item.imgUrl" @click.native="$refs.previewImage.show(item.imgUrl)"
                       style="vertical-align: middle"
                       :width="120"
                       :height="180"></v-image>
              <ul>
                <li><span>设计师：</span>&nbsp;{{item.designerName}}</li>
                <li style="line-height: 20px"><span>描述：</span>&nbsp;{{item.description}}</li>
                <li><span>标签：</span>
                  <Tag v-for="tagItem in stringSplit(item.tagsName)" :key="tagItem">{{tagItem}}
                  </Tag>
                </li>
                <li><span>发布时间：</span>&nbsp;{{item.publishTimeString}}</li>
              </ul>
            </div>
            <ul class="content-bottom">
              <li style="width: 49%" @click="revokePicture(item)">下架</li>
              <li style="width: 49%" @click="deletePicture(item)">删除</li>
            </ul>
          </Card>

          <div style="text-align: right;width: 100%;margin-top: 30px">
            <Page :total="yesData.totalSize" :page-size="searchForm.pageLength" show-total
                  :current="(yesData.page || 0) + 1"
                  show-elevator
                  placement="top"
                  @on-change="getDataList"
                  @on-page-size-change="changePageSize"></Page>
          </div>
        </TabPane>
      </Tabs>

      <Spin size="large" fix v-if="noDataLoading"></Spin>
      <Spin size="large" fix v-if="yesDataLoading"></Spin>
    </div>

    <!--查看大图-->
    <v-preview-image ref="previewImage"></v-preview-image>


    <Modal
      title="编辑图片"
      v-model="modelEdit"
      :width="720"
      class="model-allot"
      :styles="{top: '50px'}"
      :mask-closable="false">
      <div v-if="editDetail.systemTags && editDetail.pictureInfo && editDetail.commonTags">
        <Form :label-width="90">
          <FormItem label="款式图片：" style="margin-bottom: 10px">
            <v-upload ref="uploadImage" :width="70" :height="90"
                      :data-list="editDetail.pictureInfo.imgUrl"></v-upload>
          </FormItem>
          <FormItem label="设计师：" style="margin-bottom: 10px">
            {{editDetail.pictureInfo.designerName}}
          </FormItem>
          <FormItem label="描述：" style="margin-bottom: 10px">
            <Input v-model="editDetail.pictureInfo.description" type="textarea" :rows="4" placeholder="请输入图片描述"></Input>
          </FormItem>
        </Form>

        <v-system-tag ref="systemTag"
                      :sex-tag="editDetail.sex.id"
                      :style-tag="editDetail.style.id"
                      :season-tag="editDetail.season.id"></v-system-tag>

        <v-add-tag ref="addTag" :data-list="editDetail.pictureInfo.tagsCommon"></v-add-tag>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="modelEdit = false">取消</Button>
        <Button type="primary" @click="submitEdit()" :loading="editSaveLoading">保存</Button>
        <Button type="success" @click="publishPicture()" :loading="publishLoading">发布</Button>
      </div>

      <Spin size="large" fix v-if="!editDetail.systemTags"></Spin>
    </Modal>
  </div>

</template>

<script>
  import VSystemTag from 'components/order/systemTag'
  import VAddTag from 'components/order/addTag'
  import VPreviewImage from 'components/common/previewImage'
  import VUpload from 'components/common/upload'
  import VImage from 'components/common/image'

  export default {
    name: 'picture',
    components: {
      VSystemTag,
      VAddTag,
      VPreviewImage,
      VUpload,
      VImage
    },
    data () {
      return {
        editDetail: {},
        editSaveLoading: false,
        publishLoading: false,
        modelEdit: false,
        noData: {},
        noDataLoading: false,
        yesData: {},
        yesDataLoading: false,
        yesForm: {},
        noForm: {},
        searchForm: {
          designerTerm: '',
          searchKey: '',
          startTime: '',
          endTime: '',
          status: 1,
          page: 0,
          pageLength: 9,
        }
      }
    },
    mounted(){
      this.noForm = _.clone(this.searchForm);
      this.yesForm = _.clone(this.searchForm);
      this.yesForm.status = 2;
      this.getDataList();
    },
    watch: {
      searchForm: {
        handler(val){
          if (val.status === 1) {
            this.noForm = val;
          } else {
            this.yesForm = val;
          }
        },
        deep: true
      }
    },
    methods: {
      getDataList(page){
        if (_.isNumber(page)) {
          this.searchForm.page = page - 1;
        }

        if (this.searchForm.status === 1) {
          this.noDataLoading = true;
        } else {
          this.yesDataLoading = true;
        }
        this.ajax.post('/v3/store/picture/findPictures', this.searchForm)
          .then(data => {
            (!data.data || !data.data.length) && this.$Message.warning('没有查询到相应数据！');

            if (this.searchForm.status === 1) {
              this.noData = data;
            } else {
              this.yesData = data;
            }
            this.noDataLoading = false;
            this.yesDataLoading = false;
          })
          .catch(() => {
            this.noDataLoading = false;
            this.yesDataLoading = false;
          });
      },
      showEditModal(item){
        this.modelEdit = true;
        this.editDetail = {};
        this.ajax.post('/v3/store/picture/editPicture', {pictureId: item.id})
          .then(data => {
            data.sex = _.findWhere(data.pictureInfo.tagsSystem, {type: 1}) || {};
            data.style = _.findWhere(data.pictureInfo.tagsSystem, {type: 2}) || {};
            data.season = _.findWhere(data.pictureInfo.tagsSystem, {type: 3}) || {};
            data.pictureInfo.tagsCommon = data.pictureInfo.tagsCommon || [];
            this.editDetail = data;
          });
      },
      submitEdit(type){
        let systemTags, addTags, uploadImage, params = {};

        if (!this.editDetail.pictureInfo.description) {
          this.$Message.warning('请填写描述！');
          return false;
        }
        if (this.$refs.uploadImage.validate() === false)  return false;
        if (this.$refs.systemTag.validate() === false)  return false;
        if (this.$refs.addTag.validate() === false) return false;


        uploadImage = this.$refs.uploadImage.getData();
        systemTags = this.$refs.systemTag.getData();
        addTags = this.$refs.addTag.getData();

        params.pictureId = this.editDetail.pictureInfo.id;
        params.picUrl = uploadImage;
        params.description = this.editDetail.pictureInfo.description;
        params.commonTags = addTags.join('||');
        params = _.extend(params, systemTags);

        this.editSaveLoading = true;
        return this.ajax.post('/v3/store/picture/savePicture', params).then(data => {
          if (type)return data; // 是否为发布时调用
          this.getDataList();
          this.$Message.success('保存成功');
          this.modelEdit = false;
          if (type)return true;
          this.editSaveLoading = false;
          this.publishLoading = false;
        }).catch(() => {
          if (type)return true;
          this.editSaveLoading = false;
          this.publishLoading = false;
        });
      },
      publishPicture(item){
        let submit, submitPublish;

        this.publishLoading = true;

        if (this.modelEdit) {
          submit = this.submitEdit(true);
          if (submit === false) return this.publishLoading = false;
          submit.then(() => {
            submitPublish();
          });
        } else {
          this.$Modal.confirm({
            title: '发布提示',
            content: '是否确定发布？',
            onOk(){
              submitPublish(item.id);
            }
          })
        }

        submitPublish = (id) => {
          this.ajax.post('/v3/store/picture/publishPicture', {pictureId: id || this.editDetail.pictureInfo.id})
            .then(data => {
              this.getDataList();
              this.$Message.success('发布成功');
              this.modelEdit = false;
              this.editSaveLoading = false;
              this.publishLoading = false;
            })
            .catch(() => {
              this.editSaveLoading = false;
              this.publishLoading = false;
            });
        }

      },
      deletePicture(item){
        this.$Modal.confirm({
          title: '删除提示',
          content: '是否确认删除图片？',
          onOk: () => {
            this.ajax.post('/v3/store/picture/deletePicture', {pictureId: item.id})
              .then(data => {
                this.getDataList();
                this.$Message.success('删除成功！');
              });
          }
        })
      },
      revokePicture(item){
        this.$Modal.confirm({
          title: '下架提示',
          content: '是否确认下架图片？',
          onOk: () => {
            this.ajax.post('/v3/store/picture/unShelvePicture', {pictureId: item.id})
              .then(data => {
                this.getDataList();
                this.$Message.success('下架成功！');
              });
          }
        })
      },
      changeTab(val){
        if (val === '1') {
          this.searchForm = this.noForm;
          this.searchForm.status = 1;
        } else {
          this.searchForm = this.yesForm;
          this.searchForm.status = 2;
        }
        this.getDataList();
      },
      changePageSize(len){
        this.searchForm.pageLength = len;
        this.searchForm.page = 0;
        this.getDataList();
      },
      formReset(){
        let status = this.searchForm.status;
        this.searchForm = this.$options.data().searchForm;
        this.searchForm.status = status;
        this.getDataList();
      },
      stringSplit(val){
        return _.isString(val) ? val.split(',') : [];
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .store-picture .card-box {
    width: 460px;
    height: 280px;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 12px;
  }

  .card-box .content-top {
    height: 180px;
  }

  .card-box .content-top ul {
    display: inline-block;
    vertical-align: middle;
    max-width: 290px;
    margin-left: 10px;
  }

  .card-box .content-top ul li {
    font-size: 12px;
    position: relative;
    padding-left: 65px;
    line-height: 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
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
    width: 420px;
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
</style>
