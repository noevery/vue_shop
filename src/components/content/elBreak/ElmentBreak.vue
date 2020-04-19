<template>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breakList"
                          :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>

</template>

<script>
  export default {
    name: "ElmentBreak",
    props: {
      breakList: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }
</style>