<template>
  <div class="user">
    <div style="padding: 20px">正在研发...</div>

    <!--    <el-row>-->
<!--      <el-col :span="24" style="margin-top: 20px;">-->
<!--        <el-input style="margin-left: 1%;" placeholder="会议名称查询" class="search-input" v-model="userListData.conferenceName"></el-input>-->
<!--        <el-select style="margin-left: 1%;" v-model="indicationName"    @clear="indicatNull" clearable placeholder="适应症查询" @change="">-->

<!--          <el-option-->
<!--            v-for="(item,index) in indicationList"-->
<!--            :key="item.dictCode"-->
<!--            :label="item.dictName"-->
<!--            :value="item.dictCode"-->
<!--            :style="'width:100%;'"-->
<!--            @click.native="indicatTap(index)"></el-option>-->
<!--        </el-select>-->

<!--        <el-select style="margin-left: 1%;" v-model="conferenceTypeName"    @clear="conferTypeNull" clearable placeholder="会议类型查询" @change="">-->

<!--          <el-option-->
<!--            v-for="(item,index) in conferenceTypeList"-->
<!--            :key="item.dictCode"-->
<!--            :label="item.dictName"-->
<!--            :value="item.dictCode"-->
<!--            :style="'width:100%;'"-->
<!--            @click.native="conferenceTap(index)"></el-option>-->
<!--        </el-select>-->


<!--        <el-date-picker-->
<!--          v-model="conferenceDateBegin"-->
<!--          type="date"-->
<!--          :editable=false-->
<!--          value-format="yyyy-MM-dd"-->
<!--          :picker-options="pickerOptionscreate"-->
<!--          placeholder="开始时间" @change="change1"-->
<!--          style="margin-left: 1%;"-->
<!--        >-->
<!--        </el-date-picker>-->
<!--        <span> - </span>-->
<!--        <el-date-picker-->
<!--          v-model="conferenceDateEnd"-->
<!--          type="date"-->
<!--          :editable=false-->
<!--          value-format="yyyy-MM-dd"-->
<!--          :picker-options="pickerOptionsend"-->
<!--          placeholder="结束时间" @change="change2"-->

<!--        >-->
<!--        </el-date-picker>-->


<!--        &lt;!&ndash;        <el-button type="primary" slot="append" ></el-button>&ndash;&gt;-->
<!--        <el-button  type="primary" style="margin-left: 1%;" @click="ChaxunTap">查询</el-button>-->
<!--&lt;!&ndash;        <el-button type="primary" @click="ExportListTap">导出</el-button>&ndash;&gt;-->
<!--        <el-button type="primary" @click="addDialogFormVisible=true">创建会议</el-button>-->
<!--      </el-col>-->
<!--    </el-row>-->

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
<!--        prop="conferenceName"-->
<!--        label="会议名称"-->
<!--        align="center"-->
<!--        width="100">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="indication"-->
<!--        label="适应症"-->
<!--        align="center"-->
<!--        width="100">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="conferenceType"-->
<!--        label="会议类型"-->
<!--        align="center"-->
<!--        width="150">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="conferencePlace"-->
<!--        label="会议地点"-->
<!--        align="center"-->
<!--        width="150">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="conferenceDateBegin"-->
<!--        label="会议开始时间"-->
<!--        align="center"-->
<!--        width="150">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="conferenceDateEnd"-->
<!--        label="会议结束时间"-->
<!--        align="center"-->
<!--        width="150">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="conferenceChairman"-->
<!--        label="参会主席"-->
<!--        align="center"-->
<!--        width="150">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="conferenceLecturer"-->
<!--        label="参会讲师"-->
<!--        align="center"-->
<!--        width="150">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="createDt"-->
<!--        label="录入时间"-->
<!--        align="center"-->
<!--        width="150">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="conferenceStatus"-->
<!--        label="状态"-->
<!--        align="center"-->
<!--        width="80">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="isSummary"-->
<!--        label="总结"-->
<!--        align="center"-->
<!--        width="80">-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button size="mini" type="primary" plain @click="showEditDialog(scope.row,1)">编辑</el-button>-->
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
<!--    &lt;!&ndash;添加用户对话框:&ndash;&gt;-->
<!--    <el-dialog title="创建会议" :visible.sync="addDialogFormVisible" @close="addDialogFormVisibleTap">-->
<!--      <el-form :model="addForm" label-width="80px" ref="addUserForm">-->
<!--        <el-form-item label="会议名称" prop="doctorName">-->
<!--          <el-input v-model="addForm.doctorName" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="手机号" prop="doctorMobile">-->
<!--          <el-input v-model="addForm.doctorMobile" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="医生类型">-->
<!--          <el-select v-model="doctorTypeName"  filterable placeholder="请选择医生类型" @change="">-->
<!--            <el-option-->
<!--              v-for="(item,index) in doctorTypeList"-->
<!--              :key="item.dictCode"-->
<!--              :label="item.dictName"-->
<!--              :value="item.dictCode"-->
<!--              @click.native="doctorTypeSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="所属地区">-->
<!--          <el-select v-model="provinceName"  placeholder="请选择所属省" @change="getRegion($event)">-->
<!--            <el-option-->
<!--              v-for="(item,index) in provinceList"-->
<!--              :key="item.provinceId"-->
<!--              :label="item.provinceName"-->
<!--              :value="item.provinceId"-->
<!--              :style="'width:100%;'"-->
<!--              @click.native="handprovinceSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--          <span> - </span>-->
<!--          <el-select v-model="cityName" filterable placeholder="请选择所属市" :loading="loading">-->
<!--            <el-option-->
<!--              v-for="(item,index) in cityList"-->
<!--              :key="item.cityId"-->
<!--              :label="item.cityName"-->
<!--              :value="item.cityId"-->
<!--              @click.native="handcitySelect(index)"></el-option>-->
<!--          </el-select>-->
<!--          <span> - </span>-->
<!--          <el-select v-model="hospitalNameNew" filterable placeholder="请选择所属医院" :loading="loading">-->
<!--            <el-option-->
<!--              v-for="(item,index) in hospitalListNew"-->
<!--              :key="item.hospitalId"-->
<!--              :label="item.hospitalName"-->
<!--              :value="item.hospitalId"-->
<!--              @click.native="handhospitalSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="科室">-->
<!--          <el-select v-model="departmentDictName"  filterable placeholder="请选择科室类型" @change="">-->
<!--            <el-option-->
<!--              v-for="(item,index) in departmentDictList"-->
<!--              :key="item.dictCode"-->
<!--              :label="item.dictName"-->
<!--              :value="item.dictCode"-->
<!--              @click.native="departmentDictSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="职称">-->
<!--          <el-select v-model="doctorTitleName"  filterable placeholder="请选择职称" @change="">-->
<!--            <el-option-->
<!--              v-for="(item,index) in doctorTitleList"-->
<!--              :key="item.dictCode"-->
<!--              :label="item.dictName"-->
<!--              :value="item.dictCode"-->
<!--              @click.native="doctorTitleSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="所属销售">-->
<!--          <el-select v-model="newUserName"  placeholder="请选择所属销售">-->
<!--            <div class="el-input" style="width:90%;margin-left:5%;">-->
<!--              <input type="text" placeholder="销售姓名查询" class="el-input__inner" v-model="userName">-->
<!--            </div>-->
<!--            <el-option-->
<!--              v-for="(item,index) in newUserList"-->
<!--              :key="item.userId"-->
<!--              :label="item.userName"-->
<!--              :value="item.userId"-->
<!--              @click.native="newUserListSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->


<!--      </el-form>-->
<!--      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">-->
<!--        <el-button @click="addDialogFormVisibleTap">取 消</el-button>-->
<!--        <el-button type="primary" @click="addUserSubmit()">保存</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--    &lt;!&ndash; 编辑用户对话框 &ndash;&gt;-->
<!--    <el-dialog title="编辑会议" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>-->
<!--      <el-form :model="addForm" label-width="80px" ref="addUserForm">-->
<!--        <el-form-item label="医生姓名" prop="doctorName">-->
<!--          <el-input v-model="addForm.doctorName" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="手机号" prop="doctorMobile">-->
<!--          <el-input v-model="addForm.doctorMobile" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="医生类型">-->
<!--          <el-select v-model="doctorTypeName"  filterable placeholder="请选择医生类型" @change="">-->
<!--            <el-option-->
<!--              v-for="(item,index) in doctorTypeList"-->
<!--              :key="item.dictCode"-->
<!--              :label="item.dictName"-->
<!--              :value="item.dictCode"-->
<!--              @click.native="doctorTypeSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="所属地区">-->
<!--          <el-select v-model="provinceName"  placeholder="请选择所属省" @change="getRegion($event)">-->
<!--            <el-option-->
<!--              v-for="(item,index) in provinceList"-->
<!--              :key="item.provinceId"-->
<!--              :label="item.provinceName"-->
<!--              :value="item.provinceId"-->
<!--              :style="'width:100%;'"-->
<!--              @click.native="handprovinceSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--          <span> - </span>-->
<!--          <el-select v-model="cityName" filterable placeholder="请选择所属市" :loading="loading">-->
<!--            <el-option-->
<!--              v-for="(item,index) in cityList"-->
<!--              :key="item.cityId"-->
<!--              :label="item.cityName"-->
<!--              :value="item.cityId"-->
<!--              @click.native="handcitySelect(index)"></el-option>-->
<!--          </el-select>-->
<!--          <span> - </span>-->
<!--          <el-select v-model="hospitalNameNew" filterable placeholder="请选择所属医院" :loading="loading">-->
<!--            <el-option-->
<!--              v-for="(item,index) in hospitalListNew"-->
<!--              :key="item.hospitalId"-->
<!--              :label="item.hospitalName"-->
<!--              :value="item.hospitalId"-->
<!--              @click.native="handhospitalSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="科室">-->
<!--          <el-select v-model="departmentDictName"  filterable placeholder="请选择科室类型" @change="">-->
<!--            <el-option-->
<!--              v-for="(item,index) in departmentDictList"-->
<!--              :key="item.dictCode"-->
<!--              :label="item.dictName"-->
<!--              :value="item.dictCode"-->
<!--              @click.native="departmentDictSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="职称">-->
<!--          <el-select v-model="doctorTitleName"  filterable placeholder="请选择职称" @change="">-->
<!--            <el-option-->
<!--              v-for="(item,index) in doctorTitleList"-->
<!--              :key="item.dictCode"-->
<!--              :label="item.dictName"-->
<!--              :value="item.dictCode"-->
<!--              @click.native="doctorTitleSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="所属销售">-->
<!--          <el-select v-model="newUserName"  placeholder="请选择所属销售">-->
<!--            <div class="el-input" style="width:90%;margin-left:5%;">-->
<!--              <input type="text" placeholder="销售姓名查询" class="el-input__inner" v-model="userName">-->
<!--            </div>-->
<!--            <el-option-->
<!--              v-for="(item,index) in newUserList"-->
<!--              :key="item.userId"-->
<!--              :label="item.userName"-->
<!--              :value="item.userId"-->
<!--              @click.native="newUserListSelect(index)"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->


<!--      </el-form>-->
<!--      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">-->
<!--        <el-button @click="editDialogFormVisibleTap">取 消</el-button>-->
<!--        <el-button type="primary" @click="addUserSubmit()">保存</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";
  import {parseTime} from "@/utils";
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
      let that = this;
      return {
        pickerOptionscreate: {
          disabledDate(time) { //开始时间的禁用
            if(that.conferenceDateEnd != null){
              return time.getTime() > new Date(that.conferenceDateEnd).getTime();

            }
          }
        },
        //结束时间
        pickerOptionsend: {
          disabledDate(time) { //结束时间的禁用
            return time.getTime() <new Date(that.conferenceDateBegin).getTime()-8.64e7;
          }
        },

        conferenceDateBegin: '', //起始时间
        conferenceDateEnd: '', //结束时间
        indicationList: [],//适应症
        indicationName: '',//三方会名称
        conferenceTypeList: [],//三方会类型
        conferenceTypeName: '',//三方会名称
        provinceList:[],
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
        doctorId:'',//医生ID
        ExportList:[],//导出列表
        userListData: {
          conferenceName: '',
          conferenceDateBegin: '',
          conferenceDateEnd: '',
          conferenceType: '',
          indication: '',
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
        addDialogFormVisible: false,
        addForm: {
          conferenceId: '',//会议id
          conferenceName: '',//会议名称
          conferenceType: '',//会议类型（字典项）
          conferencePlace: '',//会议地点
          conferenceDateBegin: '',//开始时间
          conferenceDateEnd: '',//结束时间
          estimateNumber: '',//预计人数
          indication: '',//适应症(三方会特有)(字典)
          chairmanList: '',//参会主席id lis
          lecturerList: '',//参会讲师id list
          scheduleList: '',//日程list
        },
        editDialogFormVisible: false,
        grantDialogFormVisible: false,


      }
    },


    mounted: function () {

    },
    watch: {
      "userListData.conferenceName"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.conferenceDateEnd"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.conferenceDateBegin"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.indication"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.conferenceType"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
    },
    created() {
      this.initList()
      this.indicationTap()//三方会类型字典项
      this.SanfangTypeTap()//三方会类型字典项
    },
    methods: {
      // 开始时间
      change1: function() {
        console.log('this.conferenceDateBegin=', this.conferenceDateBegin)
        this.userListData.conferenceDateBegin = this.conferenceDateBegin;
      },
      // 结束时间
      change2: function() {
        console.log('conferenceDateEnd=', this.conferenceDateEnd)
        this.userListData.conferenceDateEnd = this.conferenceDateEnd;
      },

      // 适应症字典项
      indicationTap() {
        this.loading = true
        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/conference/indication-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let indicationList = response.data.indicationList
              this.indicationList = indicationList
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
      // 清空适应症
      indicatNull(val) {
        this.indicationName='';
        this.userListData.indication = '';
      },
      // 选择适应症
      indicatTap(index) {
        console.log('区域下标=', index)
        this.userListData.indication = this.indicationList[index].dictCode
        this.indicationName = this.indicationList[index].dictName

      },
      // 三方会类型字典项
      SanfangTypeTap() {
        this.loading = true
        let userListData = {};
        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/conference/third-conference-type-select'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let conferenceTypeList = response.data.conferenceTypeList
              this.conferenceTypeList = conferenceTypeList
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
      // 清空三方会类型
      conferTypeNull(val) {
        this.conferenceTypeName='';
        this.userListData.conferenceType = '';
      },
      // 三方会类型查询
      conferenceTap(index) {
        console.log('区域下标=', index)
        this.userListData.conferenceType = this.conferenceTypeList[index].dictCode
        this.conferenceTypeName = this.conferenceTypeList[index].dictName
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

      // 初始化表格数据
      initList() {
        this.loading = true
        this.paginaSel = 0
        let userListData = {}
        if(this.userListData.conferenceDateBegin == null){

          this.userListData.conferenceDateBegin = ''
        }
        if(this.userListData.conferenceDateEnd == null){
          this.userListData.conferenceDateEnd = ''
        }
        userListData = this.userListData

        console.log('userListData=', userListData)
        let url = '/web/v1.0/conference/conference/third-conference-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.conferenceList.items
              this.totalCount = response.data.conferenceList.totalCount
              console.log('返回值!list=', list)
              this.total = response.data.conferenceList.totalCount
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
              this.initList();

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
          // if(response.code){
          //   this.$store.dispatch('user/resetToken')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
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
