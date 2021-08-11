import React, { useState } from "react";
import * as Icons from "@ant-design/icons";
import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import { history } from 'umi';

const transferIcons = (data) =>
  data.map((item) => {
    if (item.icon && Icons[item.icon]) {
      const IconComp = Icons[item.icon];
      return {
        ...item,
        routes:
          item.children && item.children.length
            ? transferIcons(item.children)
            : undefined,
        icon: <IconComp />,
      };
    }
    return item;
  });

const MainLayout = ({
  children,
  title,
  pathname,
  route,
  logo,
  rightContentRender,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { routes = [] } = route;
  const newRoutes = {
    routes: transferIcons(routes),
  };

  const onMenuClick = (info) => {
    history.push(info.key);
  }
  return (
    <>
      <ProLayout
        route={newRoutes}
        location={{
          pathname,
        }}
        title={title}
        logo={logo}
        navTheme="dark"
        fixSiderbar
        fixedHeader
        collapsedButtonRender={false}
        onMenuHeaderClick={() => history.push('/')}
        breadcrumbRender={(routers = []) => {
         if (!routers.length) {
             return [{
                 path: '/exception/404',
                 breadcrumbName: '404'
             }]
         }
         return  [
           {
             path: "/",
             breadcrumbName: "首页",
           },
           ...routers,
         ]
        }}
        menuProps={{
          onClick: onMenuClick
        }}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        headerContentRender={() => {
          return (
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {collapsed ? (
                <Icons.MenuUnfoldOutlined />
              ) : (
                <Icons.MenuFoldOutlined />
              )}
            </div>
          );
        }}
        rightContentRender={rightContentRender}
      >
        <PageContainer header={{ title: false }}>
          <ProCard style={{ minHeight: "calc(100vh - 194px)" }}>
            {children}
          </ProCard>
        </PageContainer>
      </ProLayout>
    </>
  );
};

export default MainLayout;
