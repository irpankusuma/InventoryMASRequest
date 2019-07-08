<template>
  <div v-if="items.length > 0"> 
    <v-snackbar :timeout="timeout" :color="color" :top="'top'" :multi-line="'multi-line'" :vertical="'vertical'" v-model="alert">
      {{message}}
      <v-btn dark flat @click.native="alert = false">Close</v-btn>
    </v-snackbar>

    <!-- body -->   
    <v-layout column>       
      <v-container grid-list-md>
				<v-card flat>
					<v-card-text>
						<v-layout row wrap>
							<!-- <v-card flat>
								<v-card-text> -->
									<!-- if position is left -->
									<v-flex sm6 v-for="(k,v) in items" :key="v" v-if="k.Position == 'left'">
										<v-layout row v-if="k.Type == 'select'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>                           
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                                    
													<v-select      
															clearable                        
															:label="k.Text"                                  
															:item-text="k.Search" 
															:item-value="k.Value"                                                                                                                         
															:items="k.Data"    
                              :required="k.Required"              
															v-model="vmod[v]"
															autocomplete
													></v-select>                                              
												</v-flex>
                        <v-flex>
                          <v-btn small v-if="k.AutoAdd" fab class="white--text"
                            @click.stop="vm_autoAddDialog =! vm_autoAddDialog"
                            color="teal" @click="fn_getInfo(k.Text,k.AutoCode)">
                            <v-icon>add</v-icon>
                          </v-btn>
                        </v-flex>
										</v-layout>                                                                                                     
										<v-layout row v-if="k.Type == 'textfield'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                
														<v-text-field 
                              clearable 
                              v-model="vmod[v]"
                              :label="k.Text" 
                              :multi-line="k.Multiline"
                              :required="k.Required"
                            ></v-text-field>
												</v-flex>
										</v-layout>  
										<v-layout row v-if="k.Type == 'datepicker'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                
													<v-menu
														v-if="k.Type == 'datepicker'"
														ref="menu"
														lazy
														close-on-content-click
														v-model="picker[v]"
														transition="scale-transition"
														offset-y
														full-width
														:nudge-right="40"
														min-width="290px"
														:return-value.sync="vmod[v]"
													>
														<v-text-field
															slot="activator"
															:label="k.Text"
															v-model="vmod[v]"
															prepend-icon="event"
															readonly
														></v-text-field>
														<v-date-picker v-model="vmod[v]" no-title scrollable></v-date-picker>
													</v-menu>
												</v-flex>
										</v-layout>      
									</v-flex>
									<!-- if position is right -->
									<v-flex sm6 v-for="(k,v) in items" :key="k.ID" v-if="k.Position == 'right'">
										<v-layout row v-if="k.Type == 'select'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>                           
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                                    
													<v-select      
															clearable                        
															:label="k.Text"                                  
															:item-text="k.Search" 
															:item-value="k.Value"                                                                                                                         
															:items="k.Data"    
                              :required="k.Required"             
															v-model="vmod[v]"
															autocomplete
													></v-select>                                                        
												</v-flex>
                        <v-flex>
                          <v-btn small v-if="k.AutoAdd" fab class="white--text"
                            @click.stop="vm_autoAddDialog =! vm_autoAddDialog"
                            color="teal" @click="fn_getInfo(k.Text,k.AutoCode)">
                            <v-icon>add</v-icon>
                          </v-btn>
                        </v-flex>
										</v-layout>                                                                                                     
										<v-layout row v-if="k.Type == 'textfield'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                
														<v-text-field 
                              clearable 
                              :required="k.Required"
                              v-model="vmod[v]" 
                              :label="k.Text" 
                              :multi-line="k.Multiline"
                            ></v-text-field>
												</v-flex>
										</v-layout>  
										<v-layout row v-if="k.Type == 'datepicker'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                
													<v-menu
														v-if="k.Type == 'datepicker'"
														ref="menu"
														lazy
														close-on-content-click
														v-model="picker[v]"
														transition="scale-transition"
														offset-y
														full-width
														:nudge-right="40"
														min-width="290px"
														:return-value.sync="vmod[v]"
													>
														<v-text-field
															slot="activator"
															:label="k.Text"
															v-model="vmod[v]"
															prepend-icon="event"
															readonly
														></v-text-field>
														<v-date-picker v-model="vmod[v]" no-title scrollable></v-date-picker>
													</v-menu>
												</v-flex>
										</v-layout>      
									</v-flex>
									<!-- if position is null -->
									<v-flex sm6 v-for="(k,v) in items" :key="k.ID" v-if="k.Position == null">
										<v-layout row v-if="k.Type == 'select'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>                           
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                                    
													<v-select      
															clearable                        
															:label="k.Text"                                  
															:item-text="k.Search" 
															:item-value="k.Value"                                                                                                                         
															:items="k.Data"  
                              :required="k.Required"             
															v-model="vmod[v]"
															autocomplete
													></v-select>                                                        
												</v-flex>
                        <v-flex>
                          <v-btn small v-if="k.AutoAdd" fab class="white--text"
                            @click.stop="vm_autoAddDialog =! vm_autoAddDialog"
                            color="teal" @click="fn_getInfo(k.Text,k.AutoCode)">
                            <v-icon>add</v-icon>
                          </v-btn>
                        </v-flex>
										</v-layout>                                                                                                     
										<v-layout row v-if="k.Type == 'textfield'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                
														<v-text-field 
                              clearable 
                              :required="k.Required"
                              v-model="vmod[v]" 
                              :label="k.Text" 
                              :multi-line="k.Multiline"
                            ></v-text-field>
												</v-flex>
										</v-layout>  
										<v-layout row v-if="k.Type == 'datepicker'">
												<v-flex xs6 sm6 md6 lg6>
														<v-subheader v-text="k.Text"></v-subheader>
												</v-flex>
												<v-flex v-bind="{ [`xs${k.Flex}`]: true }">                                
													<v-menu
														v-if="k.Type == 'datepicker'"
														ref="menu"
														lazy
														close-on-content-click
														v-model="picker[v]"
														transition="scale-transition"
														offset-y
														full-width
														:nudge-right="40"
														min-width="290px"
														:return-value.sync="vmod[v]"
													>
														<v-text-field
															slot="activator"
															:label="k.Text"
															v-model="vmod[v]"
															prepend-icon="event"
															readonly
														></v-text-field>
														<v-date-picker v-model="vmod[v]" no-title scrollable></v-date-picker>
													</v-menu>
												</v-flex>
										</v-layout>      
									</v-flex>
								<!-- </v-card-text>
							</v-card> -->
							<v-flex sm12>
								<v-layout row>
									<v-flex xs12 md12 lg12>
										<v-btn color="teal darken-1" dark @click="doIt">
											<v-icon left>save</v-icon> Save
										</v-btn>
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-card-text>
				</v-card>
      </v-container>
    </v-layout> 

    <!-- Dialog -->
    <v-dialog v-model="vm_autoAddDialog" scrollable max-width="300px">
      <v-card>
        <v-card-title class="title">
          Add {{ vm_label }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field v-model="vm_newData"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="grey darken-1" flat @click.native="vm_autoAddDialog = false">Close</v-btn>
          <v-btn small color="teal darken-1" class="white--text" :disabled="vm_newData == null ? true : false" @click.native="vm_autoAddDialog = false" 
            @click="fn_autoAdd">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	</div>
</template>

<script>
export default {
  name: 'cs-form',
	props: {
		items: {
			type: [Array,Object]
		},
		// if false => add mode and true is edit mode
		mode:{
			type:Boolean,
			default(){
				return false;
			}
		}
	},
	data() {
		return {
			vmod:{},
			picker:{},
      vm_autoAddDialog: false,
      vm_newData: null,
      vm_label: null,
      vm_value: null,
      vm_vcode: null,

      // default application
      statusLoad: "Loading...",
      alert: false,
      message: null,
      timeout: 6000,
      color: "",
      spinner: false,
		}
	},
	methods: {
		doIt(){
      for(var i=0;i<this.items.length;i++){
        return (this.vmod[i] == undefined) || (this.vmod[i] == null) ? this.showAlert('Field required..','red') : null;
      }

      let arr = this.items;
      let map = this.$aid.mapModel(arr);
      
      this.id = this.$aid.mixModel(map,this.vmod);
      this.$emit('sendTo',this.id);
		},
    fn_getInfo(a,b){
      this.vm_newData = null;
      this.vm_label = a;
      this.vm_vcode = b;
    },
    fn_autoAdd(){
      this.$emit('em_sendTo2',[this.vm_newData,this.vm_vcode]);
    },
    showAlert(message, code) {
      this.alert = true;
      this.message = message;
      this.color = code;
		},
	}
}
</script>

<style>

</style>
