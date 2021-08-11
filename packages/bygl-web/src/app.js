import React from 'react';
import { notification, Modal } from 'antd';
import { stores, request as UmiRequest } from 'umi';
import { ThemeProvider } from 'styled-components';
import { persist } from 'mst-persist';

const theme = {
  primaryColor: '#1890ff',
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const requestInterceptorsUse = (url, options) => {
  if (stores.mstStore.token) {
    options.headers['X-Access-Token'] = stores.mstStore.token; // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return {
    url,
    options,
  };
};

const responseInterceptorsUse = async (response) => {
  return response;
};

export const request = {
  prefix: '/lmocp-system',
  //credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  async errorHandler(error) {
    if (error.name === 'BizError') {
      notification.error({
        message: `请求错误 ${error.data.code}`,
        description: error.data.message,
      });
      return error.data;
    }
    const { response } = error;
    switch (response.status) {
      case 403:
        notification.error({
          message: '系统提示',
          description: '拒绝访问',
          duration: 4,
        });
        break;
      case 500:
        let path = window.location.href;
        const data = await response.clone().json();
        //notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
        if (
          data.message === 'Token失效，请重新登录' &&
          path.indexOf('/login') < 0
        ) {
          // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
          // store.dispatch('Logout').then(() => {
          //     window.location.reload()
          // })
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              stores.mstStore.loginOut();
            },
          });
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
        }
        break;
      case 404:
        notification.error({
          message: '系统提示',
          description: '很抱歉，资源未找到!',
          duration: 4,
        });
        break;
      case 504:
        notification.error({ message: '系统提示', description: '网络超时' });
        break;
      case 401:
        notification.error({
          message: '系统提示',
          description: '未授权，请重新登录',
          duration: 4,
        });
        if (stores.mstStore.token) {
          stores.mstStore.loginOut();
        }
        break;
      default:
        notification.error({
          message: '系统提示',
          description: '系统错误',
          duration: 4,
        });
    }
  },
  requestInterceptors: [requestInterceptorsUse],
  responseInterceptors: [responseInterceptorsUse],
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        success: resData.success,
        errorMessage: resData.message,
      };
    },
  },
};

export function patchRoutes({ routes }) {
  console.log('routes', routes);
}

export const render = (oldRender) => {
  persist('persist:bygl', stores, {
    whitelist: ['loginStore', 'mstStore'],
  }).then(() => oldRender());
};

export function rootContainer(container) {
  return React.createElement(ThemeProvider, { theme }, container);
}
