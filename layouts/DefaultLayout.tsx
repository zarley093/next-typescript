import React from 'react'
import AppBreadcrumb from '../components/AppBreadcrumb';
import AppSidebar from '../components/AppSidebar';
import { MenuOutlined, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Layout, message, Menu, PageHeader, Avatar } from 'antd';
import Router, { withRouter } from 'next/router';
const { SubMenu } = Menu
const { Header, Sider, Content, Footer } = Layout;

const DefaultLayout = props => {
  const [sidebarVisible, setSidebarVisibility] = React.useState(false);
  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <AppSidebar
        visible={sidebarVisible}
        setVisibility={setSidebarVisibility}
        {...props}
      />
      <Header
        style={{
          position: 'fixed',
          zIndex: 2,
          width: '100%',
          backgroundColor: 'white',
          borderBottom: '1px solid',
        }}
      >
        <div style={{ lineHeight: '64px' }}>
          <a style={{ marginRight: '10px' }}>
            <Avatar src="/favicon.ico" />
          </a>
          {React.createElement(MenuOutlined, {
            className: 'trigger',
            onClick: () => setSidebarVisibility(!sidebarVisible),
          })}
        </div>
      </Header>
      <PageHeader
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 1,
          backgroundColor: 'white',
          borderBottom: '1px solid',
          marginTop: '50px',
          paddingLeft: '30px',
          paddingRight: '30px',
          paddingBottom: '5px',
        }}
        title={<AppBreadcrumb />}
        {...props.pageHeader}
      />
      <div
        style={{
          marginBottom: props.pageHeader ? '90px' : '60px',
        }}
      />
      <Content style={{ margin: '64px 20px 0px 20px' }}>
        {React.cloneElement(props.children)}
      </Content>

      <Footer style={{ textAlign: 'center' }}>Halcyon Web Design ©2020</Footer>
    </Layout>
  )
}

export default DefaultLayout