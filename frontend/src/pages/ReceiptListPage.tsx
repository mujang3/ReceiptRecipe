import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Typography, 
  Space, 
  Input, 
  DatePicker, 
  Row,
  Col,
  message,
  Statistic
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  EyeOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined 
} from '@ant-design/icons';
import { receiptApi } from '../services/api';
import { Receipt, ReceiptSearchParams } from '../types';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ReceiptListPage: React.FC = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<ReceiptSearchParams>({
    page: 0,
    size: 10
  });

  // 통계 계산
  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);
  const totalIngredients = receipts.reduce((sum, receipt) => 
    sum + (receipt.items?.filter(item => item.isIngredient).length || 0), 0);
  const averageAmount = receipts.length > 0 ? totalAmount / receipts.length : 0;

  const columns = [
    {
      title: '상점명',
      dataIndex: 'storeName',
      key: 'storeName',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '구매일',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (date: string) => new Date(date).toLocaleDateString('ko-KR'),
    },
    {
      title: '총액',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `₩${amount.toLocaleString()}`,
    },
    {
      title: '품목 수',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: '식재료 수',
      dataIndex: 'items',
      key: 'ingredients',
      render: (items: any[]) => items?.filter(item => item.isIngredient).length || 0,
    },
    {
      title: '작업',
      key: 'actions',
      render: (_: any, record: Receipt) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewReceipt(record.id)}
          >
            보기
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteReceipt(record.id)}
          >
            삭제
          </Button>
        </Space>
      ),
    },
  ];

  const loadReceipts = async () => {
    setLoading(true);
    try {
      // 더미 데이터 생성
      const dummyReceipts = generateDummyReceipts();
      setReceipts(dummyReceipts);
    } catch (error) {
      console.error('영수증 로딩 오류:', error);
      message.error('영수증 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const generateDummyReceipts = (): Receipt[] => {
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

    const receipts: Receipt[] = [];
    
    for (let i = 0; i < 50; i++) {
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
      let ingredientCount = 0;
      
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
      
      receipts.push({
        id: i + 1,
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
      });
    }
    
    return receipts.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  };

  useEffect(() => {
    loadReceipts();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewReceipt = (id: number) => {
    navigate(`/receipts/${id}`);
  };

  const handleDeleteReceipt = async (id: number) => {
    try {
      await receiptApi.deleteReceipt(id);
      message.success('영수증이 삭제되었습니다.');
      loadReceipts();
    } catch (error) {
      message.error('영수증 삭제에 실패했습니다.');
    }
  };

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, keyword: value, page: 0 }));
  };

  return (
    <div>
      <Title level={2}>영수증 목록</Title>
      
      {/* 통계 카드 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 영수증 수"
              value={receipts.length}
              suffix="개"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 구매액"
              value={totalAmount}
              prefix="₩"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="평균 구매액"
              value={averageAmount}
              prefix="₩"
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => Math.round(value as number).toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="총 식재료 수"
              value={totalIngredients}
              suffix="개"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="상점명 또는 키워드 검색"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker 
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates) {
                  setSearchParams(prev => ({
                    ...prev,
                    startDate: dates[0]?.toISOString(),
                    endDate: dates[1]?.toISOString(),
                    page: 0
                  }));
                }
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button 
              icon={<FilterOutlined />}
              onClick={loadReceipts}
            >
              필터 적용
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={receipts}
          loading={loading}
          rowKey="id"
          pagination={{
            current: (searchParams.page || 0) + 1,
            pageSize: searchParams.size || 10,
            onChange: (page, size) => {
              setSearchParams(prev => ({
                ...prev,
                page: page - 1,
                size: size
              }));
            },
          }}
        />
      </Card>
    </div>
  );
};

export default ReceiptListPage;
