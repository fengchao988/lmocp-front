import { types, applySnapshot } from 'mobx-state-tree';
import { Provider } from 'mobx-react';

{{{ RegisterStoreImports }}}

const RootStore = types.model('rootStore', {
  {{{ ReisgterStores }}}
}).actions((self) => ({
  clear() {
    const rootStore = RootStore.create({});
    const rootJSON = rootStore.toJSON();
    applySnapshot(self, rootJSON);
  },
}));


export const stores =  RootStore.create();

const MstWrapper = (props) => {
return <Provider {...stores}>
    <div>{props.children}</div>
  </Provider>
};

export default MstWrapper;




