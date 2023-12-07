import request from '/@/utils/request';


//拼酒局数据概况
type IParams = {
  beginDate: string,
  endDate: string,
}
export const wineParty = async (storeId: string, params: IParams) => {
  return await request({
    url: `/data/dataBoard/wineParty/${storeId}`,
    method: 'get',
    params: params,
  })
}

//订单及流水统计
export const orderSale = async (storeId: string, params: IParams) => {
  return await request({
    url: `/data/dataBoard/orderSale/${storeId}`,
    method: 'get',
    params: params,
  })
}
//用户来店方式占比
export const enterStore = async (storeId: string, params: IParams) => {
  return await request({
    url: `/data/dataBoard/enterStore/${storeId}`,
    method: 'get',
    params: params,
  })
}

//酒水套餐排行榜
export const drinkMealRanking = async (storeId: string, params: IParams) => {
  return await request({
    url: `/data/dataBoard/drinkMealRanking/${storeId}`,
    method: 'get',
    params: params,
  })
}

//用户性别、年龄占比
export const customerAgeGender = async (storeId: string, params: IParams) => {
  return await request({
    url: `/data/dataBoard/customerAgeGender/${storeId}`,
    method: 'get',
    params: params,
  })
}
//区域偏好数据
export const areaPreference = async (storeId: string, params: IParams) => {
  return await request({
    url: `/data/dataBoard/areaPreference/${storeId}`,
    method: 'get',
    params: params,
  })
}
