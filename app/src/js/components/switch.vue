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
    <input :class="classes.input" @change="change" :name="name" :value="value" type="checkbox" :checked="isOn">
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
    kind: {
      type: String,
      default() {
        return 'positive';
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
          ['switch--' + this.kind]: true,
          'switch--on': this.isOn,
          'switch--off': this.isOff
          // TODO: Disabled state.
          // 'switch--disabled': this.isDisabled
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
        eventValue: { on: this.isOn, off: this.isOff },
        target: this,
        name: this.name,
        value: this.value
      });
    }
  }
}
</script>
