<template>
  <div>
    <!-- <span class="grey--text">Sort by <b>{{ ct_sort[1]  }} {{ ct_sort[0] }}</b></span> -->
    <v-menu transition="slide-x-transition" bottom right :close-on-content-click="false" :nudge-width="180">                
      <v-btn color="grey" dark slot="activator" flat >         
          <v-icon left>sort</v-icon>     
        <span class="black--text">Sort By <b>{{ ct_sort[1]  }} {{ ct_sort[0] }}</b></span>                                 
      </v-btn>
      
      <v-list dense>                                  
        <v-list-tile v-for="(k,v) in sortItems" :key="v" @click="fn_changeSort(k)">
          <v-list-tile-content>
            <v-list-tile-title v-text="k.Text"></v-list-tile-title>
          </v-list-tile-content>    
          <v-list-tile-action>
            <v-icon v-if="k.Select" color="black">check</v-icon>
          </v-list-tile-action>    
        </v-list-tile>                                                      
      </v-list>
      <v-divider v-if="seqItems.length > 0"></v-divider>
      <v-list dense>                                  
        <v-list-tile v-for="(k,v) in seqItems" :key="v" @click="fn_changeSeq(k)">
          <v-list-tile-content>
            <v-list-tile-title v-text="k.Text"></v-list-tile-title>
          </v-list-tile-content>    
          <v-list-tile-action>
            <v-icon v-if="k.Select" color="black">check</v-icon>
          </v-list-tile-action>    
        </v-list-tile>                                                      
      </v-list>
    </v-menu>  
  </div>
</template>

<script>
    export default {
        name: 'cs-sort',
        props: {
          items: {
            type: [Array,Object]
          }
        },
        methods: {
          fn_changeSort(item){
            this.fn_checkSort(item.Value);
            let id = { SortBy: item.Value }
            this.$emit('em_sendSortBy',id);
          },
          fn_changeSeq(item){
            this.fn_checkSeq(item.Value);
            let id = { SortSequence: item.Value }
            this.$emit('em_sendSortSeq',id);
          },
          fn_checkSort(item){
            for (let i in this.sortItems) {
              if (this.sortItems[i].Value != item) {
                this.sortItems[i].Select = false;
              } else {
                this.sortItems[i].Select = true;
              }
            }
          },
          fn_checkSeq(item){
            for (let i in this.seqItems) {
              if (this.seqItems[i].Value != item) {
                this.seqItems[i].Select = false;
              } else {
                this.seqItems[i].Select = true;
              }
            }
          },
          fn_checkFirst(){
            let a,b;
            for(let i in this.seqItems){
              if(this.seqItems[i].Select){
                  a = this.seqItems[i].Text
              }
            }

            for(let i in this.sortItems){
              if(this.sortItems[i].Select){
                  b = this.sortItems[i].Text
              }
            }
            return [a,b];
          }
        },
        computed:{
          ct_sort(){
            return this.fn_checkFirst();
          }
        },
        data(){
          return {
            seqItems: [
              { Text: 'Ascending' ,Value: 0 ,Select: false },
              { Text: 'Descending' ,Value: 1 ,Select: false }
            ],
            sortItems: [
              { Text:'Status', Value:1, Select: false},
              { Text:'Location', Value:2, Select: false},
              { Text:'Company', Value:3, Select: false},
              { Text:'Asset Number', Value:4, Select: false},
              { Text:'Asset Disabled', Value:5, Select: false},
              { Text:'Connect ASBS', Value:6, Select: false},
            ],
          }
        }
    }
</script>
