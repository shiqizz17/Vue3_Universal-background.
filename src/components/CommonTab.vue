<script>
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const tags = store.state.tabsList

    const changeMenu = (item) => {
      router.push({name: item.name})
    }

    const handleClose = (tag, index) => {
      let length = tags.length - 1
      store.commit('closeTab', tag)
      if(tag.name !== route.name) {
        return;
      }

      if(index === length) {
        router.push({name: tags[index-1].name})
      } else {
        router.push({name: tags[index].name})
      }
    }

    return {
      tags,
      changeMenu,
      handleClose
    }
  },
}
</script>

<template>
  <div class="tags">
    <el-tag 
      :key="tag.name"
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{tag.label}}
    </el-tag>
  </div>
</template>

<style lang="less" scoped>
  .tags {
    padding: 10px 20px;
    width: 100%;
    .el-tag {
      margin-right: 20px;
      cursor: pointer;
    }
  }
</style>