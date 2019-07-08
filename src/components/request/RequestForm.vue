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
                <v-btn to="/newRequest/" v-if="isNew"><v-icon color="primary" left>add</v-icon>PERMINTAAN BARU</v-btn>
                <v-spacer></v-spacer>
                <cs-search label="Filter" @search="loadSearch" />
              </v-card-title>
              <v-card-text>
                <v-data-table :headers="headers" :items="lists" :loading="loading">
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td class="text-xs-center">
                        <cs-action v-if="props.item.isUpdate || props.item.isReceive"
                          :id="props.item.IDX_T_OutRequestForm"
                          :isUpdate="props.item.isUpdate"
                          :isReceive="props.item.isReceive"
                          @submit="actionMenu" />
                      </td> 
                      <td class="text-xs-left">
                        <v-chip flat><v-icon left :color="props.item.RequestConditionColor">fiber_manual_record</v-icon> {{ props.item.RequestCondition.toUpperCase() }}</v-chip>
                      </td>
                      <td class="text-xs-left">
                        <v-btn flat small :to="/viewRequest/+props.item.IDX_T_OutRequestForm"><v-icon left color="blue lighten-1" small>public</v-icon> {{ props.item.OutRequestFormNo }}</v-btn>
                      </td>
                      <td class="text-xs-center">{{ $moment(props.item.OutRequestFormDate).format('DD MMMM YYYY') }}</td>
                      <td class="text-xs-center">{{ props.item.RequestName }}</td>
                      <td class="text-xs-center">{{ props.item.HeadName }}</td>
                      <td class="text-xs-center">{{ props.item.Head2Name }}</td>
                      <td class="text-xs-center">{{ props.item.ReceivedName }}</td>
                      <td class="text-xs-center">{{ props.item.ReceivedDateTime ? $moment(props.item.ReceivedDateTime).format('DD MMMM YYYY') : '' }}</td>
                      <td class="text-xs-center">{{ props.item.CanceledName }}</td>
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
        <v-toolbar-title>FILTER PENCARIAN</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-autocomplete outline v-model="selectedAdvanceCanceledBy" :items="listsCanceledBy" append-icon="cancel" label="Dibatalkan oleh" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceApprover" :items="listsApprover" append-icon="face" label="Approver 1" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceApprover2" :items="listsApprover" append-icon="face" label="Approver 2" item-text="Name" item-value="NIK" multiple chips deletable-chips></v-autocomplete>
        <v-autocomplete outline v-model="selectedAdvanceGeneralStatus" append-icon="plus_one" :items="listsStatusGeneral" chips color="blue-grey lighten-2" label="Status" item-text="StatusName" item-value="IDX_M_Status" multiple clearable deletable-chips></v-autocomplete>
        <v-spacer></v-spacer>
        <v-btn dark @click="loadList"><v-icon left>search</v-icon>CARI</v-btn>
      </v-container>
    </v-navigation-drawer>              
    <!-- /add contact -->            
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
      //table prop
      headers: [
        { text:'AKSI',align:'center',sortable:false,value:null },
        { text:'STATUS',align:'center',sortable:true,value:'RequestCondition' },
        { text:'FORM NO',align:'center',sortable:true,value:'OutRequestFormNo' },
        { text:'TANGGAL PERMINTAAN',align:'center',sortable:true,value:'OutRequestFormDate' },
        { text:'DIMINTA OLEH',align:'center',sortable:true,value:'RequestName' },
        { text:'APPROVER 1',align:'center',sortable:true,value:'HeadName' },
        { text:'APPROVER 2',align:'center',sortable:true,value:'Head2Name' },
        { text:'DITERIMA OLEH',align:'center',sortable:true,value:'ReceivedName' },
        { text:'WAKTU TERIMA',align:'center',sortable:true,value:'ReceivedDateTime' },
        { text:'DIBATALKAN OLEH',align:'center',sortable:true,value:'CanceledName' },
      ],
      
      //object
      canceledRemarks:null,

      // dialog
      deleteDialog: false,
      receiveDialog: false,
      searchDialog: true,
      isNew:false,

      //advance search
      selectedAdvanceApprover:[],
      selectedAdvanceApprover2:[],
      selectedAdvanceCanceledBy:[],
      selectedAdvanceHeadApproval:[],
      selectedAdvanceGAApproval:[],
      selectedAdvanceGeneralStatus:[],
      selectedAdvanceTimePeriod:0,
      selectedAdvanceDateFrom:this.$moment(new Date('1900-01-01')).format('YYYY-MM-DD'),
      selectedAdvanceDateTo:this.$moment(new Date()).format('YYYY-MM-DD'),
      OutRequestFormNo:null,
      IDX_T_OutRequestForm:null,

      //sort
      selectedSortBy:null,
      selectedSequence:null,
      
      //pagination
      pageSize:25,
      maxPage:1,
      currentPage:1,
      totalRecords: 0,

      // ddl
      lastId:[],
      lists:[],
      listsApprover:[], // list head yang nge-approve
      listsHeadApproval:[], // lists status approval 0/1
      listsGAApproval:[],   // lists status approval 0/1
      listsCanceledBy:[],
      listsStatusGeneral:[],
      listsHRIS:[],
      
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
    selectedAdvanceApprover(){
      this.loadList();
    },
    selectedAdvanceApprover2(){
      this.loadList();
    },
    selectedAdvanceCanceledBy(){
      this.loadList();
    },
    selectedAdvanceGeneralStatus(){
      this.loadList();
    },
  },
  methods:{    
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let arr = this.lists.filter(k => { return k.IDX_T_OutRequestForm == id })
      this.IDX_T_OutRequestForm = id;
      this.OutRequestFormNo = arr[0].OutRequestFormNo;

      switch (code){
        case 'isUpdate':
          this.$router.push('/editRequest/'+id);
        break;
        case 'isReceive':
          this.receivedForm();
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
        Keyword:'',
        Requester:this.$ls.get('NIK'),
        Approver:this.selectedAdvanceApprover.toString(),
        Approver2:this.selectedAdvanceApprover2.toString(),
        Canceler:this.selectedAdvanceCanceledBy.toString(),
        // HeadApproval:this.selectedAdvanceHeadApproval.toString(),
        // Head2Approval:this.selectedAdvanceHeadApproval2.toString(),
        // GAApproval:this.selectedAdvanceGAApproval.toString(),
        // Status:this.selectedAdvanceGeneralStatus.toString(),
        // TimePeriod:this.selectedAdvanceTimePeriod,
        // DateFrom:this.selectedAdvanceDateFrom,
        // DateTo:this.selectedAdvanceDateTo,
        //sort and pagination
        SortBy:this.selectedSortBy,
        SortSequence:this.selectedSequence,
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
        .post(this.$aid.url() + "ATKRequest/loadRequest", id, {
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

          // var arr = response.data;
          // this.lists = arr["Table"];
          // console.log(this.lists)
          // this.totalRecords = arr["Table1"][0]['TotalRecords'];
          // this.maxPage = arr["Table1"][0]['MaxPage'];
          // this.isNew = arr["Table1"][0]['isNew'];
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
        .post(this.$aid.url() + "ATKRequest/loadRequestFilterList",{}, {
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          // var arr = response.data;
          this.listsApprover = arr["Table"];
          this.listsCanceledBy = arr["Table3"];
          this.listsStatusGeneral = arr["Table6"];
          this.listsHRIS = arr["Table8"];
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
    receivedForm(){
      let id = JSON.stringify({
        NIK:this.$ls.get('NIK'),
        IDX_T_OutRequestForm:this.IDX_T_OutRequestForm,
        ReceivedBy: this.$ls.get('NIK'),
        ReceivedRemarks: null
      });
      this.ajaxCRUD(this.$aid.url() + "ATKRequest/receivedRequest", id, "Received...");
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
