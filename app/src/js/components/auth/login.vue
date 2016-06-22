<style>

</style>

<template lang="jade">
  .login(style="text-align:center;")
    h2
      |Login
    ui-fld(name="username", value="", feel="floatHint")
      span(slot="hint")
        |email
    br
    ui-fld(name="password", value="", feel="floatHint, password")
      span(slot="hint")
        |password
    br
    ui-btn(@press-up="tap")
      |LOGIN

</template>

<script>
import Lie from 'lie';


export default {
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {
    tap(ev) {
      console.log(ev);
    }
  },
  mixins: require('../mixins'),
  components: require('../ui')
}
</script>
