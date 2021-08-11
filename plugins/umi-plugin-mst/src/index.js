// ref:
// - https://umijs.org/plugins/api
import { utils } from 'umi';
import { join, basename, extname, relative, dirname, sep } from 'path';
import { readFileSync } from 'fs';

import { getStores } from './getStores/getStores';

const { Mustache, winPath, lodash } = utils;

export default function(api) {
  const { logger } = api;

  function getStoreDir() {
    return api.config.signular ? 'mst' : 'mst';
  }

  function getSrcStoresPath() {
    return join(api.paths.absSrcPath, getStoreDir());
  }

  function getMstDependency() {
    const { dependencies, devDependencies } = api.pkg;
    return (
      dependencies['mobx-state-tree'] ||
      devDependencies['mobx-state-tree'] ||
      require('../package').devDependencies['mobx-state-tree']
    );
  }

  function getMobxDependency() {
    const { dependencies, devDependencies } = api.pkg;
    return (
      dependencies['mobx'] ||
      devDependencies['mobx'] ||
      require('../package').devDependencies['mobx']
    );
  }

  function getMobxReactDependency() {
    const { dependencies, devDependencies } = api.pkg;
    return (
      dependencies['mobx-react'] ||
      devDependencies['mobx-react'] ||
      require('../package').devDependencies['mobx-react']
    );
  }

  // 配置
  api.describe({
    key: 'mst',
    config: {
      schema(joi) {
        return joi.object({
          skipStoreValidate: joi.boolean(),
          extraBase: joi.string(),
        });
      },
    },
  });

  function getAllStores() {
    const srcStorePath = getSrcStoresPath();
    const baseOpts = {
      skipStoreValidate: api.config.mst?.skipStoreValidate,
      extraStores: api.config.mst?.extraStores,
      extraBase: api.config.mst?.extraBase,
    };

    return lodash.uniq([
      ...getStores({
        base: srcStorePath,
        ...baseOpts,
      }),
      ...getStores({
        base: api.paths.absPagesPath,
        pattern: `**/${getStoreDir()}/**/*.{ts,tsx,js,jsx}`,
        ...baseOpts,
      }),
      ...getStores({
        base: api.paths.absPagesPath,
        pattern: `**/*.store.{ts,tsx,js,jsx}`,
        ...baseOpts,
      }),
      ...getStores({
        base: api.paths.absPagesPath,
        pattern: `**/store.{ts,tsx,js,jsx}`,
        ...baseOpts,
      }),
    ]);
  }

  let hasStores = false;

  api.onStart(() => {
    hasStores = getAllStores().length > 0;
  });

  api.addDepInfo(() => {
    return {
      name: 'mobx-state-tree',
      range: getMstDependency(),
    };
  });

  api.addDepInfo(() => {
    return {
      name: 'mobx',
      range: getMobxDependency(),
    };
  });

  api.addDepInfo(() => {
    return {
      name: 'mobx-react',
      range: getMobxReactDependency(),
    };
  });

  api.onGenerateFiles({
    fn() {
      const stores = getAllStores();
      hasStores = stores.length > 0;

      logger.debug('mst stores: ');
      logger.debug(stores);

      // 没有stores不生成文件
      if (!hasStores) return;
      // mst.js
      const mstTpl = readFileSync(join(__dirname, 'mst.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-mst/mst.js',
        content: Mustache.render(mstTpl, {
          RegisterStoreImports: stores
            .map(path => {
              const storeName = lodash.last(dirname(path).split(sep));
              return `import ${lodash.upperFirst(
                storeName,
              )}Store from '${path}'`;
            })
            .join('\r\n'),
          ReisgterStores: stores
            .map(path => {
              const storeName = lodash.last(dirname(path).split(sep));
              return `${lodash.camelCase(storeName)}Store: types.optional(${lodash.upperFirst(storeName)}Store, {})`;
            })
            .join(',\n'),
        }),
      });

      //runtime.js
      const runtimeTpl = readFileSync(join(__dirname, 'runtime.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-mst/runtime.js',
        content: Mustache.render(runtimeTpl),
      });

      //exports.js
      const exportsTpl = readFileSync(join(__dirname, 'exports.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-mst/exports.js',
        content: Mustache.render(exportsTpl, ),
      });
    },
    // 要比 preset-built-in 靠前
    // 在内部文件生成之前执行，这样 hasStores 设的值对其他函数才有效
    stage: -1,
  });

  // mst 优先读用户项目的依赖
  api.addProjectFirstLibraries(() => [
    {
      name: 'mobx',
      path: winPath(dirname(require.resolve('mobx/package.json'))),
    },
    {
      name: 'mobx-react',
      path: winPath(dirname(require.resolve('mobx-react/package.json'))),
    },
    {
      name: 'mobx-state-tree',
      path: winPath(dirname(require.resolve('mobx-state-tree/package.json'))),
    },
  ]);

  // src/stores 下的文件变化会触发临时文件生成
  api.addTmpGenerateWatcherPaths(() => [getSrcStoresPath()]);

  // Runtime Plugin
  api.addRuntimePlugin(() =>
    hasStores ? [join(api.paths.absTmpPath, 'plugin-mst/runtime.js')] : [],
  );
  api.addRuntimePluginKey(() => (hasStores ? ['mst'] : []));

  // 导出内容
  api.addUmiExports(() =>
    hasStores
      ? [
          {
            exportAll: true,
            source: '../plugin-mst/exports',
          },
        ]
      : [],
  );

  api.registerCommand({
    name: 'mst',
    fn({ args }) {
      if (args._[0] === 'list' && args._[1] === 'store') {
        const stores = getAllStores();
        console.log();
        console.log(utils.chalk.bold('  Stores in your project:'));
        console.log();
        stores.forEach(stores => {
          console.log(`    - ${relative(api.cwd, stores)}`);
        });
        console.log();
        console.log(`  Totally ${stores.length}.`);
        console.log();
      }
    },
  });
}
