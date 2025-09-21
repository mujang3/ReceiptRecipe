import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  List, 
  Tag, 
  Space, 
  Button, 
  message,
  Spin,
  Divider,
  Rate,
  Input,
  Modal,
  Form,
  Avatar
} from 'antd';

import { 
  UserOutlined, 
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  CopyOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeApi, favoriteApi, ratingApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

import { Recipe } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratings, setRatings] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState<any>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingForm] = Form.useForm();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [useRecipeModalVisible, setUseRecipeModalVisible] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [missingIngredients, setMissingIngredients] = useState<any[]>([]);
  const [useRecipeForm] = Form.useForm();

  // 레시피 데이터 가져오기 함수
  const getRecipeById = (id: number) => {
    const recipes = {
      1: {
        name: "김치찌개",
        description: "매콤하고 시원한 김치찌개로 몸을 따뜻하게 해주는 한국의 대표 찌개",
        instructions: "1. 김치를 2cm 크기로 잘게 썬다\n2. 돼지고기를 기름에 볶아서 고기향을 낸다\n3. 김치를 넣고 5분간 볶아 김치의 신맛을 날린다\n4. 물 2컵을 넣고 끓인다\n5. 두부를 넣고 3분 더 끓인다\n6. 대파를 넣고 마지막에 마늘을 넣어 완성한다",
        cookingTime: 30,
        servings: 2,
        difficultyLevel: "EASY" as const,
        category: "한식",
        imageUrl: "https://picsum.photos/800/600?random=1",
        ingredients: [
          { id: 1, ingredientName: "김치", quantity: 2, unit: "컵", recipe: null },
          { id: 2, ingredientName: "돼지고기", quantity: 200, unit: "g", recipe: null },
          { id: 3, ingredientName: "두부", quantity: 1, unit: "모", recipe: null },
          { id: 4, ingredientName: "대파", quantity: 1, unit: "대", recipe: null },
          { id: 5, ingredientName: "마늘", quantity: 2, unit: "쪽", recipe: null },
          { id: 6, ingredientName: "고춧가루", quantity: 1, unit: "큰술", recipe: null },
          { id: 7, ingredientName: "간장", quantity: 1, unit: "큰술", recipe: null }
        ],
        tags: ["한식", "찌개", "김치", "따뜻한", "매운맛"]
      },
      2: {
        name: "크림 파스타",
        description: "부드럽고 진한 크림소스가 일품인 이탈리안 파스타",
        instructions: "1. 파스타를 소금물에 8분간 삶는다\n2. 베이컨을 바삭하게 볶는다\n3. 마늘을 넣고 향을 낸다\n4. 생크림을 넣고 끓인다\n5. 삶은 파스타를 넣고 섞는다\n6. 파마산 치즈를 뿌려 완성한다",
        cookingTime: 25,
        servings: 2,
        difficultyLevel: "MEDIUM" as const,
        category: "양식",
        imageUrl: "https://picsum.photos/800/600?random=2",
        ingredients: [
          { id: 1, ingredientName: "파스타", quantity: 200, unit: "g", recipe: null },
          { id: 2, ingredientName: "베이컨", quantity: 100, unit: "g", recipe: null },
          { id: 3, ingredientName: "생크림", quantity: 200, unit: "ml", recipe: null },
          { id: 4, ingredientName: "파마산치즈", quantity: 50, unit: "g", recipe: null },
          { id: 5, ingredientName: "마늘", quantity: 3, unit: "쪽", recipe: null },
          { id: 6, ingredientName: "양파", quantity: 0.5, unit: "개", recipe: null },
          { id: 7, ingredientName: "소금", quantity: 1, unit: "작은술", recipe: null }
        ],
        tags: ["양식", "파스타", "크림", "이탈리안", "부드러운"]
      },
      3: {
        name: "찜갈비",
        description: "부드럽고 달콤한 갈비찜으로 가족 모두가 좋아하는 한식의 대표",
        instructions: "1. 갈비를 찬물에 30분 담가 핏물을 제거한다\n2. 간장, 설탕, 마늘로 양념장을 만든다\n3. 갈비에 양념을 발라 1시간 재운다\n4. 냄비에 갈비와 양념을 넣고 끓인다\n5. 당근과 무를 넣고 40분 더 끓인다\n6. 대파를 넣고 마지막에 완성한다",
        cookingTime: 90,
        servings: 4,
        difficultyLevel: "HARD" as const,
        category: "한식",
        imageUrl: "https://picsum.photos/800/600?random=3",
        ingredients: [
          { id: 1, ingredientName: "갈비", quantity: 1, unit: "kg", recipe: null },
          { id: 2, ingredientName: "당근", quantity: 1, unit: "개", recipe: null },
          { id: 3, ingredientName: "무", quantity: 1, unit: "개", recipe: null },
          { id: 4, ingredientName: "간장", quantity: 5, unit: "큰술", recipe: null },
          { id: 5, ingredientName: "설탕", quantity: 3, unit: "큰술", recipe: null },
          { id: 6, ingredientName: "마늘", quantity: 5, unit: "쪽", recipe: null },
          { id: 7, ingredientName: "대파", quantity: 2, unit: "대", recipe: null },
          { id: 8, ingredientName: "생강", quantity: 1, unit: "조각", recipe: null }
        ],
        tags: ["한식", "갈비", "찜", "달콤한", "부드러운", "가족식사"]
      },
      4: {
        name: "연어 초밥",
        description: "신선한 연어로 만드는 일본의 대표적인 초밥",
        instructions: "1. 쌀을 깨끗이 씻어 밥을 짓는다\n2. 초밥 식초, 설탕, 소금으로 식초를 만든다\n3. 뜨거운 밥에 식초를 넣고 섞는다\n4. 연어를 초밥 크기로 자른다\n5. 밥을 손으로 모양을 잡는다\n6. 연어를 올려 초밥을 완성한다",
        cookingTime: 60,
        servings: 2,
        difficultyLevel: "HARD" as const,
        category: "일식",
        imageUrl: "https://picsum.photos/800/600?random=4",
        ingredients: [
          { id: 1, ingredientName: "쌀", quantity: 2, unit: "컵", recipe: null },
          { id: 2, ingredientName: "연어회", quantity: 200, unit: "g", recipe: null },
          { id: 3, ingredientName: "초밥식초", quantity: 3, unit: "큰술", recipe: null },
          { id: 4, ingredientName: "설탕", quantity: 1, unit: "큰술", recipe: null },
          { id: 5, ingredientName: "소금", quantity: 1, unit: "작은술", recipe: null },
          { id: 6, ingredientName: "와사비", quantity: 1, unit: "작은술", recipe: null },
          { id: 7, ingredientName: "간장", quantity: 2, unit: "큰술", recipe: null }
        ],
        tags: ["일식", "초밥", "연어", "신선한", "회", "일본요리"]
      },
      5: {
        name: "뉴욕 치즈케이크",
        description: "진한 치즈맛이 일품인 클래식한 뉴욕 스타일 치즈케이크",
        instructions: "1. 크래커를 으깨어 가루로 만든다\n2. 버터와 섞어 바닥을 만든다\n3. 크림치즈를 실온에 두어 부드럽게 한다\n4. 설탕과 계란을 넣고 섞는다\n5. 바닥에 크래커를 깔고 치즈 반죽을 넣는다\n6. 160도 오븐에서 1시간 굽는다",
        cookingTime: 120,
        servings: 8,
        difficultyLevel: "MEDIUM" as const,
        category: "디저트",
        imageUrl: "https://picsum.photos/800/600?random=5",
        ingredients: [
          { id: 1, ingredientName: "크림치즈", quantity: 500, unit: "g", recipe: null },
          { id: 2, ingredientName: "설탕", quantity: 100, unit: "g", recipe: null },
          { id: 3, ingredientName: "계란", quantity: 3, unit: "개", recipe: null },
          { id: 4, ingredientName: "크래커", quantity: 200, unit: "g", recipe: null },
          { id: 5, ingredientName: "버터", quantity: 100, unit: "g", recipe: null },
          { id: 6, ingredientName: "바닐라", quantity: 1, unit: "작은술", recipe: null },
          { id: 7, ingredientName: "레몬즙", quantity: 2, unit: "큰술", recipe: null }
        ],
        tags: ["디저트", "케이크", "치즈", "뉴욕", "클래식", "달콤한"]
      },
      1499: {
        name: "프리미엄 와규 스테이크",
        description: "최고급 와규 소고기로 만드는 프리미엄 스테이크로 특별한 날을 위한 완벽한 메인 요리",
        instructions: "1. 와규 스테이크를 상온에 1시간 두어 실온으로 만든다\n2. 소금과 후추로 간을 하고 올리브오일을 발라 30분 재운다\n3. 팬을 강불로 달궈서 스테이크를 넣는다\n4. 각 면을 2-3분씩 구워 겉면을 바삭하게 만든다\n5. 버터, 마늘, 로즈마리를 넣고 팬에 굴려가며 향을 입힌다\n6. 5분간 휴식시킨 후 슬라이스하여 완성한다",
        cookingTime: 45,
        servings: 2,
        difficultyLevel: "HARD" as const,
        category: "양식",
        imageUrl: "https://res.cloudinary.com/aaco/image/upload/w_1280,c_fill,q_auto,f_auto,g_auto/v1698481592/recipes/202309%20KR%20Production/Carrot%20Pur%C3%A9e%20Wagyu%20Bolar%20Blade%20Steak/20230913_expandk0309_uoo2d7.jpg",
        ingredients: [
          { id: 1, ingredientName: "와규 스테이크", quantity: 600, unit: "g", recipe: null },
          { id: 2, ingredientName: "소금", quantity: 2, unit: "큰술", recipe: null },
          { id: 3, ingredientName: "후추", quantity: 1, unit: "큰술", recipe: null },
          { id: 4, ingredientName: "올리브오일", quantity: 3, unit: "큰술", recipe: null },
          { id: 5, ingredientName: "버터", quantity: 100, unit: "g", recipe: null },
          { id: 6, ingredientName: "마늘", quantity: 4, unit: "쪽", recipe: null },
          { id: 7, ingredientName: "로즈마리", quantity: 3, unit: "줄기", recipe: null },
          { id: 8, ingredientName: "타임", quantity: 2, unit: "줄기", recipe: null },
          { id: 9, ingredientName: "와인", quantity: 100, unit: "ml", recipe: null },
          { id: 10, ingredientName: "소고기 육수", quantity: 200, unit: "ml", recipe: null }
        ],
        tags: ["양식", "스테이크", "와규", "프리미엄", "특별한날", "고급요리"]
      }
    };

    return recipes[id as keyof typeof recipes] || recipes[1];
  };

  const loadRecipe = async () => {
    if (!id) return;
    
    console.log('레시피 로딩 시작, ID:', id);
    setLoading(true);
    
    // API 호출 없이 바로 더미 데이터 사용
    try {
      const recipeData = getRecipeById(parseInt(id));
      console.log('더미 레시피 데이터:', recipeData);
      
      const mockRecipe = {
        id: parseInt(id),
        name: recipeData.name,
        description: recipeData.description,
        instructions: recipeData.instructions,
        cookingTime: recipeData.cookingTime,
        servings: recipeData.servings,
        difficultyLevel: recipeData.difficultyLevel,
        category: recipeData.category,
        imageUrl: recipeData.imageUrl,
        user: {
          id: 1,
          username: "요리사",
          displayName: "요리사",
          avatarUrl: "https://via.placeholder.com/40/1890ff/FFFFFF?text=요"
        },
        ingredients: recipeData.ingredients,
        tags: recipeData.tags,
        ratings: [],
        createdAt: "2025-01-20T10:30:00Z",
        updatedAt: "2025-01-20T10:30:00Z"
      };
      
      console.log('설정할 레시피 데이터:', mockRecipe);
      setRecipe(mockRecipe);
      
    } catch (error) {
      console.error('레시피 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async (recipeId: number) => {
    if (!user) return;
    
    try {
      const result = await favoriteApi.checkFavorite(recipeId, user.id);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('즐겨찾기 상태 확인 실패:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      message.warning('로그인이 필요합니다.');
      return;
    }

    if (!recipe) return;

    try {
      const result = await favoriteApi.toggleFavorite(recipe.id, user.id);
      setIsFavorite(result.isFavorite);
      message.success(result.message);
    } catch (error) {
      message.error('즐겨찾기 처리에 실패했습니다.');
    }
  };

  const loadRatings = async (recipeId: number) => {
    // 더미 평점 데이터 사용
    try {
      setRatings([]);
      setAverageRating(0);
      setRatingCount(0);
    } catch (error) {
      console.error('평점 정보 로드 실패:', error);
    }
  };

  const loadUserRating = async (recipeId: number) => {
    if (!user) return;
    
    try {
      const result = await ratingApi.getUserRatingForRecipe(recipeId, user.id);
      setUserRating(result.rating);
    } catch (error) {
      console.error('사용자 평점 로드 실패:', error);
    }
  };

  const handleRatingSubmit = async (values: any) => {
    if (!user || !recipe) return;

    try {
      await ratingApi.addOrUpdateRating(recipe.id, user.id, {
        rating: values.rating,
        comment: values.comment,
        isFavorite: values.isFavorite || false
      });
      
      message.success('평점이 저장되었습니다.');
      setRatingModalVisible(false);
      ratingForm.resetFields();
      
      // 평점 정보 다시 로드
      loadRatings(recipe.id);
      loadUserRating(recipe.id);
    } catch (error) {
      message.error('평점 저장에 실패했습니다.');
    }
  };

  const handleDeleteRating = async () => {
    if (!user || !recipe) return;

    try {
      await ratingApi.deleteRating(recipe.id, user.id);
      message.success('평점이 삭제되었습니다.');
      setUserRating(null);
      
      // 평점 정보 다시 로드
      loadRatings(recipe.id);
    } catch (error) {
      message.error('평점 삭제에 실패했습니다.');
    }
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      message.error('복사에 실패했습니다.');
    }
  };

  const shareToSocial = (platform: string) => {
    if (!recipe) return;
    
    const url = window.location.href;
    const title = recipe.name;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'kakao':
        // 카카오톡 공유는 별도 SDK가 필요하므로 링크 복사로 대체
        copyToClipboard(url);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // 더미 재료 데이터 생성 (레시피별로 맞춤 재료)
  const generateDummyIngredients = () => {
    const allIngredients = [
      { name: '김치', quantity: 2.5, unit: '컵', category: '채소', expiryDate: '2025-01-25' },
      { name: '돼지고기', quantity: 0.6, unit: 'kg', category: '육류', expiryDate: '2025-01-21' },
      { name: '두부', quantity: 2, unit: '모', category: '콩류', expiryDate: '2025-01-24' },
      { name: '대파', quantity: 3, unit: '대', category: '채소', expiryDate: '2025-01-26' },
      { name: '마늘', quantity: 0.3, unit: 'kg', category: '채소', expiryDate: '2025-02-05' },
      { name: '파스타', quantity: 1, unit: 'kg', category: '곡물', expiryDate: '2026-01-01' },
      { name: '베이컨', quantity: 0.3, unit: 'kg', category: '육류', expiryDate: '2025-01-22' },
      { name: '생크림', quantity: 0.5, unit: 'L', category: '유제품', expiryDate: '2025-01-25' },
      { name: '파마산치즈', quantity: 0.2, unit: 'kg', category: '유제품', expiryDate: '2025-02-15' },
      { name: '갈비', quantity: 1.2, unit: 'kg', category: '육류', expiryDate: '2025-01-21' },
      { name: '당근', quantity: 0.8, unit: 'kg', category: '채소', expiryDate: '2025-01-26' },
      { name: '무', quantity: 1, unit: '개', category: '채소', expiryDate: '2025-01-30' },
      { name: '간장', quantity: 0.3, unit: 'L', category: '조미료', expiryDate: '2025-12-31' },
      { name: '설탕', quantity: 1, unit: 'kg', category: '조미료', expiryDate: '2026-01-01' },
      { name: '쌀', quantity: 5, unit: 'kg', category: '곡물', expiryDate: '2026-01-01' },
      { name: '생선회', quantity: 0.5, unit: 'kg', category: '해산물', expiryDate: '2025-01-20' },
      { name: '초밥식초', quantity: 0.2, unit: 'L', category: '조미료', expiryDate: '2025-12-31' },
      { name: '소금', quantity: 0.5, unit: 'kg', category: '조미료', expiryDate: '2026-01-01' },
      { name: '크림치즈', quantity: 0.5, unit: 'kg', category: '유제품', expiryDate: '2025-01-26' },
      { name: '계란', quantity: 8, unit: '개', category: '유제품', expiryDate: '2025-01-28' },
      { name: '크래커', quantity: 0.3, unit: 'kg', category: '과자', expiryDate: '2025-02-15' },
      { name: '버터', quantity: 0.1, unit: 'kg', category: '유제품', expiryDate: '2025-02-15' },
      // 와규 스테이크용 재료들
      { name: '와규 스테이크', quantity: 0.8, unit: 'kg', category: '육류', expiryDate: '2025-01-22' },
      { name: '후추', quantity: 0.1, unit: 'kg', category: '조미료', expiryDate: '2026-01-01' },
      { name: '올리브오일', quantity: 0.5, unit: 'L', category: '조미료', expiryDate: '2025-12-31' },
      { name: '로즈마리', quantity: 5, unit: '줄기', category: '허브', expiryDate: '2025-01-28' },
      { name: '타임', quantity: 3, unit: '줄기', category: '허브', expiryDate: '2025-01-28' },
      { name: '와인', quantity: 0.75, unit: 'L', category: '주류', expiryDate: '2026-01-01' },
      { name: '소고기 육수', quantity: 1, unit: 'L', category: '조미료', expiryDate: '2025-02-15' }
    ];

    // 현재 레시피에 맞는 재료만 필터링
    if (recipe) {
      const recipeIngredientNames = recipe.ingredients.map(ing => ing.ingredientName);
      return allIngredients.filter(ing => recipeIngredientNames.includes(ing.name));
    }

    return allIngredients;
  };

  // 레시피 사용하기 모달 열기
  const handleUseRecipe = () => {
    if (!recipe) return;
    
    const dummyIngredients = generateDummyIngredients();
    const available: any[] = [];
    const missing: any[] = [];
    
    recipe.ingredients.forEach(recipeIngredient => {
      const found = dummyIngredients.find(ing => 
        ing.name === recipeIngredient.ingredientName
      );
      
      if (found && found.quantity >= recipeIngredient.quantity) {
        available.push({
          ...recipeIngredient,
          availableQuantity: found.quantity,
          willUse: recipeIngredient.quantity,
          remainingAfterUse: found.quantity - recipeIngredient.quantity,
          expiryDate: found.expiryDate,
          category: found.category
        });
      } else {
        missing.push({
          ...recipeIngredient,
          availableQuantity: found?.quantity || 0,
          willUse: 0,
          needed: recipeIngredient.quantity - (found?.quantity || 0)
        });
      }
    });
    
    setAvailableIngredients(available);
    setMissingIngredients(missing);
    setUseRecipeModalVisible(true);
  };

  // 레시피 사용 확인
  const handleConfirmUseRecipe = async (values: any) => {
    if (!recipe) return;
    
    try {
      // 사용할 재료가 부족한 경우 체크
      if (missingIngredients.length > 0) {
        message.warning('재료가 부족합니다. 쇼핑을 먼저 해주세요.');
        return;
      }
      
      // 재료 소비 처리 시뮬레이션
      const consumedIngredients = availableIngredients.map(ingredient => ({
        name: ingredient.ingredientName,
        used: ingredient.willUse,
        unit: ingredient.unit,
        remaining: ingredient.remainingAfterUse
      }));
      
      // 성공 메시지와 함께 소비된 재료 정보 표시
      const consumedText = consumedIngredients
        .map(ing => `${ing.name} ${ing.used}${ing.unit}`)
        .join(', ');
      
      message.success(
        <div>
          <div>레시피를 사용했습니다! 🍳</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            소비된 재료: {consumedText}
          </div>
        </div>
      );
      
      setUseRecipeModalVisible(false);
      useRecipeForm.resetFields();
      
      // 실제로는 API 호출로 재료 소비 처리
      console.log('재료 소비 처리:', consumedIngredients);
      
    } catch (error) {
      message.error('레시피 사용 처리에 실패했습니다.');
    }
  };

  useEffect(() => {
    // 인증 로딩이 완료된 후에만 레시피 로드
    if (!authLoading) {
      loadRecipe();
    }
  }, [id, authLoading]);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'EASY': return 'green';
      case 'MEDIUM': return 'orange';
      case 'HARD': return 'red';
      default: return 'default';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'EASY': return '쉬움';
      case 'MEDIUM': return '보통';
      case 'HARD': return '어려움';
      default: return level;
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          {authLoading ? '인증 정보를 확인하는 중...' : '레시피를 불러오는 중...'}
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <Card>
        <Title level={4}>레시피를 찾을 수 없습니다</Title>
        <Button onClick={() => navigate('/recipes')}>
          레시피 목록으로 돌아가기
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/recipes')}
        style={{ marginBottom: '16px' }}
      >
        목록으로 돌아가기
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              {recipe.imageUrl ? (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.name}
                  style={{ 
                    width: '100%', 
                    maxHeight: '400px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="
                          height: 300px; 
                          background: linear-gradient(45deg, #f0f2f5, #d9d9d9);
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: #999;
                          border-radius: 8px;
                          font-size: 18px;
                        ">
                          이미지 로딩 실패
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div 
                  style={{ 
                    height: '300px', 
                    background: 'linear-gradient(45deg, #f0f2f5, #d9d9d9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    borderRadius: '8px',
                    fontSize: '18px'
                  }}
                >
                  이미지 없음
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={2} style={{ margin: 0 }}>{recipe.name}</Title>
              <Space>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleUseRecipe}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  레시피 사용하기
                </Button>
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                >
                  공유
                </Button>
                <Button
                  type={isFavorite ? "primary" : "default"}
                  icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleToggleFavorite}
                  disabled={!user}
                  style={{ 
                    color: isFavorite ? '#fff' : '#ff4d4f',
                    borderColor: isFavorite ? '#ff4d4f' : '#d9d9d9',
                    backgroundColor: isFavorite ? '#ff4d4f' : '#fff'
                  }}
                >
                  {isFavorite ? '즐겨찾기됨' : '즐겨찾기'}
                </Button>
              </Space>
            </div>
            
            <Space style={{ marginBottom: '16px' }}>
              {recipe.category && <Tag color="blue">{recipe.category}</Tag>}
              {recipe.difficultyLevel && (
                <Tag color={getDifficultyColor(recipe.difficultyLevel)}>
                  {getDifficultyText(recipe.difficultyLevel)}
                </Tag>
              )}
            </Space>

            {/* 평점 정보 */}
            <div style={{ marginBottom: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col>
                  <Space>
                    <Rate disabled value={averageRating} />
                    <Text strong>{averageRating.toFixed(1)}</Text>
                    <Text type="secondary">({ratingCount}개 평점)</Text>
                  </Space>
                </Col>
                <Col>
                  {user ? (
                    <Space>
                      {userRating ? (
                        <Space>
                          <Text>내 평점: </Text>
                          <Rate disabled value={userRating.rating} />
                          <Button size="small" onClick={() => setRatingModalVisible(true)}>
                            수정
                          </Button>
                          <Button size="small" danger onClick={handleDeleteRating}>
                            삭제
                          </Button>
                        </Space>
                      ) : (
                        <Button type="primary" onClick={() => setRatingModalVisible(true)}>
                          평점 남기기
                        </Button>
                      )}
                    </Space>
                  ) : (
                    <Text type="secondary">로그인 후 평점을 남겨보세요</Text>
                  )}
                </Col>
              </Row>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              {recipe.cookingTime && (
                <Col>
                  <Space>
                    <ClockCircleOutlined />
                    <span>조리시간: {recipe.cookingTime}분</span>
                  </Space>
                </Col>
              )}
              {recipe.servings && (
                <Col>
                  <Space>
                    <UserOutlined />
                    <span>인분: {recipe.servings}인분</span>
                  </Space>
                </Col>
              )}
            </Row>

            {recipe.description && (
              <div style={{ marginBottom: '24px' }}>
                <Title level={4}>설명</Title>
                <Paragraph>{recipe.description}</Paragraph>
              </div>
            )}

            {recipe.instructions && (
              <div>
                <Title level={4}>조리법</Title>
                <div style={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  {recipe.instructions}
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="필요한 재료" style={{ marginBottom: '24px' }}>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <List
                dataSource={recipe.ingredients}
                renderItem={(ingredient) => (
                  <List.Item>
                    <List.Item.Meta
                      title={ingredient.ingredientName}
                      description={
                        <Space>
                          <span>{ingredient.quantity} {ingredient.unit}</span>
                          {ingredient.notes && (
                            <Tag color="orange">{ingredient.notes}</Tag>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                재료 정보가 없습니다.
              </div>
            )}
          </Card>

          <Card title="레시피 정보">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>카테고리: </Text>
                <Text>{recipe.category || '미분류'}</Text>
              </div>
              <div>
                <Text strong>난이도: </Text>
                <Tag color={getDifficultyColor(recipe.difficultyLevel || '')}>
                  {getDifficultyText(recipe.difficultyLevel || '')}
                </Tag>
              </div>
              {recipe.cookingTime && (
                <div>
                  <Text strong>조리시간: </Text>
                  <Text>{recipe.cookingTime}분</Text>
                </div>
              )}
              {recipe.servings && (
                <div>
                  <Text strong>인분: </Text>
                  <Text>{recipe.servings}인분</Text>
                </div>
              )}
              <Divider />
              <div>
                <Text strong>생성일: </Text>
                <Text>{new Date(recipe.createdAt).toLocaleDateString('ko-KR')}</Text>
              </div>
              <div>
                <Text strong>수정일: </Text>
                <Text>{new Date(recipe.updatedAt).toLocaleDateString('ko-KR')}</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 리뷰 섹션 */}
      <Card title={`리뷰 (${ratingCount}개)`} style={{ marginTop: '24px' }}>
        {ratings.length > 0 ? (
          <List
            dataSource={ratings}
            renderItem={(rating) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={rating.userAvatarUrl}
                      icon={<UserOutlined />}
                    >
                      {rating.userDisplayName?.[0] || rating.username?.[0] || 'U'}
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong>{rating.userDisplayName || rating.username}</Text>
                      <Rate disabled value={rating.rating} />
                      <Text type="secondary">
                        {new Date(rating.createdAt).toLocaleDateString('ko-KR')}
                      </Text>
                    </Space>
                  }
                  description={
                    <div>
                      {rating.comment && (
                        <Paragraph style={{ margin: '8px 0 0 0' }}>
                          {rating.comment}
                        </Paragraph>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!
          </div>
        )}
      </Card>

      {/* 평점 모달 */}
      <Modal
        title="평점 및 리뷰"
        open={ratingModalVisible}
        onCancel={() => {
          setRatingModalVisible(false);
          ratingForm.resetFields();
        }}
        onOk={() => ratingForm.submit()}
        okText="저장"
        cancelText="취소"
      >
        <Form
          form={ratingForm}
          layout="vertical"
          onFinish={handleRatingSubmit}
          initialValues={userRating ? {
            rating: userRating.rating,
            comment: userRating.comment,
            isFavorite: userRating.isFavorite
          } : {}}
        >
          <Form.Item
            name="rating"
            label="평점"
            rules={[{ required: true, message: '평점을 선택해주세요' }]}
          >
            <Rate />
          </Form.Item>
          
          <Form.Item
            name="comment"
            label="리뷰"
          >
            <TextArea
              rows={4}
              placeholder="이 레시피에 대한 리뷰를 남겨주세요..."
            />
          </Form.Item>
          
          <Form.Item
            name="isFavorite"
            valuePropName="checked"
          >
            <input type="checkbox" /> 즐겨찾기에 추가
          </Form.Item>
        </Form>
      </Modal>

      {/* 공유 모달 */}
      <Modal
        title="레시피 공유"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <img 
              src={recipe?.imageUrl || '/api/placeholder/200/150'} 
              alt={recipe?.name}
              style={{ 
                width: '200px', 
                height: '150px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            />
            <Title level={4}>{recipe?.name}</Title>
            <Text type="secondary">{recipe?.description}</Text>
          </div>

          <Divider />

          <div style={{ marginBottom: '24px' }}>
            <Text strong>링크 복사</Text>
            <div style={{ marginTop: '8px' }}>
              <Input
                value={window.location.href}
                readOnly
                addonAfter={
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    복사
                  </Button>
                }
              />
            </div>
          </div>

          <div>
            <Text strong>소셜 미디어 공유</Text>
            <div style={{ marginTop: '16px' }}>
              <Space size="large">
                <Button
                  icon={<LinkOutlined />}
                  onClick={() => shareToSocial('facebook')}
                  style={{ background: '#1877f2', color: 'white', border: 'none' }}
                >
                  Facebook
                </Button>
                <Button
                  icon={<LinkOutlined />}
                  onClick={() => shareToSocial('twitter')}
                  style={{ background: '#1da1f2', color: 'white', border: 'none' }}
                >
                  Twitter
                </Button>
                <Button
                  icon={<LinkOutlined />}
                  onClick={() => shareToSocial('kakao')}
                  style={{ background: '#fee500', color: 'black', border: 'none' }}
                >
                  카카오톡
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Modal>

      {/* 레시피 사용하기 모달 */}
      <Modal
        title={
          <Space>
            <ShoppingCartOutlined />
            <span>레시피 사용하기</span>
          </Space>
        }
        open={useRecipeModalVisible}
        onCancel={() => {
          setUseRecipeModalVisible(false);
          useRecipeForm.resetFields();
        }}
        onOk={() => useRecipeForm.submit()}
        okText="레시피 사용하기"
        cancelText="취소"
        width={700}
        okButtonProps={{
          disabled: missingIngredients.length > 0,
          style: { backgroundColor: '#52c41a', borderColor: '#52c41a' }
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Text strong>이 레시피를 사용하면 다음 재료들이 소비됩니다:</Text>
        </div>

        {/* 사용 가능한 재료 */}
        {availableIngredients.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={5} style={{ color: '#52c41a', marginBottom: '16px' }}>
              <CheckCircleOutlined /> 사용 가능한 재료 ({availableIngredients.length}개)
            </Title>
            <List
              dataSource={availableIngredients}
              renderItem={(ingredient) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{ingredient.ingredientName}</Text>
                        <Tag color="green">{ingredient.category}</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text>
                            사용할 양: <Text strong style={{ color: '#52c41a' }}>{ingredient.willUse} {ingredient.unit}</Text>
                          </Text>
                          <Text type="secondary">
                            보유량: {ingredient.availableQuantity} {ingredient.unit}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text>
                            사용 후 남은 양: <Text strong style={{ color: '#1890ff' }}>{ingredient.remainingAfterUse} {ingredient.unit}</Text>
                          </Text>
                          <Text type="secondary">
                            유통기한: {new Date(ingredient.expiryDate).toLocaleDateString('ko-KR')}
                          </Text>
                        </div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}

        {/* 부족한 재료 */}
        {missingIngredients.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={5} style={{ color: '#ff4d4f', marginBottom: '16px' }}>
              <ExclamationCircleOutlined /> 부족한 재료 ({missingIngredients.length}개)
            </Title>
            <List
              dataSource={missingIngredients}
              renderItem={(ingredient) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{ingredient.ingredientName}</Text>
                        <Tag color="red">부족</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text>
                            필요량: <Text strong style={{ color: '#ff4d4f' }}>{ingredient.quantity} {ingredient.unit}</Text>
                          </Text>
                          <Text type="secondary">
                            보유량: {ingredient.availableQuantity} {ingredient.unit}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text type="danger" strong>
                            부족량: {ingredient.needed} {ingredient.unit}
                          </Text>
                          <Text type="secondary">
                            쇼핑이 필요합니다
                          </Text>
                        </div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
            <div style={{ 
              padding: '16px', 
              background: '#fff2f0', 
              border: '1px solid #ffccc7', 
              borderRadius: '6px',
              marginTop: '16px'
            }}>
              <Text type="danger">
                <ExclamationCircleOutlined /> 부족한 재료가 있어서 레시피를 사용할 수 없습니다. 
                재료를 구매한 후 다시 시도해주세요.
              </Text>
            </div>
          </div>
        )}

        {/* 사용 가능한 경우에만 확인 메시지 */}
        {missingIngredients.length === 0 && availableIngredients.length > 0 && (
          <div style={{ 
            padding: '16px', 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <Text style={{ color: '#52c41a' }}>
              <CheckCircleOutlined /> 모든 재료가 충분합니다! 레시피를 사용하면 재료가 소비됩니다.
            </Text>
          </div>
        )}

        {/* 재료 사용 요약 */}
        {availableIngredients.length > 0 && (
          <div style={{ 
            padding: '16px', 
            background: '#f0f9ff', 
            border: '1px solid #91d5ff', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <Title level={5} style={{ marginBottom: '12px', color: '#1890ff' }}>
              📊 재료 사용 요약
            </Title>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>총 사용할 재료: {availableIngredients.length}개</Text>
              </Col>
              <Col span={12}>
                <Text strong>총 소비량: {availableIngredients.reduce((sum, ing) => sum + ing.willUse, 0)}개</Text>
              </Col>
            </Row>
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                사용할 재료: {availableIngredients.map(ing => `${ing.ingredientName} ${ing.willUse}${ing.unit}`).join(', ')}
              </Text>
            </div>
          </div>
        )}

        <Form
          form={useRecipeForm}
          layout="vertical"
          onFinish={handleConfirmUseRecipe}
        >
          <Form.Item
            name="confirm"
            valuePropName="checked"
            rules={[{ required: true, message: '확인해주세요' }]}
          >
            <input type="checkbox" /> 
            <Text style={{ marginLeft: '8px' }}>
              위 재료들을 소비하여 레시피를 사용하는 것에 동의합니다.
            </Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RecipeDetailPage;
