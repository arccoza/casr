// button.vue
<style>
  .field {
    /*display: inline-block;*/
    vertical-align: middle;
    text-align: center;
  }
  .field__input {
  }
</style>

<template>
  <label :class="classes.container">
    <span :class="classes.inner">
      <span :class="classes.hint">hint</span>
      <input :class="classes.input" @change="change" @focus="focusInOut" @blur="focusInOut" :name="name" :value="value" type="text"></input>
      <span :class="classes.messageStart"></span>
      <span :class="classes.messageEnd"></span>
    </span>
  </label>
</template>

<script>
import Lie from 'lie';


export default {
  data() {
    return {
      hover: false,
      active: false,
      focus: false,
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
    look: {
      type: null,
      default() {
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
          'field': true,
          'field--normal': this.feel.normal,
          'field--normal': this.feel.password,
          'field--positive': this.look.positive,
          'field--negative': this.look.negative,
          'field--empty': this.isEmpty,
          'field--disabled': this.isDisabled,
          'field--hover': this.hover,
          'field--active': this.active,
          'field--focus': this.focus
        },
        inner: {
          'field__inner': true
        },
        hint: {
          'field__hint': true
        },
        start: {
          'field__start': true
        },
        end: {
          'field__end': true
        },
        input: {
          'field__input': true
        },
        messageStart: {
          'field__msg-start': true
        },
        messageEnd: {
          'field__msg-end': true
        }
      }
    },
    isDisabled() {
      return this.feel.disabled;
    },
    isEmpty() {
      return this.empty;
    },
    isRequired() {
      return this.required;
    },
    hasStart() {
      return this.start;
    },
    hasEnd() {
      return this.end;
    }
  },
  methods: {
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
    },
    focusInOut(ev) {
      if(ev.type == "focus")
        this.focus = true;
      else
        this.focus = false;
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
      if(ev.pressDown && !this.isDisabled) {
        this.active = true;

        let end = new Lie((res, rej) => {
          this.$once('transitionEnd', ev => {
            res(ev);
          });
          this.$once('animationEnd', ev => {
            res(ev);
          });
        });
        let out = new Lie((res, rej) => {
          this.$once('hoverOut', ev => {
            res(ev);
          });
        });
        let up = new Lie((res, rej) => {
          this.$once('pressUp', ev => {
            res(ev);
          });
        });
        let start = new Lie((res, rej) => {
          this.$once('animationStart', ev => {
            res(ev);
          });
          setTimeout(() => {
            rej();
          }, 0);
        });

        start.then(ok => {
          return Lie.all([end, up]);
        }).catch(err => {
          return up;
        })
        .then(ok => {
          this.active = false;
        });
      }
      else if(ev.pressUp) {
        this.$dispatch('tap', {
          eventType: 'tap',
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

        if(this.isToggle)
            this.toggle();
      }
    }
  },
  mixins: require('./mixins.js')
}
</script>
