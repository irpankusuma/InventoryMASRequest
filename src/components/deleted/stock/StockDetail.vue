<template >
  <div>
    <!-- page toolbar -->
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <v-btn dark flat to="/stock" >         
        <v-icon left>keyboard_arrow_left</v-icon>&nbsp;     
        <span class="white--text">Stock</span>                                 
      </v-btn> 
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
                  <td class="text-xs-center">
                    <cs-action 
                      :id="props.item.IDX_M_InventoryStock"
                      :isUpdate="props.item.isUpdate"
                      :isEnable="props.item.isEnable"
                      :isDelete="props.item.isDelete"
                      @submit="actionMenu" />
                  </td>
                  <td class="text-xs-left">{{ props.item.InventoryTypeName }}</td>
                  <td class="text-xs-left">
                    <v-avatar :tile="false" color="grey lighten-4" size="34">
                      <img :src="$aid.urlPath()+props.item.ImageUrl" v-if="props.item.ImageUrl">
                      <span v-else style="font-size:8px">No Image</span>
                    </v-avatar>
                  </td>
                  <td class="text-xs-left">{{ props.item.InventoryTypeModelName }}
                    <v-badge color="orange" left overlap>                
                      <v-icon slot="badge" dark v-if="props.item.isEnable">warning</v-icon>                 
                    </v-badge>
                  </td>
                  <td class="text-xs-left">{{ props.item.InventoryBrandName }}</td>
                  <td class="text-xs-left">{{ props.item.InventorySizeName }}</td>
                  <td class="text-xs-left"><v-icon :color="props.item.InventoryColorName" large>fiber_manual_record</v-icon> {{ props.item.InventoryColorName }}</td>
                  <td class="text-xs-center">{{ props.item.Qty }}</td>
                  <td class="text-xs-center">{{ props.item.FirstUnit }}</td>
                  <td class="text-xs-center">{{ props.item.SecondUnit }}</td>
                  <td class="text-xs-center">{{ props.item.ConversionUnit }}</td>
                  <td class="text-xs-left">{{ props.item.Remarks }}</td>
                  <td class="text-xs-center">{{ props.item.CountIn }}</td>
                  <td class="text-xs-center">{{ props.item.CountOut }}</td>
                </tr>
              </template>
            </v-data-table>  
          </v-card-text>
        </v-card>    
      </v-container>
    </v-layout> 

    <!-- search -->
    <v-navigation-drawer right app v-model="searchDialog" light width="380">
      <v-toolbar flat>
        <v-toolbar-title>Advance Search</v-toolbar-title>
      </v-toolbar>
      <v-container grid-list-md>
        <v-autocomplete v-model="selectedAdvanceBrand" label="Filter Brand" prepend-icon="spa" :items="listsBrand" item-text="InventoryBrandName" item-value="IDX_M_InventoryBrand" chips deletable-chips multiple />
        <v-autocomplete v-model="selectedAdvanceColor" :items="listsColor" chips prepend-icon="whatshot" color="blue-grey lighten-2" label="Choose Color" item-text="InventoryColorName" item-value="IDX_M_InventoryColor" multiple>
                  <template slot="selection" slot-scope="data">
                    <v-chip :selected="data.selected" close class="chip--select-multi" @input="data.parent.selectItem(data.item)">
                      <v-avatar :color="data.item.InventoryColorName"></v-avatar>
                      {{ data.item.InventoryColorName }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <v-icon large :color="data.item.InventoryColorName">fiber_manual_record</v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.InventoryColorName"></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-autocomplete>
        <v-autocomplete v-model="selectedAdvanceSize" label="Filter Size" prepend-icon="pages" :items="listsSize" item-text="InventorySizeName" item-value="IDX_M_InventorySize" chips deletable-chips multiple />
        <v-autocomplete v-model="selectedAdvanceTypeModel" label="Filter Type Model" prepend-icon="layers" :items="listsTypeModel" item-text="InventoryTypeModelName" item-value="IDX_M_InventoryTypeModel" chips deletable-chips multiple />
      </v-container>
      <v-container grid-list-md>
        <v-btn light @click="searchDialog =! searchDialog"><v-icon left>clear</v-icon> Clear</v-btn>
        <v-btn dark @click="loadList()"><v-icon left>search</v-icon> Search</v-btn>
      </v-container>
    </v-navigation-drawer>  

    <!-- delete warning -->
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Stock?</v-card-title>
        <v-card-text>You will remove <b>{{InventoryTypeModelName}}</b>. Do you want to proceed ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false" >Cancel</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false" @click="deleteO()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /delete warning -->

    <!-- edit warning -->
    <v-dialog v-model="editDialog" max-width="780" scrollable persistent>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Edit Stock</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="editDialog =! editDialog"><v-icon small>clear</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs6>
                <v-autocomplete v-model="IDX_M_InventoryBrand" label="Brand" prepend-icon="spa" :items="listsBrand" item-text="InventoryBrandName" item-value="IDX_M_InventoryBrand" />
                <v-autocomplete v-model="IDX_M_InventoryColor" :items="listsColor" chips prepend-icon="whatshot" color="blue-grey lighten-2" label="Choose Color" item-text="InventoryColorName" item-value="IDX_M_InventoryColor">
                  <template slot="selection" slot-scope="data">
                    <v-chip :selected="data.selected" close class="chip--select-multi" @input="data.parent.selectItem(data.item)">
                      <v-avatar :color="data.item.InventoryColorName"></v-avatar>
                      {{ data.item.InventoryColorName }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <v-icon large :color="data.item.InventoryColorName">fiber_manual_record</v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.InventoryColorName"></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-autocomplete>
                <v-autocomplete v-model="IDX_M_InventorySize" label="Size" prepend-icon="pages" :items="listsSize" item-text="InventorySizeName" item-value="IDX_M_InventorySize" />
                <v-autocomplete v-model="IDX_M_InventoryTypeModel" label="Type Model" prepend-icon="layers" :items="listsTypeModel" item-text="InventoryTypeModelName" item-value="IDX_M_InventoryTypeModel" />
              </v-flex>
              <v-flex xs5 class="ml-2">
                <v-text-field v-model="Qty" prepend-icon="check_circle" label="Quantity" type="number" />
                <v-textarea v-model="Remarks" outline></v-textarea>
              </v-flex>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-container fluid class="text-xs-left">
                      <input type="file" id="imageFile" @change="preview" />
                    </v-container>
                    <v-slider v-model="size" :min="64" :max="256" label="Size" thumb-label></v-slider>
                  </v-flex>
                  <v-flex xs3>
                    <v-avatar :tile="false" :size="size" color="grey lighten-4">
                      <img v-if="ImageUrl" :src="$aid.urlPath()+ImageUrl" />
                      <span v-else>No Image</span>
                    </v-avatar>
                  </v-flex>
                  <v-flex xs3>
                    <v-avatar :tile="false" :size="size" color="grey lighten-4">
                      <img v-if="url" :src="url" />
                      <span v-else>No Image</span>
                    </v-avatar>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light @click.native="editDialog = false"><v-icon left>clear</v-icon>Cancel</v-btn>
          <v-btn dark @click.native="editDialog = false" @click="update()"><v-icon left>save</v-icon>Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- /edit warning -->
  </div>
</template>

<script>
import CsToggle from '@/components/custom/CsToggleToolbar';
import CsUploadFile from '@/components/custom/CsUploadFile';
import CsActionMenu from '@/components/custom/CsActionMenu';
import CsSearch from '@/components/custom/CsSearch';

//core
export default {
  components: {
    'cs-toggle': CsToggle,
    'cs-upload-file': CsUploadFile,
    'cs-action': CsActionMenu,
    'cs-search': CsSearch
  },
  data() {
    return {
      headers: [
        { text:'Action',align:'center',sortable:false,value:null },
        { text:'Type',align:'left',sortable:false,value:'InventoryTypeName' },
        { text:'Image',align:'left',sortable:false,value:null },
        { text:'Type Model',align:'left',sortable:true,value:'InventoryTypeModelName' },
        { text:'Brand',align:'left',sortable:true,value:'InventoryBrandName' },
        { text:'Size',align:'left',sortable:true,value:'InventorySizeName' },
        { text:'Color',align:'left',sortable:true,value:'InventoryColorName' },
        { text:'Qty',align:'left',sortable:true,value:'Qty' },
        { text:'First Unit',align:'left',sortable:true,value:'FirstUnit' },
        { text:'Second Unit',align:'left',sortable:true,value:'SecondUnit' },
        { text:'Conversion',align:'left',sortable:true,value:'ConversionUnit' },
        { text:'Remarks',align:'left',sortable:true,value:'Remarks' },
        { text:'Count In',align:'left',sortable:true,value:'CountIn' },
        { text:'Count Out',align:'left',sortable:true,value:'CountOut' },
      ],
      isNew: null,
      searchDialog: true,
      addDialog: false,
      editDialog: false,
      deleteDialog: false,

      //object
      selectedAdvanceType:[],
      selectedAdvanceBrand:[],
      selectedAdvanceSize:[],
      selectedAdvanceTypeModel:[],
      selectedAdvanceColor:[],
      InventoryTypeModelName:null,
      IDX_M_InventoryStock:null,
      IDX_M_InventoryBrand:null,
      IDX_M_InventoryColor:null,
      IDX_M_InventorySize:null,
      IDX_M_InventoryTypeModel:null,
      Qty:0,
      PONo:null,
      PODate:null,
      UnitPrice:null,
      Currency:null,
      ImageUrl:null,
      Remarks:null,

      //image
      size:64,
      url:null,

      //pagination
      pageSize:25,
      maxPage:1,
      currentPage:1,
      totalRecords: 0,

      // ddl
      lastId: [],
      lists: [],
      listsType: [],
      listsBrand: [],
      listsColor: [],
      listsSize: [],
      listsTypeModel: [],
      
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
    selectedAdvanceBrand(){
      this.loadList();
    },
    selectedAdvanceColor(){
      this.loadList();
    },
    selectedAdvanceSize(){
      this.loadList();
    },
    selectedAdvanceTypeModel(){
      this.loadList();
    }
  },
  methods:{    
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      let arr = this.lists.filter(k => { return k.IDX_M_InventoryStock == id });
      this.IDX_M_InventoryStock = id;
      this.InventoryTypeModelName = arr[0].InventoryTypeModelName;
      this.IDX_M_InventoryBrand = arr[0].IDX_M_InventoryBrand;
      this.IDX_M_InventoryColor = arr[0].IDX_M_InventoryColor;
      this.IDX_M_InventorySize = arr[0].IDX_M_InventorySize;
      this.IDX_M_InventoryTypeModel = arr[0].IDX_M_InventoryTypeModel;
      this.Qty = arr[0].Qty;
      this.ImageUrl = arr[0].ImageUrl;
      this.Remarks = arr[0].Remarks;

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
        Keyword:'',
        IDX_M_InventoryType: Number(this.$route.params.id),
        IDX_M_InventoryBrand: this.selectedAdvanceBrand.toString(),
        IDX_M_InventorySize: this.selectedAdvanceSize.toString(),
        IDX_M_InventoryTypeModel: this.selectedAdvanceTypeModel.toString(),
        IDX_M_InventoryColor: this.selectedAdvanceColor.toString(),
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
        .post(this.$aid.url() + "Stock/loadStock_ByIDXType", id, {
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
      let id = JSON.stringify({IDX_M_InventoryType:Number(this.$route.params.id)});
      this.$http
        .post(this.$aid.url() + "Stock/loadAdditionalStock",id, {
          before: () => {
            this.userLoad = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsBrand = arr["Table"];
          this.listsColor = arr["Table1"];
          this.listsSize = arr["Table2"];
          this.listsTypeModel = arr["Table3"];
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
        IDX_M_InventoryStock: this.IDX_M_InventoryStock,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Stock/deleteStock", id, "Deleting...");
    },
    toggleStatus(v){
      let item = this.lists.filter(k => { return k.IDX_M_InventoryStock == v });
      return item[0].isEnable ? this.enable(v) : this.disable(v);
    },
    enable(k) {
      var id = JSON.stringify({
        IDX_M_InventoryStock: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Stock/enableStock", id, "Enabling...");
    },
    disable(k) {
      var id = JSON.stringify({
        IDX_M_InventoryStock: k,
        Session_ID: this.$ls.get("SESSION_ID")
      });
      this.ajaxCRUD(this.$aid.url() + "Stock/disableStock", id, "Disabling...");
    },
    update(){
      let id = JSON.stringify({
        Session_ID:this.$ls.get('SESSION_ID'),
        IDX_M_InventoryStock:this.IDX_M_InventoryStock,
        IDX_M_InventoryBrand:this.IDX_M_InventoryBrand,
        IDX_M_InventoryColor:this.IDX_M_InventoryColor,
        IDX_M_InventorySize:this.IDX_M_InventorySize,
        IDX_M_InventoryTypeModel:this.IDX_M_InventoryTypeModel,
        Qty:Number(this.Qty),
        PODate:this.PODate,
        PONo:this.PONo,
        Currency:this.Currency,
        UnitPrice:this.UnitPrice,
        Remarks:this.Remarks
      });
      this.ajaxCRUD(this.$aid.url() + "Stock/updateStock", id, "Disabling...");
    },
    getUnique(){
      this.$http
        .get(this.$aid.url() + "Upload/latestNumber")
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.Unique = arr["Table"][0].LatestNumber;
        });
    },
    preview(e){
      let file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
    upload(){
      let image = [];
      image = document.getElementById('imageFile').files[0];
      let oldname = image.name;
      let newname = "img-"+this.Unique;
      let length  = oldname.lastIndexOf('.');

      let ext = oldname.substring(length,100);
      let filename = newname+ext;
      filename = filename.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,\/? ])+/g, '-');

      this.sendXHR(filename,image);
    },
    sendXHR(filename,file){
      let xhr = new XMLHttpRequest();
      xhr.open('POST',this.$aid.url()+'Upload/uploadFile');
      xhr.setRequestHeader('filename',filename);
      xhr.setRequestHeader('path',this.Path);
      xhr.send(file);

      this.Filename = filename;
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
