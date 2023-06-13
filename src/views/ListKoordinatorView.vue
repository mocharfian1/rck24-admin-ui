<template>
  <v-container>
    <v-row class="ml-3 mr-3 mt-2">
      <v-col cols="12" style="padding-top: 0; padding-bottom: 0;">
        <v-toolbar flat style="padding-bottom: 0;" height="68">
          <v-toolbar-title style="font-weight: bolder">Daftar Koordinator</v-toolbar-title>
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
          <v-row>
            <v-col>
              <v-btn color="success" @click="addFunc" >
                <v-icon>mdi-plus-circle</v-icon>&nbsp;Tambah Koordinator
              </v-btn>
            </v-col>
            <v-col class="d-flex text-right">
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
            </v-col>
          </v-row>
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
            <template v-slot:[`item.action`]="{ item }">
              <v-btn @click="editFunc($event, item)" icon :loading="item.loading">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogAdd" width="400" persistent>
      <v-card class="pb-5">
        <v-card-title>Tambah Koordinator</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="addModel.code" label="KODE" prepend-icon="mdi-barcode"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="addModel.nama_lengkap" label="Nama Koordinator" prepend-icon="mdi-account"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="addModel.telp" label="Telp" prepend-icon="mdi-phone"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea v-model="addModel.alamat_lengkap" label="Alamat" prepend-icon="mdi-google-maps"></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="addEdit === 'ADD'" :loading="userStore.loading_submit" @click="submitAddKoordinator" color="success"><v-icon>mdi-plus-circle</v-icon>&nbsp;Tambah</v-btn>
          <v-btn v-if="addEdit === 'EDIT'" :loading="userStore.loading_submit" @click="submitAddKoordinator" color="warning"><v-icon>mdi-plus-circle</v-icon>&nbsp;Edit</v-btn>
          <v-btn @click="dialogAdd = false"><v-icon>mdi-cancel</v-icon>&nbsp;Close</v-btn>
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
  name: "ListKoordinatorView",
  data: () => ({
    addEdit: 'ADD',
    dialogAdd: false,
    addModel: {
      code: null,
      nama_lengkap: null,
      telp: null,
      alamat_lengkap: null
    },
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
        text: 'Daftar Koordinator',
        disabled: true,
      }
    ],
    headers: [
      {
        text: 'Kode',
        align: 'start',
        sortable: false,
        value: 'code',
        class: 'cyan darken-4 white--text'
      },
      {text: 'Nama Lengkap', value: 'nama_lengkap', class: 'cyan darken-4 white--text'},
      {text: 'Telp', value: 'telp', class: 'cyan darken-4 white--text'},
      {text: 'Alamat Lengkap', value: 'alamat_lengkap', class: 'cyan darken-4 white--text'},
      { text: 'Action', value: 'action', class: 'cyan darken-4 white--text' }
    ],
  }),
  mounted() {
    this.clearData()
  },
  methods: {
    addFunc(){
      this.dialogAdd = true;
      this.addEdit = 'ADD'
      this.addModel = {}
    },
    editFunc(ev, item){
      this.addEdit = 'EDIT'
      this.dialogAdd = true
      this.addModel = { ...item }
    },
    updatePage(options){
      this.$store.dispatch('userStore/getListAllKoordinator', {
        url: 'https://rck24-admin-be.mobileapi.masuk.id',
        ...options,
        filter: this.filter
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
    closeNotification(){
      this.$store.dispatch('userStore/closeNotification')
    },
    async submitAddKoordinator(){
      const submit = await this.$store.dispatch('userStore/submitAddKoordinator', {
        url: 'https://rck24-admin-be.mobileapi.masuk.id',
        body: this.addModel
      });

      if(submit.closeDialog){
        this.dialogAdd = false
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
