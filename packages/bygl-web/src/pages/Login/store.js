import { request, history } from 'umi';
import { flow, types, getRoot } from 'mobx-state-tree';

const Params = types.model('params', {
  username: types.optional(types.maybeNull(types.string), null),
  password: types.optional(types.maybeNull(types.string), null),
  checkKey: types.optional(types.number, new Date().getTime()),
});

const LoginStore = types
  .model('loginStore', {
    loading: types.optional(types.boolean, false),
    params: types.optional(Params, {}),
  })
  .actions((self) => {
    return {
      login: flow(function* () {
        const { username, password } = self.params;
        try {
          const result = yield request('/sys/login', {
            method: 'post',
            data: {
              username,
              password,
            },
          });
          const {
            token,
            userInfo: { realname, avatar },
          } = result.result;
          const root = getRoot(self);
          root.mstStore.setInfo({
            token,
            realname,
            avatar: avatar === '' ? undefined: avatar,
          });
          self.params.username = null;
          self.params.password = null;
          yield self.queryPermissionByUser(true);
        } catch (e) {
          console.log('e');
        }
        self.loading = false;
      }),
      setParams(data) {
        self.params.username = data.username;
        self.params.password = data.password;
        self.loading = true;
      },
      queryPermissionByUser: flow(function *(redirect) {
        try {
          const result = yield request('/sys/permission/getUserPermissionByToken');
          const root = getRoot(self);
          root.mstStore.setPermission(transferMenu(result.result.menu));
          if (redirect) {
            history.push('/')
          }
        }catch (e) {
          console.log('e', e);
        }
      })
    };
  });

function transferMenu(data) {
  return data.map(m => ({
    key:m.path,
    redirect: m.redirect,
    path: m.path,
    component: m.component,
    name: m.meta.title,
    icon: m.meta.icon,
    children: m.children ? transferMenu(m.children) : undefined,
  }))
}

export default LoginStore;
