module.exports = [
  {
    ready() {
      this.$el.addEventListener('mouseenter', ev => (ev.hoverIn = true, this.$emit('hover', ev)));
      this.$el.addEventListener('mouseenter', ev => (ev.hoverIn = true, this.$emit('hoverIn', ev)));
      this.$el.addEventListener('mouseleave', ev => (ev.hoverOut = true, this.$emit('hover', ev)));
      this.$el.addEventListener('mouseleave', ev => (ev.hoverOut = true, this.$emit('hoverOut', ev)));

      this.$el.addEventListener('mouseup', ev => (ev.pressUp = true, this.$emit('press', ev)));
      this.$el.addEventListener('mouseup', ev => (ev.pressUp = true, this.$emit('pressUp', ev)));
      this.$el.addEventListener('mousedown', ev => (ev.pressDown = true, this.$emit('press', ev)));
      this.$el.addEventListener('mousedown', ev => (ev.pressDown = true, this.$emit('pressDown', ev)));

      for(let event of ['transitionstart', 'webkitTransitionStart', 'oTransitionStart', 'MSTransitionStart']) {
        this.$el.addEventListener(event, ev => (ev.transitionStart = true, this.$emit('transition', ev)), false);
        this.$el.addEventListener(event, ev => (ev.transitionStart = true, this.$emit('transitionStart', ev)), false);
      }
      for(let event of ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd']) {
        this.$el.addEventListener(event, ev => (ev.transitionEnd = true, this.$emit('transition', ev)), false);
        this.$el.addEventListener(event, ev => (ev.transitionEnd = true, this.$emit('transitionEnd', ev)), false);
      }

      for(let event of ['animationstart', 'webkitAnimationStart', 'oAnimationStart', 'MSAnimationStart']) {
        this.$el.addEventListener(event, ev => (ev.animationStart = true, this.$emit('animation', ev)), false);
        this.$el.addEventListener(event, ev => (ev.animationStart = true, this.$emit('animationStart', ev)), false);
      }
      for(let event of ['animationiteration', 'webkitAnimationIteration', 'oAnimationIteration', 'MSAnimationIteration']) {
        this.$el.addEventListener(event, ev => (ev.animationStep = true, this.$emit('animation', ev)), false);
        this.$el.addEventListener(event, ev => (ev.animationStep = true, this.$emit('animationStep', ev)), false);
      }
      for(let event of ['animationend', 'webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd']) {
        this.$el.addEventListener(event, ev => (ev.animationEnd = true, this.$emit('animation', ev)), false);
        this.$el.addEventListener(event, ev => (ev.animationEnd = true, this.$emit('animationEnd', ev)), false);
      }

    }
  }
]
