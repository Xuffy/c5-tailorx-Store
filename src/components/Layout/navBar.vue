<template>
  <div class="nav-bar-box">
    <Breadcrumb separator=">">
      <BreadcrumbItem v-for="(item,index) in navBarList" :key="item.path"
                      :href="index === navBarList.length - 1 ? null : (item.redirect||item.path)">
        {{item.name}}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script>
  export default {
    name: 'NavBar',
    data () {
      return {
        navBarList: null
      }
    },
    created() {
      this.updateBreadcrumb()
    },
    methods: {
      updateBreadcrumb(){
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        if (first && (first.name !== '首页' || first.path !== '')) {
          matched = [{name: '首页', path: '/'}].concat(matched)
        }
        this.navBarList = matched;
      }
    },
    watch: {
      $route(){
        this.updateBreadcrumb()
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../assets/style/base.less';

  .nav-bar-box {
    line-height: 40px;
    background-color: #333333;
    width: 100%;
    height: 40px;
    top: 70px;
    padding-left: 250px;
    position: fixed;
    z-index: 905;
  }

</style>
<style>
  .nav-bar-box .ivu-breadcrumb a {
    color: #9f9f9f;
  }

  .nav-bar-box .ivu-breadcrumb a:hover,
  .nav-bar-box .ivu-breadcrumb > span:last-child {
    color: #ffffff;
    font-weight: 400;
  }

</style>
