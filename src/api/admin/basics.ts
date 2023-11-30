import request from "/@/utils/request";

export const AddDynamicType = (data?: Object) => {
  return request({
    url: '/admin/dynamicType',
    method: 'post',
    data,
  });
};

export const EditDynamicType = (data?: Object) => {
  return request({
    url: '/admin/dynamicType',
    method: 'PUT',
    data,
  });
};

export const DeleteDynamicTypeByIds = (ids: string[]) => {
  return request({
    url: `/admin/dynamicType`,
    method: 'DELETE',
    data: ids,

  })
}

export const getDynamicTypeById = (id: string) => {
  return request({
    url: `/admin/dynamicType/${id}`,
    method: 'get',
  })
}


export const getDynamicTypePage = (params?: Object) => {
  return request({
    url: '/admin/dynamicType/page',
    method: 'get',
    params,
  });
};
