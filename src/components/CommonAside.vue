<script>
import { HomeFilled, HelpFilled, Avatar, Grid, Share, Promotion } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'

export default {
  setup() {
    let list = [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: HomeFilled,
        url: 'Home/Home'
      },
      {
        path: '/mall',
        name: 'mall',
        label: '商品管理',
        icon: HelpFilled,
        url: 'MallManage/MallManage'
      },
      {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: Avatar,
        url: 'UserManage/UserManage'
      },
      {
        path: '/other',
        label: '其他',
        icon: Grid,
        children: [
          {
            path: '/page1',
            name: 'page1',
            label: '其他111',
            icon: Share,
            url: 'Other/PageOne'
          },
          {
            path: '/page2',
            name: 'page2',
            label: '其他222',
            icon: Promotion,
            url: 'Other/PageTwo'
          }
        ]
      }
    ]

    const router = useRouter()
    const store = useStore()

    const noChildren = () => {
      return asyncList.filter(item => !item.children)
    }

    const hasChildren = () => {
      return asyncList.filter(item => item.children)
    }

    const asyncList = store.state.menu

    const clickMenu = (item) => {
      router.push({
        name: item.name
      })

      // 通过Vuex来管理，实现面包屑功能
      store.commit('selectMenu', item)
    } 

    return {
      noChildren,
      hasChildren,
      clickMenu,
      asyncList
    }
  }
}
</script>

<template>
  <el-aside :width="$store.state.isCollapse ? '180px' : '64px'">
    <el-menu 
      class="el-menu-vertical-demo" 
      background-color="#545c64" 
      text-color="#fff"
      :collapse="!$store.state.isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="$store.state.isCollapse">后台管理</h3>
      <h3 v-show="!$store.state.isCollapse">后台</h3>
      <el-menu-item 
        :index="item.path" 
        v-for="item in noChildren()" 
        :key="item.path"
        @click="clickMenu(item)"
      >
        <el-icon>
          <component class="icons" :is="item.icon"></component>
        </el-icon>
        <span>{{item.label}}</span>
      </el-menu-item>
      <el-sub-menu :index="item.label" v-for="item in hasChildren()" :key="item.path">
        <template #title>
          <el-icon>
            <component class="icons" :is="item.icon"></component>
          </el-icon>
          <span>{{item.label}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item 
            :index="subItem.path" 
            v-for="(subItem, subIndex) in item.children" 
            :key="subIndex"
            @click="clickMenu(subItem)"
          >
            <el-icon>
              <component class="icons" :is="subItem.icon"></component>
            </el-icon>
            <span>{{subItem.label}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<style lang="less" scoped>
  .icon {
    width: 18px;
    height: 18px;
  }
  .el-menu {
    border-right: none;
    h3 {
      line-height: 48px;
      color: #fff;
      text-align: center;
      font-weight: 600;
    }
  }
</style>