<template>
    <div>
      <!-- toolbar -->
      <v-toolbar app color="grey darken-3" flat dark><cs-toggle /></v-toolbar>

      <!-- body -->
      <v-layout column>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-subheader class="headline">KALKULASI FORMULIR PERMINTAAN</v-subheader>
          </v-layout>
          <v-progress-linear height="2" class="mb-0" :indeterminate="spinner" background-color="grey lighten-5"></v-progress-linear>
          <v-divider></v-divider>
          <v-layout row wrap>
            <v-flex xs3 v-for="(k,v) in listsScore" :key="v">
              <v-card>
                <v-toolbar class="primary" flat dense dark>
                  <v-toolbar-title class="mx-auto">{{k.text.toUpperCase()}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <span class="display-3">{{ k.value }}</span>
                </v-card-text> 
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </div>
</template>

<script>
import CsCardDashboard from '@/components/custom/CsCardDashboard'
import CsToggle from '@/components/custom/CsToggleToolbar';

//core
export default {
  components: {
   'cs-card': CsCardDashboard,
   'cs-toggle': CsToggle
  },
  data() {
    return {
      // default application
      statusLoad: "Loading...",
      alert: false,
      message: null,
      timeout: 6000,
      color: "",
      spinner: false, 

      listsScore: [],
    };
  },
  created() {
    this.loadLists();
  },
  methods: {
    loadLists(){
      let id = JSON.stringify({
        NIK: this.$ls.get('NIK')
      });
      this.$http
        .post(this.$aid.url() + "ATKRequest/loadDashboard", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "Fetching data...";
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          // var arr = response.data;
          this.listsScore = arr["Table"];
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error) {
          this.loading = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    //core method
    snackbar(value){
      this.$emit('snackbar',value);
    },
  }
};
</script>
