import router from '../router'
import { async } from 'q';

function errorMessage (error, commit, login) {
  if (error.response.status === 400 && login === false) 
    commit('app/setSnackbar', { show: true, type: 'error', text: error.response.data.msg }, { root: true })
  
  if (error.response.status !== 400) 
    commit('app/setSnackbar', { show: true, type: 'error', text: `Server Error [${error.response.status}]` }, { root: true })

  throw error.response.data
}

export default {
  authenticate: async ({ commit }, payload) => {
    try {  
      const { data } = await axios.post('auth/login', payload)
      localStorage.setItem('token', data.token)
      router.push('/dashboard')

      commit('userAuthenticated', data.user, { root: true })
      commit('app/setSnackbar', { show: true, type: 'success', text: 'Login Successful!' }, { root: true })
      
    } catch (error) {
      errorMessage(error, commit, true)
        
      throw error.response.data;
    }
  },
  
  RECEIVE_STOCKIN: async({ commit, rootState }, payload) => {
    try { 
      let items = rootState.transactions
      const { data } = await axios.put('api/transaction', {...payload, status: payload.temp_status === 'orange'? 'Received w/ Pending Balance' : 'Received' })

      items = items.map(e => e.id === payload.id? {...data}: {...e})

      commit('setTransactions', items)
      commit('app/setSnackbar', { show: true, type: 'success', text: `Order Successfully Updated!`}, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  CREATE_STOCKIN: async({ commit, rootState }, payload) => {
    try { 
      let items = rootState.transactions
      const { data } = await axios.post('api/transaction', {...payload})
      
      if (payload.id !== -1)
        items = items.map(e => e.id === payload.id? {...data}: {...e})
      else 
        items.unshift(data)
      
      if (payload.status === 'Fully Paid') {
        const item_list = await axios.get('api/item')
        commit('setItems', item_list.data)
      }

      commit('setTransactions', items)
      commit('app/setSnackbar', { show: true, type: 'success', text: `${!payload.payment? payload.type === 'OUT'? 'Order': 'Transaction' : 'Payment'} Successfully ${!payload.payment ?(payload.id !== -1)? 'Updated!': 'Added!': 'Received!'}`}, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  DELETE_STOCKIN: async({ commit, rootState }, payload) => {
    try {
      let items = rootState.transactions
      await axios.delete(`api/transaction/${payload.id}`)

      commit('setTransactions', items.filter(e => e.id !== payload.id))
      commit('app/setSnackbar', { show: true, type: 'success', text: `Order Successfully Deleted!` }, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },
  
  FETCH_STOCKIN: async({ commit }, payload) => {
    try {
      const items = await axios.get('api/item')
      const category = await axios.get('api/category')
      const unitmeasure = await axios.get('api/unitmeasure')
      const supcust = await axios.get(`api/supcust/${payload.user_type}`)
      const transactions = await axios.get(`api/transaction/${payload.type}`)
      
      commit('setItems', items.data)
      commit('setCategories', category.data)
      commit('setUnitMeasures', unitmeasure.data)
      commit('setTransactions', transactions.data)
      commit('setSupCust', supcust.data.map(e => ({id: e.id, name: e.firstName + ' ' + e.lastName})))
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  CREATE_SUPCUST: async({ commit, rootState }, payload) => {
    try { 
      let items = rootState.supcust
      const { data } = await axios.post('api/supcust', payload)

      if (payload.id !== -1)
        items = items.map(e => e.id === payload.id? {...data}: {...e})
      else 
        items.unshift(data)
      
      commit('setSupCust', items)
      commit('app/setSnackbar', { show: true, type: 'success', text: `${payload.type} Successfully ${(payload.id !== -1)? 'Updated!': 'Added!'}`}, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  DELETE_SUPCUST: async({ commit, rootState }, payload) => {
    try {
      let items = rootState.supcust
      await axios.delete(`api/supcust/${payload.id}`)

      commit('setSupCust', items.filter(e => e.id !== payload.id))
      commit('app/setSnackbar', { show: true, type: 'success', text: `${payload.type} Successfully Deleted!` }, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  FETCH_SUPCUST: async({ commit }) => {
    try {
      const items = await axios.get('api/supcust/All')

      commit('setSupCust', items.data)
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  CREATE_CAT_UM: async({ commit, rootState }, payload) => {
    try { 
      let cat_um = rootState[payload.type]
      const { data } = await axios.post(`api/${payload.type === 'unitMeasures'? 'unitmeasure': 'category'}`, payload)

      if (payload.id !== -1)
        cat_um = cat_um.map(e => e.id === payload.id? {...data}: {...e})
      else 
        cat_um.unshift(data)
      
      commit((payload.type === 'unitMeasures'? 'setUnitMeasures': 'setCategories'), cat_um)
      commit('app/setSnackbar', { show: true, type: 'success', text: `${payload.type === 'unitMeasures'? 'Unit Measure': 'Category'} Successfully ${(payload.id !== -1)? 'Updated!': 'Added!'}`}, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  DELETE_CAT_UM: async({ commit, rootState }, payload) => {
    try {
      let cat_um = rootState[payload.type]
      await axios.delete(`api/${payload.type === 'unitMeasures'? 'unitmeasure': 'category'}/${payload.id}`)

      commit((payload.type === 'unitMeasures')? 'setUnitMeasures': 'setCategories', cat_um.filter(e => e.id !== payload.id))
      commit('app/setSnackbar', { show: true, type: 'success', text: `${payload.type === 'unitMeasures'? 'Unit Measure': 'Category'} Successfully Deleted!` }, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  FETCH_CAT_UM: async({ commit }) => {
    try {
      const um = await axios.get('api/unitmeasure')
      const category = await axios.get('api/category')

      commit('setUnitMeasures', um.data)
      commit('setCategories', category.data)
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  CREATE_ITEM: async({ commit, rootState }, payload) => {
    try { 
      let items = rootState.items
      payload.user_id = rootState.user.id
      const { data } = await axios.post('api/item', payload)

      if (!!!data.qtyIn) {
        data.qtyIn = 0
        data.qtyOut = 0
      }

      if (payload.id !== -1)
        items = items.map(e => e.id === payload.id? {...data}: {...e})
      else 
        items.unshift(data)
      
      commit('setItems', items)
      commit('app/setSnackbar', { show: true, type: 'success', text: `Item Successfully ${(payload.id !== -1)? 'Updated!': 'Added!'}` }, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  DELETE_ITEM: async({ commit, rootState }, payload) => {
    try {
      console.log(payload)
      let items = rootState.items
      await axios.delete(`api/item/${payload.id}`)

      commit('setItems', items.filter(e => e.id !== payload.id))
      commit('app/setSnackbar', { show: true, type: 'success', text: 'Item Successfully Deleted!' }, { root: true })  
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  FETCH_ITEMS: async({ commit }) => {
    try {
      const items = await axios.get('api/item')
      const category = await axios.get('api/category')
      const unitmeasure = await axios.get('api/unitmeasure')

      commit('setItems', items.data)
      commit('setCategories', category.data)
      commit('setUnitMeasures', unitmeasure.data)
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  CREATE_USER: async({ commit, rootState }, payload) => {
    try {
      let users = rootState.users
      const { data } = await axios.post('api/user', payload)

      users.unshift(data)
      commit('setUsers', users)
      commit('app/setSnackbar', { show: true, type: 'success', text: 'User Successfully Added!' }, { root: true })
    } catch (error) {
      errorMessage(error, commit, false)
    }
  },

  FETCH_USERS: async({ commit }) => {
    try {
      const { data } = await axios.get('api/user')
      commit('setUsers', data)
    } catch (error) {
      errorMessage(error, commit, false)     
    }
  },

  FETCH_USER: async({ commit }) => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // router.push('/dashboard')
        axios.defaults.headers.common['X-Auth-Token'] = token
  
        const { data } = await axios.get('auth/user')
        commit('userAuthenticated', data, { root: true })
      } catch (error) {
        localStorage.removeItem('token')
        router.push('/')
        throw error
      }
    } else {
      router.push('/')
    }
  }
}
