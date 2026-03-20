import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout';
import KnowledgeMap from '@pages/KnowledgeMap';
import NodeEditor from '@pages/NodeEditor';
import Login from '@pages/Login';
import Register from '@pages/Register';
import AdminDashboard from '@pages/admin/Dashboard';
import UserManagement from '@pages/admin/UserManagement';
import Analytics from '@pages/admin/Analytics';
import Settings from '@pages/admin/Settings';
import AuthProvider from '@components/AuthProvider';
import ProtectedRoute from '@components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<KnowledgeMap />} />
            <Route path="node/:id" element={<NodeEditor />} />
            <Route path="node/new" element={<NodeEditor />} />

            {/* 管理后台 */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requireRole={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Analytics />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
