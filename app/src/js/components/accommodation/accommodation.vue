<style>

</style>

<template lang="jade">
  .accommodation
    table.docs-table
      thead
        tr
          th
            ui-tgl(name="all")
          th accomm. type
          th units
          th rate
          th max occ.
      tbody
        tr(v-for="a in accommodation")
          td
            ui-tgl(name="a.id", :on.sync="selected[a.id]")
          td {{ a.type }}
          td {{ a.units.length }}
          td {{ a.rate }}
          td {{ a.max_ppl }}



</template>

<script>
import Lie from 'lie';


export default {
  data() {
    return {
      // authError: null
      selected: {},
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
  attached() {

  },
  methods: {
    select(ev) {

    }
  }
  // mixins: require('../mixins.js')
}
</script>
