<template>
  <div>
    <v-container grid-list-md>
      <v-card>
        <v-card-media :src="currentImageUrl" height="200px">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="headline">Current Image</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-card-text>
          <v-progress-linear :indeterminate="spinner" color="white" class="mb-0" height="2"></v-progress-linear>
          <div class="input-group input-group--dirty input-group--prepend-icon input-group--solo input-group--text-field input-group--single-line primary--text">
            <div class="input-group__input">
              <v-icon class="mr-2">attach_file</v-icon>
              <input type="file" id="imageFile" />
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn dark @click="upload()"><v-icon left>save</v-icon>Save</v-btn>
          <v-btn light @click="cancel()"><v-icon>clear</v-icon>Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name:'cs-upload-file',
  props:{
    id:null,
    path:null,
    url:null,
    currentImageUrl:null,
  },
  data(){
    return {
      fileUpload:null,
      unique:null,
      spinner:false,
    }
  },
  created(){
    this.getUnique();
  },
  methods:{
    getUnique(){
      this.$http
        .get(this.$aid.url() + "Upload/latestNumber")
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.unique = arr["Table"][0].LatestNumber;
        });
    },
    upload(){
      let image = [];
      image = document.getElementById('imageFile').files[0];
      let oldname = image.name;
      let newname = "img-"+this.id+'-'+this.unique;
      let length  = oldname.lastIndexOf('.');

      let ext = oldname.substring(length,100);
      let filename = newname+ext;
      filename = filename.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,\/? ])+/g, '-');

      this.sendXHR(filename,image);
    },
    cancel(){
      this.$emit('close');
    },
    sendXHR(filename,file){
      let xhr = new XMLHttpRequest();
      xhr.open('POST',this.url);
      xhr.setRequestHeader('filename',filename);
      xhr.setRequestHeader('path',this.path);
      xhr.send(file);
    },
  }
}
</script>

<style>

</style>
