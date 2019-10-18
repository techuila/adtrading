import { set, toggle } from '@/utils/vuex'

export default {
  userAuthenticated: (state, payload) => {
    toggle('isLoggedIn')(state, payload)
    set('user')(state, payload)
  },
  setUsers: set('users'),
  setItems: set('items'),
  setCategories: set('categories'),
  setUnitMeasures: set('unitMeasures'),
  setTransactions: set('transactions'),
  setSupCust: set('supcust')
}
