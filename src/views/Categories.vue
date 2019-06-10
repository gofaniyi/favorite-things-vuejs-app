<template>
    <v-container>
        <v-flex mt-3>
            <div class="col-sm-10">
                <h2>
                    Categories
                    <v-dialog v-model="historyDialog" transition="dialog-bottom-transition">
            <template v-slot:activator="{ on }">
                <v-btn color="warning" outline dark v-on="on" style="float:right">View Audit Logs</v-btn>
            </template>
            <v-card>
                <v-toolbar dark color="primary">
                <v-toolbar-title>Category Audit Logs</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn icon dark @click="historyDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar-items>
                </v-toolbar>
                <v-data-table v-if="audits"
                    :headers="headers"
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
            </v-dialog>
                </h2>
                <v-flex mt-4>
                    <v-btn color="primary" @click="openDialog(null, 'Add')"
                        >Add New Category</v-btn
                    >
                </v-flex>
            </div>
        </v-flex>
        <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
                <progress-dialog :waitingDialog=waitingDialog></progress-dialog>

                <v-dialog v-if="selectedCategory" v-model="editDialog" persistent max-width="290">
                    <v-card>
                        <v-card-title  class="body-2"
                            >{{ selectedCategory.mode }} Category</v-card-title
                        >
                        <v-divider></v-divider>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field label="Name*" v-model=selectedCategory.name required></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary darken-1"
                                @click="updateCategory(selectedCategory)"
                                >Save</v-btn
                            >
                            <v-btn
                                color="grey darken-1"
                                outline
                                @click="editDialog = false"
                                >No</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="deleteDialog" persistent max-width="290">
                    <v-card>
                        <v-card-title class="body-2"
                            >Delete Category</v-card-title
                        >
                        <v-divider></v-divider>
                        <v-card-text
                            >Do you want to remove this category?</v-card-text
                        >
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary darken-1"
                                @click="deleteCategory(selectedCategory)"
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
                <v-flex v-if="categories && categories.length == 0">
                    <v-card class="pa-5">
                        <v-card-title class="subheading">
                            No category available
                        </v-card-title>
                    </v-card>
                </v-flex>
                <v-flex
                    v-for="category in categories"
                    v-bind:key="category.id"
                    xs3
                >
                    <v-card color="white darken-2" class="blue-grey--text">
                        <v-card-title primary-title>
                            <div class="text-lg-left">
                                <router-link class="category-link" :to="`/favorites?categoryId=` + category.id">
                                    <div class="headline font-weight-bold">
                                        {{ category.name }}
                                    </div>
                                </router-link>
                                <span class="grey--text"
                                    >{{ category.favoritesCount }} Favorites
                                    Created</span
                                >
                            </div>
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                icon title="Edit category"
                                @click="openDialog(category, 'Edit')"
                            >
                                <v-icon color="green">edit</v-icon>
                            </v-btn>
                            <v-btn icon title="Delete category">
                                <v-icon
                                    color="red"
                                    dark
                                    @click="openDialog(category, 'Delete')"
                                    >delete</v-icon
                                >
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-container>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import ProgressDialog from '@/components/ProgressDialog'
import Vue from 'vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

Vue.use(VueToast);

export default {
    data() {
        return {
            headers: [
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
            notifications: false,
            sound: true,
            widgets: false,
            waitingDialog: false,
            deleteDialog: false,
            editDialog: false,
            selectedCategory: null
        };
    },
    components: {
        ProgressDialog
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        },
        audits() {
            return this.$store.state.categoriesAudits;
        }
    },
    mounted() {
        this.getCategories();
        this.getCategoriesAudits();
    },
    methods: {
        getCategories() {
            this.$store.dispatch('getCategories');
        },
        getCategoriesAudits() {
            this.$store.dispatch('getCategoriesAudits');
        },
        openDialog(category, mode) {
            var cat = {
                'name' : category ? category.name : '',
                'id' : category ? category.id : '',
            }

            switch(mode){
                case 'Edit':
                    this.editDialog = true;
                break;

                case 'Add':
                    this.editDialog = true;
                    cat.id = '';
                    cat.name = '';
                break;

                case 'Delete':
                    this.deleteDialog = true;
                break;
            }
            cat['mode'] = mode;
            this.selectedCategory = cat;
        },
        deleteCategory(selectedCategory) {
            this.waitingDialog = true;
            this.deleteDialog = false;
            
            let endpoint = '/categories/' + selectedCategory.id
            this.$store.dispatch('delete', endpoint)
            .then(() => {
                let filtered = this.categories.filter(el => el.id === selectedCategory.id)

                const index = this.categories.indexOf(filtered[0] )

                this.categories.splice(index, 1)

                Vue.$toast.success('Category deleted successfully', {
                    position: 'top'
                });

                this.$store.dispatch('getCategoriesAudits');
            })
            .catch(error => {
                Vue.$toast.error(error, {
                    position: 'top'
                });
            })
            .finally(() => {
                this.waitingDialog = false
            })
        },
        updateCategory(selectedCategory) {
            this.waitingDialog = true;

            if (selectedCategory.mode == 'Add'){

                let endpoint = '/categories/'

                this.$store.dispatch('add', {
                    'endpoint': endpoint,
                    'payload': {
                        'name': selectedCategory.name
                    }
                })
                .then(res => {
                    Vue.$toast.success('Category created successfully', {
                        position: 'top'
                    });
                    this.categories.push(res)
                    this.editDialog = false

                    this.$store.dispatch('getCategoriesAudits');
                })
                .catch(error => {
                    Vue.$toast.error(error, {
                        position: 'top'
                    });
                })
                .finally(() => {
                    this.waitingDialog = false
                })
            }else{
                this.$store.dispatch('update', {
                    'endpoint': '/categories/' + selectedCategory.id,
                    'payload': selectedCategory
                })
                .then(res => {
                    Vue.$toast.success('Category updated successfully', {
                        position: 'top'
                    });
                    let filtered = this.categories.filter(el => el.id === selectedCategory.id)

                    const index = this.categories.indexOf(filtered[0] )

                    this.categories.splice(index, 1)

                    this.categories.push(res)
                    this.editDialog = false

                    this.$store.dispatch('getCategoriesAudits');
                })
                .catch(error => {
                    Vue.$toast.error(error, {
                        position: 'top'
                    });
                })
                .finally(() => {
                    this.waitingDialog = false
                })
            }
        }
    },
    watch: {
        dialog(val) {
            if (!val) return;
        }
    },
    filters: {
    formatDate: function (value) {
      return value ? moment(String(value)).format('MM/DD/YYYY') : '-'
    }
  }
};
</script>
<style scoped>
.category-link{
    text-decoration: none;
}

.category-link:hover{
    text-decoration: underline;
}
</style>