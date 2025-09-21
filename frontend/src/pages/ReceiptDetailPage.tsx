import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Typography, 
  Space, 
  Row,
  Col,
  Tag,
  Statistic,
  Badge,
  message,
  Spin
} from 'antd';
import { 
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  TagOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Receipt } from '../types';

const { Title, Text } = Typography;

const ReceiptDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadReceiptDetail(parseInt(id));
    }
  }, [id]);

  const loadReceiptDetail = async (receiptId: number) => {
    setLoading(true);
    try {
      // 더미 데이터에서 해당 영수증 찾기
      const dummyReceipt = generateDummyReceipt(receiptId);
      setReceipt(dummyReceipt);
    } catch (error) {
      console.error('영수증 상세 로딩 오류:', error);
      message.error('영수증 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const generateDummyReceipt = (receiptId: number): Receipt => {
    // 영수증 목록 페이지와 동일한 더미 데이터 생성 로직
    const stores = [
      '이마트', '롯데마트', '홈플러스', '코스트코', '농협하나로마트', '이마트24',
      'GS25', 'CU', '세븐일레븐', '미니스톱', '이마트24', '세븐일레븐',
      '올리브영', '다이소', '롯데슈퍼', '하나로클럽', '이마트 트레이더스',
      '코스트코', '메가마트', '롯데마트', '홈플러스 익스프레스', '이마트',
      '농협하나로마트', 'GS25', 'CU', '세븐일레븐', '미니스톱',
      '올리브영', '다이소', '롯데슈퍼', '하나로클럽', '이마트 트레이더스'
    ];

    const items = [
      // 채소류
      { name: '양파', category: '채소', isIngredient: true, price: 2500 },
      { name: '당근', category: '채소', isIngredient: true, price: 1800 },
      { name: '감자', category: '채소', isIngredient: true, price: 3200 },
      { name: '마늘', category: '채소', isIngredient: true, price: 4500 },
      { name: '생강', category: '채소', isIngredient: true, price: 2800 },
      { name: '대파', category: '채소', isIngredient: true, price: 1500 },
      { name: '양상추', category: '채소', isIngredient: true, price: 2200 },
      { name: '토마토', category: '채소', isIngredient: true, price: 3500 },
      { name: '오이', category: '채소', isIngredient: true, price: 2000 },
      { name: '브로콜리', category: '채소', isIngredient: true, price: 2800 },
      { name: '시금치', category: '채소', isIngredient: true, price: 1200 },
      { name: '배추', category: '채소', isIngredient: true, price: 4500 },
      { name: '무', category: '채소', isIngredient: true, price: 1800 },
      { name: '고구마', category: '채소', isIngredient: true, price: 3200 },
      { name: '버섯', category: '채소', isIngredient: true, price: 2800 },
      { name: '호박', category: '채소', isIngredient: true, price: 2800 },
      { name: '가지', category: '채소', isIngredient: true, price: 1800 },
      { name: '피망', category: '채소', isIngredient: true, price: 2500 },
      { name: '고추', category: '채소', isIngredient: true, price: 2000 },
      { name: '상추', category: '채소', isIngredient: true, price: 1500 },
      
      // 과일류
      { name: '사과', category: '과일', isIngredient: true, price: 4500 },
      { name: '바나나', category: '과일', isIngredient: true, price: 2500 },
      { name: '오렌지', category: '과일', isIngredient: true, price: 3800 },
      { name: '딸기', category: '과일', isIngredient: true, price: 5500 },
      { name: '포도', category: '과일', isIngredient: true, price: 6500 },
      { name: '복숭아', category: '과일', isIngredient: true, price: 4500 },
      { name: '배', category: '과일', isIngredient: true, price: 3800 },
      { name: '레몬', category: '과일', isIngredient: true, price: 2800 },
      { name: '아보카도', category: '과일', isIngredient: true, price: 3500 },
      { name: '블루베리', category: '과일', isIngredient: true, price: 8500 },
      
      // 육류/해산물
      { name: '닭고기', category: '육류', isIngredient: true, price: 8500 },
      { name: '돼지고기', category: '육류', isIngredient: true, price: 12000 },
      { name: '소고기', category: '육류', isIngredient: true, price: 25000 },
      { name: '생선', category: '해산물', isIngredient: true, price: 15000 },
      { name: '새우', category: '해산물', isIngredient: true, price: 18000 },
      { name: '오징어', category: '해산물', isIngredient: true, price: 12000 },
      { name: '문어', category: '해산물', isIngredient: true, price: 15000 },
      
      // 유제품
      { name: '계란', category: '유제품', isIngredient: true, price: 6000 },
      { name: '우유', category: '유제품', isIngredient: true, price: 3500 },
      { name: '요거트', category: '유제품', isIngredient: true, price: 2800 },
      { name: '치즈', category: '유제품', isIngredient: true, price: 4500 },
      { name: '버터', category: '유제품', isIngredient: true, price: 3800 },
      { name: '두부', category: '유제품', isIngredient: true, price: 1800 },
      { name: '순두부', category: '유제품', isIngredient: true, price: 2200 },
      
      // 곡물/면류
      { name: '쌀', category: '곡물', isIngredient: true, price: 25000 },
      { name: '밀가루', category: '곡물', isIngredient: true, price: 3500 },
      { name: '파스타', category: '곡물', isIngredient: true, price: 2800 },
      { name: '라면', category: '곡물', isIngredient: true, price: 1200 },
      { name: '빵', category: '곡물', isIngredient: true, price: 3000 },
      { name: '떡', category: '곡물', isIngredient: true, price: 4000 },
      
      // 조미료/양념
      { name: '간장', category: '조미료', isIngredient: true, price: 4500 },
      { name: '고춧가루', category: '조미료', isIngredient: true, price: 3200 },
      { name: '설탕', category: '조미료', isIngredient: true, price: 2800 },
      { name: '소금', category: '조미료', isIngredient: true, price: 1500 },
      { name: '식용유', category: '조미료', isIngredient: true, price: 4500 },
      { name: '올리브오일', category: '조미료', isIngredient: true, price: 12000 },
      { name: '참기름', category: '조미료', isIngredient: true, price: 8500 },
      { name: '들기름', category: '조미료', isIngredient: true, price: 12000 },
      { name: '된장', category: '조미료', isIngredient: true, price: 3500 },
      { name: '고춧장', category: '조미료', isIngredient: true, price: 2800 },
      { name: '김치', category: '조미료', isIngredient: true, price: 8000 },
      { name: '멸치', category: '조미료', isIngredient: true, price: 12000 },
      { name: '다시마', category: '조미료', isIngredient: true, price: 8000 },
      { name: '미역', category: '조미료', isIngredient: true, price: 5000 },
      { name: '김', category: '조미료', isIngredient: true, price: 3000 },
      
      // 나물류
      { name: '콩나물', category: '나물', isIngredient: true, price: 1200 },
      { name: '숙주', category: '나물', isIngredient: true, price: 1500 },
      { name: '고사리', category: '나물', isIngredient: true, price: 8500 },
      { name: '도라지', category: '나물', isIngredient: true, price: 12000 },
      { name: '취나물', category: '나물', isIngredient: true, price: 4500 },
      { name: '시래기', category: '나물', isIngredient: true, price: 3500 },
      
      // 버섯류
      { name: '팽이버섯', category: '버섯', isIngredient: true, price: 1800 },
      { name: '표고버섯', category: '버섯', isIngredient: true, price: 2800 },
      { name: '느타리버섯', category: '버섯', isIngredient: true, price: 2200 },
      { name: '새송이버섯', category: '버섯', isIngredient: true, price: 3500 },
      
      // 허브류
      { name: '바질', category: '허브', isIngredient: true, price: 1500 },
      { name: '로즈마리', category: '허브', isIngredient: true, price: 1800 },
      { name: '타임', category: '허브', isIngredient: true, price: 2000 },
      { name: '오레가노', category: '허브', isIngredient: true, price: 2200 },
      { name: '파슬리', category: '허브', isIngredient: true, price: 1500 },
      { name: '딜', category: '허브', isIngredient: true, price: 1800 },
      { name: '민트', category: '허브', isIngredient: true, price: 1500 },
      { name: '고수', category: '허브', isIngredient: true, price: 1200 },
      
      // 생활용품
      { name: '휴지', category: '생활용품', isIngredient: false, price: 8000 },
      { name: '세제', category: '생활용품', isIngredient: false, price: 12000 },
      { name: '샴푸', category: '생활용품', isIngredient: false, price: 15000 },
      { name: '비누', category: '생활용품', isIngredient: false, price: 3000 },
      { name: '치약', category: '생활용품', isIngredient: false, price: 5000 },
      { name: '칫솔', category: '생활용품', isIngredient: false, price: 2000 },
      { name: '수건', category: '생활용품', isIngredient: false, price: 8000 },
      { name: '세탁비누', category: '생활용품', isIngredient: false, price: 4000 },
      { name: '주방세제', category: '생활용품', isIngredient: false, price: 6000 },
      { name: '스펀지', category: '생활용품', isIngredient: false, price: 2000 },
      { name: '쓰레기봉투', category: '생활용품', isIngredient: false, price: 5000 },
      { name: '물티슈', category: '생활용품', isIngredient: false, price: 3000 },
      { name: '화장지', category: '생활용품', isIngredient: false, price: 4000 },
      { name: '면봉', category: '생활용품', isIngredient: false, price: 2000 },
      { name: '면화', category: '생활용품', isIngredient: false, price: 3000 },
      
      // 기타
      { name: '건전지', category: '기타', isIngredient: false, price: 5000 },
      { name: '테이프', category: '기타', isIngredient: false, price: 2000 },
      { name: '가위', category: '기타', isIngredient: false, price: 3000 },
      { name: '볼펜', category: '기타', isIngredient: false, price: 1000 },
      { name: '노트', category: '기타', isIngredient: false, price: 2000 },
      { name: '포장지', category: '기타', isIngredient: false, price: 3000 },
      { name: '비닐봉지', category: '기타', isIngredient: false, price: 1000 },
      { name: '알루미늄호일', category: '기타', isIngredient: false, price: 4000 },
      { name: '랩', category: '기타', isIngredient: false, price: 3000 },
      { name: '지퍼백', category: '기타', isIngredient: false, price: 2000 }
    ];

    const store = stores[Math.floor(Math.random() * stores.length)];
    const purchaseDate = new Date();
    purchaseDate.setDate(purchaseDate.getDate() - Math.floor(Math.random() * 30)); // 최근 30일 내
    
    // 상점 유형에 따른 품목 수 결정
    let itemCount;
    if (store.includes('이마트') || store.includes('롯데마트') || store.includes('홈플러스') || 
        store.includes('코스트코') || store.includes('하나로마트') || store.includes('메가마트')) {
      // 대형마트: 8-20개 품목
      itemCount = 8 + Math.floor(Math.random() * 13);
    } else if (store.includes('GS25') || store.includes('CU') || store.includes('세븐일레븐') || store.includes('미니스톱')) {
      // 편의점: 2-8개 품목
      itemCount = 2 + Math.floor(Math.random() * 7);
    } else {
      // 기타: 3-12개 품목
      itemCount = 3 + Math.floor(Math.random() * 10);
    }
    
    const receiptItems = [];
      let totalAmount = 0;
    
    // 상점 유형에 따른 품목 선택 확률 조정
    const isLargeMart = store.includes('이마트') || store.includes('롯데마트') || 
                       store.includes('홈플러스') || store.includes('코스트코') || 
                       store.includes('하나로마트') || store.includes('메가마트');
    
    for (let j = 0; j < itemCount; j++) {
      let item;
      if (isLargeMart) {
        // 대형마트: 식재료 비중 높게 (70% 식재료, 30% 생활용품)
        const isIngredient = Math.random() < 0.7;
        const ingredientItems = items.filter(i => i.isIngredient);
        const nonIngredientItems = items.filter(i => !i.isIngredient);
        item = isIngredient ? 
          ingredientItems[Math.floor(Math.random() * ingredientItems.length)] :
          nonIngredientItems[Math.floor(Math.random() * nonIngredientItems.length)];
      } else {
        // 편의점/기타: 모든 품목 동일 확률
        item = items[Math.floor(Math.random() * items.length)];
      }
      
      const quantity = 1 + Math.floor(Math.random() * 3); // 1-3개
      const itemTotal = item.price * quantity;
      
      receiptItems.push({
        id: j + 1,
        itemName: item.name,
        quantity: quantity,
        unitPrice: item.price,
        totalPrice: itemTotal,
        category: item.category,
        isIngredient: item.isIngredient,
        expiryDate: item.isIngredient ? 
          new Date(purchaseDate.getTime() + (1 + Math.floor(Math.random() * 30)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
          undefined
      });
      
        totalAmount += itemTotal;
    }
    
    return {
      id: receiptId,
      storeName: store,
      totalAmount: totalAmount,
      purchaseDate: purchaseDate.toISOString(),
      createdAt: purchaseDate.toISOString(),
      updatedAt: purchaseDate.toISOString(),
      rawOcrText: `OCR 텍스트: ${store}에서 ${totalAmount.toLocaleString()}원 구매`,
      items: receiptItems.map(item => ({
        ...item,
        receipt: null
      }))
    };
  };

  const columns = [
    {
      title: '상품명',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text: string, record: any) => (
        <Space>
          <Text strong={record.isIngredient}>{text}</Text>
          {record.isIngredient && <Tag color="green" icon={<TagOutlined />}>식재료</Tag>}
        </Space>
      ),
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => `${quantity}개`,
    },
    {
      title: '단가',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `₩${price.toLocaleString()}`,
    },
    {
      title: '총가격',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => <Text strong>₩{price.toLocaleString()}</Text>,
    },
    {
      title: '유통기한',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string, record: any) => {
        if (!record.isIngredient || !date) return '-';
        const expiryDate = new Date(date);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          return <Tag color="red">만료됨 ({Math.abs(diffDays)}일 전)</Tag>;
        } else if (diffDays <= 7) {
          return <Tag color="orange">{diffDays}일 남음</Tag>;
        } else {
          return <Tag color="green">{diffDays}일 남음</Tag>;
        }
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>영수증 상세 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>영수증을 찾을 수 없습니다</Title>
        <Button type="primary" onClick={() => navigate('/receipts')}>
          영수증 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const ingredientItems = receipt.items?.filter(item => item.isIngredient) || [];
  const nonIngredientItems = receipt.items?.filter(item => !item.isIngredient) || [];
  const ingredientTotal = ingredientItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const nonIngredientTotal = nonIngredientItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/receipts')}
          style={{ marginBottom: '16px' }}
        >
          영수증 목록으로 돌아가기
        </Button>
        <Title level={2}>
          <ShoppingCartOutlined style={{ marginRight: '8px' }} />
          영수증 상세 정보
        </Title>
      </div>

      {/* 영수증 기본 정보 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="상점명"
              value={receipt.storeName}
              prefix={<ShoppingCartOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="구매일"
              value={new Date(receipt.purchaseDate).toLocaleDateString('ko-KR')}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="총 구매액"
              value={receipt.totalAmount}
              prefix="₩"
              formatter={(value) => value?.toLocaleString()}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="총 품목 수"
              value={receipt.items?.length || 0}
              suffix="개"
            />
          </Col>
        </Row>
      </Card>

      {/* 구매 품목 분석 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ color: '#52c41a', margin: 0 }}>
                {ingredientItems.length}
              </Title>
              <Text type="secondary">식재료</Text>
              <div style={{ marginTop: '8px' }}>
                <Text strong>₩{ingredientTotal.toLocaleString()}</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
                {nonIngredientItems.length}
              </Title>
              <Text type="secondary">생활용품</Text>
              <div style={{ marginTop: '8px' }}>
                <Text strong>₩{nonIngredientTotal.toLocaleString()}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 식재료 목록 */}
      {ingredientItems.length > 0 && (
        <Card 
          title={
            <Space>
              <TagOutlined />
              <span>식재료 목록</span>
              <Badge count={ingredientItems.length} style={{ backgroundColor: '#52c41a' }} />
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Table
            columns={columns}
            dataSource={ingredientItems}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* 생활용품 목록 */}
      {nonIngredientItems.length > 0 && (
        <Card 
          title={
            <Space>
              <ShoppingCartOutlined />
              <span>생활용품 목록</span>
              <Badge count={nonIngredientItems.length} style={{ backgroundColor: '#1890ff' }} />
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Table
            columns={columns.filter(col => col.key !== 'expiryDate')} // 유통기한 컬럼 제외
            dataSource={nonIngredientItems}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* OCR 텍스트 */}
      <Card title="OCR 원본 텍스트">
        <Text type="secondary" style={{ fontFamily: 'monospace' }}>
          {receipt.rawOcrText}
        </Text>
      </Card>
    </div>
  );
};

export default ReceiptDetailPage;

