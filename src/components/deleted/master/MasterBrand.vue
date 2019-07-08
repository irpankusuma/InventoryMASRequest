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
            <v-btn v-if="isNew" @click="addDialog =! addDialog"><v-icon color="primary" left>add</v-icon>New Brand</v-btn>
            <v-spacer></v-spacer>
            <cs-search label="Filter" @search="loadSearch" />
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :loading="loading" :items="lists">
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="text-xs-center">
                    <cs-action 
                      :id="props.item.IDX_M_InventoryBrand"
                      :isUpdate="props.item.isUpdate"
                      :isEnable="props.item.isEnable"
                      :isDelete="props.item.isDelete"
                      @submit="actionMenu" />
                  </td>
                  <td class="text-xs-center">{{ props.item.InventoryBrandName }}
                    <v-badge color="orange" left overlap>                
                      <v-icon slot="badge" dark v-if="props.item.isEnable">warning</v-icon>                 
                    </v-badge>
                  </td>
                  <td class="text-xs-center">{{ props.item.Count }}</td>
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

    <!-- add User -->
    <v-navigation-drawer right app v-model="addDialog" light width="380">
      <v-toolbar flat>
        <v-toolbar-title>Add Brand</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container fluid>
        <v-text-field v-model="selectedInventoryBrandName" label="Brand Name" prepend-icon="spa" required />
        <v-spacer></v-spacer>
        <v-btn dark @click="save()"><v-icon left>save</v-icon>Save</v-btn>
      </v-container>
    </v-navigation-drawer>              
    <!-- /add contact -->      
    <!-- delete warning -->
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Brand?</v-card-title>
        <v-card-text>You will remove <b>{{InventoryBrandName}}</b>. Do you want to proceed ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false" >Cancel</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false" @click="deleteO()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /delete warning -->       

    <!-- edit warning -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Edit Brand</v-toolbar-title>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-container grid-list-xs>
            <v-text-field v-model="InventoryBrandName" label="Brand Name" prepend-icon="spa"></v-text-field>
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
    'cs-action': CsAction
  },
  data() {
    return {
      headers: [
        { text:'Action',align:'center',sortable:false,value:null},
        { text:'Brand Name',align:'center',sortable:true,value:'InventoryBrandName'},
        { text:'Used Count',align:'center',sortable:true,value:'Count'},
      ],
      isNew: null,

      // dialog
      addDialog: false,
      deleteDialog: false,
      editDialog: false,

      //object
      IDX_M_InventoryBrand:null,
      InventoryBrandName:null,
      selectedInventoryBrandName:null,
      
      //pagination
      pageSize:25,
      maxPage:1,
      currentPage:1,
      totalRecords: 0,

      // ddl
      lastId: [],
      lists: [],
      addItems: [],

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
      let item = this.lists.filter(k => { return k.IDX_M_InventoryBrand == id });

      this.IDX_M_InventoryBrand = id;
      this.InventoryBrandName = item[0].InventoryBrandName;

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
        .post(this.$aid.url() + "Master/loadBrand", id, {
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
      let id = JSON.stringify({Session_ID:this.$ls.get('SESSION_ID')});
      this.$http
        .post(this.$aid.url() + "Master/loadAdditionalBrand",id, {
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.addItems = arr['Table'];
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
        IDX_M_InventoryBrand: this.IDX_M_InventoryBrand,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Master/deleteBrand", id, "Deleting...");
    },
    toggleStatus(v){
      let item = this.lists.filter(k => { return k.IDX_M_InventoryBrand == v });
      return item[0].isEnable ? this.enable(v) : this.disable(v);
    },
    enable(k) {
      var id = JSON.stringify({
        IDX_M_InventoryBrand: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Master/enableBrand", id, "Enabling...");
    },
    disable(k) {
      var id = JSON.stringify({
        IDX_M_InventoryBrand: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Master/disableBrand", id, "Disabling...");
    },
    update(){
      let id = JSON.stringify({
        Session_ID: this.$ls.get('SESSION_ID'),
        IDX_M_InventoryBrand: this.IDX_M_InventoryBrand,
        InventoryBrandName: this.InventoryBrandName
      });

      this.ajaxCRUD(this.$aid.url()+'Master/updateBrand',id,'Updating...');
    },
    save(){
      if(!this.selectedInventoryBrandName){
        this.snackbar({color:'warning',message:'Brand Name is required.',alert:true})
        return false;
      }
      let id = JSON.stringify({
        Session_ID: this.$ls.get("SESSION_ID"),
        InventoryBrandName: this.selectedInventoryBrandName
      });
      this.ajaxCRUD(this.$aid.url() + "Master/saveBrand", id, "Saving...");
    },
    clear(){
      this.selectedInventoryBrandName = null;
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
          this.clear();
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
