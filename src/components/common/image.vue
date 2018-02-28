<template>
  <div class="tx-order-common-image"
       :class="{'no-url':!imgSrc,isRound:round}"
       :style="{width:width === 0 ? '100%' : width + 'px',height:height === 0 ? '100%' : height + 'px','background-color':backColor}">
    <Icon :type="icon" :style="{'font-size': width / 2 + 'px'}" v-if="!isComplete"></Icon>
    <img :src="imgSrc" ref="image" v-show="isComplete">
  </div>
</template>

<script>
  /**
   * 图片通用组件
   * <v-image :src="item.imgUrl" @click.native="" :width="120" :height="180"></v-image>
   */

  export default {
    name: 'commonImage',
    props: {
      src: {
        type: String
      },
      width: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      },
      round: { // 圆形
        type: Boolean,
        default: false
      },
      icon: {
        type: String,
        default: 'image'
      },
      backColor: {
        type: String,
        default: '#F4F4F4'
      },
      fill: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        imgSrc: '',
        isComplete: false
      }
    },
    mounted() {
      this.imgSrc = this.ossFilter(this.src);
    },
    watch: {
      src(val){
        this.imgSrc = this.ossFilter(val);
      }
    },
    methods: {
      getData(str){
      },
      ossFilter(src){
        this.$nextTick(() => {
          this.$refs.image.onload = () => {
            this.isComplete = true;
          }
        });

        if (!src || src.indexOf('tailorx.cn') < 0 || (!this.width && !this.height)) {
          return src;
        }

        src += src.indexOf('?') > -1 ? '&' : '?';

        src.replace('https://', '//');
        src.replace('http://', '//');

        this.isComplete = false;

        return `${src}x-oss-process=image/resize,w_${this.width},h_${this.height}${this.fill ? ',m_fill' : ''}`;
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tx-order-common-image {
    text-align: center;
    position: relative;
    display: inline-block;
  }

  .tx-order-common-image img {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .tx-order-common-image i {
    color: #EAEAEA;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .tx-order-common-image.no-url {
    background: none !important;
  }

  .tx-order-common-image.no-url i {
    color: #F4F4F4;
  }

  .tx-order-common-image.isRound,
  .tx-order-common-image.isRound img {
    border-radius: 50%;
  }
</style>
