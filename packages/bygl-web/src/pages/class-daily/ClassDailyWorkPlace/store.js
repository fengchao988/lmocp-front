import  { types, flow} from 'mobx-state-tree';
import { request } from 'umi';

const fetchData = () => request('/llot-common/workplace/info/type');

const Type = types.model('type' ,{
  key: types.string,
  label: types.string,
  value: types.string,
});

const Store = types.model('classDailyWorkplaceTypeStore', {
  dataSource: types.array(Type),
}).actions(self => ({
  fetchData: flow( function *() {
    try {
      const res = yield fetchData();
      self.dataSource = res.result;
    }catch (e) {
      console.log('e', e);
    }
  }),
}))

export default Store;
