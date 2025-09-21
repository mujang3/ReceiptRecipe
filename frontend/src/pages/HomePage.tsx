import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space, 
  Statistic, 
  List, 
  Avatar, 
  Tag
} from 'antd';
import { 
  BookOutlined, 
  UploadOutlined, 
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { recipeApi, communityApi } from '../services/api';

const { Title, Text, Paragraph } = Typography;

interface Recipe {
  id: number;
  name: string;
  description?: string;
  category?: string;
  difficultyLevel?: 'EASY' | 'MEDIUM' | 'HARD';
  cookingTime?: number;
  servings?: number;
  user: {
    id: number;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  authorName: string;
  authorAvatarUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalUsers: 0,
    totalPosts: 0,
    totalReceipts: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 인기 레시피 로드
      const recipesResponse = await recipeApi.getRecipes({ page: 0, size: 4 });
      setPopularRecipes(recipesResponse.content);

      // 최근 커뮤니티 포스트 로드
      const postsResponse = await communityApi.getPosts(0, 5);
      setRecentPosts(postsResponse.content);

      // 통계 데이터
      setStats({
        totalRecipes: recipesResponse.totalElements,
        totalUsers: 40,
        totalPosts: postsResponse.totalElements,
        totalReceipts: 86
      });
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case '매우 쉬움': return '#52c41a';
      case '쉬움': return '#1890ff';
      case '보통': return '#fa8c16';
      case '어려움': return '#f5222d';
      case 'EASY': return '#52c41a';
      case 'MEDIUM': return '#fa8c16';
      case 'HARD': return '#f5222d';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case '한식': return '🍲';
      case '양식': return '🍝';
      case '일식': return '🍣';
      case '디저트': return '🍰';
      case '건강식': return '🥗';
      case '간편요리': return '⚡';
      case '음료': return '🥤';
      default: return '🍽️';
    }
  };

  return (
    <div style={{ 
      background: '#f8f9fa', 
      minHeight: '100vh', 
      margin: '-24px', 
      padding: '24px' 
    }}>
      {/* 히어로 섹션 */}
      <div style={{
        background: 'white',
        textAlign: 'center',
        padding: '60px 40px',
        color: '#333',
        borderRadius: '12px',
        marginBottom: '40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e8e8e8'
      }}>
        <Title level={1} style={{
          color: '#1890ff',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          LocalRecipe
        </Title>
        
        <Paragraph style={{
          color: '#666',
          fontSize: '18px',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          영수증을 업로드하고 레시피를 공유하는 요리 플랫폼입니다.<br/>
          간편하게 요리하고 맛있게 공유해보세요.
        </Paragraph>

        <Space size="large" wrap>
          <Button
            type="primary"
            size="large"
            icon={<BookOutlined />}
            onClick={() => navigate('/recipes')}
            style={{
              height: '45px',
              padding: '0 25px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px'
            }}
          >
            레시피 보기
          </Button>
          <Button
            size="large"
            icon={<UploadOutlined />}
            onClick={() => navigate('/receipt-upload')}
            style={{
              height: '45px',
              padding: '0 25px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px'
            }}
          >
            영수증 업로드
          </Button>
        </Space>
      </div>


      {/* 통계 섹션 */}
      <Card title="플랫폼 현황" style={{ marginBottom: '40px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍳</div>
              <Statistic
                title="레시피"
                value={stats.totalRecipes}
                valueStyle={{ color: '#1890ff', fontSize: '20px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
              <Statistic
                title="사용자"
                value={stats.totalUsers}
                valueStyle={{ color: '#52c41a', fontSize: '20px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
              <Statistic
                title="게시글"
                value={stats.totalPosts}
                valueStyle={{ color: '#fa8c16', fontSize: '20px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
              <Statistic
                title="영수증"
                value={stats.totalReceipts}
                valueStyle={{ color: '#722ed1', fontSize: '20px', fontWeight: 'bold' }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 인기 레시피 */}
        <Col xs={24} lg={12}>
          <Card title="인기 레시피" extra={<Button type="link" onClick={() => navigate('/recipes')}>더보기</Button>}>
            <Row gutter={[16, 16]}>
              {popularRecipes.map((recipe) => (
                <Col xs={24} sm={12} key={recipe.id}>
                  <Card
                    hoverable
                    size="small"
                    cover={
                      <div style={{
                        height: '120px',
                        background: 'linear-gradient(45deg, #f0f2f5, #d9d9d9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px'
                      }}>
                        {getCategoryIcon(recipe.category)}
                      </div>
                    }
                    actions={[
                      <Button type="link" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                        자세히 보기
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={recipe.name}
                      description={
                        <div>
                          <div style={{ marginBottom: '8px' }}>
                            <Tag color={getDifficultyColor(recipe.difficultyLevel)}>
                              {recipe.difficultyLevel}
                            </Tag>
                            <Tag color="blue">{recipe.category}</Tag>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              👤 {recipe.user?.displayName || recipe.user?.username || '알 수 없음'}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              ⏱️ {recipe.cookingTime}분
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 최근 커뮤니티 게시글 */}
        <Col xs={24} lg={12}>
          <Card title="최근 커뮤니티 게시글" extra={<Button type="link" onClick={() => navigate('/community')}>더보기</Button>}>
            <List
              dataSource={recentPosts}
              renderItem={(post) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => navigate(`/community/${post.id}`)}>
                      자세히 보기
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={post.authorAvatarUrl} 
                        icon={<UserOutlined />}
                        style={{ background: '#1890ff' }}
                      />
                    }
                    title={
                      <Text strong style={{ fontSize: '14px' }}>
                        {post.title}
                      </Text>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                        </Text>
                        <div style={{ marginTop: '4px' }}>
                          <Space size="small">
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              👁️ {post.viewCount}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              ❤️ {post.likeCount}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              💬 {post.commentCount}
                            </Text>
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;