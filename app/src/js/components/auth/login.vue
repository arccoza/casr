<style>

</style>

<template lang="jade">
  .login(style="text-align:center;")
    h2(v-if="isRegister")
      |Register
    h2(v-else)
      |Login
    ui-fld(name="username", :value.sync="username", feel="floatHint")
      span(slot="hint")
        |email
    br
    ui-fld(name="password", :value.sync="password", feel="floatHint, password")
      span(slot="hint")
        |password
    br
    ui-btn(@tap="register", v-if="isRegister")
      |REGISTER
    ui-btn(@tap="login", v-else)
      |LOGIN

</template>

<script>
import Lie from 'lie';


export default {
  data() {
    return {
      username: null,
      password: null
    }
  },
  computed: {

  },
  methods: {
    register(ev) {
      this.data.auth.username = this.username;
      this.data.auth.password = this.password;
      this.goto({ name: 'do.auth.register' });
    },
    login(ev) {
      this.data.auth.username = this.username;
      this.data.auth.password = this.password;
      console.log(this.data)
      this.goto({ name: 'do.auth.login', params: { username: this.username, password: this.password } });
    }
  }
  // mixins: require('../mixins')
}
</script>
