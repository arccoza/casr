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
      hover: false,
      active: false,
      disabled: false
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
    kind: {
      type: null,
      default() {
        return {
          normal: true,
          positive: false,
          negative: false,
          toggle: false,
          submit: false
        };
      },
      coerce(val) {
        let obj = {
          normal: true,
          positive: false,
          negative: false,
          toggle: false,
          submit: false
        };

        if(typeof val == 'string') {
          let arr = val.split(/[\s,]+/);

          for(let i = 0, v; v = arr[i++];) {
            obj[v] = true;
          }

          obj.negative == obj.positive ? false : obj.negative;
          obj.normal == obj.positive || obj.negative ? false : true;

          return obj;
        }
      }
    },
    active: {
      default() {
        return false;
      },
      validator(val) {
        return val === true || val === false || val == 'true' || val == 'false';
      },
      coerce(val) {
        if(val == 'true')
          return true;
        else if(val == 'false')
          return false;
        else
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
          'button--positive': this.kind.positive,
          'button--negative': this.kind.negative,
          'button--toggle': this.kind.toggle,
          'button--on': this.isOn,
          'button--off': this.isOff,
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
        startGlyph: {
          'button__glyph': true,
          'button__start-glyph': true
        },
        endGlyph: {
          'button__glyph': true,
          'button__end-glyph': true
        },
        input: {
          'button__input': true
        }
      }
    },
    isToggle() {
      return false;
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
        eventValue: { on: this.isOn, off: this.isOff },
        target: this,
        name: this.name,
        value: this.value
      });
    }
  },
  events: {
    hover(ev) {
      if(ev.hoverIn) {
        this.hover = true;
      }
      else if(ev.hoverOut) {
        this.hover = false;
      }
    },
    press(ev) {
      if(ev.pressDown) {
        this.active = true;

        let end = new Lie((res, rej) => {
          this.$once('transition', ev => {
            if(ev.transitionEnd)
              res(ev);
          });
          this.$once('animation', ev => {
            if(ev.animationEnd)
              res(ev);
          });
        });
        let out = new Lie((res, rej) => {
          this.$once('hover', ev => {
            if(ev.hoverOut)
              res(ev);
          });
        });
        let up = new Lie((res, rej) => {
          this.$once('press', ev => {
            if(ev.pressUp)
              res(ev);
          });
        });

        Lie.race([Lie.all([end, up]), out]).then(res => {
          this.active = false;
        });
      }
      else if(ev.pressUp) {
        this.$dispatch('tap', {
          eventType: 'tap',
          eventValue: { on: this.isOn, off: this.isOff, isToggle: this.isToggle },
          target: this,
          name: this.name,
          value: this.value
        });
      }
    },
    transition(ev) {
      // if(ev.transitionEnd) {
      //   this.active = false;
      // }
    },
    animation(ev) {
      // if(ev.animationEnd) {
      //   this.active = false;
      // }
    }
  },
  mixins: require('./mixins.js')
}
</script>
