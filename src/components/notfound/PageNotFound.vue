<template>
  <div>
    <v-toolbar app color="grey darken-3" flat dark>
      <v-btn flat to="/Dashboard"><v-icon left>error</v-icon> page not found</v-btn>
    </v-toolbar>
    <v-container fluid>
      <v-layout>
        <v-flex xs12 md3 lg4 offset-md4 offset-lg4>
          <v-card>
            <v-card-media contain height="auto" src="https://apps.alam-sutera.com/SharedAsset/general/user.png"></v-card-media>
            <v-card-text>
              <p class="display-2">Error 404</p>
              <v-divider></v-divider>
              <span>An error has occured, Requested page not found.</span>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name:'page-not-found'
}
</script>

<style>

</style>
