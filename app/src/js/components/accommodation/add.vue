<style>

</style>

<template lang="jade">
  .accommodation--edit
    table.doc-table
      tbody
        tr()
          td
            ui-fld(name="type", :value.sync="accommodation.type", feel="floatHint", @change="clearErrors")
              span(slot="hint")
                |type
              span(slot="messageStart")
                |{{ typeError }}
          td
            ui-fld(name="units", :value.sync="accommodation.units", feel="floatHint", @change="clearErrors")
              span(slot="hint")
                |units
              span(slot="messageStart")
                |{{ unitsError }}
        tr
          td
            ui-fld(name="rate", :value.sync="accommodation.rate", feel="floatHint", @change="clearErrors")
              span(slot="hint")
                |rate
              span(slot="messageStart")
                |{{ rateError }}
          td
            ui-fld(name="max_ppl", :value.sync="accommodation.max_ppl", feel="floatHint", @change="clearErrors")
              span(slot="hint")
                |max occupancy
              span(slot="messageStart")
                |{{ max_pplError }}
    br
    br
    .savecancel
      ui-btn
        |SAVE
      span &nbsp;
      ui-btn(look="negative")
        |CANCEL


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
