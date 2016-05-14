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
      <span :class="classes.hint" v-if="this.feel.hint || this.feel.floatHint"><slot name="hint"></slot></span>
      <input :class="classes.input" @change="change" @keyup="change" @focus="focusInOut" @blur="focusInOut" :name="name" :value="value" :type="inputType" :disabled="isDisabled"></input>
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
        }
        else {
          Object.assign(obj, val);
        }

        obj.negative == obj.positive ? false : obj.negative;
        obj.primary == obj.positive || obj.negative ? false : true;

        return obj;
      }
    },
    feel: {
      type: null,
      default() {
        return {
          normal: true,
          password: false,
          hint: false,
          floatHint: false,
          disabled: false
        };
      },
      coerce(val) {
        let obj = {
          normal: true,
          password: false,
          hint: false,
          floatHint: false,
          disabled: false
        };

        if(typeof val == 'string') {
          let arr = val.split(/[\s,]+/);

          for(let i = 0, v; v = arr[i++];) {
            obj[v] = true;
          }
        }
        else {
          Object.assign(obj, val);
        }

        obj.normal = !obj.password;
        obj.hint = obj.hint && !obj.floatHint;

        return obj;
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
          'field--password': this.feel.password,
          'field--positive': this.look.positive,
          'field--negative': this.look.negative,
          'field--filled': this.isFilled,
          'field--empty': this.isEmpty,
          'field--hint': this.feel.hint,
          'field--float-hint': this.feel.floatHint,
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
    isFilled() {
      return this.value && this.value.length;
    },
    isEmpty() {
      return !this.isFilled;
    },
    isRequired() {
      return this.required;
    },
    hasStart() {
      return this.start;
    },
    hasEnd() {
      return this.end;
    },
    inputType() {
      return this.feel.password ? 'password' : 'text';
    }
  },
  methods: {
    change(ev) {
      this.$dispatch('change', {
        eventType: 'change',
        eventValue: {
          isDisabled: this.isDisabled
        },
        target: this,
        name: this.name,
        value: this.value
      });

      this.value = ev.target.value;
      console.log(ev, this.value);
    },
    focusInOut(ev) {
      if(ev.type == "focus")
        this.focus = true;
      else
        this.focus = false;
    }
  },
  mixins: require('./mixins.js')
}
</script>
