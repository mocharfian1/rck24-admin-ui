<template>
  <v-container>
    <v-row class="ml-3 mr-3 mt-2">
      <v-col cols="12" style="padding-top: 0; padding-bottom: 0;">
        <v-toolbar flat style="padding-bottom: 0;" height="68">
          <v-toolbar-title style="font-weight: bolder">Daftar Pengguna (Pending Verification)</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-breadcrumbs :items="breadcrumbsItems"></v-breadcrumbs>
      </v-col>
      <v-col><v-divider></v-divider></v-col>
    </v-row>
    <v-row class="pl-6 pr-6">
      <v-col cols="12">
        <v-container fluid>
          <v-text-field
              label="Cari"
              placeholder="Cari Kata"
              dense
              outlined
              style="width: 300px"
              append-icon="mdi-magnify"
              v-model="filter"
              @click:append="updatePage(options)"
              @keydown="enterSearch"
          />
          <v-data-table dense
                        :loading="userStore.loading"
                        id="dataUpload"
                        light
                        @update:options="updatePage"
                        :headers="headers"
                        :items="userStore.data_user"
                        :items-per-page="10"
                        :server-items-length="userStore.data_count"
                        :options.sync="options"
                        item-key="fileName"
                        :footer-props="{
                  itemsPerPageOptions: [1, 2, 10, 20],
                  showCurrentPage: true,
                  showFirstLastPage: true
                }">
            <template v-slot:[`item.no_ktp`]="{ item }">
              <span class="blue--text text--darken-4 font-weight-bold">{{ item.no_ktp }}</span>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-btn @click="verifyUser(item)" x-small :color="STATUS[item.status]">{{ STATUS_TEXT[item.status] }}</v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogVerifikasiUser" width="400">
      <v-card>
        <v-card-title>Verifikasi User&nbsp;<v-icon color="warning">mdi-alert</v-icon></v-card-title>
        <v-card-text>Anda ingin memverifikasi user ini?</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="userStore.loading_submit" small color="success" @click="submitVerifyUser">Ya</v-btn>
          <v-btn small @click="dialogVerifikasiUser = false">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
        v-model="userStore.notification.show"
        :color="userStore.notification.color"
        right
        :timeout="3000"
        top
    >
      {{ userStore.notification.text }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" dark text @click="closeNotification"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'
import { STATUS, STATUS_TEXT } from '../helper/constants'

export default {
  name: "ListUserPendingView",
  data: () => ({
    userId: null,
    dialogVerifikasiUser: false,
    filter: '',
    options: {},
    breadcrumbsItems: [
      {
        text: 'Dashboard',
        disabled: true,
      },
      {
        text: 'User Management',
        disabled: true,
      },
      {
        text: 'Verifikasi User',
        disabled: true,
      }
    ],
    headers: [
      {
        text: 'KTP',
        align: 'start',
        sortable: false,
        value: 'no_ktp',
        class: 'cyan darken-4 white--text'
      },
      {text: 'Nama Lengkap', value: 'nama_lengkap', class: 'cyan darken-4 white--text'},
      {text: 'Telp', value: 'telp', class: 'cyan darken-4 white--text'},
      {text: 'Alamat Lengkap', value: 'alamat_lengkap', class: 'cyan darken-4 white--text'},
      {text: 'Status', value: 'status', class: 'cyan darken-4 white--text'},
    ],
  }),
  mounted() {
    this.clearData()
  },
  methods: {
    verifyUser(item){
      this.userId = item.id
      this.dialogVerifikasiUser = true
    },
    updatePage(options){
      this.$store.dispatch('userStore/getListAllUser', {
        url: 'https://rck24-admin-be.mobileapi.masuk.id',
        ...options,
        pendingFilter: {
          filter: this.filter,
          status: 'PENDING'
        }
      })
    },
    enterSearch(ev){
      if(ev.key === 'Enter'){
        this.updatePage(this.options)
      }
    },
    clearData(){
      this.$store.dispatch('userStore/clearData')
    },
    async submitVerifyUser(){
      const submitChangeStatus = await this.$store.dispatch('userStore/changeStatus', {
        url: 'https://rck24-admin-be.mobileapi.masuk.id',
        id: this.userId,
        status: 'VERIFIED'
      })

      if(submitChangeStatus.closeDialog){
        this.dialogVerifikasiUser = false
        this.updatePage(this.options)
      }
    }
  },
  computed: {
    ...mapState(['userStore']),
    STATUS(){
      return STATUS;
    },
    STATUS_TEXT(){
      return STATUS_TEXT;
    }
  }
}
</script>

<style scoped>

</style>
