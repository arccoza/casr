// app.vue
<style>
  .switch {

  }
  .switch__inner {
    display: inline-block;
    vertical-align: middle;
  }
  .switch__grip {
    position: relative;
    /*left: -0.8em;
    width: 1em;
    height: 1em;
    margin-left: 0.8em;*/
    display: block;
    border-radius: inherit;
  }
  .switch__input {
    display: none;
  }
</style>

<template>
  <button :class="classes.container">
    <label :class="classes.inner">
      <i :class="classes.grip"></i>
      <input :class="classes.input" @change="change" :name="name" :value="value" type="checkbox" :checked="isOn">
    </label>
  </button>
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
          'switch': true,
          ['switch--' + this.type]: true,
          'switch--on': this.isOn,
          'switch--off': this.isOff
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
    isOn() {
      return this.state == 'on' ? true : false;
    },
    isOff() {
      return !this.isOn;
    }
  },
  methods: {
    toggle() {
      this.state = this.isOn ? 'off' : 'on';
    },
    change(ev) {
      this.state = ev.target.checked ? 'on' : 'off';
      this.$dispatch('state-change', {
        eventType: 'state-change',
        eventValue: this.state,
        target: this,
        name: this.name,
        value: this.value
      });
    }
  }
}
</script>
