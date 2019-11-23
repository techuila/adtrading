<template>
  <v-content>
      <div id="core-view">
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </div>
  </v-content>
</template>

<script>
export default {
  metaInfo () {
    return {
      title: 'AD Trading'
    }
  }
}
</script>

<style>
#core-view {
  /* padding-bottom: 100px; */
  /* height: 100%;  */
}

.c-scroll-view__content {
  /* height: 100vh !important; */
}

.c-scroll-view, .v-content__wrap, #core-view, .v-content {
  height: 100%;
  display: block;
}

#con .v-content {
  padding: 60px 0px 0px 260px !important;
}

.c-scroll-view {
  /* height: 100vh; */
}
</style>
