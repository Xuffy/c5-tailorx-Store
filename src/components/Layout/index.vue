<template>
  <div class="app-wrapper">
    <v-header></v-header>
    <v-menu></v-menu>
    <nav-bar></nav-bar>
    <div class="main-container">
      <section class="app-main" style="min-height: 100%">
        <transition name="fade" mode="out-in">
          <router-view :key="key"></router-view>
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
  import VHeader from './Header'
  import VMenu from './Menu'
  import NavBar from './navBar'

  export default {
    name: 'layout',
    components: {
      VHeader,
      VMenu,
      NavBar
    },
    data () {
      return {}
    },
    computed: {
      key(){
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date();
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .main-container {
    width: 100%;
    padding-left: 240px;
    padding-top: 70px;
    /*padding-bottom: 50px;*/
  }

  .app-main {
    padding-top: 40px;
  }

</style>
