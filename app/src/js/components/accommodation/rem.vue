<style>

</style>

<template lang="jade">
  .accommodation--rem
    span
      |Are you sure you want to remove this document?
    br
    br
    .yesno
      ui-btn
        |YES
      span &nbsp;
      ui-btn
        |NO


</template>

<script>
import Lie from 'lie';


export default {
  data() {
    return {
      // authError: null
      // selected: {},
      accommodation: [
        {
          id: 1,
          type: 'standard',
          units: ['201', '202', '204'],
          rate: 660,
          rate_unit: 'R',
          max_ppl: 2
        },
        {
          id: 2,
          type: 'standard',
          units: ['201', '202', '204'],
          rate: 660,
          rate_unit: 'R',
          max_ppl: 2
        },
        {
          id: 3,
          type: 'standard',
          units: ['201', '202', '204'],
          rate: 660,
          rate_unit: 'R',
          max_ppl: 2
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    updateMenu() {
      var menuItems = Object.assign({}, this.data.menuItems);

      menuItems.rem = this.data.docs.selectedCount > 0;
      menuItems.add = this.data.docs.selectedCount == 0;
      menuItems.edit = this.data.docs.selectedCount == 1;

      this.data.menuItems = menuItems;
    },
    toggleAll(ev) {
      var set = {};

      for(var i = 0, a; a = this.accommodation[i++];) {
        set[a.id] = ev.eventValue.on;
      }

      this.data.docs.selected = set;
    },
    toggleAny(ev) {
      this.updateMenu();
    },
    selectedClass(key) {
      return this.data.docs.selected[key] ? 'docs-table__item--selected' : '';
    }
  },
  attached() {
    this.data.docs.selected = {};
    this.updateMenu();
  },
  // mixins: require('../mixins.js')
}
</script>
