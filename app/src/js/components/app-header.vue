<style>

</style>

<template lang="jade">
  .header
    h1 Main page
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

</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
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
          rem: true
        }
      }
    }
  }
  // mixins: require('./mixins')
}
</script>
