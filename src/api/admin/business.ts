import request from "/@/utils/request";

export const getList = () => {
  return request({
    url: '/admin/businessConfig/getList',
    method: 'get',

  });
}

export const putbusiness = (form: any) => {
  return request({
    url: '/admin/businessConfig',
    method: 'put',
    data: form
  });
}
