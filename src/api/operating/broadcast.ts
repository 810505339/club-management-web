/*
 * @Author: yxx
 * @Date: 2023-10-29 10:40:54
 * @LastEditTime: 2023-11-05 13:19:46
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\api\operating\broadcast.ts
 */
import request from '/@/utils/request';
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

export function fetchList(query?: Object) {
	return request({
		url: '/operation/broadcast/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/operation/messageManage',
		method: 'post',
		data: obj,
	});
}
//上下架
/* {
	"id": 0,
	"enabled": ""
}
 */
export const updateEnabled = (data: Object) => {
	return request({
		url: `/operation/carousel/updateEnabled`,
		method: 'put',
		headers: {
			'Content-Type': FORM_CONTENT_TYPE,
		},
		data

	});
}

export function getObj(id?: Object) {
	return request({
		url: `/operation/messageManage/${id}`,
		method: 'get',
	});
}

export const deleteObj = (ids: string[]) => {
	return request({
		url: "/operation/messageManage",
		method: 'delete',
		data: ids,
	})
}
export const putObj = (data?: Object) => {
	return request({
		url: '/operation/messageManage',
		method: 'put',
		data,
	});
};