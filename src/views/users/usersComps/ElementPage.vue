<template>
  <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userQuery.pagenum"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="userQuery.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
  </el-pagination>
</template>

<script>
  export default {
    name: "ElementPage",
    props: {
      userQuery: {
        type: Object,
        default() {
          return {}
        }
      },
      total: {
        type: Number,
        default() {
          return 0
        }
      }
    },
    methods: {
      handleSizeChange(newSize) {
        this.$emit('handleSizeChange', newSize )
      },
      handleCurrentChange(newPage) {
        this.$emit('handleCurrentChange', newPage )
      }
    }
  }
</script>

<style scoped>
  .el-pagination {
    text-align: right;
    margin-top: 30px;
  }
</style>