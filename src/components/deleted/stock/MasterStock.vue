<template >
  <div>
    <!-- page toolbar -->
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <cs-toggle />
      <v-spacer></v-spacer>
      <v-btn flat icon @click.native="searchDialog =! searchDialog"><v-icon>{{ searchDialog ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}</v-icon></v-btn>
    </v-toolbar>
    <!-- /page toolbar -->          
    <v-layout column>
      <!-- Body -->
      <v-container fluid>
        <v-card>
          <v-card-title>
            <v-btn v-if="isNew" to="/newstock/"><v-icon color="primary" left>add</v-icon>New Stock</v-btn>
            <v-spacer></v-spacer>
            <cs-search label="Filter" @search="loadSearch" />
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="lists"
              :loading="loading">
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="text-xs-left">
                    <v-btn icon color="blue" dark small :to="`/stockdetail/`+props.item.IDX_M_InventoryType"><v-icon small>link</v-icon></v-btn>
                    {{ props.item.InventoryTypeName }}
                  </td>
                  <td class="text-xs-left">{{ props.item.Total }}</td>
                </tr>
              </template>
            </v-data-table>  
          </v-card-text>
        </v-card>    
      </v-container>
    </v-layout> 
    
    <v-navigation-drawer right app v-model="searchDialog" light width="380">
      <v-toolbar flat>
        <v-toolbar-title>Advance Search</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-md>
        <v-select v-model="selectedInventoryType" label="Filter Type" prepend-icon="layers" :items="listsType" item-text="InventoryTypeName" item-value="IDX_M_InventoryType" chips deletable-chips multiple />
      </v-container>
      <v-container grid-list-md>
        <v-btn light @click="searchDialog =! searchDialog"><v-icon left>clear</v-icon> Clear</v-btn>
        <v-btn dark @click="loadList()"><v-icon left>search</v-icon> Search</v-btn>
      </v-container>
    </v-navigation-drawer>  
  </div>
</template>

<script>
import CsAdd from '@/components/custom/CsAdd';
import CsToggle from '@/components/custom/CsToggleToolbar';
import CsUploadFile from '@/components/custom/CsUploadFile';
import CsActionMenu from '@/components/custom/CsActionMenu';
import CsSearch from '@/components/custom/CsSearch';

//core
export default {
  components: {
    'cs-add': CsAdd,
    'cs-toggle': CsToggle,
    'cs-upload-file': CsUploadFile,
    'cs-action-menu': CsActionMenu,
    'cs-search': CsSearch
  },
  data() {
    return {
      headers: [
        { text:'Stock Type Model Name',align:'left',sortable:true,value:'InventoryTypeName' },
        { text:'Total (SUM)',align:'left',sortable:true,value:'Total' },
      ],
      isNew: null,
      searchDialog: true,

      //object
      selectedInventoryType:[],
      
      //pagination
      pageSize:25,
      maxPage:1,
      currentPage:1,
      totalRecords: 0,

      // ddl
      lastId: [],
      lists: [],
      listsType: [],
      
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
    selectedInventoryType(){
      return this.loadList()
    },
  },
  methods:{    
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
        IDX_M_InventoryType:this.selectedInventoryType.toString(),
        Session_ID: this.$ls.get("SESSION_ID"),
        PageSize: this.pageSize,
        MaxPage: this.maxPage,
        CurrentPage: this.currentPage,
      };
      
      if(params == undefined || params == null){
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }else{
        this.lastId = this.$aid.arrayMerge(this.lastId,params);
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }

      this.$http
        .post(this.$aid.url() + "Stock/loadStock", id, {
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
        .post(this.$aid.url() + "Stock/loadAdditionalStock",id, {
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsType = arr['Table4'];
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
