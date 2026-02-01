<template>
    <v-card class="h-100 d-flex flex-column">
        <v-card-item>
            <v-text-field density="comfortable">
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
        <v-sheet class="h-100">
            <v-row class="h-100 ma-0">
                <!-- 请求体 -->
                <v-col class="pa-0" cols="12">
                    <v-card class="pa-1 h-100">
                        <!-- <v-card-title>请求体</v-card-title> -->
                        <v-card-item class="pa-0">
                            <v-select label=" 请求体" v-model="postData.postType" :items="postType" variant="outlined"
                                density="compact" max-width="200" hide-details class="mt-2"></v-select>
                        </v-card-item>
                        <v-card-item class="px-0 pt-2">
                            <v-sheet v-if="this.postData.postType == 'none'">请求体为空</v-sheet>
                            <v-sheet v-if="this.postData.postType == 'form-data'" max-height="300" class="border">
                                <v-data-table-virtual :headers="formDataHeaders" :items="requestBody['form-data']"
                                    :height="180" density="compact" fixed-header fixed-footer>
                                    <!-- 传入列 -->
                                    <template v-slot:item.need="{ item, index }">
                                        <v-radio v-model="item.need" density="compact"
                                            @click="item.need = !item.need"></v-radio>
                                    </template>

                                    <!-- 参数名列 -->
                                    <template v-slot:item.name="{ item }">
                                        <v-text-field v-model="item.name" variant="underlined" hide-details
                                            density="compact"></v-text-field>
                                    </template>

                                    <!-- 值列 -->
                                    <template v-slot:item.value="{ item, index }">
                                        <v-text-field v-model="item.value" variant="underlined" hide-details
                                            density="compact">
                                            <template v-slot:append-inner>
                                                <v-btn icon size="20" variant="plain"
                                                    @click="OpenTextEditor_FormData(index, 'value')">
                                                    <v-icon size="16">mdi-unfold-more-vertical</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-text-field>
                                    </template>

                                    <!-- 备注列 -->
                                    <template v-slot:item.remark="{ item, index }">
                                        <v-text-field v-model="item.remark" variant="underlined" hide-details
                                            density="compact">
                                            <template v-slot:append-inner>
                                                <v-btn icon size="20" variant="plain"
                                                    @click="OpenTextEditor_FormData(index, 'remark')">
                                                    <v-icon>mdi-unfold-more-vertical</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-text-field>
                                    </template>

                                    <!-- 底部新增按钮 -->
                                    <template v-slot:bottom>
                                        <div class="w-100 text-end pa-2 border-t">
                                            <v-btn size="small" @click="AddLineFormData()">新增</v-btn>
                                        </div>
                                    </template>
                                </v-data-table-virtual>
                            </v-sheet>
                            <v-sheet v-if="this.postData.postType == 'x-www-form-urlencoded'" class="border">
                                <v-data-table-virtual :headers="formDataHeaders"
                                    :items="requestBody['x-www-form-urlencoded']" :height="180" density="compact"
                                    fixed-header fixed-footer>
                                    <!-- 传入列 -->
                                    <template v-slot:item.need="{ item, index }">
                                        <v-radio v-model="item.need" density="compact"
                                            @click="item.need = !item.need"></v-radio>
                                    </template>

                                    <!-- 参数名列 -->
                                    <template v-slot:item.name="{ item }">
                                        <v-text-field v-model="item.name" variant="underlined" hide-details
                                            density="compact"></v-text-field>
                                    </template>

                                    <!-- 值列 -->
                                    <template v-slot:item.value="{ item, index }">
                                        <v-text-field v-model="item.value" variant="underlined" hide-details
                                            density="compact">
                                            <template v-slot:append-inner>
                                                <v-btn icon size="20" variant="plain"
                                                    @click="OpenTextEditor_FormData(index, 'value')">
                                                    <v-icon size="16">mdi-unfold-more-vertical</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-text-field>
                                    </template>

                                    <!-- 备注列 -->
                                    <template v-slot:item.remark="{ item, index }">
                                        <v-text-field v-model="item.remark" variant="underlined" hide-details
                                            density="compact">
                                            <template v-slot:append-inner>
                                                <v-btn icon size="20" variant="plain"
                                                    @click="OpenTextEditor_FormData(index, 'remark')">
                                                    <v-icon>mdi-unfold-more-vertical</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-text-field>
                                    </template>

                                    <!-- 底部新增按钮 -->
                                    <template v-slot:bottom>
                                        <div class="w-100 text-end pa-2 border-t">
                                            <v-btn size="small" @click="AddLineFormData()">新增</v-btn>
                                        </div>
                                    </template>
                                </v-data-table-virtual>
                            </v-sheet>
                            <v-sheet v-if="this.postData.postType == 'raw'">
                                <v-textarea v-model="requestBody.raw" hide-details></v-textarea>
                            </v-sheet>
                            <v-sheet v-if="this.postData.postType == 'binary'">1
                            </v-sheet>
                            <v-sheet v-if="this.postData.postType == 'graphQL'">graphQL</v-sheet>
                        </v-card-item>
                    </v-card>
                </v-col>
                <!-- 响应体 -->
                <v-col class="pa-0" cols="12">
                    <v-card class="pa-1 h-100">
                        <!-- <v-card-title>响应体</v-card-title> -->
                        <v-card-item class="pa-0">
                            <v-select label=" 响应体" v-model="resData.resType" :items="resType" variant="outlined"
                                density="compact" max-width="200" hide-details class="mt-2"></v-select>
                        </v-card-item>
                        <v-card-item class="px-0 pt-2">
                            <v-sheet v-if="resData.resType == 'xml'">xml</v-sheet>
                            <v-sheet v-if="resData.resType == 'json'">json</v-sheet>
                            <v-sheet v-if="resData.resType == 'text'">text</v-sheet>
                            <v-sheet v-if="resData.resType == 'html'">
                                <v-sheet v-html="resData.data"></v-sheet>
                            </v-sheet>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-sheet>
    </v-card>

    <!-- 以对话框样式放大文本编辑框:form-data -->
    <v-dialog v-model="text_edit_dialog" width="400">
        <v-card max-width="400" max-height="500">
            <v-textarea v-model="requestBody['form-data'][text_edit_data.index][text_edit_data.field]"
                hide-details></v-textarea>
        </v-card>
    </v-dialog>
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
                body: null,
                params: [],
                headers: []
            },

            resType: ['xml', 'json', 'text', 'html'],
            resData: {
                resType: 'json',
                code: 200,
                data: null
            },

            // form-data/x-www-form-urlencoded 表格列定义
            formDataHeaders: [
                { key: 'need', title: '传入', sortable: false, width: '80px' },
                { key: 'name', title: '参数名', sortable: false },
                { key: 'value', title: '值', sortable: false },
                { key: 'remark', title: '备注', sortable: false }
            ],

            // 请求体数据格式
            requestBody: {
                'none': null,
                'form-data': [
                    {
                        'need': true,
                        'name': 'a',
                        'value': '1',
                        'remark': '这是a的备注'
                    },
                    {
                        'need': false,
                        'name': 'b',
                        'value': '2',
                        'remark': '这是b的备注'
                    },
                    {
                        'need': true,
                        'name': 'c',
                        'value': '3',
                        'remark': '这是c的备注'
                    }
                ],
                'x-www-form-urlencoded': [
                    {
                        'need': true,
                        'name': 'a',
                        'value': '1',
                        'remark': '这是a的备注'
                    },
                    {
                        'need': false,
                        'name': 'b',
                        'value': '2',
                        'remark': '这是b的备注'
                    },
                    {
                        'need': true,
                        'name': 'c',
                        'value': '3',
                        'remark': '这是c的备注'
                    }
                ],
                'raw': null,
                'binary': null,
                'graphQL': null
            },

            // 页面状态
            // 以对话框样式放大文本编辑框:form-data
            text_edit_dialog: false,
            text_edit_data: {
                index: null,
                field: null
            }
        };
    },
    methods: {
        /**
         * @name 新增一行form-data
         * @type 请求体
         */
        AddLineFormData() {
            this.requestBody['form-data'].push({
                'need': true,
                'name': '',
                'value': '',
                'remark': ''
            });
        },

        /**
         * @name 放大form-data文本编辑框
         * @type 请求体
         * @param {number} index 行索引
         * @param {string} field 编辑的内容
         */
        OpenTextEditor_FormData(index, field) {
            this.text_edit_dialog = true;
            this.text_edit_data = {
                index: index,
                field: field
            };
        }
    }
};
</script>
<style scoped></style>