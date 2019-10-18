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
            color="info"
            title="Item List"
            text="List of current available stocks"
          >
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-dialog v-model="dialog" max-width="500px">
                  <v-btn slot="activator" color="info" dark round class="mb-2">New Item</v-btn>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-form ref="form" name="item-form" @submit.prevent="save" v-model="valid">
                      <v-card-text>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                              <v-text-field v-model="editedItem.itemCode" label="Item Code" :error-messages="error.itemCode" :rules="[v => !!v || 'Item Code is required']" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                              <v-text-field v-model="editedItem.productCode" label="Product Code" :error-messages="error.productCode" :rules="[v => !!v || 'Product Code is required']" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                              <v-text-field v-model="editedItem.descr" label="Description" :rules="[v => !!v || 'Description is required']" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                              <v-select
                                :items="categories"
                                label="Category"
                                item-value="id"
                                item-text="descr"
                                v-model="editedItem.categoryID"
                                :rules="[v => !!v || 'Category is required']"
                                required
                              />
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                              <v-select
                                :items="unitMeasures"
                                label="Unit Measure"
                                item-value="id"
                                item-text="descr"
                                v-model="editedItem.um_id"
                                :rules="[v => !!v || 'Unit Measure is required']"
                                required
                              ></v-select>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                              <v-text-field v-model="editedItem.unit_price" label="Unit Price (₱)" :rules="[v => !!(v).toString() || 'Unit Price is required']" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                              <v-text-field v-model="editedItem.criticalLevel" label="Critical Level" required></v-text-field>
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

              <!-- TABLE  -->
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
            <v-data-table
              :search="search"
              :headers="headers"
              :items="items"
              :pagination.sync="pagination"
            >
              <template v-slot:items="props">
                <td>{{ props.item.itemCode }}</td>
                <td>{{ props.item.productCode }}</td>
                <td>{{ props.item.descr }}</td>
                <td class="text-xs-right">{{ props.item.Category.descr }}</td>
                <td class="text-xs-right">{{ props.item.UnitMeasure.descr }}</td>
                <td class="text-xs-right">{{ props.item.unit_price }}</td>
                <td class="text-xs-right">{{ props.item.qtyIn - props.item.qtyOut }}</td>
                <td class="text-xs-right">{{ props.item.criticalLevel }}</td>
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
      </v-layout>
    </v-container>
  </smooth-scrollbar>
</template>

<script>
import { mapState } from 'vuex'
import ScrollView from '@blackbp/vue-smooth-scrollbar';

export default {
  components: {
    'smooth-scrollbar': ScrollView
  },
  data: () => ({
    pagination: {
      rowsPerPage: 10,
      'sortBy': 'descr'
    },
    search: '',
    valid: true,
    dialog: false,
    headers: [
      { text: 'Item Code', value: 'itemCode', align: 'left' },
      { text: 'Product Code', value: 'productCode', align: 'left' },
      { text: 'Description', value: 'descr', align: 'left' },
      { text: 'Category', value: 'category', align: 'right' },
      { text: 'Unit Measure', value: 'unitMeasure', align: 'right' },
      { text: 'Unit price', value: 'itemCost', align: 'right' },
      { text: 'Qty', value: 'qty', align: 'right' },
      { text: 'Critical Level', value: 'criticalLevel', align: 'right' },
      { text: 'Actions', value: 'name', sortable: false, align: 'center' }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: -1,
      itemCode: '',
      productCode: '',
      old_itemCode: '',
      old_productCode: '',
      descr: '',
      categoryID: '',
      um_id: '',
      unit_price: 0,
      criticalLevel: 5,
    },
    defaultItem: {
      id: -1,
      itemCode: '',
      productCode: '',
      old_itemCode: '',
      old_productCode: '',
      descr: '',
      categoryID: '',
      um_id: '',
      unit_price: 0,
      criticalLevel: 5,
    },
    title: '',
    error: {
      itemCode: ''
    }
  }),

  computed: {
    ...mapState(['items', 'categories', 'unitMeasures']),

    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },

    'categories' (val) {
      if (val) 
        this.editedItem.categoryID = val[0].id
    },

    'unitMeasures' (val) {
      if (val) 
        this.editedItem.um_id = val[0].id
    },

    'editedItem.itemCode' (val) {
      if (val && this.error.itemCode !== '') 
        this.error.itemCode = ''
    },

    'editedItem.productCode' (val) {
      if (val && this.error.productCode !== '') 
        this.error.productCode = ''
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.$store.dispatch('FETCH_ITEMS')
    },

    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.old_itemCode = item.itemCode
      this.editedItem.old_productCode = item.productCode
      this.dialog = true
    },

    deleteItem (item) {
      confirm('Are you sure you want to delete this item?') && this.$store.dispatch('DELETE_ITEM', { id: item.id }) 
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)        
        this.editedIndex = -1

        if (this.categories.length !== 0) 
          this.editedItem.categoryID = this.categories[0].id
        if (this.unitMeasures.length !== 0)
          this.editedItem.um_id = this.unitMeasures[0].id
        
        this.$refs.form.resetValidation()
      }, 300)
    },

    save () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('CREATE_ITEM', this.editedItem).then(e => {
          this.close()
        }).catch(error => {
          if (error)
            this.error.itemCode = error.msg
        })        
      }
    }
  }
}
</script>

<style>
</style>