import request from '/@/utils/request';

//新增
export const AdddrinksMeal = (data?: Object) => {
  return request({
    url: '/operation/drinksMeal',
    method: 'post',
    data,
  });
};
//修改
export const EditdrinksMeal = (data?: Object) => {
  return request({
    url: '/operation/drinksMeal',
    method: 'put',
    data,
  });
};

export const getdrinksMealList = (params?: Object) => {
  return request({
    url: '/operation/drinksMeal/page',
    method: 'get',
    params,
  });
};

//根据id查询

export const getAreaById = (id: string) => {
  return request({
    url: `/operation/drinksMeal/${id}`,
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
    url: `/admin/area/updateEnabled`,
    method: 'put',
    data

  });
}



export const deletedrinksMealByIds = (ids: string[]) => {
  return request({
    url: "/operation/drinksMeal",
    method: 'delete',
    data: ids,
  })
}
