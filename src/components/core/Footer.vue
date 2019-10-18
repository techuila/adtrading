<template>
  <v-footer
    id="core-footer"
    height="82"
  >
    <v-spacer/>
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <a
        href="https://www.codegit.xyz/"
        target="_blank">CodeGit</a>, IT Solutions 
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: 'CodeGit', Link: 'https://www.codegit.xyz' },
    ]
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
