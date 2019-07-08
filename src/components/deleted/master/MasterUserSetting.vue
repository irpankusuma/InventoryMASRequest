<template >
  <div>
    <!-- page toolbar -->
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <v-btn dark flat to="/master" >         
        <v-icon left>keyboard_arrow_left</v-icon>&nbsp;     
        <span class="white--text">Master</span>                                 
      </v-btn>          
    </v-toolbar>
    <!-- /page toolbar -->          
    <v-layout column>
      <!-- Body -->
      <v-card>
        <v-card-title>
          <v-btn v-if="isNew" @click="addDialog =! addDialog"><v-icon color="primary" left>add</v-icon>New Role</v-btn>
          <v-spacer></v-spacer>
          <cs-search label="Filter" @search="loadSearch" />
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="lists"
            :loading="loading"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-center">
                  <cs-action 
                    :id="props.item.NIK"
                    :isUpdate="props.item.isUpdate"
                    :isEnable="props.item.isEnable"
                    :isDelete="props.item.isDelete"
                    @submit="actionMenu" />
                </td>
                <td class="text-xs-center">{{ props.item.NIK }}</td>
                <td class="text-xs-center">{{ props.item.Name }}</td>
                <td class="text-xs-center">{{ props.item.PositionName }}
                  <v-badge color="orange" left overlap>                
                    <v-icon slot="badge" dark v-if="props.item.isEnable">warning</v-icon>                 
                  </v-badge>
                </td>
                <td class="text-xs-center">{{ props.item.DepartmentName }}</td>
                <td class="text-xs-center">{{ props.item.DivisionName }}</td>
                <td class="text-xs-center">{{ props.item.DirectorateName }}</td>
              </tr>
            </template>
            <template slot="no-data">
              <v-alert :value="true" color="warning" icon="warning">
                Sorry, nothing to display here :(
              </v-alert>
            </template>
          </v-data-table>  
        </v-card-text>
      </v-card>          
    </v-layout>    

    <!-- add role -->
    <v-navigation-drawer right app v-model="addDialog" light width="780">
      <v-toolbar flat color="teal lighten-2" dark>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              New User Role         
            </v-list-tile-title>
          </v-list-tile>                  
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <cs-role :isInsert="true" :users="userItems" :items="roleItems" @submit="save" @close="addDialog =! addDialog" />
    </v-navigation-drawer>              
    <!-- /add role -->   

    <!-- edit role -->
    <v-navigation-drawer right app v-model="editDialog" light width="780">
      <v-toolbar flat color="primary" dark>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Edit User Role               
            </v-list-tile-title>
          </v-list-tile>                  
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <cs-role :id="NIK" :items="roleEditItems" @submit="update" @close="editDialog =! editDialog" />
    </v-navigation-drawer>              
    <!-- /edit role -->   
  </div>
</template>


<script>
import CsRole from '@/components/custom/CsRole';
import CsAction from '@/components/custom/CsActionMenu';

//core
export default {
  components: {
    'cs-role': CsRole,
    'cs-action': CsAction
  },
  data() {
    return {
      headers: [
        { text:'Action',align:'center',sortable:false, },
        { text:'NIK',align:'center',sortable:true,value:'NIK'},
        { text:'Full Name',align:'center',sortable:true,value:'Name'},
        { text:'Position',align:'center',sortable:true,value:'PositionName'},
        { text:'Department',align:'center',sortable:false,value:'DepartmentName'},
        { text:'Division',align:'center',sortable:true,value:'DivisionName'},
        { text:'Directorate',align:'center',sortable:true,value:'DirectorateName'},
      ],
      body:[],
      isNew: null,

      // dialog
      addDialog: false,
      deleteDialog: false,
      editDialog: false,

      //object
      NIK:null,
      
      //pagination
      pageSize:25,
      maxPage:1,
      currentPage:1,
      totalRecords: 0,

      // ddl
      lastId:[],
      lists:[],
      addItems:[],
      roleItems:[],
      userItems:[],
      roleEditItems:[],

      //loading
      statusLoad: "Loading...",
      spinner: false,
      loading: false,
      userLoad: false,
    };
  },
  created() {
    this.loadList();
    this.loadAdditionalData();
    this.loadAdditionalUserList();
  },
  methods:{    
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let item = this.lists.filter(k => { return k.IDX_M_InventoryUser == id });

      this.NIK = id;
      switch (code){
        case 'isUpdate':
          this.loadUserSetting_ByNIK(id);
          this.editDialog = this.editDialog =! this.editDialog;
        break;
      }
    },
    loadSearch(p){
      let id;
      if((this.lastId != null) || (this.lastId != undefined)){
        id = this.$aid.arrayMerge(this.lastId,p)
      }else{
        id = this.lastId = p;
      }
      this.loadList(id);
    },
    // general
    loadList(params){
      let id = [];
      let createdId = { 
        Session_ID: this.$ls.get("SESSION_ID"),
        PageSize: this.pageSize,
        MaxPage: this.maxPage,
        CurrentPage: this.currentPage
      };
      
      if(params == undefined || params == null){
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }else{
        this.lastId = this.$aid.arrayMerge(this.lastId,params);
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }

      this.$http
        .post(this.$aid.url() + "Master/loadUserSetting", id, {
          before: () => {
            this.loading = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.lists = arr["Table"];
          this.totalRecords = arr["Table1"][0].TotalRecords;
          this.maxPage = arr["Table1"][0].MaxPage;
          this.isNew = arr["Table1"][0].isNew;
        })
        .then(function() {
          this.loading = false;
        })
        .catch(function(error) {
          this.loading = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    loadAdditionalData() {
      this.$http
        .get(this.$aid.url() + "Master/loadAdditionalistUserSetting",{
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.roleItems = arr['Table'];
        })
        .then(function() {
          this.userLoad = false;
        })
        .catch(function(error) {
          this.userLoad = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    loadAdditionalUserList() {
      this.$http
        .get(this.$aid.url() + "Master/loadAdditionalistUserSetting_UserLists",{
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.userItems = arr['Table'];
        })
        .then(function() {
          this.userLoad = false;
        })
        .catch(function(error) {
          this.userLoad = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    loadUserSetting_ByNIK(value){
      let id = JSON.stringify({ NIK:value });
      this.$http
        .post(this.$aid.url() + "Master/loadUserUserSettingByNIK", id, {
          before: () => {
            this.loading = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.roleEditItems = arr["Table"];
        })
        .then(function() {
          this.loading = false;
        })
        .catch(function(error) {
          this.loading = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    update(params){
      this.ajaxCRUD(this.$aid.url()+'Master/updateUserSetting',params,'Updating...');
    },
    save(params){
      this.ajaxCRUD(this.$aid.url() + "Master/saveUserSetting", params, "Saving...");
    },

    // core method
    snackbar(value){
      this.$emit('snackbar',value);
    },
    ajaxCRUD(url, id, status) {
      this.$http
        .post(url, id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = status;
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          let snackbar = {};
          for (var i in arr["Table"]) {
            snackbar = {
              color: arr["Table"][i].StatusCSS,
              message: arr["Table"][i].StatusMessage,
              alert: true
            }
            this.snackbar(snackbar);
          }
        })
        .then(function() {
          this.loadList();
          this.spinner = false;
          this.editDialog = false;
          this.addDialog = false;
        })
        .catch(function(error) {
          this.spinner = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    }
  }
};
</script>
