<style>

</style>

<template lang="jade">
  glyphs
  .main
    h1 Main page
    ul.main-menu
      li
        a(v-link="{name: 'accommodation'}") Accommodation
      li
        a(v-link="{name: 'reservations'}") Reservations
      li
        a(v-link="{name: 'users'}") Users
      li
        a(v-link="{name: 'auth.register'}") Register
      li
        a(v-link="{name: 'auth.login'}") Login
      li.rem
        ui-btn(look="round, negative")
          glyph(kind="interface-minus")
      li.add
        ui-btn(look="round")
          glyph(kind="interface-plus")

  v-view
    svg.busy.ribbon
      defs
        circle(id="ribbon-circle", cx="50%", cy="50%", r="50%", fill="none", clip-path="url(#ribbon-circle-clip)")
        clipPath(id="ribbon-circle-clip")
          use(xlink:href="#ribbon-circle")

      use(class="ribbon__circle", xlink:href="#ribbon-circle", x="0", y="0")

</template>

<script>
import Lie from 'lie';


export default {
  data() {
    return {

    }
  },
  props: {

  },
  computed: {
    classes() {
      return {
        container: {
          'field': true,
          'field--normal': this.feel.normal,
          'field--password': this.feel.password,
          'field--positive': this.look.positive,
          'field--negative': this.look.negative,
          'field--filled': this.isFilled,
          'field--empty': this.isEmpty,
          'field--hint': this.feel.hint,
          'field--float-hint': this.feel.floatHint,
          'field--disabled': this.isDisabled,
          'field--hover': this.hover,
          'field--active': this.active,
          'field--focus': this.focus
        },
        inner: {
          'field__inner': true
        },
        hint: {
          'field__hint': true
        },
        start: {
          'field__start': true
        },
        end: {
          'field__end': true
        },
        input: {
          'field__input': true
        },
        messageStart: {
          'field__msg-start': true
        },
        messageEnd: {
          'field__msg-end': true
        }
      }
    }
  },
  methods: {

  },
  mixins: require('../mixins.js'),
  components: require('../ui')
}
</script>
