import Mock from "mockjs";
import userApi from './mockData/user'
import permissionApi from './mockData/permission'

// 本地获取user的数据
Mock.mock(/user\/getUser/, 'get', userApi.getUserList )
Mock.mock(/user\/add/, 'post', userApi.createUser )
Mock.mock(/user\/edit/, 'post', userApi.updateUser )
Mock.mock(/user\/delete/, 'get', userApi.deleteUser )
Mock.mock(/permission\/getMenu/, 'post',  permissionApi.getMenu) 