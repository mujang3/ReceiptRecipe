import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space,
  message,
  Spin,
  Empty
} from 'antd';
import { 
  HeartFilled,
  ClockCircleOutlined, 
  UserOutlined,
  StarOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { favoriteApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const { Title, Paragraph } = Typography;

interface FavoriteRecipe {
  id: number;
  recipe: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    cookingTime: number;
    servings: number;
    difficultyLevel: string;
    category: string;
  };
  createdAt: string;
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadFavorites = async (pageNum: number = 0) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await favoriteApi.getUserFavorites(user.id, pageNum, 20);
      if (pageNum === 0) {
        setFavorites(response.content);
      } else {
        setFavorites(prev => [...prev, ...response.content]);
      }
      setHasMore(response.number < response.totalPages - 1);
    } catch (error) {
      message.error('즐겨찾기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFavorites(0);
    }
  }, [user]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadFavorites(nextPage);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'EASY': return 'green';
      case 'MEDIUM': return 'orange';
      case 'HARD': return 'red';
      default: return 'default';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'EASY': return '쉬움';
      case 'MEDIUM': return '보통';
      case 'HARD': return '어려움';
      default: return level;
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty 
          description="로그인이 필요합니다"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/login')}>
            로그인하기
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/recipes')}
          style={{ marginBottom: '16px' }}
        >
          레시피 목록으로 돌아가기
        </Button>
        
        <Title level={2}>
          <HeartFilled style={{ color: '#ff4d4f', marginRight: '8px' }} />
          내 즐겨찾기
        </Title>
        <Paragraph>
          저장한 레시피들을 확인하고 관리할 수 있습니다.
        </Paragraph>
      </div>

      {loading && favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : favorites.length === 0 ? (
        <Empty 
          description="즐겨찾기한 레시피가 없습니다"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/recipes')}>
            레시피 둘러보기
          </Button>
        </Empty>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {favorites.map((favorite) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={favorite.id}>
                <Card
                  hoverable
                  cover={
                    favorite.recipe.imageUrl ? (
                      <div style={{ position: 'relative' }}>
                        <img 
                          alt={favorite.recipe.name} 
                          src={favorite.recipe.imageUrl}
                          style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {favorite.recipe.difficultyLevel && getDifficultyText(favorite.recipe.difficultyLevel)}
                        </div>
                      </div>
                    ) : (
                      <div 
                        style={{ 
                          height: '200px', 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        {favorite.recipe.name}
                      </div>
                    )
                  }
                  actions={[
                    <Button 
                      type="link" 
                      key="view"
                      onClick={() => navigate(`/recipes/${favorite.recipe.id}`)}
                    >
                      자세히 보기
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div>
                        <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
                          {favorite.recipe.name}
                        </Title>
                        <Space>
                          {favorite.recipe.category && <span style={{ color: '#1890ff' }}>{favorite.recipe.category}</span>}
                          {favorite.recipe.difficultyLevel && (
                            <span style={{ 
                              color: getDifficultyColor(favorite.recipe.difficultyLevel) === 'green' ? '#52c41a' :
                                     getDifficultyColor(favorite.recipe.difficultyLevel) === 'orange' ? '#fa8c16' : '#ff4d4f'
                            }}>
                              {getDifficultyText(favorite.recipe.difficultyLevel)}
                            </span>
                          )}
                        </Space>
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph 
                          ellipsis={{ rows: 2 }} 
                          style={{ margin: 0, color: '#666' }}
                        >
                          {favorite.recipe.description}
                        </Paragraph>
                        <Space style={{ marginTop: '8px' }}>
                          {favorite.recipe.cookingTime && (
                            <Space size={4}>
                              <ClockCircleOutlined />
                              <span>{favorite.recipe.cookingTime}분</span>
                            </Space>
                          )}
                          {favorite.recipe.servings && (
                            <Space size={4}>
                              <UserOutlined />
                              <span>{favorite.recipe.servings}인분</span>
                            </Space>
                          )}
                        </Space>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button 
                onClick={handleLoadMore}
                loading={loading}
                size="large"
              >
                더 보기
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
