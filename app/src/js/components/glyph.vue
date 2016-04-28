// app.vue
<style>
  .glyph {
    width: 1em;
    height: 1em;
    line-height: 1em;
    display: inline-block;
    font-family: budicon;
    font-style: normal;
    font-weight: normal;
    font-size: 1em;
  }
</style>

<template>
  <i :class="classes"></i>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    type: {
      type: String,
      default() {
        return 'animal-cat';
      }
    }
  },
  computed: {
    classes() {
      return {
        'glyph': true,
        ['glyph--' + this.type]: true
      }
    }
  }
}
</script>
