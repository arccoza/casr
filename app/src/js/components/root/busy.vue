<style>
.busy {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -150px;
  width: 300px;
  height: 300px;
}
</style>

<template lang="jade">
  div
    ui-rbn.busy

</template>

<script>
export default {
  data() {
    return {

    }
  },
  mixins: require('../mixins.js'),
  components: require('../ui')
}
</script>
