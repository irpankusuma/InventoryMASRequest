<template>
  <v-container grid-list-sm>
    <!-- alert and spinner -->
    <v-snackbar :timeout="timeout" :color="color" :top="'top'" :multi-line="'multi-line'" :vertical="'vertical'" v-model="alert">
      {{message}}
      <v-btn dark flat @click.native="alert = false">Close</v-btn>
    </v-snackbar>
    <v-system-bar app fixed window>
      <v-btn flat light>{{ this.$aid.appName() }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn flat small><v-icon dark small left>adb</v-icon>version 1.0.0</v-btn>
      <v-tooltip bottom max-width="90">
        <v-btn slot="activator" fab small flat href="https://apps.alam-sutera.com/SharedAsset/general/ATKRequestGuideAndDoc.pdf" target="_blank"><v-icon color="blue">help</v-icon></v-btn>
        <span>Guide And Documentation</span>
      </v-tooltip>
    </v-system-bar>
    
    <v-layout>
      <v-flex xs6 md4 lg3 xl3 mx-auto>
        <v-progress-linear height="4" class="mb-0" :indeterminate="spinner" background-color="yellow lighten-5"></v-progress-linear>
        <v-card class="elevation-1">
          <v-toolbar flat class="primary" dense>
            <v-toolbar-title class="mx-auto white--text">MASUK</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-layout  wrap row>
              <v-flex xs12>
                <v-text-field outline type="text" label="NIK" v-model="user" prepend-icon="face"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field outline :type="show ? 'text':'password'" :append-icon="show ? 'visibility_off' : 'visibility'" @click:append="show =! show" label="PASSWORD" v-model="pass" prepend-icon="verified_user" @keyup.enter.native="login()"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn outline light large @click="login()">Login</v-btn>                
              </v-flex>
            </v-layout>                                    
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
      <!-- Info -->
    <v-dialog v-model="infoDialog" max-width="400px" transition="dialog-transition">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Guide and Documentation</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat small fab @click="infoDialog =! infoDialog"><v-icon>clear</v-icon></v-btn>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-subheader>
            Click here 
            <v-btn slot="activator" fab small flat href="https://apps.alam-sutera.com/SharedAsset/general/ATKRequestGuideAndDoc.pdf" target="_blank"><v-icon color="blue">help</v-icon></v-btn>
            for Guide and Documentation
          </v-subheader>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

export default {
  data() {
    return {
      user: null,
      pass: null,
      errorLogin: null,
      showError: false,
      tempmsg:[],
      //loading
      statusLoad: "Loading...",
      spinner: false,
      splash: false,
      infoDialog: false,
      //alert
      alert: false,
      message: null,
      timeout: 6000,
      color: "",
      show: false,
    };
  },
  beforeMount() {
    this.loadInfo()
  },
  computed: {
    appsURL() {
      return this.$store.state.appsURL;
    }
  },
  methods: {
    getSession(){
      var id = JSON.stringify({
        NIK: this.user,
        IPAddress:''
      });
      this.$http
        .post(this.$aid.url() + "LDAP/getLDAPSession", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "logging in...";
          }
        })
        .then(function(response) {
          this.spinner = false;
          // let arr = response.data;
          let arr = JSON.parse(response.data);
          console.log(arrs);
          let session = arr['Table'][0].Session_ID;
          
          // let session = arr['Table'][0]['Session_ID'];
          // console.log(session)

          if(!arr['Table'][0]['Code']){
            this.snackbar({color:'error',message:'Gagal masuk, silahkan cek username atau password Anda.',alert:true});
            return false
          }

          if (session != "") {
            this.$ls.set('SESSION_ID',session);
            this.$ls.set('NIK',this.user);
            this.$store.getters.menuShow;
            this.$router.push('/Dashboard');
          } else {
            this.snackbar({color:'error',message:"Gagal masuk, silahkan cek username atau password Anda.",alert:true});
          }
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error, status) {
          this.spinner = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    loadInfo(){
      setTimeout(() => {
        this.infoDialog = false
      },5000);
    },
    login() {
      var id = JSON.stringify({
        NIK: this.user,
        Password: this.pass
      });
      this.$http
        .post(this.$aid.url() + "LDAP/verifyLDAP", id, {
          before: () => {
            this.spinner = true;
            this.statusLoad = "logging in...";
          }
        })
        .then(function(response) {
          console.log('open');
          let arr = response.data;
          console.log(arr);
          // if (arr['Table']['status'] == true) {
          //   this.getSession();
          // } else {
          //   this.snackbar({color:'error',message:"Login Failed..",alert:true});
          // }
          
          if (arr == "") {
            this.$ls.set('NIK',this.user);
            this.$store.getters.menuShow;
            this.$router.push('/Dashboard');
            this.getSession();
          } else {
            this.snackbar({color:'error',message:"Gagal masuk, silahkan cek username atau password Anda.",alert:true});
          }
        })
        .then(function() {
          this.spinner = false;
        })
        .catch(function(error, status) {
          this.spinner = false;
          this.snackbar({color:'error',message:error.statusText,alert:true});
          this.$aid.console(error.body,false);
        });
    },
    snackbar(value){
      this.$emit('snackbar',value);
    },
    showAlert(message, code) {
      this.alert = true;
      this.message = message;
      this.color = code;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
