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

function _umi() {
  const data = require("umi");

  _umi = function _umi() {
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

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

var _getStores = require("./getStores/getStores");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Mustache = _umi().utils.Mustache,
      winPath = _umi().utils.winPath,
      lodash = _umi().utils.lodash;

function _default(api) {
  const logger = api.logger;

  function getStoreDir() {
    return api.config.signular ? 'mst' : 'mst';
  }

  function getSrcStoresPath() {
    return (0, _path().join)(api.paths.absSrcPath, getStoreDir());
  }

  function getMstDependency() {
    const _api$pkg = api.pkg,
          dependencies = _api$pkg.dependencies,
          devDependencies = _api$pkg.devDependencies;
    return dependencies['mobx-state-tree'] || devDependencies['mobx-state-tree'] || require('../package').devDependencies['mobx-state-tree'];
  }

  function getMobxDependency() {
    const _api$pkg2 = api.pkg,
          dependencies = _api$pkg2.dependencies,
          devDependencies = _api$pkg2.devDependencies;
    return dependencies['mobx'] || devDependencies['mobx'] || require('../package').devDependencies['mobx'];
  }

  function getMobxReactDependency() {
    const _api$pkg3 = api.pkg,
          dependencies = _api$pkg3.dependencies,
          devDependencies = _api$pkg3.devDependencies;
    return dependencies['mobx-react'] || devDependencies['mobx-react'] || require('../package').devDependencies['mobx-react'];
  } // 配置


  api.describe({
    key: 'mst',
    config: {
      schema(joi) {
        return joi.object({
          skipStoreValidate: joi.boolean(),
          extraBase: joi.string()
        });
      }

    }
  });

  function getAllStores() {
    var _api$config$mst, _api$config$mst2, _api$config$mst3;

    const srcStorePath = getSrcStoresPath();
    const baseOpts = {
      skipStoreValidate: (_api$config$mst = api.config.mst) === null || _api$config$mst === void 0 ? void 0 : _api$config$mst.skipStoreValidate,
      extraStores: (_api$config$mst2 = api.config.mst) === null || _api$config$mst2 === void 0 ? void 0 : _api$config$mst2.extraStores,
      extraBase: (_api$config$mst3 = api.config.mst) === null || _api$config$mst3 === void 0 ? void 0 : _api$config$mst3.extraBase
    };
    return lodash.uniq([...(0, _getStores.getStores)(_objectSpread({
      base: srcStorePath
    }, baseOpts)), ...(0, _getStores.getStores)(_objectSpread({
      base: api.paths.absPagesPath,
      pattern: `**/${getStoreDir()}/**/*.{ts,tsx,js,jsx}`
    }, baseOpts)), ...(0, _getStores.getStores)(_objectSpread({
      base: api.paths.absPagesPath,
      pattern: `**/*.store.{ts,tsx,js,jsx}`
    }, baseOpts)), ...(0, _getStores.getStores)(_objectSpread({
      base: api.paths.absPagesPath,
      pattern: `**/store.{ts,tsx,js,jsx}`
    }, baseOpts))]);
  }

  let hasStores = false;
  api.onStart(() => {
    hasStores = getAllStores().length > 0;
  });
  api.addDepInfo(() => {
    return {
      name: 'mobx-state-tree',
      range: getMstDependency()
    };
  });
  api.addDepInfo(() => {
    return {
      name: 'mobx',
      range: getMobxDependency()
    };
  });
  api.addDepInfo(() => {
    return {
      name: 'mobx-react',
      range: getMobxReactDependency()
    };
  });
  api.onGenerateFiles({
    fn() {
      const stores = getAllStores();
      hasStores = stores.length > 0;
      logger.debug('mst stores: ');
      logger.debug(stores); // 没有stores不生成文件

      if (!hasStores) return; // mst.js

      const mstTpl = (0, _fs().readFileSync)((0, _path().join)(__dirname, 'mst.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-mst/mst.js',
        content: Mustache.render(mstTpl, {
          RegisterStoreImports: stores.map(path => {
            const storeName = lodash.last((0, _path().dirname)(path).split(_path().sep));
            return `import ${lodash.upperFirst(storeName)}Store from '${path}'`;
          }).join('\r\n'),
          ReisgterStores: stores.map(path => {
            const storeName = lodash.last((0, _path().dirname)(path).split(_path().sep));
            return `${lodash.camelCase(storeName)}Store: types.optional(${lodash.upperFirst(storeName)}Store, {})`;
          }).join(',\n')
        })
      }); //runtime.js

      const runtimeTpl = (0, _fs().readFileSync)((0, _path().join)(__dirname, 'runtime.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-mst/runtime.js',
        content: Mustache.render(runtimeTpl)
      }); //exports.js

      const exportsTpl = (0, _fs().readFileSync)((0, _path().join)(__dirname, 'exports.tpl'), 'utf-8');
      api.writeTmpFile({
        path: 'plugin-mst/exports.js',
        content: Mustache.render(exportsTpl)
      });
    },

    // 要比 preset-built-in 靠前
    // 在内部文件生成之前执行，这样 hasStores 设的值对其他函数才有效
    stage: -1
  }); // mst 优先读用户项目的依赖

  api.addProjectFirstLibraries(() => [{
    name: 'mobx',
    path: winPath((0, _path().dirname)(require.resolve('mobx/package.json')))
  }, {
    name: 'mobx-react',
    path: winPath((0, _path().dirname)(require.resolve('mobx-react/package.json')))
  }, {
    name: 'mobx-state-tree',
    path: winPath((0, _path().dirname)(require.resolve('mobx-state-tree/package.json')))
  }]); // src/stores 下的文件变化会触发临时文件生成

  api.addTmpGenerateWatcherPaths(() => [getSrcStoresPath()]); // Runtime Plugin

  api.addRuntimePlugin(() => hasStores ? [(0, _path().join)(api.paths.absTmpPath, 'plugin-mst/runtime.js')] : []);
  api.addRuntimePluginKey(() => hasStores ? ['mst'] : []); // 导出内容

  api.addUmiExports(() => hasStores ? [{
    exportAll: true,
    source: '../plugin-mst/exports'
  }] : []);
  api.registerCommand({
    name: 'mst',

    fn({
      args
    }) {
      if (args._[0] === 'list' && args._[1] === 'store') {
        const stores = getAllStores();
        console.log();
        console.log(_umi().utils.chalk.bold('  Stores in your project:'));
        console.log();
        stores.forEach(stores => {
          console.log(`    - ${(0, _path().relative)(api.cwd, stores)}`);
        });
        console.log();
        console.log(`  Totally ${stores.length}.`);
        console.log();
      }
    }

  });
}