import request from '/@/utils/request';

export const AddStore = (data?: Object) => {
  return request({
    url: '/admin/store',
    method: 'post',
    data,
  });
};

export const EditStore = (data?: Object) => {
  return request({
    url: '/admin/store',
    method: 'put',
    data,
  });
};

export const getStoreList = (params?: Object) => {
  return request({
    url: '/admin/store/page',
    method: 'get',
    params,
  });
};


export const getStoreById = (storeId: string) => {
  return request({
    url: `/admin/store/${storeId}`,
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
    url: `/admin/store/updateEnabled/${params.id}`,
    method: 'put',
  });
}


export const getStoreName = () => {
  return request({
    url: "/admin/store/storeNameList",
    method: 'get',
  })
}


export const deleteStoreByIds = (ids: string[]) => {
  return request({
    url: "/admin/store",
    method: 'delete',
    data: ids,
  })
}


