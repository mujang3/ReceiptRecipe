# ReceiptRecipe 🍳📄

영수증 OCR과 레시피 추천을 결합한 스마트 플랫폼

## 📋 프로젝트 소개

영수증을 스캔하여 Google Vision OCR로 텍스트를 추출하고, Google Gemini AI를 활용하여 구매한 재료를 기반으로 맛있는 레시피를 추천해주는 서비스입니다.

### ✨ 주요 특징
- **🤖 AI 기반**: Google Vision OCR + Gemini AI로 정확한 영수증 분석
- **🍳 스마트 추천**: 구매한 재료를 바탕으로 맞춤형 레시피 추천
- **👥 활발한 커뮤니티**: 다양한요리사가 많은 레시피를 공유
- **🔓 비로그인 접근**: 로그인 없이도 모든 기능 이용 가능
- **📱 반응형 UI**: Ant Design 기반의 현대적이고 직관적인 인터페이스

## 📱 주요 페이지

- **🏠 홈**: http://localhost:3000
- **📊 대시보드**: http://localhost:3000/dashboard
- **🍳 레시피**: http://localhost:3000/recipes
- **👥 커뮤니티**: http://localhost:3000/community
- **📄 영수증 업로드**: http://localhost:3000/receipts/upload

## 🛠️ 기술 스택

**Frontend**: React 18 + TypeScript + Ant Design + React Router  
**Backend**: Spring Boot 3.2.0 + Spring Security + JPA + MySQL 8.0  
**AI**: Google Vision OCR + Google Gemini AI

## 📋 시스템 요구사항

- **Java**: 17+
- **Node.js**: 18+
- **MySQL**: 8.0+ (또는 Docker)

## 🎯 주요 기능

- **📄 영수증 OCR**: Google Vision OCR로 영수증 이미지에서 텍스트 자동 추출
- **🤖 AI 파싱**: Gemini AI로 매장명, 구매일, 금액, 상품목록 자동 파싱
- **🍳 레시피 추천**: 구매한 재료를 바탕으로 맞춤형 레시피 추천
- **👥 커뮤니티**: 사용자들이 레시피를 공유하고 소통할 수 있는 공간
- **📊 대시보드**: 개인 구매 패턴과 레시피 활동 분석
- **🏷️ 태그 관리**: 재료와 레시피를 체계적으로 분류


