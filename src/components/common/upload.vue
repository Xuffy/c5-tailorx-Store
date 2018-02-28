<template>
  <div class="tx-order-common-upload">
    <Upload
      v-if="!readonly"
      ref="commonUpload"
      name="files"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :action="uploadParams.action"
      :data="uploadParams.data"
      :headers="uploadParams.headers"
      :show-upload-list="false"
      :on-success="uploadSuccess"
      :on-format-error="() => {this.$alert('请上传图片文件！')}"
      :on-exceeded-size="() => {this.$alert('请上传2MB以内的图片！')}"
      :before-upload="uploadBefore"
      :on-progress="uploadProgress"
      :multiple="maxNum !== 1"
      type="drag"
      style="display: inline-block;position: relative;vertical-align: top;margin-right: 10px"
      :style="{width:width - 2 + 'px'}">
      <div
        :style="{width:width - 2 + 'px','height':height - 2 + 'px','line-height':(height - 2) + 'px'}">
        <Icon type="images" :size="parseInt(width * .3)"></Icon>
      </div>
      <span style="font-size: 14px;position: absolute;bottom: 0;left:0;color: #999;width: 100%;text-align: center">
        {{uploadList.length}} / {{maxNum}}</span>
    </Upload>

    <div class="common-upload-list"
         :style="{width:width + 'px','height':height + 'px','font-size': parseInt((width > height ?  width : height) * .2) + 'px'}"
         v-for="(item,index) in uploadList">
      <template v-if="!item.status || item.status === 'finished'">
        <v-image :src="item.url" :width="width" :height="height"></v-image>
        <div class="common-upload-list-cover" :style="{'line-height':height + 'px'}">
          <span class="icon-box" @click="$refs.previewImage.show(uploadList,'url',index)" :class="{readonly:readonly}">
            <Icon type="ios-eye-outline"></Icon>
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
    <v-preview-image ref="previewImage"></v-preview-image>
  </div>

</template>

<script>
  // 通用上传图片
  import _config from 'service/config'
  import VPreviewImage from 'components/common/previewImage'
  import VImage from 'components/common/image'

  export default {
    name: 'commonUpload',
    props: {
      readonly: { // 只读
        type: Boolean,
        default: false
      },
      dataList: {
        type: [Array, String]
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
        uploadList: [],
        uploadParams: {
          data: {type: 1},
          action: `${_config.ENV.api}/v2/store/file/uploadFiles`,
          headers: {'utouu-open-client-ticket': this.$localStore.get('ticket')}
        }
      }
    },
    mounted() {
      let data = _.clone(this.dataList);
      if (_.isString(data)) {
        data = data ? [this.dataList] : [];
      }

      this.uploadList = _.map(_.compact(data), val => {
        return {url: this.valueKey ? val[this.valueKey] : val};
      });

    },
    watch: {
      dataList(curVal){
        if (_.isString(curVal)) {
          curVal = curVal ? [curVal] : [];
        }
        this.uploadList = _.map(_.compact(curVal), val => {
          return {url: this.valueKey ? val[this.valueKey] : val};
        });
      }
    },
    methods: {
      getData(str){

        let data = _.map(this.uploadList, val => {
          return val.url;
        });

        return data.join(str || ',');
      },
      validate(){
        if (_.isEmpty(this.uploadList)) {
          this.$Message.warning('请上传图片');
          return false;
        }

        if (this.uploadList.length > this.maxNum) {
          this.$Message.warning('图片上传异常，请重新上传！');
          return false;
        }
        return true;
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

      },
      uploadProgress(){
        if (this.maxNum === 1 && this.$refs.commonUpload.fileList.length > 0) {
          this.uploadList = [_.last(this.$refs.commonUpload.fileList)];
        } else {
          _.map(this.$refs.commonUpload.fileList, val => {
            if (this.uploadList.length >= this.maxNum && this.maxNum !== 1) {
              this.$alert(`只能上传${this.maxNum}张图片`);
              return false;
            }
            if (!_.findWhere(this.uploadList, {uid: val.uid})) {
              this.uploadList.push(val);
            }
          });

        }
      },
      uploadSuccess(res, file){
        file.url = res.data[0];
        this.$refs.commonUpload.fileList = _.filter(this.$refs.commonUpload.fileList, val => {
          return val.status !== 'finished';
        });
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
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
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
    position: absolute;
    top: 50%;
    left: 25%;
    line-height: 1;
    cursor: pointer;
    transform: translate(0, -50%);
  }

  .common-upload-list-cover .icon-box:last-child {
    left: 65%;
  }

  .common-upload-list-cover span.readonly {
    width: 100%;
    left: 0;
    text-align: center;
  }
</style>
