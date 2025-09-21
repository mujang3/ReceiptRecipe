import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Space, Typography, Button, Tag, Timeline } from 'antd';
import { 
  BookOutlined, 
  WarningOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BellOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  ArrowRightOutlined,
  TeamOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { recipeApi, communityApi, favoriteApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 더미 데이터 생성 함수들
  const generateDummyRecipes = () => [
    {
      id: 1,
      name: "프리미엄 와규 스테이크",
      description: "최고급 와규 소고기로 만드는 프리미엄 스테이크",
      cookingTime: 45,
      servings: 2,
      category: "양식",
      imageUrl: "https://picsum.photos/400/300?random=1",
      difficultyLevel: "HARD",
      createdAt: "2025-01-20T10:30:00Z",
      viewCount: 1247,
      likeCount: 89,
      commentCount: 23
    },
    {
      id: 2,
      name: "홈메이드 파스타",
      description: "신선한 재료로 만드는 정통 이탈리안 파스타",
      cookingTime: 30,
      servings: 4,
      category: "양식",
      imageUrl: "https://picsum.photos/400/300?random=2",
      difficultyLevel: "MEDIUM",
      createdAt: "2025-01-19T15:20:00Z",
      viewCount: 892,
      likeCount: 67,
      commentCount: 15
    },
    {
      id: 3,
      name: "김치찌개",
      description: "진한 국물의 맛있는 김치찌개",
      cookingTime: 25,
      servings: 3,
      category: "한식",
      imageUrl: "https://picsum.photos/400/300?random=3",
      difficultyLevel: "EASY",
      createdAt: "2025-01-18T20:15:00Z",
      viewCount: 2156,
      likeCount: 156,
      commentCount: 42
    },
    {
      id: 4,
      name: "초밥 세트",
      description: "신선한 생선으로 만드는 정통 초밥",
      cookingTime: 60,
      servings: 2,
      category: "일식",
      imageUrl: "https://picsum.photos/400/300?random=4",
      difficultyLevel: "HARD",
      createdAt: "2025-01-17T12:45:00Z",
      viewCount: 1834,
      likeCount: 134,
      commentCount: 38
    },
    {
      id: 5,
      name: "치킨 커리",
      description: "향신료가 풍부한 인도식 치킨 커리",
      cookingTime: 40,
      servings: 4,
      category: "인도식",
      imageUrl: "https://picsum.photos/400/300?random=5",
      difficultyLevel: "MEDIUM",
      createdAt: "2025-01-16T18:30:00Z",
      viewCount: 967,
      likeCount: 78,
      commentCount: 19
    }
  ];

  const generateDummyPosts = () => [
    {
      id: 1,
      title: "와규 스테이크 만드는 비법 공유합니다!",
      content: "오늘 와규 스테이크를 만들어봤는데 정말 맛있게 나왔어요. 특히 마늘과 로즈마리를 넣고 팬에 굴려가며 구우면 정말 향이 좋더라구요. 여러분도 한번 도전해보세요!",
      authorName: "요리마스터",
      authorAvatarUrl: "https://picsum.photos/40/40?random=10",
      viewCount: 3421,
      likeCount: 267,
      commentCount: 89,
      createdAt: "2025-01-20T14:30:00Z"
    },
    {
      id: 2,
      title: "김치찌개 레시피 개선했어요",
      content: "기존 레시피에서 돼지고기 대신 삼겹살을 사용하고, 고춧가루를 조금 더 넣어서 더 진한 맛이 나도록 했습니다. 가족들이 정말 좋아해요!",
      authorName: "맘쿡",
      authorAvatarUrl: "https://picsum.photos/40/40?random=11",
      viewCount: 2156,
      likeCount: 189,
      commentCount: 56,
      createdAt: "2025-01-19T16:20:00Z"
    },
    {
      id: 3,
      title: "파스타 면 삶는 시간 정확히 알려드려요",
      content: "파스타 면을 삶을 때 소금을 넣는 비율과 시간을 정확히 지키면 정말 맛있게 나와요. 1L 물에 10g 소금, 면은 8분 정도가 딱이에요!",
      authorName: "이탈리안셰프",
      authorAvatarUrl: "https://picsum.photos/40/40?random=12",
      viewCount: 1834,
      likeCount: 145,
      commentCount: 34,
      createdAt: "2025-01-18T11:15:00Z"
    },
    {
      id: 4,
      title: "초밥 만들기 도전기",
      content: "처음으로 초밥을 만들어봤는데 생각보다 어렵네요. 하지만 신선한 생선과 쌀의 조화는 정말 최고예요. 연습이 필요할 것 같아요.",
      authorName: "일본요리초보",
      authorAvatarUrl: "https://picsum.photos/40/40?random=13",
      viewCount: 967,
      likeCount: 78,
      commentCount: 23,
      createdAt: "2025-01-17T19:45:00Z"
    },
    {
      id: 5,
      title: "커리 만드는 팁 공유",
      content: "커리를 만들 때는 양파를 충분히 볶아서 갈색이 될 때까지 기다려야 해요. 그리고 각종 향신료를 순서대로 넣어야 맛이 제대로 나와요.",
      authorName: "스파이스러버",
      authorAvatarUrl: "https://picsum.photos/40/40?random=14",
      viewCount: 1234,
      likeCount: 98,
      commentCount: 28,
      createdAt: "2025-01-16T13:20:00Z"
    }
  ];

  const generateDummyFavorites = () => [
    {
      id: 1,
      recipe: {
        id: 1,
        name: "프리미엄 와규 스테이크",
        cookingTime: 45,
        servings: 2,
        imageUrl: "https://picsum.photos/400/300?random=1"
      }
    },
    {
      id: 2,
      recipe: {
        id: 2,
        name: "홈메이드 파스타",
        cookingTime: 30,
        servings: 4,
        imageUrl: "https://picsum.photos/400/300?random=2"
      }
    },
    {
      id: 3,
      recipe: {
        id: 3,
        name: "김치찌개",
        cookingTime: 25,
        servings: 3,
        imageUrl: "https://picsum.photos/400/300?random=3"
      }
    }
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 더미 데이터로 설정
    setRecentRecipes(generateDummyRecipes());
    setPopularPosts(generateDummyPosts());
    setFavoriteRecipes(generateDummyFavorites());
    
    // 짧은 로딩 시간 후 대시보드 표시
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 50px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Progress 
            type="circle" 
            size={80}
            strokeColor={{
              '0%': '#1890ff',
              '100%': '#40a9ff',
            }}
          />
          <p style={{ 
            marginTop: '20px', 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#333',
            margin: '20px 0 0 0'
          }}>
            대시보드를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }} className="fade-in-up">
      {/* 환영 메시지 */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        color: '#333',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }} className="card-hover">
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(64, 169, 255, 0.1))',
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
        <Title level={2} style={{ 
          margin: 0, 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2.5rem',
          fontWeight: '800'
        }}>
            안녕하세요! {user?.displayName || user?.username || '요리사'}님 👋
          </Title>
          <Text style={{ 
            color: '#666', 
            fontSize: '16px',
            display: 'block',
            marginBottom: '20px'
          }}>
            오늘도 맛있는 요리를 만들어보세요! 🍳 현재 <strong>1,247개의 레시피</strong>와 <strong>3,421명의 요리사</strong>가 함께하고 있어요!
          </Text>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              icon={<BookOutlined />}
              className="btn-gradient"
              style={{
                borderRadius: '25px',
                height: '50px',
                padding: '0 30px',
                fontSize: '16px',
                fontWeight: '700',
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
              }}
              onClick={() => navigate('/recipes/new')}
            >
              새 레시피 만들기
            </Button>
            <Button 
              size="large"
              icon={<UploadOutlined />}
              style={{
                borderRadius: '25px',
                height: '50px',
                padding: '0 30px',
                fontSize: '16px',
                fontWeight: '700',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(24, 144, 255, 0.3)',
                color: '#1890ff'
              }}
              onClick={() => navigate('/receipts/upload')}
            >
              영수증 업로드
            </Button>
          </Space>
        </div>
      </div>

      {/* 주요 통계 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="card-hover"
            style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '25px' }}
            hoverable
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(24, 144, 255, 0.05))',
              borderRadius: '50%',
              zIndex: 1
            }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Statistic
                title={<span style={{ color: '#666', fontSize: '14px', fontWeight: '600' }}>총 레시피</span>}
                value={1247}
                prefix={<BookOutlined style={{ color: '#1890ff', fontSize: '24px' }} />}
                valueStyle={{ 
                  color: '#1890ff',
                  fontSize: '28px',
                  fontWeight: '800'
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="card-hover"
            style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '25px' }}
            hoverable
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(245, 34, 45, 0.1), rgba(245, 34, 45, 0.05))',
              borderRadius: '50%',
              zIndex: 1
            }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Statistic
                title={<span style={{ color: '#666', fontSize: '14px', fontWeight: '600' }}>즐겨찾기</span>}
                value={89}
                prefix={<HeartOutlined style={{ color: '#f5222d', fontSize: '24px' }} />}
                valueStyle={{ 
                  color: '#f5222d',
                  fontSize: '28px',
                  fontWeight: '800'
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="card-hover"
            style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '25px' }}
            hoverable
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.05))',
              borderRadius: '50%',
              zIndex: 1
            }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Statistic
                title={<span style={{ color: '#666', fontSize: '14px', fontWeight: '600' }}>커뮤니티</span>}
                value={3421}
                prefix={<TeamOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
                valueStyle={{ 
                  color: '#52c41a',
                  fontSize: '28px',
                  fontWeight: '800'
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            className="card-hover"
            style={{ 
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '25px' }}
            hoverable
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(250, 140, 22, 0.1), rgba(250, 140, 22, 0.05))',
              borderRadius: '50%',
              zIndex: 1
            }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Statistic
                title={<span style={{ color: '#666', fontSize: '14px', fontWeight: '600' }}>유통기한 임박</span>}
                value={7}
                prefix={<WarningOutlined style={{ color: '#fa8c16', fontSize: '24px' }} />}
                valueStyle={{ 
                  color: '#fa8c16',
                  fontSize: '28px',
                  fontWeight: '800'
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* 최근 레시피 */}
        <Col xs={24} lg={12}>
          <Card 
            title="최근 레시피"
            extra={
              <Button 
                type="link" 
                onClick={() => navigate('/recipes')}
                style={{ color: '#1890ff', fontWeight: '600' }}
              >
                더 보기 <ArrowRightOutlined />
              </Button>
            }
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              border: '1px solid #e8e8e8' 
            }}
          >
            <List
              dataSource={recentRecipes}
              renderItem={(recipe) => (
                <List.Item
                  style={{ 
                    padding: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    margin: '0 -12px',
                    border: '1px solid transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.backgroundColor = '#f6ffed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={recipe.imageUrl}
                        style={{ 
                          backgroundColor: '#1890ff',
                          width: '50px',
                          height: '50px'
                        }}
                      >
                        {recipe.name?.[0] || 'R'}
                      </Avatar>
                    }
                    title={
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        {recipe.name}
                      </div>
                    }
                    description={
                      <div>
                        <Space>
                          <ClockCircleOutlined style={{ color: '#666' }} />
                          <span style={{ fontSize: '12px', color: '#666' }}>{recipe.cookingTime || '?'}분</span>
                          <UserOutlined style={{ color: '#666' }} />
                          <span style={{ fontSize: '12px', color: '#666' }}>{recipe.servings || '?'}인분</span>
                        </Space>
                        {recipe.category && (
                          <Tag color="blue" style={{ marginTop: '4px', fontSize: '10px' }}>
                            {recipe.category}
                          </Tag>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 인기 커뮤니티 게시글 */}
        <Col xs={24} lg={12}>
          <Card 
            title="인기 게시글"
            extra={
              <Button 
                type="link" 
                onClick={() => navigate('/community')}
                style={{ color: '#1890ff', fontWeight: '600' }}
              >
                더 보기 <ArrowRightOutlined />
              </Button>
            }
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              border: '1px solid #e8e8e8' 
            }}
          >
            <List
              dataSource={popularPosts}
              renderItem={(post) => (
                <List.Item
                  style={{ 
                    padding: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    margin: '0 -12px',
                    border: '1px solid transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate(`/community/posts/${post.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.backgroundColor = '#f6ffed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={post.authorAvatarUrl}
                        style={{ 
                          backgroundColor: '#52c41a',
                          width: '40px',
                          height: '40px'
                        }}
                      >
                        {post.authorName?.[0] || 'U'}
                      </Avatar>
                    }
                    title={
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        {post.title}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ color: '#666', marginBottom: '8px', fontSize: '12px' }}>
                          {post.content?.substring(0, 60)}...
                        </div>
                        <Space size="small">
                          <Space>
                            <EyeOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
                            <span style={{ fontSize: '11px' }}>{post.viewCount}</span>
                          </Space>
                          <Space>
                            <LikeOutlined style={{ color: '#ff4d4f', fontSize: '12px' }} />
                            <span style={{ fontSize: '11px' }}>{post.likeCount}</span>
                          </Space>
                          <Space>
                            <MessageOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                            <span style={{ fontSize: '11px' }}>{post.commentCount}</span>
                          </Space>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 즐겨찾기 레시피 */}
        <Col xs={24} lg={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HeartOutlined style={{ color: '#ff4d4f' }} />
                  <span>내 즐겨찾기</span>
                </div>
              }
              extra={
                <Button 
                  type="link" 
                  onClick={() => navigate('/favorites')}
                  style={{ color: '#ff6b35', fontWeight: '600' }}
                >
                  더 보기 <ArrowRightOutlined />
                </Button>
              }
              style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: 'none' }}
            >
              <List
                dataSource={favoriteRecipes}
                renderItem={(favorite) => (
                  <List.Item
                    style={{ 
                      padding: '12px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      margin: '0 -12px'
                    }}
                    onClick={() => navigate(`/recipes/${favorite.recipe?.id || favorite.id}`)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={favorite.recipe?.imageUrl || favorite.imageUrl}
                          style={{ 
                            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                            width: '50px',
                            height: '50px'
                          }}
                        >
                          {(favorite.recipe?.name || favorite.name)?.[0] || 'F'}
                        </Avatar>
                      }
                      title={
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                          {favorite.recipe?.name || favorite.name}
                        </div>
                      }
                      description={
                        <div>
                          <Space>
                            <ClockCircleOutlined style={{ color: '#ff6b35' }} />
                            <span style={{ fontSize: '12px' }}>
                              {favorite.recipe?.cookingTime || favorite.cookingTime || '?'}분
                            </span>
                            <UserOutlined style={{ color: '#1890ff' }} />
                            <span style={{ fontSize: '12px' }}>
                              {favorite.recipe?.servings || favorite.servings || '?'}인분
                            </span>
                          </Space>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

        {/* 알림 및 추천 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellOutlined style={{ color: '#fa8c16' }} />
                <span>알림 & 추천</span>
              </div>
            }
            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: 'none' }}
          >
            <Timeline>
              <Timeline.Item color="red">
                <div style={{ fontSize: '14px', fontWeight: '600' }}>양파 유통기한 임박</div>
                <div style={{ fontSize: '12px', color: '#666' }}>2일 후 만료 예정</div>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <div style={{ fontSize: '14px', fontWeight: '600' }}>토마토 유통기한 임박</div>
                <div style={{ fontSize: '12px', color: '#666' }}>3일 후 만료 예정</div>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <div style={{ fontSize: '14px', fontWeight: '600' }}>새로운 레시피 추천</div>
                <div style={{ fontSize: '12px', color: '#666' }}>프리미엄 와규 스테이크</div>
              </Timeline.Item>
              <Timeline.Item color="green">
                <div style={{ fontSize: '14px', fontWeight: '600' }}>커뮤니티 활동</div>
                <div style={{ fontSize: '12px', color: '#666' }}>요리마스터님이 댓글을 남겼습니다</div>
              </Timeline.Item>
              <Timeline.Item color="purple">
                <div style={{ fontSize: '14px', fontWeight: '600' }}>새로운 팔로워</div>
                <div style={{ fontSize: '12px', color: '#666' }}>맘쿡님이 팔로우했습니다</div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 빠른 액션 */}
      <Card 
        title="빠른 액션"
        style={{ 
          marginTop: '30px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
          border: 'none' 
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Button 
              type="primary" 
              icon={<BookOutlined />}
              onClick={() => navigate('/upload')}
              style={{
                width: '100%',
                height: '60px',
                background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              영수증 업로드
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button 
              icon={<BookOutlined />}
              onClick={() => navigate('/recipes')}
              style={{
                width: '100%',
                height: '60px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              레시피 둘러보기
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button 
              icon={<UserOutlined />}
              onClick={() => navigate('/community')}
              style={{
                width: '100%',
                height: '60px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              커뮤니티 참여
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button 
              icon={<HeartOutlined />}
              onClick={() => navigate('/favorites')}
              style={{
                width: '100%',
                height: '60px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              즐겨찾기 관리
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardPage;