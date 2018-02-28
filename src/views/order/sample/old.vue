<template>
  <div>
    <iframe ref="iframe-store" class="tx-nesting" :src="url"></iframe>
  </div>
</template>

<script>
  import env_config from 'service/config'

  export default {
    name: 'picture',
    data () {
      return {
        url: ''
      }
    },
    mounted(){
      this.url = `${env_config.ENV.path}/modules/order/sampleOrder.html`;
      this.$refs['iframe-store'].style.height = `${window.innerHeight - 120}px`
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

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
