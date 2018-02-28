<template>
  <div class="tx-order-common-upload-file">
    <ul style="margin-bottom: 10px" v-if="!readonly">
      <li>
        选择尺码：
        <CheckboxGroup v-model="selectSize" style="display: inline-block">
          <Checkbox v-for="item in sizeList" :key="item.size" :label="item.val" :disabled="isUploading"
                    style="margin-right: 20px">{{item.size}}
          </Checkbox>
        </CheckboxGroup>
      </li>
    </ul>

    <Upload
      v-if="!readonly"
      ref="commonUploadFile"
      name="files"
      :max-size="51200"
      :action="uploadParams.action"
      :data="uploadParams.data"
      :headers="uploadParams.headers"
      :show-upload-list="false"
      :on-success="uploadSuccess"
      :before-upload="uploadBefore"
      :on-progress="uploadProgress"
      :on-exceeded-size="() => {this.$alert('请上传50MB以内的文件！')}"
      :multiple="maxNum !== 1"
      type="drag" style="width: 250px;display: inline-block;vertical-align: top;margin-right: 10px;margin-bottom: 10px">
      <div style="padding: 20px 0">
        <Icon type="ios-folder" :size="parseInt(width * .3)" style="font-size: 60px"></Icon>
        <p style="margin-top: 20px;font-size: 16px">{{uploadList.length}} / {{maxNum}}</p>
      </div>
    </Upload>

    <div class="common-upload-list"
         v-for="(item,index) in uploadList">
      <template v-if="!item.status || item.status === 'finished'">
        <p class="format-text" v-if="item.name" v-text="item.name.split('.')[1].toUpperCase()"></p>
        <h3 class="size-text" v-text="item.sizeStr"></h3>
        <p class="name-text" v-text="item.name"></p>
        <!--<v-image :src="item.url" :width="width" :height="height"></v-image>-->
        <div class="common-upload-list-cover" :style="{'line-height':height + 'px'}">
          <span class="icon-box" @click="downloadFile(item.url)" :class="{readonly:readonly}">
            <Icon type="android-download"></Icon>
          </span>
          <span class="icon-box" @click="uploadDelete(item)">
            <Icon type="ios-trash-outline" v-if="!readonly"></Icon>
          </span>
        </div>
      </template>
      <div :style="{'line-height':height + 'px'}" v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </div>
    </div>


    <!--图片显示-->
    <!--<v-preview-image ref="previewImage"></v-preview-image>-->
  </div>

</template>

<script>
  // 通用上传图片
  import _config from 'service/config'
  import VPreviewImage from 'components/common/previewImage'
  import VImage from 'components/common/image'

  export default {
    name: 'commonUploadFile',
    props: {
      readonly: { // 只读
        type: Boolean,
        default: false
      },
      dataList: {
        type: Array,
        default: []
      },
      valueKey: String,
      maxNum: {
        type: Number,
        default: 1
      },
      width: {
        type: Number,
        default: 80
      },
      height: {
        type: Number,
        default: 80
      }
    },
    components: {
      VImage,
      VPreviewImage
    },
    data () {
      return {
        isUploading: false,
        selectSize: [],
        sizeList: [
          {val: 10, size: 'XXS'},
          {val: 20, size: 'XS'},
          {val: 30, size: 'S'},
          {val: 40, size: 'M'},
          {val: 50, size: 'L'},
          {val: 60, size: 'XL'},
          {val: 70, size: 'XXL'},
          {val: 80, size: 'XXXL'},
          {val: 90, size: '均码'}
        ],
        uploadList: [],
        uploadParams: {
          data: {type: 1, orderNo: this.$route.query.id},
          action: `${_config.ENV.api}/v2/store/file/uploadFilesUrl`,
          headers: {'utouu-open-client-ticket': this.$localStore.get('ticket')}
        }
      }
    },
    mounted() {
      this.uploadList = this.dataList;
    },
    watch: {
      dataList(curVal, oldVal){
        this.uploadList = curVal;
//        console.log(curVal, oldVal, '+++++++')
      }
    },
    methods: {
      getData(){
        let data = [];
        _.map(this.uploadList, val => {
          data.push({
            val: val.val,
            sizeName: val.sizeName,
            sizeStr: val.sizeStr,
            url: val.url,
            name: val.name
          });
        });

        return data;
      },
      validate(){
        /*if (_.isEmpty(this.uploadList)) {
         this.$Message.warning('请上传图片');
         return false;
         }

         if (this.uploadList.length > this.maxNum) {
         this.$Message.warning('图片上传异常，请重新上传！');
         return false;
         }
         return true;*/
      },
      uploadDelete(item){
        this.uploadList = _.filter(this.uploadList, val => {
          return val.url !== item.url;
        });
      },
      uploadBefore(){
        if (this.uploadList.length >= this.maxNum && this.maxNum !== 1) {
          this.$alert(`只能上传${this.maxNum}张图片`);
          return false;
        }
        if (_.isEmpty(this.selectSize)) {
          this.$alert('请选择尺码！');
          return false;
        }
        this.isUploading = true;
      },
      uploadProgress(){
        _.map(this.$refs.commonUploadFile.fileList, val => {
          if (this.uploadList.length >= this.maxNum && this.maxNum !== 1) {
            this.$alert(`只能上传${this.maxNum}个文件`);
            return false;
          }
          if (!_.findWhere(this.uploadList, {uid: val.uid})) {
            this.uploadList.push(val);
          }
        });
      },
      uploadSuccess(){
        this.isUploading = false;
        this.uploadList = _.map(this.uploadList, val => {
          let item, sizeStr = [];
          if (val.response) {
            item = val.response.data[0];
            val.url = item.fileName;
            val.name = item.description;
            val.val = this.selectSize.join(',');
            _.map(this.sizeList, val => {
              _.indexOf(this.selectSize, val.val) !== -1 && sizeStr.push(val.size);
            })
            val.sizeName = sizeStr.join('/') + '码：';
            val.sizeStr = sizeStr.join('/');
          }
          return val;
        });

        this.$refs.commonUploadFile.fileList = _.filter(this.$refs.commonUploadFile.fileList, val => {
          return val.status !== 'finished';
        });
      },
      downloadFile(src){
        window.open(src);
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .common-upload-list {
    display: inline-block;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background-color: rgb(244, 244, 244);
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .4);
    margin-right: 10px;
    margin-bottom: 10px;
    width: 250px;
    height: 144px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .common-upload-list img {
    width: 100%;
    height: 100%;
  }

  .common-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .common-upload-list:hover .common-upload-list-cover {
    display: block;
  }

  .common-upload-list-cover .icon-box {
    color: #fff;
    cursor: pointer;
    position: absolute;
    width: 60%;
    top: 50%;
    left: 0;
    font-size: 40px;
    transform: translate(0, -50%);
  }

  .common-upload-list-cover .icon-box:last-child {
    left: 40%;
  }

  .common-upload-list-cover span.readonly {
    width: 100%;
    left: 0;
  }

  .format-text {
    font-size: 50px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #FFF;
    color: #eaeaea;
  }
</style>
