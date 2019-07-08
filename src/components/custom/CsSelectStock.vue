<template>
  <v-layout row wrap>
    <v-flex xs8 sm8 md8 lg8 xl8>
      <v-data-table :headers="headerStock" :items="lists" :search="searchStock" v-model="requestStock" item-key="IDX_M_InventoryStock">
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-center">
              <v-icon small v-if="props.item.isLocked">lock</v-icon>
              <v-checkbox v-if="!props.item.isLocked" v-model="props.selected" hide-details :disabled="props.item.isLocked ? true : false"></v-checkbox>
            </td>
            <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
            <td class="text-xs-center">
              <v-avatar :tile="false" color="grey lighten-4" size="64">
                <img :src="props.item.ImageUrl" v-if="props.item.ImageUrl">
                <span v-else style="font-size:8px">No Image</span>
              </v-avatar>
            </td>
            <td class="text-xs-center"><v-chip class="">{{ props.item.SecondUnit }} Box</v-chip></td>
            <td class="text-xs-center"><v-chip class="">{{ props.item.FirstUnit }} Pcs</v-chip></td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
    <v-flex xs4 sm4 md4 lg4 xl4 pl-2>
      <v-card light>
        <v-toolbar flat dense>
          <v-toolbar-title>FILTER</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field outline label="Keyword" v-model="searchStock"></v-text-field>
          <v-autocomplete outline :items="listsType" v-model="selectedType" label="Type Barang" solo chips deletable-chips
            item-text="InventoryTypeName" item-value="IDX_M_InventoryType" clearable multiple></v-autocomplete>
          <v-autocomplete outline :items="listsColor" v-model="selectedColor" label="Warna Barang" solo chips deletable-chips
            item-text="InventoryColorName" item-value="IDX_M_InventoryColor" clearable multiple></v-autocomplete>
          <v-autocomplete outline :items="listsSize" v-model="selectedSize" label="Ukuran Barang" solo chips deletable-chips
            item-text="InventorySizeName" item-value="IDX_M_InventorySize" clearable multiple></v-autocomplete>
          <v-autocomplete outline :items="listsBrand" v-model="selectedBrand" label="Merk Barang" solo chips deletable-chips
            item-text="InventoryBrandName" item-value="IDX_M_InventoryBrand" clearable multiple></v-autocomplete>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import CsSearch from '@/components/custom/CsSearch'

export default {
  name:'cs-select-stock',
  components:{
    'cs-search':CsSearch
  },
  props:{
    
  },
  created(){
    this.loadLists();
  },
  data(){
    return {
      spinner:false,
      searchStock:null,
      lastId:[],

      selectedColor:[],
      selectedType:[],
      selectedSize:[],
      selectedBrand:[],
      selectedTypeModel:[],
      requestStock:[],

      lists:[],
      listsColor:[],
      listsType:[],
      listsSize:[],
      listsBrand:[],

      headerStock:[
        { text:'Pilih',align:'center',sortable:false,value:null },
        { text:'Nama Barang',align:'center',sortable:true,value:'InventoryStockName' },
        { text:'Gambar',align:'center',sortable:false,value:null },
        { text:'Box',align:'center',sortable:false,value:null },
        { text:'Pcs',align:'center',sortable:false,value:null },
      ],
    }
  },
  watch:{
    selectedColor(){
      this.loadLists();
    },
    selectedType(){
      this.loadLists();
    },
    selectedTypeModel(){
      this.loadLists();
    },
    requestStock(){
      this.submit();
    },
    selectedBrand(){
      this.loadLists();
    },
    selectedSize(){
      this.loadLists();
    }
  },
  methods:{
    remove(idx){
      this.requestStock.filter((k) => k.IDX_M_InventoryStock !== idx);
    },
    loadSearch(p){
      let id;
      if((this.lastId != null) || (this.lastId != undefined)){
        id = this.$aid.arrayMerge(this.lastId,p)
      }else{
        id = this.lastId = p;
      }
      this.loadLists(id);
    },
    loadLists(params){
      let id = [];
      let createdId = { 
        Keyword:'',
        IDX_M_InventoryColor:this.selectedColor.toString(),
        IDX_M_InventoryType:this.selectedType.toString(),
        IDX_M_InventoryTypeModel:this.selectedTypeModel.toString(),
        IDX_M_InventoryBrand:this.selectedBrand.toString(),
        IDX_M_InventorySize:this.selectedSize.toString(),
      };
      
      if(params == undefined || params == null){
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }else{
        this.lastId = this.$aid.arrayMerge(this.lastId,params);
        id = JSON.stringify(this.$aid.arrayMerge(createdId,this.lastId));
      }

      this.$http
        .post(this.$aid.url() + "SharedComponent/loadStock", id, {
          before: () => {
            this.spinner = true;
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.lists = arr["Table"];
          this.listsColor = arr["Table1"];
          this.listsType = arr["Table2"];
          this.listsBrand = arr["Table4"];
          this.listsSize = arr["Table5"];
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error) {
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    submit(){
      this.$emit('submit',this.requestStock);
    },

    //core
    snackbar(value){
      this.$emit('snackbar',value);
    },
  }

}
</script>

<style>

</style>
