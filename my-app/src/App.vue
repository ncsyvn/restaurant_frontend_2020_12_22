<template>
    <v-app light>
        <left-side-bar v-if="isLoggedIn"></left-side-bar>
        <v-app-bar v-if="isLoggedIn"
                   id="headermenu"
                   color="primary lighten-1"
                   dark
                   app
                   height="50">
            <v-app-bar-nav-icon @click.stop="updateDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
            <div style="display: contents">
                <img :src="`http://openweathermap.org/img/w/${iconID}.png`" style="width: 50px"/>
                <h3>{{temp}}°C</h3>
            </div>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn icon large v-on="on" dark>
                        <v-avatar size="32px">
                            <img src="https://png.pngtree.com/png-clipart/20190903/original/pngtree-couple-boy-cute-avatar-png-image_4445471.jpg" alt="">
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="">
                        <v-list-tile-title>
                            {{user?user.Username:''}}
                        </v-list-tile-title>
                    </v-list-item>
                    <v-list-item to="/change-password">
                        <v-list-tile-title>
                            Đổi mật khẩu
                        </v-list-tile-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                        <v-list-tile-title>
                            Đăng xuất
                        </v-list-tile-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
        <v-content>
            <v-container fluid fill-height grid-list-md style="padding:10px;">
                <v-layout justify-center>
                    <router-view></router-view>
                </v-layout>
                <vue-snotify></vue-snotify>
            </v-container>
        </v-content>
    </v-app>
</template>
<script lang="ts">
    import "vue-snotify/styles/material.css";
    import { Vue } from 'vue-property-decorator';
    import auth from '@/auth';
    import LeftSideBar from '@/components/Layout/LeftSideBar.vue';
import { HTTP } from "./HTTPServices";
import Axios from "axios";

    export default Vue.extend({
        name: 'App',
        components: { LeftSideBar },
        data() {
            return {
                clipped: false,
                drawer: this.$store.state.app.drawer,
                fixed: true,
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: '',
                user: this.$store.state.user.Profile,
                temp:0,
                iconID: 0,
                weatherID: 0
            };
        },
        computed: {
            isLoggedIn(): boolean {
                // this.user = this.$store.state.user.Profile
                // return this.$store.state.user
                //     && this.$store.state.user.AccessToken
                //     && this.$store.state.user.AccessToken.IsAuthenticated;
                return true;
            }
        },
        mounted() {
        },
        created() {
            this.getWeather().then(res => {
                let app = this.$store.state.app;

                this.temp = Math.ceil((res as any).main.temp - 273); 
                this.iconID = (res as any).weather[0].icon
                this.weatherID = Math.floor((res as any).weather[0].id/100)
                this.$store.state.dayWeather = {
                    temp: this.temp,
                    weatherID: this.weatherID,
                    weatherName: (res as any).weather[0].main,
                    iconID: this.iconID
                }
                this.$store.commit('UPDATE_APP', app);
            })
        },
        methods: {
            checkRole(roleId: number): boolean {
                return this.$store.state.user.Profile.UserRole.indexOf(roleId) !== -1;
            },
            logout() {
                auth.logout();
            },
            updateDrawer() {
                let app = this.$store.state.app;
                app.drawer = !this.$store.state.app.drawer;
                this.$store.commit('UPDATE_APP', app);
            },
            getWeather() {
                var me = this;
                return new Promise<any>((resolve: any, reject: any) => {
                    Axios.get(`http://api.openweathermap.org/data/2.5/weather?id=1857357&appid=732c6a969114061587ceee6d7d597189`)
                    .then((response) => {
                        resolve(response.data);
                    }).catch((error) => {
                        reject(error);
                    })
                });
            }
        }
    });
</script>
<style>
    #appDrawer {
        overflow: hidden;
    }

    #appDrawer .v-list__tile__action, #appDrawer .v-list__group__header .v-list__group__header__prepend-icon {
        min-width: 35px;
    }

    #appDrawer .v-list__group__header .v-list__group__header__prepend-icon {
        padding-right: 0;
    }

    #appDrawer .v-list__group__items--no-action .v-list__tile {
        padding-left: 35px;
    }

    .drawer-menu--scroll {
        height: calc(100vh - 100px);
        overflow: auto;
    }
    #headermenu .v-text-field.v-text-field--solo .v-input__control {
        min-height: 35px;
    }

    .v-select__selections, .v-chip, .v-chip__content, .v-chip__content span {
        max-width: 100%;
    }
    .v-data-table th {
        height: 35px!important
    }
</style>