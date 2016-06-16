<style>

</style>

<template lang="jade">
  .login(style="text-align:center;")
    h2
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
  mixins: require('../mixins.js'),
  components: require('../ui')
}
</script>
