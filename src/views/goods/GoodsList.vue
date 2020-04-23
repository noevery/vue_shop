<template>
  <div>
    <elment-break :breakList="breakList" />
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getGoodsList()">
            <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="query"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
<!--      表格-->
      <el-table border stripe :data="goodsList">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="95px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini" />
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="delGoods(scope.row.goods_id)" />
          </template>
        </el-table-column>
      </el-table>
<!--      分页功能-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import ElmentBreak from 'components/content/elBreak/ElmentBreak'

  import { getGoodsList, deleteGoods } from "network/getGoods";

  export default {
    name: "GoodsList",
    components: {
      ElmentBreak
    },
    data() {
      return {
        breakList: ['商品管理', '商品列表'],
        //查询参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        //总条数
        total: null,
        goodsList: []
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      //获取新的码数
      //pageSize 改变时会触发
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      //	currentPage 改变时会触发
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      //关键字查询
      query() {
        this.queryInfo.pagenum = 1;
        this.getGoodsList();
      },
      //删除商品
      async delGoods(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') return this.$message('取消删除')
        this.deleteGoods(id);
        this.getGoodsList();
      },
      //点击添加商品跳转到页面
      goAddPage() {
        this.$router.push('/goods/add');
      },
      //网络请求
      //获取商品列表数据
      async getGoodsList() {
        const { data: res } = await getGoodsList(this.queryInfo);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.goodsList = res.data.goods;
        this.total = res.data.total
      },
      //删除商品
     async deleteGoods(id) {
        const { data: res } = await deleteGoods(id);
       if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
     }
    }
  }
</script>

<style scoped>
  .el-table {
    margin: 10px 0;
  }
  .el-pagination {
    margin-top: 30px;
    text-align: right;
  }
</style>