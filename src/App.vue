<template>
    <v-app class="main">
        <router-view />
    </v-app>
</template>

<style>
/* body, p, .v-application [class*='text-'], .v-application {
    font-family: 'Quicksand', sans-serif !important;
}
.title, .v-application .title, .title [class*='text-'] {
    font-family: 'Quicksand', sans-serif !important;
} */
.h-100 {
    height: 100%;
}
.main{
    background-color: var(--v-background-base) !important;
}
</style>
