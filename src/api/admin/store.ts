import request from '/@/utils/request';

export const AddStore = (params?: Object) => {
  return request({
    url: '/admin/store',
    method: 'post',
    params,
  });
};

export const EditStore = (params?: Object) => {
  return request({
    url: '/admin/store',
    method: 'put',
    params,
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
