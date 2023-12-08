import request from '/@/utils/request';


//拼酒局数据概况
export type IParams = {
  beginDate: string,
  endDate: string,
  storeId: string
}
export const wineParty = async (params: IParams) => {
  const { data } = await request({
    url: `/data/dataBoard/wineParty/${params.storeId}`,
    method: 'get',
    params: params,
  })
  return data
}

//订单及流水统计
export const orderSale = async (params: IParams) => {
  const { data } = await request({
    url: `/data/dataBoard/orderSale/${params.storeId}`,
    method: 'get',
    params: params,
  })
  return data
}
//用户来店方式占比
export const enterStore = async (params: IParams) => {
  const { data } = await request({
    url: `/data/dataBoard/enterStore/${params.storeId}`,
    method: 'get',
    params: params,
  })
  return data
}

//酒水套餐排行榜
export const drinkMealRanking = async (params: IParams) => {
  const { data } = await request({
    url: `/data/dataBoard/drinkMealRanking/${params.storeId}`,
    method: 'get',
    params: params,
  })
  return data
}

//用户性别、年龄占比
export const customerAgeGender = async (params: IParams) => {
  const { data } = await request({
    url: `/data/dataBoard/customerAgeGender/${params.storeId}`,
    method: 'get',
    params: params,
  })
  return data
}
//区域偏好数据
export const areaPreference = async (params: IParams) => {
  const { data } = await request({
    url: `/data/dataBoard/areaPreference/${params.storeId}`,
    method: 'get',
    params: params,
  })
  return data
}
