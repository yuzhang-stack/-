<template>
  <div class="user">
    <!--    <el-row>-->
    <!--      <el-col :span="24">-->
    <!--        <el-breadcrumb separator="/">-->
    <!--          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
    <!--          <el-breadcrumb-item>用户管理</el-breadcrumb-item>-->
    <!--          <el-breadcrumb-item>用户列表</el-breadcrumb-item>-->
    <!--        </el-breadcrumb>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <el-row>
      <el-col :span="24">
        <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
        <!--        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList"></el-input>-->
<!--        <el-input style="margin-right: 1%;" placeholder="CWID查询" class="search-input" v-model="userListData.userIdentifier"></el-input>-->
        <el-input style="margin-right: 1%;" placeholder="医院名称查询" class="search-input" v-model="userListData.hospitalName"></el-input>
        <!--        <el-button type="primary" slot="append" ></el-button>-->
        <el-button type="primary" @click="ChaxunTap">查询</el-button>
        <el-button type="primary" @click="addDialogFormVisible=true">添加医院</el-button>
      </el-col>
    </el-row>

    <el-table
      class="margin-20"
      v-loading="loading"
      :data="userList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="100"
        label="序号"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="province"
        label="所属省"
        align="center"
        width="400">
      </el-table-column>
      <el-table-column
        prop="city"
        label="所属市"
        align="center"
        width="400">
      </el-table-column>
      <el-table-column
        prop="hospitalName"
        label="医院名称"
        align="center"
        width="400">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="showEditDialog(scope.row,1)">编辑</el-button>
<!--          <el-button size="mini" type="danger" plain @click="showPingDialog(scope.row)">平调</el-button>-->
<!--          <el-button size="mini" type="warning" plain @click="showEditDialog(scope.row,2)">分配角色</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userListData.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>

    <!-- 添加用户对话框:rules="rules" -->
    <el-dialog title="添加医院" :visible.sync="addDialogFormVisible" @close="addDialogFormVisibleTap">
      <el-form :model="addForm" label-width="80px" ref="addUserForm">
        <el-form-item label="医院名称" prop="CWID">
          <el-input v-model="addForm.hospitalName" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item label="所属地区">
          <el-select v-model="provinceName" clearable placeholder="请选择所属省" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in provinceList"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select v-model="cityName" filterable
                     placeholder="请选择所属市" :loading="loading">
            <el-option
              v-for="(item,index) in cityList"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="addDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">保存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>
      <el-form :model="addForm" label-width="80px" ref="addUserForm">
        <el-form-item label="医院名称" prop="CWID">
          <el-input v-model="addForm.hospitalName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属地区">
          <el-select v-model="provinceName" clearable placeholder="请选择所属省" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in provinceList"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select v-model="cityName" filterable
                     placeholder="请选择所属市" :loading="loading">
            <el-option
              v-for="(item,index) in cityList"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="editDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";
  // 节流函数
  const delay = (function () {
    let timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  export default {
    data() {
      return {

        hospitalId: '',//医院ID
        userListData: {
          hospitalName: '',
          currentPage: 1,
          pageSize: 10,
        },
        filters: {
          value1: '',
          value2: ''
        },
        totalCount: 1,// 总数量
        provinceList: [],//省所有
        provinceName: '',//省名
        cityList: [],//大区
        cityName: '',//大区名称
        loading: true,
        userList: [],
        query: '',
        total: 0,
        pagesize: 10,
        pagenum: 1,
        addDialogFormVisible: false,
        addForm: {
          hospitalId: '',
          province: '',
          city: '',
          hospitalName: '',
        },
        editDialogFormVisible: false,
        editForm: {
          hospitalId: '',
          province: '',
          city: '',
          hospitalName: '',
        },
        grantDialogFormVisible: false,
        grantForm: {},

      }
    },


    mounted: function () {

    },

    watch: {
      "userListData.hospitalName"() {
        delay(() => {
          this.initList();
        }, 500);
      },
    },
    created() {
      this.initList()
      this.regionListTap()
    },
    methods: {
      // 省选择
      handRegleSelect(index) {
        console.log('区域下标=', index)
        this.cityList = this.provinceList[index].cityList
        this.addForm.province = this.provinceList[index].provinceId
        // 判断是否有市
        if (this.provinceList[index].cityList.length != 0) {
          this.cityList = this.provinceList[index].cityList
          this.addForm.city = this.provinceList[index].cityList[0].cityId//默认选中大区ID
          this.cityName = this.provinceList[index].cityList[0].cityName//默认选中大区ID
        } else {
          this.cityList = []
          this.cityName = ''
          this.addForm.cityName = ''
        }

      },
      // 市选择
      handGionleSelect(index) {
        console.log('大区=', index)
        this.cityName = this.cityList[index].cityName
        this.addForm.city = this.cityList[index].cityId
        console.log('addForm=', this.addForm)

      },
      // 市选择
      handArealeSelect(index) {
        console.log('地区=', index)
        this.addForm.userRegionItemArea = this.regionItemAreaList[index].regionItemAreaId
        this.regionItemAreaName = this.regionItemAreaList[index].regionItemAreaName
        console.log('addForm=', this.addForm)

      },
      // 省选择
      getRegion(prov) {
        console.log('区域ID=', prov)
      },
      // 设置每页条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.userListData.pageSize = val
        this.initList()
      },
      // 模糊查询
      ChaxunTap() {
        this.initList()
      },
      // 设置当前页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.userListData.currentPage = val

        this.initList()
      },
      // 获取省市列表
      regionListTap() {
        this.loading = true
        this.paginaSel = 0
        let userListData = {}
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/hospital/province-city-select'
        api.get(url, userListData).then(response => {
          console.log('返回值!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let provinceList = response.data.provinceList
              console.log('provinceList=!', provinceList)
              this.provinceList = provinceList
            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }

        }).catch(error => {
        })
      },
      // 初始化表格数据
      initList() {
        this.loading = true
        this.paginaSel = 0
        let userListData = this.userListData
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/hospital/hospital-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          // if(response.code){
          //   this.$store.dispatch('user/resetToken')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.hospitalList.items
              this.totalCount = response.data.hospitalList.totalCount
              console.log('返回值!list=', list)
              this.total = response.data.hospitalList.totalCount
              this.userList = list
              // location.reload()
            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }


        }).catch(error => {

        })

      },
      // 添加用户
      addUserSubmit() {
        this.paginaSel = 0
        console.log('this.addForm=', this.addForm)

          if (!this.addForm.hospitalName) {
            this.$message('请填写医院名称');
            return
          }
          if (this.addForm.province == '') {
            this.$message('请选择所属地区');
            return
          }

        this.loading = true
        let userListData = {};

        if (this.hospitalId == '') {
          userListData = qs.stringify({
            province: this.addForm.province,
            city: this.addForm.city,
            hospitalName: this.addForm.hospitalName,
          });
        } else {
          userListData = qs.stringify({
            province: this.addForm.province,
            city: this.addForm.city,
            hospitalName: this.addForm.hospitalName,
            hospitalId: this.hospitalId,
          });
        }

        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/hospital/hospital-save'
        api.post(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.loading = false

          if (response.code == '200') {
            if (response.status == 'success') {
              // return
              this.addDialogFormVisible = false;
              this.editDialogFormVisible = false;
              this.grantDialogFormVisible = false;
              this.initList();
              this.addForm.province = '',
                this.addForm.city = '',
                this.addForm.hospitalName = '',
                this.addForm.hospitalId = '',

                this.cityName = ""//
              this.provinceName = ''//
              this.hospitalId = ''//

            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }
        }).catch(error => {
        })
      },
      // 取消添加
      addDialogFormVisibleTap() {
        console.log('111')
        this.addDialogFormVisible = false
        this.addForm.hospitalName = '';
        this.addForm.province = '';
        this.addForm.city = '';
        this.cityName = '';
        this.provinceName = '';

        this.addForm.hospitalId = '',
        this.hospitalId = ''//
      },

      grantDialogFormVisibleTap() {
        console.log('111')
        this.grantDialogFormVisible = false
        this.addForm.CWID = '',
          this.addForm.userName = '',
          this.addForm.userMobile = '',
          this.addForm.userEmail = '',
          this.addForm.userRegionItem = '',
          this.addForm.userRegionItemArea = '',
          this.addForm.roleId = '',
          this.addForm.regionItemName = '',
          this.addForm.regionItemAreaName = '',
          this.addForm.userDepartment = '',
          this.regionName = "";
        this.regionItemList = [];
        this.regionItemAreaList = [];
        this.regionItemName = "";
        this.regionItemAreaName = "";
        this.roleName = "";
        this.userId = "";

      },
      // 取消编辑弹窗
      editDialogFormVisibleTap() {
        console.log('111')
        this.editDialogFormVisible = false
        this.addDialogFormVisible = false
        this.addForm.hospitalName = '';
        this.addForm.province = '';
        this.addForm.city = '';
        this.cityName = '';
        this.provinceName = '';
        this.addForm.hospitalId = '',
          this.hospitalId = ''//
        this.cityList = []//

      },

      // 显示编辑用户对话框
      showEditDialog(row, type) {
        console.log(row)
        this.editDialogFormVisible = true
        this.loading = true
        let userListData = {
          hospitalId: row.hospitalId
        }
        let url = '/web/v1.0/base/hospital/hospital-info'
        api.get(url, userListData).then(response => {
          console.log('信息!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let hospitalInfo = response.data.hospitalInfo
              this.addForm.city = hospitalInfo.cityId
              this.addForm.hospitalName = hospitalInfo.hospitalName
              this.hospitalId = hospitalInfo.hospitalId
              this.addForm.province = hospitalInfo.provinceId
              this.cityName = hospitalInfo.cityName
              this.provinceName = hospitalInfo.provinceName
              for (let i = 0; i < this.provinceList.length; i++) {
                if (this.provinceList[i].provinceId == hospitalInfo.provinceId) {
                  this.cityList = this.provinceList[i].cityList
                }
              }
              console.log('this.addForm=', this.addForm)
              this.initList()

            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }

        }).catch(error => {
        })
      },
      // 编辑用户提交
      editUserSubmit(formName) {
        this.$refs[formName].validate(valide => {
          if (valide) {
            editUser(this.editForm).then(res => {
              if (res.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                this.editDialogFormVisible = false
                this.initList()
              }
            })
          }
        })
      },
      // 显示删除对话框
      showDeleteDialog(row) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 执行删除用户操作
          console.log(row)
          this.loading = true
          let userListData = []
          userListData.push(row.userId)
          console.log('userListData=', userListData)
          let url = '/web/v1.0/system/user/user-freeze'
          api.post(url, {}, userListData).then(response => {
            console.log('角色列表!', response)
            this.loading = false
            if (response.code == '200') {
              if (response.status == 'success') {
                this.initList()
              } else {
                this.$message({
                  message: response.message,
                  type: 'error'
                })
              }
            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }

          }).catch(error => {
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },


    }
  }
</script>
<style lang="scss" scoped>
  .happy-scroll{
    height: 350px!important;
  }
  .happy-scroll-container .happy-scroll-content {
    width: 100% !important;
  }

  /*.happy-scroll{*/
  /*  width: 10%;*/
  /*  height: 50%;*/
  /*}*/

  .det-taq-fir-e-img {
    width: 14px;
    height: 14px;
  }

  .el-dialog-taq-fir {
    width: 100%;
    text-align: center;
    font-size: 12px;
    margin: 0 auto;
  }

  .el-dialog-taq {
    /*position: relative;*/
  }

  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    /*margin: 0 !important;*/
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  .el-dialog__body {
    overflow: auto;
  }

  .el-scrollbar__wrap {
    overflow-y: hidden !important;
  }

  .dialog-taq {
    /*height: 80%;*/
    max-height: 80%;
    overflow-y: auto;
  }

  .kehu-taq {
    width: 50%;
    padding-top: 10px;
    text-align: center;
    border-right: 1px solid #f5f4f3;
  }

  .none {
    border-right: 1px solid #fff;
  }

  .kehu-taq-fir {
    margin-bottom: 20px;
  }

  .det-taq-fir-d {
    width: 80%;
    margin: 0 auto;
    font-size: 12px;
    display: flex;
    align-items: center;
    /*margin-left: 10%;*/
    /*margin-bottom: 15px;*/
    /*-webkit-transform: scals(0.83)*/
  }

  .disf {
    margin-left: 21% !important;
    margin-bottom: 15px;

  }

  .let {
    margin-left: 7%;
  }

  .det-taq-fir-c {
    /*width: 80%;*/
    margin: 0 auto;
    margin-left: -20%;
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    /*-webkit-transform: scals(0.83)*/
  }
  .letui{
    margin-left: -50%;

  }

  .det-taq-fir-d {
    /*width: 80%;*/
    margin-left: 10%;
    font-size: 12px;
    /*-webkit-transform: scals(0.83)*/
  }

  .det-taq-fir-e {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: 1px solid #9A9A9A;
  }

  .det-taq-fir-e-bg {
    background: #E75A3E;
    border: 1px solid #E75A3E;

  }

  .search-taq {
    width: 50% !important;
    /*padding: 10px 0;*/
    margin-right: 5%;


  }

  el-table--mini th, .el-table--mini td {
    padding: 10px 0 !important;
  }

  el-table-column {
    height: 50px !important;
  }

  .user {
    .margin-20 {
      margin: 20px 0;
    }

    .search-input {
      width: 300px;
    }

    .page {
      padding: 5px 0;
      background-color: #D3DCE6;
    }
  }
</style>

<style>
  .el-button--primary{
    color: #fff;
    background-color: #26C0E4!important;
    border-color: #fff!important;
  }
  .el-button--primary:hover{
    background-color: #20b6f9!important;
    border-color: #20b6f9!important;
  }
  .el-button--primary.is-plain {
    color: #1890ff!important;
    background: #e8f4ff!important;
    border-color: #a3d3ff!important;
  }
  .el-button--primary.is-plain:hover{
    color: #fff!important;
    background: #20b6f9!important;
    border-color: #20b6f9!important;
  }

</style>
