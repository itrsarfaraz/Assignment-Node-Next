import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const { register: registerUser, isLoading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.username, data.email, data.password);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Create your account</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters'
                      }
                    })}
                    type="text"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    id="username"
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password.message}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>

                <div className="text-center">
                  <Link href="/login" className="text-decoration-none">
                    Already have an account? Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
