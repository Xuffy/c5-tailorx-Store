<template>
  <div class="tx-order-preview-image">
    <div class="image-carousel" v-if="imageModal" @click="imageModal = false">
      <div class="carousel-box" @click.stop="imageModal = true">
        <Carousel loop :dots="dataList.length === 1 ? 'none' : 'outside'" :value="index"
                  :arrow="dataList.length === 1 ? 'never' : 'hover'">
          <CarouselItem v-for="(item,index) in dataList" :key="index">
            <div class="image-box">
              <img style="max-width: 800px;" :style="{'max-height':windowHeight * .9 + 'px'}"
                   :src="valueKey ? item[valueKey] : item">
            </div>
          </CarouselItem>
        </Carousel>
      </div>
    </div>
  </div>

</template>

<script>
  // 查看大图组件
  export default {
    name: 'previewImage',
    props: {
//      dataList: Array,         // 数据集合
//      valueKey: String,        // value字段key
    },
    data () {
      return {
        dataList: [],
        valueKey: null,
        index: 0,
        imageModal: false,
        windowHeight: window.innerHeight
      }
    },
    created() {
    },
    methods: {
      show(data, key, index){
        if (!_.isArray(data) && !_.isString(data)) {
          throw Error('v-preview-image params error');
        }
        if (_.isString(data)) {
          data = [data];
        }

        if (_.isString(key)) {
          this.valueKey = key;
        } else if (_.isNumber(key)) {
          this.index = key;
        }

        if(_.isNumber(index)){
          this.index = index;
        }


        this.dataList = data;
        this.imageModal = true;
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tx-order-preview-image .image-carousel {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    text-align: center;
    background-color: rgba(0, 0, 0, .7);
  }

  .tx-order-preview-image .carousel-box {
    max-width: 800px;
    width: 800px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<style>
  .tx-order-preview-image .ivu-carousel-track {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
