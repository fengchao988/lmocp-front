import { MainLayout } from '@ttyys/components-web';
import RightContent from './GlobalHeader/RightContent';
import { inject, observer, useLocation, Redirect } from 'umi';
import { getMatchMenu } from '@umijs/route-utils';

const Layouts = ({ children, mstStore }) => {
  const permissions = mstStore.permissions.toJSON();
  const route = {
    routes: permissions,
  };
  const match = useLocation();
  if (match.pathname === '/login') {
    return children;
  }
  if (!permissions.length) {
    return <Redirect to="/login"/>;
  }
  if (match.pathname !== '/') {
    const matchMenu = getMatchMenu(match.pathname, permissions);
    if (!matchMenu.length) {
      if (match.pathname!=='/exception/404') {
        return <Redirect to="/exception/404"/>;
      }
    }
  }
  return (
    <MainLayout
      title="巴矿煤业"
      logo={'/logo.png'}
      pathname={match.pathname}
      route={route}
      rightContentRender={() => <RightContent theme="light" layout="top" />}
    >
      {children}
    </MainLayout>
  );
};

export default inject('mstStore')(observer(Layouts));
