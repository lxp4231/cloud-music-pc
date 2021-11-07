<template>
  <div id="app">
    <top />
    <index />
  </div>
</template>

<script>
import top from './components/Top.vue'
import index from './components/Index.vue'
export default {
  name: 'app',
  components: {
    top,
    index,
  },
  created() {
    // 空格暂停
    window.addEventListener('keyup', event => {
      // 32 空格
      if (event.ctrlKey) {
        if (event.keyCode == 32 || event.code == 'Space') {
          this.$Bus.$emit('toggle')
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }
    })
  },
  mounted() {
    this.$notify({
      title: 'Ctrl + 空格 可暂停音乐',
      type: 'success',
      offset:90
    })
  },
}
</script>

<style >
</style>
