<template>
  <div class="header-box">
    <Row class-name="header">
      <Col span="12">
      <img class="c5-icon logo" src="../../assets/images/logo.png" @click="$router.push('/')">
      <h2 class="c5-icon title" @click="$router.push('/')">Tailorx 商家端管理系统</h2>
      </Col>
      <Col span="12" style="text-align: right;padding-right: 20px">
      <Dropdown trigger="click">
        <a href="javascript:void(0)">
          {{userType}}：{{username || '管理员'}}
          <!--<Icon type="ios-arrow-down"></Icon>-->
        </a>
        <!--<DropdownMenu slot="list">
          <DropdownItem>用户信息</DropdownItem>
          <DropdownItem>修改密码</DropdownItem>
        </DropdownMenu>-->
      </Dropdown>
      <Dropdown trigger="click">
        <a href="javascript:void(0)" @click="logout">
          退出
          <Icon type="log-out"></Icon>
        </a>
      </Dropdown>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: 'header',
    data () {
      return {
        username: 'User Name',
        userType: ['店长', '设计师', '管理员']
      }
    },
    created() {
      let user = this.$localStore.get('user');
      if (!_.isEmpty(user)) {
        this.username = user.nickName;
        this.userType = this.userType[user.userType - 1];
      }
    },
    methods: {
      logout(){
        this.$Modal.confirm({
          title: '系统提示',
          content: '是否确认退出登录',
          onOk: () => {
            this.$localStore.clearAll();
            this.$localStore.clearAll();
            this.$router.push('/login');
          }
        });
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../assets/style/base.less';

  .header-box {
    height: 70px;
    position: fixed;
    width: 100%;
    z-index: 910;
  }

  .header {
    height: 100%;
    line-height: 70px;
    background-color: @header-back;
  }

  .logo {
    width: 50px;
    margin-left: 20px;
    margin-right: 20px;
    cursor: pointer;
  }

  .title {
    font-size: 24px;
    color: #ffffff;
    font-weight: 400;
    cursor: pointer;
  }

  .ivu-dropdown-rel a {
    color: #ffffff;
    font-size: 14px;
  }

  .ivu-dropdown {
    margin-left: 30px;
  }

  .ivu-dropdown-menu {
    text-align: left;
  }
</style>
