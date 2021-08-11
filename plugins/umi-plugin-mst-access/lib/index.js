"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

var _getContextContent = _interopRequireDefault(require("./utils/getContextContent"));

var _getAccessProviderContent = _interopRequireDefault(require("./utils/getAccessProviderContent"));

var _getAccessContent = _interopRequireDefault(require("./utils/getAccessContent"));

var _getRootContainerContent = _interopRequireDefault(require("./utils/getRootContainerContent"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ACCESS_DIR = 'plugin-mst-access'; // plugin-access 插件创建临时文件的专有文件夹

const defaultOptions = {
  showWarning: true
};

function _default(api, opts = defaultOptions) {
  const umiTmpDir = api.paths.absTmpPath;
  const srcDir = api.paths.absSrcPath;
  const accessTmpDir = (0, _path().join)(umiTmpDir, ACCESS_DIR);
  const accessFilePath = (0, _path().join)(srcDir, 'mstAccess');
  api.onGenerateFiles(() => {
    // 判断 access 工厂函数存在并且 default 暴露了一个函数
    if ((0, _utils.checkIfHasDefaultExporting)(accessFilePath)) {
      // 创建 access 的 context 以便跨组件传递 access 实例
      api.writeTmpFile({
        path: `${ACCESS_DIR}/context.js`,
        content: (0, _getContextContent.default)()
      }); // 创建 AccessProvider，1. 生成 access 实例; 2. 遍历修改 routes; 3. 传给 context 的 Provider

      api.writeTmpFile({
        path: `${ACCESS_DIR}/AccessProvider.js`,
        content: (0, _getAccessProviderContent.default)()
      }); // 创建 access 的 hook

      api.writeTmpFile({
        path: `${ACCESS_DIR}/mstAccess.js`,
        content: (0, _getAccessContent.default)()
      }); // 生成 rootContainer 运行时配置

      api.writeTmpFile({
        path: `${ACCESS_DIR}/rootContainer.js`,
        content: (0, _getRootContainerContent.default)()
      });
    } else {
      if (opts.showWarning) {
        api.logger.warn(`[plugin-mst-access]: mstAccess.js or mstAccess.ts file should be defined at srcDir and default exporting a factory function.`);
      }
    }
  }); // * api.register() 不能在初始化之后运行

  if ((0, _utils.checkIfHasDefaultExporting)(accessFilePath)) {
    // 增加 rootContainer 运行时配置
    // TODO: eliminate this workaround
    api.addRuntimePlugin(() => (0, _path().join)(api.paths.absTmpPath, 'plugin-mst-access/rootContainer.js'));
    api.addUmiExports(() => [{
      exportAll: true,
      source: '../plugin-mst-access/mstAccess'
    }]);
    api.addTmpGenerateWatcherPaths(() => [`${accessFilePath}.js`, `${accessFilePath}.js`]);
  }
}