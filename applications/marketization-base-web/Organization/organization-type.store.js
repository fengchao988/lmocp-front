import  { types, flow} from 'mobx-state-tree';
import { request } from 'umi';

const fetchData = () => request('/leanOrganization/type');

const Type = types.model('type' ,{
    key: types.string,
    label: types.string,
    value: types.string,
});

const OrganizationTypeStore = types.model('organizationTypeStore', {
  dataSource: types.array(Type),
}).actions(self => ({
    fetchData: flow( function *() {
       try {
           const res = yield fetchData();
           self.dataSource = res.result;
       }catch (e) {
           console.log('e', e);
       }
    })
}))

export default OrganizationTypeStore;