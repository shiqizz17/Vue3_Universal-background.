<script>
import { defineComponent } from 'vue';
import CommonAside from '../components/CommonAside.vue';
import CommonHeader from '../components/CommonHeader.vue'
import CommonTab from '../components/CommonTab.vue'
export default defineComponent({
  components: {
    CommonHeader,
    CommonAside,
    CommonTab
  }
})
</script>

<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <CommonAside />
      <el-container class="right-container">
        <CommonHeader />
        <commonTab></commonTab>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.right-container {
  flex-wrap: wrap;
  align-content: flex-start;
}

.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      height: 100%;
      background-color: #545c64;
    }
  }
}
</style>