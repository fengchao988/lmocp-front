import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';

const useMst = (selector) => {
    const context = useContext(MobXProviderContext);
    return selector && typeof selector === 'function' ? selector(context) : context;
};

export default useMst;