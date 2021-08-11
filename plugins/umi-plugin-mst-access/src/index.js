import { join } from 'path';
import getContextContent from './utils/getContextContent';
import getAccessProviderContent from './utils/getAccessProviderContent';
import getAccessContent from './utils/getAccessContent';
import getRootContainerContent from './utils/getRootContainerContent';
import { checkIfHasDefaultExporting } from './utils';

const ACCESS_DIR = 'plugin-mst-access'; // plugin-access 插件创建临时文件的专有文件夹

const defaultOptions = { showWarning: true };

export default function(api, opts = defaultOptions) {
  const umiTmpDir = api.paths.absTmpPath;
  const srcDir = api.paths.absSrcPath;
  const accessTmpDir = join(umiTmpDir, ACCESS_DIR);
  const accessFilePath = join(srcDir, 'mstAccess');

  api.onGenerateFiles(() => {
    // 判断 access 工厂函数存在并且 default 暴露了一个函数
    if (checkIfHasDefaultExporting(accessFilePath)) {
      // 创建 access 的 context 以便跨组件传递 access 实例
      api.writeTmpFile({ path: `${ACCESS_DIR}/context.js`, content: getContextContent()});

      // 创建 AccessProvider，1. 生成 access 实例; 2. 遍历修改 routes; 3. 传给 context 的 Provider
      api.writeTmpFile({ path: `${ACCESS_DIR}/AccessProvider.js`, content: getAccessProviderContent()});

      // 创建 access 的 hook
      api.writeTmpFile({ path: `${ACCESS_DIR}/mstAccess.js`, content: getAccessContent()});

      // 生成 rootContainer 运行时配置
      api.writeTmpFile({ path: `${ACCESS_DIR}/rootContainer.js`, content: getRootContainerContent()});
    } else {
      if (opts.showWarning) {
        api.logger.warn(
          `[plugin-mst-access]: mstAccess.js or mstAccess.ts file should be defined at srcDir and default exporting a factory function.`,
        );
      }
    }
  });

  // * api.register() 不能在初始化之后运行
  if (checkIfHasDefaultExporting(accessFilePath)) {
    // 增加 rootContainer 运行时配置
    // TODO: eliminate this workaround
    api.addRuntimePlugin(() => join(api.paths.absTmpPath, 'plugin-mst-access/rootContainer.js'));

    api.addUmiExports(() => [
      {
        exportAll: true,
        source: '../plugin-mst-access/mstAccess',
      },
    ]);

    api.addTmpGenerateWatcherPaths(() => [`${accessFilePath}.js`, `${accessFilePath}.js`]);
  }

}
