<template>
	<v-layout>
		<v-text-field 
			class="pl-2" autofocus auto-grow full-width clearable placeholder="Pencarian" box
			:color="color" 
			dense 
			v-model="vm_search" 
			@keyup.enter.native="fn_do" 
			:label="label" 
			single-line 
			append-icon="search" 
			solo 
		>
			<template v-slot:append-outer>
				<v-fade-transition leave-absolute>
					<v-btn icon @click="qrDialog =! qrDialog"><v-icon>photo_camera</v-icon></v-btn>
				</v-fade-transition>
			</template>
		</v-text-field>

		<v-dialog v-model="qrDialog" scrollable :overlay="false" width="500" transition="dialog-transition">
			<qrcode-stream @decode="scan"></qrcode-stream>
		</v-dialog>
	</v-layout>
</template>

<script>
export default {
	name: 'cs-search',
	props: {
		color: {
			type: [String,Object],
			default: 'white'
		},
		searchKey: {
			type: [String,Object],
      default: 'Keyword'
		},
		qrKey: {
			type: [String,Object],
      default: 'qr_id'
		},
		label: {
			type: String,
			default(){
				return 'Search'
			}
		}
	},
	watch:{
		vm_search(){
			if((this.vm_search == null) || (this.vm_search == undefined) || (this.vm_search == '')){
				let params = {};
				params[this.searchKey] = this.vm_search;
				this.$emit('search',params);
			}
			return false
		}
	},
	data(){
		return {
			vm_search: null,
			qrDialog:false
		}
	},
	methods: {
		fn_do(){
			let params = {};
			params[this.searchKey] = this.vm_search;
			this.$emit('search',params);
		},
		scan(string){
			let data = JSON.parse(string);
			let params = {};
			params[this.searchKey] = data[this.qrKey];
			this.vm_search = data[this.qrKey];
			this.$emit('search',params);
			this.qrDialog = false;
		}
	}
}
</script>
