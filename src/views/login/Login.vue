<template>
  <div id="login">
    <div class="login_resgin">
      <div class="login_logo">
        <img src="@/assets/img/login.jpg" alt="">
      </div>
      <el-form  label-width="0px"
                class="el_form"
                :model="loginForm"
                :rules="loginRules"
                ref="loginRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user"
                    v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima"
                    v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <div class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  // 网络请求
  import {getLogin} from "network/getLogin";

  export default {
    name: "Login",
    data() {
      return {
        // 数据绑定
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        //验证规则
        loginRules: {
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 重置表单
      reset() {
        this.$refs.loginRef.resetFields();
        this.loginForm.username = '';
        this.loginForm.password = '';
      },
      login() {
        // 验证全部表单填写格式是否正确
        this.$refs.loginRef.validate(valid => {
          if(!valid) return false;
          getLogin(this.loginForm.username, this.loginForm.password).then(res => {
            const data = res.data;
            if(data.meta.status !== 200) return this.$message(data.meta.msg);
            this.$message(data.meta.msg);
          //  存储token
            sessionStorage.setItem('token', data.data.token)
            this.$router.push('/home');
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  #login {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #2b4b6b;
      .login_resgin {
        position: relative;
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 5px;
        .login_logo {
          height: 130px;
          width: 130px;
          border: 1px solid #eee;
          border-radius: 50%;
          padding: 15px;
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          /*background-color: #fff;*/
          box-shadow: 0 0 10px #ddd;
           img {
             width: 100%;
             height: 100%;
             border-radius: 50%;
             background-color: #eee;
           }
        }
         .el_form {
           position: absolute;
           top: 90px;
           width: 100%;
           padding: 20px;
           box-sizing: border-box;
           .btns {
             display: flex;
             justify-content: flex-end;
           }
         }
      }
  }
</style>