import { types } from 'mobx-state-tree';

const PageStore = types.model('pageStore', {
  name: types.optional(types.string, '')
});

export default PageStore;
