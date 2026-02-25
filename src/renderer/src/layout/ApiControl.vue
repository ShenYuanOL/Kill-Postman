<template>
    <v-navigation-drawer permanent>
        <v-list-item>
            <v-list-item>
                <v-list-item-title>Project</v-list-item-title>
                <template #append>
                    <v-btn icon size="25" class="ml-2" @click.stop="SettingOBJ">
                        <v-icon size="14">mdi-controller</v-icon>
                    </v-btn>
                </template>
            </v-list-item>
        </v-list-item>
        <v-treeview :items="items" density="compact" item-value="title" class="text-body-2" :hide-actions="true"
            :indent-lines="true" :separate-roots="false" activatable open-on-click @update:activated="handleActivated">
            <template #prepend="{ item, isOpen }">
                <v-icon v-if="!item.type" :icon="isOpen ? 'mdi-folder-open' : 'mdi-folder'"></v-icon>

                <v-chip v-else size="x-small" :color="type[item.type]">
                    {{ item.type }}
                </v-chip>
            </template>
        </v-treeview>
    </v-navigation-drawer>
    <div v-if="selected.length <= 0">从右边选择一个接口以开始</div>

    <v-sheet v-else elevation="4" class="pa-0 h-100 d-flex flex-column">
        <v-tabs v-model="tab" color="primary" center-active show-arrows density="comfortable">
            <v-tab v-for="(item, index) in selected" :key="item.title" :value="index">
                <span class="text-caption d-inline-block text-truncate" style="max-width: 80px">{{
                    item.title
                    }}</span>
                <template #append>
                    <v-btn icon size="25" class="ml-2" @click.stop="handleClose(item)">
                        <v-icon size="14">mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <v-sheet class="flex-1-1-100 overflow-hidden">
            <useApi :api="selectedFace" :key="selectedFace ? selectedFace.title : 'none'" />
        </v-sheet>
    </v-sheet>

    <!-- 当前项目配置弹窗 -->
    <v-dialog v-model="state.SettingOBJ" max-width="600">
        <v-card flat>
            <v-card-title>项目配置（修改后立即生效）</v-card-title>
            <v-card-item>
                <v-row no-gutters>
                    <v-col cols="12">
                        <v-text-field label="项目名" v-model="OBJData.name"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="BaseURL" v-model="Global.BaseURL"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-item>
            <v-card-actions>
                <v-btn text @click="state.SettingOBJ = false">关闭</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import useApi from '../view/useApi.vue';
import { Global } from '../store/Global';

export default {
    name: 'ApiControl',
    components: {
        useApi
    },
    data() {
        return {
            Global,
            // 页面状态数据
            state: {
                SettingOBJ: false,
            },
            // 项目配置数据
            OBJData: {
                name: 'probject',
                BaseURL: Global.BaseURL,
            },

            type: {
                get: 'green',
                post: 'orange',
                put: 'light-blue',
                delete: 'amber',
                patch: 'purple',
                head: 'teal',
                options: 'pink'
            },
            selected: [],
            selectedFace: null,
            items: [
                {
                    title: 'public',
                    children: [
                        {
                            title: 'static',
                            children: [
                                {
                                    id: 1,
                                    title: '这是一个get请求',
                                    type: 'get'
                                }
                            ]
                        },
                        {
                            id: 2,
                            title: '这是一个post请求',
                            type: 'post'
                        },
                        {
                            id: 3,
                            title: '这是一个put请求',
                            type: 'put'
                        }
                    ]
                },
                {
                    id: 4,
                    title: '这是一个delete请求',
                    type: 'delete'
                },
                {
                    id: 5,
                    title: '这是一个patch请求',
                    type: 'patch'
                },
                {
                    id: 6,
                    title: '这是一个head请求',
                    type: 'head'
                },
                {
                    id: 7,
                    title: '这是一个options请求',
                    type: 'options'
                }
            ],
            tab: null
        };
    },
    watch: {
        // 监听标签页切换，更新选中的接口
        tab(newTab) {
            if (newTab !== null && this.selected[newTab]) {
                this.selectedFace = this.selected[newTab];
            }
        }
    },
    methods: {
        handleActivated(activated) {
            // activated 是一个包含被激活项的值的数组
            if (activated && activated.length > 0) {
                const activatedTitle = activated[0];

                // 查找对应的item对象
                const findItem = (items, title) => {
                    for (const item of items) {
                        if (item.title === title) {
                            return item;
                        }
                        if (item.children) {
                            const found = findItem(item.children, title);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const item = findItem(this.items, activatedTitle);
                console.log(item);

                if (item && item.type) {
                    // 检查是否已经存在于selected中，避免重复添加
                    const exists = this.selected.some((s) => s.title === item.title);
                    if (!exists) {
                        this.selected.push(item);
                        // 切换到新添加的标签页
                        this.tab = this.selected.length - 1;
                        this.selectedFace = item;
                    } else {
                        // 如果已存在，切换到对应的标签页
                        const index = this.selected.findIndex((s) => s.title === item.title);
                        this.tab = index;
                        this.selectedFace = item;
                    }
                }
            }
        },
        handleClose(item) {
            const index = this.selected.indexOf(item);
            if (index === -1) return;

            const currentTab = this.tab;
            this.selected.splice(index, 1);

            if (this.selected.length === 0) {
                this.tab = null;
                this.selectedFace = null;
            } else if (index === currentTab) {
                const newIndex = index > 0 ? index - 1 : 0;
                this.tab = newIndex;
            } else if (index < currentTab) {
                this.tab = currentTab - 1;
            }
        },

        /**
         * @name 项目设置按钮
         */
        SettingOBJ() {
            this.state.SettingOBJ = !this.state.SettingOBJ;
        }
    }
};
</script>
<style scoped></style>
