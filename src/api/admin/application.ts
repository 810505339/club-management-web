
import request from "/@/utils/request";


export const getApplicationPage = async (params: any) => {
  return await request({
    url: '/admin/applicationVersion/page',
    method: 'get',
    params: params
  });


}


export const addApplication = async (data: any) => {
  const { data: res } = await request({
    url: '/admin/applicationVersion',
    method: 'POST',
    data
  });
  return res
}

export const editApplication = async (data: any) => {
  const { data: res } = await request({
    url: '/admin/applicationVersion',
    method: 'PUT',
    data
  });
  return res
}


export const getApplicationById = async (id: string) => {
  const { data } = await request({
    url: `/admin/applicationVersion/${id}`,
    method: 'GET'
  });
  return data
}
