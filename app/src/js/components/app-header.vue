<style>

</style>

<template lang="jade">
  .header
    h1 {{ title }}
    .datetime {{ datetime }}
    .userid {{ data.user ? data.user.name : '' }}
    ul.main-menu
      li
        a(v-link="{name: 'accommodation'}", v-if="show.accommodation") Accommodation
      li
        a(v-link="{name: 'reservations'}", v-if="show.reservations") Reservations
      li
        a(v-link="{name: 'users'}", v-if="show.users") Users
      li
        a(v-link="{name: 'auth.register'}", v-if="show.register") Register
      li
        a(v-link="{name: 'auth.login'}", v-if="show.login") Login
      li
        a(v-link="{name: 'auth.logout'}", v-if="show.logout") Logout
      li.rem
        ui-btn(look="round, negative", v-if="show.rem")
          glyph(kind="interface-minus")
      li.add
        ui-btn(look="round", v-if="show.add")
          glyph(kind="interface-plus")
      li.edit
        ui-btn(look="round", v-if="show.edit")
          glyph(kind="editorial-pencil-a")

</template>

<script>
export default {
  data() {
    return {
      datetime: null,
      _intervalId: null
    }
  },
  props: {
    data: Object,
    show: {
      type: Object,
      default() {
        return {
          checkin: true,
          accommodation: true,
          reservations: true,
          users: true,
          register: false,
          login: true,
          logout: false,
          add: true,
          rem: true,
          edit: true
        }
      }
    },
    title: String
  },
  attached() {
    this._intervalId = setInterval(() => this.datetime = (new Date()).toLocaleString(), 1000);
  },
  detached() {
    clearInterval(this._intervalId);
  }
  // mixins: require('./mixins')
}
</script>
