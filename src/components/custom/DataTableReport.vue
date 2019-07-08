<template>
  <div>
    <v-layout column>
      <v-container fluid>
        <v-toolbar :color="!color ? 'primary' : color" dark dense>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-tooltip bottom>
            <download-excel slot="activator"
              style="
              padding: 8px;
              cursor: pointer;
              background-color: #3F51B5;
              border-radius: 5px;"
              :data="items"
              :fields="headerExcel"
              :name="filename == null ? 'filename.xls': filename">
              <h5 class="white--text">Export {{ filename }}</h5>
            </download-excel>
            <span>Click to export {{ filename }}</span>
          </v-tooltip>   -->
        </v-toolbar>
        <v-card>
          <v-card-title primary-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Filter" single-line hide-details solo clearable></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers" :loading="loading" :items="items" :search="search">
              <template slot="items" slot-scope="props">
                <td v-for="(k,i) in body" :key="i" :class="k.class">
                  {{ get(props.item,k.value) }}
                </td>
              </template>
            </v-data-table> 
          </v-card-text>
        </v-card>
      </v-container>
    </v-layout>
  </div>
</template>

<script>
/**
 headers = [
   {
     text:string,
     value:string,
     class:string,
     sort:bool,
   }
  body = [
    {
      id:string,
      value:string,
      class:string,
      number:bool,
      type:number|date|time|datetime|text (default)|password
      to:string
    }
  ]

  props:
   - headers    :null,
   - loading    :false,
   - items      :null,
   - body       :null,
   - color      :null
 ];
 */

export default {
  name: 'cs-datatable',
  props:{
    title:null,
    headerExcel:null,
    filename:null,
    loading:false,
    items:null,
    headers:null,
    body:null,
    filter:true,
    flat:false,
    color:null,
  },
  computed:{
    loadFilename(){
      this.filename = this.filename == null ? 'filename.xls' : filename;
    }
  },
  data(){
    return {
      search:null,
      filteropen:false,
    }
  },
  methods:{
    get(arr,elm){
      elm = elm.replace(/\[(\w+)\]/g, '.$1');
      elm = elm.replace(/^\./, '');
      let el = elm.split('.');

      for (let i = 0, n = el.length; i < n; ++i) {
          let k = el[i];
          if (k in arr) {
              arr = arr[k];
          } else {
              return;
          }
          return arr;
      }
    },
  }
}
</script>