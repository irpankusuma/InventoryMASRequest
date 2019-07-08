<template>
  <div v-if="items.length > 0">
    <v-navigation-drawer app right light :clipped="clipped" :width="width" v-if="dialog" permanent disable-resize-watcher>
      <v-toolbar flat>
          <v-list>
              <v-list-tile>
                  <v-list-tile-title class="title">
                      {{ header }}
                  </v-list-tile-title>
              </v-list-tile>
          </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container grid-list-md>
        <v-list v-for="(k,v) in items" :key="v" dense>
            <v-select v-if="k.Type == 'select'" v-model="vmod[v]" :items="k.Data" chips deletable-chips :color="k.Color == null ? 'black' : k.Color"
              :item-text="k.Search" :item-value="k.Value" :label="k.Text" :multiple="k.Multiple" clearable autocomplete></v-select>
            <v-text-field v-if="k.Type == 'textfield'" v-model="vmod[v]" :label="k.Text" :multi-line="k.Multiline" :color="k.Color == null ? 'black' : k.Color"></v-text-field>
            <v-switch v-if="k.Type == 'switch'" v-model="vmod[v]" :label="k.Text" :color="k.Color"></v-switch>
            <v-menu 
              v-if="k.Type == 'datepicker'" ref="menu" lazy close-on-content-click v-model="vm_picker[v]" transition="scale-transition" offset-y full-width
              :nudge-right="40" min-width="290px" :return-value.sync="vmod[v]" clearable>
              <v-text-field slot="activator" :label="k.Text" v-model="vmod[v]" prepend-icon="event" readonly></v-text-field>
              <v-date-picker v-model="vmod[v]" :value="vmod[v]" show-current no-title scrollable>
              </v-date-picker>
            </v-menu>
        </v-list>
      </v-container>
      <span>
        <v-btn light @click="fn_clear">
          <v-icon left>refresh</v-icon> Reset 
        </v-btn>
        <v-btn dark @click="fn_do">
          <v-icon left>search</v-icon> Search  
        </v-btn>
      </span>
    </v-navigation-drawer>
  </div>
</template>
<script>
  /** 
    @description
      Dynamic create search by array javascript or JSON, will use $emit (em_sendTo) to parent. Then supported type is :
      - select  => <v-select>
      - input   => <v-text-field>
      - datepicker => <v-datepicker> version menu
      - switch => bug

    @example :
      <search 
        header="Header Title"
        :items="array|object"
        @em_sendTo="loadFunction" 
      ></search>
    
    @prop :
    items = [
      { 
        Text: 'Label 1',
        VModel: 'vmodel1',
        Type: 'textfield',
        Search: null, 
        Value: null,  
        Data: null
      },
      { 
        Text: 'Label 2',
        VModel: 'vmodel2',
        Type: 'select',
        Search: 'text',     //equivalent with item-text, default is text
        Value: 'value',     //equivalent with item-value, default is value
        Data: [
          { text:'Label 1', value:'Value1' },
          { text:'Label 2', value:'Value2' }
        ] 
      }
    ];
  */
  export default {
    name: 'cs-search-form',
    props: {
      dialog: true,
      header:{
        type: String,
        default: 'Search'
      },
      clipped:{
        type: Boolean,
        default: false
      },
      width: {
        type: [Number,String],
        default: 300
      },
      items: {
        type: [Array,Object]
      }
    },
    watch:{
      vmod(){
        let arr = this.items;
        let map = this.$aid.mapModel(arr);
        let data = this.vmod.map(v => Array.isArray(v) ? v.join(",") : v);
        this.vm_id = this.$aid.mixModel(map,data);
        
        this.$emit('em_sendTo',this.vm_id);
      },
      open(){
        this.openDraw()
      }
    },
    data() {
      return {
        vmod: [],
        vm_id: {},
        vm_picker: {},
      }
    },
    methods: {
      fn_do(){
        let arr = this.items;
        let map = this.$aid.mapModel(arr);
        let data = this.vmod.map(v => Array.isArray(v) ? v.join(",") : v);
        this.vm_id = this.$aid.mixModel(map,data);
        
        this.$emit('em_sendTo',this.vm_id);
      },
      fn_clear(){
        this.vmod = [];
        this.$emit('em_sendClear',true);
      },
      openDraw(){
        this.dialog = this.dialog =! this.dialog;
        this.$emit('send-dialog',this.dialog)
      }
    }
  }
</script>

