<template>
  <v-app light>
    <v-snackbar :timeout="6000" :color="color" top multi-line auto-height v-model="alert">
      {{message}}
      <v-btn flat @click="alert = false">Close</v-btn>
    </v-snackbar>
    <!-- navigation -->
    <v-navigation-drawer fixed app v-model="drawer" permanent v-if="showMenu" :mini-variant="mini">
      <v-list dense>
          <v-list-tile class="pt-1 pb-1">
            <v-list-tile-action>            
                <v-btn large icon  dark slot="activator" class="text-xs-center" to="/Dashboard" >
                  <v-avatar size="48px" color="grey darken-2">
                    <img src="https://apps.alam-sutera.com/SharedAsset/general/AlamSuteraLogoClear.svg">
                  </v-avatar>        
                </v-btn>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                  {{userName}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>   
      </v-list>
      <!-- sidemenu -->
      <cs-side-menu></cs-side-menu>        
    </v-navigation-drawer>
    <!-- /navigation -->    
    <!-- main content -->
    <main>
      <v-content>     
        <div v-if="$aid.isDevelopment()"><v-chip class="warning"><v-icon left small>build</v-icon>This Application in Development Mode {{ $ls.get('SESSION_ID') }}</v-chip></div>
        <v-fade-transition mode="out-in">
          <router-view @snackbar="snackbar"></router-view>
        </v-fade-transition>  
      </v-content>
    </main>
    <!-- main content -->
    <!-- footer -->
    <footer>
        <span style="font-size: 0.7em">©Copyright: 2018 PT. Alam Sutera Realty, Tbk. All Rights Reserved.<br>Developed with
          <v-icon  style="color: red">favorite</v-icon> by Application Development & Integration Team</span>
    </footer>
    <!-- footer -->
  </v-app>
</template>

<script>
import CsSideMenu from '@/components/custom/CsSideMenu';

export default {
  components: {
    'cs-side-menu': CsSideMenu
  },
  data(){
    return {
      dialog: false,
      drawer: true,
      mini: true,
      statusLoad: "Loading...",
      spinner: false,
      alert: false,
      message: null,
      timeout: 6000,
      color: "",
      userName: null,
      userRole: null,
      email: null,
      NIK: null,
      items: [],
    }
  },
  props: {
    source: String
  },
  computed: {
    serviceURL() {
      return this.$aid.url();
    },
    showMenu() {
      return this.$store.state.showMenu;
    },
  },
  created(){
    // this.getUserName();
  },
  methods: {
    snackbar(value){
      this.color = value.color;
      this.message = value.message;
      this.alert = value.alert;
    },
    getUserName(){
      var id = JSON.stringify({
        Session_ID: this.$ls.get("SESSION_ID")
      });

      this.$http
        .post(this.$aid.url() + "Home/loadUserName",JSON.stringify({'Session_ID':this.$ls.get('SESSION_ID')}))
        .then(function(response) {
          var arr = JSON.parse(response.data);
          // var arr = response.data;
          for (var i in arr["Table"]) {
            var el = arr["Table"][0];
            this.userName = el.Name;
            this.NIK = el.NIK;
            this.email = el.Email;

            this.$ls.set('EMAIL',this.email);
            this.$ls.set('USERNAME',this.userName);
            this.$ls.set('USER_IDX',el.IDX_M_Users);
          }
        })
        .catch(function(error) {
          this.spinner = false;
          this.$aid.console(error.body,false);
        });
    },
    // core
    showAlert(message, code) {
      this.alert = true;
      this.message = message;
      this.color = code;
    }
  }
};
</script>

<style>
#app {
  font-family: "roboto", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.loader {
  /* display: none; */
  overflow: scroll;
  position: fixed;
  top: 0%;
  right: 0;
  bottom: 0;
  left: 0%;
  z-index: 1050;
  -webkit-overflow-scrolling: touch;
  outline: 0;
  background: rgba(255, 255, 255, 0);
}

.splash {
  overflow: scroll;
  position: fixed;
  top: 0%;
  right: 0;
  bottom: 0;
  left: 0%;
  z-index: 1050;
  -webkit-overflow-scrolling: touch;
  outline: 0;
  background: white;
}
</style>
