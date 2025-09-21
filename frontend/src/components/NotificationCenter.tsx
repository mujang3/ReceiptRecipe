import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Typography, Button, Empty } from 'antd';
import { BellOutlined, HeartOutlined, MessageOutlined, StarOutlined, FireOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Text } = Typography;

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'favorite' | 'recipe' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = () => {
    // 실제로는 API에서 가져와야 하지만, 지금은 모의 데이터
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        title: '좋아요를 받았습니다!',
        message: '김민수님이 "완벽한 스테이크" 레시피에 좋아요를 눌렀습니다.',
        time: '5분 전',
        read: false,
        avatar: 'https://via.placeholder.com/40/FF6B6B/FFFFFF?text=김'
      },
      {
        id: '2',
        type: 'comment',
        title: '새로운 댓글',
        message: '이지영님이 "간단한 김치찌개" 게시글에 댓글을 남겼습니다.',
        time: '1시간 전',
        read: false,
        avatar: 'https://via.placeholder.com/40/4ECDC4/FFFFFF?text=이'
      },
      {
        id: '3',
        type: 'favorite',
        title: '즐겨찾기 추가',
        message: '박현우님이 "크림파스타" 레시피를 즐겨찾기에 추가했습니다.',
        time: '2시간 전',
        read: true,
        avatar: 'https://via.placeholder.com/40/45B7D1/FFFFFF?text=박'
      },
      {
        id: '4',
        type: 'recipe',
        title: '새로운 레시피',
        message: '마스터셰프님이 "완벽한 스테이크" 레시피를 공유했습니다.',
        time: '3시간 전',
        read: true,
        avatar: 'https://via.placeholder.com/40/96CEB4/FFFFFF?text=마'
      },
      {
        id: '5',
        type: 'system',
        title: '시스템 알림',
        message: '새로운 기능이 추가되었습니다! 즐겨찾기 기능을 확인해보세요.',
        time: '1일 전',
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <HeartOutlined style={{ color: '#ff4d4f' }} />;
      case 'comment':
        return <MessageOutlined style={{ color: '#1890ff' }} />;
      case 'favorite':
        return <StarOutlined style={{ color: '#faad14' }} />;
      case 'recipe':
        return <FireOutlined style={{ color: '#52c41a' }} />;
      default:
        return <BellOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const notificationMenu = {
    items: [
      {
        key: 'header',
        label: (
          <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>알림</Text>
              {unreadCount > 0 && (
                <Button type="link" size="small" onClick={markAllAsRead}>
                  모두 읽음
                </Button>
              )}
            </div>
          </div>
        ),
        type: 'group' as const
      },
      ...notifications.map(notification => ({
        key: notification.id,
        label: (
          <div 
            style={{ 
              padding: '8px 0',
              backgroundColor: notification.read ? 'transparent' : '#f6ffed',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => markAsRead(notification.id)}
          >
            <List.Item style={{ padding: 0, border: 'none' }}>
              <List.Item.Meta
                avatar={
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    {notification.avatar ? (
                      <img 
                        src={notification.avatar} 
                        alt="avatar" 
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                      />
                    ) : (
                      getNotificationIcon(notification.type)
                    )}
                  </div>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '13px' }}>{notification.title}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{notification.time}</Text>
                  </div>
                }
                description={
                  <Text style={{ fontSize: '12px', color: '#666' }}>
                    {notification.message}
                  </Text>
                }
              />
            </List.Item>
          </div>
        )
      })),
      {
        key: 'empty',
        label: notifications.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="새로운 알림이 없습니다"
            style={{ padding: '20px 0' }}
          />
        ) : null,
        type: 'group' as const
      }
    ]
  };

  if (!user) return null;

  return (
    <Dropdown 
      menu={notificationMenu} 
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ width: '320px', maxHeight: '400px', overflowY: 'auto' }}
    >
      <Badge count={unreadCount} size="small">
        <Button 
          type="text" 
          icon={<BellOutlined />} 
          style={{ 
            color: '#fff',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px'
          }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationCenter;
