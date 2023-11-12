import request from "/@/utils/request";

export const getList = (form: any) => {
  return request({
    url: 'admin/agreementManage/list',
    method: 'get',
    params: form
  });
}

export const putAgreement = (form: any) => {
  return request({
    url: '/admin/agreementManage',
    method: 'put',
    data: form
  });
}
