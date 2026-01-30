<template>
    <v-card class="h-100">
        <v-card-item>
            <v-text-field>
                <template v-slot:prepend>
                    <v-chip v-if="api.type" :color="type[api.type].color" text-color="white">{{ type[api.type].name
                    }}</v-chip>
                </template>
                <template v-slot:append>
                    <v-btn icon>
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </v-card-item>
        <v-card-item>
            <v-card>
                <!-- <v-card-title>请求体</v-card-title> -->
                <v-card-item>
                    <v-select label="请求体" v-model="postData.postType" :items="postType" variant="outlined"
                        density="compact" max-width="200" class="mt-2"></v-select>
                </v-card-item>
                <v-card-item>
                    <v-sheet v-if="this.postData.postType == 'none'">请求体为空</v-sheet>
                    <v-sheet v-if="this.postData.postType == 'form-data'">

                    </v-sheet>
                    <v-sheet v-if="this.postData.postType == 'x-www-form-urlencoded'">x-www-form-urlencoded</v-sheet>
                    <v-sheet v-if="this.postData.postType == 'raw'">raw</v-sheet>
                    <v-sheet v-if="this.postData.postType == 'binary'">binary</v-sheet>
                    <v-sheet v-if="this.postData.postType == 'graphQL'">graphQL</v-sheet>
                </v-card-item>
            </v-card>
        </v-card-item>
        <v-card-item>
            <v-card>
                <v-card-title>响应体</v-card-title>
            </v-card>
        </v-card-item>
    </v-card>
</template>
<script>
export default {
    props: {
        api: Object
    },
    data() {
        return {
            type: {
                'get': { name: 'GET', color: 'green' },
                'post': { name: 'POST', color: 'orange' },
                'put': { name: 'PUT', color: 'light-blue' },
                'delete': { name: 'DELETE', color: 'amber' },
                'patch': { name: 'PATCH', color: 'purple' },
                'head': { name: 'HEAD', color: 'teal' },
                'options': { name: 'OPTIONS', color: 'pink' }
            },
            postType: ['none', 'form-data', 'x-www-form-urlencoded', 'raw', 'binary', 'graphQL'],
            postData: {
                type: this.api.type,
                postType: 'none',
                body: '',
                params: [],
                headers: []
            }
        };
    },
    methods: {}
};
</script>
<style scoped></style>