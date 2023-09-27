<!--
 * @Author: yxx
 * @Date: 2023-08-29 09:12:52
 * @LastEditTime: 2023-09-27 21:37:42
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\layout\logo\index.vue
-->
<template>
	<div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
		<!-- <span>{{ themeConfig.globalTitle }}</span> -->
		<img :src="logo" class=" w-[180px]" />
	</div>
	<div class="layout-logo-size" v-else @click="onThemeConfigChange">
		<img :src="logoMini" class="layout-logo-size-img" />
	</div>
</template>

<script setup lang="ts" name="layoutLogo">
import { useThemeConfig } from '/@/stores/themeConfig';
import logoMini from '/@/assets/images/logo2.png';
import logo from '/@/assets/images/logo1.png';
// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
	let { isCollapse, layout } = themeConfig.value;
	return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
});
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
	if (themeConfig.value.layout === 'transverse') return false;
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
};
</script>

<style scoped lang="scss">
.layout-logo {
	width: 220px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--el-color-primary);
	font-size: 16px;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;

	span {
		white-space: nowrap;
		display: inline-block;
		font-size: 21.5px;
		font-weight: 700;
		white-space: nowrap;
	}

	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}
}

.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;

	&-img {
		width: 20px;
		margin: auto;
	}

	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
