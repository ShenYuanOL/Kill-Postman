<template>
    <v-card class="h-100 d-flex flex-column">
        <v-card-item>
            <v-text-field density="comfortable" v-model="postData.url" :error-messages="state.SendFieldError">
                <template v-slot:prepend>
                    <v-chip v-if="api.type" :color="type[api.type].color" text-color="white">{{ type[api.type].name
                        }}</v-chip>
                </template>
                <v-chip v-if="Global.BaseURL">
                    {{ Global.BaseURL }}
                </v-chip>
                <template v-slot:append>
                    <v-btn icon @click="SendDataToServer" :loading="state.loading">
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </v-card-item>
        <v-sheet class="h-100">
            <v-row class="h-100 ma-0">
                <!-- 请求体 -->
                <v-col class="pa-0" cols="12">

                    <v-sheet class="pa-1 h-100">
                        <v-tabs v-model="state.request_tab" slider-color="purple-lighten-3" color="cyan" inset
                            density="compact">
                            <v-tab value="body">Body</v-tab>
                            <v-tab value="header">Header</v-tab>
                            <v-tab value="auth">Auth</v-tab>
                        </v-tabs>

                        <v-tabs-window v-model="state.request_tab">
                            <v-tabs-window-item value="body">
                                <v-card flat>
                                    <!-- <v-card-title>请求体</v-card-title> -->
                                    <v-card-item class="pa-0">
                                        <v-select label=" 请求体" v-model="postData.postType" :items="postType"
                                            variant="outlined" density="compact" max-width="200" hide-details
                                            class="mt-2"></v-select>
                                    </v-card-item>
                                    <v-card-item class="px-0 pt-2">
                                        <v-sheet v-if="this.postData.postType == 'none'">请求体为空</v-sheet>
                                        <v-sheet v-if="this.postData.postType == 'form-data'" max-height="300"
                                            class="border">
                                            <v-data-table-virtual :headers="formDataHeaders"
                                                :items="requestBody['form-data']" :height="180" density="compact"
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
                                                    <v-text-field v-model="item.remark" variant="underlined"
                                                        hide-details density="compact">
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
                                        <v-sheet v-if="this.postData.postType == 'x-www-form-urlencoded'"
                                            class="border">
                                            <v-data-table-virtual :headers="formDataHeaders"
                                                :items="requestBody['x-www-form-urlencoded']" :height="180"
                                                density="compact" fixed-header fixed-footer>
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
                                                    <v-text-field v-model="item.remark" variant="underlined"
                                                        hide-details density="compact">
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
                            </v-tabs-window-item>
                            <v-tabs-window-item value="header">
                                <v-sheet class="border mt-2">
                                    <v-data-table-virtual :headers="headerTableHeaders" :items="requestHeaders"
                                        :height="180" density="compact" fixed-header fixed-footer>
                                        <!-- 传入列 -->
                                        <template v-slot:item.need="{ item }">
                                            <v-checkbox v-model="item.need" density="compact" hide-details></v-checkbox>
                                        </template>

                                        <!-- Header名列 -->
                                        <template v-slot:item.name="{ item }">
                                            <v-text-field v-model="item.name" variant="underlined" hide-details
                                                density="compact" placeholder="Header名"></v-text-field>
                                        </template>

                                        <!-- 值列 -->
                                        <template v-slot:item.value="{ item }">
                                            <v-text-field v-model="item.value" variant="underlined" hide-details
                                                density="compact" placeholder="值"></v-text-field>
                                        </template>

                                        <!-- 备注列 -->
                                        <template v-slot:item.remark="{ item }">
                                            <v-text-field v-model="item.remark" variant="underlined" hide-details
                                                density="compact" placeholder="备注"></v-text-field>
                                        </template>

                                        <!-- 删除列 -->
                                        <template v-slot:item.actions="{ index }">
                                            <v-btn icon size="20" variant="plain" @click="RemoveLineHeader(index)">
                                                <v-icon size="16">mdi-delete-outline</v-icon>
                                            </v-btn>
                                        </template>

                                        <!-- 底部新增按钮 -->
                                        <template v-slot:bottom>
                                            <div class="w-100 text-end pa-2 border-t">
                                                <v-btn size="small" @click="AddLineHeader()">新增</v-btn>
                                            </div>
                                        </template>
                                    </v-data-table-virtual>
                                </v-sheet>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="auth">
                                <v-card flat>
                                    <v-card-item class="pa-0">
                                        <v-select label="认证类型" v-model="authData.type" :items="authTypes"
                                            variant="outlined" density="compact" max-width="200" hide-details
                                            class="mt-2"></v-select>
                                    </v-card-item>
                                    <v-card-item class="px-0 pt-3">
                                        <!-- none -->
                                        <v-sheet v-if="authData.type === 'none'"
                                            class="text-body-2 text-medium-emphasis pa-2">
                                            此请求不使用任何认证方式
                                        </v-sheet>

                                        <!-- Bearer Token -->
                                        <v-sheet v-if="authData.type === 'Bearer Token'">
                                            <v-text-field v-model="authData.bearerToken" label="Token"
                                                variant="outlined" density="compact" hide-details
                                                placeholder="输入 Bearer Token"
                                                :type="authData.showToken ? 'text' : 'password'">
                                                <template v-slot:append-inner>
                                                    <v-btn icon size="20" variant="plain"
                                                        @click="authData.showToken = !authData.showToken">
                                                        <v-icon size="16">{{ authData.showToken ?
                                                            'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                                                    </v-btn>
                                                </template>
                                            </v-text-field>
                                            <div class="text-caption text-medium-emphasis mt-1">
                                                发送时将自动在 Header 中添加：<code>Authorization: Bearer &lt;token&gt;</code>
                                            </div>
                                        </v-sheet>

                                        <!-- Basic Auth -->
                                        <v-sheet v-if="authData.type === 'Basic Auth'">
                                            <v-row dense>
                                                <v-col cols="6">
                                                    <v-text-field v-model="authData.basicAuth.username" label="用户名"
                                                        variant="outlined" density="compact" hide-details
                                                        placeholder="Username"></v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field v-model="authData.basicAuth.password" label="密码"
                                                        variant="outlined" density="compact" hide-details
                                                        placeholder="Password"
                                                        :type="authData.showPassword ? 'text' : 'password'">
                                                        <template v-slot:append-inner>
                                                            <v-btn icon size="20" variant="plain"
                                                                @click="authData.showPassword = !authData.showPassword">
                                                                <v-icon size="16">{{ authData.showPassword
                                                                    ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                                                            </v-btn>
                                                        </template>
                                                    </v-text-field>
                                                </v-col>
                                            </v-row>
                                            <div class="text-caption text-medium-emphasis mt-1">
                                                发送时将自动在 Header 中添加 Base64 编码的认证信息
                                            </div>
                                        </v-sheet>

                                        <!-- API Key -->
                                        <v-sheet v-if="authData.type === 'API Key'">
                                            <v-row dense>
                                                <v-col cols="5">
                                                    <v-text-field v-model="authData.apiKey.key" label="Key 名称"
                                                        variant="outlined" density="compact" hide-details
                                                        placeholder="X-API-Key" class="mt-2"></v-text-field>
                                                </v-col>
                                                <v-col cols="5">
                                                    <v-text-field v-model="authData.apiKey.value" label="Key 值"
                                                        variant="outlined" density="compact" hide-details
                                                        placeholder="your-api-key"
                                                        :type="authData.showApiKey ? 'text' : 'password'" class="mt-2">
                                                        <template v-slot:append-inner>
                                                            <v-btn icon size="20" variant="plain"
                                                                @click="authData.showApiKey = !authData.showApiKey">
                                                                <v-icon size="16">{{ authData.showApiKey
                                                                    ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                                                            </v-btn>
                                                        </template>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-select v-model="authData.apiKey.addTo" label="位置"
                                                        :items="['Header', 'Query']" variant="outlined"
                                                        density="compact" hide-details class="mt-2"></v-select>
                                                </v-col>
                                            </v-row>
                                            <div class="text-caption text-medium-emphasis mt-1">
                                                将 API Key 添加到请求的 {{ authData.apiKey.addTo }}
                                            </div>
                                        </v-sheet>
                                    </v-card-item>
                                </v-card>
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-sheet>
                </v-col>
                <!-- 响应体 -->
                <v-col class="pa-0" cols="12">
                    <v-card class="pa-1 h-100">
                        <!-- 状态栏 -->
                        <v-card-item class="pa-1" v-if="resData.code !== null || resData.error">
                            <div class="d-flex align-center" style="gap: 8px;">
                                <v-chip v-if="resData.code" size="small" :color="statusColor" variant="flat" label>
                                    {{ resData.code }}
                                </v-chip>
                                <span v-if="resData.time !== null" class="text-caption text-medium-emphasis">
                                    {{ resData.time }} ms
                                </span>
                                <v-chip v-if="resData.error" size="small" color="red" variant="flat" label>
                                    网络错误
                                </v-chip>
                            </div>
                        </v-card-item>

                        <!-- 响应选项卡 -->
                        <v-tabs v-model="state.response_tab" slider-color="purple-lighten-3" color="cyan" inset
                            density="compact">
                            <v-tab value="body">Body</v-tab>
                            <v-tab value="headers">Headers</v-tab>
                        </v-tabs>

                        <v-tabs-window v-model="state.response_tab">
                            <!-- Body -->
                            <v-tabs-window-item value="body">
                                <!-- 网络错误提示 -->
                                <v-sheet v-if="resData.error" class="pa-3 mt-2 rounded"
                                    style="background: #ffebee;">
                                    <div class="d-flex align-center">
                                        <v-icon color="red" class="mr-2" size="18">mdi-alert-circle</v-icon>
                                        <span class="text-body-2 font-weight-medium"
                                            style="color: #c62828;">请求失败</span>
                                    </div>
                                    <div class="text-caption mt-1" style="color: #b71c1c;">{{ resData.error }}</div>
                                </v-sheet>

                                <v-card-item class="pa-0">
                                    <v-select label="响应格式" v-model="resData.resType" :items="resType"
                                        variant="outlined" density="compact" max-width="200" hide-details
                                        class="mt-2"></v-select>
                                </v-card-item>

                                <v-card-item class="px-0 pt-2" v-if="resData.data !== null">
                                    <v-sheet v-if="resData.resType === 'json'">
                                        <pre class="ma-0 pa-2"
                                            style="white-space: pre-wrap; overflow-x: auto;">{{ formattedJson }}</pre>
                                    </v-sheet>
                                    <v-sheet v-if="resData.resType === 'xml'">
                                        <pre class="ma-0 pa-2" style="white-space: pre-wrap;">{{ resData.data }}</pre>
                                    </v-sheet>
                                    <v-sheet v-if="resData.resType === 'text'">{{ resData.data }}</v-sheet>
                                    <v-sheet v-if="resData.resType === 'html'" v-html="resData.data"></v-sheet>
                                </v-card-item>
                            </v-tabs-window-item>

                            <!-- Headers -->
                            <v-tabs-window-item value="headers">
                                <v-sheet v-if="resData.headers" class="mt-2">
                                    <div v-for="(value, key) in resData.headers" :key="key"
                                        class="d-flex text-caption py-1 border-b px-1">
                                        <span class="font-weight-bold mr-3"
                                            style="min-width: 160px; word-break: break-all;">{{ key }}</span>
                                        <span class="text-medium-emphasis"
                                            style="word-break: break-all;">{{ value }}</span>
                                    </div>
                                </v-sheet>
                                <v-sheet v-else class="text-caption text-medium-emphasis pa-2">暂无响应头</v-sheet>
                            </v-tabs-window-item>
                        </v-tabs-window>
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
import axios from 'axios';
import { Global } from '../store/Global';

export default {
    props: {
        /**
         * 传入格式以及相关参数的解释
         * BaseURL: false/true 是否继承项目的 BaseURL
         * Auth: {
         *  type: 'none/Basic/Bearer/OAuth2/API Key',
         *  basic: { 
         *   username: '',
         *   password: ''
         *  },
         * bearer: {
         *   token: ''
         *  },
         * apiKey: { 
         *   name: '',
         *   key: '',
         *  }
         * },
         * headers: [
         *   { name: '', value: '' },
         *   ...
         * ],
         * postDataL{
         *  type: GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS, 请求类型
         *  url: '', 如果没有继承BaseURL这里是完整的http地址，否则是接口地址
         *  postType: 'none/form-data/x-www-form-urlencoded/raw/binary/graphQL', 请求体数据类型
         *  body: null, 请求体数据··
         *  params: [], 请求参数
         * }
         */
        api: Object
    },
    data() {
        return {
            Global,
            // 页面状态数据
            state: {
                request_tab: 'body',
                response_tab: 'body',
                loading: false,
                SendFieldError: ''
            },
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
            // 发送的数据
            postData: {
                type: this.api.type,
                url: '',
                postType: 'none',
                body: null, // TODO 发送请求时的数据来源应该是这里，而不是在以下的数据结构容器中开始，后面需要将发送的数据指向到这里
                params: []
            },

            resType: ['xml', 'json', 'text', 'html'],
            // 获取的数据
            resData: {
                resType: 'json',
                code: null,
                data: null,
                headers: null,
                error: null,
                time: null
            },

            // form-data/x-www-form-urlencoded 表格列定义
            formDataHeaders: [
                { key: 'need', title: '传入', sortable: false, width: '80px' },
                { key: 'name', title: '参数名', sortable: false },
                { key: 'value', title: '值', sortable: false },
                { key: 'remark', title: '备注', sortable: false }
            ],

            // Header 表格列定义
            headerTableHeaders: [
                { key: 'need', title: '传入', sortable: false, width: '60px' },
                { key: 'name', title: 'Header名', sortable: false },
                { key: 'value', title: '值', sortable: false },
                { key: 'remark', title: '备注', sortable: false },
                { key: 'actions', title: '', sortable: false, width: '40px' }
            ],

            // 请求头数据
            requestHeaders: [
                { need: true, name: 'Content-Type', value: 'application/json', remark: '' }
            ],

            // Auth 认证类型
            authTypes: ['none', 'Bearer Token', 'Basic Auth', 'API Key'],

            // Auth 认证数据
            authData: {
                type: 'none',
                bearerToken: '',
                showToken: false,
                basicAuth: { username: '', password: '' },
                showPassword: false,
                apiKey: { key: '', value: '', addTo: 'Header' },
                showApiKey: false
            },

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
    computed: {
        statusColor() {
            const code = this.resData.code;
            if (!code) return 'grey';
            if (code < 200) return 'blue';
            if (code < 300) return 'green';
            if (code < 400) return 'cyan';
            if (code < 500) return 'orange';
            return 'red';
        },
        formattedJson() {
            const data = this.resData.data;
            if (data === null || data === undefined) return '';
            if (typeof data === 'object') return JSON.stringify(data, null, 2);
            try { return JSON.stringify(JSON.parse(data), null, 2); }
            catch { return String(data); }
        }
    },
    created() {
        // 处理该接口的前置条件

        // BaseURL处理
        if (this.Global.BaseURL) {

        }
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
         * @name 新增一行请求头
         * @type 请求头
         */
        AddLineHeader() {
            this.requestHeaders.push({
                need: true,
                name: '',
                value: '',
                remark: ''
            });
        },

        /**
         * @name 删除一行请求头
         * @type 请求头
         * @param {number} index 行索引
         */
        RemoveLineHeader(index) {
            this.requestHeaders.splice(index, 1);
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
        },

        /**
         * @name 发送请求
         */
        async SendDataToServer() {

            // 检查当前是否为有效请求
            if (this.postData.url === '' || this.postData.url === null) {
                this.state.SendFieldError = 'URL不能为空';
            }
            // 1. 构建请求头：合并 requestHeaders 中启用的项
            const headers = {};
            this.requestHeaders
                .filter(h => h.need && h.name)
                .forEach(h => { headers[h.name] = h.value; });

            // 注入认证信息
            const auth = this.authData;
            if (auth.type === 'Bearer Token' && auth.bearerToken) {
                headers['Authorization'] = `Bearer ${auth.bearerToken}`;
            } else if (auth.type === 'Basic Auth') {
                const { username, password } = auth.basicAuth;
                if (username || password) {
                    headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
                }
            } else if (auth.type === 'API Key' && auth.apiKey.key && auth.apiKey.addTo === 'Header') {
                headers[auth.apiKey.key] = auth.apiKey.value;
            }

            // 2. 构建请求体
            let data = null;
            const postType = this.postData.postType;

            if (postType === 'form-data') {
                const formData = new FormData();
                this.requestBody['form-data']
                    .filter(item => item.need && item.name)
                    .forEach(item => formData.append(item.name, item.value));
                data = formData;
                // 让浏览器自动设置 multipart boundary，不能手动指定
                delete headers['Content-Type'];
            } else if (postType === 'x-www-form-urlencoded') {
                const urlParams = new URLSearchParams();
                this.requestBody['x-www-form-urlencoded']
                    .filter(item => item.need && item.name)
                    .forEach(item => urlParams.append(item.name, item.value));
                data = urlParams;
            } else if (postType === 'raw') {
                data = this.requestBody.raw;
            }

            // 3. 构建 query 参数（API Key 注入 Query 的场景）
            const params = {};
            if (auth.type === 'API Key' && auth.apiKey.key && auth.apiKey.addTo === 'Query') {
                params[auth.apiKey.key] = auth.apiKey.value;
            }

            // 4. 发送请求
            this.state.loading = true;
            this.resData.data = null;
            this.resData.code = null;
            this.resData.headers = null;
            this.resData.error = null;
            this.resData.time = null;

            const detectResType = (headers) => {
                const ct = (headers?.['content-type'] || '').toLowerCase();
                if (ct.includes('application/json')) return 'json';
                if (ct.includes('text/html')) return 'html';
                if (ct.includes('xml')) return 'xml';
                return 'text';
            };

            const startTime = Date.now();
            try {
                const response = await axios({
                    method: this.postData.type,
                    url: this.postData.url,
                    baseURL: '' || this.Global.BaseURL,
                    headers,
                    params,
                    data
                });

                this.resData.time = Date.now() - startTime;
                this.resData.code = response.status;
                this.resData.data = response.data;
                this.resData.headers = response.headers;
                this.resData.resType = detectResType(response.headers);
            } catch (err) {
                this.resData.time = Date.now() - startTime;
                if (err.response) {
                    // 服务器有响应，但状态码为 4xx/5xx
                    this.resData.code = err.response.status;
                    this.resData.data = err.response.data;
                    this.resData.headers = err.response.headers;
                    this.resData.resType = detectResType(err.response.headers);
                } else {
                    // 网络错误 / 超时 / 跨域等
                    this.resData.error = err.message;
                }
            } finally {
                this.state.loading = false;
            }
        },
    }
};
</script>
<style scoped></style>