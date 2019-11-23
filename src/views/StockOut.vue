<template>
  <div style="height: 100%;">
    <v-flex
      xs3
      md3
      :style="{...style}"
      v-if="$route.name === 'Purchase Order'"
    >
      <v-card id="purchaseorder" style="margin-top: -24px; margin-left: -23px; border-radius: 0; height: 100%;">
        <v-tabs
          v-model="active"
          color="transparent"
          dark
          slider-color="transparent"
          grow
        >   
          <v-tab
            :key="0"
            ripple
          >
            <v-chip class="chippy" :class="active === 0 && 'elevation'" :color="active === 0? 'info': 'transparent'" :text-color="active === 0? 'white': 'info'" style="height: 25px;">
              <v-avatar style="margin-right: 0px;">
                <v-icon :style="{color: active === 0? 'white': 'inherit', fontSize: '18px'}">mdi-wallet-travel</v-icon>
              </v-avatar>
              Checkout
            </v-chip>
          </v-tab>
          <v-tab
            :key="1"
            ripple
          >
            <v-chip  class="chippy" :class="active === 1 && 'elevation'" :color="active === 1? 'info': 'transparent'" :text-color="active === 1? 'white': 'info'" style="height: 25px;">
              <v-avatar style="margin-right: 0px;">
                <v-icon :style="{color: active === 1? 'white': 'inherit', fontSize: '18px'}">mdi-format-list-bulleted</v-icon>
              </v-avatar>
              Orders
            </v-chip>
          </v-tab>
          
          <v-tab-item
            :key="0"
          >
            <smooth-scrollbar :options='{alwaysShowTracks: true}' style="height: 81.5vh;">
              <v-form ref="formation" @submit.prevent="checkout" v-model="valid">
                <v-layout row wrap>
                  <v-flex xs12 md12>
                    <v-text-field label="Receipt Number" v-model="editedItem.receiptNumber" :rules="[v => !!v || 'Receipt Number is required']" :error-messages="error.receiptNumber" required style="margin: 0 10px;" />
                  </v-flex><br />
                  <v-flex xs10 md10>
                    <v-autocomplete
                      :items="supcust"
                      label="Customer"
                      item-value="id"
                      item-text="name"
                      v-model="editedItem.supCustID"
                      :rules="[v => !!v || 'Customer is required']"
                      required 
                      style="margin: 10px;" />
                  </v-flex>
                  <v-flex xs2 md2>
                    <v-tooltip dark right>
                      <v-btn slot="activator" fab dark small flat color="success" style="border-radius: 100px;">
                        <v-icon style="color: #61B865;">mdi-plus</v-icon>
                      </v-btn>
                      <span>Register Customer</span>
                    </v-tooltip>
                  </v-flex>
                  <span style="font-weight: 400; font-size: 16px !important; margin-left: 7.5px;">Items</span>
                </v-layout>
                <smooth-scrollbar id="itemss" :options='{alwaysShowTracks: true}' style="max-height: 30vh;">
                  <v-data-table
                    :headers="itemsHeader"
                    :items="selected"
                    hide-actions
                  >
                    <template slot="items" slot-scope="props">
                      <tr @mouseleave="discountOption = false">
                        <div style="overflow: hidden; position: relative;">
                          <td class="hover-item">
                            <v-tooltip dark top style="position: absolute; top: 7px; left: 10px; z-index: 9;">
                              <v-icon @click.native="discountOption = !discountOption" slot="activator" class="clickable tag" :style="{color: discountOption? '#FFCC00' : '#FFF' }" style="font-size: 19px; color: #FFF;">mdi-tag</v-icon>
                              <span>Add Discount</span>
                            </v-tooltip>
                            <span style="font-size: 13px; font-weight: 400;">{{ props.item.descr }}</span> 
                            <v-tooltip dark top style="position: absolute; top: 7px; right: 10px; z-index: 9;">
                              <v-icon @click.native="selected = selected.filter(e => e.id !== props.item.id)" slot="activator" class="clickable trash" style="font-size: 19px; color: #FFF;">mdi-trash-can-outline</v-icon>
                              <span>Delete Item</span>
                            </v-tooltip>
                            <div class="discount-option" :class="discountOption? 'discount-active': ''">
                              <v-radio-group v-model="props.item.discount" @change="changeDiscount(props.item.discount)" row>
                                <v-radio color="warning" :label="'₱' + props.item.unit_price" :value="0" style="color: #FFF !important;"/>
                                <v-radio color="warning" :label="'₱' + (props.item.unit_price / 3 * 2.5)" :value="props.item.unit_price / 3 * 2.5" style="color: #FFF !important;"/>
                                <v-radio color="warning" :label="'₱' + (props.item.unit_price / 3 * 2)" :value="props.item.unit_price / 3 * 2" style="color: #FFF !important;"/>
                              </v-radio-group>
                            </div>
                            <div :style="{marginTop: discountOption? '20px' : '-13px', opacity: discountOption? '0' : '1'}" style="transition: all 150ms;">
                              <v-btn @click.native="editQty('add', props.item.id)" class="btn-edit-item" fab flat small style="width: 20px !important;"><v-icon style="color: #FFF;">mdi-plus</v-icon></v-btn> 
                              <span style="display: inline-block; font-size: 21px; font-weight: 400; vertical-align: middle;">{{ props.item.qty }}</span>
                              <v-btn @click.native="editQty('minus', props.item.id)" class="btn-edit-item" fab flat small style="width: 20px !important;"><v-icon style="color: #FFF;">mdi-minus</v-icon></v-btn>
                            </div>
                          </td>
                          <td class="text-xs-left">
                            <span style="font-size: 13px; font-weight: 400;">{{ props.item.descr }}</span><br />
                            <span style="font-size: 13px; font-weight: 400; color: rgba(0,0,0,.54);">Price: <span :style="{ textDecoration: (props.item.discount)? 'line-through': 'none' }">₱{{ props.item.unit_price.toFixed(2) }}</span> <span v-if="props.item.discount"> ₱{{ props.item.discount.toFixed(2) }}</span></span>
                          </td>
                          <td class="text-xs-center" style="width: 30%;">{{ props.item.qty }}</td>
                          <td class="text-xs-left" style="font-size: 13px; position: absolute; top: 0; right: 0; text-align: right !important;">
                            <span v-if="props.item.discount" style="font-size: 13px; font-weight: 400;">
                              <v-icon style="font-size: 12px; color: #FFCC00; margin-right: 5px;">mdi-tag</v-icon>₱{{ parseFloat(props.item.qty * props.item.discount).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                            </span>
                            <span v-else :style="{ color: (props.item.discount)? 'rgba(0,0,0,.54)': '#000'}">₱{{ parseFloat(props.item.qty * props.item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span> <br />

                            <span v-if="props.item.discount">
                              
                              <span style="font-size: 13px; font-weight: 400; color: rgba(0,0,0,.54);" :style="{ textDecoration: (props.item.discount)? 'line-through': 'none' }">₱{{ parseFloat(props.item.qty * props.item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
                            </span>
                          </td>
                        </div>
                      </tr>
                    </template>

                    <template v-slot:no-data>
                      <v-img :src="img" height="50" width="50" contain style="margin: 0 auto;"/>
                      <p style="text-align: center;">No Data</p>
                    </template>
                  </v-data-table>
                </smooth-scrollbar>

                <table style="width: 100%;">
                  <tbody>
                    <tr>
                      <td style="text-align: left; padding: 12px 8px;">
                        <strong>Subtotal</strong><br />
                        <strong>Total Discount</strong><br />
                        <strong style="font-weight: 600;">Total</strong><br />
                      </td>
                      <td style="visibility: hidden; width: 38%;">s</td>
                      <td style="padding: 12px 8px; text-align: right;">
                        <strong>{{ sub_total }}</strong><br />
                        <strong>{{ discount_total }}</strong><br />
                        <strong style="font-size: 14px; font-weight: 600;">₱{{ grand_total }}</strong><br />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <v-layout row wrap style="padding: 0 10px;">
                  <v-flex xs12 md12>
                    <v-btn type="submit" round color="success" dark style="width: 100%; height: 35px; padding-top: 8px; box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)!important;">Checkout</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </smooth-scrollbar>
          </v-tab-item>

          <v-tab-item
            :key="1"
          >
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
            <v-list style="height: calc(100vh - 210px); padding: 0;" two-line>
              <smooth-scrollbar :options='{alwaysShowTracks: true}' style="height: 100%;">
                <template v-for="(item, index) in transactions.filter(e => ( !!!(e.SupCust.firstName).toLowerCase().search(search.toLowerCase()) || !!!(e.SupCust.lastName).toLowerCase().search(search.toLowerCase()) || !!!(e.receiptNumber).toLowerCase().search(search.toLowerCase()) || !!!(e.status).toLowerCase().search(search.toLowerCase())))">
                  <v-list-tile
                    :key="item.title"
                    avatar
                    ripple
                    @click="toggle(index)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.SupCust.firstName + ' ' + item.SupCust.lastName }}</v-list-tile-title>
                      <v-list-tile-sub-title class="text--primary">#{{ item.receiptNumber }}</v-list-tile-sub-title>
                      <v-list-tile-sub-title>{{ item.Orders.map(e => e.Items ? e.Items.descr + ' x' + e.qty + ' ' + e.itemCost : '').toString() }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-list-tile-action-text>₱
                        {{ 
                          (item.Orders.length !== 0) ? 
                            item.Orders.map(e => parseFloat((!!parseInt(e.discount) ? e.discount : e.itemCost)) * parseFloat((e.qty || 0)).toFixed(2))
                              .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2).split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').concat(item.Orders.map(e => parseFloat((e.itemCost || 0)) * parseFloat((e.qty || 0)).toFixed(2))
                              .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2).split(".")[1]? '.' + item.Orders.map(e => parseFloat((e.itemCost || 0)) * parseFloat((e.qty || 0)).toFixed(2))
                              .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2).split(".")[1] : '')
                                : 0 
                        }}
                      </v-list-tile-action-text>
                      <v-icon v-if="item.status !== 'Pending Balance'" style="float: right;color: green">mdi-check-circle-outline</v-icon>
                      <v-icon v-else style="float: right;color: orange">mdi-clock</v-icon>
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
          </v-tab-item>
        </v-tabs>
        <!-- <v-flex xs12 sm12>
          <v-text-field
            v-model="search"
            label="Search"
            solo
            clearable
            prepend-inner-icon="mdi-magnify"
            style="height: 70px; padding: 12px;" 
          >
          </v-text-field>
        </v-flex> -->
      </v-card>
    </v-flex>

    <v-btn v-if="active == 1 && hasBalance" color="orange accent-4" fab dark style="position: fixed; right: 20px; bottom: 10px; z-index: 9; height: 60px ; width: 60px; border-radius: 200px;" @click="checkout_d = true">
      <v-icon>mdi-currency-usd</v-icon>
    </v-btn>

    <v-dialog v-model="dialogo" max-width="450">
      <v-form ref="form" @submit.prevent="submitForm" v-model="valid">
        <v-card>
          <v-card-title class="headline">Add Item to Cart</v-card-title>
            <v-card-text>
              <v-layout align-center>
                <v-flex xs6 md6>
                  {{ selectedItem.descr }}  
                </v-flex>
                <v-flex xs1 md1>
                  <v-text-field label="Qty" ref="selectedQty" v-model="selectedItem.qty" :rules="[v => v !== ''? v <= selectedItem.qtyIn && v != 0? true : 'Qty exceeds available stocks': 'Fill Qty']" @keyup="qtyAvailable = (selectedItem.qty <= selectedItem.qtyIn && selectedItem.qty !== '' && selectedItem.qty != 0)? true: false" required/>
                </v-flex>
                <v-flex xs3 md3 offset-xs1 offset-md1>
                  <v-text-field
                    prefix="₱"
                    name="input-3"
                    label="Total Price"
                    :value="parseFloat(selectedItem.unit_price * selectedItem.qty).toLocaleString(undefined, { minimumFractionDigits: 2 })"
                    disabled
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click.native="dialogo = false">Cancel</v-btn>
            <v-btn type="submit" color="green darken-1" flat="flat" :disabled="!qtyAvailable">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="checkout_d" max-width="450">
      <v-form ref="checkout_form" @submit.prevent="save" v-model="valid">
        <v-card>
          <v-card-title class="headline">Order Checkout</v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 md12 v-if="active == 0">
                  <div style="display: inline-block;">
                    <span style="display: block; margin-top: 5px;">Subtotal:</span>
                    <span style="display: block; margin-top: 5px;">Total Discount:</span>
                    <span style="display: block; font-weight: 500; margin-top: 5px;">Total:</span>
                  </div>
                  <div style="display: inline-block; float: right">
                    <span style="display: block; text-align: right; margin-top: 5px;">₱{{ sub_total }}</span>
                    <span style="display: block; text-align: right; margin-top: 5px;">₱{{ discount_total }}</span>
                    <span style="display: block; font-weight: 500; text-align: right; margin-top: 5px;">₱{{ grand_total }}</span>
                  </div>
                </v-flex>
                <v-flex xs12 md12 v-if="hasBalance" style="text-align: center;">
                  <div style="display: inline-block;">
                    <span style="display: block; font-weight: 500; margin-top: 5px; text-align: center;">Balance</span>
                    <span style="font-size: 21px !important; display: block; font-weight: 500; text-align: center; margin-top: 5px; color: red;">₱{{ parseFloat(parseFloat(grandTotal1) - parseFloat(totalPayment)).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
                  </div>
                </v-flex>
                <v-flex xs12 md12 style="margin-top: 10px;" justify-center>
                  <v-radio-group id="group_payment" v-model="payment_option" @change="paymentChange($event)" row>
                    <v-radio color="info" label="Full Payment" value="1" />
                    <v-radio color="info" label="P.O" value="2" />
                  </v-radio-group>
                  <v-text-field :disabled="payment_option == 1" style="text-align: right;" prefix="₱" id="user_payment" label="Customer Payment" ref="user_payment" v-model="user_payment" :rules="[v => parseFloat(v) >= 0 ? parseFloat(v) <= parseFloat(!hasBalance? grand_total: (parseFloat(grandTotal1) - parseFloat(totalPayment))) || 'Payment Exceeds Full Payment!': 'Invalid payment!']" required/>
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
  
    <smooth-scrollbar :options='{alwaysShowTracks: true}' style="height: 87.5vh;">
      <v-container
        fluid
        grid-list-xl
        fill-height>
        <v-layout
          justify-center
          align-center
        >
          <v-flex 
            xs9
            md9
            offset-xs3
            offset-md3
            >
            <material-card
              color="info"
              title="Purchase Order"
              text="Stocks ordered by the customers"
              style="margin-top: 20px;"
              v-if="active === 0"
            >
              <!-- v-if="active === 0" -->
              <v-text-field
                v-model="search"
                label="Search"
                solo
                clearable
                prepend-inner-icon="mdi-magnify"
                style="height: 70px; padding: 12px 0;" 
                color="info"
              />

              <!-- TABLE  -->
              <v-layout row wrap>
                <v-flex xs9 md9>
                  Filter:
                  <div class="filter-button" :class="(categoryID === -1) ? 'active-filter': ''" @click="filterChange(-1)" style="margin-left: 10px;">
                    <span :id="-1">All</span>
                  </div>

                  <div 
                    class="filter-button"
                    v-for="category in categories"
                    :class="(categoryID === category.id)? 'active-filter': ''"
                    @click="filterChange(category.id)"
                    :key="category.id"
                  >
                    <span :id="category.id">{{ category.descr }}</span>
                  </div>
                </v-flex>

                <v-flex xs3 md3>
                  <v-switch
                    v-model="switch1"
                    label="Available Items"
                    color="success"
                    :value="true"
                    hide-details
                    style="margin-top: 5px; float: right;"
                  />
                </v-flex>
              </v-layout>
              
              <v-data-table
                v-model="selected"  
                :search="search"
                :headers="headers"
                :items="items.filter(e => switch1? e.qtyIn - e.qtyOut !== 0? true: false : true).filter(e => categoryID === -1? true : e.categoryID === categoryID)"
                :pagination.sync="pagination"
                item-key="itemCode"
                hide-actions
              >
                <template slot="headers" slot-scope="props">
                  <tr>
                    <th>
                      <!-- <v-checkbox
                        :input-value="props.all"
                        :indeterminate="props.indeterminate"
                        primary
                        hide-details
                        @click.native="toggleAll"

                      ></v-checkbox> -->
                    </th>
                    <th
                      v-for="header in props.headers"
                      :key="header.text"
                      :class="['column sortable', 'text-xs-' + header.align , pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                      @click="changeSort(header.value)"
                    >
                      <!-- <v-icon small>mdi-arrow-up</v-icon> -->
                      {{ header.text }}
                    </th>
                  </tr>
                </template>

                <template slot="items" slot-scope="props">
                  <tr :active="props.selected">
                    <td>
                      <v-checkbox
                        :input-value="props.selected"
                        primary
                        @click="handleCheckbox($event, !!(props.item.qtyIn - props.item.qtyOut), props.item)"
                        hide-details
                      ></v-checkbox>
                    </td>
                    <td>{{ props.item.itemCode }}</td>
                    <td>{{ props.item.descr }}</td>
                    <td class="text-xs-right">{{ props.item.Category.descr }}</td>
                    <td class="text-xs-right">{{ props.item.UnitMeasure.descr }}</td>
                    <td class="text-xs-right">₱{{ props.item.unit_price.toFixed(2) }}</td>
                    <td class="text-xs-right">{{ props.item.qtyIn - props.item.qtyOut }}</td>
                    <td class="text-xs-right">{{ props.item.criticalLevel }}</td>
                  </tr>
                </template>

                <template v-slot:no-data>
                  <tr>
                    <td colspan=8>
                      <v-img :src="img" height="50" width="50" contain style="margin: 0 auto;"/>
                      <p style="text-align: center;">No Data</p>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </material-card>

            <material-card v-if="selectedOrder > -1">
              <v-layout
                wrap
              >     
                <v-flex xs11 md11 style="padding-top: 0;">
                  <h4 style="font-weight: 400 !important; display: inline-block;">Purchase Order Info</h4>
                </v-flex>
              </v-layout>

              <v-layout
                justify-center
                wrap
                style="margin: auto -16px; background-color: #e9eae9"
              >      
                <v-flex xs3 style="border: 1px solid #E0E0E0; padding: 15px 10px;">
                  <small style="font-weight: 500; color: #909090; font-size: 75%;">RECEIPT NUMBER</small><br />
                  <p style="display: inline-block; font-size: 15.5px !important; font-weight: 400;">{{ transactions[selectedOrder].receiptNumber }}</p>
                  <v-icon style="float: right;">mdi-pound</v-icon>
                </v-flex>

                <v-flex xs3 style="border: 1px solid #E0E0E0; padding: 15px 10px;">
                  <small style="font-weight: 500; color: #909090; font-size: 75%;">SUPPLIER</small><br />
                  <p style="display: inline-block; font-size: 15.5px !important; font-weight: 400;">{{ transactions[selectedOrder].SupCust.firstName + ' ' + transactions[selectedOrder].SupCust.lastName }}</p>
                  <v-icon style="float: right;">mdi-package-variant</v-icon>
                </v-flex>

                <v-flex xs3 style="border: 1px solid #E0E0E0; padding: 15px 10px;">
                  <small style="font-weight: 500; color: #909090; font-size: 75%;">STATUS</small><br />
                  <p style="display: inline-block; font-size: 15.5px !important; font-weight: 400;" :style="{color: (transactions[selectedOrder].status !== 'Pending Balance')? 'green': 'orange'}">{{ transactions[selectedOrder].status }}</p>
                  <v-icon v-if="transactions[selectedOrder].status !== 'Pending Balance'" style="float: right;color: green">mdi-check-circle-outline</v-icon>
                  <v-icon v-else style="float: right;color: orange">mdi-clock</v-icon>
                </v-flex>

                <v-flex xs3 style="border: 1px solid #E0E0E0; padding: 15px 10px;">
                  <small style="font-weight: 500; color: #909090; font-size: 75%;">DATE</small><br />
                  <p style="display: inline-block; font-size: 15.5px !important; font-weight: 400;">{{ new Date(transactions[selectedOrder].createdAt).toString().split(' ')[0] + ' ' + new Date(transactions[selectedOrder].createdAt).toString().split(' ')[1] + ' ' + new Date(transactions[selectedOrder].createdAt).toString().split(' ')[2] + ' ' + new Date(transactions[selectedOrder].createdAt).toString().split(' ')[3] }}</p>
                  <v-icon style="float: right;">mdi-calendar-range</v-icon>
                </v-flex>
              </v-layout>
              
              <v-tabs
                v-model="activeTab"
                color="transparent"
                dark
                slider-color="transparent"
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
                    :headers="headers2"
                    :items="transactions[selectedOrder].Orders"
                    hide-actions
                  >
                    <template v-slot:items="props">
                      <td>
                        {{ props.item.Items.descr }}<br />
                        <span style="color: gray;">{{ props.item.Items.itemCode }}</span>
                      </td>
                      <td :style="{textDecoration: !!!parseInt(props.item.discount)? 'initial': 'line-through', color: !!!parseInt(props.item.discount)? 'initial': 'rgba(0,0,0,.54)'}">₱{{ props.item.itemCost.toFixed(2) }}</td>
                      <td>₱{{ props.item.discount.toFixed(2) }}</td>
                      <td>{{ props.item.qty }}</td>
                      <td>
                        <span v-if="!!parseInt(props.item.discount)">₱{{ parseFloat(parseFloat((!!parseInt(props.item.discount) ? props.item.discount : props.item.itemCost)) * parseFloat(props.item.qty)).toFixed(2).toLocaleString() }}<br /></span>
                        <span :style="{textDecoration: !!!parseInt(props.item.discount)? 'initial': 'line-through', color: !!!parseInt(props.item.discount)? 'initial': 'rgba(0,0,0,.54)'}">₱{{ (parseFloat(props.item.itemCost) * parseFloat(props.item.qty) !== 0 && !!(parseFloat(props.item.itemCost) * parseFloat(props.item.qty)))? (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ((parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1]? '.' + (parseFloat(props.item.itemCost) * parseFloat(props.item.qty)).toFixed(2).split(".")[1] : '') : 0 }}</span>
                      </td>
                      <!-- <td v-if="transactions[selected].status === 'Pending'" class="justify-center layout px-0 py-0">
                        <v-btn icon class="mx-0" @click="editItem(props.item)">
                          <v-icon color="teal">mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                          <v-icon color="pink">mdi-delete</v-icon>
                        </v-btn>
                      </td> -->
                      <td></td>
                    </template>
                    
                    <template v-slot:no-data>
                      <v-img :src="img" height="50" width="50" contain style="margin: 0 auto;"/>
                      <p style="text-align: center;">No Data</p>
                    </template>

                    <template slot="footer">
                      <td style="padding: 5px 8px;">
                      </td>
                      <td></td>
                      <td colspan="2" style="text-align: right; padding: 12px 8px; color: rgba(0,0,0,.54);">
                        <strong>Discount Received</strong><br />
                        <strong>Grand Total</strong><br />
                      </td>
                      <td colspan="2" style="padding: 12px 8px;">
                        <strong>₱{{ transactions[selectedOrder].Orders.map(e => e.discount ? (parseFloat(e.itemCost) * parseFloat(e.qty)) - (parseFloat((e.discount || 0)) * parseFloat(e.qty)): 0).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2) }}</strong><br />
                        <strong style="font-size: 14px;">₱ {{ (grandTotal1 - totalPayment).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</strong><br />
                      </td>
                    </template>
                  </v-data-table>
                </v-tab-item>

                <v-tab-item
                  :key="1"
                >
                  <v-data-table
                    :headers="headers3"
                    :items="transactions[selectedOrder].Payments"
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
                        <strong>₱{{ totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</strong><br />
                        <strong style="font-size: 14px; color: red !important;">₱ {{ (grandTotal1 - totalPayment).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</strong><br />
                      </td>
                      <td colspan="3"></td>
                    </template>
                  </v-data-table>
                </v-tab-item>
              </v-tabs>

              <button ref="submitForm" style="visibility: hidden;" type="submit">asdqw</button>
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
    hasBalance: false,
    activeTab: 0,
    amount_received: '',
    payment_error: false,
    amount_payment: 0,
    user_payment: 0,
    payment_option: '1',
    sub_total: '0.00',
    discount_total: '0.00',
    grand_total: '0.00',
    qtyAvailable: false,
    checkout_d: false,
    discountOption: false,
    valid: false, 
    dialogo: false,
    switch1: true,
    categoryID: -1,
    selectedItem: {
      descr: '',
      qty: ''
    },
    valid: false,
    search: '',
    active: 0,
    dialog: false,
    img: './img/empty.svg',
    itemsHeader: [
      { text: 'descr', value: 'descr', align: 'left' },
      { text: 'Fat (g)', value: 'qty', align: 'left' },
      { text: 'Carbs (g)', value: 'price', align: 'left' },
    ],
    headers: [
      { text: 'Item Code', value: 'itemCode', align: 'left' },
      { text: 'Description', value: 'descr', align: 'left' },
      { text: 'Category', value: 'category', align: 'right' },
      { text: 'Unit Measure', value: 'unitMeasure', align: 'right' },
      { text: 'Unit price', value: 'itemCost', align: 'right' },
      { text: 'Qty', value: 'qty', align: 'right' },
      { text: 'Critical Level', value: 'criticalLevel', align: 'right' },
    ],
    headers2: [
      { text: 'Item', value: 'itemID', sortable: false, align: 'left' },
      { text: 'Cost', value: 'itemCost', sortable: false, align: 'left' },
      { text: 'Discounted Amt', value: 'discount', sortable: false, align: 'left' },
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
    desserts: [],
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
    selected: [],
    selectedOrder: -1,
    title: '',
    style: {
      position: 'fixed',
      top: '116px',
      left: '284px',
      height: '100%',
      width: '18%',
      zIndex: 9,
      transition: 'all 100ms ease-in'
    },
    error: {
      receiptNumber: ''
    },
    pagination: {
      sortBy: 'name',
    },
  }),

  mounted() {
    if (!this.drawer) {
      this.style.left = '104px'
      this.style.width = '21%'
    } else  {
      this.style.left = '284px'
      this.style.width = '18%'
    }
  },


  computed: {
    ...mapState('app', ['drawer']),
    ...mapState(['supcust', 'items', 'transactions', 'categories', 'unitMeasures', 'user']),

    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },

    grandTotal1() {
      console.log(this.selectedOrder)
      let total = (this.transactions[this.selectedOrder].Orders.length !== 0) ? 
        this.transactions[this.selectedOrder].Orders.map(e => parseFloat((e.discount !== 0? e.discount: e.itemCost || 0)) * parseFloat((e.qty || 0)).toFixed(2))
          .reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0))))
            : 0
            console.log((2+''+total.toFixed(2).split(".")[1]? '.' + total.toFixed(2).split(".")[1] : ''))
      return total !== 0? total : '0.00'
    },

    totalPayment() {
      return this.transactions[this.selectedOrder].Payments.length !== 0? this.transactions[this.selectedOrder].Payments.map(e => e.customer_payment).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2) : 0
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },

    selectedOrder (val) {
      console.log(this.selectedOrder)
    },

    selected (val) {
      if (val.length !== 0 && val.length !== null) {
        this.sub_total = val.length !== 0 ? val.map(e => parseFloat(e.unit_price) * parseFloat(e.qty).toFixed(2)).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2): '0.00'
        this.discount_total = val.length !== 0 ? val.map(e => e.discount ? (parseFloat(e.unit_price) * parseFloat(e.qty)) - (parseFloat((e.discount || 0)) * parseFloat(e.qty)): 0).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2): '0.00'
        this.grand_total = val.length !== 0 ? val.map(e => e.discount ? parseFloat(e.discount || 0) * parseFloat(e.qty): parseFloat(e.unit_price) * parseFloat(e.qty)).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2): '0.00'
        this.user_payment = this.grand_total
      }
    },

    active (val) {
      if (val === 0) {
        this.selectedOrder = -1
        this.hasBalance = false
      }
    },

    'drawer' (val) {
      if (!val) {
        this.style.left = '104px'
        this.style.width = '21%'
      } else  {
        this.style.left = '284px'
        this.style.width = '18%'
      }
    },

    'items' (val) {
      if (val) 
        this.pagination.rowsPerPage = val.length
    },

    'supcust' (val) {
      if (val) 
        this.editedItem.supCustID = val[0].id
    },

    'editedItem.receiptNumber' (val) {
      if (val && this.error.receiptNumber !== '') 
        this.error.receiptNumber = ''
    },

    // payment_option (val) {
    //   if (val == 1 && this.hasBalance === false){
    //     this.user_payment = this.hasBalance === false? parseFloat(this.grand_total).toFixed(2) : parseFloat(this.grand_total1 - this.totalPayment).toFixed(2)
    //   }
    // },

    user_payment (val) {
      this.payment_option = parseFloat(val) == parseFloat(!this.hasBalance? parseFloat(this.grand_total).toFixed(2): (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)).toFixed(2))? '1': '2'
      this.payment_error = parseFloat(val).toFixed(2) <= parseFloat(!this.hasBalance? parseFloat(this.grand_total).toFixed(2): (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)).toFixed(2))
    },

    checkout_d (val) {
      // if (val) {
        this.payment_option = '1'
        this.user_payment = this.hasBalance === false? this.payment_option == 1? parseFloat(this.grand_total).toFixed(2) : (parseFloat(this.grand_total) / 2).toFixed(2) : this.payment_option == 1? (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)).toFixed(2) : ((parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)) / 2).toFixed(2) 
      // }
    },

  },

  created () {
    this.initialize()
  },

  methods: {
    ...mapMutations('app', ['setSnackbar']),

    initialize () {
      this.$store.dispatch('FETCH_STOCKIN', { type: 'OUT', user_type: 'Customer' })      
    },

    toggle (index) {
      if (this.transactions[index].status !== 'Fully Paid')
        this.hasBalance = true;
      else 
        this.hasBalance = false

      this.selectedOrder = index
      this.close()
    },

    // loadOrders () {
    //   this.$store.dispatch('FETCH_STOCKIN', { type: 'OUT' })            
    // },

    paymentChange (event) {
      console.log(this.grand_total)
      this.user_payment = this.hasBalance === false? event == 1? parseFloat(this.grand_total).toFixed(2) : (parseFloat(this.grand_total) / 2).toFixed(2) : event == 1? (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)).toFixed(2) : ((parseFloat(this.grandTotal1) - parseFloat(this.totalPayment)) / 2).toFixed(2) 
    },

    changeDiscount (discount) {
      this.discount_total = this.selected.length !== 0 ? this.selected.map(e => e.discount ? (parseFloat(e.unit_price) * parseFloat(e.qty)) - (parseFloat((e.discount || 0)) * parseFloat(e.qty)): 0).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2): '0.00'
      this.grand_total = this.selected.length !== 0 ? this.selected.map(e => e.discount ? parseFloat(e.discount || 0) * parseFloat(e.qty): parseFloat(e.unit_price) * parseFloat(e.qty)).reduce((total, num) => (parseFloat((total || 0)) + parseFloat((num || 0)))).toFixed(2): '0.00'
      this.user_payment = this.grand_total
    },

    editQty (type, id) {
      this.selected = this.selected.map(e => e.id === id? {...e, qty: type === 'add'? (e.qty < e.qtyIn)? ++e.qty : e.qty : e.qty != 1 ? --e.qty : e.qty } : {...e})
    },

    submitForm () {
      if (this.$refs.form.validate()) {
        this.dialogo = false
        this.selected.push({...this.selectedItem, discount: 0})  
      }
    },

    filterChange (id) {
      this.categoryID = id
    },

    handleCheckbox (event, isStockAvailable, item) {
      if (!isStockAvailable){
        this.setSnackbar({ show: true, type: 'error', text: `Item is out of stock!`})
        event.stopPropagation()
      } else {
        if(!this.selected.find(e => e.id === item.id)) {
          this.selectedItem = {
            ...item,
            qty: ''
          }

          this.dialogo = true
          setTimeout(() => {
            this.$refs.selectedQty.focus()
          }, 200);
          event.stopPropagation()
        }
      }
    },

    toggleAll () {  
      console.log(this.active)
      if (this.active == 0) {
        if (this.selected.length !== 0) this.selected = [] 
        else this.selected = this.items
      }
    },
    
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },

    close () {
      this.dialog = false
      this.checkout_d = false
      setTimeout(() => {
        this.toggleAll()
        this.editedItem = Object.assign({}, this.defaultItem) 
        this.user_payment = ''
        this.amount_received = ''
        this.payment_error = false
        this.payment_option = '1'
        this.sub_total = '0.00'
        this.discount_total = '0.00'
        this.grand_total = '0.00'
        this.selectedItem = {
          descr: '',
          qty: ''
        }
        this.$refs.formation.reset()
      }, 300)
    },

    checkout () {
      if (this.$refs.formation.validate()) {
        if (this.selected.length !== 0)
          this.checkout_d = true
        else 
          this.setSnackbar({ show: true, type: 'error', text: `There should be atleast 1 item to be able to checkout! `})
      }
    },

    save () {
      if (this.$refs.checkout_form.validate()) {
        const payload = !this.hasBalance? {
          ...this.editedItem, 
          payment: false, 
          type: 'OUT', 
          userID: this.user.id, 
          status: this.payment_option == 2 ? 'Pending Balance' : 'Fully Paid',
          Payments: [{ 
            customer_payment: this.user_payment, 
            amount_received: this.amount_received, 
            customer_change: (parseFloat(this.amount_received) - parseFloat(this.user_payment)).toFixed(2)  
          }], 
          Orders: this.selected.map(e => {
            const {id, unit_price, ...payload} = e
            return {...payload, itemID: id, itemCost: unit_price}
          })
        } : {
          id: this.transactions[this.selectedOrder].id,
          payment: true, 
          type: 'OUT', 
          status: parseFloat(this.user_payment) == (parseFloat(this.grandTotal1) - parseFloat(this.totalPayment))? 'Fully Paid': 'Pending Balance',
          Payments: [{
            transaction_id: this.transactions[this.selectedOrder].id,
            customer_payment: this.user_payment, 
            amount_received: this.amount_received, 
            customer_change: (parseFloat(this.amount_received) - parseFloat(this.user_payment)).toFixed(2)
          }],
          Orders: this.transactions[this.selectedOrder].Orders
        };
        this.$store.dispatch('CREATE_STOCKIN', payload).then(e => {
          this.hasBalance = payload.status !== 'Fully Paid'
          this.close()
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
  #purchaseorder table thead {
    display: none;
  }

  #purchaseorder table tbody tr {
    overflow: hidden;
    border: none !important;
  }

  #purchaseorder tbody tr div:hover .hover-item {
    margin-top: 0 !important;
  }

  #itemss {
    border-top: 1px solid #e3e3e3;
    border-top: 1px solid #e3e3e3;
  }

  #purchaseorder .v-tabs__container.v-tabs__container--grow {
    width: 100%;
  }

  #purchaseorder .warning--text {
    color: #FFCC00 !important;
    caret-color: #FFCC00 !important;
  }

  #purchaseorder .v-input--radio-group__input label {
    color: #FFF !important;
  }

  #purchaseorder .v-input--radio-group .v-radio {
    margin: auto !important;
  }

  .hover-item {
    z-index: 9;
    color: #FFF;
    width: 100%;
    margin-top: 100px;
    padding-top: 7px !important;
    text-align: center;
    position: absolute;
    transition: all 150ms;
    height: 100% !important;
    background: linear-gradient(60deg, #26c6da, #00acc1) !important;
  }

  .btn-edit-item:nth-of-type(1):hover i {
    color: green !important;
  }

  .btn-edit-item:nth-of-type(2):hover i {
    color: red !important;
  }

  .filter-button-container { 
    display: inline-block;
  }

  .filter-button {
    padding: 6px 12px;
    margin-right: 10px;
    border-radius: 5px;
    display: inline-block;
    transition: all 150ms;
  }

  .clickable:hover {
    cursor: pointer;
  }

  .clickable.trash:hover {
    color: #FF2D55 !important;
  }

  .clickable.tag:hover {
    color: #FFCC00 !important;
  }

  .discount-option {
    opacity: 0;
    margin-top: -55px;
    transition: all 150ms;
  }

  .discount-active {
    opacity: 1;
    margin-top: 0px;
  }

  .filter-button:hover {
    cursor: pointer;
    transform: scale(1.02);
    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12)!important;
  }

  .v-messages__message {
    white-space: nowrap;
  }

  .v-text-field__details {
    overflow: visible;
  }

  .v-input__control {
    width: 100% !important;
  }
</style>