<template>
  <div>
    <v-layout column>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex v-bind="{ [`xs${card.Flex}`]: true }" v-for="card in items" :key="card.Label">
            <v-card :to="card.Href" height="100px" flat>
              <v-container fluid>
                <v-layout row>
                  <v-flex xs12>
                    <v-layout column>
                      <v-flex xs6>
                        <v-icon large :color="card.Color" class="mt-3">{{ card.Icon != null ? card.Icon : v_icon }}</v-icon>    
                      </v-flex>
                      <v-flex xs6>
                        <span class="body-2">{{ card.Label }}</span>
                      </v-flex>
                    </v-layout>
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
            v_urlImg: 'https://apps.alam-sutera.com/SharedAsset/general/type.png',
            v_icon: 'info',
          }
        }
    }    
</script>