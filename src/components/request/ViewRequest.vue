<template>
  <div>
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <v-btn flat to="/myrequest/"><v-icon left>keyboard_arrow_left</v-icon>PERMINTAAN SAYA</v-btn>
    </v-toolbar>
    <v-layout column>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-progress-linear height="2" class="mb-0" :indeterminate="spinner" background-color="grey lighten-5"></v-progress-linear>
          <!-- User Information -->
          <v-flex xs12 sm12 md12 lg12>
            <cs-stepper :id="$route.params.id"></cs-stepper>
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
                          <v-subheader>PT / COMPANY</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>                                                    
                        <v-subheader class="text-xs-left">{{ CompanyName }}</v-subheader>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>DI-CANCEL OLEH</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>                                                    
                        <v-subheader class="text-xs-left">{{ CanceledName }}</v-subheader>
                      </v-flex>
										</v-layout>
                  </v-flex>
                  <v-flex sm6>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>DI-MINTA OLEH</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-subheader class="text-xs-left">{{ RequestName.toUpperCase() }}</v-subheader>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>APPROVER 1</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-subheader class="text-xs-left">{{ HeadApprovalName }}</v-subheader>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>APPROVER 2</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-subheader class="text-xs-left">{{ Head2ApprovalName }}</v-subheader>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>NOTE</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-subheader class="text-xs-left">{{ FormRemarks }}</v-subheader>
                      </v-flex>
										</v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex> 
          <!-- Request Item -->
          <v-flex sm12 md12 lg12>
            <v-card>
              <v-toolbar color="white" flat>
                <v-toolbar-title>BARANG DIMINTA / REQUEST ITEMS</v-toolbar-title>
                <v-spacer></v-spacer>
                <cs-search label="Filter" @search="loadSearch" />
              </v-toolbar>
              <v-divider></v-divider>
              <v-card-text>
                <v-layout row dense>
                  <v-flex sm12 md12 lg12>
                    <v-data-table :headers="headers" :items="listsRequest" :loading="loading">
                      <template slot="items" slot-scope="props">
                        <tr>
                          <td class="text-xs-left">
                            <v-chip color="white">
                              <v-avatar>
                                <img :src="props.item.ImageUrl" v-if="props.item.ImageUrl">
                                <span v-else style="font-size:8px">No Image</span>
                              </v-avatar>{{ props.item.InventoryStockName }}
                            </v-chip>
                          </td>
                          <td class="text-xs-center"><v-chip>{{ props.item.StockCategoryName }}</v-chip></td>
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
  </div>
</template>

<script>
import CsToggle from '@/components/custom/CsToggleToolbar';
import CsSearch from '@/components/custom/CsSearch';
import CsStepper from '@/components/custom/CsStepper';

export default {
  name: 'cs-request-form',
  components: {
    'cs-search': CsSearch,
    'cs-toggle': CsToggle,
    'cs-stepper': CsStepper
  },
  created(){
    this.loadLists();
    this.loadRequestDetail();
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
      
      //object
      IDX_T_OutRequestFormInventory:null,
      IDX_M_InventoryStock:null,
      Qty:0,
      Remarks:null,
      InventoryStockName:null,
      search:null,

      // advance search
      selectedAdvanceStock:[],

      // object lists
      RequestedBy:null,
      RequestName:null,
      OutRequestFormNo:null,
      OutRequestFormDate:null,
      GAApprovalBy:null,
      GAApprovalName:null,
      HeadApprovalBy:null,
      Head2ApprovalBy:null,
      HeadApprovalName:null,
      Head2ApprovalName:null,
      CanceledName:null,
      CompanyName:null,
      FormRemarks:null,
      RequestedHeadApproval:null,
      RequestedHeadApprovalColor:null,
      RequestedGAApproval:null,
      RequestedGAApprovalColor:null,
      RequestCondition:null,
      RequestConditionColor:null,
      
      // table props
      headers: [
        { text:'NAMA BARANG',align:'left',sortable:true,value:'InventoryTypeModelName' },
        { text:'KATEGORI BARANG',align:'center',sortable:true,value:'StockCategoryName' },
        { text:'KUANTITAS',align:'center',sortable:true,value:'Qty' },
        { text:'NOTE **',align:'center',sortable:false,value:'Remarks' },
      ],
      items: [],
      lastId: [],
      listsRequest: [],
      listsStock: [],
    }
  },
  methods: {
    loadSearch(p){
      let id;
      if((this.lastId != null) || (this.lastId != undefined)){
        id = this.$aid.arrayMerge(this.lastId,p)
      }else{
        id = this.lastId = p;
      }
      this.loadRequestDetail(id);
    },
    loadLists(){
      let id = JSON.stringify({ 
        IDX_T_OutRequestForm: Number(this.$route.params.id),
        Session_ID: this.$ls.get('SESSION_ID')
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
          // var arr = response.data;
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
          this.CompanyName = arr["Table"][0].CompanyName;
          this.FormRemarks = arr["Table"][0].Remarks;
          this.RequestHeadApproval = arr["Table"][0].RequestHeadApproval;
          this.RequestHeadApprovalColor = arr["Table"][0].RequestHeadApprovalColor;
          this.RequestGAApproval = arr["Table"][0].RequestGAApproval;
          this.RequestGAApprovalColor = arr["Table"][0].RequestGAApprovalColor;
          this.RequestCondition = arr["Table"][0].RequestCondition;
          this.RequestConditionColor = arr["Table"][0].RequestConditionColor;
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
        // Keyword:'',
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
          // var arr = response.data;
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
          }
        })
        .then(function(response) {
          // var arr = JSON.parse(response.data);
          var arr = response.data;
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
          this.loadRequestDetail();
          this.loadLists();
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
