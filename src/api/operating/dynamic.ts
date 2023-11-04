/*
 * @Author: yxx
 * @Date: 2023-10-29 10:40:54
 * @LastEditTime: 2023-11-04 16:34:51
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\api\operating\dynamic.ts
 */
import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/operation/dynamicState/page',
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

export function getObj(id?: string) {
	return request({
		url: '/job/sys-job/' + id,
		method: 'get',
	});
}

export function delObj(id?: string) {
	return request({
		url: '/job/sys-job/' + id,
		method: 'delete',
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/job/sys-job',
		method: 'put',
		data: obj,
	});
}

export function startJobRa(jobId: string) {
	return request({
		url: '/job/sys-job/start-job/' + jobId,
		method: 'post',
	});
}

export function runJobRa(jobId: string) {
	return request({
		url: '/job/sys-job/run-job/' + jobId,
		method: 'post',
	});
}

export function shutDownJobRa(jobId: string) {
	return request({
		url: '/job/sys-job/shutdown-job/' + jobId,
		method: 'post',
	});
}
