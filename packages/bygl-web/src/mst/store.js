import { request, history } from 'umi';
import { flow, types } from 'mobx-state-tree';

const Permission = types.model('permissions', {
  key:types.identifier,
  redirect: types.maybeNull(types.string),
  path: types.string,
  component: types.string,
  name: types.string,
  icon: types.maybeNull(types.string),
  children: types.array(types.late(() => Permission)),
})
const MstStore = types
  .model('mstStore', {
    token: types.optional(types.maybeNull(types.string), null),
    realname: types.optional(types.maybeNull(types.string), null),
    avatar: types.optional(types.maybeNull(types.string), null),
    permissions: types.array(Permission),
  })
  .actions((self) => {
    return {
      loginOut: flow(function* () {
        try {
/*          yield request('/sys/logout', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'X-Access-Token': self.token,
            },
          });*/
          self.token = null;
          self.realname = null;
          self.avatar = null;
          self.permissions = [];
          history.push('/login');
        } catch (e) {
          console.log('e', e);
        }
      }),
      setInfo({ token, realname, avatar }) {
        self.token = token;
        self.realname = realname;
        self.avatar = avatar;
      },
      setPermission(permissions) {
        self.permissions = permissions;
        console.log("selftPermission", permissions);
      }
    };
  });

export default MstStore;
