<template>
  <div>
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <v-btn flat to="/myrequest/"><v-icon left>keyboard_arrow_left</v-icon>EDIT FORMULIR PERMINTAAN</v-btn>
    </v-toolbar>
    <v-layout column>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-progress-linear height="2" class="mb-0" :indeterminate="spinner" background-color="grey lighten-5"></v-progress-linear>
          <!-- User Information -->
          <v-flex xs12 sm12 md12 lg12>
            <cs-stepper :id="$route.params.id" :reload="reloadStepper"></cs-stepper>
            <v-toolbar color="primary" flat dark dense>
              <v-spacer></v-spacer>
              <v-btn small :disabled="!isUpdate" @click="editForm()" v-if="!editFormDialog"><v-icon left small color="green">mode_edit</v-icon>EDIT</v-btn>
              <v-btn small :disabled="!isUpdate" @click="editFormDialog = false" v-if="editFormDialog"><v-icon small left color="yellow darken-1">clear</v-icon>CANCEL</v-btn>
              <v-btn small :disabled="(!isRequest || editFormDialog) ? true : false" @click="sendRequest()"><v-icon small left color="blue">send</v-icon>KIRIM PERMINTAAN</v-btn>
              <v-btn small :disabled="(!isCancel || editFormDialog) ? true : false " @click="cancelRequest()"><v-icon left small color="red">clear</v-icon>BATALKAN/CANCEL</v-btn>
            </v-toolbar>
            <v-card>
              <v-card-title primary-title class="title">
                INFORMASI USER
                <v-spacer></v-spacer>
                <v-chip><v-avatar :class="RequestConditionColor"></v-avatar>{{RequestCondition.toUpperCase()}}</v-chip>
                <v-chip v-if="RequestedHeadApproval"><v-avatar :class="RequestHeadApprovalColor"></v-avatar>{{RequestHeadApproval}}</v-chip>
                <v-chip v-if="RequestedGAApproval"><v-avatar :class="RequestGAApprovalColor"></v-avatar>{{RequestGAApproval}}</v-chip>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-layout row>
                  <v-flex sm6>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>NO PERMINTAAN</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>                                                    
                        <v-subheader class="text-xs-left">{{ OutRequestFormNo }}</v-subheader>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>TANGGAL PERMINTAAN</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>                                                    
                        <v-subheader class="text-xs-left">{{ OutRequestFormDate.toUpperCase() }}</v-subheader>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>PT/COMPANY</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>   
                        <v-autocomplete v-model="IDX_M_Company" :items="listsCompany" item-text="CompanyName" item-value="IDX_M_Company" :disabled="!editFormDialog"></v-autocomplete>                                                 
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>DI-BATALKAN OLEH</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>      
                        <v-subheader>{{ CanceledName }}</v-subheader>                                              
                      </v-flex>
										</v-layout>
                  </v-flex>
                  <v-flex sm6>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>DI-MINTA OLEH</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>     
                        <v-subheader>{{RequestName.toUpperCase()}}</v-subheader>                                               
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>APPROVER 1</v-subheader>
                      </v-flex>                           
                      <v-flex xs5 sm5>                                                    
                        <v-select v-model="HeadApprovalBy" :items="listsHRList" item-text="NAMEANDPOS" item-value="NIK" disabled></v-select>
                      </v-flex>
                      <v-flex xs2>
                        <v-btn v-if="editFormDialog" fab dark small @click="deptHeadDialog =! deptHeadDialog"><v-icon>search</v-icon></v-btn>
                        <v-btn v-if="editFormDialog" fab dark small @click="HeadApprovalBy = null" color="red"><v-icon>clear</v-icon></v-btn>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>APPROVER 2</v-subheader>
                      </v-flex>                           
                      <v-flex xs5 sm5>                                                    
                        <v-select v-model="Head2ApprovalBy" :items="listsHRList" item-text="NAMEANDPOS" item-value="NIK" disabled></v-select>
                      </v-flex>
                      <v-flex xs2>
                        <v-btn v-if="editFormDialog" fab dark small @click="deptHead2Dialog =! deptHead2Dialog"><v-icon>search</v-icon></v-btn>
                        <v-btn v-if="editFormDialog" fab dark small @click="Head2ApprovalBy = null" color="red"><v-icon>clear</v-icon></v-btn>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>NOTE **</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>   
                        <v-textarea v-model="FormRemarks" outline :disabled="!editFormDialog"></v-textarea>                                     
                      </v-flex>
										</v-layout>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-btn dark v-if="editFormDialog" @click="updateForm()"><v-icon color="green" left>save</v-icon>SIMPAN</v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex> 
          <!-- Request Item -->
          <v-flex sm12 md12 lg12>
            <v-toolbar color="white">
              <v-toolbar-title>BARANG DIMINTA / REQUEST ITEMS</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card>
              <v-card-title primary-title class="title">
                <v-btn dark @click="addDialog =! addDialog" v-if="isUpdate"><v-icon left color="primary">add</v-icon>TAMBAH BARANG</v-btn>
                <v-spacer></v-spacer>
                <cs-search label="Filter" @search="loadSearch" />
              </v-card-title>
              <v-card-text>
                <v-layout row dense>
                  <v-flex sm12 md12 lg12>
                    <v-data-table :headers="headers" :items="listsRequest" :loading="loading">
                      <template slot="items" slot-scope="props">
                        <tr>
                          <td class="text-xs-center">
                            <cs-action v-if="isUpdate"
                              :id="props.item.IDX_T_OutRequestFormInventory"
                              :isUpdate="props.item.isUpdate"
                              :isEnable="props.item.isEnable"
                              :isDelete="props.item.isDelete"
                              @submit="actionMenu" />
                          </td>
                          <td class="text-xs-left">
                            <v-chip color="white">
                              <v-avatar>
                                <img :src="props.item.ImageUrl" v-if="props.item.ImageUrl">
                                <span v-else style="font-size:8px">No Image</span>
                              </v-avatar>{{ props.item.InventoryStockName }}
                            </v-chip>
                            <v-badge color="orange" left>                
                              <v-icon slot="badge" dark v-if="props.item.isEnable">warning</v-icon>                 
                            </v-badge>
                          </td>
                          <td class="text-xs-center">{{ props.item.StockCategoryName }}</td>
                          <td class="text-xs-center"><span class="title">{{ numberWithCommas(props.item.Qty) }}</span></td>
                          <td class="text-xs-center">{{ props.item.Remarks }}</td>
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
        <v-toolbar dark color="primary" flat>
          <v-btn icon dark @click.native="addDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Tambah Barang</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn dark @click="itemDialog =! itemDialog">
            <v-icon left>add</v-icon> Tambah Barang
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row>
            <v-flex sm12 md12 lg12>
              <v-data-table :headers="headers" :items="requestStock" :expand="true">
                <template slot="items" slot-scope="props">
                  <tr>
                    <td class="text-xs-center"><v-btn icon @click="remove(props.index)"><v-icon color="red darken-2">delete</v-icon></v-btn></td>
                    <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                    <td class="text-xs-center"><v-text-field box label="Kuantitas" v-model="props.item.Qty" type="number"></v-text-field></td>
                    <td class="text-xs-center"><v-textarea box label="Note" v-model="props.item.Remarks" /></td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-container grid-list-md>
              <v-btn dark @click="save()">
                <v-icon left>save</v-icon> SIMPAN
              </v-btn>
            </v-container>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Stock -->
    <v-dialog v-model="itemDialog" :overlay="false">
      <v-card>
        <v-toolbar color="teal darken-3" dark>
          <v-toolbar-title>Pilih Stock</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="itemDialog =! itemDialog"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <cs-stock @submit="csStock" ref="CsStock" />
        </v-card-text> 
      </v-card>
    </v-dialog>

    <!-- edit dialog -->
    <v-dialog v-model="editDialog" scrollable persistent :overlay="false" max-width="780px" transition="dialog-transition">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Edit Barang</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click="editDialog =! editDialog"><v-icon>clear</v-icon></v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-autocomplete v-model="IDX_M_InventoryStock" :items="listsStock" chips color="blue-grey lighten-2" label="Pilih Barang" item-text="InventoryStockDesc" item-value="IDX_M_InventoryStock">
            <template slot="selection" slot-scope="data">
              <v-chip :selected="data.selected" close class="chip--select-multi" @input="data.parent.selectItem(data.item)">
                <v-avatar>
                  <img :src="data.item.ImageUrl" v-if="data.item.ImageUrl">
                  <span v-else style="font-size:8px">No Image</span>
                </v-avatar>
                {{ data.item.InventoryStockName }}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-tile-content v-text="data.item"></v-list-tile-content>
              </template>
              <template v-else>
                <v-list-tile-avatar>
                  <img :src="data.item.ImageUrl" v-if="data.item.ImageUrl">
                  <span v-else style="font-size:8px">No Image</span>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="data.item.InventoryStockName"></v-list-tile-title>
                </v-list-tile-content>
              </template>
            </template>
          </v-autocomplete>
          <v-text-field v-model="Qty" type="number" outline label="Nilai Kuantitas" />
          <v-textarea v-model="Remarks" label="Note **" outline></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark @click="update()"><v-icon left>save</v-icon>SIMPAN PERUBAHAN</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /edit dialog -->

    <!-- delete warning -->
    <v-dialog v-model="deleteDialog" max-width="350">
      <v-card>
        <v-toolbar color="primary" dark flat dense>
          <v-toolbar-title>DELETE</v-toolbar-title>
        </v-toolbar>
        <v-card-text>Anda akan meng-hapus <b>{{InventoryStockName}}</b>. <br />Apakah anda akan melanjutkan?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light @click.native="deleteDialog = false">Cancel</v-btn>
          <v-btn dark @click.native="deleteDialog = false" @click="deleteO()">YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /delete warning --> 

    <!-- Department Head -->
    <v-dialog v-model="deptHeadDialog" persistent :overlay="false" max-width="900px">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Pilih Approver 1</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="deptHeadDialog =! deptHeadDialog"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <v-text-field v-model="searchKeyword" label="Search" solo></v-text-field>
          <v-data-table :headers="headersDeptHead" :items="listsHRList" :search="searchKeyword">
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">
                  <v-tooltip bottom>
                    <v-btn fab flat small slot="activator" @click="chooseDeptHead(props.item.NIK)"><v-icon>check</v-icon></v-btn>
                    <span>Pilih {{ props.item.FULLNAME }}</span>
                  </v-tooltip>
                </td>
                <td class="text-xs-center">{{ props.item.NIK }}</td>
                <td class="text-xs-center">{{ props.item.FULLNAME }}</td>
                <td class="text-xs-center">{{ props.item.POS_NAME }}</td>
                <td class="text-xs-center">{{ props.item.DEPARTMENT_NAME }}</td>
                <td class="text-xs-center">{{ props.item.DIVISION_NAME }}</td>
                <td class="text-xs-center">{{ props.item.DIRECTORATE_NAME }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text> 
      </v-card>
    </v-dialog> 

    <v-dialog v-model="deptHead2Dialog" persistent :overlay="false" max-width="900px">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Pilih Approver 2</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="deptHead2Dialog =! deptHead2Dialog"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <v-text-field v-model="searchKeyword" label="Search" solo></v-text-field>
          <v-data-table :headers="headersDeptHead" :items="listsHRList" :search="searchKeyword">
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">
                  <v-tooltip bottom>
                    <v-btn fab flat small slot="activator" @click="chooseDeptHead2(props.item.NIK)"><v-icon>check</v-icon></v-btn>
                    <span>Pilih {{ props.item.FULLNAME }}</span>
                  </v-tooltip>
                </td>
                <td class="text-xs-center">{{ props.item.NIK }}</td>
                <td class="text-xs-center">{{ props.item.FULLNAME }}</td>
                <td class="text-xs-center">{{ props.item.POS_NAME }}</td>
                <td class="text-xs-center">{{ props.item.DEPARTMENT_NAME }}</td>
                <td class="text-xs-center">{{ props.item.DIVISION_NAME }}</td>
                <td class="text-xs-center">{{ props.item.DIRECTORATE_NAME }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text> 
      </v-card>
    </v-dialog> 
  </div>
</template>

<script>
import CsToggle from '@/components/custom/CsToggleToolbar';
import CsActionMenu from '@/components/custom/CsActionMenu';
import CsSearch from '@/components/custom/CsSearch';
import CsStepper from '@/components/custom/CsStepper';
import CsStock from '@/components/custom/CsSelectStock';

export default {
  name: 'cs-request-form',
  components: {
    'cs-search': CsSearch,
    'cs-toggle': CsToggle,
    'cs-action': CsActionMenu,
    'cs-stepper': CsStepper,
    'cs-stock': CsStock
  },
  created(){
    this.loadLists();
    this.loadRequestDetail();
    this.loadAdditional();
  },
  computed:{

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
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false /* doesn't work with directive */
      },

      //dialog
      addDialog:false,
      editDialog:false,
      editFormDialog:false,
      deleteDialog:false,
      isEditing:false,
      itemDialog:false,
      deptHeadDialog:false,
      deptHead2Dialog:false,
      reloadStepper:false,
      
      //object
      IDX_T_OutRequestFormInventory:null,
      IDX_M_InventoryStock:null,
      Qty:1.00,
      Remarks:null,
      InventoryStockName:null,
      search:null,
      searchKeyword:null,

      // advance search
      selectedAdvanceStock:[],
      searchStock:null,

      // object lists
      RequestedBy:null,
      RequestName:null,
      OutRequestFormNo:null,
      OutRequestFormDate:null,
      GAApprovalBy:null,
      GAApprovalName:null,
      HeadApprovalBy:null,
      HeadApprovalName:null,
      Head2ApprovalBy:null,
      Head2ApprovalName:null,
      CanceledName:null,
      IDX_M_Company:null,
      CompanyAlias:null,
      FormRemarks:null,
      RequestedHeadApproval:null,
      RequestedHeadApprovalColor:null,
      RequestedGAApproval:null,
      RequestedGAApprovalColor:null,
      RequestCondition:null,
      RequestConditionColor:null,
      isUpdate:false,
      isCancel:false,
      isRequest:false,

      // table props
      headers: [
        { text:'AKSI',align:'center',sortable:false,value:null },
        { text:'NAMA BARANG',align:'left',sortable:true,value:'InventoryTypeModelName' },
        { text:'KATEGORI BARANG',align:'center',sortable:true,value:'StockCategory' },
        { text:'KUANTITAS',align:'center',sortable:true,value:'Qty' },
        { text:'NOTE',align:'center',sortable:false,value:'Remarks' },
      ],
      headersDeptHead: [
        { text:null,align:'center',sortable:false,value:null },
        { text:'NIK',align:'center',sortable:true,value:'NIK' },
        { text:'Nama Lengkap',align:'center',sortable:true,value:'FULLNAME' },
        { text:'Position',align:'center',sortable:true,value:'POS_NAME' },
        { text:'Department',align:'center',sortable:true,value:'DEPARTMENT_NAME' },
        { text:'Division',align:'center',sortable:false,value:'DIVISION_NAME' },
        { text:'Directorate',align:'center',sortable:true,value:'DIRECTORATE_NAME' },
      ],
      items: [],
      lastId: [],
      listsRequest: [],
      listsStock: [],
      requestStock:[],
      listsCompany:[],
      listsHRList:[],
    }
  },
  methods: {
    csStock(e){
      this.requestStock = e;
    },
    remove(n){
      let id = this.requestStock[n].IDX_M_InventoryStock;
      this.requestStock.splice(n,1);
      setTimeout(() => this.$refs.CsStock.remove(id),300);
    },
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let arr = this.listsRequest.filter(k => { return k.IDX_T_OutRequestFormInventory == id })
      this.InventoryStockName = arr[0].InventoryStockName;
      this.IDX_M_InventoryStock = arr[0].IDX_M_InventoryStock;
      this.Qty = arr[0].Qty;
      this.Remarks = arr[0].Remarks;
      this.IDX_T_OutRequestFormInventory = id;
      
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
      this.loadRequestDetail(id);
    },
    loadAdditional(){
      let id = JSON.stringify({  });
      this.$http
        .post(this.$aid.url() + "ATKRequest/loadRequestFilterList", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsStock = arr["Table7"];
          this.listsHRList = arr["Table8"];
          this.listsCompany = arr["Table9"];
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
        IDX_T_OutRequestForm: Number(this.$route.params.id),
        NIK: this.$ls.get('NIK')
      });
      this.$http
        .post(this.$aid.url() + "ATKRequest/loadRequest_ByIDXRequest", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.RequestedBy = arr["Table"][0].RequestedBy;
          this.RequestName = arr["Table"][0].RequestName;
          this.OutRequestFormNo = arr["Table"][0].OutRequestFormNo;
          this.OutRequestFormDate = this.$moment(arr["Table"][0].OutRequestFormDate).format('DD MMMM YYYY');
          this.GAApprovalBy = arr["Table"][0].GAApprovalBy;
          this.GAApprovalName = arr["Table"][0].GAApprovalName;
          this.HeadApprovalBy = arr["Table"][0].HeadApprovalBy;
          this.HeadApprovalName = arr["Table"][0].HeadApprovalName;
          this.Head2ApprovalBy = arr["Table"][0].Head2ApprovalBy;
          this.Head2ApprovalName = arr["Table"][0].Head2ApprovalName;
          this.CanceledName = arr["Table"][0].CanceledName;
          this.IDX_M_Company = arr["Table"][0].IDX_M_Company;
          this.CompanyAlias = arr["Table"][0].CompanyName;
          this.FormRemarks = arr["Table"][0].Remarks;
          this.RequestHeadApproval = arr["Table"][0].RequestHeadApproval;
          this.RequestHeadApprovalColor = arr["Table"][0].RequestHeadApprovalColor;
          this.RequestGAApproval = arr["Table"][0].RequestGAApproval;
          this.RequestGAApprovalColor = arr["Table"][0].RequestGAApprovalColor;
          this.RequestCondition = arr["Table"][0].RequestCondition;
          this.RequestConditionColor = arr["Table"][0].RequestConditionColor;
          this.isUpdate = arr["Table"][0].isUpdate ? true : false;
          this.isCancel = arr["Table"][0].isCancel ? true : false;
          this.isRequest = arr["Table"][0].isRequest ? true : false;
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
    loadRequestDetail(params){
      let id = [];
      let createdId = { 
        Keyword:'',
        NIK: this.$ls.get("NIK"),
        IDX_T_OutRequestForm: Number(this.$route.params.id),
        IDX_M_InventoryStock: this.selectedAdvanceStock.toString()
      };
      
      if(params == undefined || params == null){
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }else{
        this.lastId = this.$aid.arrayMerge(this.lastId,params);
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }

      this.$http
        .post(this.$aid.url() + "ATKRequest/loadRequestDetail_ByIDXRequest", id, {
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
    clear(){
      this.requestStock = [];
    },

    editForm(){
      this.editFormDialog = true;
    },
    updateForm(){
      let id = JSON.stringify({
        IDX_T_OutRequestForm: Number(this.$route.params.id),
        IDX_M_Company: this.IDX_M_Company,
        HeadApprovedBy: this.HeadApprovalBy,
        Head2ApprovedBy: this.Head2ApprovalBy,
        Remarks: this.FormRemarks,
        NIK: this.$ls.get("NIK")
      });
      this.ajaxCRUD(this.$aid.url() + "ATKRequest/updateRequest", id, "Updating...");
    },
    sendRequest() {
      var id = JSON.stringify({
        IDX_T_OutRequestForm: Number(this.$route.params.id),
        NIK: this.$ls.get("NIK")
      });
      this.ajaxCRUD(this.$aid.url() + "ATKRequest/submitRequest_ByIDXRequest", id, "Deleting...");
    },
    cancelRequest() {
      var id = JSON.stringify({
        IDX_T_OutRequestForm: Number(this.$route.params.id),
        NIK: this.$ls.get("NIK")
      });
      this.ajaxCRUD(this.$aid.url() + "ATKRequest/cancelRequest_ByIDXRequest", id, "Canceling...");
    },
    save(){
      let requestStock = [];
      for(let i in this.requestStock){
        requestStock.push(
          {
            IDX_M_InventoryStock:this.requestStock[i].IDX_M_InventoryStock,
            Qty:this.requestStock[i].Qty,
            Remarks:this.requestStock[i].Remarks 
          }
        )
      };

      let id = JSON.stringify({
        NIK: this.$ls.get('NIK'),
        IDX_T_OutRequestForm: Number(this.$route.params.id),
        ItemRequest: requestStock
      });
      this.ajaxCRUD(this.$aid.url() + 'ATKRequest/saveRequestDetail',id,'Saving form...');
    },
    chooseDeptHead(id){
      this.HeadApprovalBy = id;
      this.deptHeadDialog = false;
    },
    chooseDeptHead2(id){
      this.Head2ApprovalBy = id;
      this.deptHead2Dialog = false;
    },
    deleteO() {
      var id = JSON.stringify({
        IDX_T_OutRequestFormInventory: this.IDX_T_OutRequestFormInventory,
        NIK: this.$ls.get("NIK")
      });
      this.ajaxCRUD(this.$aid.url() + "ATKRequest/deleteRequestDetail", id, "Deleting...");
    },
    toggleStatus(v){
      let item = this.listsRequest.filter(k => { return k.IDX_T_OutRequestFormInventory == v });
      return item[0].isEnable ? this.enable(v) : this.disable(v);
    },
    enable(k) {
      var id = JSON.stringify({
        IDX_T_OutRequestFormInventory: k,
        NIK: this.$ls.get("NIK")
      });
      this.ajaxCRUD(this.$aid.url() + "ATKRequest/enableRequestDetail", id, "Enabling...");
    },
    disable(k) {
      var id = JSON.stringify({
        IDX_T_OutRequestFormInventory: k,
        NIK: this.$ls.get("NIK")
      });
      this.ajaxCRUD(this.$aid.url() + "ATKRequest/disableRequestDetail", id, "Disabling...");
    },
    update(){
      let id = JSON.stringify({
        NIK:this.$ls.get('NIK'),
        IDX_T_OutRequestFormInventory:this.IDX_T_OutRequestFormInventory,
        IDX_M_InventoryStock:this.IDX_M_InventoryStock,
        Qty:this.Qty,
        Remarks:this.Remarks
      });
      this.ajaxCRUD(this.$aid.url() + "ATKRequest/updateRequestDetail", id, "Disabling...");
    },
    /**
     * 
     * @param {*} number 
     */
    numberWithCommas(number) {
        if (number == undefined || number == null) number = 0;
        var parts = number.toString().split(".");
        return (
            parts[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") +
            (parts[1] ? "." + parts[1] : "")
        );
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
            this.reloadStepper = true;
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          // var arr = response.data;
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
          this.reloadStepper = false;
          this.editFormDialog = false;
          this.loadRequestDetail();
          this.loadLists();
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
