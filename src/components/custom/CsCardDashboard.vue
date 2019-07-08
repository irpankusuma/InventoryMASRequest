<template>
  <div>
    <v-layout column>
      <v-container grid-list-lg>
        <v-layout row wrap>
          <v-flex xs6>
            <v-card>
              <v-container grid-list-md>
                <v-layout row>
                  <v-flex xs7>
                    <div>
                      <div class="headline mb-0"></div>
                      <!-- <div v-if="card.Time > 0" v-html="card.Time"></div> -->
                    </div>
                  </v-flex>
                  <v-flex xs5>
                    <div></div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </div>
</template>

<script>
    export default {
        name: 'cs-card-dashboard'
    }    
</script>