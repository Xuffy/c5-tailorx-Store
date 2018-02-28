<template>
  <div class="login">
    <div class="login-top"></div>
    <section id="login-app" class="login-box">
      <div style="text-align: center;">
        <i class="logo"></i>
        <span class="title">TailorX Store</span>
      </div>
      <div class="login-form">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="username">
            <Input type="text" v-model="formInline.username" placeholder="您的手机号或用户名">
            <Icon type="iphone" slot="prepend" style="font-size: 26px"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" placeholder="密码">
            <Icon type="ios-locked-outline" slot="prepend" style="font-size: 20px"></Icon>
            </Input>
          </FormItem>
          <FormItem style="padding-left: 40px;margin-top: 40px">
            <Button type="success" size="large" :loading="loginLoading" @click="handleSubmit('formInline')"
                    style="background-color: #f36;width: 100%;border-color: #f36">登录
            </Button>
          </FormItem>
        </Form>
      </div>
    </section>
  </div>
</template>

<script>
  import config from  'service/config';

  export default {
    name: 'login',
    data() {
      return {
        loginLoading: false,
        formInline: {
          username: '',
          password: ''
        },
        ruleInline: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'change'},
            {type: 'string', min: 3, message: '密码长度不能小于3位', trigger: 'change'}
          ]
        }
      }
    },
    created() {
      this.onKeyDown();

      this.$localStore.clearAll();
      this.$sessionStore.clearAll();
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.submitLogin();
          } else {
            this.$Message.warning('请输入正确的用户名密码！');
          }
        })
      },
      onKeyDown() {
        document.onkeydown = event => {
          let e = event || window.event;
          if (e && e.keyCode === 13) {
            this.handleSubmit('formInline');
          }
        };
      },
      submitLogin(){
        this.loginLoading = true;
        this.ajax.post('/v2/store/user/loginUser',
          {username: this.formInline.username, password: this.formInline.password},
          {noAuth: true})
          .then(data => {
            data.user.storeName = data.storeName;
            this.$localStore.set('ticket', data.ticket);
            this.$localStore.set('user', data.user);
            this.$localStore.set('version', config.VERSION);
            this.$Message.success('登录成功');
            let timeout = setTimeout(() => {
              clearTimeout(timeout);
              this.$Message.destroy();
              this.$router.push('/');
            }, 1000);
          })
          .catch(() => {
            this.loginLoading = false;
          });
      }
    }
  }
</script>
<style>
  .login .ivu-input-group-prepend {
    background-color: #ffffff;
    border: none;
    width: 40px;
    text-align: left;
  }

  .login .ivu-form-item-content {
    line-height: 40px;
    height: 40px;
  }

  .login .ivu-input {
    height: 40px;
    border: none;
    padding: 0;
    border-radius: 0;
    font-size: 14px;
    margin-bottom: 15px;
    border-bottom: 1px solid #e6e6e6;
  }

  .login .ivu-input:focus {
    border: none;
    box-shadow: none;
    border-bottom: 1px solid #e6e6e6;
  }

  .login .ivu-input:hover {
    border-color: none;
    border-bottom: 1px solid #e6e6e6;
  }

  .login .ivu-form-item-error-tip {
    left: 40px;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-top {
    position: absolute;
    width: 100%;
    height: 398px;
    background-image: url("../../assets/images/login-back.jpg");
    background-position: center;
    background-size: cover;
    z-index: -1;
  }

  .login-box {
    max-width: 500px;
    width: 500px;
    height: 380px;
    background-color: #fff;
    position: fixed;
    top: 45%;
    left: 50%;
    margin-top: -190px;
    margin-left: -250px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
  }

  .login-box .logo {
    display: inline-block;
    background-image: url("../../assets/images/logo.png");
    width: 70px;
    height: 70px;
    vertical-align: middle;
    margin: 30px 20px 20px 0;
    background-size: 100% 100%;
  }

  .login-box .title {
    display: inline-block;
    vertical-align: middle;
    font-size: 30px;
  }

  .login-form {
    padding-left: 45px;
    padding-right: 45px;
    margin-top: 10px;
    width: 100%;
    box-sizing: border-box;
  }

  /*

    .login-form .form-item {
      position: relative;
      width: 100%;
      height: 40px;
    }

    .login-form .placeholder {
      position: absolute;
      z-index: 2;
      color: #b3b3b3;
      left: 10%;
      bottom: 7px;
      font-size: 16px;
      transition: transform ease 0.3s, color ease 0.3s;
    }

    .login-form .form-label {
      width: auto;
      position: absolute;
      left: 0;
      top: 0;
      line-height: 50px;
    }

    .login-form .form-label i {
      font-size: 26px;
    }

    .login-form .input-inline {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding-left: 10%;
      position: relative;
    }

    .login-form .form-item .input-inline .line {
      width: 100%;
      position: absolute;
      bottom: 0;
      z-index: 2;
      left: 0;
      padding-left: 10%;
      box-sizing: border-box;
    }

    .login-form .form-item .input-inline .line:before {
      content: '';
      display: block;
      height: 3px;
      width: 0;
      background-color: #f36;
      transition: width .6s;
    }

    .login-form .input {
      width: 369px;
      height: 40px;
      border: 0;
      border-radius: 0;
      padding-left: 0;
      border-bottom: 1px solid #e6e6e6;

    }

    .login-form .form-item.active .input-inline .line:before {
      width: 100%;
    }

    .login-form .form-item.exist .placeholder {
      transform: translateY(-120%) translateX(-10%) scale(.82);
    }

    .login-form .form-item.active .placeholder {
      transform: translateY(-120%) translateX(-10%) scale(.82);
      color: #ff3366;
    }

    .login-form .form-item.active .form-label i {
      color: #ff3366;
    }
  */

</style>
