import { utils } from 'umi';
import { readFileSync } from 'fs';
import { join } from 'path';

export function getStores({ base, pattern, skipStoreValidate, extraStores, extraBase }) {
  return utils.lodash
    .uniq(
      utils.glob
        .sync(pattern || '**/*.{ts,tsx,js,jsx}', {
          cwd: base,
        })
        .map(f => join(base, f))
        .concat(extraStores || [])
        .concat(( extraBase ? utils.glob
        .sync(pattern || '**/*.{ts,tsx,js,jsx}', {
          cwd: extraBase,
        }): []).map(f => join(extraBase, f)))
        .map(utils.winPath)
    )
    .filter(f => {
      if (/\.d.ts$/.test(f)) return false;
      if (/\.(test|e2e|spec).(j|t)sx?$/.test(f)) return false;

      // 允许通过配置下跳过 Store 校验
      if (skipStoreValidate) return true;

      // TODO: fs cache for performance
      return true;
    });
}
