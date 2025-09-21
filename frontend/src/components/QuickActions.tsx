import React from 'react';
import { Button, Space } from 'antd';
import { 
  BookOutlined, 
  UploadOutlined, 
  SearchOutlined, 
  HeartOutlined, 
  TeamOutlined, 
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      key: 'recipes',
      icon: <BookOutlined />,
      label: '레시피 작성',
      onClick: () => navigate('/recipes')
    },
    {
      key: 'upload',
      icon: <UploadOutlined />,
      label: '영수증 업로드',
      onClick: () => navigate('/receipt-upload')
    },
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: '레시피 검색',
      onClick: () => navigate('/recipes')
    },
    {
      key: 'favorites',
      icon: <HeartOutlined />,
      label: '즐겨찾기',
      onClick: () => navigate('/favorites')
    },
    {
      key: 'community',
      icon: <TeamOutlined />,
      label: '커뮤니티',
      onClick: () => navigate('/community')
    },
    {
      key: 'ingredients',
      icon: <ShoppingCartOutlined />,
      label: '재료 관리',
      onClick: () => navigate('/ingredients')
    }
  ];

  return (
    <Space wrap size="middle">
      {actions.map((action) => (
        <Button
          key={action.key}
          icon={action.icon}
          onClick={action.onClick}
          style={{
            height: '40px',
            padding: '0 16px',
            borderRadius: '6px'
          }}
        >
          {action.label}
        </Button>
      ))}
    </Space>
  );
};

export default QuickActions;