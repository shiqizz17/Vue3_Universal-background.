<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import {useRouter} from 'vue-router'

export default {
  setup() {
    let store = useStore()
    let router = useRouter()

    const getImgSrc = (user) => {
      return new URL(`../assets/${user}.jpg`, import.meta.url).href
    }
    const handleCollapse = () => {
      // 调用vuex中的mutations
      store.commit('updateIsCollapse')
    }

    // 获取vuex中的currentMenu
    const current = computed(() => {
      return store.state.currentMenu
    })

    // 个人中心退出操作
    const handleLoginOut = () => {
      store.commit('cleanMenu')
      router.push({
        name: 'login'
      })
    }

    return {
      getImgSrc,
      handleCollapse,
      current,
      handleLoginOut
    }
  }
}
</script>

<template>
  <el-header>
    <div class="left-content">
      <el-button size="small" plain @click="handleCollapse">
        <el-icon size="20">
          <Menu />
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/">
        <!-- 首页一定存在，所以可以直接写死 -->
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user" :src="getImgSrc('萌猫')" alt="">
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #333;
}

.right-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.left-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }

  h3 {
    color: #fff;
  }
}

.el-breadcrumb /deep/ span {
  color: #fff !important;
  cursor: pointer !important;
}

</style>