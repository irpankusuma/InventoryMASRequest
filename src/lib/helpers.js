/**
 * Helpers v0.0.1
 * (c) 2018 IKW
 * @license ICT
 * Session ID : 201804091704205741756557
 * 1605082
 */

/**
* Information AssetICT
* url development  : http://10.10.0.28/WebServiceAssetICT/api/
* url production   : https://api.alam-sutera.com/WebServiceAssetICT/api/
* url debuging     : http://localhost:49722/api/
* url reporting    : http://10.10.0.28/asrireport/Report/Common.aspx
 
* servicedesk   
* url production   : https://api.alam-sutera.com/WebServiceASRILup/api/
*/

// const tf = require('@tensorflow/tfjs');
// require('@tensorflow/tfjs-node');

// const model = tf.sequential();
const __prefix = 'IREMAS__';
const __isDevelopment = 0;
const __url = __isDevelopment ? 'http://10.10.0.28/WebServiceATKGA/api/' : 'https://api.alam-sutera.com/InventoryMAS/api/';
const __appName = 'InventoryMAS';
const __uploadPath = 'https://apps.alam-sutera.com/SharedAsset/general/';
const __filePath = "D:/Public Application/ASRILup/image/";
const __urlPath = 'http://10.10.0.28/ASRILup/image/'
const __appID = 33;

class Helpers {
    /**
     * constructor
     */
    constructor() {
        // empty
    }

    /** 
     * Build
     */
    url() {
        return __url;
    }

    isDevelopment() {
        return __isDevelopment;
    }

    appID() {
        return __appID;
    }

    appName(value) {
        return !value ? __appName : value;
    }

    uploadPath() {
        return __uploadPath;
    }

    filePath() {
        return __filePath;
    }

    urlPath() {
        return __urlPath;
    }

    /**
     * Local Storage System
     */
    set(key, value) {
        let text = __prefix + key;
        localStorage.setItem(text, value);
    }

    get(key, value) {
        let text = __prefix + key;
        let output = localStorage.getItem(text);
        if (value != null) {
            this.lsSet(key, value);
        }
        return output;
    }

    remove(key) {
        let text = __prefix + key;
        localStorage.removeItem(text);
    }

    clear() {
        localStorage.clear();
    }

    /**
     * Console.log()
     */
    console(value, status) {
        if (__isDevelopment) {
            return !status ? console.warn(value) : console.log(value);
        }
    }

    /**
     * 
     * @param {*} arr1 
     * @param {*} arr2 
     */
    arrayMerge(arr1, arr2) {
        return [arr1, arr2].reduce(function(r, o) {
            Object.keys(o).forEach(function(k) {
                r[k] = o[k];
            });
            return r;
        }, {});
    }

    /**
     * mapModel
     * @description
     *  In your array you must have key with name "vmodel"
     */
    mapModel(arr) {
        let output = [];
        for (var i = 0; i < arr.length; i++) {
            output += arr[i].VModel + ',';
        }

        output = output.split(",");
        output.pop();
        return output;
    }

    /**
     * mixModel
     * @description
     *  
     */
    mixModel(arr, val) {
        let output = {};
        for (var i = 0; i < arr.length; i++) {
            output[arr[i]] = val[i];
        }

        return output;
    }

    /**
     * Clean Array
     */
    arrayClean(arr) {
        let newArray = new Array();
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                newArray.push(arr[i])
            }
        }
        return newArray
    }

    /**
     * Check if data is something
     */
    isArray(value) {
        return value && typeof value === 'object' && value.constructor === Array;
    }

    isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

    isFunc(value) {
        return typeof value === 'function';
    }

    isObj(value) {
        return value && typeof value === 'object' && value.constructor === Object;
    }

    isNull(value) {
        return value === null;
    }

    isUndefined(value) {
        return typeof value === 'undefined';
    }

    isBoolean(value) {
        return typeof value === 'boolean';
    }

    isRegexp(value) {
        return value && typeof value === 'object' && value.constructor === RegExp;
    }

    isError(value) {
        return value instanceof Error && typeof value.message !== 'undefined';
    }

    isDate(value) {
        return value instanceof Date;
    }

    isNaN(value) {
        return typeof value === 'NaN';
    }

    isSymbol(value) {
        return typeof value === 'symbol';
    }

    /**
     * Dynamic Sort
     * @description
     *  Do sorting with key
     */
    dynamicSort(key) {
        let sortOrder = 1;
        if (key[0] === "-") {
            sortOrder = -1;
            key = key.substr(1);
        }
        return function(a, b) {
            let res = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
            return res * sortOrder;
        }
    }

    /**
     * 
     * @param {*} value 
     */
    formatPrice(value) {
        let val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    /**
     * 
     * @param {*} number 
     */
    numberWithCommas(number) {
        if (number == undefined || number == null) number = 0;
        var parts = number.toString().split(".");
        return (
            parts[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") +
            (parts[1] ? "." + parts[1] : "")
        );
    }

    /**
     * getArrayChild
     * https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
     * getArrayChild(arr,"key.name",value);
     */
    getArrayChild(arr, elm, value) {
        elm = elm.replace(/\[(\w+)\]/g, '.$1');
        elm = elm.replace(/^\./, '');

        let el = elm.split('.');
        for (let i = 0, n = el.length; i < n; ++i) {
            let k = el[i];
            if (k in arr) {
                arr = arr[k]
            } else {
                return;
            }

            return arr;
        }
    }

    urlSplit(str, split, i, n) {
        str = str.split(split);
        let splice = str.splice(i, n);
        return str.join(split);
    }

    /**
     * Initial avatar
     * from avatar-vue
     */
    avatarInitial(username) {
        let parts = (username == null) || (username == undefined) ? ['Not', '/', 'Available'] : username.split(/[ -]/)
        let initials = ''

        for (var i = 0; i < parts.length; i++) {
            initials += parts[i].charAt(0)
        }

        if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
            initials = initials.replace(/[a-z]+/g, '')
        }

        initials = initials.substr(0, 3).toUpperCase()

        return initials
    }

    /**
     * Create IFrame
     */
    createIFrame(url, w, h) {
        let iframe = document.createElement("iframe");
        w = (w == null) || (w == undefined) ? '640px' : w;
        h = (h == null) || (h == undefined) ? '480px' : h;

        iframe.setAttribute("src", url);
        iframe.style.width = w;
        iframe.style.height = h;
        document.body.appendChild(iframe);
    }

    /**
     * Debug data
     */
    debug(msg, key) {
        // console.log(msg);
        // console.log(key);
    }

    /**
     * youmightnotjquery
     */
    fadeIn(el) {
        el.style.opacity = 0;

        var last = +new Date();
        var tick = function() {
            el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
            last = +new Date();

            if (+el.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
            }
        };

        tick();
    }

    matches(el, selector) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    }


}

/**
 * INSTALL to Vue System
 */
var Helpers$1 = new Helpers();
var index = {
    /**
     * Install 
     *
     * @param {Vue} Vue
     * @param {Object} options
     */
    install: (Vue, options = {}) => {
        if (typeof process !== 'undefined' &&
            (
                process.server ||
                process.SERVER_BUILD ||
                (process.env && process.env.VUE_ENV === 'server')
            )
        ) {
            return
        }

        const name = options.name || 'helpers';
        Vue.mixin({
            created() {
                if (this.$options[name]) {
                    Object.keys(this.$options[name]).forEach((key) => {
                        const [type, defaultValue] = [this.$options[name][key].type, this.$options[name][key].default];

                        Helpers$1.addProperty(key, type, defaultValue);
                    });
                }
            }
        });

        Vue[name] = Helpers$1;
        Vue.prototype[`$${name}`] = Helpers$1;
    }
};

export default index;