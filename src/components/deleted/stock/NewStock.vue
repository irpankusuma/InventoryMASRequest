<template>
  <div>
    <!-- page toolbar -->
    <v-toolbar class="grey darken-3" dark app fixed flat>
      <v-btn dark flat to="/stock" >         
        <v-icon left>keyboard_arrow_left</v-icon>&nbsp;     
        <span class="white--text">Stock</span>                                 
      </v-btn>      
    </v-toolbar>
    <!-- /page toolbar --> 
    <!-- body -->
    <v-container grid-list-md>
      <v-layout column>
        <v-flex xs12>
          <v-toolbar color="primary" dark>
            <v-toolbar-title class="headline">New Stock</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <v-layout row>
                <v-flex xs6>
                  <v-autocomplete v-model="IDX_M_InventoryType" :items="listsType" prepend-icon="layers" item-text="InventoryTypeName" item-value="IDX_M_InventoryType" label="Choose Type" clearable />
                  <v-layout row wrap>
                    <v-flex xs10>
                      <v-autocomplete :disabled="IDX_M_InventoryType ? false : true" v-model="IDX_M_InventoryTypeModel" :items="filteredTypeModel" prepend-icon="category" item-text="InventoryTypeModelName" item-value="IDX_M_InventoryTypeModel" label="Choose Type Model" clearable />
                    </v-flex>
                    <v-flex xs2>
                      <!-- <v-btn fab dark small><v-icon>add</v-icon></v-btn> -->
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs10>
                      <v-autocomplete v-model="IDX_M_InventorySize" :items="listsSize" prepend-icon="pages" item-text="InventorySizeName" item-value="IDX_M_InventorySize" label="Choose Size" clearable />
                    </v-flex>
                    <v-flex xs2>
                      <!-- <v-btn fab dark small><v-icon>add</v-icon></v-btn> -->
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-text-field v-model="FirstUnit" type="number" label="First Unit" prepend-icon="straighten"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field v-model="SecondUnit" type="number" label="Second Unit" prepend-icon="straighten"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-container fluid class="text-xs-left">
                        <input type="file" id="imageFile" @change="preview" />
                      </v-container>
                      <v-slider v-model="size" :min="16" :max="256" label="Size" thumb-label></v-slider>
                    </v-flex>
                    <v-flex xs6>
                      <v-avatar :tile="false" :size="size" color="grey lighten-4">
                        <img v-if="url" :src="url" />
                        <span v-else>No Image</span>
                      </v-avatar>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <!-- sebelah kanan -->
                <v-flex xs6>
                  <v-layout row wrap>
                    <v-flex xs10>
                      <v-autocomplete v-model="IDX_M_InventoryBrand" :items="listsBrand" prepend-icon="spa" item-text="InventoryBrandName" item-value="IDX_M_InventoryBrand" label="Choose Brand" clearable />    
                    </v-flex>
                    <v-flex xs2>
                      <!-- <v-btn fab dark small><v-icon>add</v-icon></v-btn> -->
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs10>
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
                    </v-flex>
                    <v-flex xs2>
                      <!-- <v-btn fab dark small><v-icon>add</v-icon></v-btn> -->
                    </v-flex>
                  </v-layout>
                  <v-text-field type="number" v-model="Qty" prepend-icon="check_circle" label="Quantity" />  
                  <v-textarea v-model="Remarks" label="Remarks" outline /> 
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-container grid-list-xs>
                  <v-btn light @click="clear()"><v-icon left>clear</v-icon>Cancel</v-btn>
                  <v-btn v-if="FirstUnit > SecondUnit ? true : false" dark @click="save()"><v-icon left>save</v-icon>Save</v-btn>
                </v-container>
              </v-layout>
            </v-card-text>
          </v-card>  
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>
import CsUploadFile from '@/components/custom/CsUploadFile';

export default {
  name:'new-stock',
  components:{
    'cs-upload-file': CsUploadFile,
  },
  created(){
    this.loadAdditionalData();
    this.getUnique();
  },
  computed:{
    filteredTypeModel(){
      return this.listsTypeModel.filter(k => {return k.IDX_M_InventoryType == this.IDX_M_InventoryType})
    },
    filteredColor(){
      let arr = [];
      arr =  this.listsColor.filter(k => {return k.IDX_M_InventoryColor == this.IDX_M_InventoryColor})
      return arr.length > 0 ? arr[0].InventoryColorName : 'primary'
    }
  },
  watch:{
    SecondUnit(){
      if(this.SecondUnit > this.FirstUnit){
        this.snackbar({color:'error',message:'First Unit must greater than Second Unit.',alert:true});
        
      }
    }
  },
  data(){
    return {
      //loading
      statusLoad: "Loading...",
      spinner: false,
      loading: false,
      userLoad: false,

      //object
      IDX_M_InventoryBrand:null,
      IDX_M_InventoryColor:null,
      IDX_M_InventorySize:null,
      IDX_M_InventoryType:null,
      IDX_M_InventoryTypeModel:null,
      Qty:0,
      FirstUnit:null,
      SecondUnit:null,
      Remarks:null,
      
      //upload file
      Unique:null,
      Path:this.$aid.filePath(),
      Filename:null,
      url:null,
      size:56,
      
      //array
      listsBrand: [],
      listsColor: [],
      listsSize: [],
      listsType: [],
      listsCompany: [],
      listsTypeModel: [],
    }
  },
  methods:{
    loadAdditionalData() {
      this.$http
        .post(this.$aid.url() + "Stock/loadAdditionalStock",{}, {
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
          this.listsType = arr["Table4"];
          this.listsCompany = arr["Table5"];
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
    save(){
      //upload file
      this.upload();
      //then
      let id = JSON.stringify({
        Session_ID: this.$ls.get('SESSION_ID'),
        IDX_M_InventoryBrand:this.IDX_M_InventoryBrand,
        IDX_M_InventoryColor:this.IDX_M_InventoryColor,
        IDX_M_InventorySize:this.IDX_M_InventorySize,
        IDX_M_InventoryTypeModel:this.IDX_M_InventoryTypeModel,
        Qty:this.Qty,
        FirstUnit:this.FirstUnit,
        SecondUnit:this.SecondUnit,
        ImageUrl:this.Filename,
        Remarks:this.Remarks
      });   
      this.ajaxCRUD(this.$aid.url() + "Stock/saveStock", id, "Saving...");
    },
    clear(){
      this.IDX_M_InventoryBrand = null;
      this.IDX_M_InventoryColor = null;
      this.IDX_M_InventorySize = null;
      this.IDX_M_InventoryType = null;
      this.IDX_M_InventoryTypeModel = null;
      this.Qty = null;
      this.PONo = null;
      this.PODate = null;
      this.Currency = null;
      this.UnitPrice = null;
      this.ImageUrl = null;
      this.Remarks = null;
      this.url = null;
    },

    //core method
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
          this.clear();
          this.$router.push('/stock')
        })
        .catch(function(error) {
          this.spinner = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    }
  }
}
</script>

<style>

</style>
