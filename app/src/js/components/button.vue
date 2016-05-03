// app.vue
<style>
  .button {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
  }
  .button__input {
    display: none;
  }
</style>

<template>
    <button :class="classes.container" @webkitAnimationEnd="animEnd" @mouseup="pressDownUp" @mousedown="pressDownUp" @mouseenter="mouseEnterExit" @mouseleave="mouseEnterExit">
      <span :class="classes.start" v-if="hasStart">
        <glyph :type="glyph" :class="classes.startGlyph"></glyph>
        <slot name="start"></slot>
      </span>
      <span :class="classes.content">
        <slot></slot>
      </span>
      <span :class="classes.end" v-if="hasEnd">
        <glyph :type="glyph" :class="classes.endGlyph"></glyph>
        <slot name="end"></slot>
      </span>
      <input :class="classes.input" :name="name" :value="value" type="submit">
    </button>
</template>

<script>
export default {
  data() {
    return {
      _state: {
        on: false,
        off: false,
        disabled: false
      },
      hover: false,
      active: false
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
        return 'normal';
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
    },
    start: String,
    end: String
  },
  computed: {
    classes() {
      return {
        container: {
          'button': true,
          ['button--' + this.type]: true,
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
    isOn() {
      return this.state == 'on' ? true : false;
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
    },
    mouseEnterExit(ev) {
      // console.log(ev);
      if(ev.target == ev.toElement) {
        this.hover = true;
      }
      else if(ev.target == ev.fromElement) {
        this.hover = false;
      }
    },
    pressDownUp(ev) {
      // console.log(ev);
      animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' };
      if(ev.type == 'mousedown') {
        this.active = true;
      }
      else if(ev.type == 'mouseup') {
        // this.active = false;
        // console.log(this);
        // this.$on('click', function(ev) {
        //   console.log(ev);
        // });
        let a = ev => {
          this.$el.removeEventListener('animationend', a);
          console.log(ev);
          this.active = false;
        }

        this.$el.addEventListener('animationend', a);
      }
    },
    animEnd(ev) {
      console.log(ev);
    }
  },
  // ready() {
  //   this.$on('mouseenter', this.mouseEnterExit);
  //   this.$on('mouseleave', this.mouseEnterExit);
  // },
  components: {
    glyph: require('./glyph.vue')
  }
}
</script>
