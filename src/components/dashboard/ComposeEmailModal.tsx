import { useState } from 'react';
import { X, Send, Paperclip, Image, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmailMutations } from '@/hooks/useEmail';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'compose' | 'reply' | 'replyAll' | 'forward';
  mailboxId?: number;
  originalEmail?: {
    subject?: string;
    fromEmail?: string;
    fromName?: string;
    toEmails?: string[];
    ccEmails?: string[];
    bodyHtml?: string;
    bodyText?: string;
    gmailMessageId?: string;
    gmailThreadId?: string;
  };
}

export function ComposeEmailModal({ 
  isOpen, 
  onClose, 
  mode = 'compose',
  mailboxId,
  originalEmail 
}: ComposeEmailModalProps) {
  const { sendEmail } = useEmailMutations();
  
  const [to, setTo] = useState(() => {
    if (mode === 'reply' || mode === 'replyAll') {
      return originalEmail?.fromEmail || '';
    }
    return '';
  });
  
  const [cc, setCc] = useState(() => {
    if (mode === 'replyAll' && originalEmail?.ccEmails) {
      return originalEmail.ccEmails.join(', ');
    }
    return '';
  });
  
  const [subject, setSubject] = useState(() => {
    if (mode === 'reply' || mode === 'replyAll') {
      return `Re: ${originalEmail?.subject || ''}`;
    }
    if (mode === 'forward') {
      return `Fwd: ${originalEmail?.subject || ''}`;
    }
    return '';
  });
  
  const [body, setBody] = useState(() => {
    if (mode === 'reply' || mode === 'replyAll' || mode === 'forward') {
      const originalBody = originalEmail?.bodyText || originalEmail?.bodyHtml || '';
      const fromLine = `\n\n---\nOn ${new Date().toLocaleString()}, ${originalEmail?.fromName} <${originalEmail?.fromEmail}> wrote:\n\n`;
      return fromLine + originalBody;
    }
    return '';
  });
  
  const [showCc, setShowCc] = useState(mode === 'replyAll');

  if (!isOpen) return null;

  const handleSend = () => {
    console.log('ComposeEmailModal - mailboxId:', mailboxId);
    
    if (!mailboxId) {
      alert('No mailbox selected. Please ensure you have connected a mailbox.');
      console.error('Send failed: mailboxId is missing');
      return;
    }
    
    if (!to.trim()) {
      alert('Please enter at least one recipient');
      return;
    }
    
    // Parse comma-separated emails
    const toEmails = to.split(',').map(e => e.trim()).filter(Boolean);
    const ccEmails = cc ? cc.split(',').map(e => e.trim()).filter(Boolean) : undefined;
    
    sendEmail.mutate({
      mailboxId,
      to: toEmails,
      cc: ccEmails,
      subject: subject || '(No subject)',
      body,
      bodyHtml: body.replace(/\n/g, '<br>'), // Simple plain text to HTML conversion
      inReplyTo: (mode === 'reply' || mode === 'replyAll') ? originalEmail?.gmailMessageId : undefined,
      threadId: (mode === 'reply' || mode === 'replyAll') ? originalEmail?.gmailThreadId : undefined,
    }, {
      onSuccess: () => {
        onClose();
        // Reset form
        setTo('');
        setCc('');
        setSubject('');
        setBody('');
      },
      onError: (error: any) => {
        alert(`Failed to send email: ${error.message || 'Unknown error'}`);
      },
    });
  };

  const getTitle = () => {
    switch (mode) {
      case 'reply':
        return 'Reply';
      case 'replyAll':
        return 'Reply All';
      case 'forward':
        return 'Forward';
      default:
        return 'New Message';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{getTitle()}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {/* To Field */}
          <div className="flex items-center gap-2">
            <Label htmlFor="to" className="w-12 text-right text-sm text-gray-600">To</Label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipients"
                className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-blue-500 transition-colors"
              />
              {!showCc && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCc(true)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Cc
                </Button>
              )}
            </div>
          </div>

          {/* Cc Field */}
          {showCc && (
            <div className="flex items-center gap-2">
              <Label htmlFor="cc" className="w-12 text-right text-sm text-gray-600">Cc</Label>
              <Input
                id="cc"
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="Carbon copy"
                className="flex-1 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-blue-500 transition-colors"
              />
            </div>
          )}

          {/* Subject Field */}
          <div className="flex items-center gap-2">
            <Label htmlFor="subject" className="w-12 text-right text-sm text-gray-600">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-blue-500 transition-colors"
            />
          </div>

          {/* Body Field */}
          <div className="pt-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              className="w-full min-h-[300px] p-2 resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="Attach file"
              className="h-8 w-8"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Insert image"
              className="h-8 w-8"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Insert emoji"
              className="h-8 w-8"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Discard
            </Button>
            <Button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={sendEmail.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              {sendEmail.isPending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
