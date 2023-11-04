/*
 * @Author: yxx
 * @Date: 2023-10-29 10:40:54
 * @LastEditTime: 2023-11-04 20:40:17
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\api\operating\adv.ts
 */
import request from '/@/utils/request';
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

export function fetchList(query?: Object) {
	return request({
		url: '/operation/windowAdvertising/page',
		method: 'get',
		params: query,
	});
}

export function addCarousel(obj?: Object) {
	return request({
		url: '/operation/windowAdvertising',
		method: 'post',
		data: obj,
	});
}

export const updateEnabled = (data: Object) => {
	return request({
		url: `/operation/windowAdvertising/updateEnabled`,
		method: 'put',
		headers: {
			'Content-Type': FORM_CONTENT_TYPE,
		},
		data

	});
}

export function getCarouselId(id?: Object) {
	return request({
		url: `/operation/windowAdvertising/${id}`,
		method: 'get',
	});
}
export const EditCarousel = (data?: Object) => {
	return request({
		url: '/operation/carousel',
		method: 'put',
		data,
	});
};
