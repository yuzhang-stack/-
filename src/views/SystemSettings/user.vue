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
      <el-col :span="24" style="margin-top: 20px;">
        <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
        <!--        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList"></el-input>-->
        <el-input style="margin-left: 1%;" placeholder="CWID查询" class="search-input" v-model="userListData.userIdentifier"></el-input>
        <el-input style="margin-left: 1%;" placeholder="用户姓名查询" class="search-input" v-model="userListData.userName"></el-input>
        <!--        <el-button type="primary" slot="append" ></el-button>-->
        <el-button style="margin-left: 1%;" type="primary" @click="ChaxunTap">查询</el-button>
        <el-button style="margin-left: 1%;" type="primary" @click="daoVisible=true">导入</el-button>
        <el-button style="margin-left: 1%;" type="primary" @click="addDialogFormVisible=true">添加用户</el-button>
        <el-button style="margin-left: 1%;" type="primary" @click="ChongzhiTap">重置</el-button>

      </el-col>
    </el-row>
    <!--    <el-table-->
    <!--      class="margin-20"-->
    <!--      v-loading="loading"-->
    <!--      :data="userList"-->
    <!--      ref="queryHeight"-->
    <!--      border-->
    <!--      :height="tableHeight"-->
    <!--      style="width: 100%">-->
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
        prop="userIdentifier"
        label="CWID号"
        width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="userEmail"
        label="邮箱"
        align="center"
        width="160">
      </el-table-column>
      <el-table-column
        prop="userMobile"
        label="手机号"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createDt"
        label="创建时间"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="regionItem"
        label="所属大区"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="regionItemArea"
        label="所属地区"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="userRole"
        label="所属角色"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="userDepartment"
        label="所属部门"
        align="center"
        width="120">
      </el-table-column>

      <el-table-column label="用户状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isEnable" @change="changeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="showEditDialog(scope.row,1)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="showPingDialog(scope.row)">平调</el-button>
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

    <!--导入对话框:-->
    <el-dialog title="导入用户" :visible.sync="daoVisible" @close="daoVisibleTap">
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
        <div style="width: 50%;margin-left:20px; " v-if="userListNew.length != 0">
          <div style="text-align: center" >重复导入的用户</div>
          <el-table
            class="margin-20"
            v-loading="loading"
            :data="userListNew"
            border
            style="width: 100%;overflow:auto;height: 180px;">
            <el-table-column
              prop="CWID"
              width="220"
              label="CWID"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="userName"
              label="姓名"
              align="center"
              width="220">
            </el-table-column>

          </el-table>
        </div>
      </div>
      <div style="font-size: 12px;line-height: 40px ">注：所属大区、所属地区、所属角色，均需为已有数据
        <el-button style="margin-left: 1%;background: #f4b454!important;" type="warning" @click="downloadFile">下载模板</el-button>
      </div>
      <div style="margin: 0 auto!important;text-align: center;margin-top: 20px!important;" class="dialog-footer">
        <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
        <el-button @click="daoVisibleTap" >取消</el-button>
      </div>
    </el-dialog>
    <!--导入对话框:-->
<!--    <el-dialog title="导入用户" :visible.sync="daoVisible" @close="daoVisibleTap">-->

<!--      <el-upload drag-->
<!--                 :limit=limitNum-->

<!--                 :action="UploadUrl()"-->
<!--                 :before-upload="beforeUploadFile"-->
<!--                 accept=".xlsx, .xls"-->
<!--                 :on-exceed="exceedFile"-->
<!--                 :before-remove="beforeRemove"-->
<!--                 :on-success="handleSuccess"-->
<!--                 :on-error="handleError"-->
<!--                 :file-list="fileList"-->
<!--      >-->

<!--        <i class="el-icon-upload"></i>-->
<!--        <div class="el-upload__text">将文件拖到此处，或<em>点击选择文件</em></div>-->
<!--        <div class="el-upload__tip" slot="tip">只能上传.xlsx或.xls文件！（且只可单一文件上传）</div>-->
<!--      </el-upload>-->

<!--      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">-->
<!--        &lt;!&ndash;        <el-button @click="daoVisibleTap">取 消</el-button>&ndash;&gt;-->
<!--        &lt;!&ndash;        <el-button type="primary" @click="addUserSubmit()">保存</el-button>&ndash;&gt;-->

<!--        <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>-->
<!--        <el-button @click="daoVisibleTap" >取消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
    <!--    平调对话框-->
    <el-dialog class="el-dialog-taq" title="客户平调" :visible.sync="pingDialogFormVisible"
               @close="pingDialogFormVisibleTap">

      <div style="display: flex;">
        <!--        客户-->
        <div class="kehu-taq">
          <div style="font-size: 16px;color: #666;margin-bottom: 10px">客户列表</div>
          <el-col :span="24" class="kehu-taq-fir">
            <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
            <!--        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList"></el-input>-->
            <el-input placeholder="客户名称查询" v-model="doctorName" class=" search-taq">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button style="" type="primary" @click="doctorTap">查询</el-button>
          </el-col>
          <div v-if="doctorList.length == 0" class="el-dialog-taq-fir">无更多客户！</div>
                    <div v-if="doctorList.length != 0" class="det-taq-fir-d"style="margin-left: 50px">
                      <img v-if="checked" class="det-taq-fir-e-img" @click='cheAllSel()' src="../..//assets/images/doc-00.png"
                           alt=""/>
                      <div v-if="!checked" class="det-taq-fir-e" @click='cheAllSel()'></div>
                      <div class="let" @click='cheAllSel()'>全选</div>
                    </div>
                    <ul class="infinite-list" style="overflow:auto;height: 400px">
                      <div style="margin-bottom: 20px;display: flex;align-items: center;padding-left: 50px" v-for='(item, index) in doctorList' :key="index"
                           class="infinite-list-item">
                        <div v-if="!item.isChecked" class="det-taq-fir-e" @click='checkedOne(index)'></div>
                        <img v-if="item.isChecked" class="det-taq-fir-e-img" @click='checkedOne(index)'
                             src="../..//assets/images/doc-00.png" alt=""/>
                        <div class="det-taq-fir-d" @click='checkedOne(index)'>{{item.doctorName}} - {{item.hospital}}-
                          {{item.department}}
                        </div>
                      </div>
                    </ul>
<!--          <div v-if="doctorList.length != 0" class="det-taq-fir-d disf">-->
<!--            <img v-if="checked" class="det-taq-fir-e-img" @click='cheAllSel()' src="../..//assets/images/doc-00.png"-->
<!--                 alt=""/>-->
<!--            <div v-if="!checked" class="det-taq-fir-e" @click='cheAllSel()'></div>-->
<!--            <div class="let" @click='cheAllSel()'>全选</div>-->
<!--          </div>-->
<!--          <happy-scroll color="rgba(0,0,0,0.5)" size="5">-->
<!--            <div class="con" style="height:300px">-->

<!--              <div v-if="doctorList.length != 0" class="det-taq-fir-c" v-for='(item, index) in doctorList' :key="index">-->
<!--                <div v-if="!item.isChecked" class="det-taq-fir-e" @click='checkedOne(index)'></div>-->
<!--                <img v-if="item.isChecked" class="det-taq-fir-e-img" @click='checkedOne(index)'-->
<!--                     src="../..//assets/images/doc-00.png" alt=""/>-->
<!--                <div class="det-taq-fir-d" @click='checkedOne(index)'>{{item.doctorName}} - {{item.hospital}}- -->
<!--                  {{item.department}}-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </happy-scroll>-->
        </div>
        <!--        销售-->
        <div class="kehu-taq none">
          <div style="font-size: 16px;color: #666;margin-bottom: 10px">销售列表</div>
          <el-col :span="24" class="kehu-taq-fir">
            <el-input placeholder="销售名称查询" v-model="userName" class=" search-taq">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button style="" type="primary" @click="marketListTapTap">查询</el-button>
          </el-col>
          <div v-if="newUserList.length == 0" class="el-dialog-taq-fir">无更多用户！</div>

          <ul class="infinite-list" style="overflow:auto;height: 400px">
            <div style="margin-bottom: 20px;display: flex;align-items: center;padding-left: 50px" v-for='(item, index) in newUserList' :key="index"
                 class="infinite-list-item">
              <div v-if="!item.isChecked" class="det-taq-fir-e" @click='checkTwo(index)'></div>
              <img v-if="item.isChecked" class="det-taq-fir-e-img" @click='checkTwo(index)'
                   src="../../assets/images/doc-00.png" alt=""/>
              <div class="det-taq-fir-d" @click='checkTwo(index)'>{{item.userName}} - {{item.userIdentifier}}</div>

            </div>

          </ul>
<!--          <happy-scroll color="rgba(0,0,0,0.5)" size="5">-->
<!--            <div class="con" style="height:300px;">-->
<!--              <div v-if="newUserList.length != 0" class="det-taq-fir-c letui" v-for='(itemT, indexT) in newUserList'-->
<!--                   :key="indexT">-->
<!--                <div v-if="!itemT.isChecked" class="det-taq-fir-e" @click='checkTwo(indexT)'></div>-->
<!--                <img v-if="itemT.isChecked" class="det-taq-fir-e-img" @click='checkTwo(indexT)'-->
<!--                     src="../../assets/images/doc-00.png" alt=""/>-->
<!--               -->
<!--                <div class="det-taq-fir-d" @click='checkTwo(indexT)'>{{itemT.userName}} - {{itemT.userIdentifier}}</div>-->
<!--              -->
<!--              -->
<!--              </div>-->

<!--            </div>-->
<!--          </happy-scroll>-->
        </div>
      </div>


      <div style="margin: 0 auto!important;text-align: center;margin-top: 10px" class="dialog-footer">
        <el-button @click="pingDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="pingUserSubmit(1)">平调</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户对话框:rules="rules" -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" @close="addDialogFormVisibleTap">
      <el-form :model="addForm" label-width="80px" ref="addUserForm">
        <el-form-item label="CWID" prop="CWID">
          <el-input v-model="addForm.CWID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="addForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userMobile">
          <el-input v-model="addForm.userMobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="addForm.userEmail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属角色">
          <el-select v-model="roleName" filterable placeholder="请选择角色">
            <el-option
              v-for="(role, index) in roleList"
              :key="role.roleId"
              :label="role.roleName"
              :value="role.roleId"
              @click.native="roleListSelect(index)"></el-option>
          </el-select>
        </el-form-item >
        <el-form-item label="所属大区" v-if="roleName == '地区经理' || roleName == '销售'">
          <el-select v-model="regionName"  filterable placeholder="请选择所属区域" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in regionList"
              :key="item.regionId"
              :label="item.regionName"
              :value="item.regionId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select  v-model="regionItemName" filterable
                     placeholder="请选择所属大区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemList"
              :key="item.regionItemId"
              :label="item.regionItemName"
              :value="item.regionItemId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
          <span v-if="regionItemAreaList.length != 0 "> - </span>
          <el-select v-if="regionItemAreaList.length != 0" v-model="regionItemAreaName" filterable
                     placeholder="请选择所属地区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemAreaList"
              :key="item.regionItemAreaId"
              :label="item.regionItemAreaName"
              :value="item.regionItemAreaId"
              @click.native="handArealeSelect(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属大区" v-if="roleName == '大区经理'">
          <el-select v-model="regionName" filterable clearable placeholder="请选择所属区域" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in regionList"
              :key="item.regionId"
              :label="item.regionName"
              :value="item.regionId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select  v-model="regionItemName" filterable
                      placeholder="请选择所属大区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemList"
              :key="item.regionItemId"
              :label="item.regionItemName"
              :value="item.regionItemId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门" prop="password">
          <el-input v-model="addForm.userDepartment" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="addDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit(1)">保存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible" @close='editDialogFormVisibleTap'>
      <el-form :model="addForm" label-width="80px" ref="addUserForm">
        <el-form-item label="CWID" prop="CWID">
          <el-input v-model="addForm.CWID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="addForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userMobile">
          <el-input v-model="addForm.userMobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="addForm.userEmail" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属角色">
          <el-select v-model="roleName" placeholder="请选择角色" filterable>
            <el-option
              v-for="(role, index) in roleList"
              :key="role.roleId"
              :label="role.roleName"
              :value="role.roleId"
              @click.native="roleListSelect(index)"></el-option>
          </el-select>
          <el-button style="margin-left: 10px" size="mini" type="danger" plain @click="showPingDialog('1')">平调</el-button>
          <el-tag style="color:#ff5346;font-size: 10px;margin-left: 10px">修改角色后是否进行客户转移</el-tag>
        </el-form-item>
        <el-form-item label="所属大区" v-if="roleName == '地区经理' || roleName == '销售'">
          <el-select filterable v-model="regionName"  placeholder="请选择所属区域" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in regionList"
              :key="item.regionId"
              :label="item.regionName"
              :value="item.regionId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select  filterable v-model="regionItemName"
                      placeholder="请选择所属大区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemList"
              :key="item.regionItemId"
              :label="item.regionItemName"
              :value="item.regionItemId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
          <span v-if="regionItemAreaList.length != 0 "> - </span>
          <el-select v-if="regionItemAreaList.length != 0" v-model="regionItemAreaName" filterable
                     placeholder="请选择所属地区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemAreaList"
              :key="item.regionItemAreaId"
              :label="item.regionItemAreaName"
              :value="item.regionItemAreaId"
              @click.native="handArealeSelect(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属大区" v-if="roleName == '大区经理'">
          <el-select v-model="regionName"  filterable placeholder="请选择所属区域" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in regionList"
              :key="item.regionId"
              :label="item.regionName"
              :value="item.regionId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select  v-model="regionItemName" filterable
                      placeholder="请选择所属大区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemList"
              :key="item.regionItemId"
              :label="item.regionItemName"
              :value="item.regionItemId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="password">
          <el-input v-model="addForm.userDepartment" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="editDialogFormVisibleTap">返 回</el-button>
        <el-button type="primary" @click="addUserSubmit(1)">保存</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible" @close='grantDialogFormVisibleTap'>
      <el-form :model="grantForm" label-width="120px">
        <el-form-item label="CWID：" prop="username">
          <el-tag type="info">{{this.addForm.CWID}}</el-tag>
        </el-form-item>
        <el-form-item label="当前的用户：" prop="username">
          <el-tag type="info">{{this.addForm.userName}}</el-tag>
        </el-form-item>
        <el-form-item label="请选择角色：">
          <el-select v-model="roleName" filterable placeholder="请选择角色">
            <el-option
              v-for="(role, index) in roleList"
              :key="index"
              :label="role.roleName"
              :value="role.roleId"
              @click.native="roleListSelect(index)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属大区" v-if="roleName == '地区经理' || roleName == '销售'">
          <el-select v-model="regionName" filterable clearable placeholder="请选择所属区域" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in regionList"
              :key="item.regionId"
              :label="item.regionName"
              :value="item.regionId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select  v-model="regionItemName" filterable
                      placeholder="请选择所属大区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemList"
              :key="item.regionItemId"
              :label="item.regionItemName"
              :value="item.regionItemId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
          <span v-if="regionItemAreaList.length != 0 "> - </span>
          <el-select v-if="regionItemAreaList.length != 0" v-model="regionItemAreaName" filterable
                     placeholder="请选择所属地区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemAreaList"
              :key="item.regionItemAreaId"
              :label="item.regionItemAreaName"
              :value="item.regionItemAreaId"
              @click.native="handArealeSelect(index)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属大区" v-if="roleName == '大区经理'">
          <el-select v-model="regionName" filterable clearable placeholder="请选择所属区域" @change="getRegion($event)">
            <el-option
              v-for="(item,index) in regionList"
              :key="item.regionId"
              :label="item.regionName"
              :value="item.regionId"
              :style="'width:100%;'"
              @click.native="handRegleSelect(index)"></el-option>
          </el-select>
          <span> - </span>
          <el-select  v-model="regionItemName" filterable
                      placeholder="请选择所属大区" :loading="loading">
            <el-option
              v-for="(item,index) in regionItemList"
              :key="item.regionItemId"
              :label="item.regionItemName"
              :value="item.regionItemId"
              @click.native="handGionleSelect(index)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin: 0 auto!important;text-align: center" class="dialog-footer">
        <el-button @click="grantDialogFormVisibleTap">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit(2)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../api/deliverProxy'
  import qs from "qs";
  import axios from "axios";
  import {getToken, removeToken} from "@/utils/auth";
  import {parseTime} from "@/utils";

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

        limitNum: 1,  // 上传excell时，同时允许上传的最大数
        fileList: [],   // excel文件列表
        // tableHeight: window.innerHeight - 300 || document.documentElement.clientHeight- 300 || document.body.clientHeight - 300,
        // （这里的240是减去表格上面导航和搜索条件的高度）,
        // 传参doctorIdList
        newUserList: [],//要接受平调的销售列表
        newUserId: '',//要接受平调的销售id
        doctorIdList: [],//全选
        checked: false,//全选
        scrollHeight: '0px',
        doctorList: [],
        doctorName: '',//客户列表模糊查询
        userName: '',//销售列表模糊查询
        userId: '',//用户ID
        userListData: {
          userIdentifier: '',
          userName: '',
          currentPage: 1,
          pageSize: 10,
        },
        filters: {
          value1: '',
          value2: ''
        },
        totalCount: 1,// 总数量
        regionList: [],//区域
        regionName: [],//区域名
        regionItemList: [],//大区
        regionItemAreaList: [],//地区
        regionItemName: '',//大区名称
        regionItemAreaName: '',//地区名称
        roleName: '',//角色
        loading: true,
        userList: [],
        query: '',
        total: 0,
        pagesize: 10,
        pagenum: 1,
        addDialogFormVisible: false,
        daoVisible:false,//导入
        userListNew:[],//导入重复的用户
        addForm: {
          CWID: '',
          userName: '',
          userEmail: '',
          userMobile: '',
          userRegionItem: '',
          userRegionItemArea: '',
          roleId: '',
          userDepartment: ''
        },
        editDialogFormVisible: false,
        pingDialogFormVisible: false,
        editForm: {
          CWID: '',
          userName: '',
          userEmail: '',
          userMobile: '',
          userRegionItem: '',
          userRegionItemArea: '',
          roleId: '',
          userDepartment: '',
          id: 0
        },
        grantDialogFormVisible: false,
        grantForm: {},
        roleList: [],
        roleId: '',
        // 添加用户的表单验证
        rules: {
          // CWID: [
          //   { required: true, message: '请输入CWID', trigger: 'blur' }
          // ],
          // username: [
          //   { required: true, message: '请输入用户名', trigger: 'blur' }
          // ],
          // userMobile: [
          //   { required: true, message: '请输入手机号', trigger: 'blur' }
          // ],
          //
          // userEmail: [
          //   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          //   { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          // ],
          // userRegionItem: [
          //   { required: true, message: '请选择所属大区', trigger: 'blur' }
          // ],
          // roleId: [
          //   { required: true, message: '请选择所属角色', trigger: 'blur' }
          // ],
        },

      }
    },


    mounted: function () {
      this.scrollHeight = window.innerHeight * 0.7 + 'px';
      // const that = this
      // window.onresize = () => {
      //   return (() => {
      //     window.tableHeight = window.innerHeight - 300 || document.documentElement.clientHeight- 300 || document.body.clientHeight- 300
      //     that.tableHeight = window.tableHeight - that.$refs.queryHeight.offsetHeight - 300
      //   })()
      // }
    },

    watch: {
      // userListData: {
      //   userIdentifier: '',
      //   userName: '',
      //   currentPage: 1,
      //   pageSize: 10,
      // },
      "userListData.userIdentifier"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "userListData.userName"() {
        delay(() => {
          this.userListData.currentPage = 1
          this.initList();
        }, 500);
      },
      "doctorName"() {
        delay(() => {
          this.doctorTap();
        }, 500);
      },
      "userName"() {
        delay(() => {
          this.marketListTapTap();
        }, 500);
      }

    },
    created() {
      this.initList()
      this.regionListTap()
      this.rolepageTap()
    },
    methods: {
      // 下载模板CWID	用户姓名	用户邮箱	用户手机号	所属大区	所属地区	所属角色	所属部门
      downloadFile() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['CWID', '用户姓名', '用户邮箱', '用户手机号', '所属大区', '所属地区', '所属角色', '所属部门',]
          const filterVal = ['doctorName', 'doctorMobile', 'sysProvince', 'sysCity', 'sysHosp', 'sysHospDept',  'recordRecipe', 'saler',]
          const list = []
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用户列表模板',
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
      },

      daoVisibleTap(){
        this.daoVisible = false

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

      // 删除文件
      beforeRemove() {
        this.fileList = []
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
        let url = '/web/v1.0/system/user/excel_to_db'
        api.post(url, {}, userListData).then(response => {
          console.log('response=', response)
          this.initList()

          if (response.code == '200') {
            this.loading = false
            if (response.status == 'success') {
              if(response.data.userList != undefined && response.data.userList.length != 0){
                this.userListNew = response.data.userList
              }else {
                this.daoVisible=false
                this.userListNew = []

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




      // 重置
      ChongzhiTap(){
        this.userListData.userIdentifier = ''
        this.userListData.userName = ''
        this.userListData.currentPage = 1
        this.initList();
      },
      // 区域选择
      handRegleSelect(index) {
        console.log('区域=', index)
        this.regionItemList = this.regionList[index].regionItemList
        console.log('默认第一个大区列表=', this.regionList[index].regionItemList)
        console.log('默认第一个大区名称=', this.regionList[index].regionItemList[0].regionItemName)
        // console.log('默认第一个地区列表=',this.regionList[index].regionItemList[0].regionItemAreaList)
        // console.log('所属地区列表=',this.regionList[index].regionItemList[0])
        // console.log('默认第一个地区名称=',this.regionList[index].regionItemList[0].regionItemAreaList[0].regionItemAreaName)
        // 判断是否有大区
        if (this.regionList[index].regionItemList.length != 0) {
          this.regionItemList = this.regionList[index].regionItemList
          this.addForm.userRegionItem = this.regionList[index].regionItemList[0].regionItemId//默认选中大区ID
          this.regionItemName = this.regionList[index].regionItemList[0].regionItemName//默认选中大区ID
        } else {
          this.regionItemList = []
          this.regionItemName = ''
          this.addForm.userRegionItem = ''
        }

        // 判断是否有地区
        console.log('length=', this.regionList[index].regionItemList[0].regionItemAreaList.length)

        if (this.regionList[index].regionItemList[0].regionItemAreaList.length != 0) {
          //默认选中地区ID
          this.regionItemAreaList = this.regionList[index].regionItemList[0].regionItemAreaList
          this.regionItemAreaName = this.regionList[index].regionItemList[0].regionItemAreaList[0].regionItemAreaName
          this.addForm.userRegionItemArea = this.regionList[index].regionItemList[0].regionItemAreaList[0].regionItemAreaId//默认选中地区ID
          console.log('第一个地区=', this.regionList[index].regionItemList[0].regionItemAreaList[0])
          console.log('地区ID=', this.addForm.userRegionItemArea)
        } else {
          this.regionItemAreaList = []
          this.regionItemAreaName = ''
          this.addForm.userRegionItemArea = ''
        }

        console.log('addForm=', this.addForm)

      },
      // 大区选择
      handGionleSelect(index) {
        console.log('大区=', index)

        this.regionItemName = this.regionItemList[index].regionItemName
        this.addForm.userRegionItem = this.regionItemList[index].regionItemId

        if (this.regionItemList[index].regionItemAreaList.length != 0) {
          this.regionItemAreaList = this.regionItemList[index].regionItemAreaList
          this.addForm.userRegionItemArea = this.regionItemList[index].regionItemAreaList[0].regionItemAreaId//默认选中地区ID
          this.regionItemAreaName = this.regionItemList[index].regionItemAreaList[0].regionItemAreaName
        } else {
          this.regionItemAreaList = []
          this.addForm.userRegionItemArea = ""
          this.regionItemAreaName = ""
        }

        console.log('addForm=', this.addForm)

      },
      // 地区选择
      handArealeSelect(index) {
        console.log('地区=', index)
        this.addForm.userRegionItemArea = this.regionItemAreaList[index].regionItemAreaId
        this.regionItemAreaName = this.regionItemAreaList[index].regionItemAreaName
        console.log('addForm=', this.addForm)

      },
      // 角色选择
      roleListSelect(index) {
        this.addForm.roleId = this.roleList[index].roleId
        this.roleName = this.roleList[index].roleName
        if(this.roleName == '销售' || this.roleName == '地区经理'){
          if(this.regionItemAreaName == ''){
            this.regionItemAreaList = this.regionItemList[0].regionItemAreaList
            this.regionItemAreaName = this.regionItemList[0].regionItemAreaList[0].regionItemAreaName
            this.addForm.userRegionItemArea = this.regionItemList[0].regionItemAreaList[0].regionItemAreaId//默认选中地区ID

          }

        }
        // if(roleName)
        console.log('角色=', this.roleName)
        console.log('角色id=', this.addForm.roleId)

      },
      // 区域选择
      getRegion(prov) {
        console.log('区域ID=', prov)
        // this.regionItemList = this.regionList[prov].regionItemList
        // console.log('regionItemList=',this.regionItemList)

      },
      // 设置每页条数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.userListData.pageSize = val
        this.initList()
      },
      // 取消平调弹窗
      pingDialogFormVisibleTap() {
        this.pingDialogFormVisible = false
        this.doctorName = '';
        this.userName = '';
        // this.userId = '';
        // this.newUserId = '';
        // this.checked = false;
        // this.doctorIdList = [];
      },
      //平调对话框
      showPingDialog(row) {
        console.log(row)
        if(row == '1'){
          this.doctorListTap(this.userId, '')
        }else {
          this.userId = row.userId
          this.doctorListTap(row.userId, '')
        }



      },
      // 单选销售
      checkTwo(indexT) {
        // 先取消所有选中项
        this.newUserList.forEach((item) => {
          item.isChecked = false;
        });
        //再设置当前点击项选中
        this.newUserId = this.newUserList[indexT].userId;
        // 设置值，以供传递
        this.newUserList[indexT].isChecked = true;
        // console.log(this.radioTwo);
      },
      // 全选
      cheAllSel() {
        if (this.checked) {
          this.doctorIdList = [];
          for (let i = 0; i < this.doctorList.length; i++) {
            this.doctorList[i].isChecked = false
          }
        } else {
          this.doctorIdList = [];
          for (let i = 0; i < this.doctorList.length; i++) {
            this.doctorList[i].isChecked = true
            this.doctorIdList.push(this.doctorList[i].doctorId)
          }
        }
        // for (let i = 0; i < this.doctorList.length; i++) {
        //   this.doctorList[i].isChecked = true
        //   this.doctorIdList.push(this.doctorList[i].doctorId)
        // }
        console.log(this.doctorIdList);
        this.checked = !this.checked


      },
      // 多选客户cheAllSel
      checkedOne(index) {
        console.log(index);
        console.log(this.doctorList[index].isChecked);
        console.log(this.doctorList[index].doctorId);
        // 获取当前下标ID
        if (this.doctorList[index].isChecked == true) {
          let idIndex = this.doctorIdList.indexOf(this.doctorList[index].doctorId)
          this.doctorIdList.splice(idIndex, 1)
        } else {
          this.doctorIdList.push(this.doctorList[index].doctorId)
        }
        // 判断是否全选
        if (this.doctorIdList.length == this.doctorList.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
        console.log(this.doctorIdList);
        this.doctorList[index].isChecked = !this.doctorList[index].isChecked
      },
      // 销售列表模糊查询
      marketListTapTap() {
        this.marketListTap(this.userName)
      },
      // 平调客户
      pingUserSubmit(e) {
        // 判断是否为分配角色
        if (e == 1) {
        }
        console.log(this.doctorIdList)
        console.log(this.newUserId)

        if (this.doctorIdList.length == 0) {
          this.$message('请选择平调客户');
          return
        }
        if (this.newUserId == '') {
          this.$message('请选择平调用户');
          return
        }

        // this.loading = true
        let userListData = {
          userId: this.userId,
          newUserId: this.newUserId,
          doctorIdList: this.doctorIdList,
        };

        // return;

        // let doctorIdList = this.doctorIdList.join(",")
        // userListData = qs.stringify({
        //   userId: this.userId,
        //   newUserId: this.newUserId,
        //   doctorIdList: doctorIdList,
        // });
        // application/x-www-form-urlencoded
        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/user/doctor-exchange'
        api.postn(url, {}, userListData).then(response => {``
          console.log('response=', response)
          this.loading = false

          if (response.code == '200') {
            if (response.status == 'success') {
              this.pingDialogFormVisible = false;

              // this.doctorName = '',
                // this.userName = '',
                // this.userId = '',
                // this.newUserId = '',
                // this.doctorIdList = [],
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
                if(i == newUserList.length - 1){
                  this.newUserList = newUserList

                  // console.log('1=', )
                  console.log('length=', newUserList.length)

                }
              }

              this.pingDialogFormVisible = true
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
      // 客户列表模糊查询
      doctorTap() {
        this.checked = false;//查询后取消全选
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
              // npm run build
              this.doctorList = doctorList
              this.doctorIdList = [];
              this.marketListTap('')
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
        let url = '/web/v1.0/system/user/user-page'
        api.get(url, userListData).then(response => {
          // console.log('返回值!', response.data.userList.item)
          this.loading = false
          // if(response.code){
          //   this.$store.dispatch('user/resetToken')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
          if (response.code == '200') {
            if (response.status == 'success') {
              let list = response.data.userList.items
              this.totalCount = response.data.userList.totalCount
              console.log('返回值!list=', list)
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
      // 改变用户状态
      changeUserState(row) {
        console.log(row)
        this.loading = true
        let userListData = {}

        userListData = qs.stringify({
          userId:row.userId
        });

        // userListData.push(row.userId)
        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/user/user-freeze'
        api.post(url, {}, userListData).then(response => {
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let openid = response.data.openid;
              console.log('openid!', openid)
              // this.logout('444',openid)
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

          // if (!this.addForm.userRegionItem) {
          //   this.$message('请选择所属大区');
          //   return
          // }

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


        let userListData = {};
        let userRegionItem = ''
        let userRegionItemArea = ''
        if (this.userId != '') {
          if(this.roleName == '大区经理'){
            if (!this.addForm.userRegionItem) {
              this.$message('请选择所属大区');
              return
            }
            userRegionItem = this.addForm.userRegionItem
          }
          if(this.roleName == '地区经理' || this.roleName == '销售'){
            if (!this.addForm.userRegionItem) {
              this.$message('请选择所属大区');
              return
            }
            userRegionItem = this.addForm.userRegionItem
            userRegionItemArea = this.addForm.userRegionItemArea
          }
          userListData = qs.stringify({
            userId: this.userId,
            CWID: this.addForm.CWID,
            userName: this.addForm.userName,
            userEmail: this.addForm.userEmail,
            userMobile: this.addForm.userMobile,
            userRegionItem: userRegionItem,
            userRegionItemArea: userRegionItemArea,
            roleId: this.addForm.roleId,
            userDepartment: this.addForm.userDepartment,
          });

        } else {
          if(this.roleName == '大区经理'){
            if (!this.addForm.userRegionItem) {
              this.$message('请选择所属大区');
              return
            }
            userRegionItem = this.addForm.userRegionItem
          }
          if(this.roleName == '地区经理' || this.roleName == '销售'){
            if (!this.addForm.userRegionItem) {
              this.$message('请选择所属大区');
              return
            }
            userRegionItem = this.addForm.userRegionItem
            userRegionItemArea = this.addForm.userRegionItemArea
          }
          userListData = qs.stringify({
            CWID: this.addForm.CWID,
            userName: this.addForm.userName,
            userEmail: this.addForm.userEmail,
            userMobile: this.addForm.userMobile,
            userRegionItem: userRegionItem,
            userRegionItemArea: userRegionItemArea,
            roleId: this.addForm.roleId,
            userDepartment: this.addForm.userDepartment,
          });
        }

        console.log('userListData=', userListData)
        let url = '/web/v1.0/system/user/user-add'
        this.loading = true

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

      // 显示编辑用户对话框
      showEditDialog(row, type) {
        if (type == 1) {
          this.editDialogFormVisible = true
        } else {
          this.grantDialogFormVisible = true
        }
        console.log(row)
        this.userId = row.userId
        this.loading = true
        let userListData = {
          userId: row.userId
        }
        let url = '/web/v1.0/system/user/user-info'
        api.get(url, userListData).then(response => {
          console.log('信息!', response)
          this.loading = false
          if (response.code == '200') {
            if (response.status == 'success') {
              let sysUserInfo = response.data.sysUserInfo
              this.addForm.CWID = sysUserInfo.userIdentifier
              this.addForm.userName = sysUserInfo.userName
              this.addForm.userMobile = sysUserInfo.userMobile
              this.addForm.userEmail = sysUserInfo.userEmail
              this.addForm.userRegionItem = sysUserInfo.regionItemId
              // this.addForm.userRegionItemArea = sysUserInfo.regionItemAreaId
              this.addForm.roleId = sysUserInfo.roleId
              this.addForm.regionItemName = sysUserInfo.regionItem
              // this.addForm.regionItemAreaName = sysUserInfo.regionItemArea
              this.addForm.userDepartment = sysUserInfo.userDepartment
              this.regionName = sysUserInfo.regionName//区域名称
              this.regionItemName = sysUserInfo.regionItem//大区名称

              for (let i = 0; i < this.regionList.length; i++) {
                if (this.regionList[i].regionId == sysUserInfo.regionId) {
                  this.regionItemList = this.regionList[i].regionItemList
                }
              }

              // this.addForm.userDepartment = sysUserInfo.userDepartment
              // regionName
              // regionId
              for (let i = 0; i < this.roleList.length; i++) {
                if (this.roleList[i].roleId == sysUserInfo.roleId) {
                  this.roleName = this.roleList[i].roleName
                }
              }
              if (sysUserInfo.regionItemArea) {
                for (let i = 0; i < this.regionItemList.length; i++) {
                  if (this.regionItemList[i].regionItemId == sysUserInfo.regionItemId) {
                    this.regionItemAreaList = this.regionItemList[i].regionItemAreaList
                    console.log('this.regionItemAreaList=', this.regionItemAreaList)

                  }
                }
                this.regionItemAreaName = sysUserInfo.regionItemArea//地区名称
                this.addForm.userRegionItemArea = sysUserInfo.regionItemAreaId//地区id
                console.log('大区列表=', this.regionItemList[i])
                console.log('返回地区id=', sysUserInfo.regionItemAreaId)

              }
              console.log('this.addForm=', this.addForm)

              // this.addForm.roleName =
              // this.initList()

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
    top: 20%!important;
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
    /*margin: 0 auto;*/
    font-size: 12px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    /*margin-bottom: 15px;*/
    /*-webkit-transform: scals(0.83)*/
  }

  .disf {
    margin-left: 30px !important;
    margin-bottom: 20px;

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
  .det-taq-fir-c:last-child{
    margin-bottom: 30px;
  }
  .letui{
    margin-left: -50%;

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
