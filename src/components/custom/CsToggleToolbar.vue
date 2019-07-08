<template>
  <div>
    <v-btn icon dark @click="toggle"><v-icon>menu</v-icon></v-btn>
  </div>
</template>

<script>
export default {
  name:'cs-toggle',
  computed:{
    showMenu() {
      return this.$store.state.showMenu;
    },
  },
  methods:{
    toggle(){
      return this.showMenu ? this.$store.commit('toggle',false) : this.$store.commit('toggle',true);
    }
  }
}
</script>

<style>

</style>
