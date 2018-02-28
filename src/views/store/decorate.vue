<template>
  <div id="store-decorate" class="tx-container">
    <div class="tx-content">

      <h2 class="tx-title">门店封面图</h2>
      <div class="tx-content-box">
        <p style="color: #42aef4;margin-bottom: 10px">示例图</p>
          <v-image :src="pics.coverUrl"
                   :width="400"
                   :height="252"
                   ></v-image>
        <p style="color: #42aef4;margin-top: 20px;margin-bottom: 10px">上传封面图</p>
        <v-upload ref="coverImage" :width="240" :height="180" :data-list="picsData.coverImage"
                  ></v-upload>
      </div>

      <h2 class="tx-title">门店头图</h2>
      <div class="tx-content-box">
        <p style="color: #42aef4;margin-bottom: 10px">示例图</p>
        <v-image :src="pics.banner"
                 :width="400"
                 :height="252"
        ></v-image>
        <p style="color: #42aef4;margin-top: 20px;margin-bottom: 10px">上传头图</p>
        <p style="color:#ccc;font-size: 12px;margin-bottom: 10px">注：建议图片尺寸比例为3:4，限制为JPG PNG BMP格式</p>
        <v-upload ref="picHeader"  :max-num="20" :width="240"
                  :height="180" :data-list="picsData.images"></v-upload>
      </div>
      <Button type="primary" @click="saveDec()">保存</Button>
    </div>

  </div>
</template>

<script>
import VImage from 'components/common/image'
import VUpload from 'components/common/upload'

  export default {
  components:{
    VImage,
    VUpload
  },
  data(){
    return{
        pics:{
          coverUrl:require('@/assets/images/store_cover.png'),
          banner:require('@/assets/images/store_banner.png')
        },
        picsData:{}
    }
  },
    created(){
        this.getPics();
    },
    methods:{
      getPics(){
        this.ajax.post('/v2/store/myStore/findStoreDecorate').then(
          res=>{
            this.picsData = res;
          }
        )
      },
      saveDec(){
        if(!this.$refs.coverImage.validate()){
//          this.$Message.warning('请上传封面图！');
          return false;
        }
        if(!this.$refs.picHeader.validate()){
//          this.$Message.warning('请上传头图！');
          return false;
        }
        let cover = this.$refs.coverImage.getData()
          ,img = this.$refs.picHeader.getData().replace(/,/g,';')

        this.ajax.post('/v2/store/myStore/addStoreDecorate',{coverImage:cover,images:img}).then(res =>{
        });
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

</style>
