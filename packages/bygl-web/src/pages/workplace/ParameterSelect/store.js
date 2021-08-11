import  { types, flow} from 'mobx-state-tree';
import { request } from 'umi';

const fetchData = () => request('/llot-common/workplace/condition/list', {
  method: 'post',
  data: {},
});

const Type = types.model('type' ,{
  key: types.string,
  label: types.string,
  value: types.string,
  code: types.string,
  conditionType: types.string,
});

const Store = types.model('parameterSelectStore', {
  dataSource: types.array(Type),
}).actions(self => ({
  fetchData: flow( function *() {
    try {
      const res = yield fetchData();
      self.dataSource = res.result.map(item => ({
        key: item.id,
        label: item.name,
        value: item.id,
        ...item,
      }));
    }catch (e) {
      console.log('e', e);
    }
  }),
}))

export default Store;
