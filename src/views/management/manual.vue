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
    <div style="padding: 20px">正在研发中...</div>
<!--    <el-row>-->
<!--      <el-col :span="24">-->
<!--        &lt;!&ndash; 给组件绑定原生事件的话，需要一个.native的修饰符 &ndash;&gt;-->
<!--        &lt;!&ndash;        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-input style="margin-right: 1%;" placeholder="CWID查询" class="search-input" v-model="userListData.userIdentifier"></el-input>&ndash;&gt;-->
<!--        <el-input style="margin-right: 1%;" placeholder="类型名称查询" class="search-input" v-model="userListData.dictName"></el-input>-->
<!--        &lt;!&ndash;        <el-button type="primary" slot="append" ></el-button>&ndash;&gt;-->
<!--        <el-button type="primary" @click="ChaxunTap">查询</el-button>-->
<!--&lt;!&ndash;        <el-button type="success" @click="addDialogFormVisible=true">添加用户</el-button>&ndash;&gt;-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    &lt;!&ndash;    <el-table&ndash;&gt;-->
<!--    &lt;!&ndash;      class="margin-20"&ndash;&gt;-->
<!--    &lt;!&ndash;      v-loading="loading"&ndash;&gt;-->
<!--    &lt;!&ndash;      :data="userList"&ndash;&gt;-->
<!--    &lt;!&ndash;      ref="queryHeight"&ndash;&gt;-->
<!--    &lt;!&ndash;      border&ndash;&gt;-->
<!--    &lt;!&ndash;      :height="tableHeight"&ndash;&gt;-->
<!--    &lt;!&ndash;      style="width: 100%">&ndash;&gt;-->
<!--    <el-table-->
<!--      class="margin-20"-->
<!--      v-loading="loading"-->
<!--      :data="userList"-->
<!--      border-->
<!--      style="width: 100%">-->
<!--      <el-table-column-->
<!--        type="index"-->
<!--        width="100"-->
<!--        label="序号"-->
<!--        align="center"-->
<!--      >-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="dictCode"-->
<!--        label="类型编码"-->
<!--        width="300"-->
<!--        align="center"-->
<!--      >-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="dictName"-->
<!--        label="类型名称"-->
<!--        width="300"-->
<!--        align="center"-->
<!--      >-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="dictMemo"-->
<!--        label="类型描述"-->
<!--        width="400"-->
<!--        align="center"-->
<!--      >-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button size="mini" type="primary" plain @click="showEditDialog(scope.row,1)">查看</el-button>-->
<!--&lt;!&ndash;          <el-button size="mini" type="danger" plain @click="showPingDialog(scope.row)">平调</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button size="mini" type="warning" plain @click="showEditDialog(scope.row,2)">分配角色</el-button>&ndash;&gt;-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    &lt;!&ndash;    分页&ndash;&gt;-->
<!--    <div>-->
<!--      <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="userListData.currentPage"-->
<!--        :page-sizes="[10, 20, 30, 40]"-->
<!--        :page-size="10"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="totalCount"-->
<!--      >-->
<!--      </el-pagination>-->
<!--    </div>-->
<!--    &lt;!&ndash; 查看对话框 &ndash;&gt;-->
<!--    <el-dialog title="查看字典项" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>-->
<!--      <el-table-->
<!--        :data="tableData"-->
<!--        :span-method="objectSpanMethod"-->
<!--        style="width: 100%"-->
<!--        class="margin-20"-->
<!--        align="center"-->
<!--        border-->
<!--      >-->
<!--        <el-table-column-->
<!--          prop="date"-->
<!--          label="类型名称"-->
<!--          style="width: 50%"-->
<!--          align="center"-->
<!--        >-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="dictName"-->
<!--          label="字典项信息"-->
<!--          style="width: 50%"-->
<!--          align="center"-->
<!--        >-->
<!--        </el-table-column>-->
<!--      </el-table>-->

<!--&lt;!&ndash;      <el-table&ndash;&gt;-->
<!--&lt;!&ndash;        :data="dictInfoList"&ndash;&gt;-->
<!--&lt;!&ndash;        style="width: 50%"&ndash;&gt;-->
<!--&lt;!&ndash;        class="margin-20"&ndash;&gt;-->
<!--&lt;!&ndash;        align="center"&ndash;&gt;-->
<!--&lt;!&ndash;        border&ndash;&gt;-->
<!--&lt;!&ndash;      >&ndash;&gt;-->
<!--&lt;!&ndash;        <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;          prop="dictName"&ndash;&gt;-->
<!--&lt;!&ndash;          label="字典项信息"&ndash;&gt;-->
<!--&lt;!&ndash;          style="width: 100%"&ndash;&gt;-->
<!--&lt;!&ndash;          align="center"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;        </el-table-column>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-table>&ndash;&gt;-->

<!--&lt;!&ndash;      <div v-for='(item, index) in dictInfoList' :key="index" >{{item.dictName}}</div>&ndash;&gt;-->
<!--    </el-dialog>-->

  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";

  // import {getUserList, changeUserState, addUser, getUserById, editUser, deleteUser, getRoleList, grantUserRole} from '@/api'
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
        doctorList: [],
        doctorName: '',//客户列表模糊查询
        userName: '',//销售列表模糊查询
        userId: '',//用户ID
        userListData: {
          dictName: '',
          currentPage: 1,
          pageSize: 10,
        },
        totalCount: 1,// 总数量
        loading: true,
        userList: [],
        query: '',
        total: 0,
        pagesize: 10,
        pagenum: 1,
        editDialogFormVisible: false,
        dictInfoList: [],
        spanArr:[],
        tableData:[],
        pos:0,
        datalist:[],
        indexInfoList:[]
      }
    },


    mounted: function () {

    },

    watch: {

      "userListData.dictName"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },

    },
    created() {
      this.initList()
    },
    methods: {
      getSpanArr(data) {
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1)
            this.pos = 0
          } else {     // 判断当前元素与上一个元素是否相同
            if (data[i]['date'] === data[i - 1]['date']) {
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      },

      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          let index = this.indexInfoList.findIndex(item => {  //遍历数组
            return item.firstIndex === rowIndex
          })
          if (index > -1) {
            return {
              rowspan: this.indexInfoList[index].length,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      // 设置每页条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.userListData.pageSize = val
        this.initList()
      },
      // 取消平调弹窗
      pingDialogFormVisibleTap() {
        console.log('this.pingDialogFormVisible=', this.pingDialogFormVisible)
        this.pingDialogFormVisible = false
        this.doctorName = '';
        this.userName = '';
        this.userId = '';
        this.newUserId = '';
        this.doctorIdList = [];
      },
      // 客户列表模糊查询
      doctorTap() {
        this.doctorListTap(this.userId, this.doctorName)
      },
      // 客户列表
      doctorListTap(userId, doctorName) {
        this.loading = true
        let userListData = {
          userId: userId,
          doctorName: doctorName,
        };
        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/user/doctor-list'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let doctorList = response.data.doctorList
              // this.totalCount = response.data.userList.totalCount
              // this.total = response.data.totalCount

              for (let i = 0; i < doctorList.length; i++) {
                doctorList[i].isChecked = false
              }
              this.doctorList = doctorList
              console.log('返回值!doctorList=', doctorList)
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
      // 获取角色列表
      rolepageTap() {
        this.loading = true
        let userListData = {}
        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/user/role-select'
        api.get(url, userListData).then(response => {
          console.log('角色列表!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let roleList = response.data.roleList
              this.roleList = roleList
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
      // 获取区域列表
      regionListTap() {
        this.loading = true
        this.paginaSel = 0
        let userListData = {}
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/area/area-select'
        api.get(url, userListData).then(response => {
          console.log('返回值!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let regionList = response.data.regionList
              console.log('regionList=!', regionList)
              this.regionList = regionList
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
        let url = '/web/v1.0/system/dict/dict-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          // if(response.code){
          //   this.$store.dispatch('user/resetToken')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.dictList.items
              // for (let i = 0; i < list.length; i++) {
              //   list[i].data = 'A'
              // }
              this.totalCount = response.data.dictList.totalCount
              console.log('返回值!list22222=', list)
              this.total = response.data.totalCount
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
      addUserSubmit(userId) {
        this.paginaSel = 0
        console.log('this.addForm=', this.addForm)
        // 判断是否为分配角色
        if (userId == 1) {
          if (!this.addForm.CWID) {
            this.$message('请填写CWID');
            return
          }
          if (!this.addForm.userName) {
            this.$message('请填写姓名');
            return
          }
          if (!this.addForm.userMobile) {
            this.$message('请填写手机');
            return false
          } else if (!/^1[345678]\d{9}$/.test(this.addForm.userMobile)) {
            this.$message('请填写正确是手机号');
            return false
          }

          // const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          // if (!regEmail.test(this.addForm.userEmail)) {
          //   this.$message({
          //     message: '邮箱格式不正确',
          //   })
          //   return
          // }

          if (!this.addForm.userRegionItem) {
            this.$message('请选择所属大区');
            return
          }
          if (!this.addForm.roleId) {
            this.$message('请选择所属角色');
            return
          }
          // if (!this.addForm.userDepartment) {
          //   this.$message('请填写所属角色');
          //   return
          // }
        } else {
        }


        this.loading = true
        let userListData = {};

        if (this.userId != '') {
          userListData = qs.stringify({
            userId: this.userId,
            CWID: this.addForm.CWID,
            userName: this.addForm.userName,
            userEmail: this.addForm.userEmail,
            userMobile: this.addForm.userMobile,
            userRegionItem: this.addForm.userRegionItem,
            userRegionItemArea: this.addForm.userRegionItemArea,
            roleId: this.addForm.roleId,
            userDepartment: this.addForm.userDepartment,
          });
        } else {
          userListData = qs.stringify({
            CWID: this.addForm.CWID,
            userName: this.addForm.userName,
            userEmail: this.addForm.userEmail,
            userMobile: this.addForm.userMobile,
            userRegionItem: this.addForm.userRegionItem,
            userRegionItemArea: this.addForm.userRegionItemArea,
            roleId: this.addForm.roleId,
            userDepartment: this.addForm.userDepartment,
          });
        }

        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/user/user-add'
        api.post(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.loading = false

          if (response.code == '200') {
            if (response.status == 'success') {
              this.addDialogFormVisible = false;
              this.editDialogFormVisible = false;
              this.grantDialogFormVisible = false;

              this.initList();

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


                this.regionName = ""//区域名
              this.regionItemList = []//大区
              this.regionItemAreaList = []//地区
              this.regionItemName = ""//大区名称
              this.regionItemAreaName = ""//地区名称
              this.roleName = ""//地区名称
              this.userId = '';
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

      addDialogFormVisibleTap() {
        console.log('111')
        this.addDialogFormVisible = false
        this.userId = '';
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


      },

      // 显示编辑用户对话框
      showEditDialog(row, type) {
        this.editDialogFormVisible = true
        console.log(row)
        let  dictName = row.dictName;
        console.log(dictName)

        this.loading = true
        let userListData = {
          dictCode: row.dictCode
        }
        let url = '/web/v1.0/system/dict/dict-info'
        api.get(url, userListData).then(response => {
          console.log('信息!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.dictInfoList

              for (let i = 0; i < list.length; i++) {
                list[i].date = dictName
              }

              this.dataList = list

              // 获取每个类目下的条数
              let arr = []
              // let indexList = []
              this.dataList.forEach(ele => {
                let firstIndex = this.dataList.findIndex(item => {
                  return item.category === ele.category   // 当category相同的时候，返回第一个相同的Index 赋值给 firstIndex
                })
                if (arr.findIndex(item => {
                  return item.firstIndex === firstIndex
                }) === -1) {
                  arr.push({
                    length: this.dataList.filter(item => {
                      return item.category === ele.category    //利用数组的filter方法，过滤出相同category的数组的长度。数组长度-即为跨多少行
                    }).length,
                    firstIndex: firstIndex    // firstIndex 返回的是第一个catergory就满足的第一个Index,即为rowIndex开始于第几行。
                  })
                }
              })
              // arr = new Set(arr)
              // console.log(arr)
              this.indexInfoList = arr   // 得到的arr里面的内容：Array(3) // 0 : firstIndex : 0; length: 4  1: firstIndex: 4 length:5
              console.log('arr=',arr)




              this.getSpanArr(list);
              console.log('list=!', list)
              this.dictInfoList = response.data.dictInfoList
              this.tableData = list;

              console.log('this.tableData=!', this.tableData)

              //将返回值赋给表格数据
              // this.tableData = dictInfoList;
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
