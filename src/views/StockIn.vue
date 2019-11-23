<template>
  <div style="height: 100%;">
    <v-flex
      xs3
      md3
      :style="{...style}"
      v-if="$route.name === 'Sales Order'"
    >
      <v-card style="margin-top: -24px; margin-left: -23px; border-radius: 0; height: 100%;">
        <v-flex xs12 sm12>
          <v-text-field
            v-model="search"
            label="Receipt # / Name / Status"
            solo
            clearable
            prepend-inner-icon="mdi-magnify"
            style="height: 70px; padding: 12px;" 
          >
          </v-text-field>
        </v-flex>
        <v-list style="height: calc(100% - 155px);" two-line>
          <smooth-scrollbar :options='{alwaysShowTracks: true}' style="height: 100%;">
            <template v-for="(item, index) in transactions.filter(e => ( !!!(e.SupCust.firstName + ' ' + e.SupCust.lastName).toLowerCase().search(search.toLowerCase()) || !!!(e.receiptNumber).toLowerCase().search(search.toLowerCase()) || !!!(e.status).toLowerCase().search(search.toLowerCase())))">
              <v-list-tile
                :key="item.title"
                avatar
                ripple
                @click="toggle(index)"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.SupCust.firstName + ' ' + item.SupCust.lastName }}</v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">#{{ item.receiptNumber }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>{{ item.Orders.map(e => e.Items ? e.Items.descr + ' x' + e.qty + ' ' + e.itemCost: '').toString() }}</v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-list-tile-action-text>
                    <v-tooltip dark right>
                      <span slot="activator" :style="{color: statusPayment(item)}">
                        ₱{{ 
                          (item.Orders.length !== 0) ? 
                            item.Orders.map(e => parseFloat((e.itemCost || 0)) * parseFloat((e.qty || 0)).toFixed(2))
                              .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2).split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').concat(item.Orders.map(e => parseFloat((e.itemCost || 0)) * parseFloat((e.qty || 0)).toFixed(2))
                              .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2).split(".")[1]? '.' + item.Orders.map(e => parseFloat((e.itemCost || 0)) * parseFloat((e.qty || 0)).toFixed(2))
                              .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2).split(".")[1] : '')
                                : 0 
                        }}
                      </span>
                      <span>{{ statusPayment(item) === 'orange'? 'Pending Balance' : 'Fully Paid' }}</span>
                    </v-tooltip>
                    
                  </v-list-tile-action-text>
                  <v-tooltip v-if="item.status !== 'Pending'"  dark right>
                    <v-icon slot="activator" style="float: right;color: green">mdi-check-circle-outline</v-icon>
                    <span>Received Stocks</span>
                  </v-tooltip>
                  <v-tooltip v-else dark right>
                    <v-icon slot="activator" style="float: right;color: orange">mdi-clock</v-icon>
                    <span>Pending Stocks</span>
                  </v-tooltip>
                </v-list-tile-action>

              </v-list-tile>
              <v-divider
                v-if="index + 1 < items.length"
                :key="index"
              ></v-divider>
            </template>
          </smooth-scrollbar>

          <v-list-tile avatar ripple v-if="transactions.length === 0">
              <v-list-tile-content style="margin-top: 80px;">
                <v-img :src="img" height="50" width="50" contain style="margin: 0 auto;"/>
                <v-list-tile-title style="text-align: center;">No Data</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    
    <v-speed-dial
      v-model="fab"
      direction="left"
      :open-on-hover="true"
      transition="slide-x-reverse-transition"
      v-if="addOrder"
      style="position: fixed; top: initial; left: initial; right: 20px; bottom: 10px; z-index: 9; height: 60px ; width: 60px; border-radius: 200px;"
    >
      <v-btn
        slot="activator"
        v-model="fab"
        color="blue darken-2"
        dark
        fab
        style="position: fixed; right: 20px; bottom: 10px; height: 60px ; width: 60px; border-radius: 200px; padding-left: 0;"
      >
        <v-icon>mdi-menu</v-icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="indigo"
        style="border-radius: 200px; margin-right: 15px; bottom: 9px;"
        @click="addOrder = false; products = []; editedItem = defaultItem"
      >
        <v-icon>mdi-cancel</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="green"
        style="border-radius: 200px; margin-right: 15px; bottom: 9px;"
        @click="checkme_out"
      >
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-speed-dial>
    <div v-else>
      <v-btn color="blue darken-2" fab dark style="position: fixed; right: 20px; bottom: 10px; z-index: 9; height: 60px; width: 60px; border-radius: 200px;" @click="addOrder = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn  v-if="hasBalance" color="orange accent-4" fab dark style="position: fixed; right: 95px; bottom: 20px; z-index: 9; height: 40px; width: 40px !important; border-radius: 200px; padding: 10px;" @click="checkout_d = true">
        <v-icon>mdi-currency-usd</v-icon>
      </v-btn>
    </div>

    <v-dialog v-model="checkout_d" max-width="450">
      <v-form ref="checkout_form" @submit.prevent="save" v-model="valid">
        <v-card>
          <v-card-title class="headline">Order Checkout</v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 md12 v-if="active == 0">
                  <div style="display: inline-block;">
                    <span style="display: block; font-weight: 500; margin-top: 5px;">Total:</span>
                  </div>
                  <div style="display: inline-block; float: right">
                    <span style="display: block; font-weight: 500; text-align: right; margin-top: 5px;">₱{{ parseFloat(grandTotal).toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                  </div>
                </v-flex>
                <v-flex xs12 md12 v-if="active == 1 && hasBalance" style="text-align: center;">
                  <div style="display: inline-block;">
                    <span style="display: block; font-weight: 500; margin-top: 5px; text-align: center;">Balance</span>
                    <span style="font-size: 21px !important; display: block; font-weight: 500; text-align: center; margin-top: 5px; color: red;">₱{{ parseFloat(parseFloat(grandTotal1) - parseFloat(totalPayment)).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
                  </div>
                </v-flex>
                <v-flex xs12 md12 v-if="payment_option != 1">
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :nudge-right="40"
                    :return-value.sync="date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="date"
                      label="Payment Due Date"
                      prepend-icon="mdi-calendar-range"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="date" @input="$refs.menu.save(date)"></v-date-picker>

                  </v-menu>
                </v-flex>
                <v-flex xs12 md12 style="margin-top: 10px;" justify-center>
                  <v-radio-group id="group_payment" v-model="payment_option" @change="paymentChange($event)" row>
                    <v-radio color="info" label="Full Payment" value="1" />
                    <v-radio color="info" label="P.O" value="2" />
                  </v-radio-group>
                  <v-text-field :disabled="payment_option == 1" style="text-align: right;" prefix="₱" id="user_payment" label="Customer Payment" ref="user_payment" v-model="user_payment" :rules="[v => parseFloat(v) >= 0 ? parseFloat(v) <= parseFloat(!hasBalance? grandTotal.replace(/,/g, ''): (parseFloat(grandTotal1) - parseFloat(totalPayment))) || 'Payment Exceeds Full Payment!': 'Invalid payment!']" required/>
                  <v-text-field  style="text-align: right;" prefix="₱" id="user_payment" label="Amount Received" ref="amount_received" v-model="amount_received" :rules="[v => parseFloat(v) >= parseFloat(user_payment) || 'Insufficient Amount']" required/>
                </v-flex>
                <v-flex xs12 md12>
                  <div style="display: inline-block;">
                    <span style="display: block; margin-top: 5px; font-weight: 400;">Change</span>
                  </div>
                  <div style="display: inline-block; float: right">
                    <span style="display: block; text-align: right; margin-top: 5px; font-weight: 400;">₱{{ amount_received !== '' && amount_received != 0? (parseFloat(amount_received) - parseFloat(user_payment)).toFixed(2): '0.00' }}</span>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click.native="checkout_d = false">Cancel</v-btn>
            <v-btn type="submit" color="green darken-1" flat="flat" :disabled="parseFloat(amount_received || 0) < parseFloat(user_payment)">Save</v-btn>
            <v-btn type="submit" color="green darken-1" flat="flat" :disabled="parseFloat(amount_received || 0) < parseFloat(user_payment)">Print & save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <smooth-scrollbar :options='{alwaysShowTracks: true}' style="height: 100%;">
      <v-container
        fill-height
        fluid
        grid-list-xl>
        <v-layout
          justify-center
          wrap
        >      
          <v-flex
            xs9
            md9
            offset-xs3
            offset-md3
          >
            <material-card v-if="selected !== -1 || addOrder">
              <v-form ref="form" name="item-form" @submit.prevent="save" v-model="valid">
                <v-layout
                  wrap
                >     
                  <v-flex xs11 md11 style="padding-top: 0;">
                    <h4 style="font-weight: 400 !important; display: inline-block;">{{ title }}</h4> <small v-if="!addOrder" :style="{color: statusPayment(transactions[selected])}"> ({{ statusPayment(transactions[selected]) === 'orange' ? 'Pending Balance' : ' Fully Paid' }})</small>
                      <span style="margin-left: 60px; font-weight: 400;" v-if="selected !== -1? transactions[selected].due_date: false">Due Date: <span style="color: orange;">{{ selected !== -1 ? transactions[selected].due_date : '' }}</span></span>

                  </v-flex>

                  <v-flex xs1 md1 style="padding-top: 0;" v-if="!addOrder && transactions[selected].status === 'Pending'">
                    <v-menu offset-y style="vertical-align: top;">
                      <v-btn slot="activator" flat icon color="pink" style="margin-top: 0;">
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile>
                          <v-dialog v-model="dialog" persistent max-width="290">
                            <v-list-tile-title slot="activator">Delete</v-list-tile-title>
                            <v-card>
                              <v-card-title class="headline">Delete Order</v-card-title>
                              <v-card-text>Are you sure you want to delete this pending order?</v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="pink darken-1" flat @click.native="dialog = false">Disagree</v-btn>
                                <v-btn color="green darken-1" flat @click="dialog = false; $store.dispatch('DELETE_STOCKIN', { id: transactions[selected].id }).then(e => selected = -1)">Agree</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-list-tile>
                        <v-list-tile v-if="transactions[selected].status === 'Pending'">
                          <v-dialog v-model="dialog1" persistent max-width="500">
                            <v-list-tile-title slot="activator">Receive Order</v-list-tile-title>
                            <v-card>
                              <v-card-title class="headline">Receive Order</v-card-title>
                              <v-card-text>This action cannot be undone, are you sure you want to change the status of this Order?</v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="pink darken-1" flat @click.native="dialog1 = false">Disagree</v-btn>
                                <v-btn color="green darken-1" flat @click="dialog1 = false; $store.dispatch('RECEIVE_STOCKIN', { id: transactions[selected].id, orders: transactions[selected].Orders, temp_status: statusPayment(transactions[selected]) })">Agree</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </v-flex>
                </v-layout>

                      <!-- :rules="[v => !!v || 'Receipt Number is required']" -->
                <v-layout
                  justify-center
                  wrap
                  v-if="addOrder"
                >      

                  <v-flex xs6>
                    <v-text-field
                      label="Receipt Number"
                      v-model="editedItem.receiptNumber"
                      :error-messages="error.receiptNumber"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-select
                      :items="supcust"
                      label="Supplier"
                      item-value="id"
                      item-text="name"
                      v-model="editedItem.supCustID"
                      :rules="[v => !!v || 'Supplier is required']"
                      required
                    />
                  </v-flex>
                </v-layout>

                <v-layout
                  justify-center
                  wrap
                  style="margin: auto -16px; background-color: #e9eae9"
                  v-else
                >      
                  <v-flex xs3 style="border: 1px solid #E0E0E0; padding: 15px 10px;">
                    <small style="font-weight: 500; color: #909090; font-size: 75%;">RECEIPT NUMBER</small><br />
                    <p style="display: inline-block; font-size: 15.5px !important; font-weight: 400;">{{ transactions[selected].receiptNumber }}</p>
                    <v-icon style="float: right;">mdi-pound</v-icon>
                  </v-flex>

                  <v-flex xs3 style="border: 1px solid #E0E0E0; padding: 15px 10px;">
                    <small style="font-weight: 500; color: #909090; font-size: 75%;">SUPPLIER</small><br />
                    <p style="display: inline-block; font-size: 15.5px !important; font-weight: 400;">{{ transactions[selected].SupCust.firstName + ' ' + transactions[selected].SupCust.lastName }}</p>
                    <v-icon style="float: right;">mdi-package-variant</v-icon>
                  </v-flex>

                  <v-flex xs3 style="border: 1px solid #E0E0E0; padding: 15px 10px;">
                    <small style="font-weight: 500; color: #909090; font-size: 75%;">STATUS</small><br />
                    <p style="display: inline-block; font-size: 15.5px !important; font-weight: 400;" :style="{color: (transactions[selected].status !== 'Pending')? 'green': 'orange'}">{{ transactions[selected].status }}</p>
                    <v-icon v-if="transactions[selected].status !== 'Pending'" style="float: right;color: green">mdi-check-circle-outline</v-icon>
                    <v-icon v-else style="float: right;color: orange">mdi-clock</v-icon>
                  </v-flex>

                  <v-flex xs3 style="border: 1px solid #E0E0E0; padding: 15px 10px;">
                    <small style="font-weight: 500; color: #909090; font-size: 75%;">DATE</small><br />
                    <p style="display: inline-block; font-size: 15.5px !important; font-weight: 400;">{{ new Date(transactions[selected].createdAt).toString().split(' ')[0] + ' ' + new Date(transactions[selected].createdAt).toString().split(' ')[1] + ' ' + new Date(transactions[selected].createdAt).toString().split(' ')[2] + ' ' + new Date(transactions[selected].createdAt).toString().split(' ')[3] }}</p>
                    <v-icon style="float: right;">mdi-calendar-range</v-icon>
                  </v-flex>
                </v-layout>

                <v-tabs
                  v-model="activeTab"
                  color="transparent"
                  slider-color="transparent"
                  v-if="selected !== -1 && !addOrder"
                  dark
                  grow
                >   
                  <v-tab
                    :key="0"
                    ripple
                  >
                    <v-chip class="chippys" :class="activeTab === 0 && 'elevation chipsy'" :color="activeTab === 0? 'info': 'transparent'" :text-color="activeTab === 0? 'white': 'info'" style="height: 25px;">
                      <v-avatar style="margin-right: 0px;">
                        <v-icon :style="{color: activeTab === 0? 'white': 'inherit', fontSize: '18px'}">mdi-wallet-travel</v-icon>
                      </v-avatar>
                      Purchased Items
                    </v-chip>
                  </v-tab>
                  <v-tab
                    :key="1"
                    ripple
                  >
                    <v-chip  class="chippys" :class="activeTab === 1 && 'elevation chipsy'" :color="activeTab === 1? 'info': 'transparent'" :text-color="activeTab === 1? 'white': 'info'" style="height: 25px;">
                      <v-avatar style="margin-right: 0px;">
                        <v-icon :style="{color: activeTab === 1? 'white': 'inherit', fontSize: '18px'}">mdi-history</v-icon>
                      </v-avatar>
                      Payment History
                    </v-chip>
                  </v-tab>
                  
                  <v-tab-item
                    :key="0"
                  >
                    <v-data-table
                      :headers="headers"
                      :items="(addOrder)? products: transactions[selected].Orders"
                      hide-actions
                    >
                      <template v-if="addOrder" v-slot:items="props">
                        <td>
                          <v-autocomplete
                            :items="items"
                            label="Item"
                            item-value="id"
                            item-text="descr"
                            v-model="props.item.itemID"
                            :rules="[v => !!v || 'Supplier is required']"
                            required
                          ></v-autocomplete>
                        </td>
                        <td>
                          <v-text-field
                            label="Unit Price"
                            prefix="₱"
                            v-model="props.item.itemCost"
                            :rules="[v => !!v || 'Unit price is required']"
                            required
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            label="Qty"
                            v-model="props.item.qty"
                            :rules="[v => !!v || 'Quantity is required']"
                            required
                          ></v-text-field>
                        </td>
                        <td>₱{{ (parseFloat(props.item.itemCost) * parseFloat(props.item.qty) !== 0 && !!(parseFloat(props.item.itemCost) * parseFloat(props.item.qty)))? (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ((parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1]? '.' + (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1] : '') : 0}}</td>
                        <td class="justify-center layout px-0">
                          <v-btn icon class="mx-0" @click="editItem(props.item)" v-if="!addOrder">
                            <v-icon color="teal">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                            <v-icon color="pink">mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </template>

                      <template v-else v-slot:items="props">
                        <td>
                          {{ props.item.Items.descr }}<br />
                          <span style="color: gray;">{{ props.item.Items.itemCode }}</span>
                        </td>
                        <td>{{ props.item.itemCost }}</td>
                        <td>{{ props.item.qty }}</td>
                        <td>₱{{ (parseFloat(props.item.itemCost) * parseFloat(props.item.qty) !== 0 && !!(parseFloat(props.item.itemCost) * parseFloat(props.item.qty)))? (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ((parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1]? '.' + (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1] : '') : 0}}</td>
                        <td></td>
                      </template>
                      
                      <template v-slot:no-data>
                        <v-img :src="img" height="50" width="50" contain style="margin: 0 auto;"/>
                        <p style="text-align: center;">No Data</p>
                      </template>

                      <template slot="footer">
                        <td style="padding: 5px 8px;">
                          <v-btn v-if="addOrder" id="add-more" @click="addProduct()" type="button" outline color="primary" style="padding: 5px 15px; vertical-align: top; margin-top: -20px;">
                            <v-icon left dark>mdi-plus</v-icon>
                            Add new item
                          </v-btn>
                        </td>
                        <td colspan="2" style="text-align: right; padding: 12px 8px; color: rgba(0,0,0,.54);">
                          <!-- <strong>Discount Received</strong><br /> -->
                          <strong>Grand Total</strong><br />
                        </td>
                        <td colspan="2" style="padding: 12px 8px;">
                          <!-- <strong>₱0.00</strong><br /> -->
                          <strong style="font-size: 14px;">₱ {{ (addOrder)? parseFloat(grandTotal).toLocaleString(undefined, {minimumFractionDigits: 2}) : parseFloat(grandTotal1).toLocaleString(undefined, {minimumFractionDigits: 2}) }}</strong><br />
                        </td>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <v-tab-item
                    :key="1"
                  >
                    <v-data-table
                      :headers="headers3"
                      :items="transactions[selected].Payments"
                      hide-actions
                    >
                      <template v-slot:items="props">
                        <td>{{ props.index + 1 }}</td>
                        <td>₱{{ props.item.customer_payment.toFixed(2) }}</td>
                        <td>₱{{ props.item.amount_received.toFixed(2) }}</td>
                        <td>₱{{ props.item.customer_change }}</td>
                        <td>{{ new Date(props.item.createdAt).toString().split(' ')[0] + ' ' + new Date(props.item.createdAt).toString().split(' ')[1] + ' ' + new Date(props.item.createdAt).toString().split(' ')[2] + ' ' + new Date(props.item.createdAt).toString().split(' ')[3] }}</td>
                      </template>
                      
                      <template v-slot:no-data>
                        <v-img :src="img" height="50" width="50" contain style="margin: 0 auto;"/>
                        <p style="text-align: center;">No Data</p>
                      </template>

                      <template slot="footer">
                        <td colspan="1" style="text-align: right; padding: 12px 8px; color: rgba(0,0,0,.54);">
                          <strong>Total</strong><br />
                          <strong>Balance</strong><br />
                        </td>
                        <td colspan="1" style="padding: 12px 8px;">
                          <strong>₱{{ parseFloat(totalPayment).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</strong><br />
                          <strong style="font-size: 14px; color: red !important;">₱ {{ (grandTotal1 - totalPayment).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</strong><br />
                        </td>
                        <td colspan="3"></td>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                </v-tabs>

                <v-data-table
                  :headers="headers"
                  :items="(addOrder)? products: transactions[selected].Orders"
                  hide-actions
                  v-if="addOrder"
                >
                  <template v-if="addOrder" v-slot:items="props">
                    <td>
                      <v-autocomplete
                        :items="items"
                        label="Item"
                        item-value="id"
                        item-text="descr"
                        v-model="props.item.itemID"
                        :rules="[v => !!v || 'Supplier is required']"
                        required
                      ></v-autocomplete>
                    </td>
                    <td>
                      <v-text-field
                        label="Unit Price"
                        prefix="₱"
                        v-model="props.item.itemCost"
                        :rules="[v => !!v || 'Unit price is required']"
                        required
                      ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        label="Qty"
                        v-model="props.item.qty"
                        :rules="[v => !!v || 'Quantity is required']"
                        required
                      ></v-text-field>
                    </td>
                    <td>₱{{ (parseFloat(props.item.itemCost) * parseFloat(props.item.qty) !== 0 && !!(parseFloat(props.item.itemCost) * parseFloat(props.item.qty)))? (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ((parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1]? '.' + (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1] : '') : 0}}</td>
                    <td class="justify-center layout px-0">
                      <v-btn icon class="mx-0" @click="editItem(props.item)" v-if="!addOrder">
                        <v-icon color="teal">mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                        <v-icon color="pink">mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </template>

                  <template v-else v-slot:items="props">
                    <td>
                      {{ props.item.Items.descr }}<br />
                      <span style="color: gray;">{{ props.item.Items.itemCode }}</span>
                    </td>
                    <td>{{ props.item.itemCost }}</td>
                    <td>{{ props.item.qty }}</td>
                    <td>₱{{ (parseFloat(props.item.itemCost) * parseFloat(props.item.qty) !== 0 && !!(parseFloat(props.item.itemCost) * parseFloat(props.item.qty)))? (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ((parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1]? '.' + (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1] : '') : 0}}</td>
                    <td></td>
                  </template>
                  
                  <template v-slot:no-data>
                    <v-img :src="img" height="50" width="50" contain style="margin: 0 auto;"/>
                    <p style="text-align: center;">No Data</p>
                  </template>

                  <template slot="footer">
                    <td style="padding: 5px 8px;">
                      <v-btn v-if="addOrder" id="add-more" @click="addProduct()" type="button" outline color="primary" style="padding: 5px 15px; vertical-align: top; margin-top: -20px;">
                        <v-icon left dark>mdi-plus</v-icon>
                        Add new item
                      </v-btn>
                    </td>
                    <td colspan="2" style="text-align: right; padding: 12px 8px; color: rgba(0,0,0,.54);">
                      <strong>Discount Received</strong><br />
                      <strong>Grand Total</strong><br />
                    </td>
                    <td colspan="2" style="padding: 12px 8px;">
                      <strong>₱0.00</strong><br />
                      <strong style="font-size: 14px;">₱ {{ (addOrder)? parseFloat(grandTotal).toLocaleString(undefined, {minimumFractionDigits: 2}) : parseFloat(grandTotal1).toLocaleString(undefined, {minimumFractionDigits: 2})  }}</strong><br />
                    </td>
                  </template>
                </v-data-table>
                <button ref="submitForm" style="visibility: hidden;" type="submit">asdqw</button>
              </v-form>
            </material-card>
          </v-flex>
        </v-layout>
      </v-container>
    </smooth-scrollbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ScrollView from '@blackbp/vue-smooth-scrollbar';

export default {
  components: {
    'smooth-scrollbar': ScrollView
  },
  data: () => ({
    date: null,
    menu: false,
    active: 0,
    amount_received: '',
    payment_error: false,
    amount_payment: 0,
    user_payment: 0,
    payment_option: '1',
    checkout_d: false,
    hasBalance: false,
    activeTab: 0,
    valid: false,
    fab: false,
    dialog: false,
    dialog1: false,
    headers: [
      { text: 'Item', value: 'itemID', sortable: false, align: 'left' },
      { text: 'Cost', value: 'itemCost', sortable: false, align: 'left' },
      { text: 'Qty', value: 'qty', sortable: false, align: 'left' },
      { text: 'Sub Total', value: 'totalAmount', sortable: false, align: 'left' },
      { width: '40px', value: 'name', sortable: false, align: 'center' }
    ],
    headers3: [
      { text: 'No.', value: 'id', sortable: false, align: 'left' },
      { text: 'Amount Paid', value: 'customer_payment', sortable: false, align: 'left' },
      { text: 'Received', value: 'amount_received', sortable: false, align: 'left' },
      { text: 'Customer Change', value: 'customer_change', sortable: false, align: 'left' },
      { text: 'Date', value: 'createdAt', sortable: false, align: 'left' },
    ],
    editedIndex: -1,
    editedItem: {
      id: -1,
      receiptNumber: '',
      supCustID: -1
    },
    defaultItem: {
      id: -1,
      receiptNumber: '',
      supCustID: -1
    },
    search: '',
    selected: -1,
    products: [],
    orders: [],
    style: {
      position: 'fixed',
      top: '116px',
      left: '284px',
      height: '100%',
      maxWidth: '18%',
      zIndex: 9,
      transition: 'all 100ms ease-in'
    },
    img: './img/empty.svg',
    addOrder: false,
    error: {
      receiptNumber: ''
    }
  }),

  mounted() {
    if (!this.drawer) {
      this.style.left = '104px'
      this.style.maxWidth = '21%'
    } else  {
      this.style.left = '284px'
      this.style.maxWidth = '18%'
    }
  },

  computed: {
    ...mapState('app', ['drawer']),
    ...mapState(['supcust', 'items', 'transactions', 'user']),
    
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },

    title () {
      return this.addOrder ? 'Add Sales Order' : 'Sales Order Info'
    },

    grandTotal() {
      let total = (this.products.length !== 0) ? 
        this.products.map(e => parseFloat((e.itemCost || 0)) * parseFloat((e.qty || 0)).toFixed(2))
          .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0))))
            : 0
            console.log((2+''+total.toFixed(2).split(".")[1]? '.' + total.toFixed(2).split(".")[1] : ''))
      return total !== 0? total.toFixed(2).split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').concat(total.toFixed(2).split(".")[1]? '.' + total.toFixed(2).split(".")[1] : '') : '0.00'
    },

    grandTotal1() {
      let total = (this.transactions[this.selected].Orders.length !== 0) ? 
        this.transactions[this.selected].Orders.map(e => parseFloat((e.itemCost || 0)) * parseFloat((e.qty || 0)).toFixed(2))
          .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0))))
            : 0
            console.log((2+''+total.toFixed(2).split(".")[1]? '.' + total.toFixed(2).split(".")[1] : ''))
      return total !== 0? total : '0.00'
    },

    totalPayment() {
      console.log(this.transactions)
      return this.transactions[this.selected].Payments.length !== 0? this.transactions[this.selected].Payments.map(e => e.customer_payment).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2) : 0
    }
  },

  watch: {
    addOrder (val) {
      if (val && this.supcust.length !== 0) 
        this.editedItem.supCustID = this.supcust[0].id

      if (val) {
        this.hasBalance = false
        this.active = 0
      } else if (this.selected !== -1) {
        this.active = 1
        this.hasBalance = this.statusPayment(this.transactions[this.selected]) === 'orange'
      }

      val || this.close()
    },

    'drawer' (val) {
      if (!val) {
        this.style.left = '104px'
        this.style.maxWidth = '21%'
      } else  {
        this.style.left = '284px'
        this.style.maxWidth = '18%'
      }
    },

    selected (val) {
      if (val === -1)
        this.date = null

      
        console.log(this.date)
    },  

    'supcust' (val) {
      if (val) 
        this.editedItem.supCustID = val[0].id
    },

    'editedItem.receiptNumber' (val) {
      if (val && this.error.receiptNumber !== '') 
        this.error.receiptNumber = ''
    },

    user_payment (val) {
      this.payment_option = parseFloat(val) == parseFloat(!this.hasBalance? this.grandTotal.replace(/,/g, '') : (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)).toFixed(2))? '1': '2'
      console.log(val)
      console.log(parseFloat(val).toFixed(2)) >= parseFloat(this.amount_received).toFixed(2)
      // this.payment_error = parseFloat(val).toFixed(2) >= parseFloat(this.amount_received).toFixed(2)
      // parseFloat(!this.hasBalance? parseFloat(this.amount_received) - parseFloat(this.grandTotal.replace(/,/g, '')) : (parseFloat(this.amount_received) - (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment))).toFixed(2))
    },

    checkout_d (val) {
      if (val) {
        console.log(this.grandTotal)
        this.payment_option = '1'
        this.user_payment = this.hasBalance === false? this.payment_option == 1? this.grandTotal.replace(/,/g, '') : (parseFloat(this.grandTotal.replace(/,/g, '')) / 2).toFixed(2) : this.payment_option == 1? (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)).toFixed(2) : ((parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)) / 2).toFixed(2) 
        console.log(this.user_payment)
      }
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    ...mapMutations('app', ['setSnackbar']),

    initialize () {
      this.$store.dispatch('FETCH_STOCKIN', { type: 'IN', user_type: 'Supplier' })      
    },

    checkme_out () {
      if (this.products.length !== 0) {
        if (this.$refs.form.validate()) 
          this.checkout_d = true
      } else {
        this.setSnackbar({ show: true, type: 'error', text: `Please order at least 1 item from the supplier! `})
      }
    },

    paymentChange (event) {
      console.log(parseFloat(this.grandTotal).toFixed(2))
      console.log(this.hasBalance)
      console.log(event)
      console.log(this.user_payment)
      this.user_payment = this.hasBalance === false? 
        event == 1? parseFloat(this.grandTotal.replace(/,/g, '')).toFixed(2) : (parseFloat(this.grandTotal.replace(/,/g, '')) / 2).toFixed(2) 
      : event == 1? (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)).toFixed(2) : ((parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)) / 2).toFixed(2) 

    },

    statusPayment (item) {
      const total = item.Orders.length !== 0? item.Orders.map(e => parseFloat((e.itemCost || 0)) * parseFloat((e.qty || 0))).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))) : 0
      const payment = item.Payments.length !== 0? item.Payments.map(e => e.customer_payment).reduce((total, num) => (parseFloat(total) + parseFloat(num))): 0
      return (parseFloat(total) - parseFloat(payment)) !== 0 ? 'orange': 'green'
    },

    toggle (index) {
      if (this.statusPayment(this.transactions[index]) === 'orange')
        this.hasBalance = true;
      else 
        this.hasBalance = false

      this.active = 1
      this.selected = index
      this.date = this.transactions[index].due_date
      this.close()
      console.log(index)
    },

    addProduct () {
      this.products.push({itemID: (this.items.length !== 0)? this.items[0].id: -1, itemCost: '', qty: ''})
    },

    editItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.products.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.products.splice(index, 1)
    },

    close () {
      this.checkout_d = false
      this.addOrder = false; 
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedItem.supCustID = this.supcust[0].id
        this.editedIndex = -1
        this.products = []
      }, 300)
    },

    save () {
      if (this.$refs.form.validate()) {
        const payload = !this.hasBalance? {
          ...this.editedItem, 
          Orders: [...this.products], 
          userID: this.user.id, 
          type: 'IN', 
          due_date: this.date,
          status: this.payment_option == 1 ? 'Pending' : 'Pending Balance',
          payment: false, 
          Payments: [{ 
            customer_payment: this.user_payment, 
            amount_received: this.amount_received, 
            customer_change: (parseFloat(this.amount_received) - parseFloat(this.user_payment)).toFixed(2)  
          }], 
        } : {
          id: this.transactions[this.selected].id,
          payment: true, 
          type: 'IN', 
          due_date: this.date,
          Orders: [...this.transactions[this.selected].Orders],
          status: parseFloat(this.user_payment) == (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment))? this.transactions[this.selected].status === 'Pending Balance'? 'Pending': 'Received': this.transactions[this.selected].status,
          Payments: [{
            transaction_id: this.transactions[this.selected].id,
            customer_payment: this.user_payment, 
            amount_received: this.amount_received, 
            customer_change: (parseFloat(this.amount_received) - parseFloat(this.user_payment)).toFixed(2)
          }],
        };

        this.$store.dispatch('CREATE_STOCKIN', { ...payload }).then(e => {
          this.close()
          if (this.addOrder)
            this.selected = -1
          else
            this.activeTab = 1 
        }).catch(error => {
          if (error)
            this.error.receiptNumber = error.msg
        })     
        
      }
    }
  }
}
</script>

<style>
  #add-more {
    caret-color: #9c27b0 !important;
    color: #9c27b0 !important;
  }

  .v-card__text {
    padding-top: 10px;
  }

  .v-table__overflow {
    overflow-x: hidden;
  }

  .v-input__slot {
    border-radius: 5px !important;
  }

  .v-input__slot .v-text-field__details {
    height: 0;
  }

  #core-view {
    height: 100%;
  }

  .container.fill-height.fluid.grid-list-xl {
    height: 100%;
  }
</style>