module.exports = [
  {
      ready() {
      this.$el.addEventListener('mouseenter', ev => (ev.hoverIn = true, this.$emit('hover', ev)));
      this.$el.addEventListener('mouseleave', ev => (ev.hoverOut = true, this.$emit('hover', ev)));

      this.$el.addEventListener('mouseup', ev => (ev.pressUp = true, this.$emit('press', ev)));
      this.$el.addEventListener('mousedown', ev => (ev.pressDown = true, this.$emit('press', ev)));

      this.$el.addEventListener('transitionstart', ev => (ev.transitionStart = true, this.$emit('transition', ev)));
      this.$el.addEventListener('transitionend', ev => (ev.transitionEnd = true, this.$emit('transition', ev)));

      this.$el.addEventListener('animationstart', ev => (ev.animationStart = true, this.$emit('animation', ev)));
      this.$el.addEventListener('animationiteration', ev => (ev.animationStep = true, this.$emit('animation', ev)));
      this.$el.addEventListener('animationend', ev => (ev.animationEnd = true, this.$emit('animation', ev)));
    }
  }
]
