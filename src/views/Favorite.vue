<template>
    <v-container>
        <v-flex mt-3 mb-5>
            <div class="col-sm-10">
                <h2 v-if="currentFavorite == null">New Favorite</h2>
                <h2 v-if="currentFavorite">Edit Favorite</h2>
            </div>
        </v-flex>

        <v-card class="pa-5">
            <progress-dialog :waitingDialog=waitingDialog></progress-dialog>
            <v-dialog v-if="newCategory" v-model="addDialog" persistent max-width="290">
                <v-card>
                    <v-card-title  class="body-2"
                        >Add Category</v-card-title
                    >
                    <v-divider></v-divider>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field label="Name*" v-model=newCategory.name></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary darken-1"
                            @click="updateCategory"
                            >Save</v-btn
                        >
                        <v-btn
                            color="grey darken-1"
                            outline
                            @click="addDialog = false"
                            >No</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-if="currentField" v-model="metaDialog" persistent max-width="340">
                <v-card>
                    <v-card-title class="body-2" v-if="currentField.name === 'date'">Select {{ currentField.name }}</v-card-title>
                    <v-card-title class="body-2" v-if="currentField.name !== 'date'">Enter {{ currentField.name }}</v-card-title>
                    <v-divider></v-divider>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field v-if="currentField.name === 'text'" :label="currentField.name" v-model=currentField.value></v-text-field>
                                <v-text-field v-if="currentField.name === 'number'" :label="currentField.name" v-model=currentField.value type="number"></v-text-field>
                                <v-date-picker v-if="currentField.name === 'date'" v-model="currentField.value" scrollable>
                                </v-date-picker>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary darken-1"
                            @click="updateMetaField"
                            >Save</v-btn
                        >
                        <v-btn
                            color="grey darken-1"
                            outline
                            @click="metaDialog = false"
                            >Cancel</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-flex xs6 offset-xs3 mb-5>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field v-model="name" :counter="15" :rules="titleRules" label="Title" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea v-model="description" label="Description"></v-textarea>
                        </v-flex>
                        <v-flex xs12 sm6 md5>
                            <v-select
                            :items="categories" v-on:change="confirmCategory($event)"
                            item-text="name" item-value="id" label="Category"
                            v-model="category"></v-select>
                        </v-flex>
                        <v-flex xs12 md1>
                            <v-btn icon title="Add more categories">
                                <v-icon color="grey" @click="openDialog()">add</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs12 sm6 md5>
                            <v-select
                            :items="ordinals"
                            item-text="name" item-value="id" label="Ranking"
                            v-model="rank"></v-select>
                        </v-flex>
                    </v-layout>

                    <v-flex mt-3 v-if="enableCustomAttSection">
                        <v-toolbar>
                            <v-toolbar-title>Other Information</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                    </v-flex>

                    <v-container v-if="enableCustomAttSection">

                        <v-dialog v-model="dialog" persistent max-width="290">
                            <v-card>
                                <v-card-title class="body-2">Error</v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <div v-for="(error, index) in errors" :key=index>
                                        {{error}}
                                    </div>
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn  color="primary darken-1" @click="dialog = false">Ok</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-layout v-for="(field, index) in fields" v-bind:key="index">
                            <v-flex xs12 md7>
                            <v-text-field
                                label="Field name"
                                v-model="field.name"
                                :rules="[v => !!v || 'A field name is required']"
                                value=""
                                required
                            ></v-text-field>
                            </v-flex>

                            <v-flex xs12 md4>
                                <v-select v-if="isChoices[index] == null" menu-props="right" v-model="field.type" :items="items" item-text="name" item-value="id" v-on:change="confirmChoices($event, index)" :rules="[v => !!v || 'Field type is required']" label="Field Type"
                                required>
                                </v-select>
                                <label v-if="isChoices[index]" class="grey--text lighten-1 caption"
                                >Value:</label>
                                <br/>
                                <label v-if="isChoices[index]" class="subheading text-capitalize">{{ field.value }}</label>
                            </v-flex>

                            <v-flex xs12 md1>
                                <v-btn icon>
                                    <v-icon color="red" @click="removeField(index)">delete</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>

                    <v-layout mt-2>
                        <v-btn outline color="success" @click="addAttribute">
                            <v-icon left dark>add</v-icon>Add More Information
                        </v-btn>
                    </v-layout>
                    <v-layout mt-4>
                        <v-btn :disabled="!valid" color="success" @click="validate">
                            Save
                        </v-btn>
                        <v-btn outline color="success" @click="redirectToFavorites">
                            Cancel
                        </v-btn>
                    </v-layout>
                </v-form>
            </v-flex>
        </v-card>
    </v-container>
</template>

<script>
import router from '@/router'
import ProgressDialog from '@/components/ProgressDialog'
import Vue from 'vue'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/index.css'
import axios from 'axios'

Vue.use(VueToast)

export default {
  data: () => ({
    addDialog: false,
    metaDialog: false,
    waitingDialog: false,
    blockRemoval: true,
    enableCustomAttSection: false,
    open: false,
    fields: [],
    valid: true,
    name: '',
    description: '',
    category: '',
    rank: '',
    titleRules: [
      v => !!v || 'Title is required'
    ],
    select: null,
    items: [
      {name: 'text', id: 'text'},
      {name: 'number', id: 'number'},
      {name: 'date', id: 'date'}
    ],
    isChoices: [],
    errors: null,
    dialog: false,
    ordinals: [],
    newCategory: null,
    currentField: null,
    currentFavorite: null
  }),
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  watch: {
    fields () {
      this.blockRemoval = this.fields.length <= 1
    }
  },
  components: {
    ProgressDialog
  },
  methods: {
    redirectToFavorites () {
      router.push('/favorites/')
    },
    openDialog () {
      this.addDialog = true
      this.newCategory = {
        'id': '',
        'name': ''
      }
    },
    updateCategory () {
      let endpoint = '/categories/'
      if (this.newCategory.name.length === 0) {
        Vue.$toast.error('Category name should not be empty', {
          position: 'top'
        })
        return
      }
      this.waitingDialog = true
      this.$store.dispatch('add', {
        'endpoint': endpoint,
        'payload': {
          'name': this.newCategory.name
        }
      })
        .then(res => {
          Vue.$toast.success('New category added successfully', {
            position: 'top'
          })
          this.categories.push(res)
          this.addDialog = false
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
    confirmCategory (e) {
      let filtered = this.categories.filter(el => el.id === e)
      this.ordinals = filtered ? filtered[0].rankings : []
      this.rank = ''
    },
    updateMetaField () {
      let field = this.fields[this.currentField.index]
      this.fields.splice(this.currentField.index, 1)
      this.fields.push({
        'name': field.name,
        'type': this.currentField.name,
        'value': this.currentField.value
      })
      this.metaDialog = false
      this.isChoices[this.currentField.index] = true
    },
    confirmChoices (e, index) {
      this.currentField = {
        'name': e,
        'index': index,
        'value': ''
      }
      this.metaDialog = true
    },
    validate () {
      if (this.$refs.form.validate()) {
        var payload = {
          title: this.name,
          description: this.description,
          categoryId: this.category,
          ranking: this.rank,
          metaData: {}
        }
        let customAttributes = {}
        let errors = []
        let fieldNames = ['title', 'description', 'category', 'ranking']

        this.fields.forEach(function (field) {
          if (fieldNames.includes(field.name.toLowerCase())) {
            errors.push(field.name + ' is entered more than once')
          }

          customAttributes[field.name] = field.value
        })

        if (errors.length > 0) {
          this.errors = errors
          this.dialog = true
          return
        }

        payload.metaData = customAttributes

        this.waitingDialog = true
        let endpoint = '/favorites/' + ((this.currentFavorite) ? this.currentFavorite.id : '')

        this.$store.dispatch(((this.currentFavorite) ? 'update' : 'add'), {
          'endpoint': endpoint,
          'payload': payload
        })
          .then(res => {
            let message = 'Favorite ' + ((this.currentFavorite) ? 'updated' : 'created') + ' successfully'
            Vue.$toast.success(message, {
              position: 'top'
            })

            setTimeout(function () {
              router.push('/favorites')
            }, 100)
          })
          .catch(error => {
            Vue.$toast.error(error, {
              position: 'top'
            })
          })
          .finally(() => {
            this.waitingDialog = false
          })
      }
    },
    addAttribute () {
      let checkEmptyFields = this.fields.filter(field => field.name === null || field.type === null)
      if (checkEmptyFields.length >= 1 && this.fields.length > 0) return

      this.enableCustomAttSection = true

      this.fields.push({
        name: null,
        type: null
      })
    },
    removeField (lineId) {
      if (!this.blockRemoval) this.fields.splice(lineId, 1)
    },
    getCategories () {
      this.$store.dispatch('getCategories')
    },
    getFavorite () {
      if (!this.$route.params.id) {
        return
      }
      let path = `${this.$store.state.api}` + '/favorites/' + this.$route.params.id
      let headers = {
        'Content-Type': 'application/json'
      }
      return axios.get(path, {headers: headers})
        .then(res => {
          console.log(res.data.data)
          let data = res.data.data
          this.currentFavorite = res.data.data
          this.name = data.title
          this.description = data.description
          this.category = data.category.id

          let filtered = this.categories.filter(el => el.id === data.category.id)
          this.ordinals = filtered ? filtered[0].rankings : []

          this.rank = data.ranking
          let fields = []
          let isChoices = []
          Object.keys(data.metaData).forEach(function (key, index) {
            let field = {
              'type': 'text',
              'name': key,
              'value': data.metaData[key]
            }
            fields.push(field)
            isChoices[index] = true
          })
          this.enableCustomAttSection = true
          this.fields = fields
          this.isChoices = isChoices
        })
    }
  },
  mounted () {
    this.getCategories()
    this.getFavorite()
  }
}
</script>
