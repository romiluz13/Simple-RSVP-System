import { Layout as AntLayout, Menu } from 'antd';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

const { Header, Content, Footer } = AntLayout;

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, login, logout, user } = useAuth();

  return (
    <AntLayout className="min-h-screen">
      <Header className="flex items-center justify-between">
        <div className="text-white text-xl font-bold">
          <Link href="/">AI Developer's Launch Pad</Link>
        </div>
        <Menu theme="dark" mode="horizontal" className="w-auto">
          {isAuthenticated ? (
            <>
              <Menu.Item key="dashboard">
                <Link href="/dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="profile">
                <Link href="/profile">Profile</Link>
              </Menu.Item>
              <Menu.Item key="logout" onClick={() => logout()}>
                Logout
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="login" onClick={() => login()}>
              Login
            </Menu.Item>
          )}
        </Menu>
      </Header>

      <Content className="p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </Content>

      <Footer className="text-center">
        AI Developer's Launch Pad ©{new Date().getFullYear()}
      </Footer>
    </AntLayout>
  );
}; 