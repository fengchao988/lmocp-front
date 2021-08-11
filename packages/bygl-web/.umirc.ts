import { defineConfig } from 'umi';
import { join } from 'path';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  extraBabelIncludes: [
    // 支持绝对路径 解决fastRefresh 排除了本地模块编译的问题
    join(__dirname, '../../components'),
    join(__dirname, '../../bs-components'),
  ],
  mst: {
    //extraBase: join(__dirname, './node_modules/@ttyys/mst-marketization-store')
  },
  devServer: {
    port: 3000,
  },
  proxy: {
    '/lmocp-system/*': {
      target: 'http://192.168.31.138:8080/', //请求本地 需要jeecg-boot后台项目
      ws: false,
      changeOrigin: true,
    },
  },
});
