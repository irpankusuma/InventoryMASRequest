<template>
  <v-container grid-list-xs>
    <v-btn color="success" @click="csStockDialog =! csStockDialog">Stock Item</v-btn>
    <v-data-table :headers="headers" :items="itemRequest" select-all>
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.InventoryStockName }}</td>
        <td class="text-xs-center">{{ props.item.Qty }}</td>
        <td class="text-xs-center">{{ props.item.Remarks }}</td>
        <td class="text-xs-center"><v-btn color="success">delete</v-btn></td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          Sorry, nothing to display here :(
        </v-alert>
      </template>
    </v-data-table>

    <v-dialog v-model="csStockDialog" max-width="500px">
      <v-card>
        <v-toolbar color="teal darken-3" dark dense>
          <v-toolbar-title>Pilih Barang</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat fab small @click.stop="csStockDialog =! csStockDialog"><v-icon>close</v-icon></v-btn>
        </v-toolbar> 
        <v-card-text>
          <cs-stock @submit="csStock" lazy ref="stock" />
        </v-card-text> 
      </v-card>
    </v-dialog> 
  </v-container>
</template>

<script>
import CsSelectStock from '@/components/custom/CsSelectStock';
export default {
  name: 'cs-request-item',
  components:{
    'cs-stock': CsSelectStock,
  },
  props:{
    a:null
  },
  created(){

  },
  data(){
    return {
      isAdd: false,
      Qty:0,
      Note:null,
      csStockDialog:false,
      headers:[
        // { text: 'Nomor', align: 'center', sortable: true },
        { text: 'Nama Barang', align: 'left', sortable: true, value: 'InventoryStockName' },
        { text: 'Kuantitas', align: 'left', sortable: true, value: 'Qty' },
        { text: 'Note (*)', align: 'left', sortable: false, value: 'Remarks' },
        { text: 'DELETE', align: 'left', sortable: false },
      ],

      listStock:[],
      itemRequest:[],
    }
  },
  methods:{
    csStock(params){
      let getData = params;
      this.itemRequest = getData;
      setTimeout(() => {
        this.$refs.stock.clear();  
      }, 300);
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
