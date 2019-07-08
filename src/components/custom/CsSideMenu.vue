<template>
  <div>
    <v-list dense>
      <v-list-tile :value="true" v-for="(item, i) in items" :key="i" :to="item.path" class="pt-1 pb-1">  
        <v-tooltip right v-if="convert(item.text).count">
          <v-list-tile-action slot="activator">
            <v-layout row wrap>
              <v-flex xs12>
                <v-icon class="mx-auto">{{ item.icon }}</v-icon><br>
              </v-flex>
              <v-flex xs12>
                <span wrap style="font-size:8px" v-text="convert(item.text).text" class="mx-auto black--text"></span>
              </v-flex>
            </v-layout>
          </v-list-tile-action> 
          <span>{{ item.text }}</span>                                         
        </v-tooltip>   
        <v-list-tile-action v-else>
            <v-layout row wrap>
              <v-flex xs12>
                <v-icon class="mx-auto">{{ item.icon }}</v-icon><br>
              </v-flex>
              <v-flex xs12>
                <span wrap style="font-size:8px" v-text="convert(item.text).text" class="mx-auto black--text"></span>
              </v-flex>
            </v-layout>
          </v-list-tile-action>                         
      </v-list-tile>
      <v-list-tile class="cursor pt-1 pb-1">
        <v-list-tile-action @click="logout()">
          <v-layout row wrap>
            <v-flex xs12>
              <v-icon color="red">settings_power</v-icon> <br>
            </v-flex>
            <v-flex xs12>
              <span style="font-size:8px">LOGOUT</span>
            </v-flex>
          </v-layout>
        </v-list-tile-action>
      </v-list-tile>
      <v-list-tile class="cursor pt-1 pb-1">
        <v-list-tile-action @click="help()">
          <v-layout row wrap>
            <v-flex xs12>
              <v-icon color="blue">help</v-icon> <br>
            </v-flex>
            <v-flex xs12>
              <span style="font-size:8px">HELP</span>
            </v-flex>
          </v-layout>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </div>  
</template>

<script>
export default {
  name: 'cs-side-menu',
  created(){
    //this.loadRootMenu();
  },
  data(){
    return {
      items:[
        {
          icon:'dashboard',
          text:'DASHBOARD',
          path:'/dashboard'
        },
        {
          icon:'assignment',
          text:'PERMINTAAN SAYA',
          path:'/myrequest'
        },
        {
          icon:'assignment_turned_in',
          text:'APPROVE SAYA',
          path:'/myapprove'
        },
        {
          icon:'local_library',
          text:'STOCK',
          path:'/lastStock'
        }
      ],
    }
  },
  methods: {
    loadRootMenu() {
      var id = JSON.stringify({
        Session_ID: this.$ls.get("SESSION_ID"),
        IDX_M_Apps: this.$aid.appID()
      });
      this.$http
        .post(this.$aid.url() + "Home/loadRootMenu", id, {
          before: () => {
            this.loading = true;
          }
        })
        .then(function(response) {
          this.items = [];
          var arr = JSON.parse(response.data);
          for (var i in arr["Table"]) {
            this.items.push({
              icon: arr["Table"][i].ICON,
              text: arr["Table"][i].FORM,
              path: arr["Table"][i].URL
            });
          }        
        })
        .catch(function(error) {
          this.loading = false;
          this.$aid.console(error.body,false);
        });
    },
    help(){
      window.open('https://apps.alam-sutera.com/SharedAsset/general/ATKRequestGuideAndDoc.pdf','_blank');
    },
    convert(value){
      let output;
      let arr = value.split("");
      let count = arr.length;
      let text = arr.join("");

      output = {
        count: count > 5 ? true : false,
        text: count > 7 ? text.substr(0,7) + '...' : text
      }

      return output
    },
    logout() {
      var id = JSON.stringify({
        SessionID: this.$ls.get("SESSION_ID"),
        IPAddress: "",
        Source: "WEBSITE"
      });

      this.$http
        .post(this.$aid.url() + "Home/logout", id, { before: () => { } })
        .then(function(response) {
          this.$router.push('/Login');
          this.$store.commit('toggle',false);
        })
        .then(function(){
          this.$ls.clear();
        })
        .catch(function(error) { 
          this.$aid.console(error.body,false);
        });
    },
  }
};
</script>
<style>
  .cursor {
    cursor: pointer;
    opacity: 1;
  }
  .cursor :hover :after {
    content:"\A";
    width:100%;
    height:100%;
    background: grey;
    filter:alpha(opacity=30);
    opacity: 0.04;
    position:absolute;
    top:0;
    left:0;
  }
</style>
