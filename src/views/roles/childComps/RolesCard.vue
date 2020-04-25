<template>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="btnAddRole">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="roleList" border stripe>
<!--       展开列-->
      <el-table-column type="expand">
        <template v-slot="scope">
<!--          一级权限-->
          <el-row v-for="(item1, index) in scope.row.children"
                  :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']">
            <el-col :span="5">
              <el-tag type="primary" closable
                      @close="removeTag(scope.row, item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
<!--              二级权限和三级权限-->
              <el-row v-for="(item2, indey) in item1.children"
                      :key="item2.id"
                      :class="[indey === 0 ? '' : 'bdtop', 'vcenter']">
                <el-col :span="6">
                  <el-tag type="success"
                          closable
                          @close="removeTag(scope.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning"
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          closable
                          @close="removeTag(scope.row, item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
<!--          <pre>-->
<!--            {{scope.row}}-->
<!--          </pre>-->
        </template>
      </el-table-column>
<!--      索引列-->
      <el-table-column type="index" label="序号" />
      <el-table-column label="角色名称" prop="roleName"/>
      <el-table-column label="角色描述" prop="roleDesc"/>
      <el-table-column label="操作" width="300">
        <template v-slot="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="btnEditRole(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleRole(scope.row.id)">删除</el-button>
          <el-button type="warning" size="mini"
                     icon="el-icon-setting"
                     @click="btnSetRightsDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    分配权限对话框-->
    <el-dialog
            title="提示"
            :visible.sync="setRightsDialog"
            width="50%">
<!--      树形数据-->
      <el-tree :data="rightsTree"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="checkKeys" ref="rightsTreeRef"></el-tree>
      <span slot="footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
<!--    添加角色对话框-->
    <el-dialog
            title="添加角色"
            :visible.sync="roleDialog"
            width="50%" @close="closeAddRole">
      <el-form :model="addRoleForm"
               :rules="addRoleRules"
               ref="addRoleRef"
               label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="roleDialog = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
    </el-dialog>
<!--    编辑角色对话框-->
    <el-dialog
            title="添加角色"
            :visible.sync="editRoleDialog"
            width="50%" @close="closeEditRole">
      <el-form :model="editRoleForm"
               :rules="editRoleRules"
               ref="editRoleRef"
               label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialog = false">取 消</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import { deleteRolesRights,
           getRightsList,
           allotRights,
           getAddRole,
           getEditRole,
           getQueryRole,
           delRole } from "network/getRights";
  import { getRightsId } from "common/utls";

  export default {
    name: "RolesCard",
    props: {
      roleList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        //分配权限对话框的显示隐藏
        setRightsDialog: false,
        // 树形绑定的数据
        rightsTree: [],
        // 树形配置选项
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 默认选中的值
        checkKeys: [],
        // 保存当前点击的权限id
        roleId: '',
        //角色对话框的显示和隐藏
        roleDialog: false,
        editRoleDialog: false,
        addRoleForm: {
          roleName: '',
          roleDesc: ''
        },
        editRoleForm: {
          roleName: '',
          roleDesc: ''
        },
        addRoleRules: {
          roleName: [ { required: true, message: '请输入角色名称', trigger: 'blur' } ],
          roleDesc: [ { required: true, message: '请输入角色描述', trigger: 'blur' } ]
        },
        editRoleRules: {
          roleName: [ { required: true, message: '请输入角色名称', trigger: 'blur' } ],
          roleDesc: [ { required: true, message: '请输入角色描述', trigger: 'blur' } ]
        }
      }
    },
    methods: {
      //添加角色
      btnAddRole() {
        this.roleDialog = true;
      },
      //编辑角色
      btnEditRole(row) {
        this.getQueryRole(row.id)
        this.editRoleForm.id = row.id;
        this.editRoleDialog = true;
      },
      closeAddRole() {
        this.$refs.addRoleRef.resetFields();
      },
      closeEditRole() {
        this.$refs.editRoleRef.resetFields();
      },
      addRole() {
        this.$refs.addRoleRef.validate(valid => {
          if (!valid) return ;
          this.getAddRole(this.roleId,
                  this.addRoleForm.roleName,
                  this.addRoleForm.roleDesc);
          this.$parent.getRoleList();
          this.roleDialog = false;
        })
      },
      editRole() {
        this.$refs.editRoleRef.validate(valid => {
          if (!valid) return ;
          console.log(this.editRoleForm);
          this.getEditRole(this.editRoleForm.id,
                  this.editRoleForm.roleName,
                  this.editRoleForm.roleDesc);
          this.$parent.getRoleList();
          this.editRoleDialog = false;
        })
      },
      //删除角色
      async deleRole(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') return this.$message('已取消该操作');
        this.delRole(id);
        setTimeout(() => {
          this.$parent.getRoleList();
        }, 50)
      },
      //网络请求
      //  删除角色指定权限
      async removeTag(roles, rightsId) {
        const confirmResult = await this.$confirm('是否删除此权限?', '删除权限', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (confirmResult !== 'confirm') return ;
         deleteRolesRights(roles.id, rightsId).then(res => {
           console.log(res);
           const data = res.data;
           if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
           this.$message.success(data.meta.msg);
           roles.children = data.data;
         })
      },
      // 分配权限
       async btnSetRightsDialog(role) {
        this.roleId = role.id;
        const { data: res } = await getRightsList('tree');
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        //递归获取所有权限id
         this.checkKeys = [];
         getRightsId(role, this.checkKeys);
         this.setRightsDialog = true;
         this.rightsTree = res.data;
      },
      //角色授权
      async allRights() {
        const idStr = [
          ...this.$refs.rightsTreeRef.getCheckedKeys(),
          ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
        ].join(',');
        const { data: res } = await allotRights(this.roleId, idStr);
        console.log(idStr);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.$parent.getRoleList();
        this.setRightsDialog = false;
      },
      //添加角色
      async getAddRole(roleId, roleName, roleDesc) {
        const { data: res } = await getAddRole(roleId, roleName, roleDesc);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
      },
      //根据ID查询角色
      async getQueryRole(id) {
        const { data: res } = await getQueryRole(id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.editRoleForm.roleName = res.data.roleName;
        this.editRoleForm.roleDesc = res.data.roleDesc;
      },
      //编辑角色
      async getEditRole(id, roleName, roleDesc) {
        const { data: res } = await getEditRole(id, roleName, roleDesc);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success('编辑成功');
      },
      //删除角色
      async delRole(id) {
        const { data: res } = await delRole(id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
      },
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
  .el-table {
    margin: 10px 0;
  }
</style>