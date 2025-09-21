import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Typography, 
  Space, 
  message, 
  Divider,
  List,
  Row,
  Col,
  Statistic,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  LockOutlined, 
  FileTextOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { profileApi } from '../services/api';
import { User, ProfileUpdateRequest, PasswordChangeRequest, Post, UserStats } from '../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MyPage: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setProfileLoading(true);
    try {
      const [profileData, statsData, postsData] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getUserStats(),
        profileApi.getUserPosts(0, 5)
      ]);
      
      setProfile(profileData);
      setUserStats(statsData);
      setUserPosts(postsData.content);
      
      // 폼에 현재 데이터 설정
      profileForm.setFieldsValue({
        displayName: profileData.displayName,
        email: profileData.email,
        avatarUrl: profileData.avatarUrl,
        preferences: profileData.preferences
      });
    } catch (error) {
      message.error('프로필 데이터를 불러오는데 실패했습니다.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = async (values: ProfileUpdateRequest) => {
    setLoading(true);
    try {
      await profileApi.updateProfile(values);
      message.success('프로필이 성공적으로 업데이트되었습니다.');
      await loadProfileData(); // 데이터 다시 로드
    } catch (error: any) {
      message.error(error.response?.data?.error || '프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: PasswordChangeRequest) => {
    setLoading(true);
    try {
      await profileApi.changePassword(values);
      message.success('비밀번호가 성공적으로 변경되었습니다.');
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.error || '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (profileLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>마이페이지</Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* 프로필 정보 카드 */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={100} 
                src={profile?.avatarUrl} 
                icon={<UserOutlined />}
                style={{ marginBottom: '16px' }}
              />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {profile?.displayName || profile?.username}
                </Title>
                <Text type="secondary">@{profile?.username}</Text>
              </div>
            </div>
            
            <Divider />
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>이메일</Text>
                <br />
                <Text>{profile?.email}</Text>
              </div>
              <div>
                <Text strong>가입일</Text>
                <br />
                <Text>{profile?.createdAt ? formatDate(profile.createdAt) : '-'}</Text>
              </div>
              <div>
                <Text strong>최근 업데이트</Text>
                <br />
                <Text>{profile?.updatedAt ? formatDate(profile.updatedAt) : '-'}</Text>
              </div>
            </Space>
          </Card>

          {/* 통계 카드 */}
          <Card title="활동 통계" style={{ marginTop: '16px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="작성한 게시글" 
                  value={userStats?.postCount || 0}
                  prefix={<FileTextOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 탭 컨텐츠 */}
        <Col xs={24} lg={16}>
          <Card>
            <Tabs defaultActiveKey="profile">
              {/* 프로필 수정 탭 */}
              <TabPane tab="프로필 수정" key="profile">
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                >
                  <Form.Item
                    name="displayName"
                    label="표시명"
                    rules={[{ max: 50, message: '표시명은 50자 이하여야 합니다!' }]}
                  >
                    <Input placeholder="표시명을 입력하세요" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="이메일"
                    rules={[
                      { type: 'email', message: '올바른 이메일 형식이 아닙니다!' }
                    ]}
                  >
                    <Input placeholder="이메일을 입력하세요" />
                  </Form.Item>

                  <Form.Item
                    name="avatarUrl"
                    label="프로필 이미지 URL"
                  >
                    <Input placeholder="프로필 이미지 URL을 입력하세요" />
                  </Form.Item>

                  <Form.Item
                    name="preferences"
                    label="설정 (JSON)"
                  >
                    <Input.TextArea 
                      rows={4} 
                      placeholder='{"theme": "light", "language": "ko"}' 
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<EditOutlined />}
                    >
                      프로필 업데이트
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              {/* 비밀번호 변경 탭 */}
              <TabPane tab="비밀번호 변경" key="password">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordChange}
                >
                  <Form.Item
                    name="currentPassword"
                    label="현재 비밀번호"
                    rules={[{ required: true, message: '현재 비밀번호를 입력해주세요!' }]}
                  >
                    <Input.Password placeholder="현재 비밀번호를 입력하세요" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="새 비밀번호"
                    rules={[
                      { required: true, message: '새 비밀번호를 입력해주세요!' },
                      { min: 6, max: 40, message: '비밀번호는 6자 이상 40자 이하여야 합니다!' }
                    ]}
                  >
                    <Input.Password placeholder="새 비밀번호를 입력하세요" />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="새 비밀번호 확인"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: '비밀번호 확인을 입력해주세요!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('비밀번호가 일치하지 않습니다!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="새 비밀번호를 다시 입력하세요" />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<LockOutlined />}
                    >
                      비밀번호 변경
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              {/* 내 게시글 탭 */}
              <TabPane tab="내 게시글" key="posts">
                <List
                  dataSource={userPosts}
                  renderItem={(post) => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
                          {post.title}
                        </Title>
                        <Text ellipsis={true} style={{ color: '#666' }}>
                          {post.content}
                        </Text>
                        <div style={{ marginTop: '8px' }}>
                          <Space>
                            <Space>
                              <EyeOutlined />
                              <Text>{post.viewCount}</Text>
                            </Space>
                            <Space>
                              <LikeOutlined />
                              <Text>{post.likeCount}</Text>
                            </Space>
                            <Space>
                              <MessageOutlined />
                              <Text>{post.commentCount}</Text>
                            </Space>
                            <Text type="secondary">{formatDate(post.createdAt)}</Text>
                          </Space>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
                
                {userPosts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">작성한 게시글이 없습니다.</Text>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyPage;
