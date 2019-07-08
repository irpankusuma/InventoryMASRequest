<template>
    <div>
        <div v-if="!v_edit">
            <div v-if="(type == 'textfield') || (type == 'select')">
                <span class="edit-text" @click="fn_enable">{{ value }}</span>
            </div>
        </div>
        <div v-if="v_edit">
            <div v-if="type == 'textfield'">
                <v-layout row wrap>
                    <v-flex sm8>
                        <v-text-field 
                            v-on:keyup.esc="fn_disable" 
                            v-focus="v_focus" 
                            @focus="v_focus = true"
                            @blur="v_focus = false" 
                            v-model="vm_tempVal">
                        </v-text-field>
                    </v-flex>
                    <v-flex sm4>
                        <v-btn @click="fn_do" small color="teal" fab dark>
                          <v-icon>save</v-icon>
                        </v-btn>
                        <v-btn @click="fn_disable" small color="grey" fab dark>
                          <v-icon>clear</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
              </div>
            <div v-if="type == 'select'">
                <v-select
                  v-on:keyup.esc="fn_disable"
                  :items="items"
                  v-model="vm_tempVal"
                  label="Choose..."
                  prepend-icon="lists"
                  :item-text="keyText"
                  :item-value="keyValue"
                  autocomplete
                ></v-select>
                <v-btn @click="fn_do" small color="success">save</v-btn>
                <v-btn @click="fn_disable" small color="error">cancel</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { VueFocus } from 'vue-focus';
export default {
    name: 'cs-xedit',
    directives: {
        focus: VueFocus
    },
    props: {
        type: String,
        id: [String,Object,Number],
        value: [String,Object,Number],
        code: [String,Object,Number],
        items: [Array,Object],
        keyText: [String,Object],
        keyValue: [String,Object]
    }, 
    data(){
        return {
            v_edit: false,
            v_focus: false,
            vm_tempVal: null,
            w_value: null,
        }   
    },
    watch: {
        w_value(){
            this.vm_tempVal = this.w_value;
            this.fn_do();
        }
    },
    methods: {
        fn_enable(){
            this.vm_tempVal = this.value
            this.v_edit = true
        },
        fn_disable(){
            this.vm_tempVal = null
            this.v_edit = false
        },
        fn_do(){
            this.$emit('em_sendTo',[
                this.id,
                (this.value != this.vm_tempVal) ? this.vm_tempVal : this.value,
                this.code
            ]);
            this.fn_disable();
        }
    }
}
</script>

<style>
    .edit-text {
        border-bottom: 1px blue dashed;
        text-decoration: none;
    }
</style>
