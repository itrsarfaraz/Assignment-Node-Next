import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, getProfile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getProfile();
    }
  }, [getProfile]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link href="/" className="navbar-brand">
            E-Commerce
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link href="/products" className="nav-link">
                      Products
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/orders" className="nav-link">
                      Orders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/profile" className="nav-link">
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-primary ms-2"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link href="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">{children}</main>
    </div>
  );
}
