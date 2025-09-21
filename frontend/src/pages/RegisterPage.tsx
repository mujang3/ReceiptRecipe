import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SignupRequest } from '../types';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: SignupRequest) => {
    setLoading(true);
    console.log('회원가입 시도:', values);
    try {
      const result = await register(values);
      console.log('회원가입 성공:', result);
      message.success('회원가입이 완료되었습니다! 로그인해주세요.');
      console.log('로그인 페이지로 이동 시도');
      navigate('/login');
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      message.error(error.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            회원가입
          </Title>
          <Text type="secondary">
            영수증 OCR 서비스에 가입하세요
          </Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '사용자명을 입력해주세요!' },
              { min: 3, max: 20, message: '사용자명은 3자 이상 20자 이하여야 합니다!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="사용자명" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '이메일을 입력해주세요!' },
              { type: 'email', message: '올바른 이메일 형식이 아닙니다!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="이메일" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '비밀번호를 입력해주세요!' },
              { min: 6, max: 40, message: '비밀번호는 6자 이상 40자 이하여야 합니다!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '비밀번호 확인을 입력해주세요!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('비밀번호가 일치하지 않습니다!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호 확인"
            />
          </Form.Item>

          <Form.Item
            name="displayName"
            rules={[
              { max: 50, message: '표시명은 50자 이하여야 합니다!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="표시명 (선택사항)" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', height: 48 }}
            >
              회원가입
            </Button>
          </Form.Item>
        </Form>

        <Divider>또는</Divider>

        <div style={{ textAlign: 'center' }}>
          <Text>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" style={{ color: '#1890ff' }}>
              로그인
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;


