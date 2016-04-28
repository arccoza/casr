// app.vue
<style>
  .togglebox {
    /*display: inline-block;*/
  }
  .togglebox__input {
    display: none;
  }
</style>

<template>
  <label class="togglebox">
    <input type="checkbox" checked="{{ state }}">
  </label>
</template>

<script>
export default {
  data () {
    return {
      state: false
    }
  }
}
</script>
