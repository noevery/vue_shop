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
                       size="mini" @click="btnEditGoods(scope.row)"/>
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
<!--    编辑商品对话框-->
    <el-dialog
            title="提示"
            :visible.sync="editGoodsDialog"
            width="50%" @close="closeEditGoods">
      <el-form :model="editGoodsForm"
               :rules="editGoodsRules"
               ref="editGoodsRef"
               label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input type="number" v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input type="number" v-model="editGoodsForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input type="number" v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialog = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
  import ElmentBreak from 'components/content/elBreak/ElmentBreak'

  import { getGoodsList, deleteGoods, getEditGoods } from "network/getGoods";

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
        goodsList: [],
        editGoodsForm: {
          goods_name: '',
          goods_price: '',
          goods_number: '',
          goods_weight: '',
        },
        editGoodsDialog: false,
        editId: '',
        editGoodsRules: {
          goods_name: [ { required: true, message: '请输入商品名称', trigger: 'blur' } ],
          goods_price: [ { required: true, message: '请输入商品价格', trigger: 'blur' } ],
          goods_number: [ { required: true, message: '请输入商品数量', trigger: 'blur' } ],
          goods_weight: [ { required: true, message: '请输入商品重量', trigger: 'blur' } ]
        }
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
      //编辑商品
      btnEditGoods(row) {
        this.editGoodsDialog = true;
        this.editId = row.goods_id;
        this.editGoodsForm.goods_name = row.goods_name;
        this.editGoodsForm.goods_price = row.goods_price;
        this.editGoodsForm.goods_number = row.goods_number;
        this.editGoodsForm.goods_weight = row.goods_weight;
      },
      editGoods() {
        this.$refs.editGoodsRef.validate(valid => {
          if (!valid) return ;
          this.getEditGoods(this.editId, this.editGoodsForm);
          this.editGoodsDialog = false
        })
      },
      closeEditGoods() {
        this.$refs.editGoodsRef.resetFields();
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
     },
      async getEditGoods(id, data) {
        const { data: res } = await getEditGoods(id, data);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error('失败！无接口');
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