export default function(Vue) {
  Vue.component('glyphs', require('./glyphs.vue'));
  Vue.component('glyph', require('./glyph.vue'));
  Vue.component('ui-tgl', require('./toggle.vue'));
  Vue.component('ui-swt', require('./switch.vue'));
  Vue.component('ui-btn', require('./button.vue'));
  Vue.component('ui-fld', require('./field.vue'));

  Vue.component('app-header', require('./app-header.vue'));
}
