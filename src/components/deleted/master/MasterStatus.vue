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
      <v-container fluid>
        <v-card>
          <v-card-title>
            <!-- <v-btn v-if="isNew" @click="addDialog =! addDialog"><v-icon color="primary" left>add</v-icon>New Type Model</v-btn> -->
            <v-spacer></v-spacer>
            <cs-search label="Filter" @search="loadSearch" />
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :loading="loading" :items="lists">
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="text-xs-center">
                    <cs-action 
                      :id="props.item.IDX_M_RecordFormStatus"
                      :isUpdate="props.item.isUpdate"
                      @submit="actionMenu" />
                  </td>
                  <td class="text-xs-center"><v-icon :color="props.item.FormStatusColor" large>fiber_manual_record</v-icon></td>
                  <td class="text-xs-center">{{ props.item.FormStatusName }}
                    <v-badge color="orange" left overlap>                
                      <v-icon slot="badge" dark v-if="props.item.isEnable">warning</v-icon>                 
                    </v-badge>
                  </td>
                </tr>
              </template>
              <template slot="no-data">
                <v-alert :value="true" color="error" icon="warning">
                  Sorry, nothing to display here :(
                </v-alert>
              </template>
            </v-data-table>  
          </v-card-text>
        </v-card>    
      </v-container>           
    </v-layout>    

    <!-- edit warning -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Edit Status</v-toolbar-title>
        <v-spacer></v-spacer><v-icon :color="FormStatusColor">label</v-icon>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-container grid-list-xs>
            <v-autocomplete v-model="FormStatusColor" :items="listsColor" chips color="blue-grey lighten-2" label="Choose Color" item-text="InventoryColorName" item-value="InventoryColorName">
              <template slot="selection" slot-scope="data">
                <v-chip :selected="data.selected" close class="chip--select-multi" @input="data.parent.selectItem(data.item)">
                  <v-avatar :class="data.item.InventoryColorName"></v-avatar>
                  {{ data.item.InventoryColorName }}
                </v-chip>
              </template>
              <template slot="item" slot-scope="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-tile-content v-text="data.item"></v-list-tile-content>
                </template>
                <template v-else>
                  <v-list-tile-avatar>
                    <v-icon large :color="data.item.InventoryColorName">fiber_manual_record</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item.InventoryColorName"></v-list-tile-title>
                  </v-list-tile-content>
                </template>
              </template>
            </v-autocomplete>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light @click.native="editDialog = false" >Cancel</v-btn>
          <v-btn dark @click.native="editDialog = false" @click="update()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /edit warning --> 
  </div>
</template>

<script>
import CsSearch from '@/components/custom/CsSearch';
import CsAction from '@/components/custom/CsActionMenu';

//core
export default {
  components: {
    'cs-search': CsSearch,
    'cs-action': CsAction,
  },
  data() {
    return {
      headers: [
        { text:'Action',align:'center',sortable:false,value:null},
        { text:'Color',align:'center',sortable:false,value:null},
        { text:'Status Name',align:'center',sortable:true,value:'FormStatusName'},
      ],
      isNew: null,

      // dialog
      addDialog: false,
      deleteDialog: false,
      editDialog: false,

      //object
      IDX_M_RecordFormStatus:null,
      FormStatusName:null,
      FormStatusColor:null,
      InventoryStatusColor:null,
      
      //pagination
      pageSize:25,
      maxPage:1,
      currentPage:1,
      totalRecords: 0,

      // ddl
      lastId: [],
      lists: [],
      addItems: [],
      listsColor: [],

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
  },
  methods:{    
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let item = this.lists.filter(k => { return k.IDX_M_RecordFormStatus == id });

      this.IDX_M_RecordFormStatus = id;
      this.FormStatusName = item[0].FormStatusName;
      this.FormStatusColor = item[0].FormStatusColor;

      switch (code){
        case 'isEnable':
          this.toggleStatus(id);
        break;
        case 'isDelete':
          this.deleteDialog = this.deleteDialog =! this.deleteDialog;
        break;
        case 'isUpdate':
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
        .post(this.$aid.url() + "Master/loadStatus", id, {
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
      let id = JSON.stringify({Session_ID:this.$ls.get('SESSION_ID')});
      this.$http
        .post(this.$aid.url() + "Master/loadAdditionalStatus",id, {
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.addItems = arr['Table'];
          this.listsColor = arr['Table1'];
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
    deleteO() {
      var id = JSON.stringify({
        IDX_M_RecordFormStatus: this.IDX_M_RecordFormStatus,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Master/deleteStatus", id, "Deleting...");
    },
    update(){
      let id = JSON.stringify({
        Session_ID: this.$ls.get('SESSION_ID'),
        IDX_M_RecordFormStatus: this.IDX_M_RecordFormStatus,
        FormStatusColor: this.FormStatusColor
      });

      this.ajaxCRUD(this.$aid.url()+'Master/updateStatus',id,'Updating...');
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
