import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Inbox as InboxIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function Inbox() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Inbox</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InboxIcon className="h-5 w-5" />
                Your Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500">
                  When you receive messages, they'll appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
