/*
 * @Author: yxx
 * @Date: 2023-12-27 20:45:12
 * @LastEditTime: 2023-12-27 20:48:36
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\api\order\index.ts
 */
import request from '/@/utils/request';
import { Session } from '/@/utils/storage';
import { validateNull } from '/@/utils/validate';
import { useUserInfo } from '/@/stores/userInfo';
import other from '/@/utils/other';

/**
 * https://www.ietf.org/rfc/rfc6749.txt
 * OAuth 协议 4.3.1 要求格式为 form 而不是 JSON 注意！
 */
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';



/**
 * 获取订单列表
 */
export const fetchList = (query: Object) => {
	return request({
		url: '/consumption/orderManage/page',
		method: 'get',
		params: query,
	});
};

