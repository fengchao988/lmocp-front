import  { types, flow} from 'mobx-state-tree';
import { request } from 'umi';
import jp from 'jsonpath';

const fetchData = (conditionId) => request('/llot-common/workplace/condition_value/condition_value_list', {
  method: 'get',
  params: {
    conditionId
  },
});

const Type = types.model('type' ,{
  key: types.string,
  label: types.string,
  value: types.string,
  code: types.string,
});

const Params = types.model('params', {
  conditionId: types.maybeNull(types.string),
})

const Store = types.model('parameterOptionSelectStore', {
  dataSource: types.array(Type),
  params: types.optional(Params, {}),
}).actions(self => ({
  fetchData: flow( function *() {
    try {
      const conditionId = self.params.conditionId;
      const res = yield fetchData(conditionId);
      self.dataSource = res.result.map(item => ({
        key: item.id,
        label: item.value,
        value: item.id,
        ...item,
      }));
    }catch (e) {
      console.log('e', e);
    }
  }),
  setParams(path, value) {
    jp.value(self, path, value);
  }
}))

export default Store;
