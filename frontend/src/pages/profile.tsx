import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/auth';

export default function Profile() {
  const { user, getProfile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      getProfile().catch(() => {
        router.push('/login');
      });
    }
  }, [user, getProfile, router]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Profile Information</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div 
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                  style={{ width: '100px', height: '100px' }}
                >
                  <span className="display-4">{typeof user.username === 'string' ? user.username[0].toUpperCase() : ''}</span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="form-label text-muted">Username</label>
                    <div className="form-control-plaintext border rounded px-3 py-2">
                      {typeof user.username === 'string' ? user.username : ''}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="form-label text-muted">Role</label>
                    <div className="form-control-plaintext border rounded px-3 py-2">
                      {user?.role?.name || 'user'}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="mb-4">
                    <label className="form-label text-muted">Email Address</label>
                    <div className="form-control-plaintext border rounded px-3 py-2">
                      {typeof user.email === 'string' ? user.email : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/orders')}
                >
                  View Orders
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => router.push('/')}
                >
                  Go to Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
