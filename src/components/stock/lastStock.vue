<template>
  <div>
    <v-toolbar app color="grey darken-3" flat dark>
      <cs-toggle />STOCK
    </v-toolbar>

    <!-- container -->
    <v-container fluid>
      <v-layout column>
        <!-- Stock Existing -->
        <cs-table-report 
          filename="Report_Stock.xls"
          :headerExcel="headersStock_Excel"
          title="Stock Existing"
          color="teal darken-1"
          :items="listsReportByStock" 
          :headers="headersStock" 
          :filter="true"
          :body="headersStock" 
          :loading="loading" />
      </v-layout>
    </v-container>

    <v-navigation-drawer right app v-model="searchDialog" light width="380">
      <v-toolbar flat>
        <v-toolbar-title>Advance Search</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-autocomplete outline v-model="selectedAdvanceInventoryStock" :items="listsStock" append-icon="local_library" label="Stock" item-text="InventoryStockName" item-value="IDX_M_InventoryStock" multiple chips deletable-chips></v-autocomplete>
        <!-- <v-autocomplete outline v-model="selectedAdvanceDepartmentName" :items="listsDepartment" append-icon="business" label="Department" item-text="DEPARTMENT_NAME" item-value="DEPARTMENT_NAME" multiple chips deletable-chips></v-autocomplete> -->
        <!-- <v-text-field outline v-model="selectedAdvanceDateFrom" label="Date From" type="date"></v-text-field>
        <v-text-field outline v-model="selectedAdvanceDateTo" label="Date To" type="date"></v-text-field> -->
        <v-spacer></v-spacer>
        <v-btn dark @click="loadLists"><v-icon left>search</v-icon>Search</v-btn>
      </v-container>
    </v-navigation-drawer>              
  </div>
</template>

<script>
import CsToggle from '@/components/custom/CsToggleToolbar';
import CsDataTableReport from '@/components/custom/DataTableReport';

export default {
  components:{
    'cs-toggle': CsToggle,
    'cs-table-report': CsDataTableReport
  },
  data(){
    return {
      listsReportByStock:[],
      listsReportStockByDepartment:[],
      listsStock:[],
      listsDepartment:[],

      selectedAdvanceInventoryStock:[],
      selectedAdvanceDepartmentName:[],
      selectedAdvanceDateFrom:this.$moment(new Date()).format('YYYY-MM-DD'),
      selectedAdvanceDateTo:this.$moment(new Date()).format('YYYY-MM-DD'),

      //table
      headersStock:[],
      headersStockByDept:[],
      
      headersStock_Excel:[],
      headersStockByDept_Excel:[],

      bodyStock:[],
      bodyStockByDept:[],

      searchDialog:true,
      spinner: false,
      statusLoad: '',
      loading: false,
    }
  },
  created(){
    this.loadLists();
    this.loadAdditional();
  },
  watch:{
    selectedAdvanceInventoryStock(){
      this.loadLists();
    },
    selectedAdvanceDepartmentName(){
      this.loadLists();
    }
  },
  methods:{
    loadLists(){
      let id = JSON.stringify({ 
        Session_ID: this.$ls.get('SESSION_ID'),
        IDX_M_InventoryStock: this.selectedAdvanceInventoryStock.toString(),
        DepartmentName: this.selectedAdvanceDepartmentName.toString(),
        DateFrom: this.selectedAdvanceDateFrom,
        DateTo: this.selectedAdvanceDateTo
      });
      this.$http
        .post(this.$aid.url() + "Report/loadReport", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsReportByStock = arr["Table"];
        })
        .then(function() {
          this.spinner = false;
          this.headersStock = []
          this.headersStockByDept = []

          /**
           * Stock
           */
          if(this.listsReportByStock.length > 0){
            for(let i in this.listsReportByStock[0]){
              this.headersStock.push({
                text:i,value:i,class:'text-xs-left'
              });
            }

            let hd1 = this.mapModel(this.headersStock);
            this.headersStock_Excel = this.mixModel(hd1,this.headersStock);
          } 
          
          /**
           * Stock By Department
           */
          if(this.listsReportStockByDepartment.length > 0){
            for(let i in this.listsReportStockByDepartment[0]){
              this.headersStockByDept.push({
                text:i,value:i,class:'text-xs-left'
              });
            }
            let hd2 = this.mapModel(this.headersStockByDept);
            this.headersStockByDept_Excel = this.mixModel(hd2,this.headersStockByDept);
          }
        })
        .catch(function(error) {
          this.loading = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    loadAdditional(){
      let id = JSON.stringify({ });
      this.$http
        .post(this.$aid.url() + "Report/loadReportAdditionalList", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsStock = arr["Table"];
          this.listsDepartment = arr["Table1"];
        })
        .catch(function(error) {
          this.loading = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    snackbar(value){
      this.$emit('snackbar',value);
    },
     /**
     * mapModel
     * @description
     *  In your array you must have key with name "vmodel"
     */
    mapModel(arr) {
        let output = [];
        for (var i = 0; i < arr.length; i++) {
            output += arr[i].value + ',';
        }

        output = output.split(",");
        output.pop();
        return output;
    },

    /**
     * mixModel
     * @description
     *  
     */
    mixModel(arr, val) {
        let output = {};
        for (var i = 0; i < arr.length; i++) {
            output[arr[i]] = val[i].value;
        }

        return output;
    },
  }
}
</script>

<style>

</style>
