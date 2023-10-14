import request from '/@/utils/request';

//新增动态管理
export const AddDynamic = (data?: Object) => {
  return request({
    url: '/operation/dynamicState',
    method: 'post',
    data,
  });
};


//修改动态管理
export const EditDynamic = (data?: Object) => {
  return request({
    url: '/operation/dynamicState',
    method: 'put',
    data,
  });
};


//删除动态管理
export const deleteDynamic = (data?: Object) => {
  return request({
    url: '/operation/dynamicState',
    method: 'delete',
    data,
  });
};

//通过id查询
export const getDynamicById = (id: string) => {
  return request({
    url: `operation/dynamicState/${id}`,
    method: 'get',
  });
}


//分页查询
export const getDynamicList = () => {
  return request({
    url: `/operation/dynamicState/page`,
    method: 'get',
  });

}

//报名统计详细
export const getActivity = (id: string) => {
  return request({
    url: `/operation/dynamicState/getActivity/${id}`,
    method: 'get',
  });

}

//上下架

///operation/dynamicState/updateEnabled

export const updateEnabled = (data: Object) => {
  return request({
    url: 'operation/dynamicState/updateEnabled',
    method: 'put',
    data,
  });
}
