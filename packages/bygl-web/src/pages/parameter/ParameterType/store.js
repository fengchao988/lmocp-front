import  { types, flow} from 'mobx-state-tree';
import { request } from 'umi';

const fetchData = () => request('/llot-common/workplace/condition/condition_types');

const Type = types.model('type' ,{
  key: types.string,
  label: types.string,
  value: types.string,
});

const Store = types.model('parameterTypeStore', {
  dataSource: types.array(Type),
}).actions(self => ({
  fetchData: flow( function *() {
    try {
      const res = yield fetchData();
      self.dataSource = Object.keys(res.result).map(m => ({ key: m, label: res.result[m], value: m}));
    }catch (e) {
      console.log('e', e);
    }
  }),
}))

export default Store;
