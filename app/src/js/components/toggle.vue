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
      <glyph :kind="glyph" :class="classes.glyph"></glyph>
      <input :class="classes.input" @change="change" :name="name" :value="value" type="checkbox" :checked="isOn", :disabled="isDisabled">
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
    look: {
      type: null,
      default() {
        console.log('def');
        return {
          primary: true,
          positive: false,
          negative: false
        };
      },
      coerce(val) {
        let obj = {
          primary: true,
          positive: false,
          negative: false
        };

        if(typeof val == 'string') {
          let arr = val.split(/[\s,]+/);

          for(let i = 0, v; v = arr[i++];) {
            obj[v] = true;
          }

          obj.negative == obj.positive ? false : obj.negative;
          obj.primary == obj.positive || obj.negative ? false : true;

          return obj;
        }

        return val;
      }
    },
    feel: {
      type: null,
      default() {
        return {
          normal: true,
          disabled: false
        };
      },
      coerce(val) {
        let obj = {
          normal: true,
          disabled: false
        };

        if(typeof val == 'string') {
          let arr = val.split(/[\s,]+/);

          for(let i = 0, v; v = arr[i++];) {
            obj[v] = true;
          }

          obj.normal = !obj.disabled;

          return obj;
        }

        return val;
      }
    },
    on: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    classes() {
      return {
        container: {
          'toggle': true,
          'toggle--positive': this.look.positive,
          'toggle--negative': this.look.negative,
          'toggle--on': this.isOn,
          'toggle--off': this.isOff,
          'toggle--disabled': this.isDisabled,
          'toggle--hover': this.hover,
          'toggle--active': this.active
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
    isDisabled() {
      return this.feel.disabled;
    },
    isOn() {
      return this.on;
    },
    isOff() {
      return !this.isOn;
    },
    glyph() {
      return this.look.negative ? this.glyphs['negative'] : this.glyphs['positive'];
    }
  },
  methods: {
    toggle() {
      this.on = !this.on;
    },
    change(ev) {
      console.log('change')
      this.on = ev.target.checked;
      this.$emit('toggle', {
        eventType: 'toggle',
        eventValue: { on: this.isOn, off: this.isOff },
        target: this,
        name: this.name,
        value: this.value
      });
    }
  },
  mixins: require('./mixins.js'),
  components: {
    glyph: require('./glyph.vue')
  }
}
</script>
