
import request from "/@/utils/request";


export const getApplicationPage = async (params: any) => {
  const { data } = await request({
    url: '/admin/applicationVersion/page',
    method: 'get',
    params: params
  });
  console.log(data, 'data')
  return data
}


export const addApplication = async () => {
  const { data } = await request({
    url: '/admin/applicationVersion',
    method: 'get'
  });
  return data
}

export const editApplication = async () => {
  const { data } = await request({
    url: '/admin/applicationVersion',
    method: 'PUT'
  });
  return data
}


export const getApplicationById = async (id: string) => {
  const { data } = await request({
    url: `/admin/applicationVersion/${id}`,
    method: 'PUT'
  });
  return data
}
