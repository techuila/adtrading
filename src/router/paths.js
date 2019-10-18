/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    view: 'Dashboard'
  },
  {
    path: '/stock-in',
    name: 'Sales Order',
    view: 'StockIn'
  },
  {
    path: '/stock-out',
    name: 'Purchase Order',
    view: 'StockOut'
  },
  {
    path: '/reports',
    view: 'Reports'
  },
  {
    path: '/users',
    view: 'Users'
  },
  {
    path: '/transactions',
    view: 'Transactions'
  },
  {
    path: '/settings',
    view: 'Settings'
  },
  {
    path: '/item-list',
    view: 'ItemList'
  },
  {
    path: '/',
    name: 'Login',
    view: 'Login'
  }
]
