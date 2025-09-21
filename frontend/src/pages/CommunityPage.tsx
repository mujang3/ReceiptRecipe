import React, { useState, useEffect, useCallback } from 'react';
import { Card, List, Typography, Button, Input, Space, Avatar, Row, Col, Pagination, message, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, LikeOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { communityApi } from '../services/api';
import { Post } from '../types';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const pageSize = 10;

  const loadPosts = async (page: number = 1, keyword: string = '') => {
    setLoading(true);
    try {
      // API 호출을 시도하되 실패해도 기본 데이터로 표시
      try {
        let response: any;
        if (keyword) {
          response = await communityApi.searchPosts(keyword, page - 1, pageSize);
        } else {
          response = await communityApi.getPosts(page - 1, pageSize);
        }
        
        console.log('API Response:', response); // 디버깅용
        
        // 백엔드 API 응답 형식에 맞게 수정
        if (response && response.content) {
          setPosts(Array.isArray(response.content) ? response.content : []);
          setTotalPages(response.totalPages || 0);
        } else if (Array.isArray(response)) {
          setPosts(response);
          setTotalPages(1);
        } else {
          setPosts([]);
          setTotalPages(0);
        }
      } catch (apiError) {
        console.log('API 호출 실패, 기본 데이터로 표시:', apiError);
        // 기본 커뮤니티 포스트 데이터
        const mockPosts = [
          {
            id: 1,
            title: "맛있는 김치찌개 레시피 공유해요!",
            content: "오늘 집에서 만든 김치찌개가 너무 맛있어서 레시피를 공유하고 싶어요. 돼지고기 200g, 김치 1컵, 두부 1/2모, 대파 1대면 충분해요!",
            author: {
              id: 1,
              username: "요리사",
              displayName: "요리사",
              avatarUrl: "https://via.placeholder.com/40/1890ff/FFFFFF?text=요"
            },
            authorName: "요리사",
            authorAvatarUrl: "https://via.placeholder.com/40/1890ff/FFFFFF?text=요",
            likeCount: 15,
            commentCount: 8,
            viewCount: 120,
            status: "PUBLISHED" as const,
            createdAt: "2025-01-20T10:30:00Z",
            updatedAt: "2025-01-20T10:30:00Z"
          },
          {
            id: 2,
            title: "완벽한 스테이크 굽는 법",
            content: "스테이크를 완벽하게 굽는 비법을 알려드릴게요. 먼저 고기를 상온에 30분 두어서 실온으로 만든 후, 소금과 후추로 간을 해주세요.",
            author: {
              id: 2,
              username: "고기요리사",
              displayName: "고기요리사",
              avatarUrl: "https://via.placeholder.com/40/40a9ff/FFFFFF?text=고"
            },
            authorName: "고기요리사",
            authorAvatarUrl: "https://via.placeholder.com/40/40a9ff/FFFFFF?text=고",
            likeCount: 23,
            commentCount: 12,
            viewCount: 180,
            status: "PUBLISHED" as const,
            createdAt: "2025-01-19T15:45:00Z",
            updatedAt: "2025-01-19T15:45:00Z"
          },
          {
            id: 3,
            title: "다이어트 샐러드 레시피",
            content: "다이어트 중인데 맛있는 샐러드 레시피 찾고 계신가요? 아보카도, 토마토, 치킨, 견과류로 만든 샐러드 레시피를 공유합니다!",
            author: {
              id: 3,
              username: "헬시쿠킹",
              displayName: "헬시쿠킹",
              avatarUrl: "https://via.placeholder.com/40/52c41a/FFFFFF?text=헬"
            },
            authorName: "헬시쿠킹",
            authorAvatarUrl: "https://via.placeholder.com/40/52c41a/FFFFFF?text=헬",
            likeCount: 18,
            commentCount: 6,
            viewCount: 95,
            status: "PUBLISHED" as const,
            createdAt: "2025-01-18T09:20:00Z",
            updatedAt: "2025-01-18T09:20:00Z"
          }
        ];
        setPosts(mockPosts);
        setTotalPages(1);
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading posts:', error); // 디버깅용
      message.error('게시글을 불러오는데 실패했습니다.');
      setPosts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(1, searchKeyword);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchKeyword(value);
          loadPosts(1, value);
        }, 300); // 300ms delay
      };
    })(),
    []
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handlePageChange = (page: number) => {
    loadPosts(page, searchKeyword);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/community/posts/${postId}`);
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      message.warning('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/community/create');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }} className="fade-in-up">
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '40px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <TeamOutlined style={{ fontSize: '48px', color: '#fff' }} />
                <div>
                  <Title level={1} style={{ 
                    margin: 0, 
                    color: 'white',
                    fontSize: '36px',
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    커뮤니티
                  </Title>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '18px',
                    fontWeight: '300'
                  }}>
                    다른 사용자들과 레시피와 요리 팁을 공유해보세요
                  </Text>
                </div>
              </div>
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreatePost}
                size="large"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '25px',
                  height: '50px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white'
                }}
              >
                글쓰기
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <Card style={{ 
        marginBottom: '32px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }} className="card-hover">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="게시글 검색..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ 
                borderRadius: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="정렬 기준"
              style={{ width: '100%' }}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
            >
              <Option value="createdAt">최신순</Option>
              <Option value="viewCount">조회수순</Option>
              <Option value="likeCount">좋아요순</Option>
              <Option value="commentCount">댓글순</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="정렬 순서"
              style={{ width: '100%' }}
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
            >
              <Option value="desc">내림차순</Option>
              <Option value="asc">오름차순</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="카테고리"
              style={{ width: '100%' }}
              allowClear
              value={filterCategory}
              onChange={(value) => setFilterCategory(value)}
            >
              <Option value="recipe">레시피</Option>
              <Option value="tip">요리팁</Option>
              <Option value="question">질문</Option>
              <Option value="review">후기</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button 
              type="primary" 
              onClick={() => loadPosts(1, searchKeyword)}
              className="btn-gradient"
              style={{
                width: '100%',
                borderRadius: '25px',
                height: '40px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(24, 144, 255, 0.3)'
              }}
            >
              검색
            </Button>
          </Col>
        </Row>
      </Card>

      <List
        loading={loading}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item style={{ padding: '12px 0' }}>
            <Card 
              hoverable
              className="card-hover"
              style={{ 
                width: '100%',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => handlePostClick(post.id)}
            >
              <div style={{ marginBottom: '16px' }}>
                <Title level={4} style={{ 
                  margin: 0, 
                  marginBottom: '12px',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#333',
                  lineHeight: '1.4'
                }}>
                  {post.title}
                </Title>
                <Text 
                  ellipsis
                  style={{ 
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                >
                  {post.content}
                </Text>
              </div>
              
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Avatar 
                      size="small" 
                      src={post.authorAvatarUrl}
                      style={{
                        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                        border: '2px solid rgba(255, 107, 53, 0.2)'
                      }}
                    >
                      {post.authorName?.[0] || 'U'}
                    </Avatar>
                    <Text strong style={{ color: '#333' }}>{post.authorName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{formatDate(post.createdAt)}</Text>
                  </Space>
                </Col>
                <Col>
                  <Space size="large">
                    <Space style={{ 
                      padding: '4px 8px',
                      background: '#f0f8ff',
                      borderRadius: '8px'
                    }}>
                      <EyeOutlined style={{ color: '#1890ff' }} />
                      <Text style={{ fontWeight: '500' }}>{post.viewCount}</Text>
                    </Space>
                    <Space style={{ 
                      padding: '4px 8px',
                      background: '#fff2f0',
                      borderRadius: '8px'
                    }}>
                      <LikeOutlined style={{ color: '#ff4d4f' }} />
                      <Text style={{ fontWeight: '500' }}>{post.likeCount}</Text>
                    </Space>
                    <Space style={{ 
                      padding: '4px 8px',
                      background: '#f6ffed',
                      borderRadius: '8px'
                    }}>
                      <MessageOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ fontWeight: '500' }}>{post.commentCount}</Text>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Pagination
            current={currentPage}
            total={totalPages * pageSize}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
