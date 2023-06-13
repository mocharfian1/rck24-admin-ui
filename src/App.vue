<template>
  <v-app>
    <v-navigation-drawer
        width="320"
        v-model="drawer"
        :mini-variant="variant"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
        color="cyan darken-4"
    >
      <v-list dense>
        <v-list-item router to="/">
          <v-list-item-action>
            <v-icon color="white">mdi-chart-bar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <template v-for="menu in parentMenu">
          <v-list-group
              :key="menu.menuCode"
              no-action
              color="white"
              v-if="menu.hasOwnProperty('subMenu')"
          >
            <template v-slot:prependIcon>
              <v-icon color="white">mdi-adjust</v-icon>
            </template>
            <template v-slot:appendIcon>
              <v-icon color="white">mdi-arrow-down-drop-circle</v-icon>
            </template>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title class="white--text">{{ menu.menuText }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="subMenu in menu.subMenu" :key="subMenu.id" :to="{ path: subMenu.routeName }" router exact>
              <v-list-item-action v-if="subMenu.icon">
                <v-icon color="white">{{ subMenu.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="white--text" v-text="subMenu.text" />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-if="!menu.hasOwnProperty('subMenu')" router :to="{ path: menu.routeName }" :key="menu.menuCode">
            <v-list-item-action>
              <v-icon color="white">{{ menu.menuIcon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="white--text">{{ menu.menuText }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

      </v-list>
    </v-navigation-drawer>
    <v-app-bar
        v-if="true"
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        color="cyan darken-4"
        dark

    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <h1><i>RCK-24</i></h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn
          target="_blank"
          text
          @click="logoutClick"
      >
        <span class="mr-2">Keluar</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    variant: false,
    drawer: null,
    group: null,
    items: []
  }),
  methods: {
    logoutClick(){
      alert('Logout')
    }
  },
  computed: {
    parentMenu(){
      return [
        {
          menuCode: 'USERMANAGEMENT',
          menuText: 'User Management',
          subMenu: [
            {
              id: 'LISTUSER',
              routeName: '/list_user',
              icon: 'mdi-account-group',
              text: 'Daftar User'
            },
            {
              id: 'LISTKOORDINATOR',
              routeName: '/list_koordinator_user',
              icon: 'mdi-account-alert',
              text: 'Daftar Koordinator'
            },
            {
              id: 'VERIFIKASIUSER',
              routeName: '/list_pending_user',
              icon: 'mdi-account-check',
              text: 'Verifikasi User'
            }
          ]
        }
      ]
    }
  }
};
</script>
