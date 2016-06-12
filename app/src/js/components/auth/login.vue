<style>

</style>

<template lang="jade">
  .login(style="text-align:center;")
    h1
      |Login
    ui-fld(value="", feel="floatHint")
      span(slot="hint")
        |email
    br
    ui-fld(value="", feel="floatHint, password")
      span(slot="hint")
        |password
    br
    ui-btn
      |LOGIN

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
  mixins: require('../mixins.js')
}
</script>
