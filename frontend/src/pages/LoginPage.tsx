import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      await login(values);
      message.success('로그인에 성공했습니다!');
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.response?.data?.error || '로그인에 실패했습니다.');
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(64, 169, 255, 0.1) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite reverse'
      }} />
      
      <Card 
        className="fade-in-up"
        style={{ 
          width: 420, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(24, 144, 255, 0.3)'
          }}>
            <UserOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ 
            margin: 0, 
            background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800'
          }}>
            로그인
          </Title>
          <Text style={{ 
            color: '#666', 
            fontSize: '16px',
            fontWeight: '500'
          }}>
            영수증 OCR 서비스에 오신 것을 환영합니다
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="usernameOrEmail"
            rules={[
              { required: true, message: '사용자명 또는 이메일을 입력해주세요!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="사용자명 또는 이메일" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '비밀번호를 입력해주세요!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="btn-gradient"
              style={{ 
                width: '100%', 
                height: 50,
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '700',
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
              }}
            >
              로그인
            </Button>
          </Form.Item>
        </Form>

        <Divider>또는</Divider>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#666', fontSize: '14px' }}>
            계정이 없으신가요?{' '}
            <Link to="/register" style={{ 
              color: '#1890ff',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              회원가입
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;


