<template>
  <v-row>
    <v-col
        v-for="n in 9"
        :key="n"
        class="d-flex child-flex"
        cols="4"
    >
      <v-card>
        <v-card-text>
          <v-img
              :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
              :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
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
          </v-img>
          <br>
          <span>
            <b>Minggu, 11 Juni 2023 - 18:57:04</b>&nbsp;<v-icon color="success">mdi-check-circle</v-icon>
            <p>Semoga lancar ya pak...</p>
          </span>
        </v-card-text>
      </v-card>

    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ImageGallery"
}
</script>

<style scoped>

</style>
