// src/components/layout/branding-customizer.tsx
'use client';

import { useState } from 'react';
import { useBranding } from '@/context/branding-context';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface BrandingCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandingCustomizer({ open, onOpenChange }: BrandingCustomizerProps) {
  const { logo, setLogo } = useBranding();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(logo);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check for file type and size
      if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload a PNG, JPG, or SVG file.',
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
            variant: 'destructive',
            title: 'File Too Large',
            description: 'Please upload a file smaller than 2MB.',
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (preview) {
      setLogo(preview);
      toast({
        title: 'Branding Updated',
        description: 'Your new logo has been applied.',
      });
      onOpenChange(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setPreview(null);
    setSelectedFile(null);
     toast({
        title: 'Logo Removed',
        description: 'The company logo has been removed.',
      });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Customize Branding</SheetTitle>
          <SheetDescription>
            Tailor the look and feel of your forms to match your company's brand.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8 space-y-6">
            <div className='space-y-2'>
                <Label htmlFor='logo-upload'>Company Logo</Label>
                <Input id="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleFileChange} />
                <p className="text-sm text-muted-foreground">Upload a PNG, JPG, or SVG file (max 2MB).</p>
            </div>
            {preview && (
                <div className='space-y-2'>
                    <Label>Logo Preview</Label>
                    <div className="flex items-center justify-center p-4 border rounded-md bg-muted/50 h-32">
                        <Image src={preview} alt="Logo Preview" width={100} height={100} className="max-h-full max-w-full object-contain" />
                    </div>
                </div>
            )}
        </div>
        <SheetFooter>
            {logo && (
                 <Button variant="destructive" onClick={handleRemoveLogo} className="mr-auto">Remove Logo</Button>
            )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleApply} disabled={!preview}>Apply Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}