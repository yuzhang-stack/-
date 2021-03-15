<template>
  <div class="user">
    <el-row>
      <el-col :span="24" style="margin-top: 1%;">
        <el-input style="margin-left: 1%;" placeholder="医生姓名查询" class="search-input" v-model="userListData.doctorName"></el-input>
        <el-input style="margin-left: 1%;" placeholder="销售姓名查询" class="search-input" v-model="userListData.salerName"></el-input>
        <el-select style="margin-left: 1%;"
                   v-model="hospitalName"
                   filterable
                   clearable
                   @clear="setValueNull"
                   placeholder="医院查询"
                   @change="">
          <el-option
            v-for="(item,index) in hospitalList"
            :key="item.hospitalId"
            :label="item.hospitalName"
            :value="item.hospitalId"
            :style="'width:100%;'"
            @click.native="hosSelect(index)"></el-option>
        </el-select>

        <el-select style="margin-left: 1%;"
                   v-model="departmenName"
                   filterable
                   clearable
                   @clear="departNull"
                   placeholder="科室查询"
                   @change="">
          <el-option
            v-for="(item,index) in departmentDictList"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
            :style="'width:100%;'"
            @click.native="departmentSelect(index)"></el-option>
        </el-select>

        <el-button style="margin-left: 1%;" type="primary" @click="ChaxunTap">查询</el-button>
        <el-button style="margin-left: 1%;" type="primary" @click="ExportListTap">导出</el-button>
        <el-button style="margin-left: 1%;" type="primary" @click="daoVisible=true">导入</el-button>


        <el-button style="margin-left: 1%;" type="primary" @click="addDialogFormVisible=true">添加医生</el-button>
        <el-button style="margin-left: 1%;" type="primary" @click="ChongzhiTap">重置</el-button>

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
        prop="doctorName"
        label="医生姓名"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="doctorMobile"
        label="手机号"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sysProvince"
        label="所属省"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sysCity"
        label="所属市"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sysHosp"
        label="所属医院"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="sysHospDept"
        label="所属科室"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="titleName"
        label="职称"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="doctorType"
        label="类型"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="recordRecipe"
        label="处方量"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="saler"
        label="所属销售"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createDt"
        label="录入时间"
        align="center"
        width="180">
      </el-table-column>
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
    <!--导入对话框:-->
    <el-dialog title="导入医生" :visible.sync="daoVisible" @close="daoVisibleTap">
      <div style="display: flex;">
        <el-upload drag
                   :limit=limitNum
                   :before-remove="beforeRemove"
                   :action="UploadUrl()"
                   :before-upload="beforeUploadFile"
                   accept=".xlsx, .xls"
                   :on-exceed="exceedFile"
                   :on-success="handleSuccess"
                   :on-error="handleError"
                   :file-list="fileList"
        >
          <div>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>
            <div class="el-upload__tip" slot="tip">只能上传.xlsx或.xls文件！（且只可单一文件上传）</div>
          </div>
        </el-upload>
        <div style="width: 50%;margin-left:20px; " v-if="doctorListNew.length != 0">
          <div style="text-align: center" >重复导入的医生</div>
          <el-table
            class="margin-20"
            v-loading="loading"
            :data="doctorListNew"
            border
            style="width: 100%;overflow:auto;height: 180px;">
            <el-table-column
              prop="doctorName"
              width="100"
              label="医生名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="doctorMobile"
              label="手机号"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="salerName"
              label="所属销售"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="CWID"
              label="CWID"
              align="center"
              width="120">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="font-size: 12px;line-height: 40px ">注：医生类型、所属省、所属市、所属医院、所属科室、职称、所属销售，均需为已有数据
        <el-button style="margin-left: 1%;background: #f4b454!important;" type="warning" @click="downloadFile">下载模板</el-button>
      </div>
      <div style="margin: 0 auto!important;text-align: center;margin-top: 20px!important;" class="dialog-footer">
        <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
        <el-button @click="daoVisibleTap" >取消</el-button>
      </div>
    </el-dialog>
    <!--添加用户对话框:-->
    <el-dialog title="添加医生" :visible.sync="addDialogFormVisible" @close="addDialogFormVisibleTap">
      <el-form :model="addForm" label-width="80px" ref="addUserForm">
        <el-form-item label="医生姓名" prop="doctorName">
          <el-input v-model="addForm.doctorName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="doctorMobile">
          <el-input v-model="addForm.doctorMobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="医生类型">
          <el-select v-model="doctorTypeName"  filterable placeholder="请选择医生类型" @change="">
            <el-option
              v-for="(item,index) in doctorTypeList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="doctorTypeSelect(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属地区">
          <el-select v-model="provinceName" filterable placeholder="请选择所属省" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in provinceList"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
              :style="'width:100%;'"
              @click.native="handprovinceSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select v-model="cityName" filterable placeholder="请选择所属市" :loading="loading">
            <el-option
              v-for="(item,index) in cityList"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
              @click.native="handcitySelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select v-model="hospitalNameNew" filterable placeholder="请选择所属医院" :loading="loading">
            <el-option
              v-for="(item,index) in hospitalListNew"
              :key="item.hospitalId"
              :label="item.hospitalName"
              :value="item.hospitalId"
              @click.native="handhospitalSelect(index)"></el-option>
          </el-select>

          <el-button style="margin-left: 1%;" type="primary" @click="addHost">创建医院</el-button>
        </el-form-item>

        <el-form-item label="科室">
          <el-select v-model="departmentDictName"  filterable placeholder="请选择科室类型" @change="">
            <el-option
              v-for="(item,index) in departmentDictList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="departmentDictSelect(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职称">
          <el-select v-model="doctorTitleName"  filterable placeholder="请选择职称" @change="">
            <el-option
              v-for="(item,index) in doctorTitleList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="doctorTitleSelect(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属销售">
          <el-select v-model="newUserName"  placeholder="请选择所属销售" filterable>
            <el-option
              v-for="(item,index) in newUserList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
              @click.native="newUserListSelect(index)"></el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="addDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">保存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑医生" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>
      <el-form :model="addForm" label-width="80px" ref="addUserForm">
        <el-form-item label="医生姓名" prop="doctorName">
          <el-input v-model="addForm.doctorName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="doctorMobile">
          <el-input v-model="addForm.doctorMobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="医生类型">
          <el-select v-model="doctorTypeName"  filterable placeholder="请选择医生类型" @change="">
            <el-option
              v-for="(item,index) in doctorTypeList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="doctorTypeSelect(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属地区">
          <el-select v-model="provinceName"  filterable placeholder="请选择所属省" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in provinceList"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
              :style="'width:100%;'"
              @click.native="handprovinceSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select v-model="cityName" filterable placeholder="请选择所属市" :loading="loading">
            <el-option
              v-for="(item,index) in cityList"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
              @click.native="handcitySelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select v-model="hospitalNameNew" filterable placeholder="请选择所属医院" :loading="loading">
            <el-option
              v-for="(item,index) in hospitalListNew"
              :key="item.hospitalId"
              :label="item.hospitalName"
              :value="item.hospitalId"
              @click.native="handhospitalSelect(index)"></el-option>
          </el-select>

          <el-button style="margin-left: 1%;" type="primary" @click="addHost">创建医院</el-button>

        </el-form-item>

        <el-form-item label="科室">
          <el-select v-model="departmentDictName"  filterable placeholder="请选择科室类型" @change="">
            <el-option
              v-for="(item,index) in departmentDictList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="departmentDictSelect(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职称">
          <el-select v-model="doctorTitleName"  filterable placeholder="请选择职称" @change="">
            <el-option
              v-for="(item,index) in doctorTitleList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
              @click.native="doctorTitleSelect(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属销售">
          <el-select v-model="newUserName"  placeholder="请选择所属销售" filterable>
            <el-option
              v-for="(item,index) in newUserList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
              @click.native="newUserListSelect(index)"></el-option>
          </el-select>
        </el-form-item>



      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="editDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">保存</el-button>
      </div>
    </el-dialog>



    <!-- 添加医院对话框:rules="rules" -->
    <el-dialog title="添加医院" :visible.sync="addHsotble" @close="addHostTap">
      <el-form :model="addFormHsot" label-width="80px" ref="addUserForm">
        <el-form-item label="医院名称" prop="CWID">
          <el-input v-model="addFormHsot.hospitalName" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item label="所属地区">
          <el-select v-model="provinceListHostName"  filterable placeholder="请选择所属省" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in provinceListHost"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select v-model="cityListHostName" filterable
                     placeholder="请选择所属市" :loading="loading">
            <el-option
              v-for="(item,index) in cityListHost"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="addHostTap">取 消</el-button>
        <el-button type="primary" @click="addHostTapSubmit()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";
  import axios from 'axios'
  import {parseTime} from "@/utils";
  import {getToken, removeToken} from "@/utils/auth";
  import {Message, MessageBox} from "element-ui";
  import store from "@/store";
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
        limitNum: 1,  // 上传excell时，同时允许上传的最大数
        fileList: [],   // excel文件列表





        provinceListHost:[],//省所有(添加医院）
        provinceListHostName:'',//名称(添加医院）
        cityListHost:[],//市所有(添加医院）
        cityListHostName:'',//市名称(添加医院）
        addFormHsot: {
          hospitalId: '',
          province: '',
          city: '',
          hospitalName: '',
        },

        provinceList: [],//省所有
        provinceName: '',//省名
        cityList: [],//市所以
        cityName: '',//市名称
        hospitalListNew:[],//医院列表
        hospitalNameNew:'',//医院名
        doctorTypeList:[],//客户类型
        doctorTypeName:'',//类型名称
        doctorTitleList:[],//职称
        doctorTitleName:'',//职称
        departmentDictList:[],//科室
        departmentDictName:'',//科室名称
        newUserList:[],//销售列表
        newUserName:'',//销售名称
        userName:'',//销售模糊查询
        hospitalId: '',//医院ID
        hospitalList:[],//医院列表
        hospitalName:'',//医院名称
        newhospitalName:'',//医院名称模糊查询
        doctorId:'',//医生ID
        ExportList:[],//导出列表
        departmenName:'',//查询科室名称
        doctorListNew:[],//重复医生列表
        userListData: {
          salerName: '',
          doctorName: '',
          hospitalId: '',
          department:'',
          currentPage: 1,
          pageSize: 10,
        },
        filters: {
          value1: '',
          value2: ''
        },
        totalCount: 1,// 总数量

        loading: true,
        userList: [],
        query: '',
        total: 0,
        pagesize: 10,
        pagenum: 1,
        addDialogFormVisible: false,
        addHsotble:false,
        daoVisible:false,//导入

        addForm: {
          doctorId: '',//医生id
          doctorName: '',//医生姓名
          doctorMobile: '',//手机号
          doctorType: '',//客户类型(字典项)
          sysProvince: '',//所属省id
          sysCity: '',//所属市id
          sysHosp: '',//所属医院id
          sysHospDept: '',//所属科室id
          titleName: '',//职称(字典项)
          saler: '',//所属销售id
        },
        editDialogFormVisible: false,
        grantDialogFormVisible: false,


      }
    },


    mounted: function () {

    },
    watch: {
      "userListData.salerName"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.doctorName"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.hospitalId"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.department"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userName"() {
        delay(() => {
          this.marketListTap(this.userName);
        }, 500);
      },
      "newhospitalName"() {
        delay(() => {
          this.hospitalListTap(this.newhospitalName);
        }, 500);
      },
    },
    created() {
      this.initList()
      this.regionListTap()//添加医生三级地区下拉
      this.regionListHostTap()//添加医院二级地区下拉
      this.hospitalListTap('')
      this.marketListTap('')
      this.departmentTap()
      this.titleTap()
      this.typeTap()
    },
    methods: {

      // 下载模板
      downloadFile() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['医生姓名', '医生手机号', '医生类型', '所属省','所属市', '所属医院', '所属科室', '职称', '所属销售', '销售CWID']
          const filterVal = ['doctorName', 'doctorMobile', 'sysProvince', 'sysCity', 'sysHosp', 'sysHospDept', 'titleName', 'recordRecipe', 'saler',]
          const list = []
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '医生列表模板',
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },




      // 删除文件
      beforeRemove() {
        this.fileList = []
      },

// 文件超出个数限制时的钩子
      exceedFile(files, fileList) {
        this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
      },
      // 文件状态改变时的钩子
      fileChange(file, fileList) {
        console.log(file);

        console.log(file.raw);


        // if(this.fileList.length == 0){
        //   this.fileList.push(file.raw) ;
        //   console.log(this.fileList);
        // }

      },
      // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
      beforeUploadFile(file) {
        console.log('before upload');
        console.log(file);
        let extension = file.name.substring(file.name.lastIndexOf('.')+1);
        console.log(extension);

        // let size = file.size / 1024 / 1024;
        if(extension == 'xlsx' || extension == 'xls') {
          console.log('11');
          console.log('file=',file);

          if(this.fileList.length == 0){
            this.fileList.push(file) ;
            console.log(this.fileList);
          }
          return file
        }else {
          this.$message.warning('只能上传后缀是.xlsx或.xls的文件');
          return false
        }

        // if(size > 10) {
        //   this.$message.warning('文件大小不得超过10M');
        // }
      },
      // 文件上传成功时的钩子
      handleSuccess(res, file, fileList) {
        this.$message.success('文件选择成功');
      },
      // 文件上传失败时的钩子
      handleError(err, file, fileList) {
        this.$message.error('文件上传失败');
      },
      UploadUrl:function(){
        // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
        return "https://south.insightin.cn/web/v1.0/common/excel-upload"
      },
      uploadFile() {
        if (this.fileList.length === 0){
          this.$message.warning('请选择文件');
        } else {
          let form = new FormData();
          form.append('file', this.fileList[0],);
          axios({
            method:"post",
            url: "https://south.insightin.cn/web/v1.0/common/excel-upload",
            headers:{
              'token' : getToken(),
              'Content-type': 'multipart/form-data'
            },
            data:form
          }).then(
            res=>{
              console.log('res =', res.data.code)
              if (res.data.code == 'BC007') {
                window.location.href = '/login'
                sessionStorage.removeItem('SET_INTRODUCTION')
                sessionStorage.removeItem('SET_NAME')
                sessionStorage.removeItem('SET_AVATAR')
                sessionStorage.removeItem('SET_ROLES')
                removeToken()
              }
              if (res.data.code == 200) {
                console.log('res.code =', res.code)


                if(res.data.status == 'success'){
                    this.up(res.data.data.fileFullPath)
                }else {
                  this.$message.error(res.data.message);
                }

              } else {
                this.$message.error(res.data.message);
              }
            },err =>{
            });



        }
      },
      // 开始导入
      up(filePath){
        this.loading = false
        let userListData = {};
        userListData = qs.stringify({
          filePath: filePath,
        });
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/doctor/excel_to_db'
        api.post(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.initList()

          if (response.code == '200') {
            this.loading = false
            if (response.status == 'success') {
              // this.daoVisible=false
              // this.doctorListNew = response.data.doctorList
              if(response.data.doctorList != undefined && response.data.doctorList.length != 0){
                this.doctorListNew = response.data.doctorList
              }else {
                this.daoVisible=false
                this.doctorListNew = []

              }
              this.initList()
            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          } else {
            this.loading = false
            this.$message({
              message: response.message,
              type: 'error'
            })
          }
        }).catch(error => {
        })
      },



      // 添加医院
      addHostTapSubmit() {
        let that = this
        this.paginaSel = 0
        console.log('this.addForm=', that.addForm)

        if (!that.addFormHsot.hospitalName) {
          that.$message('请填写医院名称');
          return
        }
        if (that.addFormHsot.province == '') {
          that.$message('请选择所属地区');
          return
        }

        let userListData = {};
          userListData = qs.stringify({
            province: that.addFormHsot.province,
            city: that.addFormHsot.city,
            hospitalName: that.addFormHsot.hospitalName,
          });
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/hospital/hospital-save'
        api.post(url, {}, userListData).then(response => {
          console.log('response=', response)


          if (response.code == '200') {
            if (response.status == 'success') {
              that.regionListTap()
              this.addHsotble = false;
              that.addHsotble.province = ''
              that.addHsotble.city = ''
              that.addHsotble.hospitalName = ''
              that.cityListHostName = ""
              that.provinceListHostName = ''
            } else {
              that.$message({
                message: response.message,
                type: 'error'
              })
            }
          } else {
            that.$message({
              message: response.message,
              type: 'error'
            })
          }
        }).catch(error => {
        })
      },
      // 取消添加医院
      addHostTap() {
        console.log('111')
        this.addHsotble = false
        this.addFormHsot.hospitalName = '';
        this.addFormHsot.province = '';
        this.addFormHsot.city = '';
        this.cityListHostName = '';
        this.provinceListHostName = '';
        this.addFormHsot.hospitalId = ''
      },
      // 省选择（添加医院）
      handRegleSelect(index) {
        console.log('区域下标=', index)
        this.cityListHost = this.provinceListHost[index].cityList
        this.addFormHsot.province = this.provinceListHost[index].provinceId
        // 判断是否有市
        // if (this.provinceListHost[index].cityList.length != 0) {
          this.cityListHost = this.provinceListHost[index].cityList
          this.addFormHsot.city = this.provinceListHost[index].cityList[0].cityId//默认选中大区ID
          this.cityListHostName = this.provinceListHost[index].cityList[0].cityName//默认选中大区ID
        // } else {
        //   this.cityListHost = []
        //   this.cityListHostName = ''
        //   this.addFormHsot.cityName = ''
        // }

      },
      // 市选择（添加医院）
      handGionleSelect(index) {
        console.log('大区=', index)
        this.cityListHostName = this.cityListHost[index].cityName
        this.addFormHsot.city = this.cityListHost[index].cityId
        console.log('addFormHsot=', this.addFormHsot)

      },


      // 重置
      ChongzhiTap(){
        this.userListData.salerName = ''
        this.userListData.doctorName = ''
        this.userListData.hospitalId = ''
        this.hospitalName = ''
        this.userListData.currentPage = 1
        this.initList();
      },
      // 职称字典项
      titleTap() {
        this.loading = true
        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/doctor/doctor-title-list'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let doctorTitleList = response.data.doctorTitleList
              console.log('doctorTitleList!', doctorTitleList)
              this.doctorTitleList = doctorTitleList
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
      // 销售选择
      newUserListSelect(index) {
        console.log('销售ID=', this.newUserList[index].userId)
        console.log('销售名称型=', this.newUserList[index].userName)
        this.newUserName = this.newUserList[index].userName
        this.addForm.saler = this.newUserList[index].userId
      },
      // 职称类型选择
      doctorTitleSelect(index) {
        console.log('客户类型字典项=', this.doctorTitleList[index].dictCode)
        console.log('客户类型=', this.doctorTitleList[index].dictName)
        this.doctorTitleName = this.doctorTitleList[index].dictName
        this.addForm.titleName = this.doctorTitleList[index].dictCode
      },
      // 科室类型选择
      departmentDictSelect(index) {
        console.log('客户类型字典项=', this.departmentDictList[index].dictCode)
        console.log('客户类型=', this.departmentDictList[index].dictName)
        this.departmentDictName = this.departmentDictList[index].dictName
        this.addForm.sysHospDept = this.departmentDictList[index].dictCode
      },
      // 客户类型选择
      doctorTypeSelect(index) {
        console.log('客户类型字典项=', this.doctorTypeList[index].dictCode)
        console.log('客户类型=', this.doctorTypeList[index].dictName)

        this.doctorTypeName = this.doctorTypeList[index].dictName
        this.addForm.doctorType = this.doctorTypeList[index].dictCode
      },
      // 客户类型字典项
      typeTap() {
        this.loading = true
        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/doctor/doctor-type-list'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let doctorTypeList = response.data.doctorTypeList
              this.doctorTypeList = doctorTypeList
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
      // 科室字典项
      departmentTap() {
        this.loading = true
        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/doctor/department-dict-list'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let departmentDictList = response.data.departmentDictList
              this.departmentDictList = departmentDictList
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
      // 销售列表
      marketListTap(userName) {
        this.loading = true
        let userListData = {
          userName: userName,
        };
        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/user/user-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let newUserList = response.data.userList
              for (let i = 0; i < newUserList.length; i++) {
                newUserList[i].isChecked = false
              }
              this.newUserList = newUserList
              console.log('返回值!newUserList=', newUserList)
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
      // 清空医院下拉列表departNull
      setValueNull(val) {
        this.hospitalName='';
        this.userListData.hospitalId = '';
      },
      // 清空科室下拉列表
      departNull(val) {
        this.departmenName='';
        this.userListData.department = '';
      },
      // 导航医院下拉查询
      hosSelect(index) {
        console.log('区域下标=', index)
        this.userListData.hospitalId = this.hospitalList[index].hospitalId
        this.hospitalName = this.hospitalList[index].hospitalName
      },
      // 导航医院下拉查询
      departmentSelect(index) {
        console.log('科室下标=', index)
        this.userListData.department = this.departmentDictList[index].dictCode
        this.departmenName = this.departmentDictList[index].dictName
      },
      // 省选择
      handprovinceSelect(index) {
        console.log('省下标=', index)
        this.provinceName = this.provinceList[index].provinceName
        this.addForm.sysProvince = this.provinceList[index].provinceId


        this.cityList = this.provinceList[index].cityList
        this.addForm.sysCity = this.provinceList[index].cityList[0].cityId//默认选中事ID
        this.cityName = this.provinceList[index].cityList[0].cityName//默认选中市名称

        this.hospitalListNew = this.provinceList[index].cityList[0].hospitalList//默认选中医院列表
        this.addForm.sysHosp = this.provinceList[index].cityList[0].hospitalList[0].hospitalId//默认选中医院ID
        this.hospitalNameNew = this.provinceList[index].cityList[0].hospitalList[0].hospitalName//默认选中医院名称


        console.log('默认选中医院列表=', this.hospitalListNew)
        console.log('默认选中医院ID=', this.addForm.sysHosp)
        console.log('默认选中医院名称=', this.hospitalNameNew)

      },
      // 市选择
      handcitySelect(index) {
        console.log('市下标=', index)
        this.cityName = this.cityList[index].cityName
        this.addForm.sysCity = this.cityList[index].cityId


        this.hospitalListNew = this.cityList[index].hospitalList//默认选中医院列表
        this.addForm.sysHosp = this.cityList[index].hospitalList[0].hospitalId//默认选中医院ID
        this.hospitalNameNew = this.cityList[index].hospitalList[0].hospitalName//默认选中医院名称


        console.log('默认选中医院列表=', this.hospitalListNew)
        console.log('默认选中医院ID=', this.addForm.sysHosp)
        console.log('默认选中医院名称=', this.hospitalNameNew)

      },
      // 医院选择
      handhospitalSelect(index) {
        console.log('医院=', index)
        this.hospitalNameNew = this.hospitalListNew[index].hospitalName
        this.addForm.sysHosp = this.hospitalListNew[index].hospitalId

        console.log('默认选中医院ID=', this.addForm.sysHosp)
        console.log('默认选中医院名称=', this.hospitalNameNew)
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
      // 获取省市列表(添加医院）
      regionListHostTap() {
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
              let provinceListHost = response.data.provinceList
              console.log('provinceListHost=!', provinceListHost)
              this.provinceListHost = provinceListHost


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
      // 获取省市医院列表（添加医生）
      regionListTap() {
        this.loading = true
        this.paginaSel = 0
        let userListData = {}
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/doctor/province-city-hospital-select'
        api.get(url, userListData).then(response => {
          console.log('返回值!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let provinceList = response.data.provinceList
              console.log('provinceList=!', provinceList)
              this.provinceList = provinceList

              this.provinceName = ''

              this.cityList =[]//市列表
              this.addForm.sysCity = ''//默认选中事ID
              this.cityName = ''//默认选中市名称

              this.hospitalNameNew = ''//医院列表
              this.addForm.sysHosp = ''//医院ID

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
      // 医院下拉列表/
      hospitalListTap(newhospitalName) {
        this.loading = true
        this.paginaSel = 0
        let userListData = {
          hospitalName:newhospitalName
        }
        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/doctor/hospital-select-list'
        api.get(url, userListData).then(response => {
          console.log('返回值!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let hospitalList = response.data.hospitalSelectList
              console.log('hospitalList=!', hospitalList)
              this.hospitalList = hospitalList
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
        let url = '/web/v1.0/base/doctor/doctor-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          // if(response.code){
          //   this.$store.dispatch('user/resetToken')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.doctorList.items
              this.totalCount = response.data.doctorList.totalCount
              console.log('返回值!list=', list)
              this.total = response.data.doctorList.totalCount
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

        if (!this.addForm.doctorName) {
          this.$message('请填写医生名称');
          return
        }
        if (!this.addForm.doctorMobile) {
          this.$message('请填写手机号');
          return false
        } else if (!/^1[345678]\d{9}$/.test(this.addForm.doctorMobile)) {
          this.$message('请填写正确是手机号');
          return false
        }
        if (!this.addForm.doctorType) {
          this.$message('请选择客户类型');
          return
        }
        if (!this.addForm.sysProvince) {
          this.$message('请选择所属省');
          return
        }
        if (!this.addForm.sysHospDept) {
          this.$message('请选择所属科室');
          return
        }
        if (!this.addForm.titleName) {
          this.$message('请选择所属职称');
          return
        }
        if (!this.addForm.saler) {
          this.$message('请选择所属销售');
          return
        }
        this.loading = true
        let userListData = {};

        if (this.doctorId == '') {
          userListData = qs.stringify({
            doctorName: this.addForm.doctorName,
            doctorMobile: this.addForm.doctorMobile,
            doctorType: this.addForm.doctorType,
            sysProvince: this.addForm.sysProvince,
            sysCity: this.addForm.sysCity,
            sysHosp: this.addForm.sysHosp,
            sysHospDept: this.addForm.sysHospDept,
            titleName: this.addForm.titleName,
            saler: this.addForm.saler,

          });
        } else {
          userListData = qs.stringify({
            doctorId: this.doctorId,
            doctorName: this.addForm.doctorName,
            doctorMobile: this.addForm.doctorMobile,
            doctorType: this.addForm.doctorType,
            sysProvince: this.addForm.sysProvince,
            sysCity: this.addForm.sysCity,
            sysHosp: this.addForm.sysHosp,
            sysHospDept: this.addForm.sysHospDept,
            titleName: this.addForm.titleName,
            saler: this.addForm.saler,
          });
        }

        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/doctor/doctor-save'
        api.post(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.loading = false

          if (response.code == '200') {
            if (response.status == 'success') {
              // return
              this.addDialogFormVisible = false;
              this.editDialogFormVisible = false;
              this.grantDialogFormVisible = false;

              this.addForm.doctorName = ''
              this.addForm.doctorMobile = ''
              this.addForm.doctorType = ''
              this.addForm.sysProvince = ''
              this.addForm.sysCity = ''
              this.addForm.sysHosp = ''
              this.addForm.sysHospDept = ''
              this.addForm.titleName = ''
              this.addForm.saler = ''
              this.doctorId = ''


              this.initList();

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
      // 打开创建医院
      addHost() {
        console.log('111')
        this.addHsotble = true
      },
      daoVisibleTap(){
        this.daoVisible = false

      },
      // 取消添加
      addDialogFormVisibleTap() {
        console.log('111')

        this.addDialogFormVisible = false
        this.addForm.doctorName = ''
        this.addForm.doctorMobile = ''
        this.addForm.doctorType = ''
        this.addForm.sysProvince = ''
        this.addForm.sysCity = ''
        this.addForm.sysHosp = ''
        this.addForm.sysHospDept = ''
        this.addForm.titleName = ''
        this.addForm.saler = ''
        this.doctorId = ''
        this.provinceName = ''
        this.cityName = ''
        this.hospitalNameNew = ''
        this.doctorTypeName = ''
        this.doctorTitleName = ''
        this.departmentDictName = ''
        this.newUserName = ''
        this.userName = ''
        this.hospitalName = ''
        this.cityList = ''
        this.hospitalListNew = ''

      },
      // 取消编辑弹窗
      editDialogFormVisibleTap() {
        console.log('111')
        this.editDialogFormVisible = false
        this.addDialogFormVisible = false
        this.addForm.doctorName = ''
        this.addForm.doctorMobile = ''
        this.addForm.doctorType = ''
        this.addForm.sysProvince = ''
        this.addForm.sysCity = ''
        this.addForm.sysHosp = ''
        this.addForm.sysHospDept = ''
        this.addForm.titleName = ''
        this.addForm.saler = ''
        this.doctorId = ''
        this.provinceName = ''
        this.cityName = ''
        this.hospitalNameNew = ''
        this.doctorTypeName = ''
        this.doctorTitleName = ''
        this.departmentDictName = ''
        this.newUserName = ''
        this.userName = ''
        this.hospitalName = ''
        this.cityList = ''
        this.hospitalListNew = ''

      },

      // 显示编辑用户对话框
      showEditDialog(row, type) {
        console.log(row)
        this.editDialogFormVisible = true
        this.loading = true
        let userListData = {
          doctorId: row.doctorId
        }
        let url = '/web/v1.0/base/doctor/doctor-info'
        api.get(url, userListData).then(response => {
          console.log('信息!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {

              let doctorInfo = response.data.doctorInfo
              this.doctorId = doctorInfo.doctorId
              this.addForm.doctorName = doctorInfo.doctorName
              this.addForm.doctorMobile = doctorInfo.doctorMobile
              this.addForm.doctorType = doctorInfo.doctorTypeCode
              this.doctorTypeName = doctorInfo.doctorType
              this.addForm.sysProvince = doctorInfo.sysProvinceId
              this.provinceName = doctorInfo.sysProvince

              this.addForm.sysCity = doctorInfo.sysCityId
              this.cityName = doctorInfo.sysCity

              this.addForm.sysHosp = doctorInfo.sysHospId
              this.hospitalNameNew = doctorInfo.sysHosp

              this.addForm.sysHospDept = doctorInfo.sysHospDeptCode
              this.departmentDictName = doctorInfo.sysHospDept

              this.addForm.titleName = doctorInfo.titleNameCode
              this.doctorTitleName = doctorInfo.titleName

              this.addForm.saler = doctorInfo.salerId
              this.newUserName = doctorInfo.saler

              for (let i = 0; i < this.provinceList.length; i++) {
                if (this.provinceList[i].provinceId == doctorInfo.sysProvinceId) {
                  this.cityList = this.provinceList[i].cityList
                }
              }
              for (let i = 0; i < this.cityList.length; i++) {
                if (this.cityList[i].cityId == doctorInfo.sysCityId) {
                  this.hospitalListNew = this.cityList[i].hospitalList
                }
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
      // 初始化表格数据
      ExportListTap() {
        this.loading = true
        this.paginaSel = 0
        let userListData = {
          salerName:this.userListData.salerName,
          doctorName:this.userListData.doctorName,
          hospitalId:this.userListData.hospitalId
        }

        console.log('userListData=', userListData)
        let url = '/web/v1.0/base/doctor/doctor-export'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.doctorList
              this.ExportList = list
              this.handleDownload(this.ExportList);
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
      // 导出
      handleDownload(ExportList) {
        this.downloadLoading = true

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['医生姓名', '手机号', '所属省', '所属市', '所属医院', '科室', '职称', '医生处方量', '所属销售', '录入时间']
          const filterVal = ['doctorName', 'doctorMobile', 'sysProvince', 'sysCity', 'sysHosp', 'sysHospDept', 'titleName', 'recordRecipe', 'saler', 'createDt']
          const list = ExportList
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '导出医生列表',
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
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
