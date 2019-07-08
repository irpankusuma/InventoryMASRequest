<template >
  <div >
    <v-snackbar :timeout="timeout" :color="color" :top="'top'" :multi-line="'multi-line'" :vertical="'vertical'" v-model="alert">
      {{message}}
      <v-btn dark flat @click.native="alert = false">Close</v-btn>
    </v-snackbar>

    <!-- page toolbar -->
    <v-toolbar class="grey darken-3" dark app fixed flat extended>
      <cs-toggle />
      <v-spacer></v-spacer>
      <v-btn flat icon @click.native="searchDialog =! searchDialog"><v-icon>{{ searchDialog ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}</v-icon></v-btn>
      <v-list light slot="extension">
        <v-list-tile>
          <v-list-tile-action v-if="isNew">            
            <v-btn light @click="headerDialog =! headerDialog" color="teal lighten-4">New Headers (P)</v-btn>
          </v-list-tile-action>
          <v-list-tile-action v-if="isNew" class="ml-2">            
            <v-btn light @click="bodyDialog =! bodyDialog" color="blue darken-2" dark>New Body (P)</v-btn>
          </v-list-tile-action>
          <!-- <v-list-tile-action v-if="isNew" class="ml-2">            
            <v-btn light @click="addDialog =! addDialog" color="primary" dark>New Add (C)</v-btn>
          </v-list-tile-action> -->
        </v-list-tile>
      </v-list>         
    </v-toolbar>
    <!-- /page toolbar -->   
    <v-layout column>
      <!-- Body -->
      <v-container fluid>
        <cs-datatable 
          id="IDX_CMP_Support" 
          :skip="true" 
          :info="true"
          :items="lists" 
          :headers="headers" 
          :body="body" 
          :filter="true" 
          :action="true"
          :loading="loading" 
          :maxPage="maxPage"
          :total="totalRecords"
          @isNew="userDialog =! userDialog"
          @action="actionMenu"
          @submit="loadSearch" />
      </v-container>         
    </v-layout>  
    
    <!-- add Header -->
    <v-navigation-drawer right app v-model="headerDialog" light width="900">
      <v-toolbar color="teal lighten-4" flat>
        <v-toolbar-title>Add Headers CsDataTable</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container fluid>
        <v-layout row>
          <v-flex sm12 md12 lg12>
            <v-spacer></v-spacer>
            <v-btn dark @click="addHeaderForm()" style="float:right">
              <v-icon left>add</v-icon> Add Headers  {{ headerIncForm == null ? 0 : headerIncForm.length }}
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex sm12 md12 lg12>
            <table class="addForm">
              <thead>
                <tr>
                  <td>No</td>
                  <td>Page Name</td>
                  <td>Label</td>
                  <td>Class</td>
                  <td>Sort-Value</td>
                  <td>isSort</td>
                  <td>Order</td>
                  <td>Remove</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(k,v) in headerIncForm" :key="v">
                  <td>{{ v+1 }}</td>
                  <td><v-select :items="listsForm" v-model="k.IDX_M_Forms" item-text="Form_Name" item-value="IDX_M_Forms" label="Page Name" autocomplete chips></v-select></td>
                  <td><v-text-field label="Label" v-model="k.text"></v-text-field></td>
                  <td><v-text-field label="Class" v-model="k.classs"></v-text-field></td>
                  <td><v-text-field label="Sort-Value" v-model="k.value"></v-text-field></td>
                  <td><v-switch v-model="k.sort"></v-switch></td>
                  <td><v-text-field label="Order" type="number" v-model="k.orderNo"></v-text-field></td>
                  <td><v-btn small fab color="red" dark @click="removeHeaderForm(v)"><v-icon>clear</v-icon></v-btn></td>
                </tr>
              </tbody>
            </table>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-container grid-list-md>
            <v-btn light @click="headerDialog =! headerDialog">
              <v-icon left>clear</v-icon> Close
            </v-btn>
            <v-btn dark @click="saveHeaderForm()">
              <v-icon left>save</v-icon> Save
            </v-btn>
          </v-container>
        </v-layout>
      </v-container>
    </v-navigation-drawer> 

    <!-- add Body -->
    <v-navigation-drawer right app v-model="bodyDialog" light width="900">
      <v-toolbar flat color="blue darken-2" dark>
        <v-toolbar-title>Add Body CsDataTable</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container fluid>
        <v-layout row>
          <v-flex sm12 md12 lg12>
            <v-spacer></v-spacer>
            <v-btn dark @click="addBodyForm()" style="float:right">
              <v-icon left>add</v-icon> Add Body  {{ bodyIncForm == null ? 0 : bodyIncForm.length }}
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex sm12 md12 lg12>
            <table class="addForm">
              <thead>
                <tr>
                  <td>No</td>
                  <td>Page Name</td>
                  <td>Value (without space)</td>
                  <td>Class</td>
                  <td>To</td>
                  <td>isInfo (badges)</td>
                  <td>Sort</td>
                  <td>Remove</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(k,v) in bodyIncForm" :key="v">
                  <td>{{ v+1 }}</td>
                  <td><v-select :items="listsForm" v-model="k.IDX_M_Forms" item-text="Form_Name" item-value="IDX_M_Forms" label="Page Name" autocomplete chips></v-select></td>
                  <td><v-text-field label="Value" v-model="k.value"></v-text-field></td>
                  <td><v-text-field label="Class" v-model="k.classs"></v-text-field></td>
                  <td><v-text-field label="To" v-model="k.to"></v-text-field></td>
                  <td><v-switch v-model="k.info"></v-switch></td>
                  <td><v-text-field label="Order" type="number" v-model="k.orderNo"></v-text-field></td>
                  <td><v-btn small fab color="red" dark @click="removeBodyForm(v)"><v-icon>clear</v-icon></v-btn></td>
                </tr>
              </tbody>
            </table>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-container grid-list-md>
            <v-btn light @click="bodyDialog =! bodyDialog">
              <v-icon left>clear</v-icon> Close
            </v-btn>
            <v-btn dark @click="saveBodyForm()">
              <v-icon left>save</v-icon> Save
            </v-btn>
          </v-container>
        </v-layout>
      </v-container>
    </v-navigation-drawer> 

    <!-- edit -->
    <v-dialog v-model="editDialog" max-width="900">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Edit Components </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-chip>{{ isHeaders ? 'Headers' : 'Body' }}</v-chip>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-container grid-list-xs>
            <v-divider></v-divider>
            <v-layout row wrap v-if="isHeaders">
              <!-- Headers -->
              <v-flex xs6>
                <v-select v-model="CForms" label="Page Name (Component)" prepend-icon="settings_input_composite" :items="listsForm" item-text="Form_Name" item-value="IDX_M_Forms" autocomplete chips></v-select>
                <v-text-field label="Label" v-model="CText" prepend-icon="label"></v-text-field>
                <v-text-field label="Value" v-model="CValue" prepend-icon="label"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="Class" v-model="CClass" prepend-icon="class"></v-text-field>
                <v-text-field label="Order No" type="number" v-model="CorderNo" prepend-icon="reorder"></v-text-field>
                <v-switch label="isSort" v-model="CSort"></v-switch>
              </v-flex>
            </v-layout>
            <v-layout row wrap v-else>
              <!-- Body -->
              <v-flex xs6>
                <v-select v-model="CForms" label="Page Name (Component)" prepend-icon="settings_input_composite" :items="listsForm" item-text="Form_Name" item-value="IDX_M_Forms" autocomplete chips></v-select>
                <v-text-field label="Value" v-model="CValue" prepend-icon="label"></v-text-field>
                <v-text-field label="Class" v-model="CClass" prepend-icon="class"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="To" v-model="CTo" prepend-icon="public"></v-text-field>
                <v-text-field label="Order No" type="number" v-model="CorderNo" prepend-icon="reorder"></v-text-field>
                <v-switch label="isInfo" v-model="CInfo"></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light @click="editDialog =! editDialog"><v-icon left>clear</v-icon>Close</v-btn>
          <v-btn dark @click="update"><v-icon left>save</v-icon>Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> 
    
    <!-- add CsAdd -->
    <!-- <v-navigation-drawer right app v-model="addDialog" light width="1024">
      <v-toolbar color="primary" flat dark>
        <v-toolbar-title>Add Items CsAdd</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container fluid>
        <v-layout row>
          <v-flex sm12 md12 lg12>
            <v-spacer></v-spacer>
            <v-btn dark @click="addCsAddForm()" style="float:right">
              <v-icon left>add</v-icon> Add Items  {{ addIncForm == null ? 0 : addIncForm.length }}
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex sm12 md12 lg12>
            <table class="addForm">
              <thead>
                <tr>
                  <td>No</td>
                  <td>Page Name</td>
                  <td>Type</td>
                  <td>HTML-Type</td>
                  <td>Label</td>
                  <td>VModel</td>
                  <td>Value</td>
                  <td>Data</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(k,v) in headerIncForm" :key="v">
                  <td>{{ v+1 }}</td>
                  <td><v-select :items="listsForm" v-model="k.IDX_M_Forms" item-text="Form_Name" item-value="IDX_M_Forms" label="Page Name" autocomplete chips></v-select></td>
                  <td><v-text-field label="Label" v-model="k.text"></v-text-field></td>
                  <td><v-text-field label="Class" v-model="k.classs"></v-text-field></td>
                  <td><v-text-field label="Sort-Value" v-model="k.value"></v-text-field></td>
                  <td><v-switch v-model="k.sort"></v-switch></td>
                  <td><v-text-field label="Order" type="number" v-model="k.orderNo"></v-text-field></td>
                  <td><v-btn small fab color="red" dark @click="removeCsAddForm(v)"><v-icon>clear</v-icon></v-btn></td>
                </tr>
              </tbody>
            </table>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-container grid-list-md>
            <v-btn light @click="addDialog =! addDialog">
              <v-icon left>clear</v-icon> Close
            </v-btn>
            <v-btn dark @click="saveCsAddForm()">
              <v-icon left>save</v-icon> Save
            </v-btn>
          </v-container>
        </v-layout>
      </v-container>
    </v-navigation-drawer>     -->
    
    <!-- search Components -->
    <v-navigation-drawer right app v-model="searchDialog" light width="350">
      <v-toolbar flat>
        <v-toolbar-title>Advance Search</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container fluid>
        <v-select v-model="selectedAdvanceForms" label="Page Name (Component)" prepend-icon="settings_input_composite" clearable :items="listsForm" item-text="Form_Name" item-value="IDX_M_Forms" autocomplete chips deletable-chips></v-select>
        <!-- <v-select v-model="selectedAdvanceUsedForComponent" label="Props" prepend-icon="adb" :items="listsProps" clearable item-text="ValueName" item-value="ValidValue" autocomplete chips deletable-chips></v-select> -->
      </v-container>
      <v-btn dark @click="search"><v-icon left>search</v-icon> Search</v-btn>
    </v-navigation-drawer> 
  </div>
</template>


<script>
import CsAdd from '@/components/custom/CsAdd';
import CsDataTable from '@/components/custom/CsDataTable';
import CsToggle from '@/components/custom/CsToggleToolbar';

//core
export default {
  components: {
    'cs-add': CsAdd,
    'cs-datatable': CsDataTable,
    'cs-toggle': CsToggle
  },
  data() {
    return {
      headers:[],
      body:[],
      headerIncForm:[],
      bodyIncForm:[],
      addIncForm: [],

      // dialog
      headerDialog:false,
      bodyDialog:false,
      addDialog:false,
      editDialog:false,
      searchDialog:false,

      //object
      IDX_CMP_Support:null,
      CForms: null,
      CText: null,
      CValue: null,
      CClass: null,
      CTo: null,
      CorderNo: null,
      CSort: false,
      CInfo: false,
      isHeaders:false,
      isBody:false,
      isNew: null,

      //advance search
      selectedAdvanceForms:null,
      selectedAdvanceUsedForComponent:null,

      //pagination
      pageSize:25,
      maxPage:1,
      currentPage:1,
      totalRecords: 0,

      // ddl
      lastId: [],
      lists: [],
      listsForm:[],
      listsProps:[],

      //loading
      statusLoad: "Loading...",
      spinner: false,
      loading: false,
      userLoad: false,

      //alert
      alert: false,
      message: null,
      timeout: 60000,
      color: ""
    };
  },
  created() {
    this.loadList();
    this.loadAdditionalData();
  },
  watch(){

  },
  methods:{
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      this.IDX_CMP_Support = id;

      switch (code){
        case 'isEnable':
          this.toggleStatus(id);
        break;
        case 'isDelete':
          this.deleteO(id);
        break;
        case 'isUpdate':
          let item = this.lists.filter(k => { return k.IDX_CMP_Support == id });
          this.CForms = item[0].IDX_M_Forms;
          this.CText = item[0].text;
          this.CValue = item[0].value;
          this.CClass = item[0].class;
          this.CorderNo = item[0].orderNo;
          this.CSort = item[0].sort;
          this.CInfo = item[0].info;
          this.isHeaders = item[0].ValueName == 'header' ? true : false;
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
        .post(this.$aid.url() + "Components/loadComponents", id, {
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
          this.headers = arr["Table2"];
          this.body = arr["Table3"];
        })
        .then(function() {
          this.loading = false;
        })
        .catch(function(error) {
          this.loading = false;
          this.showAlert("ERROR  : " + error.statusText);
          this.$aid.console(error.body,false);
        });
    },
    loadAdditionalData() {
      let id = JSON.stringify({Session_ID:this.$ls.get('SESSION_ID')});
      this.$http
        .post(this.$aid.url() + "Components/loadAdditionalComponents",id, {
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsForm = arr["Table"];
          this.listsProps = arr["Table1"];
        })
        .then(function() {
          this.userLoad = false;
        })
        .catch(function(error) {
          this.userLoad = false;
          this.showAlert("ERROR  : " + error.statusText);
          this.$aid.console(error.body,false);
        });
    },
    deleteO(v) {
      var id = JSON.stringify({
        IDX_CMP_Support: v,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Master/deleteComponents", id, "Deleting...");
    },
    toggleStatus(v){
      let item = this.lists.filter(k => { return k.IDX_CMP_Support == v });
      return item[0].isEnable ? this.enable(v) : this.disable(v);
    },
    enable(k) {
      var id = JSON.stringify({
        IDX_CMP_Support: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Components/enableComponents", id, "Enabling...");
    },
    disable(k) {
      var id = JSON.stringify({
        IDX_CMP_Support: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Components/disableComponents", id, "Disabling...");
    },
    search(){
      let id = { 
        IDX_M_Forms: this.selectedAdvanceForms,
        usedForComponent: this.selectedAdvanceUsedForComponent
      };
      this.loadSearch(id);
    },

    //Header Form Process
    addHeaderForm(){
      this.headerIncForm.push({})
    },
    removeHeaderForm(v){
      this.headerIncForm.splice(v,1)
    },
    saveHeaderForm(){
      if(this.headerIncForm == null || this.headerIncForm.length < 1){ 
        this.showAlert('Header cannot be empty !.','red') 
        return false
      }
      let id = JSON.stringify({ Table: this.headerIncForm, Session_ID:this.$ls.get('SESSION_ID') })
      this.ajaxCRUD(this.$aid.url() + 'Components/saveComponentsHeaders',id,'Saving form...');
      this.headerIncForm = [];
    },

    //Body Form Process
    addBodyForm(){
      this.bodyIncForm.push({})
    },
    removeBodyForm(v){
      this.bodyIncForm.splice(v,1)
    },
    saveBodyForm(){
      if(this.bodyIncForm == null || this.bodyIncForm.length < 1){ 
        this.showAlert('Body cannot be empty !.','red') 
        return false
      }
      let id = JSON.stringify({ Table: this.bodyIncForm, Session_ID:this.$ls.get('SESSION_ID') })
      this.ajaxCRUD(this.$aid.url() + 'Components/saveComponentsBody',id,'Saving form...');
      this.bodyIncForm = [];
    },
    update(){
      let id = JSON.stringify({
        Session_ID: this.$ls.get('SESSION_ID'),
        IDX_CMP_Support: this.IDX_CMP_Support,
        IDX_M_Forms: this.CForms,
        Text: this.CText,
        Class: this.CClass,
        Value: this.CValue,
        To: this.CTo,
        Sort: this.CSort,
        Info: this.CInfo,
        OrderNo: this.CorderNo
      });
      this.ajaxCRUD(this.$aid.url()+'Components/updateComponents',id,'Updating..');
      this.IDX_CMP_Support = null;
    },


    //core method
    showAlert(message, code) {
      this.alert = true;
      this.message = message;
      this.color = code;
      if (code == "error") {
        this.spinner = false;
      }
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
          for (var i in arr["Table"]) {
            this.showAlert(
              arr["Table"][i].StatusMessage,
              arr["Table"][i].StatusCSS
            );
          }
        })
        .then(function() {
          this.loadList();
          this.spinner = false;
          this.editDialog = false;
          this.headerDialog = false;
          this.bodyDialog = false;
        })
        .catch(function(error) {
          this.spinner = false;
          this.showAlert("ERROR  : " + error.statusText, "error");
          this.$aid.console(error.body,false);
        });
    }
  }
};
</script>
<style>
  .addForm {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  .addForm td, #customers th {
    border: 1px solid #ddd;
    padding: 8px;
  }
  .addForm tr:nth-child(even){background-color: #f2f2f2;}
  .addForm tr:hover {background-color: #ddd;}
</style>