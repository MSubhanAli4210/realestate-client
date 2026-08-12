import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signup } from './authSlice';
import AuthLayout from '../../components/AuthLayout';
import FormField from '../../components/FormField';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(signup(formData));
    if (signup.fulfilled.match(result)) navigate('/');
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="List properties or start browsing in minutes."
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <p className="text-red-600 text-sm mb-4 -mt-2">{error}</p>
        )}

        <FormField
          label="Username"
          type="text"
          name="username"
          placeholder="janedoe"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-stone py-3 mt-2 font-medium tracking-wide hover:bg-brass transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-sm text-slate text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brass hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}