// app.vue
<style>
  .toggle {
    display: inline-block;
    vertical-align: middle;
  }
  .toggle__input {
    display: none;
  }
</style>

<template>
    <label :class="classes.container">
      <glyph :type="glyph" :class="classes.glyph"></glyph>
      <input :class="classes.input" @change="change" :name="name" :value="value" type="checkbox" :checked="isOn">
    </label>
</template>

<script>
export default {
  data() {
    return {
      glyphs: {
        none: 'none',
        positive: 'interface-tick',
        negative: 'interface-cross'
        // radio: ''
      }
    }
  },
  props: {
    name: {
      type: String,
      default() {
        return '';
      }
    },
    value: {
      type: null,
      default() {
        return '';
      }
    },
    type: {
      type: String,
      default() {
        return 'positive';
      }
    },
    state: {
      type: null,
      default() {
        return 'off';
      },
      coerce(val) {
        if(val === true || val == 1 || val == '1' || (val.toLowerCase && val.toLowerCase() == 'on'))
          return 'on';
        else if(val === false || val == 0 || val == '0' || (val.toLowerCase && val.toLowerCase() == 'off'))
          return 'off';
      }
    }
  },
  computed: {
    classes() {
      return {
        container: {
          'toggle': true,
          ['toggle--' + this.type]: true,
          'toggle--on': this.isOn,
          'toggle--off': this.isOff
          // TODO: Disabled state.
          // 'toggle--disabled': this.isDisabled
        },
        inner: {
          'toggle__inner': true
        },
        glyph: {
          'toggle__glyph': true
        },
        input: {
          'toggle__input': true
        }
      }
    },
    isOn() {
      return this.state == 'on' ? true : false;
    },
    isOff() {
      return !this.isOn;
    },
    glyph() {
      // return this.isOn ? this.glyphs[this.type] : this.glyphs.none;
      return this.glyphs[this.type];
    }
  },
  methods: {
    toggle() {
      this.state = this.isOn ? 'off' : 'on';
    },
    change(ev) {
      this.state = ev.target.checked ? 'on' : 'off';
      this.$dispatch('change', {
        eventType: 'change',
        eventValue: this.state,
        target: this,
        name: this.name,
        value: this.value
      });
    }
  },
  components: {
    glyph: require('./glyph.vue')
  }
}
</script>
