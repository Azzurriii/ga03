import { Link, Navigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield, Lock, Mail, Users, Zap, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function Dashboard() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/inbox" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navigation />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to SecureMail
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience the next generation of secure email communication with
            enterprise-grade authentication and seamless user experience.
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          )}
          {isAuthenticated && (
            <Button size="lg" asChild>
              <Link to="/inbox">Go to Inbox</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built with modern authentication standards and security best
            practices to keep your communication safe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Multi-factor authentication with email/password and Google
                Sign-In options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  JWT token-based authentication
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Automatic token refresh
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Secure session management
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Your data is encrypted and protected with industry-standard
                security protocols.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  End-to-end encryption
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Zero-knowledge architecture
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  GDPR compliant
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Intuitive Interface</CardTitle>
              <CardDescription>
                Clean, modern design that makes managing your emails effortless
                and enjoyable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Responsive design
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Dark mode support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Keyboard shortcuts
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Share, delegate, and collaborate seamlessly with your team
                members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Shared mailboxes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Role-based access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Real-time updates
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-yellow-600 mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Optimized performance ensures instant loading and smooth
                interactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Instant search
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Smart caching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Offline support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>OAuth 2.0 Integration</CardTitle>
              <CardDescription>
                Sign in with your Google account for seamless access without
                managing passwords.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Google Sign-In
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Secure OAuth flow
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  One-click authentication
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-white/90 text-lg">
                Join thousands of users who trust SecureMail for their
                communication needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/login">Create Your Account</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>
            &copy; 2024 SecureMail. Built with React, TypeScript, and shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  );
}
