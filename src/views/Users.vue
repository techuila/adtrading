<template>
  <smooth-scrollbar :options='{alwaysShowTracks: true}'>
    <v-container
      fill-height
      fluid
      style="flex-wrap: wrap;"
    >
      <v-flex xs12>
        <material-card
          color="info"
          title="Users"
          text="List of users on the system"
        >
          <v-dialog v-model="dialog" max-width="700px">
              <v-btn slot="activator" color="info" dark round class="mb-2">New User</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-form ref="form" name="user-form" @submit.prevent="save" v-model="validation.valid" lazy-validation value="validation.valid">
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6>
                        <v-text-field color="info" name="firstName" :rules="validation.firstnameRules" :error-messages="validation.error.firstName" v-model="editedItem.firstName" label="First Name" required></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field color="info" name="lastName" :rules="validation.lastnameRules" :error-messages="validation.error.lastName" v-model="editedItem.lastName" label="Last Name" required></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12>
                        <v-text-field color="info" name="username" :rules="validation.usernameRules" :error-messages="validation.error.username" v-model="editedItem.username" label="Username" required></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12>
                        <v-text-field color="info" name="email" :rules="validation.emailRules" :error-messages="validation.error.email" v-model="editedItem.email" label="Email" required></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12>
                        <v-select
                          :items="['Administrator', 'User']"
                          label="User Type"
                          v-model="editedItem.userType"
                          :rules="[v => !!v || 'User Type is required']"
                          required
                        />
                      </v-flex>
                      <v-flex xs6 sm6>
                        <v-text-field type="password" name="password" :rules="validation.passwordRules" :error-messages="validation.error.password" color="info" v-model="editedItem.password" label="Password" required></v-text-field>
                      </v-flex>
                      <v-flex xs6 sm6>
                        <v-text-field  type="password" name="confirm_password" color="info" v-model="editedItem.confirm_password" label="Confirm Password" required></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" type="submit" flat>Save</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

          <!-- TABLE  -->

          <v-data-table
            :headers="headers"
            :items="users"
          >
            <template v-slot:items="props">
              <td>{{ ++props.index }}</td>
              <td>{{ props.item.firstName + ' ' + props.item.lastName }}</td>
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.username }}</td>
              <td>{{ props.item.userType }}</td>
              <td class="justify-center layout px-0">
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(props.item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="deleteItem(props.item)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </template>
            <template v-slot:no-data>
              <v-alert :value="true" color="error" style="text-align: center;">
                <v-icon color="white">mdi-alert</v-icon> Sorry, there is no data found here :(
              </v-alert>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-container>
  </smooth-scrollbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ScrollView from '@blackbp/vue-smooth-scrollbar';

export default {
  components: {
    'smooth-scrollbar': ScrollView
  },
  data: () => ({
    validation: {
      valid: false,
      firstnameRules: [
        v => !!v || 'First Name is required',
      ],
      lastnameRules: [
        v => !!v || 'Last Name is required',
      ],
      emailRules: [
        v => !!v || 'Email is required',
      ],
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      passwordRules: [
        v => !!!v ? 'Password is required' : v.length >= 6 || 'Password should be at least 6 characters long'
      ],
      error: {
        username: '',
        password: ''
      }
    },
    dialog: false,
    headers: [
      { text: 'ID', value: 'index', align: 'left' },
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Email', value: 'email', align: 'left' },
      { text: 'Username', value: 'username', align: 'left' },
      { text: 'User Type', value: 'userType', align: 'left' },
      { text: 'Actions', value: 'name', sortable: false, align: 'center' }
    ],
    editedIndex: -1,
    editedItem: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      userType: 'User',
      confirm_password: ''
    },
    defaultItem: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      userType: 'User',
      confirm_password: ''
    },
    title: '',
  }),

  computed: {
    ...mapState(['users']),

    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    ...mapMutations('app', ['setSnackbar']),

    initialize () {
      this.$store.dispatch('FETCH_USERS')
    },

    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.users.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.users.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.$refs.form.resetValidation()
      }, 300)
    },

    save () {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          // this.desserts.push(this.editedItem)
          if (this.editedItem.password === this.editedItem.confirm_password) {
            this.$store.dispatch('CREATE_USER', this.editedItem).then(res => {
              this.close()
            })
          } else {
            this.setSnackbar({ show: true, type: 'error', text: `Password doesn't match!`})
          }
        }
      }
    }
  },
}
</script>
