// app.vue
<style>
  .glyph {
    /*width: 1em;
    height: 1em;
    line-height: 1em;*/
    /*display: inline-block;*/
    /*text-align: center;*/
    /*font-family: budicon;*/
    /*font-style: normal;
    font-weight: normal;
    font-size: 1em;
    fill: #fff;*/
  }
</style>

<template>
  <svg :class="classes"><use :xlink:href="xlink"></use></svg>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    kind: {
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
        ['glyph--' + this.kind]: true
      }
    },
    xlink() {
      return '#glyph-' + this.kind
    }
  }
}
</script>
