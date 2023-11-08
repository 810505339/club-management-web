<template>
  <div class="layout-padding">
    <splitpanes>
      <pane>
        <div class="layout-padding-auto layout-padding-view ">
          <div class="flex h-full  p-10">
            <el-tabs tab-position="left" class="h-full w-full">
              <el-tab-pane label="User">User</el-tab-pane>
              <el-tab-pane label="Config">Config</el-tab-pane>
              <el-tab-pane label="Role">Role</el-tab-pane>

            </el-tabs>
          </div>
        </div>
      </pane>
    </splitpanes>


  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

</script>
<style scoped>
:deep(.el-tabs__header) {
  width: 200px;
  border-right: 0.5px rgba(242, 242, 242, 1) solid;
}

:deep(.el-tabs__nav-scroll .el-tabs__item) {
  text-align: center;
}
</style>
