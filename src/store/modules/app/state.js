export default {
  drawer: localStorage.getItem('drawer') !== null? localStorage.getItem('drawer') === 'true'? true: false : true,
  color: 'info',
  image: require('../../../img/sidebar-2.32103624.jpg'),
  sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)',
  snackbar: {
    show: false,
    type: 'info',
    text: 'Hello, I\'m a snackbar'
  }
}
