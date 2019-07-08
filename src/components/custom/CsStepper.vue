<template>
  <v-stepper class="mb-1" v-model="stepper">
    <v-stepper-header>
      <v-stepper-step v-for="(k,v) in listsStepper" :key="v" :step="k.Number" :complete="k.isComplete == 1 ? true : false">{{ k.Name }}</v-stepper-step>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
export default {
  name:'cs-stepper',
  props:{
    id:null,
    reload:false
  },
  created(){
    this.loadStepper();
  },
  watch:{
    reload(){
      return this.reload ? this.loadStepper() : null;
    }
  },
  data(){
    return {
      listsStepper:[],
      spinner: false,
      updateLists:null,
      stepper:0,
    }
  },
  methods:{
    loadStepper(){
      let id = JSON.stringify({ IDX_T_OutRequestForm: Number(this.id) });
      this.$http
        .post(this.$aid.url() + "ATKManage/ManageRequestDetail_Stepper", id, {
          before: () => {
            this.spinner = true;
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          // var arr = response.data;
          this.listsStepper = arr["Table"];
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error) {
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    snackbar(value){
      this.$emit('snackbar',value);
    },
  }
}
</script>

<style>

</style>
