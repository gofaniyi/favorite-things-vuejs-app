<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <v-flex mt-3 mb-5>
            <div class="col-sm-10">
                <h2>Favorites
                  <v-dialog v-model="historyDialog" transition="dialog-bottom-transition">
            <template v-slot:activator="{ on }">
                <v-btn color="warning" outline dark v-on="on" style="float:right">View Audit Logs</v-btn>
            </template>
            <v-card>
                <v-toolbar dark color="primary">
                <v-toolbar-title>Favorite Audit Logs</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon dark @click="historyDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar-items>
                </v-toolbar>
                <v-data-table v-if="audits"
                    :headers="auditHeaders"
                    :items="audits"
                    class="elevation-1"
                >
                    <template v-slot:items="props">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.activity }}</td>
                    <td>{{ props.item.createdDate | formatDate }}</td>
                    </template>
                </v-data-table>
            </v-card>
            </v-dialog></h2>
            </div>
        </v-flex>
        <v-flex mt-4>
            <v-btn color="primary" @click="redirectToAddFavorite">Add New Favorite</v-btn>
        </v-flex>
      </div>
      <progress-dialog :waitingDialog=waitingDialog></progress-dialog>

      <v-dialog v-if="selectedFavorite" v-model="viewDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Favorite Information</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">Title:</label>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">{{ selectedFavorite.title }}</label>
                  </v-flex>
              </v-flex>
              <v-flex xs12 sm6 md4>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">Category:</label>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">{{ selectedFavorite.category.name }}</label>
                  </v-flex>
              </v-flex>
              <v-flex xs12 sm6 md4>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">Ranking:</label>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">{{ selectedFavorite.ranking | toOrdinal }}</label>
                  </v-flex>
              </v-flex>
              <v-flex xs12 sm6 md4>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">Created Date:</label>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">{{ selectedFavorite.createdDate | formatDate }}</label>
                  </v-flex>
              </v-flex>
              <v-flex xs12 sm6 md4>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">Modified Date:</label>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">{{ selectedFavorite.modifiedDate | formatDate }}</label>
                  </v-flex>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-flex xs12 sm12 md12>
                    <label class="subheading">Description:</label>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <label class="subheading">{{ selectedFavorite.description }}</label>
                  </v-flex>
              </v-flex>

              <v-flex xs12 sm12 md12>
                <v-flex xs12 sm12 md12>
                    <label class="subheading">MetaData:</label>
                  </v-flex>
                  <v-flex v-if="selectedFavorite.metaData && Object.keys(selectedFavorite.metaData).length == 0">
                    No MetaData
                  </v-flex>
                  <v-flex v-for="(field, index) in selectedFavorite.metaData" :key=index xs12 sm12 md12>
                    <label class="subheading">{{ index }}: {{ field }}</label>
                  </v-flex>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-dialog v-model="deleteDialog" persistent max-width="290">
        <v-card>
            <v-card-title class="body-2"
                >Delete Favorite</v-card-title
            >
            <v-divider></v-divider>
            <v-card-text
                >Do you want to remove this favorite?</v-card-text
            >
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary darken-1"
                    @click="deleteFavorite(selectedFavorite)"
                    >Yes</v-btn
                >
                <v-btn
                    color="grey darken-1"
                    outline
                    @click="deleteDialog = false"
                    >No</v-btn
                >
            </v-card-actions>
        </v-card>
      </v-dialog>
      <v-flex mt-4>
          <v-data-table v-if="favorites"
            :headers="headers"
            :items="favorites"
            class="elevation-1"
        >
            <template v-slot:items="props">
              <td>{{ props.item.title }}</td>
              <td>{{ props.item.category.name }}</td>
              <td>{{ props.item.ranking | toOrdinal }}</td>
              <td>{{ props.item.description }}</td>
              <td>{{ props.item.createdDate | formatDate }}</td>
              <td>{{ props.item.modifiedDate | formatDate }}</td>
              <td class="justify-center layout px-0">
                <v-icon
                  small
                  class="mr-2"
                  @click="openViewDialog(props.item)"
                >
                  visibility
                </v-icon>
                <v-icon
                  small
                  class="mr-2"
                  @click="redirectToEditFavorite(props.item)"
                >
                  edit
                </v-icon>
                <v-icon
                  small
                  @click="openDialog(props.item)"
                >
                  delete
                </v-icon>
              </td>
            </template>
        </v-data-table>
      </v-flex>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import router from '@/router'
import ProgressDialog from '@/components/ProgressDialog'
import Vue from 'vue'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/index.css'

Vue.use(VueToast)

export default {
  data () {
    return {
      auditHeaders: [
        {
          text: 'ID',
          align: 'left',
          value: 'id',
          sortable: false
        },
        {
          text: 'Activity',
          align: 'left',
          value: 'activity',
          sortable: false
        },
        {
          text: 'Created Date',
          align: 'left',
          value: 'created_date',
          sortable: false
        }
      ],
      historyDialog: false,
      deleteDialog: false,
      viewDialog: false,
      waitingDialog: false,
      selectedFavorite: null,
      headers: [
        {
          text: 'Title',
          align: 'left',
          value: 'title',
          sortable: false
        },
        {
          text: 'Category',
          align: 'left',
          value: 'category',
          sortable: false
        },
        {
          text: 'Ranking',
          align: 'left',
          value: 'ranking'
        },
        {
          text: 'Description',
          align: 'left',
          value: 'description',
          sortable: false
        },
        {
          text: 'Created Date',
          align: 'left',
          value: 'created_date',
          sortable: false
        },
        {
          text: 'Modified Date',
          align: 'left',
          value: 'modified_date',
          sortable: false
        },
        {
          text: 'Actions',
          align: 'center',
          value: 'actions',
          sortable: false
        }
      ]
    }
  },
  components: {
    ProgressDialog
  },
  computed: {
    favorites () {
      return this.$store.state.favorites
    },
    audits () {
      return this.$store.state.favoritesAudits
    }
  },
  mounted () {
    this.getFavorites()
    this.getFavoritesAudits()
  },
  methods: {
    openViewDialog (favorite) {
      this.viewDialog = true
      this.selectedFavorite = favorite
    },
    getFavoritesAudits () {
      this.$store.dispatch('getFavoritesAudits')
    },
    redirectToEditFavorite (favorite) {
      let path = '/favorites/' + favorite.id + '/edit'
      router.push(path)
    },
    redirectToAddFavorite () {
      let path = '/favorites/add'
      router.push(path)
    },
    openDialog (favorite) {
      this.deleteDialog = true
      this.selectedFavorite = favorite
    },
    deleteFavorite (selectedFavorite) {
      let endpoint = '/favorites/' + selectedFavorite.id

      this.waitingDialog = true
      this.deleteDialog = false
      this.$store.dispatch('delete', endpoint)
        .then(() => {
          const index = this.favorites.indexOf(selectedFavorite)

          this.favorites.splice(index, 1)
          Vue.$toast.success('Favorite deleted successfully', {
            position: 'top'
          })
          this.$store.dispatch('getFavoritesAudits')
        })
        .catch(error => {
          Vue.$toast.error(error, {
            position: 'top'
          })
        })
        .finally(() => {
          this.waitingDialog = false
        })
    },
    getFavorites () {
      let params = this.$route.query
      this.$store.dispatch('getFavorites', params)
    }
  },
  filters: {
    formatDate: function (value) {
      return value ? moment(String(value)).format('MM/DD/YYYY') : '-'
    },
    toOrdinal: function (value) {
      var s = ['th', 'st', 'nd', 'rd']
      var v = value % 100
      return value + (s[(v - 20) % 10] || s[v] || s[0])
    }
  }
}
</script>
