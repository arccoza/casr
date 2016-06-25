<style>

</style>

<template lang="jade">
  .logout(style="text-align:center;")
    h2
      |Logout
    .logout__error
      |{{ authError }}
    h3
      |{{ ds.data.user.name }}
    ui-btn(@tap="logout")
      |LOGOUT

</template>

<script>
import Lie from 'lie';


export default {
  data() {
    return {
      authError: null
    }
  },
  attached() {
    if(this.data.auth.error) {
      this.authError = this.data.auth.error;
      this.data.auth.error = null;
    }
  },
  methods: {
    logout(ev) {
      this.goto({ name: 'do.auth.logout' });
    }
  }
  // mixins: require('../mixins.js')
}
</script>
