<style>

</style>

<template lang="jade">
  //- glyphs
  .main
    glyphs
    app-header(:goto="goto", :data="data", :title="data.pageTitle", :show="data.menuItems")
    .busy(v-show="data.isBusy")
        .msg {{ data.busyMsg }}
        svg.ribbon
          defs
            circle(id="ribbon-circle", cx="50%", cy="50%", r="50%", fill="none", clip-path="url(#ribbon-circle-clip)")
            clipPath(id="ribbon-circle-clip")
              use(xlink:href="#ribbon-circle")
          use(class="ribbon__circle", xlink:href="#ribbon-circle", x="0", y="0")
    .content
      v-view

</template>

<script>
export default {
  data() {
    return {
      isBusy: false,
      busyMsg: ''
    }
  },
  props: {

  },
  // computed: {
  //   classes() {
  //     return {
  //       container: {
  //         'field': true,
  //         'field--normal': this.feel.normal,
  //         'field--password': this.feel.password,
  //         'field--positive': this.look.positive,
  //         'field--negative': this.look.negative,
  //         'field--filled': this.isFilled,
  //         'field--empty': this.isEmpty,
  //         'field--hint': this.feel.hint,
  //         'field--float-hint': this.feel.floatHint,
  //         'field--disabled': this.isDisabled,
  //         'field--hover': this.hover,
  //         'field--active': this.active,
  //         'field--focus': this.focus
  //       },
  //       inner: {
  //         'field__inner': true
  //       },
  //       hint: {
  //         'field__hint': true
  //       },
  //       start: {
  //         'field__start': true
  //       },
  //       end: {
  //         'field__end': true
  //       },
  //       input: {
  //         'field__input': true
  //       },
  //       messageStart: {
  //         'field__msg-start': true
  //       },
  //       messageEnd: {
  //         'field__msg-end': true
  //       }
  //     }
  //   }
  // },
  methods: {

  }
  // mixins: require('../mixins.js')
}
</script>
