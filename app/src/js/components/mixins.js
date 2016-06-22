import Lie from 'lie';


module.exports = [
  {
    ready() {
      this.$el.addEventListener('mouseenter', ev => (ev.hoverIn = true, this.$emit('hover', ev)));
      this.$el.addEventListener('mouseenter', ev => (ev.hoverIn = true, this.$emit('hoverIn', ev), this.$emit('hover-in', ev)));
      this.$el.addEventListener('mouseleave', ev => (ev.hoverOut = true, this.$emit('hover', ev)));
      this.$el.addEventListener('mouseleave', ev => (ev.hoverOut = true, this.$emit('hoverOut', ev), this.$emit('hover-out', ev)));

      this.$el.addEventListener('mouseup', ev => (ev.pressUp = true, this.$emit('press', ev)));
      this.$el.addEventListener('mouseup', ev => (ev.pressUp = true, this.$emit('pressUp', ev), this.$emit('press-up', ev)));
      this.$el.addEventListener('mousedown', ev => (ev.pressDown = true, this.$emit('press', ev)));
      this.$el.addEventListener('mousedown', ev => (ev.pressDown = true, this.$emit('pressDown', ev), this.$emit('press-down', ev)));

      for(let event of ['transitionstart', 'webkitTransitionStart', 'oTransitionStart', 'MSTransitionStart']) {
        this.$el.addEventListener(event, ev => (ev.transitionStart = true, this.$emit('transition', ev)), false);
        this.$el.addEventListener(event, ev => (ev.transitionStart = true, this.$emit('transitionStart', ev), this.$emit('transition-start', ev)), false);
      }
      for(let event of ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd']) {
        this.$el.addEventListener(event, ev => (ev.transitionEnd = true, this.$emit('transition', ev)), false);
        this.$el.addEventListener(event, ev => (ev.transitionEnd = true, this.$emit('transitionEnd', ev), this.$emit('transition-end', ev)), false);
      }

      for(let event of ['animationstart', 'webkitAnimationStart', 'oAnimationStart', 'MSAnimationStart']) {
        this.$el.addEventListener(event, ev => (ev.animationStart = true, this.$emit('animation', ev)), false);
        this.$el.addEventListener(event, ev => (ev.animationStart = true, this.$emit('animationStart', ev), this.$emit('animation-start', ev)), false);
      }
      for(let event of ['animationiteration', 'webkitAnimationIteration', 'oAnimationIteration', 'MSAnimationIteration']) {
        this.$el.addEventListener(event, ev => (ev.animationStep = true, this.$emit('animation', ev)), false);
        this.$el.addEventListener(event, ev => (ev.animationStep = true, this.$emit('animationStep', ev), this.$emit('animation-step', ev)), false);
      }
      for(let event of ['animationend', 'webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd']) {
        this.$el.addEventListener(event, ev => (ev.animationEnd = true, this.$emit('animation', ev)), false);
        this.$el.addEventListener(event, ev => (ev.animationEnd = true, this.$emit('animationEnd', ev), this.$emit('animation-end', ev)), false);
      }

    },
    data() {
      return {
        hover: false,
        active: false,
        focus: false,
        disabled: false
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
  }
]
