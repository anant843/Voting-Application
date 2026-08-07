import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, CheckCircle2, Loader2, Fingerprint } from 'lucide-react';

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold">Please login to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">Your Profile</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Info */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details and voting status</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Mail className="h-6 w-6" />
              </div>
                 <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Fingerprint className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Voter ID</p>
                <p className="text-lg font-semibold text-gray-900">{user.voterId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Account Role</p>
                <p className="text-lg font-semibold capitalize text-gray-900">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Voting Status</p>
                <p className={`text-lg font-semibold ${user.hasVoted ? 'text-green-600' : 'text-orange-600'}`}>
                  {user.hasVoted ? 'Vote Cast' : 'Not Yet Voted'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${user.isVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Verification</p>
                <p className={`text-lg font-semibold ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}