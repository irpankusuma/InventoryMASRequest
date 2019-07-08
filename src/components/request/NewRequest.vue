<template>
  <div>
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <v-btn flat to="/myrequest/"><v-icon left>keyboard_arrow_left</v-icon>FORMULIR PERMINTAAN BARANG</v-btn>
    </v-toolbar>
    <v-layout column>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-progress-linear height="2" class="mb-0 mt-0" :indeterminate="spinner" background-color="grey lighten-5"></v-progress-linear>
          <v-flex xs12 sm12 md12 lg12>
            <v-card flat>
              <p class="text-md-center">
                <v-avatar size="124px">
                  <img src="https://apps.alam-sutera.com/ExitForm/aidcore/images/alamsuteraICON.png">
                </v-avatar>  
              </p>
              <p class="text-md-center mt-0">
                <v-layout row wrap>
                  <v-flex xs12>
                    <span class="headline">PERMINTAAN INVENTORY</span>  
                  </v-flex>
                </v-layout>
              </p>
              <v-card-title primary-title class="title">INFORMASI USER</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-layout row>
                  <v-flex sm6>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>Tanggal Permintaan</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>                                                    
                        <v-subheader class="subtitle">{{ selectedRequestDate.toUpperCase() }}</v-subheader>                            
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>PT / Company</v-subheader>
                      </v-flex>                           
                      <v-flex xs8 sm8>                                                    
                        <v-autocomplete clearable outline label="Pilih PT / Company" :items="listsCompany" item-text="CompanyName" item-value="IDX_M_Company" :required="true" v-model="selectedRequestCompany"></v-autocomplete>                                             
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>Approver 1</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-autocomplete outline disabled :items="listHRList" item-text="NAMEANDPOS" item-value="NIK" :required="true" v-model="selectedRequestDepartmentHead"></v-autocomplete>                                              
                      </v-flex>
                      <v-flex xs1 sm1>
                        <v-tooltip bottom>
                          <v-btn dark fab small slot="activator" @click="deptHeadDialog =! deptHeadDialog"><v-icon>search</v-icon></v-btn>  
                          <span>Cari Approver 1</span>
                        </v-tooltip>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>Approver 2</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-autocomplete outline disabled :items="listHRList" item-text="NAMEANDPOS" item-value="NIK" :required="true" v-model="selectedRequestDepartmentHead2"></v-autocomplete>                                              
                      </v-flex>
                      <v-flex xs1 sm1>
                        <v-tooltip bottom>
                          <v-btn dark fab small slot="activator" @click="deptHeadDialog2 =! deptHeadDialog2"><v-icon>search</v-icon></v-btn>  
                          <span>Cari Approver 2</span>
                        </v-tooltip>
                      </v-flex>
										</v-layout>
                  </v-flex>
                  <v-flex sm6>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>Di-minta Oleh</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-subheader class="subtitle">{{ selectedRequestUser.toUpperCase() }}</v-subheader>
                      </v-flex>
										</v-layout>
                    <v-layout row>
                      <v-flex xs4 sm4 md4 lg4>
                          <v-subheader>Note **</v-subheader>
                      </v-flex>                           
                      <v-flex xs7 sm7>                                                    
                        <v-textarea v-model="Remarks" outline></v-textarea>
                      </v-flex>
										</v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex> 
          <v-flex xs12 sm12 md12 lg12 x12 mt-2>
            <v-card flat>
              <v-toolbar flat dense>
                <v-toolbar-title>PERMINTAAN BARANG</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark @click="itemDialog =! itemDialog" style="float:right">
                      <v-icon left>add</v-icon> PILIH BARANG
                    </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-data-table :headers="headersRequest" :items="requestStock" :expand="true">
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td class="text-xs-center"><v-btn icon @click="remove(props.index)"><v-icon color="red darken-2">delete</v-icon></v-btn></td>
                      <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
                      <td class="text-xs-center"><v-text-field box label="Kuantitas" v-model="props.item.Qty" type="number"></v-text-field></td>
                      <td class="text-xs-center"><v-textarea box label="Note" v-model="props.item.Remarks" /></td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn @click="save(false)" dark><v-icon color="lime" left>drafts</v-icon>SIMPAN DRAFT</v-btn>
                <v-btn @click="save(true)" dark><v-icon color="cyan" left>send</v-icon>KIRIM REQUEST</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>

    <!-- Department Head -->
    <v-dialog v-model="deptHeadDialog" persistent :overlay="false" max-width="900px">
      <v-card>
        <v-toolbar color="primary" flat dense dark>
          <v-toolbar-title>Pilih Approver 1</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="deptHeadDialog =! deptHeadDialog"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <v-text-field v-model="searchKeyword" label="Pencarian" outline append-icon="search"></v-text-field>
          <v-data-table :headers="headers" :items="listHRList" :search="searchKeyword">
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">
                  <v-tooltip bottom>
                    <v-btn fab small slot="activator" @click="chooseDeptHead(props.item.NIK)"><v-icon color="green">check</v-icon></v-btn>
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

    <v-dialog v-model="deptHeadDialog2" persistent :overlay="false" max-width="900px">
      <v-card>
        <v-toolbar color="primary" flat dense dark>
          <v-toolbar-title>Pilih Approver 2</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="deptHeadDialog2 =! deptHeadDialog2"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <v-text-field v-model="searchKeyword" label="Pencarian" outline append-icon="search"></v-text-field>
          <v-data-table :headers="headers" :items="listHRList" :search="searchKeyword">
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">
                  <v-tooltip bottom>
                    <v-btn fab small slot="activator" @click="chooseDeptHead2(props.item.NIK)"><v-icon color="green">check</v-icon></v-btn>
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
    
    <!-- Item -->
    <v-dialog v-model="itemDialog" :overlay="false" lazy>
      <v-card>
        <v-toolbar color="teal darken-3" dark dense>
          <v-toolbar-title>Pilih Barang</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="itemDialog =! itemDialog"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <cs-stock @submit="csStock" ref="csStock" />
        </v-card-text> 
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CsToggle from '@/components/custom/CsToggleToolbar';
import CsSelectStock from '@/components/custom/CsSelectStock';

export default {
  name: 'cs-request-form',
  components: {
    'cs-toggle': CsToggle,
    'cs-stock': CsSelectStock
  },
  created(){
    this.loadFilterList();
    this.getUserName();
  },
  data(){
    return {
      headers: [
        { text:null,align:'center',sortable:false,value:null },
        { text:'NIK',align:'center',sortable:true,value:'NIK' },
        { text:'Nama Lengkap',align:'center',sortable:true,value:'FULLNAME' },
        { text:'Posisi',align:'center',sortable:true,value:'POS_NAME' },
        { text:'Department',align:'center',sortable:true,value:'DEPARTMENT_NAME' },
        { text:'Division',align:'center',sortable:false,value:'DIVISION_NAME' },
        { text:'Directorate',align:'center',sortable:true,value:'DIRECTORATE_NAME' },
      ],
      headersRequest:[
        { text:'AKSI',align:'center',sortable:false,value:null },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Kuantiti',align:'center',sortable:true,value:'Qty' },
        { text:'Note',align:'center',sortable:true,value:'Remarks' },
      ],
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false /* doesn't work with directive */
      },

      // default application
      statusLoad: "Loading...",
      alert: false,
      message: null,
      timeout: 6000,
      color: "",
      spinner: false,
      loading: false,
      send:false,
      
      deptHeadDialog:false,
      deptHeadDialog2:false,
      itemDialog:false,

      searchKeyword:null,
      requestStock:[],
      
      selectedRequestDate: this.$moment(new Date()).format("DD MMMM YYYY"),
      selectedRequestCompany: null,
      selectedRequestUser: null,
      selectedRequestDepartmentHead:null,
      selectedRequestDepartmentHead2:null,
      
      items: [],
      listsCompany: [],
      listHRList:[],
      listsConversion:[],
      Remarks:null,
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
    loadFilterList(){
      let id = JSON.stringify({ });
      this.$http
        .post(this.$aid.url() + "ATKRequest/loadRequestFilterList", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listHRList = arr["Table8"];
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
    getUserName(){
      let id = JSON.stringify({ NIK:this.$ls.get('NIK') });
      this.$http
        .post(this.$aid.url() + "ATKRequest/getUserName", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.selectedRequestUser = arr['Table'][0].FULLNAME;
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
    chooseDeptHead(value){
      this.selectedRequestDepartmentHead = value;
      this.deptHeadDialog = false;
    },
    chooseDeptHead2(value){
      this.selectedRequestDepartmentHead2 = value;
      this.deptHeadDialog2 = false;
    },
    save(e){
       let requestStock = [];
      for(let i in this.requestStock){
        requestStock.push(
          {
            IDX_M_InventoryStock:this.requestStock[i].IDX_M_InventoryStock,
            isDefault:this.requestStock[i].isDefault,
            Qty: Number(this.requestStock[i].Qty.replace(/,/g,'')),
            Remarks:this.requestStock[i].Remarks
          }
        )
      };

      let id = JSON.stringify({
        NIK: this.$ls.get('NIK'),
        IDX_M_Company: this.selectedRequestCompany,
        HeadApprovedBy: this.selectedRequestDepartmentHead,
        Head2ApprovedBy: this.selectedRequestDepartmentHead2,
        Remarks: this.Remarks,
        ItemRequest: requestStock
      });
      let api = e ? 'ATKRequest/saveRequest_Submit' : 'ATKRequest/saveRequest_Draft';
      this.ajaxCRUD(this.$aid.url() + api,id,'Saving form...');
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

          if(arr["Table"][0].StatusCSS == 'success'){
            this.$router.go(-1);            
          }
        })
        .then(function() {
          this.spinner = false;
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
