<template >
  <div>
    <!-- page toolbar -->
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <cs-toggle /> <v-spacer></v-spacer>
      <v-btn flat icon @click.native="searchDialog =! searchDialog"><v-icon>{{ searchDialog ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}</v-icon></v-btn>
    </v-toolbar>
    <!-- /page toolbar -->          
    <v-layout column>
      <!-- Body -->
      <v-container fluid>
        <v-layout column>
            <v-card>
              <v-card-title>
                <v-chip v-for="(k,v) in listsRemain" :key="v">
                  <v-avatar :class="k.InventoryStatusColor" v-text="k.Total"></v-avatar>
                  {{ k.InventoryStatusName }}
                </v-chip>
                <v-spacer></v-spacer>
                <cs-search label="Filter" @search="loadSearch" />
              </v-card-title>
              <v-card-text>
                <v-data-table :headers="headers" :items="lists" :loading="loading">
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td class="text-xs-left"><v-icon large :color="props.item.isStatusColor">fiber_manual_record</v-icon></td>
                      <td class="text-xs-center">
                        <cs-action 
                          :id="props.item.IDX_M_InventoryForm"
                          :isUpdate="props.item.isUpdate"
                          :isEnable="props.item.isEnable"
                          :isDelete="props.item.isDelete"
                          :isApprove="props.item.isApprove"
                          @submit="actionMenu" />
                      </td>
                      <td class="text-xs-center">
                        <v-btn flat small :to="/viewRequest/+props.item.IDX_M_InventoryForm"><v-icon left color="blue lighten-1" small>public</v-icon> {{ props.item.InventoryFormID }}</v-btn>
                      </td>
                      <td class="text-xs-center">{{ $moment(props.item.Date).format('DD-MM-YYYY') }}</td>
                      <td class="text-xs-center">{{ props.item.InventoryStatusName }}
                        <v-badge color="orange" left overlap>                
                          <v-icon slot="badge" dark v-if="props.item.isEnable">warning</v-icon>                 
                        </v-badge>
                      </td>
                      <td class="text-xs-center">{{ props.item.NIK }}</td>
                      <td class="text-xs-center">{{ props.item.Name }}</td>
                      <td class="text-xs-center">{{ props.item.Department }}</td>
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
        
      </v-container>       
    </v-layout>    

    <!-- add User -->
    <v-navigation-drawer right app v-model="searchDialog" light width="380">
      <v-toolbar flat>
        <v-toolbar-title>Advance Search</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-autocomplete v-model="selectedAdvanceCompany" :items="listsCompany" prepend-icon="business" label="Choose Company" item-text="CompanyName" item-value="IDX_M_Company" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete v-model="selectedAdvanceInventoryStatus" prepend-icon="plus_one" :items="listsStatus" chips color="blue-grey lighten-2" label="Choose Status" item-text="InventoryStatusName" item-value="IDX_M_InventoryStatus" multiple>
          <template slot="selection" slot-scope="data">
            <v-chip :selected="data.selected" close class="chip--select-multi" @input="data.parent.selectItem(data.item)">
              <v-avatar :class="data.item.InventoryStatusColor"></v-avatar>
              {{ data.item.InventoryStatusName }}
            </v-chip>
          </template>
          <template slot="item" slot-scope="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
              <v-list-tile-avatar>
                <v-icon large :color="data.item.InventoryStatusColor">fiber_manual_record</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.InventoryStatusName"></v-list-tile-title>
              </v-list-tile-content>
            </template>
          </template>
        </v-autocomplete>
        <v-spacer></v-spacer>
        <v-btn dark @click="loadList"><v-icon left>search</v-icon>Search</v-btn>
      </v-container>
    </v-navigation-drawer>              
    <!-- /add contact -->      
    <!-- delete warning -->
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Brand?</v-card-title>
        <v-card-text>You will remove <b>{{InventoryFormID}}</b>. Do you want to proceed ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false" >Cancel</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false" @click="deleteO()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /delete warning -->       
  </div>
</template>


<script>
import CsSearch from '@/components/custom/CsSearch';
import CsAction from '@/components/custom/CsActionMenu';
import CsToggle from '@/components/custom/CsToggleToolbar';

//core
export default {
  components: {
    'cs-search': CsSearch,
    'cs-action': CsAction,
    'cs-toggle': CsToggle
  },
  data() {
    return {
      headers: [
        { text:null,align:'center',sortable:true,value:'InventoryStatusName' },
        { text:'Action',align:'center',sortable:false,value:null },
        { text:'Form ID',align:'center',sortable:true,value:'InventoryFormID' },
        { text:'Date Request',align:'center',sortable:true,value:'Date' },
        { text:'Status',align:'center',sortable:true,value:'InventoryStatusName' },
        { text:'NIK',align:'center',sortable:false,value:'NIK' },
        { text:'Full Name',align:'center',sortable:true,value:'Name' },
        { text:'Department',align:'center',sortable:true,value:'DepartmentName' },
      ],
      isNew: null,

      // dialog
      deleteDialog: false,
      searchDialog: false,
      
      //advance search
      selectedAdvanceInventoryStatus:[],
      selectedAdvanceCompany:[],
      selectedAdvanceTimePeriod:null,
      InventoryFormID:null,

      //sort
      selectedSortBy:null,
      selectedSequence:null,
      
      //pagination
      pageSize:25,
      maxPage:1,
      currentPage:1,
      totalRecords: 0,

      // ddl
      lastId: [],
      lists: [],
      listsStatus: [],
      listsCompany: [],
      listsRemain: [],

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
  watch:{
    selectedAdvanceInventoryStatus(){
      this.loadList();
    },
    selectedAdvanceCompany(){
      this.loadList();
    }
  },
  methods:{    
    actionMenu(p){
      let code = p.code;
      let id = p.id;

      switch (code){
        case 'isEnable':
          this.toggleStatus(id);
        break;
        case 'isDelete':
          this.deleteDialog = this.deleteDialog =! this.deleteDialog;
        break;
        case 'isUpdate':
          this.$router.push('/ManageEditRequest/'+id);
        break;
        case 'isApprove':
          this.toggleApprove(id);
        break;
        case 'isView':
          this.$router.push('/viewRequest/'+id);
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
        IDX_M_InventoryStatus: this.selectedAdvanceInventoryStatus.toString(),
        IDX_M_Company: this.selectedAdvanceCompany.toString(),
        TimePeriod: this.selectedAdvanceTimePeriod,
        SortBy: this.selectedSortBy,
        SortSequence: this.selectedSequence,
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
        .post(this.$aid.url() + "Form/loadFormRequest_Manage", id, {
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
          this.listsRemain = arr["Table2"];
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
        .post(this.$aid.url() + "Form/loadAdditionalFormRequest",{}, {
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsCompany = arr["Table6"];
          this.listsStatus = arr["Table7"];
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
        IDX_M_InventoryForm: this.IDX_M_InventoryForm,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Form/deleteFormRequest", id, "Deleting...");
    },
    toggleStatus(v){
      let item = this.lists.filter(k => { return k.IDX_M_InventoryForm == v });
      return item[0].isEnable ? this.enable(v) : this.disable(v);
    },
    enable(k) {
      var id = JSON.stringify({
        IDX_M_InventoryForm: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Form/enableFormRequest", id, "Enabling...");
    },
    disable(k) {
      var id = JSON.stringify({
        IDX_M_InventoryForm: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Form/disableFormRequest", id, "Disabling...");
    },
    // request
    toggleApprove(v){
      let item = this.lists.filter(k => { return k.IDX_M_InventoryForm == v });
      return item[0].isApprove ? this.approveGA(v) : this.approveManager(v);
    },
    approveGA(k) {
      var id = JSON.stringify({
        IDX_M_InventoryForm: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Form/approveByGAFormRequest", id, "Enabling...");
    },
    approveManager(k) {
      var id = JSON.stringify({
        IDX_M_InventoryForm: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Form/approveByManagerFormRequest", id, "Disabling...");
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
