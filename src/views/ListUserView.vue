<template>
  <v-container>
    <v-row class="ml-3 mr-3 mt-2">
      <v-col cols="12" style="padding-top: 0; padding-bottom: 0;">
        <v-toolbar flat style="padding-bottom: 0;" height="68">
          <v-toolbar-title style="font-weight: bolder">Daftar Pengguna</v-toolbar-title>
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
              <v-btn x-small :color="STATUS[item.status]">{{ STATUS_TEXT[item.status] }}</v-btn>
            </template>
            <template v-slot:[`item.act`]="{ item }">
              <v-btn icon @click="getImagesByNik(item)">
                <v-icon>mdi-fullscreen</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-col>
    </v-row>
    <v-dialog v-model="gallery" scrollable :width="userStore.loading ? 200:(userStore.data_images_count === 0 ? 400 : '')">
      <v-card v-if="userStore.loading">
        <v-card-text class="pa-10">
          <v-progress-circular
              indeterminate
              color="green"
              size="50"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <v-card-title>Image Gallery</v-card-title>
        <v-card-text>
          <v-row v-if="userStore.data_images_count === 0">
            <v-col>
              Belum ada unggahan foto.
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col
                v-for="item in userStore.data_images" v-bind:key="item.id"
                class="d-flex child-flex"
                cols="4"
            >
              <v-card>
                <v-card-text>
                  <v-img
                      :src="`https://rck24.bucket.mobileapi.masuk.id/${item.filename}`"
                      aspect-ratio="1"
                      class="grey lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                      >
                        <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                    <template v-slot:default>
                      <div class="d-flex align-end justify-center fill-height">
                        <v-btn rounded class="mb-3 mr-3" color="white" @click="openImage(item.filename)">
                          <v-icon color="success">mdi-fullscreen</v-icon>&nbsp;Buka Foto
                        </v-btn>
                        <v-btn rounded class="mb-3 mr-3" color="white" @click="submitVerifyImage(item.code)">
                          <v-icon color="success">mdi-check-circle</v-icon>&nbsp;Tandai konfirmasi
                        </v-btn>
                      </div>
                    </template>
                  </v-img>
                  <br>
                  <span>
                    <b>{{ toDateTime(item.created_at) }}</b>&nbsp;<v-icon :color="STATUS_IMAGE[item.status]">{{ STATUS_IMAGE_ICON[item.status] }}</v-icon>
                    <p>{{ item.message }}</p>
                  </span>
                  </v-card-text>
                </v-card>

              </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="gallery = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'
import { STATUS, STATUS_TEXT, STATUS_IMAGE_ICON, STATUS_IMAGE } from '@/helper/constants'
import moment from 'moment'

export default {
  name: "ListUserView",
  data: () => ({
    gallery: false,
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
        text: 'Daftar Pengguna',
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
      {text: 'Action', value: 'act', class: 'cyan darken-4 white--text'},
    ],
  }),
  mounted() {
    this.clearData()
  },
  methods: {
    openImage(i){
      window.open('https://rck24.bucket.mobileapi.masuk.id/'+i)
    },
    updatePage(options){
      this.$store.dispatch('userStore/getListAllUser', {
        url: 'https://rck24-admin-be.mobileapi.masuk.id',
        ...options,
        filter: this.filter
      })
    },
    async getImagesByNik(item){
      await this.clearDataImages();
      this.gallery = true
      await this.$store.dispatch('userStore/getImagesByNik', {
        url: 'https://rck24-admin-be.mobileapi.masuk.id',
        no_ktp: item.no_ktp
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
    clearDataImages(){
      return this.$store.dispatch('userStore/clearDataImages')
    },
    toDateTime(v){
      return moment(v).locale('id').format('DD MMMM YYYY - hh:mm:ss');
    },
    async submitVerifyImage(code){
      const submitChangeStatus = await this.$store.dispatch('userStore/verifyImage', {
        url: 'https://rck24-admin-be.mobileapi.masuk.id',
        code
      })

      if(submitChangeStatus.closeDialog){
        this.dialogVerifikasiUser = false
      }
    }
  },
  computed: {
    ...mapState(['userStore']),
    STATUS(){
      return STATUS;
    },
    STATUS_IMAGE(){
      return STATUS_IMAGE;
    },
    STATUS_TEXT(){
      return STATUS_TEXT;
    },
    STATUS_IMAGE_ICON(){
      return STATUS_IMAGE_ICON;
    }
  }
}
</script>

<style scoped>

</style>
