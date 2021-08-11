import { types } from 'mobx-state-tree';

const LoginStore = types.model('loginStore', {
  loading: types.optional(types.boolean, false),
});

export default LoginStore;
