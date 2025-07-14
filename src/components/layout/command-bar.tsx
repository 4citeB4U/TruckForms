// src/components/layout/command-bar.tsx
'use client';
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCommand } from '@/context/command-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseCommand } from '@/ai/flows/command-parser-flow';

export function CommandBar() {
  const { isCommandOpen, setCommandOpen } = useCommand();
  const [inputValue, setInputValue] = useState('');
  const [isAiPending, startAiTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!isCommandOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandOpen, setCommandOpen]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    startAiTransition(async () => {
        try {
            const result = await parseCommand({ command: inputValue });
            if (result.action === 'navigate' && result.details.slug) {
                const href = `/forms/${result.details.slug}`;
                toast({
                    title: 'Agent Lee:',
                    description: `Navigating to ${result.details.slug}...`,
                });
                router.push(href);
                setCommandOpen(false);
                setInputValue('');
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Agent Lee:',
                    description: "Sorry, I couldn't understand that command.",
                });
            }

        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not process the command.',
            });
        }
    });
  };

  return (
    <Dialog open={isCommandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Agent Lee Command Bar</DialogTitle>
          <DialogDescription>
            Tell Agent Lee what you need. For example, "Open the bill of lading."
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCommandSubmit}>
          <div className="flex w-full items-center space-x-2 mt-4">
            <Input
              placeholder="Type your command..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isAiPending}
            />
            <Button type="submit" size="icon" disabled={isAiPending || !inputValue}>
              {isAiPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
