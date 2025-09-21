import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  message,
  Row,
  Col,
  Statistic,
  Alert
} from 'antd';
import { 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { receiptApi } from '../services/api';

const { Title, Paragraph } = Typography;

interface IngredientItem {
  id: number;
  itemName: string;
  expiryDate: string;
  isExpiring: boolean;
  daysUntilExpiry: number;
  category: string;
  quantity: number;
  unit: string;
}

const IngredientManagementPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expiringCount, setExpiringCount] = useState(0);

  const loadIngredients = async () => {
    setLoading(true);
    try {
      // 더미 데이터 생성
      const dummyIngredients = generateDummyIngredients();
      setIngredients(dummyIngredients);
      setExpiringCount(dummyIngredients.filter(ing => ing.isExpiring).length);
    } catch (error) {
      message.error('재료 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const generateDummyIngredients = (): IngredientItem[] => {
    const ingredients = [
      { name: '양파', category: '채소', unit: 'kg', days: 5 },
      { name: '당근', category: '채소', unit: 'kg', days: 12 },
      { name: '감자', category: '채소', unit: 'kg', days: 18 },
      { name: '마늘', category: '채소', unit: 'kg', days: 25 },
      { name: '생강', category: '채소', unit: 'kg', days: 8 },
      { name: '대파', category: '채소', unit: '단', days: 3 },
      { name: '양상추', category: '채소', unit: '개', days: 2 },
      { name: '토마토', category: '채소', unit: 'kg', days: 6 },
      { name: '오이', category: '채소', unit: '개', days: 4 },
      { name: '브로콜리', category: '채소', unit: '개', days: 1 },
      { name: '시금치', category: '채소', unit: '단', days: 2 },
      { name: '배추', category: '채소', unit: '포기', days: 10 },
      { name: '무', category: '채소', unit: '개', days: 15 },
      { name: '고구마', category: '채소', unit: 'kg', days: 20 },
      { name: '버섯', category: '채소', unit: '팩', days: 3 },
      { name: '아보카도', category: '과일', unit: '개', days: 2 },
      { name: '바나나', category: '과일', unit: '송이', days: 4 },
      { name: '사과', category: '과일', unit: '개', days: 10 },
      { name: '오렌지', category: '과일', unit: '개', days: 12 },
      { name: '레몬', category: '과일', unit: '개', days: 18 },
      { name: '딸기', category: '과일', unit: '팩', days: 1 },
      { name: '블루베리', category: '과일', unit: '팩', days: 5 },
      { name: '포도', category: '과일', unit: '송이', days: 6 },
      { name: '복숭아', category: '과일', unit: '개', days: 3 },
      { name: '배', category: '과일', unit: '개', days: 8 },
      { name: '닭고기', category: '육류', unit: 'kg', days: 2 },
      { name: '돼지고기', category: '육류', unit: 'kg', days: 1 },
      { name: '소고기', category: '육류', unit: 'kg', days: 3 },
      { name: '생선', category: '해산물', unit: '마리', days: 1 },
      { name: '새우', category: '해산물', unit: 'kg', days: 2 },
      { name: '오징어', category: '해산물', unit: '마리', days: 1 },
      { name: '문어', category: '해산물', unit: '마리', days: 2 },
      { name: '계란', category: '유제품', unit: '판', days: 10 },
      { name: '우유', category: '유제품', unit: 'L', days: 5 },
      { name: '요거트', category: '유제품', unit: '개', days: 7 },
      { name: '치즈', category: '유제품', unit: '팩', days: 12 },
      { name: '버터', category: '유제품', unit: '개', days: 25 },
      { name: '마요네즈', category: '조미료', unit: '개', days: 30 },
      { name: '케첩', category: '조미료', unit: '개', days: 90 },
      { name: '간장', category: '조미료', unit: '개', days: 365 },
      { name: '고춧가루', category: '조미료', unit: '개', days: 180 },
      { name: '설탕', category: '조미료', unit: 'kg', days: 365 },
      { name: '소금', category: '조미료', unit: 'kg', days: 365 },
      { name: '식용유', category: '조미료', unit: 'L', days: 180 },
      { name: '올리브오일', category: '조미료', unit: 'L', days: 365 },
      { name: '참기름', category: '조미료', unit: '개', days: 180 },
      { name: '들기름', category: '조미료', unit: '개', days: 180 },
      { name: '쌀', category: '곡물', unit: 'kg', days: 365 },
      { name: '밀가루', category: '곡물', unit: 'kg', days: 180 },
      { name: '파스타', category: '곡물', unit: 'kg', days: 365 },
      { name: '라면', category: '곡물', unit: '개', days: 180 },
      { name: '김치', category: '발효식품', unit: 'kg', days: 25 },
      { name: '된장', category: '발효식품', unit: '개', days: 90 },
      { name: '고춧장', category: '발효식품', unit: '개', days: 90 },
      { name: '멸치', category: '발효식품', unit: 'kg', days: 180 },
      { name: '다시마', category: '발효식품', unit: '개', days: 365 },
      { name: '미역', category: '발효식품', unit: '개', days: 365 },
      { name: '김', category: '발효식품', unit: '장', days: 180 },
      { name: '두부', category: '콩류', unit: '모', days: 2 },
      { name: '순두부', category: '콩류', unit: '모', days: 2 },
      { name: '콩나물', category: '콩류', unit: 'kg', days: 2 },
      { name: '숙주', category: '콩류', unit: 'kg', days: 2 },
      { name: '팽이버섯', category: '버섯', unit: '팩', days: 3 },
      { name: '표고버섯', category: '버섯', unit: '팩', days: 5 },
      { name: '느타리버섯', category: '버섯', unit: '팩', days: 3 },
      { name: '새송이버섯', category: '버섯', unit: '팩', days: 3 },
      { name: '고사리', category: '나물', unit: 'kg', days: 25 },
      { name: '도라지', category: '나물', unit: 'kg', days: 25 },
      { name: '취나물', category: '나물', unit: 'kg', days: 3 },
      { name: '시래기', category: '나물', unit: 'kg', days: 25 },
      { name: '호박', category: '채소', unit: '개', days: 10 },
      { name: '애호박', category: '채소', unit: '개', days: 5 },
      { name: '가지', category: '채소', unit: '개', days: 6 },
      { name: '피망', category: '채소', unit: '개', days: 5 },
      { name: '파프리카', category: '채소', unit: '개', days: 6 },
      { name: '고추', category: '채소', unit: '개', days: 5 },
      { name: '청양고추', category: '채소', unit: '개', days: 5 },
      { name: '풋고추', category: '채소', unit: '개', days: 3 },
      { name: '마늘쫑', category: '채소', unit: '단', days: 3 },
      { name: '부추', category: '채소', unit: '단', days: 3 },
      { name: '깻잎', category: '채소', unit: '단', days: 3 },
      { name: '상추', category: '채소', unit: '포기', days: 3 },
      { name: '치커리', category: '채소', unit: '단', days: 3 },
      { name: '로메인', category: '채소', unit: '개', days: 5 },
      { name: '케일', category: '채소', unit: '단', days: 3 },
      { name: '아루귤라', category: '채소', unit: '단', days: 3 },
      { name: '바질', category: '허브', unit: '단', days: 3 },
      { name: '로즈마리', category: '허브', unit: '단', days: 5 },
      { name: '타임', category: '허브', unit: '단', days: 5 },
      { name: '오레가노', category: '허브', unit: '단', days: 5 },
      { name: '파슬리', category: '허브', unit: '단', days: 3 },
      { name: '딜', category: '허브', unit: '단', days: 3 },
      { name: '민트', category: '허브', unit: '단', days: 3 },
      { name: '고수', category: '허브', unit: '단', days: 3 }
    ];

    return ingredients.map((ingredient, index) => {
      const today = new Date();
      const expiryDate = new Date(today.getTime() + ingredient.days * 24 * 60 * 60 * 1000);
      const isExpiring = ingredient.days <= 7;
      
      return {
        id: index + 1,
        itemName: ingredient.name,
        expiryDate: expiryDate.toISOString().split('T')[0],
        isExpiring: isExpiring,
        daysUntilExpiry: ingredient.days,
        category: ingredient.category,
        quantity: Math.round((0.5 + Math.random() * 2.0) * 10) / 10, // 0.5 ~ 2.5 사이의 수량
        unit: ingredient.unit
      };
    });
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const columns = [
    {
      title: '재료명',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: IngredientItem) => 
        `${quantity} ${record.unit || '개'}`,
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => category ? <Tag color="blue">{category}</Tag> : '-',
    },
    {
      title: '유통기한',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string, record: IngredientItem) => {
        const expiryDate = new Date(date);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return <Tag color="red">만료됨 ({Math.abs(diffDays)}일 전)</Tag>;
        } else if (diffDays <= 3) {
          return <Tag color="orange">임박 ({diffDays}일 후)</Tag>;
        } else if (diffDays <= 7) {
          return <Tag color="yellow">주의 ({diffDays}일 후)</Tag>;
        } else {
          return <Tag color="green">{diffDays}일 후</Tag>;
        }
      },
    },
    {
      title: '상태',
      key: 'status',
      render: (_: any, record: IngredientItem) => {
        if (record.isExpiring) {
          return (
            <Space>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              <span style={{ color: '#ff4d4f' }}>유통기한 임박</span>
            </Space>
          );
        } else {
          return (
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <span style={{ color: '#52c41a' }}>양호</span>
            </Space>
          );
        }
      },
    },
  ];

  return (
    <div>
      <Title level={2}>재료 관리</Title>
      <Paragraph>
        보유한 식재료의 유통기한을 관리하고 임박한 재료를 확인하세요.
      </Paragraph>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="총 재료 수"
              value={ingredients.length}
              suffix="종"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="유통기한 임박"
              value={expiringCount}
              suffix="종"
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="양호한 재료"
              value={ingredients.length - expiringCount}
              suffix="종"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Alert for expiring ingredients */}
      {expiringCount > 0 && (
        <Alert
          message="유통기한 임박 알림"
          description={`${expiringCount}개의 재료가 7일 이내에 유통기한이 만료됩니다. 빠른 소비를 권장합니다.`}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Ingredients Table */}
      <Card title="재료 목록">
        <Table
          columns={columns}
          dataSource={ingredients}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} / 총 ${total}개`,
          }}
        />
      </Card>

      {/* Tips */}
      <Card title="재료 관리 팁" style={{ marginTop: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <ClockCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            <strong>유통기한 체크:</strong> 정기적으로 냉장고와 냉동고를 확인하여 유통기한이 임박한 재료를 우선 사용하세요.
          </div>
          <div>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <strong>적절한 보관:</strong> 각 재료의 특성에 맞는 온도와 습도에서 보관하여 신선도를 유지하세요.
          </div>
          <div>
            <ExclamationCircleOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
            <strong>레시피 활용:</strong> 유통기한이 임박한 재료를 활용한 레시피를 찾아 음식물 쓰레기를 줄이세요.
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default IngredientManagementPage;
