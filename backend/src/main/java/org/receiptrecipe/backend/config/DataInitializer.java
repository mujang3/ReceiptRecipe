package org.receiptrecipe.backend.config;

import org.receiptrecipe.backend.entity.*;
import org.receiptrecipe.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private PostRepository postRepository;
    
    
    @Autowired
    private ReceiptRepository receiptRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private TagRepository tagRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private IngredientExpiryRepository ingredientExpiryRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DataInitializer 시작 ===");
        
        // 기존 데이터가 없을 때만 초기화
        if (roleRepository.count() == 0) {
            System.out.println("역할 초기화 중...");
            initializeRoles();
        }
        if (userRepository.count() == 0) {
            System.out.println("사용자 초기화 중...");
            initializeUsers();
        }
        if (tagRepository.count() == 0) {
            System.out.println("태그 초기화 중...");
            initializeTags();
        }
        
        // 기존 데이터에 추가로 더 많은 데이터 생성
        System.out.println("추가 사용자 생성 중...");
        addMoreUsers();
        System.out.println("추가 포스트 생성 중...");
        initializePosts();
        System.out.println("추가 영수증 생성 중...");
        initializeReceipts();
        System.out.println("추가 레시피 생성 중...");
        initializeRecipes();
        System.out.println("추가 댓글 생성 중...");
        initializeComments();
        System.out.println("재료 관리 더미 데이터 생성 중...");
        initializeIngredientExpiry();
        
        System.out.println("=== DataInitializer 완료 ===");
        System.out.println("총 사용자 수: " + userRepository.count());
        System.out.println("총 레시피 수: " + recipeRepository.count());
        System.out.println("총 포스트 수: " + postRepository.count());
        System.out.println("총 영수증 수: " + receiptRepository.count());
        System.out.println("총 댓글 수: " + commentRepository.count());
        System.out.println("총 재료 관리 수: " + ingredientExpiryRepository.count());
    }
    
    private void initializeRoles() {
        Role userRole = new Role(Role.RoleName.ROLE_USER, "일반 사용자");
        roleRepository.save(userRole);
        
        Role adminRole = new Role(Role.RoleName.ROLE_ADMIN, "관리자");
        roleRepository.save(adminRole);
        
        Role moderatorRole = new Role(Role.RoleName.ROLE_MODERATOR, "모더레이터");
        roleRepository.save(moderatorRole);
    }
    
    private void initializeUsers() {
        Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN).orElseThrow();
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER).orElseThrow();
        Role moderatorRole = roleRepository.findByName(Role.RoleName.ROLE_MODERATOR).orElseThrow();
        
        // 관리자 계정들
        String[][] adminUsers = {
            {"admin", "admin@receiptocr.com", "admin123", "관리자"},
            {"superadmin", "superadmin@receiptocr.com", "super123", "슈퍼관리자"}
        };
        
        for (String[] adminData : adminUsers) {
            User admin = createUser(adminData[0], adminData[1], adminData[2], adminData[3], adminRole);
            userRepository.save(admin);
        }
        
        // 일반 사용자 계정들 (5명으로 줄임)
        String[][] users = {
            {"test1", "test1@email.com", "password123", "테스트사용자1"},
            {"김민수", "kimminsu@email.com", "password123", "김민수"},
            {"이지영", "leejiyoung@email.com", "password123", "이지영"},
            {"박현우", "parkhyunwoo@email.com", "password123", "박현우"},
            {"최수진", "choisujin@email.com", "password123", "최수진"},
            {"정민호", "jungminho@email.com", "password123", "정민호"}
        };
        
        for (String[] userData : users) {
            User user = createUser(userData[0], userData[1], userData[2], userData[3], userRole);
            userRepository.save(user);
        }
        
        // 요리 전문가들 (2명으로 줄임)
        String[][] chefs = {
            {"masterchef", "masterchef@receiptocr.com", "chef123", "마스터셰프"},
            {"koreanchef", "koreanchef@receiptocr.com", "chef123", "한식 전문가"}
        };
        
        for (String[] chefData : chefs) {
            User chef = createUser(chefData[0], chefData[1], chefData[2], chefData[3], userRole);
            userRepository.save(chef);
        }
        
        // 모더레이터 계정
        User moderator = createUser("moderator", "moderator@receiptocr.com", "mod123", "커뮤니티 관리자", moderatorRole);
        userRepository.save(moderator);
    }
    
    private User createUser(String username, String email, String password, String displayName, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setDisplayName(displayName);
        user.setIsEnabled(true);
        user.setRoles(new HashSet<>(Arrays.asList(role)));
        user.setCreatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 365)));
        user.setUpdatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 30)));
        
        // 더미 아바타 URL 추가
        String[] avatarUrls = {
            "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=" + displayName.charAt(0),
            "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=" + displayName.charAt(0),
            "https://via.placeholder.com/150/45B7D1/FFFFFF?text=" + displayName.charAt(0),
            "https://via.placeholder.com/150/96CEB4/FFFFFF?text=" + displayName.charAt(0),
            "https://via.placeholder.com/150/FFEAA7/FFFFFF?text=" + displayName.charAt(0),
            "https://via.placeholder.com/150/DDA0DD/FFFFFF?text=" + displayName.charAt(0),
            "https://via.placeholder.com/150/98D8C8/FFFFFF?text=" + displayName.charAt(0),
            "https://via.placeholder.com/150/F7DC6F/FFFFFF?text=" + displayName.charAt(0)
        };
        user.setAvatarUrl(avatarUrls[(int)(Math.random() * avatarUrls.length)]);
        
        return user;
    }
    
    private void initializeTags() {
        String[] tagNames = {
            "한식", "중식", "일식", "양식", "동남아식", "인도식", "멕시코식", "터키식",
            "간편요리", "건강식", "다이어트", "비건", "무설탕", "저칼로리", "고단백",
            "디저트", "케이크", "쿠키", "아이스크림", "빵", "마카롱", "타르트",
            "간식", "스낵", "과자", "견과류", "건강간식", "프로틴바",
            "음료", "커피", "차", "스무디", "주스", "에이드", "라떼",
            "샐러드", "스프", "스테이크", "파스타", "피자", "버거", "샌드위치",
            "볶음", "튀김", "구이", "찜", "조림", "무침", "나물",
            "국물요리", "찌개", "탕", "전골", "라면", "국수", "면류",
            "밥류", "볶음밥", "비빔밥", "김밥", "죽", "떡볶이",
            "아침식사", "점심식사", "저녁식사", "야식", "브런치", "간식시간",
            "파티음식", "손님접대", "혼밥", "도시락", "간단식사",
            "재료절약", "남은재료", "냉장고털이", "계절요리", "특별날",
            "초보자용", "아이요리", "노인요리", "술안주", "해장음식",
            "캠핑요리", "야외요리", "픽업음식", "포장음식", "배달음식"
        };
        
        for (String tagName : tagNames) {
            Tag tag = new Tag();
            tag.setName(tagName);
            tag.setCreatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 365)));
            tagRepository.save(tag);
        }
    }
    
    private void initializePosts() {
        
        // 다양한 사용자들 가져오기
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) return;
        
        String[][] posts = {
            {"김민수", "간단한 김치찌개 레시피 공유해요!", "오늘 집에서 만든 김치찌개가 너무 맛있어서 레시피를 공유하고 싶어요. 돼지고기 200g, 김치 1컵, 두부 1/2모, 대파 1대면 충분해요! 돼지고기를 먼저 볶고 김치를 넣어서 볶은 다음 물을 넣고 끓이면 됩니다. 마지막에 두부와 대파를 넣어주세요!"},
            {"masterchef", "완벽한 스테이크 굽는 법", "스테이크를 완벽하게 굽는 비법을 알려드릴게요. 먼저 고기를 상온에 30분 두어서 실온으로 만든 후, 소금과 후추로 간을 해주세요. 팬을 강불로 달구고 기름을 두른 후 고기를 올리세요. 한쪽이 익으면 뒤집어서 굽고, 마지막에 버터와 마늘, 로즈마리를 넣어서 버스팅해주세요!"},
            {"이지영", "다이어트 샐러드 레시피", "다이어트 중인데 맛있는 샐러드 레시피 찾고 계신가요? 아보카도, 토마토, 치킨, 견과류로 만든 샐러드 레시피를 공유합니다! 올리브오일과 레몬즙으로 만든 드레싱이 포인트예요."},
            {"koreanchef", "진짜 맛있는 된장찌개 만들기", "된장찌개를 진짜 맛있게 만드는 비법을 알려드릴게요. 된장을 체에 걸러서 넣고, 멸치 육수에 무와 두부, 애호박을 넣어 끓이면 됩니다. 마지막에 고춧가루와 마늘을 넣어주세요!"},
            {"박현우", "집에서 만드는 파스타 레시피", "이탈리안 레스토랑에서 먹던 그 맛! 집에서도 충분히 재현 가능한 크림파스타 레시피입니다. 버터, 마늘, 파마산치즈만 있으면 돼요!"},
            {"한소영", "집에서 만드는 피자 레시피", "이탈리안 레스토랑에서 먹던 그 맛! 집에서도 충분히 재현 가능한 피자 레시피입니다. 도우부터 토핑까지 모든 과정을 자세히 설명해드릴게요."},
            {"윤태준", "갈비찜 완벽 레시피", "부드럽고 맛있는 갈비찜을 만드는 비법을 공유합니다. 핏물 빼기부터 조리기까지 모든 과정이 중요해요!"},
            {"강미래", "비건 샐러드 레시피 모음", "고기 없이도 충분히 맛있고 영양가 있는 샐러드 레시피들을 모았습니다. 비건 생활을 시작하시는 분들께 추천해요!"},
            {"조성민", "라면을 더 맛있게 끓이는 법", "라면을 그냥 끓이지 말고 이렇게 끓이면 훨씬 맛있어요! 간단한 팁들을 공유합니다."},
            {"임다은", "티라미수 만들기", "이탈리안 디저트의 대표주자 티라미수를 집에서 만드는 방법을 알려드릴게요. 마스카포네치즈가 핵심이에요!"},
            {"서준호", "김치볶음밥 레시피", "남은 김치로 만드는 간단하고 맛있는 김치볶음밥 레시피입니다. 5분이면 완성!"},
            {"배지현", "건강한 스무디 레시피", "아침에 마시기 좋은 영양가 가득한 스무디 레시피들을 모았습니다. 다이어트에도 좋아요!"},
            {"오세훈", "한식의 기본 계란찜", "한국인의 소울푸드 계란찜을 완벽하게 만드는 방법을 알려드릴게요. 부드럽고 맛있게!"},
            {"노하늘", "간편한 아침 샌드위치", "바쁜 아침에 5분이면 만드는 간편한 샌드위치 레시피입니다. 영양도 골고루!"},
            {"신예린", "매운 떡볶이 만들기", "매운맛을 좋아하는 분들을 위한 진짜 매운 떡볶이 레시피입니다. 고춧가루가 핵심!"},
            {"홍길동", "추운 날 수제비", "추운 겨울날에 생각나는 따뜻한 수제비 레시피입니다. 가족들과 함께 먹으면 더욱 맛있어요!"},
            {"김철수", "초코칩 쿠키 만들기", "집에서 만드는 바삭하고 맛있는 초코칩 쿠키 레시피입니다. 아이들이 정말 좋아해요!"},
            {"이영희", "건강한 견과류 과자", "설탕 없이 만드는 건강한 견과류 과자 레시피입니다. 다이어트 중에도 안심하고 드세요!"}
        };
        
        for (String[] postData : posts) {
            User author = users.stream()
                .filter(u -> u.getUsername().equals(postData[0]))
                .findFirst()
                .orElse(users.get((int)(Math.random() * users.size())));
            
            Post post = new Post();
            post.setTitle(postData[1]);
            post.setContent(postData[2]);
            post.setAuthor(author);
            post.setCreatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 30)));
            post.setUpdatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 10)));
            post.setViewCount((int)(Math.random() * 200) + 10);
            post.setLikeCount((int)(Math.random() * 50) + 1);
            post.setCommentCount((int)(Math.random() * 20));
            postRepository.save(post);
        }
    }
    
    private void initializeReceipts() {
        
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) return;
        
        String[][] receipts = {
            {"김민수", "이마트", "125000.0", "대형마트 장보기"},
            {"이지영", "롯데마트", "89000.0", "주말 장보기"},
            {"박현우", "홈플러스", "156000.0", "월간 대량 구매"},
            {"최수진", "GS25", "12000.0", "간단한 간식 구매"},
            {"정민호", "CU", "8500.0", "점심 도시락"},
            {"한소영", "세븐일레븐", "15000.0", "아이스크림과 음료"},
            {"윤태준", "올리브영", "45000.0", "화장품과 생활용품"},
            {"강미래", "다이소", "25000.0", "생활용품 구매"},
            {"조성민", "코스트코", "280000.0", "대량 구매"},
            {"임다은", "이마트24", "18000.0", "야간 급한 구매"},
            {"서준호", "이마트", "95000.0", "주말 장보기"},
            {"배지현", "롯데마트", "67000.0", "일상 용품 구매"},
            {"오세훈", "홈플러스", "134000.0", "가족 장보기"},
            {"노하늘", "GS25", "11000.0", "간식 구매"},
            {"신예린", "CU", "13500.0", "음료와 과자"},
            {"홍길동", "세븐일레븐", "22000.0", "야식 구매"},
            {"김철수", "올리브영", "38000.0", "헬스케어 용품"},
            {"이영희", "다이소", "18000.0", "소품 구매"},
            {"박민수", "코스트코", "195000.0", "대량 구매"},
            {"최지영", "이마트24", "16000.0", "긴급 구매"},
            {"masterchef", "농협하나로마트", "167000.0", "요리 재료 대량 구매"},
            {"koreanchef", "이마트", "145000.0", "한식 재료 구매"},
            {"bakingmaster", "롯데마트", "98000.0", "베이킹 재료 구매"},
            {"healthychef", "홈플러스", "112000.0", "건강식 재료 구매"},
            {"admin", "이마트", "75000.0", "관리자 개인 구매"},
            {"moderator", "GS25", "14000.0", "간단한 구매"}
        };
        
        for (String[] receiptData : receipts) {
            User user = users.stream()
                .filter(u -> u.getUsername().equals(receiptData[0]))
                .findFirst()
                .orElse(users.get((int)(Math.random() * users.size())));
            
            Receipt receipt = new Receipt();
            receipt.setUser(user);
            receipt.setStoreName(receiptData[1]);
            receipt.setTotalAmount(Double.parseDouble(receiptData[2]));
            receipt.setPurchaseDate(LocalDateTime.now().minusDays((int)(Math.random() * 30)));
            receipt.setCreatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 30)));
            receipt.setRawOcrText("OCR 텍스트: " + receiptData[1] + "에서 " + receiptData[2] + "원 구매");
            receiptRepository.save(receipt);
        }
    }
    
    private void initializeRecipes() {
        
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) return;
        
        String[][] recipes = {
            {"masterchef", "완벽한 스테이크", "레스토랑 수준의 스테이크 굽기", "1. 고기를 상온에 30분 두기\n2. 소금과 후추로 간하기\n3. 팬을 강불로 달구기\n4. 고기를 굽고 버스팅하기", "45", "2", "어려움", "양식"},
            {"koreanchef", "진짜 맛있는 김치찌개", "집에서 만드는 최고의 김치찌개", "1. 돼지고기를 볶는다\n2. 김치를 넣고 볶는다\n3. 물을 넣고 끓인다\n4. 두부와 대파를 넣는다", "30", "4", "보통", "한식"},
            {"bakingmaster", "초콜릿 케이크", "생일 케이크로 완벽한 초콜릿 케이크", "1. 버터와 설탕을 섞는다\n2. 달걀을 넣고 섞는다\n3. 밀가루와 코코아파우더를 넣는다\n4. 오븐에서 굽는다", "90", "8", "보통", "디저트"},
            {"healthychef", "건강한 샐러드", "영양만점 건강 샐러드", "1. 상추를 씻어 준비한다\n2. 토마토와 오이를 썬다\n3. 아보카도를 넣는다\n4. 드레싱을 만든다", "15", "2", "매우 쉬움", "건강식"},
            {"김민수", "간단한 볶음밥", "남은 밥으로 만드는 맛있는 볶음밥", "1. 양파와 당근을 썬다\n2. 팬에 기름을 두르고 볶는다\n3. 밥을 넣고 볶는다\n4. 계란을 넣고 마무리한다", "20", "2", "쉬움", "간편요리"},
            {"이지영", "크림파스타", "집에서 만드는 레스토랑급 크림파스타", "1. 파스타를 삶는다\n2. 버터와 마늘을 볶는다\n3. 크림을 넣고 끓인다\n4. 파스타와 파마산치즈를 넣는다", "25", "2", "보통", "양식"},
            {"박현우", "된장찌개", "구수한 된장찌개 만들기", "1. 멸치 육수를 만든다\n2. 된장을 체에 걸러 넣는다\n3. 무와 두부를 넣는다\n4. 애호박과 대파를 넣는다", "30", "4", "쉬움", "한식"},
            {"최수진", "초밥 만들기", "집에서 만드는 초밥", "1. 쌀을 씻어 밥을 짓는다\n2. 초밥 식초를 만든다\n3. 생선을 준비한다\n4. 초밥을 만든다", "60", "4", "어려움", "일식"},
            {"정민호", "떡볶이", "매콤달콤한 떡볶이 만들기", "1. 떡볶이떡을 준비한다\n2. 고춧장과 고춧가루를 넣는다\n3. 설탕과 간장을 넣는다\n4. 끓여서 완성한다", "20", "2", "쉬움", "한식"},
            {"한소영", "피자 만들기", "집에서 만드는 맛있는 피자", "1. 피자 도우를 만든다\n2. 토핑을 준비한다\n3. 토마토소스를 바른다\n4. 오븐에서 굽는다", "120", "4", "보통", "양식"},
            {"윤태준", "갈비찜", "부드러운 갈비찜 만들기", "1. 갈비를 끓여 핏물을 뺀다\n2. 다시마 육수를 만든다\n3. 간장, 설탕, 마늘을 넣는다\n4. 조려서 완성한다", "90", "4", "보통", "한식"},
            {"강미래", "비건 샐러드", "고기 없는 맛있는 샐러드", "1. 다양한 야채를 준비한다\n2. 콩과 견과류를 넣는다\n3. 비건 드레싱을 만든다\n4. 모두 섞어 완성한다", "15", "2", "매우 쉬움", "비건"},
            {"조성민", "라면 레시피", "라면을 더 맛있게 끓이는 법", "1. 물을 적게 넣는다\n2. 라면을 끓인다\n3. 계란을 넣는다\n4. 파를 넣어 마무리한다", "10", "1", "매우 쉬움", "간편요리"},
            {"임다은", "티라미수", "이탈리안 디저트 티라미수", "1. 마스카포네치즈를 준비한다\n2. 에스프레소를 만든다\n3. 레이디핑거를 적신다\n4. 층층이 쌓아 완성한다", "180", "6", "어려움", "디저트"},
            {"서준호", "김치볶음밥", "김치로 만드는 간단한 볶음밥", "1. 김치를 잘게 썬다\n2. 팬에 기름을 두르고 볶는다\n3. 밥을 넣고 볶는다\n4. 계란을 넣어 완성한다", "15", "1", "쉬움", "한식"},
            {"배지현", "스무디", "아침에 마시는 건강한 스무디", "1. 바나나를 준비한다\n2. 딸기를 넣는다\n3. 우유와 꿀을 넣는다\n4. 블렌더로 갈아 마신다", "5", "1", "매우 쉬움", "음료"},
            {"오세훈", "계란찜", "한식의 기본 계란찜", "1. 달걀을 깬다\n2. 멸치 육수를 넣는다\n3. 대파를 넣는다\n4. 찜기에 쪄 완성한다", "20", "2", "쉬움", "한식"},
            {"노하늘", "샌드위치", "간편한 아침 샌드위치", "1. 식빵을 준비한다\n2. 햄과 치즈를 넣는다\n3. 토마토와 양상추를 넣는다\n4. 마요네즈를 발라 완성한다", "10", "1", "매우 쉬움", "간편요리"},
            {"신예린", "매운 떡볶이", "매운맛 좋아하는 분들을 위한 떡볶이", "1. 고춧가루를 많이 넣는다\n2. 고춧장을 넣는다\n3. 마늘과 생강을 넣는다\n4. 진짜 매운 떡볶이 완성!", "25", "2", "보통", "한식"},
            {"홍길동", "수제비", "추운 날에 생각나는 수제비", "1. 밀가루 반죽을 만든다\n2. 멸치 육수를 만든다\n3. 김치와 돼지고기를 넣는다\n4. 수제비를 떠서 넣는다", "40", "4", "보통", "한식"},
            {"김철수", "초코칩 쿠키", "집에서 만드는 초코칩 쿠키", "1. 버터와 설탕을 섞는다\n2. 달걀을 넣는다\n3. 밀가루와 초코칩을 넣는다\n4. 오븐에서 구워 완성한다", "45", "12", "쉬움", "디저트"},
            {"이영희", "견과류 과자", "건강한 견과류 과자 만들기", "1. 견과류를 준비한다\n2. 꿀과 오트밀을 넣는다\n3. 섞어서 모양을 만든다\n4. 오븐에서 구워 완성한다", "30", "8", "쉬움", "간식"},
            {"박민수", "김치 만들기", "집에서 만드는 맛있는 김치", "1. 배추를 소금에 절인다\n2. 고춧가루 양념을 만든다\n3. 마늘과 생강을 넣는다\n4. 배추에 양념을 발라 완성한다", "180", "10", "보통", "한식"},
            {"최지영", "아이스크림", "집에서 만드는 건강한 아이스크림", "1. 바나나를 얼린다\n2. 딸기를 준비한다\n3. 블렌더로 갈아 만든다\n4. 냉동고에서 얼려 완성한다", "60", "4", "쉬움", "디저트"}
        };
        
        for (String[] recipeData : recipes) {
            User user = users.stream()
                .filter(u -> u.getUsername().equals(recipeData[0]))
                .findFirst()
                .orElse(users.get((int)(Math.random() * users.size())));
            
            Recipe recipe = new Recipe();
            recipe.setName(recipeData[1]);
            recipe.setDescription(recipeData[2]);
            recipe.setInstructions(recipeData[3]);
            recipe.setCookingTime(Integer.parseInt(recipeData[4]));
            recipe.setServings(Integer.parseInt(recipeData[5]));
            recipe.setDifficultyLevel(recipeData[6]);
            recipe.setCategory(recipeData[7]);
            recipe.setUser(user);
            recipe.setCreatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 60)));
            recipe.setUpdatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 20)));
            recipeRepository.save(recipe);
        }
    }
    
    private void initializeComments() {
        List<User> users = userRepository.findAll();
        List<Post> posts = postRepository.findAll();
        
        if (users.isEmpty() || posts.isEmpty()) {
            return;
        }
        
        // 각 포스트에 1-2개의 댓글 추가 (줄임)
        for (Post post : posts) {
            int commentCount = 1 + (int)(Math.random() * 2); // 1-2개
            
            for (int i = 0; i < commentCount; i++) {
                User randomUser = users.get((int)(Math.random() * users.size()));
                
                Comment comment = new Comment();
                comment.setContent("정말 맛있어 보이네요! 레시피 공유해주셔서 감사합니다.");
                comment.setPost(post);
                comment.setAuthor(randomUser);
                comment.setCreatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 30)));
                comment.setUpdatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 10)));
                comment.setLikeCount((int)(Math.random() * 10));
                
                commentRepository.save(comment);
            }
        }
    }
    
    
    private void addMoreUsers() {
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER).orElseThrow();
        
        // 더 많은 사용자 추가
        String[][] moreUsers = {
            {"한소영", "hansoyoung@email.com", "password123", "한소영"},
            {"윤태준", "yuntaejun@email.com", "password123", "윤태준"},
            {"강미래", "kangmirae@email.com", "password123", "강미래"},
            {"조성민", "josungmin@email.com", "password123", "조성민"},
            {"임다은", "imdaeun@email.com", "password123", "임다은"},
            {"서준호", "seojunho@email.com", "password123", "서준호"},
            {"배지현", "baejihyun@email.com", "password123", "배지현"},
            {"오세훈", "ohsehoon@email.com", "password123", "오세훈"},
            {"노하늘", "nohaneul@email.com", "password123", "노하늘"},
            {"신예린", "shinyerin@email.com", "password123", "신예린"},
            {"홍길동", "honggildong@email.com", "password123", "홍길동"},
            {"김철수", "kimcheolsu@email.com", "password123", "김철수"},
            {"이영희", "leeyounghee@email.com", "password123", "이영희"},
            {"박민수", "parkminsu@email.com", "password123", "박민수"},
            {"최지영", "choijiyoung@email.com", "password123", "최지영"},
            {"bakingmaster", "bakingmaster@email.com", "password123", "베이킹 마스터"},
            {"healthychef", "healthychef@email.com", "password123", "건강식 전문가"},
            {"veganchef", "veganchef@email.com", "password123", "비건 전문가"},
            {"dessertmaster", "dessertmaster@email.com", "password123", "디저트 마스터"},
            {"coffeemaster", "coffeemaster@email.com", "password123", "커피 전문가"},
            {"김요리사", "kimcook@email.com", "password123", "김요리사"},
            {"이셰프", "lechef@email.com", "password123", "이셰프"},
            {"박쿠킹", "parkcooking@email.com", "password123", "박쿠킹"},
            {"최베이킹", "choibaking@email.com", "password123", "최베이킹"},
            {"정디저트", "jungdessert@email.com", "password123", "정디저트"},
            {"한한식", "hanhansik@email.com", "password123", "한한식"},
            {"양양식", "yangyangsik@email.com", "password123", "양양식"},
            {"일일식", "ililsik@email.com", "password123", "일일식"},
            {"중중식", "jungjungsik@email.com", "password123", "중중식"},
            {"간편요리왕", "simplecook@email.com", "password123", "간편요리왕"},
            {"건강식전문", "healthyfood@email.com", "password123", "건강식전문"},
            {"다이어트요리", "dietcook@email.com", "password123", "다이어트요리"},
            {"아이들요리", "kidsfood@email.com", "password123", "아이들요리"},
            {"파티요리", "partyfood@email.com", "password123", "파티요리"},
            {"야식전문", "latefood@email.com", "password123", "야식전문"},
            {"도시락전문", "lunchbox@email.com", "password123", "도시락전문"},
            {"샐러드마스터", "saladmaster@email.com", "password123", "샐러드마스터"},
            {"스무디전문", "smoothie@email.com", "password123", "스무디전문"},
            {"주스전문", "juice@email.com", "password123", "주스전문"},
            {"차전문", "tea@email.com", "password123", "차전문"},
            {"커피전문", "coffee@email.com", "password123", "커피전문"}
        };
        
        for (String[] userData : moreUsers) {
            // 사용자명으로 기존 사용자 확인
            boolean userExists = userRepository.findByUsername(userData[0]).isPresent();
            if (!userExists) {
                User user = createUser(userData[0], userData[1], userData[2], userData[3], userRole);
                userRepository.save(user);
            }
        }
    }
    
    private void initializeIngredientExpiry() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) return;
        
        // 다양한 재료와 유통기한 데이터
        String[][] ingredients = {
            {"양파", "kg", "7"},
            {"당근", "kg", "14"},
            {"감자", "kg", "21"},
            {"마늘", "kg", "30"},
            {"생강", "kg", "14"},
            {"대파", "단", "7"},
            {"양상추", "개", "5"},
            {"토마토", "kg", "7"},
            {"오이", "개", "7"},
            {"브로콜리", "개", "5"},
            {"시금치", "단", "3"},
            {"배추", "포기", "14"},
            {"무", "개", "21"},
            {"고구마", "kg", "30"},
            {"버섯", "팩", "5"},
            {"아보카도", "개", "5"},
            {"바나나", "송이", "5"},
            {"사과", "개", "14"},
            {"오렌지", "개", "14"},
            {"레몬", "개", "21"},
            {"딸기", "팩", "3"},
            {"블루베리", "팩", "7"},
            {"포도", "송이", "7"},
            {"복숭아", "개", "5"},
            {"배", "개", "14"},
            {"닭고기", "kg", "3"},
            {"돼지고기", "kg", "3"},
            {"소고기", "kg", "5"},
            {"생선", "마리", "2"},
            {"새우", "kg", "2"},
            {"오징어", "마리", "2"},
            {"문어", "마리", "2"},
            {"계란", "판", "14"},
            {"우유", "L", "7"},
            {"요거트", "개", "10"},
            {"치즈", "팩", "14"},
            {"버터", "개", "30"},
            {"마요네즈", "개", "30"},
            {"케첩", "개", "90"},
            {"간장", "개", "365"},
            {"고춧가루", "개", "180"},
            {"설탕", "kg", "365"},
            {"소금", "kg", "365"},
            {"식용유", "L", "180"},
            {"올리브오일", "L", "365"},
            {"참기름", "개", "180"},
            {"들기름", "개", "180"},
            {"쌀", "kg", "365"},
            {"밀가루", "kg", "180"},
            {"파스타", "kg", "365"},
            {"라면", "개", "180"},
            {"김치", "kg", "30"},
            {"된장", "개", "90"},
            {"고춧장", "개", "90"},
            {"멸치", "kg", "180"},
            {"다시마", "개", "365"},
            {"미역", "개", "365"},
            {"김", "장", "180"},
            {"두부", "모", "3"},
            {"순두부", "모", "3"},
            {"콩나물", "kg", "3"},
            {"숙주", "kg", "3"},
            {"팽이버섯", "팩", "5"},
            {"표고버섯", "팩", "7"},
            {"느타리버섯", "팩", "5"},
            {"새송이버섯", "팩", "5"},
            {"고사리", "kg", "30"},
            {"도라지", "kg", "30"},
            {"취나물", "kg", "5"},
            {"시래기", "kg", "30"},
            {"호박", "개", "14"},
            {"애호박", "개", "7"},
            {"가지", "개", "7"},
            {"피망", "개", "7"},
            {"파프리카", "개", "7"},
            {"고추", "개", "7"},
            {"청양고추", "개", "7"},
            {"풋고추", "개", "5"},
            {"마늘쫑", "단", "5"},
            {"부추", "단", "5"},
            {"깻잎", "단", "5"},
            {"상추", "포기", "5"},
            {"치커리", "단", "5"},
            {"로메인", "개", "7"},
            {"케일", "단", "5"},
            {"아루귤라", "단", "5"},
            {"바질", "단", "5"},
            {"로즈마리", "단", "7"},
            {"타임", "단", "7"},
            {"오레가노", "단", "7"},
            {"파슬리", "단", "5"},
            {"딜", "단", "5"},
            {"민트", "단", "5"},
            {"고수", "단", "5"},
            {"생강", "kg", "14"},
            {"마늘", "kg", "30"},
            {"양파", "kg", "7"},
            {"당근", "kg", "14"},
            {"감자", "kg", "21"},
            {"고구마", "kg", "30"},
            {"무", "개", "21"},
            {"배추", "포기", "14"},
            {"양배추", "개", "14"},
            {"브로콜리", "개", "5"},
            {"콜리플라워", "개", "5"},
            {"시금치", "단", "3"},
            {"근대", "단", "3"},
            {"갓", "단", "3"},
            {"쑥갓", "단", "3"},
            {"미나리", "단", "3"},
            {"냉이", "단", "3"},
            {"달래", "단", "3"},
            {"두릅", "단", "3"},
            {"고사리", "kg", "30"},
            {"도라지", "kg", "30"},
            {"취나물", "kg", "5"},
            {"시래기", "kg", "30"},
            {"고구마줄기", "kg", "5"},
            {"호박잎", "kg", "5"},
            {"콩잎", "kg", "5"},
            {"깻잎", "단", "5"},
            {"상추", "포기", "5"},
            {"치커리", "단", "5"},
            {"로메인", "개", "7"},
            {"케일", "단", "5"},
            {"아루귤라", "단", "5"},
            {"바질", "단", "5"},
            {"로즈마리", "단", "7"},
            {"타임", "단", "7"},
            {"오레가노", "단", "7"},
            {"파슬리", "단", "5"},
            {"딜", "단", "5"},
            {"민트", "단", "5"},
            {"고수", "단", "5"},
            {"생강", "kg", "14"},
            {"마늘", "kg", "30"},
            {"양파", "kg", "7"},
            {"당근", "kg", "14"},
            {"감자", "kg", "21"},
            {"고구마", "kg", "30"},
            {"무", "개", "21"},
            {"배추", "포기", "14"},
            {"양배추", "개", "14"},
            {"브로콜리", "개", "5"},
            {"콜리플라워", "개", "5"},
            {"시금치", "단", "3"},
            {"근대", "단", "3"},
            {"갓", "단", "3"},
            {"쑥갓", "단", "3"},
            {"미나리", "단", "3"},
            {"냉이", "단", "3"},
            {"달래", "단", "3"},
            {"두릅", "단", "3"},
            {"고사리", "kg", "30"},
            {"도라지", "kg", "30"},
            {"취나물", "kg", "5"},
            {"시래기", "kg", "30"},
            {"고구마줄기", "kg", "5"},
            {"호박잎", "kg", "5"},
            {"콩잎", "kg", "5"},
            {"깻잎", "단", "5"},
            {"상추", "포기", "5"},
            {"치커리", "단", "5"},
            {"로메인", "개", "7"},
            {"케일", "단", "5"},
            {"아루귤라", "단", "5"},
            {"바질", "단", "5"},
            {"로즈마리", "단", "7"},
            {"타임", "단", "7"},
            {"오레가노", "단", "7"},
            {"파슬리", "단", "5"},
            {"딜", "단", "5"},
            {"민트", "단", "5"},
            {"고수", "단", "5"}
        };
        
        for (User user : users) {
            // 각 사용자당 10-20개의 재료 추가
            int ingredientCount = 10 + (int)(Math.random() * 11);
            
            for (int i = 0; i < ingredientCount; i++) {
                String[] ingredientData = ingredients[(int)(Math.random() * ingredients.length)];
                
                IngredientExpiry ingredient = new IngredientExpiry();
                ingredient.setUser(user);
                ingredient.setIngredientName(ingredientData[0]);
                ingredient.setUnit(ingredientData[1]);
                ingredient.setQuantity(0.5 + Math.random() * 2.0); // 0.5 ~ 2.5 사이의 수량
                
                // 구매일 (최근 30일 내)
                LocalDate purchaseDate = LocalDate.now().minusDays((int)(Math.random() * 30));
                ingredient.setPurchaseDate(purchaseDate);
                
                // 유통기한 (구매일 + 1일 ~ 365일)
                int expiryDays = Integer.parseInt(ingredientData[2]);
                LocalDate expiryDate = purchaseDate.plusDays(expiryDays);
                ingredient.setExpiryDate(expiryDate);
                
                ingredient.setIsNotified(false);
                ingredient.setCreatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 30)));
                ingredient.setUpdatedAt(LocalDateTime.now().minusDays((int)(Math.random() * 10)));
                
                ingredientExpiryRepository.save(ingredient);
            }
        }
    }
    
    
    
    
}
