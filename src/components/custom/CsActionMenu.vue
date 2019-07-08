<template>
  <div>
    <v-menu bottom :left="left" :right="right">
      <v-btn icon slot="activator" flat><v-icon :color="color">more_vert</v-icon></v-btn>
      <v-list dense>
        <!-- for dynamic array then go -->
        <v-list-tile v-for="(k, v) in items" :key="v" @click="submit(k.code)" :to="(k.to != null) || (k.to != undefined) ? k.to + ($aid.isArray(idx) ? idx[1] : idx) : null">
          <v-list-tile-title><v-icon v-if="k.icon != null" :color="k.color">{{ k.icon }}</v-icon> {{ k.text }}</v-list-tile-title>
        </v-list-tile>

        <!-- Default Master -->
        <v-list-tile @click="submit('isView')" v-if="isView">
          <v-list-tile-title><v-icon small color="blue" left>link</v-icon> Show</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isUpdate')" v-if="isUpdate" :to="isUpdateTo != null ? isUpdateTo + this.id : null">
          <v-list-tile-title><v-icon small color="green" left>mode_edit</v-icon> Edit</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isEnable')" v-if="isEnable != null">
          <v-list-tile-title v-if="isEnable"><v-icon small color="green">visibility</v-icon> Enable</v-list-tile-title>
          <v-list-tile-title v-if="!isEnable"><v-icon small color="red">visibility_off</v-icon> Disable</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="submit('isDelete')" v-if="!skip ? isDelete && isEnable : isDelete">
          <v-list-tile-title><v-icon small color="black">delete</v-icon> Delete</v-list-tile-title>
        </v-list-tile>

        <!-- User -->
        <v-list-tile @click="submit('isHRIS')" v-if="isHRIS">
          <v-list-tile-title><v-icon small color="yellow darken-1">verified_user</v-icon> Check HRIS</v-list-tile-title>
        </v-list-tile>

        <!-- My Request -->
        <v-list-tile @click="submit('isRequest')" v-if="isRequest">
          <v-list-tile-title><v-icon small color="blue">send</v-icon> Send Request</v-list-tile-title>
        </v-list-tile>
        <!-- Draft -->
        <v-list-tile @click="submit('isDraft')" v-if="isDraft != null">
          <v-list-tile-title v-if="isDraft"><v-icon small color="grey darken-2">drafts</v-icon> Draft</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isApprove')" v-if="isApprove != null">
          <v-list-tile-title v-if="isApprove"><v-icon small color="green">verified_user</v-icon> Approve</v-list-tile-title>
          <v-list-tile-title v-if="!isApprove"><v-icon small color="red">clear</v-icon>Cancel Approve</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isReject')" v-if="isReject != null">
          <v-list-tile-title v-if="isReject"><v-icon small color="black">highlight_off</v-icon> Reject</v-list-tile-title>
          <v-list-tile-title v-if="!isReject"><v-icon small color="red">clear</v-icon> Cancel Reject</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isCancel')" v-if="isCancel">
          <v-list-tile-title><v-icon small color="black">cancel</v-icon>Cancel</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="submit('isReceive')" v-if="isReceive">
          <v-list-tile-title><v-icon small color="blue darken-1">local_shipping</v-icon>Receive</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'cs-action-menu',
  props: {
    id: null,
    items: null,
    color: null,
    left: true,
    right: false,
    divider: false,
    isUpdateTo: null,

    /** Default Master */
    isUpdate: false,
    isDelete: false,
    isEnable: false,
    isView: true,
    isReadOnly: false,
    skip: false,

    /** User */
    isHRIS: false,
    
    /** My Request */
    isApprove:false,
    isRequest:false,
    isDraft:false,
    isReject:false,
    isCancel:false,
    isReceive:false
  },
  watch: {
    id(){
      this.id;
    }
  },
  methods: {
    submit(code){
      this.$emit('submit',{id:this.id,code:code});
    }
  }
}
</script>

<style>

</style>
