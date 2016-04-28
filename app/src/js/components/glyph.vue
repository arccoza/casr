// app.vue
<style>
  .glyph {
    /*display: inline-block;*/
    font-family: budicon;
    font-style: normal;
    font-weight: normal;
  }
</style>

<template>
  <i class="glyph {{ glyphId }}">
  </i>
</template>

<script>
export default {
  props: ['type'],
  data () {
    return {
      glyphId: 'glyph--animal-fish'
    }
  }
}
</script>
