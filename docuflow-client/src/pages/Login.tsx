import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios'; 
import { useAuth } from '../context/AuthContext'; // global brain

const Login = () => {
  // 1. Component State (React's short-term memory)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tools for navigating and updating global state
  const navigate = useNavigate();
  const { login } = useAuth(); // Grabbing the login function from our Brain

  // 2. The Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from refreshing!
    setError('');
    setIsLoading(true);

    try {
      // 3. Knock on the Bouncer's door
      const response = await api.post('/auth/login', { email, password });
      
      // 4. We got in! Save the token and user to the Global Brain
      login(response.data.token, response.data.user);
      
      // 5. Redirect the user to their DocuFlow dashboard
      navigate('/'); 
      
    } catch (err: any) {
      // 6. The Bouncer rejected us (wrong password, etc.)
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Sign in to DocuFlow
        </h2>

        {/* Display errors if the Bouncer kicks them out */}
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;