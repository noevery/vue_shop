<template>
  <el-card class="box-card">
    <el-table
            :data="rightsList"
            border
            style="width: 100%"
            stripe>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路劲" prop="path"></el-table-column>
      <el-table-column label="权限等级">
        <template v-slot="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  export default {
    name: "RightsCard",
    props: {
      rightsList: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }
</style>