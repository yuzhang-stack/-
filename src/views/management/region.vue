<template>




  <div class="user region">
    <el-container>
      <el-aside width="200px" height="100%">
        <div class="region-taq">
          <el-tree
            :data="regionList"
            :props="defaultProps"
            accordion

            ref="asyncTree"
            node-key="id"
            @node-click="handleNodeClick"
            :default-expanded-keys="idArr"
          >
          </el-tree>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="24" style="margin-top: 10px;">
              <el-button type="primary" v-if="idArr.length != 0" @click="addDialogFormVisible=true" class="region-taw">{{NewregionName}}</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-table
            class="margin-20"
            v-loading="loading"
            :data="areaList"
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
              prop="regionItemName"
              label="名称"
              width="300"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="parentNode"
              label="父节点"
              width="300"
              align="center"
            >
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="sortNum"-->
<!--              label="排序"-->
<!--              width="400"-->
<!--              align="center"-->
<!--            >-->
<!--            </el-table-column>-->
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain @click="showEditDialog(scope.row,1)">编辑</el-button>
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
          <el-dialog title="添加地区" :visible.sync="addDialogFormVisible" @close="addDialogFormVisibleTap">
            <el-form :model="addForm" label-width="120px" ref="addUserForm">
              <el-form-item label="父节点：" prop="farAreaName">
                <el-tag type="info">{{farAreaName}}</el-tag>
              </el-form-item>
              <el-form-item label="当前子节点：" prop="userName">
                <el-input v-model="addForm.areaName" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
              <el-button @click="addDialogFormVisibleTap">取 消</el-button>
              <el-button type="primary" @click="addUserSubmit()">保存</el-button>
            </div>
          </el-dialog>
          <!-- 编辑用户对话框 -->
          <el-dialog title="编辑地区" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>
            <el-form :model="addForm" label-width="120px" ref="addUserForm">
              <el-form-item label="父节点：" prop="farAreaName">
                <el-tag type="info">{{farAreaName}}</el-tag>
              </el-form-item>
              <el-form-item label="当前子节点：" prop="userName">
                <el-input v-model="addForm.areaName" auto-complete="off"></el-input>
              </el-form-item>
<!--              <el-form-item label="排序：" prop="userName">-->
<!--                <el-input v-model="addForm.sortNum" auto-complete="off"></el-input>-->
<!--              </el-form-item>-->
            </el-form>
            <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
              <el-button @click="editDialogFormVisibleTap">返 回</el-button>
              <el-button type="primary" @click="addNewUserSubmit()">保存</el-button>
            </div>
          </el-dialog>
        </el-main>
<!--        <el-footer>Footer</el-footer>-->
      </el-container>
    </el-container>


  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";


  // 节流函数

  export default {
    data() {
      return {
        NewregionName:'添加大区',
        regionId:'',//区域ID
        regionItemId:'',//大区ID
        regionItemAreaId:'',//地区ID
        areaName:'',//名称
        idArr: [],//设置默认选中
        id:'',//节点ID
        userListData: {//列表对象
          regionId: '',
          regionItemId: '',
          currentPage: 1,
          pageSize: 10,
        },
        totalCount: 1,// 总数量
        loading: true,
        areaList: [],//查询列表
        query: '',
        total: 0,
        pagesize: 10,
        pagenum: 1,
        editDialogFormVisible: false,
        editForm: {
          // CWID: '',
          // userName: '',
          // userEmail: '',
        },
        addDialogFormVisible:false,
        farAreaName:'',//添加父节点名称
        addForm: {
          regionId: '',
          regionItemId: '',
          regionItemAreaId: '',
          areaName: '',
          sortNum:''
        },
        dictInfoList: [],
        spanArr: [],
        tableData: [],
        pos: 0,
        datalist: [],
        indexInfoList: [],
        regionList: [],//三级列表
        defaultProps: {//三级列表默认值
          children: 'children',
          label: 'label'
        },

      }
    },

    mounted: function () {
      // setTimeout(function () {
      // this.$nextTick(()=>{
      //     this.$refs['asyncTree'].setCurrentKey('q2');
      //   })
        // },500);
    },

    watch: {



    },
    created() {
      this.reignList()

    },
    methods: {

      isCon(arr, val){
        for(let i=0; i<arr.length; i++){
          if(arr[i] == val)
            return true;
        }
        return false;
      },
      // 局部刷新子节点
      refreshNodeBy(id){
        console.log('id=',id);

        let node = this.$refs.asyncTree.getNode(id); // 通过节点id找到对应树节点对象
        console.log('node=',node);

        // node.loaded = false;
        node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
        console.log('node.expand()=',node.expand());

      },
      // 点击节点获取对象
      handleNodeClick(data) {
        console.log(data);
        this.idArr = []//所展开的ID

        let  dom = {}
        dom=document.getElementsByClassName('el-tree')[0].childNodes[0]
        console.log(`dom=`,dom)
        dom.classList.remove('is-current')
        console.log(`dom=`,dom)
        this.userListData.currentPage = 1
        if(data.regionId != undefined){
          this.regionId = data.regionId
          this.regionItemId = ''
          this.farAreaName = data.regionName
          this.id = data.id//默认自己点ID
          this.idArr.push(data.id)
          // if(!this.isCon(this.idArr, data.id)){
          //   this.idArr.push(data.id);//保存树节点的展开
          // }
          this.NewregionName='添加大区'
          this.initList()
        }
        if(data.regionItemId != undefined){
          this.regionItemId = data.regionItemId
          this.regionId = ''
          this.farAreaName = data.regionItemName
          this.id = data.id//默认自己点ID
          this.initList()
          this.idArr.push(data.id)
          this.NewregionName='添加地区'
        }
        console.log('this.idArr=',this.idArr);

        if(data.regionItemAreaId != undefined){

          // this.regionId = ''
          // this.regionItemId = ''
          // this.initList()
        }
      },

      // 设置每页条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.userListData.pageSize = val
        this.initList()
      },
      test(id) {
        console.log('id1111111111=!', id)
        // let self = this;
        this.$nextTick(function(){
          console.log('id1111111111=!', id)

          this.$refs['asyncTree'].setCurrentKey('id');
        })
      },
      // 设置当前页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.userListData.currentPage = val
        this.initList()
      },
      // 三级下拉地区
      reignList() {
        this.loading = true
        this.paginaSel = 0
        let userListData = {}
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/area/area-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let r = 0;
              let regionList = response.data.regionList
              for (let i = 0; i < regionList.length; i++) {
                regionList[i].label = regionList[i].regionName
                regionList[i].children = regionList[i].regionItemList
                regionList[i].id = 'q' + regionList[i].regionId
                for (let j = 0; j < regionList[i].children.length; j++) {
                  regionList[i].children[j].children = regionList[i].children[j].regionItemAreaList
                  regionList[i].children[j].label = regionList[i].children[j].regionItemName
                  regionList[i].children[j].id = 'w' + regionList[i].children[j].regionItemId

                  for (r = 0; r < regionList[i].children[j].children.length; r++) {
                    regionList[i].children[j].children[r].label = regionList[i].children[j].children[r].regionItemAreaName
                    // regionList[i].id = 'w' + regionList[i].regionItemId
                  }
                }
              }
              // if()



              // 默认选中展开
              let  dom = {}
              // 判断是否有选择子节点
              console.log('this.id=!', this.id)
              console.log('this.idArr=!', this.idArr[0])

              if(this.id != ''){

                this.test(this.id)
                console.log('this.id=!', this.id)

                this.initList()

              }else {
                // 初始化默认选中第一个
                this.regionId = regionList[0].regionId
                this.farAreaName = regionList[0].regionName
                if(regionList[0].regionId){
                  this.initList()
                }

                this.idArr.push('q1')
                this.$nextTick(()=>{
                  this.$refs['asyncTree'].setCurrentKey('q1');
                  // dom=document.getElementsByClassName('el-tree')[0].childNodes[0]
                  console.log(`dom=`,dom)

                  // dom.className+=' is-current'
                  console.log(`dom=`,dom)

                })
              }
              console.log(`dom=`,dom)

              // console.log('regionList=!', regionList[0].regionId)
              // console.log('regionList=!', regionList)

              this.regionList = regionList
              this.refreshNodeBy(this.id)
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
        console.log('regionId=', this.regionId)
        console.log('regionItemId=', this.regionItemId)

        if(this.regionId != ''){
          this.userListData.regionId = this.regionId;
          delete this.userListData.regionItemId;
        }
        if(this.regionItemId != ''){
          this.userListData.regionItemId = this.regionItemId;
          delete this.userListData.regionId;
        }

        let userListData = this.userListData;


        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/area/area-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let areaList = response.data.areaList.items
              console.log('areaList=!', areaList)
              this.totalCount = response.data.areaList.totalCount
              // console.log('返回值!list=', list)
              this.total = response.data.totalCount

              // 大区地区统一名称
              if(areaList != null && areaList.length !=0 ){
                for (let i = 0; i < areaList.length; i++) {
                  if(areaList[i].regionItemAreaName){
                    areaList[i].regionItemName = areaList[i].regionItemAreaName
                  }
                }
              }



              this.areaList = areaList
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
      // 添加地区
      addUserSubmit() {
        this.paginaSel = 0
        console.log('this.addForm=', this.addForm)
        // 判断是否为分配角色
          if (!this.addForm.areaName) {
            this.$message('请填写当前节点名称');
            return
          }

        this.loading = true
        let userListData = {};

        if (this.regionId != '') {
          userListData = qs.stringify({
            regionId: this.regionId,
            areaName: this.addForm.areaName,
          });
        }else {
          userListData = qs.stringify({
            regionItemId: this.regionItemId,
            areaName: this.addForm.areaName,
          });
        }

        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/area/area-add'
        api.post(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              this.addDialogFormVisible = false;
              this.editDialogFormVisible = false;
              this.reignList()
              // this.initList();
              this.addForm.areaName = ''
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
      // 编辑地区
      addNewUserSubmit() {
        this.paginaSel = 0
        console.log('this.addForm=', this.addForm)
        // 判断是否为分配角色
        if (!this.addForm.areaName) {
          this.$message('请填写当前节点名称');
          return
        }

        this.loading = true
        let userListData = {};
        if (this.addForm.regionItemId != '') {
          userListData = qs.stringify({
            regionItemId: this.addForm.regionItemId,
            areaName: this.addForm.areaName,
            sortNum:this.addForm.sortNum,
          });
        }else {
          userListData = qs.stringify({
            regionItemAreaId: this.addForm.regionItemAreaId,
            areaName: this.addForm.areaName,
            sortNum:this.addForm.sortNum,
          });
        }

        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/area/area-change'
        api.post(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              this.addDialogFormVisible = false;
              this.editDialogFormVisible = false;
              this.reignList()
              this.initList();
              this.addForm.regionItemId = ''
              this.addForm.areaName = ''
              this.addForm.sortNum = ''
              this.addForm.regionItemAreaId = ''
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
      // 关闭添加
      addDialogFormVisibleTap() {
        console.log('this.addForm=',this.addForm)
        this.addDialogFormVisible = false
        this.addForm.areaName = ''
        // this.regionId = '';
        // this.regionItemId = '';
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
        this.addForm.areaName = ''
      },
      // 显示编辑用户对话框
      showEditDialog(row, type) {
        this.editDialogFormVisible = true
        console.log(row)
        // let  dictName = row.regionItemAreaId;
        // console.log(dictName)
        // return
        let userListData = {}
        console.log('regionItemId=',row.regionItemId)
        console.log('regionItemAreaId=',row.regionItemAreaId)
        // console.log(row)

        if(row.regionItemId != undefined && row.regionItemId != ''){
          console.log('regionItemId=',row.regionItemId)

          userListData = {
            regionItemId: row.regionItemId
          }
        }

        if(row.regionItemAreaId != undefined && row.regionItemAreaId != ''){
          userListData = {
            regionItemAreaId: row.regionItemAreaId
          }
        }

        console.log('userListData=',userListData)

        this.loading = true

        let url = '/web/v1.0/base/area/area-info'
        api.get(url, userListData).then(response => {
          console.log('信息!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let areaInfo = response.data.areaInfo

              this.farAreaName = areaInfo.parentNode;
              this.addForm.sortNum = areaInfo.sortNum;
              if(areaInfo.regionItemId){
                this.addForm.regionItemId = areaInfo.regionItemId;
                this.addForm.areaName = areaInfo.regionItemName;
                this.addForm.regionItemAreaId = ''
              }else {
                this.addForm.regionItemAreaId = areaInfo.regionItemAreaId;
                this.addForm.regionItemId = ''
                this.addForm.areaName = areaInfo.regionItemAreaName;

              }

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
<style >
  /*.el-tree-node__expand-icon{*/
  /*  !*color: #1890ff!important;*!*/
  /*  !*opacity: 0;*!*/
  /*}*/
  /*.el-dialog {*/
  /*  top: 20% !important;*/
  /*}*/
  aside{
    background: #fff !important;
  }

  .el-header{
    height: 40px !important;
  }
  .region{
    display: flex;
  }
  .region-taq{
    /*width: 200px;*/
    padding-top: 30px;
    /*margin-bottom: 30px;*/

    height: 100%;
  }
  .region-taw{
    margin-top: 10px;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #26C0E4!important;
    color: #fff !important;
    border-radius: 5%;
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #26C0E4;
    color: #fff;
  }
  /*.el-tree-node.is-current > .el-tree-node__content {*/
  /*  background-color: red !important;*/
  /*}*/
  .happy-scroll{
    height: 350px!important;
  }
  .happy-scroll-container .happy-scroll-content {
    width: 100% !important;
  }

  /*.el-dialog {*/
  /*  position: absolute;*/
  /*  top: 50%;*/
  /*  left: 50%;*/
  /*  !*margin: 0 !important;*!*/
  /*  transform: translate(-50%, -50%);*/
  /*  max-height: calc(100% - 30px);*/
  /*  max-width: calc(100% - 30px);*/
  /*  display: flex;*/
  /*  flex-direction: column;*/
  /*}*/



  /*.el-scrollbar__wrap {*/
  /*  overflow-y: hidden !important;*/
  /*}*/

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




  el-table--mini th, .el-table--mini td {
    padding: 10px 0 !important;
  }

  el-table-column {
    height: 50px !important;
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
