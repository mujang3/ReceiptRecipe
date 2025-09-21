import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Badge, 
  Button, 
  Tag, 
  Empty, 
  Alert, 
  Spin,
  Typography,
  Space,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  WarningOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  BellOutlined
} from '@ant-design/icons';
import { notificationApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

interface IngredientExpiry {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  purchaseDate: string;
  isNotified: boolean;
}

interface GeneralNotification {
  id: number;
  type: 'recipe' | 'expense' | 'tip' | 'reminder';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

const NotificationPage: React.FC = () => {
  const { user } = useAuth();
  const [expiringSoon, setExpiringSoon] = useState<IngredientExpiry[]>([]);
  const [expired, setExpired] = useState<IngredientExpiry[]>([]);
  const [generalNotifications, setGeneralNotifications] = useState<GeneralNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{expiringSoonCount: number, expiredCount: number, totalNotifications: number, unreadCount: number} | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // 더미 데이터 생성
      const dummyData = generateDummyNotifications();
      setExpiringSoon(dummyData.expiringSoon);
      setExpired(dummyData.expired);
      setGeneralNotifications(dummyData.generalNotifications);
      setStats(dummyData.stats);
    } catch (error) {
      console.error('알림 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDummyNotifications = () => {
    const ingredients = [
      '양파', '당근', '감자', '마늘', '생강', '대파', '양상추', '토마토', '오이', '브로콜리',
      '시금치', '배추', '무', '고구마', '버섯', '호박', '가지', '피망', '고추', '상추',
      '사과', '바나나', '오렌지', '딸기', '포도', '복숭아', '배', '레몬', '아보카도', '블루베리',
      '닭고기', '돼지고기', '소고기', '생선', '새우', '오징어', '문어', '계란', '우유', '요거트',
      '치즈', '버터', '두부', '순두부', '콩나물', '숙주', '팽이버섯', '표고버섯', '느타리버섯', '새송이버섯',
      '고사리', '도라지', '취나물', '시래기', '바질', '로즈마리', '타임', '오레가노', '파슬리', '딜',
      '민트', '고수', '쌀', '밀가루', '파스타', '라면', '빵', '떡', '간장', '고춧가루',
      '설탕', '소금', '식용유', '올리브오일', '참기름', '들기름', '된장', '고춧장', '김치', '멸치',
      '다시마', '미역', '김', '건전지', '테이프', '가위', '볼펜', '노트', '포장지', '비닐봉지'
    ];

    const units = ['kg', '개', '팩', '단', '포기', '마리', '판', 'L', '모', '송이', '장'];

    const today = new Date();
    const expired: IngredientExpiry[] = [];
    const expiringSoon: IngredientExpiry[] = [];

    // 만료된 재료 (5-10개)
    const expiredCount = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < expiredCount; i++) {
      const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
      const expiryDate = new Date(today);
      expiryDate.setDate(expiryDate.getDate() - Math.floor(Math.random() * 7)); // 1-7일 전 만료
      
      const purchaseDate = new Date(expiryDate);
      purchaseDate.setDate(purchaseDate.getDate() - (7 + Math.floor(Math.random() * 14))); // 7-21일 전 구매

      expired.push({
        id: i + 1,
        ingredientName: ingredient,
        quantity: Math.round((0.5 + Math.random() * 2.0) * 10) / 10,
        unit: units[Math.floor(Math.random() * units.length)],
        expiryDate: expiryDate.toISOString().split('T')[0],
        purchaseDate: purchaseDate.toISOString().split('T')[0],
        isNotified: Math.random() < 0.3 // 30% 확률로 이미 확인됨
      });
    }

    // 유통기한 임박 재료 (8-15개)
    const expiringCount = 8 + Math.floor(Math.random() * 8);
    for (let i = 0; i < expiringCount; i++) {
      const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
      const expiryDate = new Date(today);
      expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 7)); // 1-7일 후 만료
      
      const purchaseDate = new Date(expiryDate);
      purchaseDate.setDate(purchaseDate.getDate() - (7 + Math.floor(Math.random() * 14))); // 7-21일 전 구매

      expiringSoon.push({
        id: i + 100,
        ingredientName: ingredient,
        quantity: Math.round((0.5 + Math.random() * 2.0) * 10) / 10,
        unit: units[Math.floor(Math.random() * units.length)],
        expiryDate: expiryDate.toISOString().split('T')[0],
        purchaseDate: purchaseDate.toISOString().split('T')[0],
        isNotified: Math.random() < 0.2 // 20% 확률로 이미 확인됨
      });
    }

    // 일반 알림 생성
    const generalNotifications: GeneralNotification[] = [
      {
        id: 1,
        type: 'recipe',
        title: '🍳 새로운 레시피 추천',
        message: '냉장고에 있는 양파, 당근, 감자로 만들 수 있는 맛있는 수프 레시피를 추천드립니다!',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
        isRead: false,
        priority: 'medium'
      },
      {
        id: 2,
        type: 'expense',
        title: '💰 주간 지출 요약',
        message: '이번 주 총 지출액은 125,000원입니다. 지난 주 대비 15% 절약하셨네요!',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
        isRead: false,
        priority: 'low'
      },
      {
        id: 3,
        type: 'tip',
        title: '💡 절약 팁',
        message: '야채를 더 오래 보관하려면 냉장고의 습도 조절기를 확인해보세요.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
        isRead: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'reminder',
        title: '⏰ 장보기 알림',
        message: '일주일마다 정기 장보기 시간입니다. 필요한 재료를 확인해보세요.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
        isRead: true,
        priority: 'medium'
      },
      {
        id: 5,
        type: 'recipe',
        title: '🍲 계절 요리 추천',
        message: '가을에 딱 좋은 호박 스프 레시피가 새로 추가되었습니다!',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
        isRead: false,
        priority: 'high'
      },
      {
        id: 6,
        type: 'expense',
        title: '📊 월간 리포트',
        message: '9월 식비 지출이 450,000원으로 예산을 50,000원 절약했습니다!',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 전
        isRead: true,
        priority: 'medium'
      }
    ];

    const unreadCount = generalNotifications.filter(n => !n.isRead).length;

    const stats = {
      expiredCount: expired.length,
      expiringSoonCount: expiringSoon.length,
      totalNotifications: expired.length + expiringSoon.length + generalNotifications.length,
      unreadCount: unreadCount
    };

    return {
      expired,
      expiringSoon,
      generalNotifications,
      stats
    };
  };

  const handleMarkAsNotified = async (ingredientExpiryId: number) => {
    try {
      // 더미 데이터에서 해당 항목을 확인됨으로 표시
      setExpired(prev => prev.map(item => 
        item.id === ingredientExpiryId ? { ...item, isNotified: true } : item
      ));
      setExpiringSoon(prev => prev.map(item => 
        item.id === ingredientExpiryId ? { ...item, isNotified: true } : item
      ));
      
      // 통계 업데이트
      setStats(prev => prev ? {
        ...prev,
        totalNotifications: prev.totalNotifications - 1
      } : null);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      setGeneralNotifications(prev => prev.map(item => 
        item.id === notificationId ? { ...item, isRead: true } : item
      ));
      
      // 통계 업데이트
      setStats(prev => prev ? {
        ...prev,
        unreadCount: prev.unreadCount - 1,
        totalNotifications: prev.totalNotifications - 1
      } : null);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) {
      return { status: 'expired', color: 'red', text: '만료됨' };
    } else if (days <= 3) {
      return { status: 'urgent', color: 'orange', text: `${days}일 남음` };
    } else {
      return { status: 'warning', color: 'yellow', text: `${days}일 남음` };
    }
  };

  const renderIngredientItem = (item: IngredientExpiry) => {
    const expiryInfo = getExpiryStatus(item.expiryDate);
    
    return (
      <List.Item
        actions={[
          <Button 
            type="link" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleMarkAsNotified(item.id)}
            disabled={item.isNotified}
          >
            {item.isNotified ? '확인됨' : '확인'}
          </Button>
        ]}
      >
        <List.Item.Meta
          avatar={
            <Badge 
              status={expiryInfo.status as any} 
              text={
                expiryInfo.status === 'expired' ? 
                  <WarningOutlined style={{ color: '#ff4d4f' }} /> :
                  <ClockCircleOutlined style={{ color: '#faad14' }} />
              }
            />
          }
          title={
            <Space>
              <Text strong>{item.ingredientName}</Text>
              <Tag color={expiryInfo.color}>{expiryInfo.text}</Tag>
            </Space>
          }
          description={
            <Space direction="vertical" size="small">
              <Text type="secondary">
                수량: {item.quantity} {item.unit}
              </Text>
              <Text type="secondary">
                구매일: {new Date(item.purchaseDate).toLocaleDateString()}
              </Text>
              <Text type="secondary">
                유통기한: {new Date(item.expiryDate).toLocaleDateString()}
              </Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  const renderGeneralNotification = (item: GeneralNotification) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return '#ff4d4f';
        case 'medium': return '#faad14';
        case 'low': return '#52c41a';
        default: return '#1890ff';
      }
    };

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'recipe': return '🍳';
        case 'expense': return '💰';
        case 'tip': return '💡';
        case 'reminder': return '⏰';
        default: return '🔔';
      }
    };

    return (
      <List.Item
        style={{ 
          backgroundColor: item.isRead ? '#fafafa' : '#fff',
          borderLeft: item.isRead ? 'none' : `4px solid ${getPriorityColor(item.priority)}`
        }}
        actions={[
          <Button 
            type="link" 
            icon={<CheckCircleOutlined />}
            onClick={() => handleMarkAsRead(item.id)}
            disabled={item.isRead}
          >
            {item.isRead ? '읽음' : '읽음 처리'}
          </Button>
        ]}
      >
        <List.Item.Meta
          avatar={
            <div style={{ fontSize: '24px' }}>
              {getTypeIcon(item.type)}
            </div>
          }
          title={
            <Space>
              <Text strong={!item.isRead}>{item.title}</Text>
              <Tag color={getPriorityColor(item.priority)}>
                {item.priority === 'high' ? '높음' : item.priority === 'medium' ? '보통' : '낮음'}
              </Tag>
            </Space>
          }
          description={
            <Space direction="vertical" size="small">
              <Text type={item.isRead ? 'secondary' : undefined}>
                {item.message}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>알림 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>🔔 알림 센터</Title>
        <Button 
          icon={<BellOutlined />}
          onClick={fetchNotifications}
        >
          새로고침
        </Button>
      </div>

      {/* 알림 통계 */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>
                  {stats.expiredCount}
                </Title>
                <Text type="secondary">만료된 재료</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: '#faad14', margin: 0 }}>
                  {stats.expiringSoonCount}
                </Title>
                <Text type="secondary">유통기한 임박</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
                  {stats.unreadCount}
                </Title>
                <Text type="secondary">읽지 않은 알림</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ color: '#52c41a', margin: 0 }}>
                  {stats.totalNotifications}
                </Title>
                <Text type="secondary">총 알림</Text>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <WarningOutlined style={{ color: '#ff4d4f' }} />
                <span>만료된 재료</span>
                <Badge count={expired.length} style={{ backgroundColor: '#ff4d4f' }} />
              </Space>
            }
            extra={<Text type="danger">즉시 처리 필요</Text>}
          >
            {expired.length > 0 ? (
              <List
                dataSource={expired}
                renderItem={renderIngredientItem}
                size="small"
              />
            ) : (
              <Empty 
                description="만료된 재료가 없습니다" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#faad14' }} />
                <span>유통기한 임박</span>
                <Badge count={expiringSoon.length} style={{ backgroundColor: '#faad14' }} />
              </Space>
            }
            extra={<Text type="warning">7일 이내 만료</Text>}
          >
            {expiringSoon.length > 0 ? (
              <List
                dataSource={expiringSoon}
                renderItem={renderIngredientItem}
                size="small"
              />
            ) : (
              <Empty 
                description="유통기한이 임박한 재료가 없습니다" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* 일반 알림 섹션 */}
      <Card 
        title={
          <Space>
            <BellOutlined />
            <span>일반 알림</span>
            <Badge count={generalNotifications.filter(n => !n.isRead).length} style={{ backgroundColor: '#1890ff' }} />
          </Space>
        }
        extra={<Text type="secondary">최신 알림부터 표시됩니다</Text>}
        style={{ marginBottom: '24px' }}
      >
        {generalNotifications.length > 0 ? (
          <List
            dataSource={generalNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
            renderItem={renderGeneralNotification}
            size="small"
          />
        ) : (
          <Empty 
            description="알림이 없습니다" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      <Card title="📋 알림 설정">
        <Alert
          message="알림 설정"
          description="유통기한 알림은 매일 오전 9시에 발송됩니다. 이메일 알림을 받으려면 설정에서 이메일을 등록해주세요."
          type="info"
          showIcon
        />
        
        <div style={{ marginTop: '16px' }}>
          <Space direction="vertical">
            <Text>• 유통기한 3일 전 알림</Text>
            <Text>• 유통기한 만료 당일 알림</Text>
            <Text>• 주간 지출 요약 알림</Text>
            <Text>• 새로운 레시피 추천 알림</Text>
            <Text>• 절약 팁 및 요리 꿀팁</Text>
            <Text>• 정기 장보기 알림</Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default NotificationPage;
