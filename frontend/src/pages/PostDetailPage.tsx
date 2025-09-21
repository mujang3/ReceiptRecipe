import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Input, 
  Space, 
  Avatar, 
  Row, 
  Col, 
  message, 
  Spin,
  Divider,
  List,
  Pagination,
  Tag
} from 'antd';
import { 
  EyeOutlined, 
  LikeOutlined, 
  MessageOutlined, 
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { communityApi } from '../services/api';
import { Post, Comment, PostLikeResponse } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    if (id) {
      loadPost();
      loadComments();
      loadLikeStatus();
    }
  }, [id]);

  const loadPost = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const postData = await communityApi.getPost(parseInt(id));
      setPost(postData);
    } catch (error) {
      message.error('게시글을 불러오는데 실패했습니다.');
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (page: number = 1) => {
    if (!id) return;
    
    setCommentLoading(true);
    try {
      const response = await communityApi.getComments(parseInt(id), page - 1, pageSize);
      setComments(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCommentCount(response.totalElements || 0);
      setCurrentPage(page);
    } catch (error) {
      message.error('댓글을 불러오는데 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const loadLikeStatus = async () => {
    if (!id || !isAuthenticated) return;
    
    try {
      const response = await communityApi.getPostLikeStatus(parseInt(id));
      setIsLiked(response.isLiked);
    } catch (error) {
      // 로그인하지 않은 경우 무시
    }
  };

  const handleLike = async () => {
    if (!id || !isAuthenticated) {
      message.warning('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setLikeLoading(true);
    try {
      const response: PostLikeResponse = await communityApi.togglePostLike(parseInt(id));
      setIsLiked(response.isLiked);
      if (post) {
        setPost({
          ...post,
          likeCount: response.isLiked ? post.likeCount + 1 : post.likeCount - 1
        });
      }
      message.success(response.message);
    } catch (error) {
      message.error('좋아요 처리에 실패했습니다.');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!id || !isAuthenticated) {
      message.warning('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      message.warning('댓글 내용을 입력해주세요.');
      return;
    }

    setCommentLoading(true);
    try {
      await communityApi.createComment(parseInt(id), { content: newComment.trim() });
      setNewComment('');
      loadComments(1); // 첫 페이지로 이동
      message.success('댓글이 등록되었습니다.');
    } catch (error) {
      message.error('댓글 등록에 실패했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentPageChange = (page: number) => {
    loadComments(page);
  };

  const handleEditPost = () => {
    if (!id) return;
    navigate(`/community/posts/${id}/edit`);
  };

  const handleDeletePost = async () => {
    if (!id) return;
    
    try {
      await communityApi.deletePost(parseInt(id));
      message.success('게시글이 삭제되었습니다.');
      navigate('/community');
    } catch (error) {
      message.error('게시글 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const isAuthor = post && user && post.author?.id === user.id;

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>게시글을 찾을 수 없습니다.</Title>
        <Button type="primary" onClick={() => navigate('/community')}>
          커뮤니티로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 뒤로가기 버튼 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/community')}
        style={{ marginBottom: '16px' }}
      >
        목록으로
      </Button>

      {/* 게시글 내용 */}
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Row justify="space-between" align="top">
            <Col flex="auto">
              <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
                {post.title}
              </Title>
              <Space>
                <Avatar size="small" src={post.author?.avatarUrl}>
                  {post.author?.displayName?.[0] || post.author?.username?.[0] || 'U'}
                </Avatar>
                <Text strong>{post.author?.displayName || post.author?.username || 'Unknown'}</Text>
                <Text type="secondary">{formatDate(post.createdAt)}</Text>
                {post.status === 'PUBLISHED' && <Tag color="green">공개</Tag>}
              </Space>
            </Col>
            <Col>
              {isAuthor && (
                <Space>
                  <Button 
                    icon={<EditOutlined />} 
                    onClick={handleEditPost}
                    size="small"
                  >
                    수정
                  </Button>
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={handleDeletePost}
                    danger
                    size="small"
                  >
                    삭제
                  </Button>
                </Space>
              )}
            </Col>
          </Row>
        </div>

        <Divider />

        <div style={{ marginBottom: '24px' }}>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Paragraph>
        </div>

        {/* 통계 정보 */}
        <Row justify="space-between" align="middle">
          <Col>
            <Space size="large">
              <Space>
                <EyeOutlined />
                <Text>{post.viewCount}</Text>
              </Space>
              <Space>
                <MessageOutlined />
                <Text>{commentCount}</Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Button
              type={isLiked ? 'primary' : 'default'}
              icon={isLiked ? <HeartOutlined /> : <LikeOutlined />}
              onClick={handleLike}
              loading={likeLoading}
              disabled={!isAuthenticated}
            >
              {post.likeCount}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 댓글 섹션 */}
      <Card title={`댓글 ${commentCount}개`} style={{ marginTop: '24px' }}>
        {/* 댓글 작성 */}
        {isAuthenticated && (
          <div style={{ marginBottom: '24px' }}>
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성해주세요..."
              rows={3}
              style={{ marginBottom: '12px' }}
            />
            <div style={{ textAlign: 'right' }}>
              <Button 
                type="primary" 
                onClick={handleCommentSubmit}
                loading={commentLoading}
              >
                댓글 작성
              </Button>
            </div>
          </div>
        )}

        {/* 댓글 목록 */}
        <Spin spinning={commentLoading}>
          <List
            dataSource={comments}
            locale={{ emptyText: '댓글이 없습니다.' }}
            renderItem={(comment) => (
              <List.Item style={{ padding: '12px 0' }}>
                <List.Item.Meta
                  avatar={
                    <Avatar size="small" src={comment.author?.avatarUrl}>
                      {comment.author?.displayName?.[0] || comment.author?.username?.[0] || 'U'}
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong>{comment.author?.displayName || comment.author?.username || 'Unknown'}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDate(comment.createdAt)}
                      </Text>
                    </Space>
                  }
                  description={
                    <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {comment.content}
                    </Paragraph>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>

        {/* 댓글 페이지네이션 */}
        {totalPages > 1 && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Pagination
              current={currentPage}
              total={totalPages * pageSize}
              pageSize={pageSize}
              onChange={handleCommentPageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PostDetailPage;