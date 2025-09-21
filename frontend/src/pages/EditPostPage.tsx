import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { communityApi } from '../services/api';
import { PostRequest } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(true);
  const [form] = Form.useForm();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    loadPost();
  }, [id, navigate]);

  const loadPost = async () => {
    if (!id) return;
    
    setPostLoading(true);
    try {
      const post = await communityApi.getPost(parseInt(id));
      
      // 작성자만 수정 가능
      if (post.author?.id !== user?.id && !user?.roles.includes('ROLE_ADMIN')) {
        message.error('게시글을 수정할 권한이 없습니다.');
        navigate('/community');
        return;
      }
      
      form.setFieldsValue({
        title: post.title,
        content: post.content,
      });
    } catch (error) {
      message.error('게시글을 불러오는데 실패했습니다.');
      navigate('/community');
    } finally {
      setPostLoading(false);
    }
  };

  const onFinish = async (values: PostRequest) => {
    if (!id) return;
    
    setLoading(true);
    try {
      await communityApi.updatePost(parseInt(id), values);
      message.success('게시글이 성공적으로 수정되었습니다!');
      navigate(`/community/posts/${id}`);
    } catch (error: any) {
      message.error(error.response?.data?.error || '게시글 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/community/posts/${id}`);
    } else {
      navigate('/community');
    }
  };

  if (postLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            게시글 수정
          </Title>
        </div>

        <Form
          form={form}
          name="editPost"
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
                수정 완료
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

export default EditPostPage;


