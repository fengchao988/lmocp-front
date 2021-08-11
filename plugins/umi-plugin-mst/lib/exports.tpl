import { useContext } from 'react';
import {
  MobXProviderContext,
  inject,
  observer,
  useLocalStore,
  useObserver,
  useAsObservableSource,
  useStaticRendering, } from 'mobx-react';

export { stores } from './mst';

export { inject, observer, useLocalStore, useObserver, useAsObservableSource, useStaticRendering };

export const useMst = (selector) => {
  const context = useContext(MobXProviderContext);
  return selector(context);
}
