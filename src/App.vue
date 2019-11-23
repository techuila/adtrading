<template>
  <v-app>
    <!-- Window Controls -->
    <core-windowControls /> 

    <!-- Login Component -->
    <div style="height: 100%; padding-top: 32px;position: relative" v-if="!isLoggedIn">

      <core-view />

    </div>

    <!-- IMS Component -->
    <div id="con" style="height: 100%; padding-top: 32px;position: relative" v-else>

      <core-toolbar />

      <core-drawer />

      <core-view />
    </div>

    <helper-snackbar />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  created () {
    this.$store.dispatch('FETCH_USER')
  },
  computed: {
    ...mapState(['isLoggedIn'])
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';

html{
  overflow-y: hidden;
  height: 100vh;
}

.theme--light.v-btn {
  color: rgba(0,0,0,.87) !important;
}

.application--wrap {
  // display: flex;
  // flex-direction: column;
  // padding-top: 32px;
  height: 100vh;
}

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}

.elevation {
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important;
}

.active-filter {
  color: #FFF;
  background: linear-gradient(60deg, #26c6da, #00acc1) !important;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12)!important;
}

#user_payment{
  text-align: right;
}

.chippy .v-chip__content:hover {
  cursor: pointer !important;
}

.chippy {
  border-radius: 5px !important;
}

.chippys {
  /* cursor: pointer !important; */
  border-radius: 5px !important;
}

.chipsy {
  border: none;
  height: 35px !important;
  padding: 6px 12px;
  background: linear-gradient(60deg, #26c6da, #00acc1) !important;
}

#group_payment .v-radio {
  margin: 0 auto 8px auto;
}

#group_payment .v-input__control {
  width: 100%;
}
</style>
