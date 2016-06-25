<style>

</style>

<template lang="jade">
  .login(style="text-align:center;")
    h2(v-if="isRegister")
      |Register
    h2(v-else)
      |Login
    .login__error
      |{{ authError }}
    ui-fld(name="username", :value.sync="username", feel="floatHint", @change="clearErrors")
      span(slot="hint")
        |email
      span(slot="messageStart")
        |{{ usernameError }}
    br
    ui-fld(name="password", :value.sync="password", feel="floatHint, password", @change="clearErrors")
      span(slot="hint")
        |password
      span(slot="messageStart")
        |{{ passwordError }}
    br
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
      password: null,
      usernameError: '',
      passwordError: '',
      authError: null
    }
  },
  computed: {

  },
  attached() {
    if(this.data.auth.error) {
      this.authError = this.data.auth.error;
      this.data.auth.error = null;
    }
  },
  methods: {
    validate() {
      var ret = true;

      if(!(this.username && this.username.length)) {
        this.usernameError = 'must provide a username.'
        ret = false;
      }
      if(!(this.password && this.password.length)) {
        this.passwordError = 'must provide a password.'
        ret = false;
      }

      if(ret) {
        this.data.auth.username = this.username;
        this.data.auth.password = this.password;
      }

      return ret;
    },
    clearErrors() {
      this.usernameError = '';
      this.passwordError = '';
      this.authError = '';
    },
    register(ev) {
      if(this.validate()) {
        this.goto({ name: 'do.auth.register' });
      }
    },
    login(ev) {
      if(this.validate()) {
        this.goto({ name: 'do.auth.login' });
      }
    }
  }
  // mixins: require('../mixins')
}
</script>
