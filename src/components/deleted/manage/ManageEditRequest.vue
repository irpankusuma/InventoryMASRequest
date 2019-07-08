<template>
  <div>
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <v-btn flat to="/managerequest"><v-icon left>keyboard_arrow_left</v-icon> Manage Request</v-btn>
    </v-toolbar>
    <v-layout column>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-progress-linear height="2" class="mb-0" :indeterminate="spinner" background-color="grey lighten-5"></v-progress-linear>
          <v-flex xs12 sm12 md12 lg12>
            <v-card>
              <v-card-title primary-title class="title">
                User Information
                <v-spacer></v-spacer>
                <v-chip><v-avatar :class="selectedIsStatusColor"></v-avatar>{{selectedInventoryStatusName}}</v-chip>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-layout row>
                  <v-flex sm6>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>Request Date</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>                                                    
                        <v-subheader class="text-xs-left">{{ selectedRequestDate }}</v-subheader>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>Company</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>                                                    
                        <v-autocomplete label="Choose Company" :items="listsCompany" item-text="CompanyName" item-value="IDX_M_Company" v-model="selectedRequestCompany" readonly></v-autocomplete>                                              
                      </v-flex>
										</v-layout>
                  </v-flex>
                  <v-flex sm6>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>User</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-text-field v-model="selectedRequestUser" readonly></v-text-field>
                      </v-flex>
										</v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex> 
          <v-flex sm12 md12 lg12>
            <v-toolbar color="white">
              <v-toolbar-title>Request Items</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card>
              <v-card-title primary-title class="title">
                <v-layout column>
                  <v-flex xs4 class="text-xs-left">
                    <v-chip><v-avatar color="green accent-1"></v-avatar> Has been realized</v-chip>
                    <v-chip><v-avatar color="red accent-1"></v-avatar> Not yet realized</v-chip>    
                  </v-flex>  
                </v-layout>
                <v-spacer></v-spacer>
                <cs-search label="Filter" @search="loadSearch" />
              </v-card-title>
              <v-card-text>
                <v-layout row dense>
                  <v-flex sm12 md12 lg12>
                    <v-data-table :headers="headers" :items="listsRequest" :loading="loading">
                      <template slot="items" slot-scope="props">
                        <tr>
                          <td class="text-xs-left"><v-icon large :color="props.item.isRealizationColor">fiber_manual_record</v-icon></td>
                          <td class="text-xs-left">
                            <cs-action 
                              :id="props.item.IDX_T_InventoryRequest"
                              :isUpdate="props.item.isUpdate"
                              :isEnable="props.item.isEnable"
                              :isDelete="props.item.isDelete"
                              :isRealization="props.item.isRealization"
                              @submit="actionMenu" />
                          </td>
                          <td class="text-xs-left">
                            <v-chip>
                              <v-avatar>
                                <img :src="$aid.urlPath()+(props.item.ImageUrl ? props.item.ImageUrl : 'icon.png')">
                              </v-avatar>{{ props.item.InventoryTypeModelName }}
                            </v-chip>
                            <v-badge color="orange" left overlap>                
                              <v-icon slot="badge" dark v-if="props.item.isEnable">warning</v-icon>                 
                            </v-badge>
                          </td>
                          <td class="text-xs-center">{{ props.item.Qty }}</td>
                          <td class="text-xs-center">{{ props.item.Remarks }}</td>
                          <td class="text-xs-center">{{ props.item.CurrentStockQty }}</td>
                        </tr>
                      </template>
                      <template slot="no-data">
                        <v-alert :value="true" color="warning" icon="warning">
                          Sorry, nothing to display here :(
                        </v-alert>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>   
        </v-layout>
      </v-container>
    </v-layout>

    <!-- add new items -->
    <v-dialog v-model="addDialog" scrollable fullscreen  persistent :overlay="false" max-width="500px" transition="dialog-transition">
      <v-card>
        <v-toolbar dark color="teal darken-1" flat>
          <v-btn icon dark @click.native="addDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Realization Form</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat @click="addForm()">
            <v-icon left>add</v-icon> Add Stock  [{{ requestItem == null ? 0 : requestItem.length }}]
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-data-table :headers="headersFilter" :items="listsFilter">
                <template slot="items" slot-scope="props">
                  <tr>
                    <td class="text-xs-left">
                      <v-icon large v-if="props.item.isMinusStock" color="yellow accent-1">fiber_manual_record</v-icon>
                      <v-icon large v-else color="green accent-1">fiber_manual_record</v-icon>
                    </td>
                    <td class="text-xs-center">{{ props.item.InventoryBrandName }}</td>
                    <td class="text-xs-center">{{ props.item.InventoryColorName }}</td>
                    <td class="text-xs-center">{{ props.item.InventorySizeName }}</td>
                    <td class="text-xs-center">{{ props.item.InventoryTypeName }}</td>
                    <td class="text-xs-center">{{ props.item.InventoryTypeModelName }}</td>
                    <td class="text-xs-center">
                      <v-tooltip bottom>
                        <v-avatar :tile="false" color="grey lighten-4" size="44" @click.stop="showImage =! showImage" slot="activator">
                          <img :src="$aid.urlPath()+props.item.ImageUrl" v-if="props.item.ImageUrl">
                          <span v-else style="font-size:8px">No Image</span>
                        </v-avatar>
                        <span>click for show</span>
                      </v-tooltip>
                    </td>
                    <td class="text-xs-center">{{ props.item.CurrentStockQty }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex sm12 md12 lg12>
              <table class="addForm">
                <thead>
                  <tr>
                    <td>No</td>
                    <td>Stock Description</td>
                    <td>Qty</td>
                    <td>Remarks</td>
                    <td><v-icon small color="red">delete</v-icon></td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(k,v) in requestItem" :key="v">
                    <td>{{ v+1 }}</td>
                    <td>
                      <v-autocomplete v-model="k.IDX_M_InventoryStock" :items="listsStock" chips color="blue-grey lighten-2" label="Select Stock" item-text="InventoryStockDesc" item-value="IDX_M_InventoryStock">
                        <template slot="selection" slot-scope="data">
                          <v-chip :selected="data.selected" close class="chip--select-multi" @input="data.parent.selectItem(data.item)">
                            <v-avatar>
                              <img :src="$aid.urlPath()+(data.item.ImageUrl ? data.item.ImageUrl : 'icon.png')">
                            </v-avatar>
                            {{ data.item.InventoryTypeModelName }}
                          </v-chip>
                        </template>
                        <template slot="item" slot-scope="data">
                          <template v-if="typeof data.item !== 'object'">
                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                          </template>
                          <template v-else>
                            <v-list-tile-avatar>
                              <img :src="$aid.urlPath()+(data.item.ImageUrl ? data.item.ImageUrl : 'icon.png')">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title v-html="data.item.InventoryBrandName"></v-list-tile-title>
                              <v-list-tile-sub-title v-html="data.item.InventoryStockDesc"></v-list-tile-sub-title>
                            </v-list-tile-content>
                          </template>
                        </template>
                      </v-autocomplete>
                    </td>
                    <td><center><v-text-field type="number" v-model="k.Qty"></v-text-field></center></td>
                    <td><v-textarea v-model="k.Remarks" outline /></td>
                    <td><v-btn small fab color="red" dark @click="removeForm(v)"><v-icon small>clear</v-icon></v-btn></td>
                  </tr>
                </tbody>
              </table>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-container grid-list-md>
              <v-btn dark @click="save()">
                <v-icon left>save</v-icon> Save
              </v-btn>
            </v-container>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- show image -->
    <v-dialog v-model="showImage" :overlay="false" max-width="500px" transition="dialog-transition">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Image</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click="showImage =! showImage"><v-icon>clear</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-avatar :tile="false" size="350" color="grey lighten-4">
            <img v-if="ImageUrl" :src="$aid.urlPath()+(ImageUrl ? ImageUrl : 'icon.png')">
            <span v-else>No Image</span>
          </v-avatar>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- edit dialog -->
    <v-dialog v-model="editDialog" scrollable persistent :overlay="false" max-width="780px" transition="dialog-transition">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Edit Items</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click="editDialog =! editDialog"><v-icon>clear</v-icon></v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-autocomplete v-model="IDX_M_InventoryStock" :items="listsStock" chips color="blue-grey lighten-2" label="Select Stock" item-text="InventoryStockDesc" item-value="IDX_M_InventoryStock">
            <template slot="selection" slot-scope="data">
              <v-chip :selected="data.selected" close class="chip--select-multi" @input="data.parent.selectItem(data.item)">
                <v-avatar>
                  <img :src="$aid.urlPath()+(data.item.ImageUrl ? data.item.ImageUrl : 'icon.png')">
                </v-avatar>
                {{ data.item.InventoryTypeModelName }}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-tile-content v-text="data.item"></v-list-tile-content>
              </template>
              <template v-else>
                <v-list-tile-avatar>
                  <img :src="$aid.urlPath()+(data.item.ImageUrl ? data.item.ImageUrl : 'icon.png')">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="data.item.InventoryBrandName"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="data.item.InventoryStockDesc"></v-list-tile-sub-title>
                </v-list-tile-content>
              </template>
            </template>
          </v-autocomplete>
          <v-text-field v-model="Qty" type="number" label="Quantity"></v-text-field>
          <v-textarea v-model="Remarks" label="Remarks" outline></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="update()"><v-icon left>save</v-icon>Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /edit dialog -->

    <!-- delete warning -->
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Request Item?</v-card-title>
        <v-card-text>You will remove <b>{{InventoryTypeModelName}}</b>. Do you want to proceed ?</v-card-text>
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
import CsToggle from '@/components/custom/CsToggleToolbar';
import CsActionMenu from '@/components/custom/CsActionMenu';
import CsSearch from '@/components/custom/CsSearch';

export default {
  name: 'cs-request-form',
  components: {
    'cs-search': CsSearch,
    'cs-toggle': CsToggle,
    'cs-action': CsActionMenu
  },
  created(){
    this.loadLists();
    this.loadFormRequest_ByIDX_Form();
    this.loadAdditional2();
  },
  computed:{

  },
  watch: {
    w_form(){ return this.addForm; },
  },
  data(){
    return {
      // default application
      statusLoad: "Loading...",
      alert: false,
      message: null,
      timeout: 6000,
      color: "",
      spinner: false,
      loading: false,

      //dialog
      addDialog:false,
      editDialog:false,
      deleteDialog:false,
      showImage:false,
      
      //object
      IDX_T_InventoryRequest:null,
      IDX_M_InventoryStock:null,
      IDX_M_InventoryType:null,
      Qty:0,
      Remarks:null,
      InventoryTypeModelName:null,
      InventoryBrandName:null,
      InventoryColorName:null,
      InventorySizeName:null,
      CurrentStockQty:null,
      ImageUrl:null,

      selectedRequestDate: null,
      selectedRequestCompany: null,
      selectedRequestUser: null,
      selectedIDX_M_InventoryStock:null,
      selectedIsStatusColor:null,
      selectedInventoryStatusName:null,
      selectedSearch:null,

      // array
      headers: [
        { text:null,align:'left',sortable:true,value:'isRealizationColor' },
        { text:'Action',align:'left',sortable:false,value:null },
        { text:'Stock Name',align:'left',sortable:true,value:'InventoryBrandName' },
        { text:'Qty',align:'center',sortable:true,value:'Qty' },
        { text:'Remarks',align:'center',sortable:false,value:null },
        { text:'Current Qty',align:'center',sortable:true,value:'CurrentStockQty' },
      ],
       headersFilter: [
        { text:null,align:'left',sortable:true,value:'isMinusStock' },
        { text:'Brand Name',align:'center',sortable:true,value:'InventoryBrandName' },
        { text:'Color Name',align:'center',sortable:true,value:'InventoryColorName' },
        { text:'Size Name',align:'center',sortable:true,value:'InventorySizeName' },
        { text:'Type Name',align:'center',sortable:true,value:'InventoryTypeName' },
        { text:'Type Model Name',align:'center',sortable:true,value:'InventoryTypeModelName' },
        { text:'Image',align:'center',sortable:false,value:null },
        { text:'Qty',align:'center',sortable:true,value:'CurrentStockQty' },
      ],
      items: [],
      lastId: [],
      listsRequest: [],
      listsCompany: [],
      listsStock: [],
      listsFilter: [],
      requestItem:[],
    }
  },
  methods: {
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let arr = this.listsRequest.filter(k => { return k.IDX_T_InventoryRequest == id })
      this.listsFilter = arr;
      this.InventoryTypeModelName = arr[0].InventoryTypeModelName;
      this.IDX_M_InventoryStock = arr[0].IDX_M_InventoryStock;
      this.IDX_M_InventoryType = arr[0].IDX_M_InventoryType;
      this.Qty = arr[0].Qty;
      this.Remarks = arr[0].Remarks;
      this.CurrentStockQty = arr[0].CurrentStockQty;
      this.InventoryBrandName = arr[0].InventoryBrandName;
      this.InventoryColorName = arr[0].InventoryColorName;
      this.ImageUrl = arr[0].ImageUrl;
      this.IDX_T_InventoryRequest = id;

      switch (code){
        case 'isEnable':
          this.toggleStatus(id);
        break;
        case 'isDelete':
          this.deleteDialog = this.deleteDialog =! this.deleteDialog;
        break;
        case 'isUpdate':
          this.addDialog = this.addtDialog =! this.addDialog;
        break;
        case 'isRealization':
          this.addDialog = this.addtDialog =! this.addDialog;
          this.loadAdditional();
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
      this.loadFormRequest_ByIDX_Form(id);
    },
    loadAdditional(){
      let id = JSON.stringify({ 
        Session_ID:this.$ls.get("SESSION_ID"),
        IDX_M_InventoryType:this.IDX_M_InventoryType
      });
      this.$http
        .post(this.$aid.url() + "Form/loadFormRequest_Manage_StockRealization_ByIDX_M_Form", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsStock = arr["Table"];
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error) {
          this.userLoad = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    loadAdditional2(){
      let id = JSON.stringify({ Session_ID:this.$ls.get("SESSION_ID") });
      this.$http
        .post(this.$aid.url() + "Form/loadAdditionalFormRequest", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsCompany = arr["Table6"];
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error) {
          this.userLoad = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    loadLists(){
      let id = JSON.stringify({ 
        Session_ID:this.$ls.get("SESSION_ID"),
        IDX_M_InventoryForm: Number(this.$route.params.id)
      });
      this.$http
        .post(this.$aid.url() + "Form/loadFormRequest_ByIDX_M_InventoryForm", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.selectedRequestDate = this.$moment(arr["Table"][0].Date).format('DD-MM-YYYY');
          this.selectedRequestCompany = arr["Table"][0].IDX_M_Company;
          this.selectedRequestUser = arr["Table"][0].Name
          this.selectedIsStatusColor = arr["Table"][0].isStatusColor;
          this.selectedInventoryStatusName = arr["Table"][0].InventoryStatusName
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error) {
          this.userLoad = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    loadFormRequest_ByIDX_Form(params){
      let id = [];
      let createdId = { 
        Session_ID: this.$ls.get("SESSION_ID"),
        IDX_M_InventoryForm: Number(this.$route.params.id)
      };
      
      if(params == undefined || params == null){
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }else{
        this.lastId = this.$aid.arrayMerge(this.lastId,params);
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }

      this.$http
        .post(this.$aid.url() + "Form/loadFormRequest_Manage_ByIDX_M_Form", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsRequest = arr["Table"];
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error) {
          this.userLoad = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    addForm(){
      this.requestItem.push({ });
    },
    removeForm(v){
      this.requestItem.splice(v,1)
    },
    clear(){
      this.requestItem = [];
    },
    save(){
      let itemRequest = [];
      for(let i in this.requestItem){
        itemRequest.push(
          {
            IDX_M_InventoryStock:this.requestItem[i].IDX_M_InventoryStock,
            Qty:this.requestItem[i].Qty,
            Remarks:this.requestItem[i].Remarks ? this.requestItem[i].Remarks : 'no desc' 
          }
        )
      };

      let id = JSON.stringify({
        Session_ID: this.$ls.get('SESSION_ID'),
        IDX_M_InventoryForm: Number(this.$route.params.id),
        ItemRequest: itemRequest
      });
      this.ajaxCRUD(this.$aid.url() + 'Form/saveFormDetail_Request',id,'Saving form...');
    },
    deleteO() {
      var id = JSON.stringify({
        IDX_T_InventoryRequest: this.IDX_T_InventoryRequest,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Form/deleteFormDetail_Request", id, "Deleting...");
    },
    toggleStatus(v){
      let item = this.listsRequest.filter(k => { return k.IDX_T_InventoryRequest == v });
      return item[0].isEnable ? this.enable(v) : this.disable(v);
    },
    enable(k) {
      var id = JSON.stringify({
        IDX_T_InventoryRequest: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Form/enableFormDetail_Request", id, "Enabling...");
    },
    disable(k) {
      var id = JSON.stringify({
        IDX_T_InventoryRequest: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Form/disableFormDetail_Request", id, "Disabling...");
    },
    update(){
      let id = JSON.stringify({
        Session_ID:this.$ls.get('SESSION_ID'),
        IDX_T_InventoryRequest:this.IDX_T_InventoryRequest,
        IDX_M_InventoryStock:this.IDX_M_InventoryStock,
        Qty:Number(this.Qty),
        Remarks:this.Remarks
      });
      this.ajaxCRUD(this.$aid.url() + "Form/updateFormDetail_Request", id, "Disabling...");
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
          this.spinner = false;
          this.addDialog = false;
          this.editDialog = false;
          this.loadFormRequest_ByIDX_Form();
          this.clear();
        })
        .catch(function(error) {
          this.spinner = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
  }
}
</script>

<style>
  .addForm {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 98%;
  }
  .addForm td, #customers th {
    border: 1px solid #ddd;
    padding: 8px;
  }
  .addForm tr:nth-child(even){background-color: #f2f2f2;}
  .addForm tr:hover {background-color: #ddd;}
</style>
