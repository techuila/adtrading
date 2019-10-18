<template>
  <smooth-scrollbar :options='{alwaysShowTracks: true}'>
    <v-container
      fluid
      grid-list-xl
      fill-height>
      <v-layout
        justify-center
        align-center
      >
        <v-flex xs12>
          <material-card
            class="card-tabs"
            color="info">
            <v-flex
              slot="header"
            >
              <v-tabs
                v-model="tabs"
                color="transparent"
                slider-color="white"
              >
                <v-tab class="mr-3">
                  <v-icon class="mr-2">mdi-account-supervisor-circle</v-icon>
                  Suppliers and Customers
                </v-tab>
                <v-tab class="mr-3">
                  <v-icon class="mr-2">mdi-package-variant</v-icon>
                  Categories and Unit Measures
                </v-tab>
              </v-tabs>
            </v-flex>

            <v-tabs-items v-model="tabs">
              <v-tab-item key="1">
                <v-container
                  fluid
                  grid-list-xl
                  fill-height>
                  <v-layout>
                    <v-flex xs12 md6>
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
                                  <v-flex xs12 sm6 md6>
                                      <v-select
                                        :items="type"
                                        label="Type"
                                        v-model="editedItem.type"
                                        required
                                      ></v-select>
                                    </v-flex>
                                  <v-flex xs12 sm6 md6>
                                    <v-text-field name="company" color="info" v-model="editedItem.company" label="Company" required></v-text-field>
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
                    </v-flex>
                  
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>

                <!-- TABLE  -->
                <v-data-table
                  :search="search"
                  :headers="headers"
                  :items="supcust"
                >
                  <template v-slot:items="props">
                    <td>{{ ++props.index }}</td>
                    <td>{{ props.item.firstName + ' ' + props.item.lastName }}</td>
                    <td>{{ props.item.type }}</td>
                    <td>{{ props.item.company }}</td>
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
              </v-tab-item>

              <v-tab-item key="2">
                <v-container
                  fluid
                  grid-list-xl
                  fill-height>
                  <v-layout>
                    <v-container
                      fluid
                      grid-list-xl
                      fill-height 
                      style="margin-top: 0;">
                      <v-flex xs12 md12>
                        <v-layout row wrap>
                          <v-flex xs12 md12>
                            <h5>Categories</h5>
                            <hr><br />
                          </v-flex>

                          <v-flex xs6 md6>
                            <v-dialog v-model="dialog_cat" max-width="400px">
                              <v-btn slot="activator" color="info" dark round class="mb-2">New Category</v-btn>
                              <v-card>
                                <v-card-title>
                                  <span class="headline">New Category</span>
                                </v-card-title>
                                <v-form ref="cat_form" name="cat-form" @submit.prevent="save_cat_um(1)" v-model="validation.valid" lazy-validation value="validation.valid">
                                  <v-card-text>
                                    <v-container grid-list-md>
                                      <v-layout wrap>
                                        <v-flex xs12 sm12>
                                          <v-text-field color="info" name="descr" :rules="validation.descr" :error-messages="validation.error.descr" v-model="editedCatUm.descr" label="Description" required></v-text-field>
                                        </v-flex>
                                      </v-layout>
                                    </v-container>
                                  </v-card-text>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click="dialog_cat = false">Cancel</v-btn>
                                    <v-btn color="blue darken-1" type="submit" flat>Save</v-btn>
                                  </v-card-actions>
                                </v-form>
                              </v-card>
                            </v-dialog>
                          </v-flex>

                          <v-flex xs6 md6>
                            <v-text-field
                              v-model="search"
                              append-icon="mdi-magnify"
                              label="Search"
                              single-line
                              hide-details
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 md12>
                            <!-- TABLE  -->
                            <v-data-table
                              :search="search"
                              :headers="cat_um_headers"
                              :items="categories"
                            >
                              <template v-slot:items="props">
                                <td>{{ ++props.index }}</td>
                                <td>{{ props.item.descr }}</td>
                                <td class="justify-center layout px-0">
                                  <v-icon
                                    small
                                    class="mr-2"
                                    @click="editCatUm(props.item, 'categories')"
                                  >
                                    mdi-pencil
                                  </v-icon>
                                  <v-icon
                                    small
                                    @click="deleteCatUm(props.item, 'categories')"
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
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-container>
                    
                    <v-container
                      fluid
                      grid-list-xl
                      fill-height
                      style="margin-top: 0;">
                      <v-flex xs12 md12>
                        <v-layout row wrap>
                          <v-flex xs12 md12>
                            <h5>Unit Measure</h5>
                            <hr><br />
                          </v-flex>

                          <v-flex xs6 md6>
                            <v-dialog v-model="dialog_um" max-width="400px">
                              <v-btn slot="activator" color="info" dark round class="mb-2">New Unit Measure</v-btn>
                              <v-card>
                                <v-card-title>
                                  <span class="headline">New Unit Measure</span>
                                </v-card-title>
                                <v-form ref="um_form" name="um-form" @submit.prevent="save_cat_um(0)" v-model="validation.valid" lazy-validation value="validation.valid">
                                  <v-card-text>
                                    <v-container grid-list-md>
                                      <v-layout wrap>
                                        <v-flex xs12 sm12>
                                          <v-text-field color="info" name="descr" :rules="validation.descr" :error-messages="validation.error.descr" v-model="editedCatUm.descr" label="Description" required></v-text-field>
                                        </v-flex>
                                      </v-layout>
                                    </v-container>
                                  </v-card-text>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click="dialog_um = false">Cancel</v-btn>
                                    <v-btn color="blue darken-1" type="submit" flat>Save</v-btn>
                                  </v-card-actions>
                                </v-form>
                              </v-card>
                            </v-dialog>
                          </v-flex>

                          <v-flex xs6 md6>
                            <v-text-field
                              v-model="search"
                              append-icon="mdi-magnify"
                              label="Search"
                              single-line
                              hide-details
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12 md12>
                            <!-- TABLE  -->
                            <v-data-table
                              :search="search"
                              :headers="cat_um_headers"
                              :items="unitMeasures"
                            >
                              <template v-slot:items="props">
                                <td>{{ ++props.index }}</td>
                                <td>{{ props.item.descr }}</td>
                                <td class="justify-center layout px-0">
                                  <v-icon
                                    small
                                    class="mr-2"
                                    @click="editCatUm(props.item, 'unitMeasures')"
                                  >
                                    mdi-pencil
                                  </v-icon>
                                  <v-icon
                                    small
                                    @click="deleteCatUm(props.item, 'unitMeasures')"
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
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-container>
                  </v-layout>
                </v-container>
              </v-tab-item>
            </v-tabs-items>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </smooth-scrollbar>
</template>

<script>
import { mapState } from 'vuex';
import ScrollView from '@blackbp/vue-smooth-scrollbar';

export default {
  components: {
    'smooth-scrollbar': ScrollView
  },
  data: () => ({
    search: '',
    validation: {
      valid: false,
      firstnameRules: [
        v => !!v || 'First Name is required',
      ],
      lastnameRules: [
        v => !!v || 'Last Name is required',
      ],
      descr: [
        v => !!v || 'Description is required',
      ],
      error: {
        firstName: '',
        lastName: '',
        descr: '',
      }
    },
    dialog: false,
    dialog_cat: false,
    dialog_um: false,
    headers: [
      { text: 'ID', value: 'index', align: 'left' },
      { text: 'Name', value: 'name', align: 'left' },
      { text: 'Type', value: 'type', align: 'left' },
      { text: 'Company', value: 'company', align: 'left' },
      { text: 'Actions', value: 'name', sortable: false, align: 'center' }
    ],
    cat_um_headers: [
      { text: 'ID', value: 'index', align: 'left' },
      { text: 'Description', value: 'descr', align: 'left' },
      { text: 'Actions', value: 'name', sortable: false, align: 'center' }
    ],
    editedIndex: -1,
    editedItem: {
      id: -1,
      firstName: '',
      lastName: '',
      type: 'Supplier',
      old_firstName: '',
      old_lastName: '',
      company: ''
    },
    editedCatUm: {
      id: -1,
      descr: '',
      type: ''
    },
    defaultCatUm: {
      id: -1,
      descr: '',
      type: ''
    },
    defaultItem: {
      id: -1,
      firstName: '',
      lastName: '',
      type: 'Supplier',
      old_firstName: '',
      old_lastName: '',
      company: ''
    },
    type: [
      { text: 'Supplier' },
      { text: 'Customer' }
    ],
    title: '',
    tabs: 0,
    list: {
      0: false,
      1: false,
      2: false
    }
  }),

  computed: {
    ...mapState(['supcust', 'categories', 'unitMeasures']),

    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },

    dialog_cat (val) {
      if (val) 
        this.editedCatUm = {...this.editedCatUm, type: 'categories'}
    },

    dialog_um (val) {
      if (val) 
        this.editedCatUm = {...this.editedCatUm, type: 'unitMeasures'}
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.$store.dispatch('FETCH_SUPCUST')
      this.$store.dispatch('FETCH_CAT_UM')
    },

    editItem (item) {
      this.editedIndex = this.supcust.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.old_firstName = item.firstName
      this.editedItem.old_lastName = item.lastName
      this.dialog = true
    },

    deleteItem (item) {
      confirm(`Are you sure you want to delete this ${item.type}?`) && this.$store.dispatch('DELETE_SUPCUST', { id: item.id }) 
    },

    editCatUm (item, state) {
      this.editedIndex = this[state].indexOf(item)
      this.editedCatUm = Object.assign({}, item)
      this.editedCatUm.old_descr = item.descr
      this.editedCatUm.type = state
      this[state === 'unitMeasures'? 'dialog_um': 'dialog_cat'] = true
    },

    deleteCatUm (item, state) {
      confirm(`Are you sure you want to remove this item?`) && this.$store.dispatch('DELETE_CAT_UM', { id: item.id, type: state }) 
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)        
        this.editedCatUm = Object.assign({}, this.defaultCatUm)        
        this.editedIndex = -1
        this.$refs.form.resetValidation()
      }, 300)
    },

    save () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('CREATE_SUPCUST', this.editedItem).then(e => {
          this.close()
        }).catch(error => {
          if (error)
            this.validation.error.firstName = error.msg
        })        
      }
    },

    save_cat_um (type) {
      if (this.$refs[type === 0? 'um_form': 'cat_form'].validate()) {
        this.$store.dispatch('CREATE_CAT_UM', this.editedCatUm).then(e => {
          this[type === 0? 'dialog_um': 'dialog_cat'] = false
          this.close()
        }).catch(error => {
          if (error)
            this.validation.error.descr = error.msg
        })        
      }
    }
  }
}
</script>

<style>
  .v-table__overflow {
    overflow-x: hidden;
  }
</style>