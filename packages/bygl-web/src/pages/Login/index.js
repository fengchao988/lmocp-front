import { inject, observer } from 'umi';
import { Login } from '@ttyys/bs-marketization-web';

const PageLogin = ({ loginStore}) => {
  const handleLogin = (data) => {
    loginStore.setParams(data)
    loginStore.login();
  }
  return <Login loading={loginStore.loading} login={handleLogin}/>;
};

export default inject('loginStore')(observer(PageLogin));
