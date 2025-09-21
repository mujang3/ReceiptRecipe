import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { communityApi } from '../services/api';
import { PostRequest } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

const CreatePostPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: PostRequest) => {
    setLoading(true);
    try {
      await communityApi.createPost(values);
      message.success('게시글이 성공적으로 작성되었습니다!');
      navigate('/community');
    } catch (error: any) {
      message.error(error.response?.data?.error || '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/community');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            새 게시글 작성
          </Title>
        </div>

        <Form
          name="createPost"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="제목"
            rules={[
              { required: true, message: '제목을 입력해주세요!' },
              { max: 200, message: '제목은 200자 이하여야 합니다!' }
            ]}
          >
            <Input 
              placeholder="게시글 제목을 입력하세요"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="내용"
            rules={[
              { required: true, message: '내용을 입력해주세요!' }
            ]}
          >
            <TextArea
              placeholder="게시글 내용을 입력하세요"
              rows={15}
              showCount
              maxLength={5000}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
              >
                게시글 작성
              </Button>
              <Button 
                onClick={handleCancel}
                icon={<ArrowLeftOutlined />}
                size="large"
              >
                취소
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePostPage;


