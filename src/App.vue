<template>
  <div>
      <transition name="page" mode="out-in">
        <router-view></router-view>
      </transition>
  </div>
</template>

<script>
import 'vuetify/dist/vuetify.min.css'
export default {
  name: 'app',
  data () {
    return {
      Order: []
    }
  }
}
</script>

<style>
/*.page-enter-active, .page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.page-enter, .page-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}*/
</style>
