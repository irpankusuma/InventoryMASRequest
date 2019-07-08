<template>
  <div>
    <v-layout column>
      <v-container fluid>
        <v-card :flat="flat">
          <v-card-text>
            <v-layout row wrap>
              <span class="headline" v-if="title">{{ title }}</span>
              <v-tooltip right>
                <span>Print Now</span>
                <v-btn v-if="isPrint" dark color="teal" slot="activator" @click="dialogPrint =! dialogPrint">
                  <v-icon left>print</v-icon> Print
                </v-btn>
              </v-tooltip> 
              <v-spacer v-if="info"></v-spacer> 
              <v-badge left color="orange" class="mt-2" v-if="info">                 
                <v-icon slot="badge" dark>warning</v-icon>                 
                <span> Disabled</span>               
              </v-badge>
              <v-spacer></v-spacer>
              <v-flex xs4 v-if="filter">
                <cs-search label="Filter" class="mb-4" @search="loadSearch" />
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap>
              <div class="table__overflow">
                <table class="datatable table">
                  <thead>
                    <tr :class="headcolor">
                      <td v-if="select"><v-checkbox v-model="selectAll"></v-checkbox></td>
                      <td v-for="(k,i) in headers" :key="i" :class="k.class" @click="k.sort ? sort(k.value) : localSort(k.value)" 
                        :colspan="k.colspan" :style="k.sort ? 'font-size:12px; cursor:pointer' : 'font-size:12px;'">
                        <v-layout row wrap>
                          <v-list>
                            <v-list-tile avatar>
                              <v-list-tile-content>
                                <strong style="font-size:12px">{{ k.text }}</strong>   
                              </v-list-tile-content>
                              <v-list-tile-action>
                                <v-icon small v-if="(k.sort == undefined) || !k.sort" color="grey lighten-2">swap_vert</v-icon>
                                <v-icon small v-else color="red lighten-2">swap_vert</v-icon>
                              </v-list-tile-action>
                            </v-list-tile>
                          </v-list>
                        </v-layout>
                      </td>
                    </tr>
                    <tr class="datatable__progress" v-if="loading">
                      <th :colspan="headers.length" class="column">
                        <v-progress-linear :indeterminate="loading" height="2"></v-progress-linear>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,i) in items" :key="i">
                      <td v-if="select"><v-checkbox v-model="selected" :value="get(item,id)"></v-checkbox></td>
                      <td v-if="action">
                        <cs-action-menu 
                          :id="get(item,id)"
                          :isUpdate="item.isUpdate"
                          :isUpdateTo="to ? to : null"
                          :isDisable="item.isDisable"
                          :skip="skip"
                          :isReadOnly="item.isReadOnly"
                          :isAssignUser="item.isAssignUser"
                          :isAssignLocation="item.isAssignLocation"
                          :isAssignStatus="item.isAssignStatus"
                          :isChangeCompany="item.isChangeCompany"
                          :isChangeManagement="item.isChangeManagement"
                          :isHRIS="item.isHRIS"
                          @submit="actionMenu"
                        />
                      </td>
                      <td v-for="(k,i) in body" :key="i" :class="k.class">
                        <span v-if="k.number">{{ $aid.formatPrice(get(item,k.value)) }}</span>
                        <span v-else-if="k.to"><v-btn flat small :to="k.to+get(item,id)">{{ get(item,k.value) }}</v-btn></span>
                        <span v-else-if="k.info">
                          <v-badge color="orange">                
                            <v-icon slot="badge" dark v-if="item.isEnable">warning</v-icon>                 
                            <span>{{ get(item,k.value) }}</span>               
                          </v-badge>
                        </span>
                        <span v-else>
                          <span v-if="k.type == 'number'">{{ $aid.formatPrice(get(item,k.value)) }}</span>
                          <span v-else-if="(k.type == 'date')">{{ get(item,k.value) | moment(k.format) }}</span>
                          <span v-else-if="k.type == 'password'">********</span>
                          <span v-else>{{ get(item,k.value) }}</span>
                        </span> 
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap>
              <v-spacer></v-spacer>
              <v-card flat>
                <v-card-actions>
                  <span style="font-size:11px">Rows per page : </span>
                  <v-select class="mr-4 ml-4" 
                    v-if="maxPage"
                    :items="pages"
                    v-model="pageSize"
                  ></v-select>
                  <span style="font-size:11px">Total Items : {{ total ? total : items.length }} data(s)</span>
                  <!-- <v-btn icon @click="go(currentPage-1)"><v-icon>keyboard_arrow_left</v-icon></v-btn>
                  <v-btn icon @click="go(currentPage+1)"><v-icon>keyboard_arrow_right</v-icon></v-btn> -->
                </v-card-actions>
              </v-card>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-layout row wrap>
          <v-container fluid>
            <v-pagination v-if="maxPage" :length="maxPage" v-model="page" :total-visible="10"></v-pagination>  
          </v-container>
        </v-layout>
      </v-container>
    </v-layout>

    <!-- Print -->
    <v-layout row justify-center>
      <v-dialog v-model="dialogPrint" fullscreen transition="dialog-bottom-transition" :overlay="false">            
        <cs-report :IDX="$ls.get('SESSION_ID')" :type="'PrintOut_LaporanAsset'" param="Session_ID" @send-filter="dialogPrint = false" />
      </v-dialog>
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
   - id         :null,
   - isNew      :false,
   - to         :null,
   - headers    :null,
   - loading    :false,
   - items      :null,
   - body       :null,
   - filter     :false,
   - action     :false,
   - skip       :false, 
   - maxPage    :null,
   - total      :null,
   - flat       :false,
   - info       :false,
   - title      :null,
   - headcolor  :null,
   - select     :false

  emitter:
   - action
   - isNew
   - submit
 ];
 */
import CsActionMenu from '@/components/custom/CsActionMenu';
import CsSearch from '@/components/custom/CsSearch';
import CsReport from "@/components/custom/CsReport";

export default {
  name: 'cs-datatable',
  props:{
    id:null,
    isPrint:false,
    to:null,
    headers:null,
    loading:false,
    items:null,
    body:null,
    filter:false,
    action:false,
    skip:false, 
    maxPage:null,
    total:null,
    flat:false,
    info:false,
    title:null,
    headcolor:null,
    select:false
  },
  components:{
    'cs-action-menu': CsActionMenu,
    'cs-search': CsSearch,
    'cs-report': CsReport
  },
  watch:{
    pageSize(){
      let id = { PageSize: this.pageSize };
      this.submit(id);
    },
    page(){
      let id = { CurrentPage: this.page };
      this.submit(id);
    },
    selected(){ 
      this.$emit('selected',this.selected);
    }
  },
  data(){
    return {
      lastId:[],
      search:null,
      pageSize:25,
      //maxPage:1,
      currentPage:1,
      page:1,
      pages: [
        { text: "10", value: 10 },
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "70", value: 70 },
        { text: "90", value: 90 },
        { text: "All", value: 999999 }
      ],
      header_action:[
        { text:'Action',class:'text-xs-center',sort:false }
      ],
      asc:false,
      vm:{},
      selected:[],
      dialogPrint:false,
    }
  },
  computed:{
    selectAll:{
      get:function(){
        return this.items ? this.selected.length == this.items.length : false;
      },
      set:function(value){
        let self = this;
        let selected = [];

        if(value){
          this.items.forEach(function(item){
            selected.push(self.get(item,self.id));
          });
        }
        this.selected = selected;
      }
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
    loadSearch(p){
      let id;
      if((this.lastId != null) || (this.lastId != undefined)){
        id = this.$aid.arrayMerge(this.lastId,p)
      }else{
        id = this.lastId = p;
      }
      this.submit(id);
    },
    actionMenu(p){
      let code = p.code;
      let id = p.id;
      
      this.$aid.console({code:code,id:id,selected:this.selected});
      this.$emit('action',{code:code,id:id,selected:this.selected});
    },
    go(v){
      let id = { CurrentPage: v };
      this.submit(id);
    },
    sort(v){
      this.asc = this.asc =! this.asc;
      let id = this.asc ? { SortBy: v, SortSequence: 0 } : { SortBy: v, SortSequence: 1 }
      this.submit(id);
    },
    localSort(value){
      let sort = this.items.sort(this.$aid.dynamicSort(value));
      return sort =! sort
    },
    submit(id){
      this.$emit('submit',id);
    }
  }
}
</script>

<style>

</style>

