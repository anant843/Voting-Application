import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetToken('');
    setLoading(true);

    try {
      const response = await api.forgotPassword(email);
      setSuccess(response.message || 'Reset link sent successfully!');
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="flex flex-col items-center space-y-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                <p className="text-sm text-gray-500">{success}</p>
                {resetToken && (
                  <div className="mt-4 rounded-lg bg-orange-50 p-4 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-800"> Reset Password:</p>
                    <Link
                      to={`/reset-password/${resetToken}`}
                      className="mt-1 block break-all text-sm font-medium text-orange-600 hover:underline"
                    >
                      {window.location.origin}/reset-password/{resetToken}
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/login" className="w-full">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" /> 
                     <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-700" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/login" className="flex items-center space-x-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
