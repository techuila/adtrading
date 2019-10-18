import { set, toggle } from '@/utils/vuex'

export default {
  setDrawer: (state, payload) => {
    localStorage.setItem('drawer', payload)
    set('drawer')(state, payload)
  },
  setImage: set('image'),
  setColor: set('color'),
  setSnackbar: set('snackbar'),
  toggleDrawer: toggle('drawer'),
}
