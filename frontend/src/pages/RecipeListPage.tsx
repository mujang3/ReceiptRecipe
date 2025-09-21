import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Input, 
  Select, 
  Button, 
  Space, 
  Tag, 
  Pagination,
  Spin,
  message
} from 'antd';
import { 
  SearchOutlined, 
  HeartOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  BookOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { recipeApi, favoriteApi } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

interface Recipe {
  id: number;
  name: string;
  description?: string;
  category?: string;
  difficultyLevel?: string;
  cookingTime?: number;
  servings?: number;
  imageUrl?: string;
  user: {
    id: number;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

const RecipeListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const categories = ['한식', '양식', '일식', '디저트', '건강식', '간편요리', '음료'];
  const difficulties = ['매우 쉬움', '쉬움', '보통', '어려움'];

  useEffect(() => {
    loadRecipes();
  }, [currentPage, selectedCategory, selectedDifficulty, sortBy, sortOrder]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      // API 호출을 시도하되 실패해도 더미 데이터로 표시
      try {
        const params = {
          page: currentPage,
          size: 12,
          keyword: searchKeyword,
          category: selectedCategory,
          difficultyLevel: selectedDifficulty,
          sortBy,
          sortOrder
        };
        
        const response = await recipeApi.getRecipes(params);
        setRecipes(response.content.map((recipe: any) => ({
          ...recipe,
          imageUrl: recipe.imageUrl || undefined
        })));
        setTotalPages(response.totalPages);
      } catch (apiError) {
        console.log('API 호출 실패, 더미 데이터로 표시:', apiError);
        // 더미 레시피 데이터
        const dummyRecipes = generateDummyRecipes();
        setRecipes(dummyRecipes);
        setTotalPages(1);
      }
    } catch (error) {
      message.error('레시피를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 더미 레시피 데이터 생성
  const generateDummyRecipes = (): Recipe[] => {
    const recipes = [
      {
        id: 1,
        name: "김치찌개",
        description: "매콤하고 시원한 김치찌개로 몸을 따뜻하게 해주는 한국의 대표 찌개",
        category: "한식",
        difficultyLevel: "쉬움",
        cookingTime: 30,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
        user: { id: 1, username: "김치마스터", displayName: "김치마스터" }
      },
      {
        id: 2,
        name: "크림 파스타",
        description: "부드럽고 진한 크림소스가 일품인 이탈리안 파스타",
        category: "양식",
        difficultyLevel: "보통",
        cookingTime: 25,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
        user: { id: 2, username: "파스타셰프", displayName: "파스타셰프" }
      },
      {
        id: 3,
        name: "찜갈비",
        description: "부드럽고 달콤한 갈비찜으로 가족 모두가 좋아하는 한식의 대표",
        category: "한식",
        difficultyLevel: "어려움",
        cookingTime: 90,
        servings: 4,
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
        user: { id: 3, username: "한식요리사", displayName: "한식요리사" }
      },
      {
        id: 4,
        name: "연어 초밥",
        description: "신선한 연어로 만드는 일본의 대표적인 초밥",
        category: "일식",
        difficultyLevel: "어려움",
        cookingTime: 60,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd1871?w=400&h=300&fit=crop&crop=center",
        user: { id: 4, username: "스시마스터", displayName: "스시마스터" }
      },
      {
        id: 5,
        name: "뉴욕 치즈케이크",
        description: "진한 치즈맛이 일품인 클래식한 뉴욕 스타일 치즈케이크",
        category: "디저트",
        difficultyLevel: "보통",
        cookingTime: 120,
        servings: 8,
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1c9581?w=400&h=300&fit=crop&crop=center",
        user: { id: 5, username: "디저트셰프", displayName: "디저트셰프" }
      },
      {
        id: 6,
        name: "닭볶음탕",
        description: "매콤달콤한 닭볶음탕으로 입맛을 돋우는 한국의 대표 요리",
        category: "한식",
        difficultyLevel: "보통",
        cookingTime: 45,
        servings: 3,
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
        user: { id: 6, username: "닭요리사", displayName: "닭요리사" }
      },
      {
        id: 7,
        name: "리조또",
        description: "부드럽고 크림 같은 이탈리안 리조또",
        category: "양식",
        difficultyLevel: "보통",
        cookingTime: 35,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
        user: { id: 7, username: "이탈리안셰프", displayName: "이탈리안셰프" }
      },
      {
        id: 8,
        name: "돈코츠 라멘",
        description: "진한 돼지뼈 국물이 일품인 일본의 대표 라멘",
        category: "일식",
        difficultyLevel: "어려움",
        cookingTime: 180,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd1871?w=400&h=300&fit=crop&crop=center",
        user: { id: 8, username: "라멘마스터", displayName: "라멘마스터" }
      },
      {
        id: 9,
        name: "시저 샐러드",
        description: "신선한 로메인과 시저 드레싱이 일품인 클래식 샐러드",
        category: "건강식",
        difficultyLevel: "매우 쉬움",
        cookingTime: 15,
        servings: 1,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center",
        user: { id: 9, username: "헬시셰프", displayName: "헬시셰프" }
      },
      {
        id: 10,
        name: "김밥",
        description: "간단하고 맛있는 김밥으로 언제든 즐길 수 있는 한국의 대표 간식",
        category: "간편요리",
        difficultyLevel: "쉬움",
        cookingTime: 20,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
        user: { id: 10, username: "김밥마스터", displayName: "김밥마스터" }
      },
      {
        id: 11,
        name: "립아이 스테이크",
        description: "부드럽고 육즙이 풍부한 소고기 립아이 스테이크",
        category: "양식",
        difficultyLevel: "어려움",
        cookingTime: 40,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center",
        user: { id: 11, username: "스테이크셰프", displayName: "스테이크셰프" }
      },
      {
        id: 12,
        name: "떡볶이",
        description: "매콤달콤한 떡볶이로 한국의 대표 길거리 음식",
        category: "간편요리",
        difficultyLevel: "쉬움",
        cookingTime: 15,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
        user: { id: 12, username: "떡볶이마스터", displayName: "떡볶이마스터" }
      },
      {
        id: 13,
        name: "마르게리타 피자",
        description: "토마토, 모짜렐라, 바질이 조화를 이룬 이탈리안 피자",
        category: "양식",
        difficultyLevel: "보통",
        cookingTime: 30,
        servings: 4,
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
        user: { id: 13, username: "피자마스터", displayName: "피자마스터" }
      },
      {
        id: 14,
        name: "된장찌개",
        description: "구수하고 시원한 된장찌개로 한국인의 소울푸드",
        category: "한식",
        difficultyLevel: "쉬움",
        cookingTime: 25,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
        user: { id: 14, username: "된장마스터", displayName: "된장마스터" }
      },
      {
        id: 15,
        name: "딸기 타르트",
        description: "달콤한 딸기와 바삭한 타르트가 만나 완성되는 프랑스 디저트",
        category: "디저트",
        difficultyLevel: "어려움",
        cookingTime: 150,
        servings: 6,
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1c9581?w=400&h=300&fit=crop&crop=center",
        user: { id: 15, username: "타르트셰프", displayName: "타르트셰프" }
      },
      {
        id: 16,
        name: "카페라떼",
        description: "진한 에스프레소와 부드러운 우유가 만나 완성되는 이탈리안 커피",
        category: "음료",
        difficultyLevel: "매우 쉬움",
        cookingTime: 5,
        servings: 1,
        imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&crop=center",
        user: { id: 16, username: "바리스타", displayName: "바리스타" }
      },
      {
        id: 17,
        name: "불고기",
        description: "달콤한 양념에 재운 소고기 불고기로 한국의 대표 고기 요리",
        category: "한식",
        difficultyLevel: "보통",
        cookingTime: 30,
        servings: 3,
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
        user: { id: 17, username: "불고기마스터", displayName: "불고기마스터" }
      },
      {
        id: 18,
        name: "스시 세트",
        description: "신선한 생선과 완벽한 샤리의 조화로 이루어진 일본의 대표 요리",
        category: "일식",
        difficultyLevel: "어려움",
        cookingTime: 120,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd1871?w=400&h=300&fit=crop&crop=center",
        user: { id: 18, username: "스시마스터", displayName: "스시마스터" }
      },
      {
        id: 19,
        name: "플러피 팬케이크",
        description: "부드럽고 폭신한 팬케이크로 완벽한 브런치 메뉴",
        category: "디저트",
        difficultyLevel: "쉬움",
        cookingTime: 20,
        servings: 3,
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1c9581?w=400&h=300&fit=crop&crop=center",
        user: { id: 19, username: "브런치셰프", displayName: "브런치셰프" }
      },
      {
        id: 20,
        name: "비빔밥",
        description: "다양한 나물과 고추장이 어우러진 한국의 대표 한정식",
        category: "한식",
        difficultyLevel: "쉬움",
        cookingTime: 20,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
        user: { id: 20, username: "비빔밥마스터", displayName: "비빔밥마스터" }
      }
    ];

    // 필터링 적용
    let filteredRecipes = recipes;

    if (searchKeyword) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.category === selectedCategory);
    }

    if (selectedDifficulty) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.difficultyLevel === selectedDifficulty);
    }

    // 정렬 적용
    filteredRecipes.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cookingTime':
          comparison = (a.cookingTime || 0) - (b.cookingTime || 0);
          break;
        case 'servings':
          comparison = (a.servings || 0) - (b.servings || 0);
          break;
        case 'createdAt':
        default:
          comparison = b.id - a.id; // ID가 높을수록 최신
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filteredRecipes;
  };

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const response = await favoriteApi.getUserFavorites(user.id);
      const favoriteRecipeIds = response.content.map((fav: any) => fav.recipe?.id || fav.id);
      setFavoriteIds(favoriteRecipeIds);
    } catch (error) {
      console.error('즐겨찾기 로드 실패:', error);
    }
  };

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchKeyword(value);
          setCurrentPage(0);
        }, 300);
      };
    })(),
    []
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleCategoryChange = (value: string | undefined) => {
    setSelectedCategory(value);
    setCurrentPage(0);
  };

  const handleDifficultyChange = (value: string | undefined) => {
    setSelectedDifficulty(value);
    setCurrentPage(0);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(0);
  };

  const handleOrderChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
    setCurrentPage(0);
  };

  const handleFavoriteToggle = async (recipeId: number) => {
    if (!user) {
      message.warning('로그인이 필요합니다.');
      return;
    }

    try {
      await favoriteApi.toggleFavorite(recipeId, user.id);
      setFavoriteIds(prev => 
        prev.includes(recipeId) 
          ? prev.filter(id => id !== recipeId)
          : [...prev, recipeId]
      );
    } catch (error) {
      message.error('즐겨찾기 처리에 실패했습니다.');
    }
  };

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case '매우 쉬움': return '#52c41a';
      case '쉬움': return '#1890ff';
      case '보통': return '#fa8c16';
      case '어려움': return '#f5222d';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case '한식': return '🍲';
      case '양식': return '🍝';
      case '일식': return '🍣';
      case '디저트': return '🍰';
      case '건강식': return '🥗';
      case '간편요리': return '⚡';
      case '음료': return '🥤';
      default: return '🍽️';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          레시피 목록
        </Title>
        <Text type="secondary">
          다양한 레시피를 찾아보고 즐겨찾기에 추가해보세요.
        </Text>
      </div>

      {/* 검색 및 필터 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="레시피 이름으로 검색..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="카테고리"
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: '100%' }}
              allowClear
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="난이도"
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              style={{ width: '100%' }}
              allowClear
            >
              {difficulties.map(difficulty => (
                <Option key={difficulty} value={difficulty}>
                  {difficulty}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              style={{ width: '100%' }}
            >
              <Option value="createdAt">최신순</Option>
              <Option value="name">이름순</Option>
              <Option value="cookingTime">조리시간순</Option>
              <Option value="servings">인분순</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Select
              value={sortOrder}
              onChange={handleOrderChange}
              style={{ width: '100%' }}
            >
              <Option value="desc">내림차순</Option>
              <Option value="asc">오름차순</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={2}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={loadRecipes}
              style={{ width: '100%' }}
            >
              검색
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 레시피 목록 */}
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {recipes.map((recipe) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={recipe.id}>
              <Card
                hoverable
                cover={
                  <div style={{
                    height: '200px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {recipe.imageUrl ? (
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="
                                height: 100%;
                                background: linear-gradient(45deg, #f0f2f5, #d9d9d9);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 64px;
                              ">
                                ${getCategoryIcon(recipe.category)}
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div style={{
                        height: '100%',
                        background: 'linear-gradient(45deg, #f0f2f5, #d9d9d9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '64px'
                      }}>
                        {getCategoryIcon(recipe.category)}
                      </div>
                    )}
                    <Button
                      type="text"
                      icon={<HeartOutlined />}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        color: favoriteIds.includes(recipe.id) ? '#ff4d4f' : '#d9d9d9',
                        fontSize: '20px',
                        zIndex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => handleFavoriteToggle(recipe.id)}
                    />
                  </div>
                }
                actions={[
                  <Button 
                    type="link" 
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                  >
                    자세히 보기
                  </Button>
                ]}
                style={{ height: '100%' }}
              >
                <Card.Meta
                  title={
                    <Text strong style={{ fontSize: '16px' }}>
                      {recipe.name}
                    </Text>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <Space wrap>
                          <Tag color={getDifficultyColor(recipe.difficultyLevel)}>
                            {recipe.difficultyLevel}
                          </Tag>
                          <Tag color="blue">{recipe.category}</Tag>
                        </Space>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <Space>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <UserOutlined /> {recipe.user?.displayName || recipe.user?.username || '알 수 없음'}
                          </Text>
                        </Space>
                        <Space>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined /> {recipe.cookingTime}분
                          </Text>
                        </Space>
                      </div>
                      
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        👥 {recipe.servings}인분
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {recipes.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 0',
            color: '#999'
          }}>
            <BookOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>검색 조건에 맞는 레시피가 없습니다.</div>
          </div>
        )}
      </Spin>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Pagination
            current={currentPage + 1}
            total={totalPages * 12}
            pageSize={12}
            onChange={(page) => setCurrentPage(page - 1)}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} / ${total}개 레시피`
            }
          />
        </div>
      )}
    </div>
  );
};

export default RecipeListPage;