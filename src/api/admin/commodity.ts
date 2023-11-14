import { getTicketById } from './commodity';
import request from '/@/utils/request';

//新增
export const AdddrinksMeal = (data?: Object) => {
  return request({
    url: '/operation/drinksMeal',
    method: 'post',
    data,
  });
};
//修改
export const EditdrinksMeal = (data?: Object) => {
  return request({
    url: '/operation/drinksMeal',
    method: 'put',
    data,
  });
};

export const getdrinksMealList = (params?: Object) => {
  return request({
    url: '/operation/drinksMeal/page',
    method: 'get',
    params,
  });
};

//根据id查询

export const getAreaById = (id: string) => {
  return request({
    url: `/operation/drinksMeal/${id}`,
    method: 'get',
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
    url: `/admin/area/updateEnabled`,
    method: 'put',
    data

  });
}



export const deletedrinksMealByIds = (ids: string[]) => {
  return request({
    url: "/operation/drinksMeal",
    method: 'delete',
    data: ids,
  })
}



export const addTicket = (data: any) => {
  return request({
    url: "/operation/ticket",
    method: 'POST',
    data: data
  })
}

export const putTicket = (data: any) => {
  return request({
    url: "/operation/ticket",
    method: 'PUT',
    data: data
  })
}

export const deleteTicketByIds = (ids: string[]) => {
  return request({
    url: `/operation/ticket/${ids}`,
    method: 'DELETE',

  })
}

export const getTicketById = (id: string) => {
  return request({
    url: `/operation/ticket/${id}`,
    method: 'get',
  })
}




export const getTicketAll = () => {
  return request({
    url: `/operation/ticket/getAll`,
    method: 'get',
  })
}

export const getTicket = (params: any) => {
  return request({
    url: `/operation/ticket/getPage`,
    method: 'get',
    params
  })
}





//分页
export const getTicketDetail = (data: any) => {
  return request({
    url: `/operation/ticketDetail/page`,
    method: 'get',
    params: data
  })
}

export const updateEnabledByTicketDetail = (data: Object) => {
  return request({
    url: `/operation/ticketDetail/enabledById`,
    method: 'put',
    params: data

  });
}
export const addTicketDetail = (data: any) => {
  return request({
    url: `/operation/ticketDetail`,
    method: 'post',
    data
  })
}

