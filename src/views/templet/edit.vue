<!--1 添加  2 修改-->
<template>
  <div class="templet-detail tx-container">
    <div class="tx-content">

      <h2 class="tx-title">设计稿</h2>
      <div class="tx-content-box">
        <v-upload ref="designUpload" :data-list="designUploadList" :max-num="20" :width="248"
                  :height="144"></v-upload>

      </div>

      <h2 class="tx-title">设计说明</h2>
      <div class="tx-content-box">
        <Input type="textarea" style="width: 60%" v-model="replaceData.description"
               :autosize="{minRows: 2,maxRows: 5}" placeholder="设计说明"></Input>
      </div>

      <h2 class="tx-title">标签</h2>
      <div class="tx-content-box">
        <v-system-tag v-if="systemTagsList" ref="systemTag" :sex-tag="replaceData.sex" :style-tag="replaceData.style"
                      :season-tag="replaceData.season"></v-system-tag>
        <v-add-tag v-if="commonTagsList" :recommend-list="commonTagsList" ref="addTag"
                   :data-list="replaceData.common"></v-add-tag>
      </div>

      <h2 class="tx-title">版式图</h2>
      <div class="tx-content-box">
        <v-upload-file ref="cadFile" v-if="templateUploadList" :data-list="templateUploadList" :max-num="5"
        ></v-upload-file>
      </div>
      <div style="text-align: center">
        <Button style="width:150px" @click="cancle()">取消</Button>
        <Button type="primary" style="width:150px" @click="saveEdit">保存</Button>
      </div>
    </div>
    <Spin size="large" fix v-if="templetEditLoading"></Spin>
  </div>
</template>
<script>
  import _config from 'service/config'
  import VSystemTag from 'components/order/systemTag';
  import VAddTag from 'components/order/addTag';
  import VUpload from 'components/common/upload';
  import VUploadFile from 'components/common/uploadFile';
  export default {
    name: 'templetEdit',
    components: {
      VSystemTag,
      VAddTag,
      VUpload,
      VUploadFile
    },
    data () {
      return {
        templetEditLoading: false,
        systemTagsList: null,
        commonTagsList: null,
        editId: this.$route.query.id,
        editType: Number(this.$route.query.type),
        existData: null,
        replaceData: {
          six: '',
          style: '',
          season: '',
          common: [],
          description: ''
        },
        designUploadList: [],
        templateUploadList: [],
      }
    },
    mounted () {
      this.getSystemTagList();
      this.getcommonTagList();
      if (this.editType === 2) {
        this.getDataList();
      }
    },
    methods: {
      getSystemTagList () {
        this.templetEditLoading = true,
          this.ajax.get('/v3/store/tag/getSystemTags').then(res => {
            this.systemTagsList = res;
            this.templetEditLoading = false;
          })
      },
      getcommonTagList () {
        this.templetEditLoading = true,
          this.ajax.get('/v3/store/tag/listDefaultCommonTags').then(res => {
            this.commonTagsList = res;
            this.templetEditLoading = false;
          })
      },
      //取消
      cancle() {
        this.$router.go(-1);
      },
      getDataList() {
        this.templetEditLoading = true;
        this.replaceData.common = [];
        this.ajax.post('/v3/store/plateType/getPlateTypeInfo', {id: this.editId}).then(res => {
          this.existData = res;
          _.map(res.tagSystems, val => {
            switch (val.type) {
              case 1:
                this.replaceData.sex = val.id;
                break;
              case 2:
                this.replaceData.style = val.id;
                break;
              case 3:
                this.replaceData.season = val.id;
            }
          })
          this.replaceData.common = res.tagCommons;

          //设计稿
          _.map(res.plateTypePicList, val => {
            val.url && this.designUploadList.push(val.url);
          })
          //版式图
          _.map(res.plateTypeBokes, val => {
            let bokeParam = {};
            bokeParam.name = val.fileName;
            bokeParam.sizeName = val.sizeStr + '码';
            bokeParam.sizeStr = val.sizeStr;
            bokeParam.url = val.url;
            bokeParam.val = val.size;
            this.templateUploadList.push(bokeParam)
          })
          this.templateUploadList = res.plateTypeBokes;
          this.templetEditLoading = false;
        }).catch(() => {
          this.templetEditLoading = false;
        })

      },
      //保存
      saveEdit () {

        if (!this.$refs.systemTag.validate()) return;
        if (!this.$refs.addTag.validate()) return;

        this.templetEditLoading = true;
        let paramdata = {}
          , systemTags = this.$refs.systemTag.getData()
          , commonTags = this.$refs.addTag.getData()
          , designPic = this.$refs.designUpload.getData()
          , commonTagsArr = []
          , boke = this.$refs.cadFile.getData()
          , bokeParam = [];
        _.map(commonTags, val => {
          commonTagsArr.push(val.id);
        });
        _.map(boke, val => {
          let bokePic = {};
          bokePic.size = val.val;
          bokePic.sizeName = val.sizeName;
          bokePic.sizeStr = val.sizeStr;
          bokePic.url = val.url;
          bokePic.fileName = val.name;
          bokeParam.push(bokePic);
        })

        paramdata.picUrls = designPic;
        paramdata.description = this.replaceData.description;
        paramdata.tagSystems = systemTags.sexTagId + ',' + systemTags.styleTagId + ',' + systemTags.seasonTagId;
        paramdata.tagCommons = commonTagsArr.join(',');
        paramdata.boke = JSON.stringify(bokeParam);
        paramdata.type = this.editType;
        paramdata.id = this.editId;


        if (this.editId) {
          this.ajax.post('/v3/store/plateType/updatePlateType', paramdata).then(res => {
            this.$Message.success('编辑成功！');
            this.$router.push({path: '/templet/index'});
            this.templetEditLoading = false;
          }).catch(() => {
            this.templetEditLoading = false;
          })
        } else {
          this.ajax.post('/v3/store/plateType/add', paramdata).then(res => {
            this.$Message.success('添加成功！');
            this.$router.push({path: '/templet/index'})
            this.templetEditLoading = false;
          }).catch(() => {
            this.templetEditLoading = false;
          })
        }
      },
    }
  }
</script>
<style scoped>
  .design-images .ivu-col {
    height: 150px;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .design-images .ivu-col-span-5 {
    width: 240px;
  }

  .design-images .show-box {
    height: 100%;
    width: 100%;
    background-position: center;
    background-size: cover;
    position: relative;
  }

  .design-images .show-box:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    background-color: rgba(0, 0, 0, .7);
  }

  .design-images .show-box i {
    color: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 30px;
    display: none;
    cursor: pointer;
    z-index: 6;
    transform: translate(-50%, -50%);
  }

  .design-images .show-box:hover i,
  .design-images .show-box:hover:before {
    display: block;
  }

</style>
