import request from '/@/utils/request';

//
export const AddArea = (data?: Object) => {
  return request({
    url: '/admin/area',
    method: 'post',
    data,
  });
};

export const EditArea = (data?: Object) => {
  return request({
    url: '/admin/area',
    method: 'put',
    data,
  });
};

export const getAreaList = (params?: Object) => {
  return request({
    url: '/admin/area/page',
    method: 'get',
    params,
  });
};


export const getAreaById = (storeId: string) => {
  return request({
    url: `/admin/area/${storeId}`,
    method: 'get',
  });
}

//上下架
/* {
  "id": 0,
  "enabled": ""
}
 */
export const updateEnabled = (params: any) => {
  return request({
    url: `/admin/area/updateEnabled/${params.id}`,
    method: 'put',
  });
}



export const deleteAreaByIds = (ids: string[]) => {
  return request({
    url: "/admin/area",
    method: 'delete',
    data: ids,
  })
}



