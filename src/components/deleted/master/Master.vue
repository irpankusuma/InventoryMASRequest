<template>
    <div>
      <!-- toolbar -->
      <v-toolbar app color="grey darken-3" flat dark><cs-toggle /></v-toolbar>
      <!-- body -->
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-progress-linear height="2" class="mb-0" :indeterminate="spinner" background-color="grey lighten-5"></v-progress-linear>
          <v-flex xs12 v-if="listsAdmin.length > 0">
            <v-card>
              <v-card-title>
                <v-subheader class="title">Admin Setting</v-subheader>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <cs-card :items="listsAdmin"></cs-card>    
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 v-if="listsGeneral.length > 0">
            <v-card>
              <v-card-title>
                <v-subheader class="title">General Setting</v-subheader>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <cs-card :items="listsGeneral"></cs-card>   
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 v-if="listsOthers.length > 0">
            <v-card>
              <v-card-title>
                <v-subheader class="title">Others Setting</v-subheader>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <cs-card :items="listsOthers"></cs-card>     
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
</template>

<script>
//imports
import Card from "@/components/custom/CsCard.vue";
import CsToggle from '@/components/custom/CsToggleToolbar';

//core
export default {
  components: {
    'cs-card': Card,
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
      listsGeneral:[],
      listsAdmin:[],
      listsOthers:[],
      buttonProp: {
        flat: true,
        dark: false,
        label: 'Asset Master',
        icon: 'apps'
      },
      sid:{ Session_ID: this.$ls.get("SESSION_ID") },
    };
  },
  created() {
    this.loadLists();
  },
  computed: {
    serviceURL() {
      return this.$aid.url();
    }
  },
  methods: {
    loadLists(params){
      let id;
      if((params == null) || (params == '') || (params == undefined)){
        id = JSON.stringify({
          Session_ID: this.$ls.get("SESSION_ID"),
          Keyword: ''
        });
      }else{
        id = JSON.stringify(this.$aid.arrayMerge(this.sid,params));
      }
      
      this.$http
        .post(this.$aid.url() + "Master/loadMaster", id, {
          before: () => {
            this.spinner = true;
          }
        })
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.listsGeneral = arr["Table"];
          this.listsAdmin = arr["Table1"];
          this.listsOthers = arr["Table2"];
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error) {
          this.$aid.console(error.body,false);
        });
    },
    //core method
    showAlert(message, code) {
      this.alert = true;
      this.message = message;
      this.color = code;
    },
  }
};
</script>
