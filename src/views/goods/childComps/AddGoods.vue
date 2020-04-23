<template>
  <div>
    <elment-break :breakList="breakList" />
<!--    卡片视图-->
    <el-card>
<!--      提示区域-->
      <el-alert
              title="消息提示的文案"
              type="info"
              :closable="false">
      </el-alert>
        <!--      步骤区域-->
        <el-steps :space="200"
                  :active="actvieIndex - 0"
                  finish-status="success"
                  align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      <!--      表单包裹-->
      <el-form :model="addForm"
               :rules="addRules"
               ref="addFormRef"
               label-width="100px"
               label-position="top">
        <!--      标签页-->
        <el-tabs :tab-position="'left'"
                  v-model="actvieIndex"
                 :before-leave="beforeTabsLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                      v-model="addForm.goods_cat"
                      :options="cateList"
                      :props="Cateprops"
                      @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name"
                          v-for="item in manyTabData"
                          :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item2, index) in item.attr_vals"
                             :label="item2"
                             :key="index"
                             border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabData">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                    :action="upLoadURL"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture"
                    :headers="headerObj" :on-success="upLoadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <el-form-item>
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button type="primary" class="add-btn" @click="btnAddGoods">添加商品</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
<!--    预览图片的对话框-->
    <el-dialog
            title="提示"
            :visible.sync="picDialog"
            width="50%">
      <img :src="picUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>

  import ElmentBreak from 'components/content/elBreak/ElmentBreak'

  import { getCate, getCateParams, addGoods } from "network/getGoods";

  export default {
    name: "AddGoods",
    components: {
      ElmentBreak
    },
    data() {
      return {
        breakList: ['商品管理', '添加商品'],
        actvieIndex: '0',
        //表单绑定的数据
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          //商品所属的分类数组
          goods_cat: [],
          //图片临时地址
          pics: [],
          //商品描述
          goods_introduce: '',
          attrs: []
        },
        //表单验证规则
        addRules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
          ],
          goods_cat: [
            { required: true, message: '请输入商品分类', trigger: 'blur' },
          ]
        },
        //商品分类列表
        cateList: [],
      //  级联选择器绑定的数据
        Cateprops: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        //商品参数
        manyTabData: [],
        //商品属性
        onlyTabData: [],
        //图片上传地址
        upLoadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
        //图片上传的请求头
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        //图片上传的路径
        picUrl: '',
        //图片预览对话框的显示/隐藏
        picDialog: false
      }
    },
    created() {
      this.getCate()
    },
    computed: {
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null;
      }
    },
    methods: {
      //级联选择器选中触发事件
      handleChange() {
        if (this.addForm.goods_cat.length !== 3) return this.addForm.goods_cat = []
      },
      //标签页的事件：切换标签之前的钩子
      beforeTabsLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择分类')
          return false;
        }
        if (activeName === '1' && this.manyTabData.length === 0) {
          this.getCateParams(this.cateId, 'many');
        }else if (activeName === '2' && this.onlyTabData.length === 0) {
          this.getCateParams(this.cateId, 'only');
        }
      },
      //处理图片预览时的效果
      handlePreview(file) {
        this.picUrl = file.response.data.url;
        this.picDialog = true;
      },
      //处理图片移除时的效果
      handleRemove(file) {
        const path = file.response.data.tmp_path;
        let index = this.addForm.pics.findIndex(item => item.pic === path)
        this.addForm.pics.splice(index, 1);
        console.log(this.addForm);
      },
      //文件上传成功的钩子
      upLoadSuccess(response) {
        const picInfo = {
          'pic': response.data.tmp_path
        };
        this.addForm.pics.push(picInfo);
      },
      //添加商品
      btnAddGoods() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$message.error('必要的表单项未完成填写');
          this.addForm.goods_cat = this.addForm.goods_cat.join(',');
          this.manyTabData.forEach(item => {
            const attr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            };
            this.addForm.attrs.push(attr)
          });
          this.onlyTabData.forEach(item => {
            const attr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.addForm.attrs.push(attr)
          });
          console.log(this.addForm);
          this.addGoods(this.addForm);
          this.$router.replace('/goods')
        })
      },
      //网络请求
      //获取商品分类
      async getCate() {
        const { data: res } = await getCate();
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.cateList = res.data;
      },
      //获取商品参数
      async getCateParams(id, sel) {
        const { data: res} = await getCateParams(id, sel);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        if (sel === 'many') {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTabData = res.data;
        }else {
          this.onlyTabData = res.data;
        }
      },
      //添加商品
      async addGoods(data) {
        const { data: res } = await addGoods(data);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.$message.success('添加商品成功');
      }
    }
  }
</script>

<style>
  .el-steps {
    margin: 20px 0;
  }
  .el-step__title {
    font-size: 14px;
  }
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
   .ql-editor {
     min-height: 300px;
   }
  .add-btn {
    margin: 15px 0;
  }
</style>