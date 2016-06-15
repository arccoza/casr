// button.vue
<style>

</style>

<template>
  <svg :class="classes.container">
    <defs>
      <circle id="ribbon-circle" cx="50%" cy="50%" r="50%" fill="none" clip-path="url(#ribbon-circle-clip)" />
      <clipPath id="ribbon-circle-clip">
        <use xlink:href="#ribbon-circle" />
      </clipPath>
    </defs>

    <use class="ribbon__circle" xlink:href="#ribbon-circle" x="0" y="0" />
  </svg>
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
          'ribbon': true,
          'ribbon--normal': this.feel.normal,
          'ribbon--positive': this.look.positive,
          'ribbon--negative': this.look.negative,
          'ribbon--line': this.look.line,
          'ribbon--circle': this.look.circle,
          'ribbon--on': this.isOn,
          'ribbon--off': this.isOff,
          'ribbon--disabled': this.isDisabled,
          'ribbon--hover': this.hover,
          'ribbon--active': this.active
        },
        content: {
          'ribbon__content': true
        },
        start: {
          'ribbon__start': true
        },
        end: {
          'ribbon__end': true
        },
        input: {
          'ribbon__input': true
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
    }
  },
  mixins: require('./mixins.js')
}
</script>
