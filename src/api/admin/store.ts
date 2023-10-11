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
export const updateEnabled = (data: Object) => {
  return request({
    url: `/admin/store/updateEnabled`,
    method: 'put',
    data

  });
}
