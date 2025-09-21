import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, Typography, Space, Dropdown, Avatar } from 'antd';
import { 
  HomeOutlined, 
  UploadOutlined, 
  FileTextOutlined, 
  BookOutlined, 
  ShoppingCartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TagsOutlined,
  BellOutlined,
  TeamOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationCenter from './NotificationCenter';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '홈',
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '대시보드',
    },
    {
      key: '/recipes',
      icon: <BookOutlined />,
      label: '레시피',
    },
    {
      key: '/receipt-upload',
      icon: <UploadOutlined />,
      label: '영수증 업로드',
    },
    {
      key: '/receipts',
      icon: <FileTextOutlined />,
      label: '영수증 목록',
    },
    {
      key: '/community',
      icon: <TeamOutlined />,
      label: '커뮤니티',
    },
    {
      key: '/favorites',
      icon: <HeartOutlined />,
      label: '즐겨찾기',
    },
    {
      key: '/ingredients',
      icon: <ShoppingCartOutlined />,
      label: '재료 관리',
    },
    {
      key: '/tags',
      icon: <TagsOutlined />,
      label: '태그 관리',
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: '알림',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '프로필',
    },
    {
      key: 'settings',
      icon: <UserOutlined />,
      label: '설정',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '로그아웃',
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div style={{
          padding: '20px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(64, 169, 255, 0.1))'
        }}>
          <Text strong style={{ 
            fontSize: collapsed ? '16px' : '20px', 
            background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800'
          }}>
            {collapsed ? 'LR' : 'LocalRecipe'}
          </Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: '8px'
          }}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />

        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: '#666',
              fontSize: '16px'
            }}
          />
        </div>
      </Sider>

      <AntLayout>
        <Header style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Text style={{ 
              background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '20px', 
              fontWeight: '800' 
            }}>
              LocalRecipe
            </Text>
          </div>

          <Space size="middle">
            {user ? (
              <>
                <NotificationCenter />
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#f5f5f5',
                    transition: 'all 0.3s ease'
                  }}>
                    <Avatar
                      src={user.avatarUrl}
                      icon={<UserOutlined />}
                      style={{ background: '#1890ff' }}
                    />
                    <Text style={{ color: '#333', fontWeight: '500' }}>
                      {user.displayName || user.username}
                    </Text>
                  </div>
                </Dropdown>
              </>
            ) : (
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
            )}
          </Space>
        </Header>

        <Content style={{
          margin: '24px',
          padding: '0',
          background: 'transparent',
          minHeight: 'calc(100vh - 112px)'
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;