/*
 * @Author: yxx
 * @Date: 2023-10-29 10:40:54
 * @LastEditTime: 2023-12-20 00:11:40
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\api\operating\coupon.ts
 */
import request from '/@/utils/request';
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

export function fetchList(query?: Object) {
	return request({
		url: '/operation/coupon/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/operation/coupon',
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
		url: `/operation/coupon/couponAudit`,
		method: 'put',
		data

	});
}

export function getObj(id?: Object) {
	return request({
		url: `/operation/coupon/${id}`,
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
		url: '/operation/coupon',
		method: 'put',
		data,
	});
};
//门店活动级联下拉
export const getStoreActivity = () => {
	return request({
		url: '/operation/dynamicState/getStoreActivity',
		method: 'get',
	});
};
//门店门票级联下拉
export const storeTicket = async () => {
	return request({
		url: '/operation/ticket/storeTicket',
		method: 'get',
	});
};
export const getActivityByStoreId = (id: any) => {
	return request({
		url: '/operation/dynamicState/getActivityByStoreId/' + id,
		method: 'get',
	});
};
export const getTicketByStoreId = async (id: any) => {
	return request({
		url: '/operation/ticket/getTicketByStoreId/' + id,
		method: 'get',
	});
};
export const getAreaBoothById = async (id: any) => {
	return request({
		url: '/admin/store/getAreaBoothById/' + id,
		method: 'get',
	});
};
export const getWinePartyMode = async () => {
	return request({
		url: '/operation/coupon/getWinePartyMode',
		method: 'get',
	});
};
//门店卡座级联下拉
export const storeAreaTree = (type: any) => {
	return request({
		url: '/admin/store/storeAreaTree',
		method: 'get',
		params: type
	});
};

// 优惠券发放
export const couponIssue = (obj: any) => {
	return request({
		url: '/operation/coupon/couponIssue',
		method: 'post',
		data: obj,
	});
};
export function getList(query?: Object) {
	return request({
		url: '/operation/coupon/page/couponCustomer',
		method: 'get',
		params: query,
	});
}

export const couponCustomerState = (data?: Object) => {
	return request({
		url: '/operation/coupon/couponCustomerState',
		method: 'put',
		data,
	});
};

//优惠券停止发放
export const couponStopIssue = (id: any) => {
	return request({
		url: `/operation/coupon/couponStopIssue/${id}`,
		method: 'post',
	});
};

//新增审核任务
export const couponCreateAudit = (data?: Object) => {
	return request({
		url: '/operation/coupon/couponCreat',
		method: 'post',
		data,
	});
};
//优惠券审核分页查询
export function getCouponAudit(query?: Object) {
	return request({
		url: '/operation/coupon/page/couponAudit',
		method: 'get',
		params: query,
	});
}


