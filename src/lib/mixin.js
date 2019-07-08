import Vue from 'vue'

const CsServiceMixin = {
    beforeMount() {
        this.checkSession();
    },
    data() {
        return {}
    },
    methods: {
        checkSession() {
            return (this.$ls.get('NIK') == null) || (this.$ls.get('NIK') == undefined) ? this.pushSession() : true;
        },
        pushSession() {
            this.$store.getters.disableMenu;
            this.$router.push('/Login');
            this.$ls.clear();
        },
        goSession() {
            this.$store.getters.menuShow;
        }
    }
};

export default CsServiceMixin;