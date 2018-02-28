<template>
  <div class="tx-order-customer-photo">

    <v-image v-if="!imageSrc.name || imageSrc.status === 'finished'" :src="imageSrc.url" :width="315" :height="250"
             icon="camera"
             @click.native="$refs.previewImage.show(imageSrc.url)"></v-image>
    <div class="bottom-content" v-if="readonly">
      <span v-text="label"></span>
    </div>
    <Upload v-else :action="uploadParams.action"
            ref="uploadPhoto"
            :format="['jpg','jpeg','png']"
            :headers="uploadParams.headers"
            :data="uploadParams.data"
            name="files"
            :show-upload-list="false"
            :on-format-error="() => {this.$alert('请上传照片！')}"
            :on-success="(res, file) => {file.url = res.data[0]}"
            :on-progress="uploadProgress">
      <div class="bottom-content">
        <Icon type="upload"></Icon>
        <span v-text="label"></span>
        <div v-if="imageSrc.name && imageSrc.status !== 'finished'" class="progress" :style="{width:imageSrc.percentage + '%'}"></div>
        <!--<div v-if="uploadPhoto && uploadPhoto.status !== 'finished'" class="progress" :style="{width:uploadPhoto.percentage + '%'}">{{uploadPhoto.percentage}}</div>-->
      </div>
    </Upload>

    <!--图片显示-->
    <v-preview-image ref="previewImage"></v-preview-image>
  </div>

</template>

<script>
  // 客户上传照片组件
  import _config from 'service/config'
  import VPreviewImage from 'components/common/previewImage'
  import VImage from 'components/common/image'

  export default {
    name: 'customerPhoto',
    components: {VImage,VPreviewImage},
    props: {
      label: String,
      src: String,
//      value: Object,
//      valueKey: String,        // value字段key
      readonly: {
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        imageSrc: {url: this.src},
        uploadPhoto: {},
        uploadParams: {
          data: {type: 1},
          action: `${_config.ENV.api}/v2/store/file/uploadFiles`,
          headers: {'utouu-open-client-ticket': this.$localStore.get('ticket')}
        }
      }
    },
    mounted() {
    },
    methods: {
      getData(){
        return this.imageSrc.url;
      },
      validate(){
        if (_.isEmpty(this.value)) {
          this.$alert(`请上传${this.label}照片`);
          return false;
        }
        return true;
      },
      uploadProgress(){
        this.$refs.uploadPhoto.fileList = [_.last(this.$refs.uploadPhoto.fileList)];
        this.imageSrc = this.$refs.uploadPhoto.fileList[0];
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tx-order-customer-photo {
    height: 250px;
    width: 315px;
    /*background-size: cover;*/
    /*background-position: center;*/
    position: relative;
  }

  .tx-order-customer-photo .bottom-content {
    position: absolute;
    width: 100%;
    text-align: center;
    font-weight: bold;
    bottom: 0;
    line-height: 50px;
    color: #ffffff;
    cursor: pointer;
    background-color: rgba(0, 0, 0, .5);
  }

  .tx-order-customer-photo .bottom-content i {
    font-size: 30px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .tx-order-customer-photo .bottom-content span {
    vertical-align: middle;
    font-size: 20px;
    font-weight: 100;
  }

  .tx-order-customer-photo .progress {
    width: 0;
    height: 50px;
    position: absolute;
    bottom: 0;
    background-color: #000000;
    opacity: .7;
  }
</style>
