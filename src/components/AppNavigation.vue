<template>
    <span>
        <v-navigation-drawer app v-model="drawer" class="cyan lighten-2" dark disable-resize-watcher>
            <v-list>
                <template v-for="(item, index) in items">
                    <v-list-tile :key="index">
                        <v-list-tile-content>
                            {{item.title}}
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider :key="`divider-${index}`"></v-divider>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app color="cyan darken-3" dark>
            <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-spacer class="hidden-md-and-up"></v-spacer>
            <router-link to="/">
                <v-toolbar-title data-cy="titleBtn">{{appTitle}}</v-toolbar-title>
            </router-link>
            <div class="hidden-sm-and-down">
                <v-btn flat class="hidden-sm-and-down nav-menu" to="/categories">Categories</v-btn>
                <v-btn flat class="hidden-sm-and-down nav-menu" to="/favorites">Favorites</v-btn>
            </div>
        </v-toolbar>
    </span>
</template>

<script>
/* eslint-disable */
export default {
    name: 'AppNavigation',
    data() {
        return {
            appTitle: 'BriteCore',
            drawer: false,
            items: {}
        };
    }
};
</script>

<style scoped>
a {
    color: white;
    text-decoration: none;
}
</style>
