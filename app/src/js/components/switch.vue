// app.vue
<style>
  .switch {
    display: inline-block;
    vertical-align: middle;
  }
  .switch__grip {
    /*position: relative;*/
    /*left: -0.8em;
    width: 1em;
    height: 1em;
    margin-left: 0.8em;*/
    display: inline-block;
    border-radius: inherit;
  }
  .switch__grip > img {
    height:100%;
  }
  .switch__input {
    display: none;
  }
</style>

<template>
  <label :class="classes.container">
    <i :class="classes.grip"></i>
    <input :class="classes.input" @change="change" :name="name" :value="value" type="checkbox" :checked="isOn", :disabled="isDisabled">
  </label>
</template>

<script>
export default {
  data() {
    return {

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
          'switch': true,
          'switch--positive': this.look.positive,
          'switch--negative': this.look.negative,
          'switch--on': this.isOn,
          'switch--off': this.isOff,
          'switch--disabled': this.isDisabled,
          'switch--hover': this.hover,
          'switch--active': this.active
        },
        inner: {
          'switch__inner': true
        },
        grip: {
          'switch__grip': true
        },
        input: {
          'switch__input': true
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
    }
  },
  methods: {
    toggle() {
      this.on = !this.on;
    },
    change(ev) {
      this.on = ev.target.checked;
      this.$dispatch('change', {
        eventType: 'change',
        eventValue: {
          on: this.isOn,
          off: this.isOff,
          isDisabled: this.isDisabled
        },
        target: this,
        name: this.name,
        value: this.value
      });
    }
  },
  mixins: require('./mixins.js')
}
</script>
