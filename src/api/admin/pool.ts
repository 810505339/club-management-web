
import request from '/@/utils/request';
//所有酒局模式
export function allMode() {
  return request({
    url: '/consumption/wineParty/allMode',
    method: 'get',

  });
}

//酒局分页查询
export function wineList(params: any) {
  return request({
    url: '/consumption/winePartyBusiness/page',
    method: 'get',
    params
  });
}



//酒局人数弹窗
export function winePartyBusiness(id: string) {
  return request({
    url: `/consumption/winePartyBusiness/${id}`,
    method: 'get',
  });
}
