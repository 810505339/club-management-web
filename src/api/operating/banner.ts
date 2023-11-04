/*
 * @Author: yxx
 * @Date: 2023-10-29 10:40:54
 * @LastEditTime: 2023-11-04 18:44:23
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\api\operating\banner.ts
 */
import request from '/@/utils/request';
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

export function fetchList(query?: Object) {
	return request({
		url: '/operation/carousel/page',
		method: 'get',
		params: query,
	});
}

export function addCarousel(obj?: Object) {
	return request({
		url: '/operation/carousel',
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


export function getCarouselId(id?: Object) {
	return request({
		url: `/operation/carousel/${id}`,
		method: 'get',
	});
}

export const deleteCarouselByIds = (ids: string[]) => {
	return request({
		url: "/operation/carousel",
		method: 'delete',
		data: ids,
	})
}
export const EditCarousel = (data?: Object) => {
	return request({
		url: '/operation/carousel',
		method: 'put',
		data,
	});
};