<template>  
  <div v-if="(sortItems != undefined) || (sortItems != null)">
    <v-select 
      :items="sortItems"
      v-model="w_selectItem"
      prepend-icon="sort" 
      item-text="Text"
      item-value="Value"
      :label="label"
      clearable
      autocomplete
    ></v-select>            
  </div>
</template>

<script>
/**
  * @component Sorting
  * Sorting data [Array] by key
  * How to use :
    <sorting 
      sort
      items="your array/object"
      sortItems="array/object"
    ></sorting> 

  /**
    sortItems: [
      { text: 'Status', value: 'AssetStatusName'},
      { text: 'Name', value: 'Name'},
      { text: 'Asset Number', value: 'AssetID'}
    ]
  */
  export default {
    name: 'cs-sort-local',
    props: {
      'label': {
        type: [String],
        default: 'Sorting'
      },
      'autocomplete': {
        type: Boolean,
        default: false
      },
      'items': {
        required: true,
        type: [Array,Object]
      },
      'sortItems': {
        type: [Array,Object]
      }
    },
    data() {
        return {
          w_selectItem:''
        }
    },
    watch: {
      w_selectItem(){
        this.fn_do();
      }
    },
    methods:{
      fn_do(){
        this.items.sort(this.$aid.dynamicSort(this.w_selectItem));
      }
    }
  }
</script>