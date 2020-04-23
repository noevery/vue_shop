<template>
    <el-container>
<!--      头部-->
      <el-header>
        <div>
          <img src="~assets/img/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="clickExit">退出</el-button>
      </el-header>
      <el-container>
<!--        左边侧-->
        <el-aside :width="iselAside" class="elAsideTran">
          <div class="aside">
            <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath">
<!--              一级菜单-->
              <div class="collapse" @click="clickCollapse">|||</div>
              <el-submenu :index="item.id + ''"
                          v-for="item in menusList"
                          :key="item.id">
                <template slot="title">
                  <i :class="iconsObj[item.id]" class="icon_font"></i>
                  <span>{{item.authName}}</span>
                </template>
<!--                二级菜单-->
                <el-menu-item :index="'/' + item2.path"
                              v-for="item2 in item.children"
                              :key="item2.id"
                              mode="horizontal">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{item2.authName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
   // 网络请求
   import {getMenus} from "network/getHome";

   export default {
    name: "Home",
    data(){
      return {
        menusList: [],
        iconsObj: {
          125: 'iconfont icon-usersComps',
          103: 'iconfont icon-tijikongjian',
          101: 'iconfont icon-shangpin',
          102: 'iconfont icon-danju',
          145: 'iconfont icon-baobiao'
        },
        isCollapse: false
      }
    },
     created() {
       this.getMenus();
     },
     computed: {
        iselAside() {
          return this.isCollapse ? '64px' : '200px'
        },
       activePath() {
         const p = this.$route.path.split('/');
         return '/' + p[1];
       }
     },
     methods: {
      // 退出登录
      clickExit() {
        window.sessionStorage.clear();
        this.$router.replace('/login');
        },
       //点击折叠菜单
       clickCollapse() {
         this.
          this.isCollapse = !this.isCollapse;
       },
       //网络请求
       getMenus() {
         getMenus().then(res => {
            const data= res.data;
           if (data.meta.status !== 200) return data.meta.msg;
            this.menusList = data.data;
         })
       }
      },
  }
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      margin: 0;
      background-color: #373d41;
        div {
          display: flex;
          align-items: center;
          > span {
            color: #fff;
           margin-left: 15px;
         }
       }
    }
    .el-container {
      .el-aside {
        background-color: #333744;
         .el-menu {
           width: 100%;
           border-right: 0;
            .collapse {
              width: 100%;
              text-align: center;
              background-color: #475163;
              letter-spacing: 0.3em;
            }
         }
         .icon_font {
           margin-right: 10px;
         }
      }
      .el-main {
        background-color: #eaedf1;
      }
    }
  }
  .elAsideTran {
    transition: width 0.5s;
  }
</style>