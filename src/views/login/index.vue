<!--
 * @Author: yxx
 * @Date: 2023-09-03 00:23:12
 * @LastEditTime: 2023-09-27 21:12:06
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\views\login\index.vue
-->
<template>
	<div class="select-none">

		<!-- <img :src="bg" class="wave" /> -->
		<!-- <div class="flex-c absolute right-5 top-3"></div> -->
		<div class="login-main p-[30px]">

			<div class="flex justify-between items-center">
				<img class="w-[116px]" :src="getImageUrl('logo')" alt="">
				<div class="text-[#fff]">
					<span class="mr-[10px]">官方网站</span>
					<el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="onLanguageChange">
						<div class="layout-navbars-breadcrumb-user-icon">
							<i class="iconfont" :class="state.disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'"
								:title="$t('user.title1')"></i> {{ state.disabledI18n === 'en' ? 'English' : '中文' }}
						</div>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="zh-cn" :disabled="state.disabledI18n === 'zh-cn'">中文</el-dropdown-item>
								<el-dropdown-item command="en" :disabled="state.disabledI18n === 'en'">English</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>

			</div>
			<div class="login-container">
				<div class="img">
					<div class="h-[515px] flex items-end">
						<div>
							<p class="text-[80px] font-bold text-[#fff] text-right">0.2 LOUNGE & CLUB</p>
							<p class="text-[48px] font-bold text-[#E6A055]">{{ $t('common.management') }}</p>
						</div>
					</div>
				</div>
				<div class="login-box">
					<div class="login-form">
						<div class="flex justify-between items-center mb-[50px]">
							<div class="login-title">{{ $t('password.accountBtnText') }}</div>
							<div class="text-right text-[16px]">
								{{ $t('signInText') }}<br />{{ $t('signInText1') }}
							</div>
						</div>

						<Password @signInSuccess="signInSuccess" />
					</div>
				</div>
			</div>
			<div class="flex justify-between text-[#fff]">
				<span>{{ $t('common.text') }}</span>
				<span>{{ $t('common.text1') }}</span>
			</div>
		</div>

	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';

import { Local } from '/@/utils/storage';
import other from '/@/utils/other';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import commonFunction from '/@/utils/commonFunction';
const { getImageUrl } = commonFunction();
// 定义变量内容
const { locale } = useI18n();
interface State {
	[key: string]: boolean | string;
	isScreenfull: boolean;
	disabledI18n: string;
	disabledSize: string;
}
// 初始化组件大小/i18n
const initI18nOrSize = (value: string, attr: string) => {
	state[attr] = Local.get('themeConfig')[value];
};
const state = reactive<State>({
	isScreenfull: false,
	disabledI18n: 'zh-cn',
	disabledSize: 'large',
});
// 语言切换
const onLanguageChange = (lang: string) => {
	Local.remove('themeConfig');
	themeConfig.value.globalI18n = lang;
	Local.set('themeConfig', themeConfig.value);
	locale.value = lang;
	other.useTitle();
	initI18nOrSize('globalI18n', 'disabledI18n');
};
// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'));
const Register = defineAsyncComponent(() => import('./component/register.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// 是否开启注册
const registerEnable = ref(import.meta.env.VITE_REGISTER_ENABLE === 'true');

// 默认选择账号密码登录方式
const tabsActiveName = ref('account');

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().wraning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxis(new Date());
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {
			router.push('/');
		}
		// 登录成功提示
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
};

// 页面加载时
onMounted(() => {
	NextLoading.done();
});
</script>
