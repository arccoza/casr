// button.vue
<style>
  .button {
    /*display: inline-block;*/
    vertical-align: middle;
    text-align: center;
  }
  .button__input {
    display: none;
  }
</style>

<template>
    <button :class="classes.container">
      <span :class="classes.start" v-if="hasStart">
        <slot name="start"></slot>
      </span>
      <span :class="classes.content">
        <slot></slot>
      </span>
      <span :class="classes.end" v-if="hasEnd">
        <slot name="end"></slot>
      </span>
      <input v-if="isToggle || isSubmit" :class="classes.input" @change="change" :name="name" :value="value" :type="'checkbox' ? isToggle : 'submit'">
    </button>
</template>

<script>
import Lie from 'lie';


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
      type: String,
      default() {
        return '';
      }
    },
    look: {
      type: null,
      default() {
        return {
          primary: true,
          positive: false,
          negative: false,
          round: false
        };
      },
      coerce(val) {
        let obj = {
          primary: true,
          positive: false,
          negative: false,
          round: false
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
          toggle: false,
          disabled: false
        };
      },
      coerce(val) {
        let obj = {
          normal: true,
          toggle: false,
          disabled: false
        };

        if(typeof val == 'string') {
          let arr = val.split(/[\s,]+/);

          for(let i = 0, v; v = arr[i++];) {
            obj[v] = true;
          }

          obj.toggle = obj.toggle && !obj.disabled;
          obj.normal = !obj.toggle && !obj.disabled;

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
    },
    start: Boolean,
    end: Boolean
  },
  computed: {
    classes() {
      return {
        container: {
          'button': true,
          'button--normal': this.feel.normal,
          'button--positive': this.look.positive,
          'button--negative': this.look.negative,
          'button--round': this.look.round,
          'button--toggle': this.feel.toggle,
          'button--on': this.isOn && this.isToggle,
          'button--off': this.isOff && this.isToggle,
          'button--disabled': this.isDisabled,
          'button--hover': this.hover,
          'button--active': this.active
        },
        content: {
          'button__content': true
        },
        start: {
          'button__start': true
        },
        end: {
          'button__end': true
        },
        input: {
          'button__input': true
        }
      }
    },
    isDisabled() {
      return this.feel.disabled;
    },
    isToggle() {
      return this.feel.toggle;
    },
    isSubmit() {
      return false;
    },
    isOn() {
      return this.on;
    },
    isOff() {
      return !this.isOn;
    },
    hasStart() {
      return this.start;
    },
    hasEnd() {
      return this.end;
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
          isToggle: this.isToggle,
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
