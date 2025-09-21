import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import 'antd/dist/reset.css';
import './App.css';

// Components
import Layout from './components/Layout';
import { AuthProvider } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import ReceiptUploadPage from './pages/ReceiptUploadPage';
import ReceiptListPage from './pages/ReceiptListPage';
import ReceiptDetailPage from './pages/ReceiptDetailPage';
import RecipeListPage from './pages/RecipeListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import IngredientManagementPage from './pages/IngredientManagementPage';
import DashboardPage from './pages/DashboardPage';
import TagManagementPage from './pages/TagManagementPage';
import NotificationPage from './pages/NotificationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CommunityPage from './pages/CommunityPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';
import MyPage from './pages/MyPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <ConfigProvider locale={koKR}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* All routes with layout - no login required */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/receipt-upload" element={<ReceiptUploadPage />} />
                  <Route path="/receipts" element={<ReceiptListPage />} />
                  <Route path="/receipts/:id" element={<ReceiptDetailPage />} />
                  <Route path="/recipes" element={<RecipeListPage />} />
                  <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/ingredients" element={<IngredientManagementPage />} />
                  <Route path="/tags" element={<TagManagementPage />} />
                  <Route path="/notifications" element={<NotificationPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/community/create" element={<CreatePostPage />} />
                  <Route path="/community/posts/:id" element={<PostDetailPage />} />
                  <Route path="/community/posts/:id/edit" element={<EditPostPage />} />
                  <Route path="/profile" element={<MyPage />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
