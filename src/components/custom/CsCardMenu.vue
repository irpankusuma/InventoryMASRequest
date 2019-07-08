<template>
  <div>
    <v-layout column>
      <v-container grid-list-lg>
        <v-layout row wrap>
          <v-flex v-bind="{ [`xs${card.Flex}`]: true }" v-for="card in items" :key="card.Label">
            <v-card :color="!card.Color ? 'teal accent-4' : card.Color" :to="card.Href">
              <v-container grid-list-md>
                <v-layout row>
                  <v-flex xs6>
                    <span class="title" v-html="card.Label"></span>
                  </v-flex>
                  <v-flex xs6>
                    <img :src="card.Icon == null ? v_urlImg : card.Icon" style="max-width:54px; min-height:6em">
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
        name: 'cs-card',
        props: {
            items: {
                type: [Array,Object],
                required: true
            }
        },
        data(){
          return {
            v_urlImg: 'https://apps.alam-sutera.com/SharedAsset/general/type.png'
          }
        }
    }    
</script>