<template>
  <div class="menu" v-if="routerList.length">
    <Menu theme="dark" :active-name="activeName" :open-names="activeOpen"
          :accordion="true">
      <template v-for="(item,index) in routerList">

        <router-link v-if="item.children.length&&item.noDropdown&&!item.hidden&&checkAuth(item.auth)"
                     :to="item.path+'/'+item.children[0].path">
          <MenuItem :name="index + ''">
            <Icon type="ios-paper"></Icon>
            {{item.name}}
          </MenuItem>
        </router-link>


        <Submenu v-if="!item.noDropdown&&!item.hidden&&checkAuth(item.auth)" :key="index" :name="index + ''">
          <template slot="title">
            <Icon :type="item.icon"></Icon>
            <span v-text="item.name"></span>
          </template>

          <template v-if="item.children.length&&!item.noDropdown&&!item.hidden" v-for="(cItem,cIndex) in item.children">
            <router-link :to="item.path+'/'+cItem.path" v-if="!cItem.hidden&&checkAuth(cItem.auth)">
              <MenuItem :key="cIndex" :name="index +'-'+cIndex">
                {{cItem.name}}
              </MenuItem>
            </router-link>
          </template>
        </Submenu>
      </template>
    </Menu>
  </div>
</template>

<script>
  import {routerMap} from 'service/router'

  export default {
    name: 'header',
    data () {
      return {
        routerList: [],
        activeName: null,
        activeOpen: []
      }
    },
    mounted(){
      routerMap.forEach(value => {
        // 判断路由是否显示
        if (!value.hidden) {
          this.routerList.push(value)
        }
      });

      this.updateMenuActive()
    },
    methods: {
      updateMenuActive(){
        this.activeOpen = [];
        this.activeName = '';
        _.map(this.routerList, (val, index) => {
          if (val.name === this.$route.matched[0].name) {
            this.activeOpen.push(index.toString());
            _.map(val.children, (cVal, cIndex) => {
              if (this.$route.name === cVal.name || this.$route.path === cVal.redirect) {
                this.activeName = `${index}-${cIndex}`;
              }
            });
            if (!this.activeName) {
              _.map(val.children, (cVal, cIndex) => {
                if (this.$route.matched[1].name === cVal.name) {
                  this.activeName = `${index}-${cIndex}`;
                }
              });
            }
          }
        });
      },
      checkAuth(param){
        let user = this.$localStore.get('user');

        if (_.isEmpty(param)) {
          return true;
        }

        return _.indexOf(param, user.userType) !== -1;
      }
    },
    watch: {
      $route(){
        this.updateMenuActive()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/style/base.less";

  .menu {
    position: fixed;
    height: 100%;
    margin-top: 70px;
    top: 0;
    left: 0;
    background-color: @menu-back;
    z-index: 910;
  }

  .ivu-menu-dark {
    background-color: #333333;
  }
</style>
<style>
  .menu .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover,
  .menu .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
    color: #fff;
    background-color: #262626 !important;
  }

  .menu .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background-color: #292929;
    /*background-color: #333333;*/
  }

  .menu .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
    background: #333333;
  }

  .menu .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
  .menu .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    background-color: #1f1f1f !important;
    position: relative;
  }

  .menu .router-link-active li {
    color: #fff !important;
    background-color: #262626 !important;
    border: none !important;
  }
</style>
