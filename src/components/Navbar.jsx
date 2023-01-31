import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar } from 'antd';
import React from 'react';
import PageContent from '../components/PageContent'
import '../index.css';
import LogoIHC from '../assets/logo_ihc.svg'
import { useNavigate } from 'react-router-dom';
const { Header, Content, Sider, Footer } = Layout;

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate()
  return (
    <Layout>
      <Header className="header" style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
        }}>
        <img className='logo' src={LogoIHC} alt="" style={{
          width: 140,
        }} />
        <Menu theme="dark" mode="horizontal"  defaultSelectedKeys={['1']}
        onClick={(item) => {
          navigate(item.key);
        }}
        items={[
          {
            label: "HOME",
            key:'/'
          },
          {
            label: "UPLOAD",
            key:'/upload'
          }
        ]} />
      </Header>
      <Layout>
        <Sider
          breakpoint='lg'
          collapsedWidth='0'
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            margin: '16px 0',
          }}
        >
          
          <Content
            style={{
              
              padding: 24,
              margin: 0,
              minHeight: '75vh',
              height: '100%',
              background: colorBgContainer,
            }}
          >
            <PageContent />

          </Content>
          <Footer
            style={{
              textAlign: 'left',
            }}
          >
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;