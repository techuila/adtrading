<template>
  <v-navigation-drawer
    id="app-drawer"
    :mini-variant="!inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img
      :src="image"
      :gradient="sidebarOverlayGradiant"
      height="100%"
    >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile :style="{marginLeft: marginLeft.marginLeft}" avatar>
          <v-list-tile-avatar
            color="white"
          >
            <!-- <span id="logo-avatar">AD</span> -->
            <v-img :src="photo"  alt=""></v-img>
          </v-list-tile-avatar>
          <v-list-tile-title class="title" :style="{visibility: marginLeft.visibility}">
            Hi, {{ user.firstName + ' ' + user.lastName }}!
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          v-if="responsive"
        >
          <v-text-field
            class="purple-input search-input"
            label="Search..."
            color="purple"
          />
        </v-list-tile>
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          :active-class="color"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title
            v-text="link.text"
          />
        </v-list-tile>
        <v-list-tile
          :active-class="color"
          class="v-list-item v-list__tile--buy"
          to="/"
          @click="logout"
        >
          <v-list-tile-action>
              <v-icon>mdi-power</v-icon>
          </v-list-tile-action>
          <v-list-tile-title
              v-text="'Logout'"
          />
        </v-list-tile>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    logo: './img/adtrading.png',
    photo: './img/matthew.png',
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-gauge',
        text: 'Dashboard'
      },
      {
        to: '/item-list',
        icon: 'mdi-format-list-checkbox',
        text: 'Item List'
      },
      {
        to: '/stock-in',
        icon: 'mdi-package-variant',
        text: 'Sales Order'
      },
      {
        to: '/stock-out',
        icon: 'mdi-truck-delivery',
        text: 'Purchase Order'
      },
      {
        to: '/reports',
        icon: 'mdi-file-chart',
        text: 'Reports'
      },
      {
        to: '/users',
        icon: 'mdi-account-group',
        text: 'Users'
      },
      // {
      //   to: '/transactions',
      //   icon: 'mdi-file-document-box-multiple',
      //   text: 'Transaction History'
      // },
      {
        to: '/settings',
        icon: 'mdi-settings-outline',
        text: 'Settings'
      }
    ],
    responsive: false,
    marginLeft: {
      marginLeft: '-8px',
      visibility: 'visible'
    }
  }),
  watch: {
    '$store.state.app.drawer' (val) {
      if (!val) {
        this.marginLeft.marginLeft = 0
        this.marginLeft.visibility = 'hidden'
      } else {
        this.marginLeft.marginLeft = '-8px'
        this.marginLeft.visibility = 'visible'
      }
    }
  },
  computed: {
    ...mapState('app', ['image', 'color']),
    ...mapState(['user']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    },
    sidebarOverlayGradiant () {
      return `${this.$store.state.app.sidebarBackgroundColor}, ${this.$store.state.app.sidebarBackgroundColor}`
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)

    if (!this.$store.state.app.drawer) {
      this.marginLeft.marginLeft = 0
      this.marginLeft.visibility = 'hidden'
    } else {
      this.marginLeft.marginLeft = '-8px'
      this.marginLeft.visibility = 'visible'
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    ...mapMutations(['userAuthenticated']),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },

    logout () { 
      this.userAuthenticated({})
      localStorage.removeItem('token')
      localStorage.removeItem('drawer')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
  .v-list.layout.fill-height.column.theme--dark {
    cursor: initial;
  }
  #app-drawer {
    margin-top: 32px !important;
    
    #logo-avatar {
      color: red;
      font-weight: bold;
      margin-left: 1.5px;
    }

    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 50px;
      }
    }

    .v-image__image--contain {
      top: 4px;
      height: 80%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }

    div.v-responsive.v-image > div.v-responsive__content {
      overflow-y: auto;
    }
  }
</style>
