
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/shared/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {useTranslations} from 'next-intl';
import LanguageSwitcher from '@/components/shared/language-switcher';
import { useUserPreferences } from '@/context/user-preferences-context';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('buyer');
  const t = useTranslations('LoginPage');
  const { pincode, setPincode } = useUserPreferences();
  const [localPincode, setLocalPincode] = useState(pincode || '');


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(localPincode.length === 6) {
        setPincode(localPincode);
    }
    if (role === 'buyer') {
      router.push('/marketplace');
    } else {
      router.push('/artisan-dashboard');
    }
  };

  const coverImage = PlaceHolderImages.find(p => p.id === 'login-cover') || PlaceHolderImages[0];

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
       <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="mx-auto" />
            <h1 className="text-3xl font-bold font-headline">{t('title')}</h1>
            <p className="text-balance text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
           <div className="space-y-2 text-center">
              <Label htmlFor="pincode">Enter your Pincode for a better experience</Label>
              <Input
                id="pincode"
                type="text"
                placeholder="e.g. 110001"
                maxLength={6}
                value={localPincode}
                onChange={(e) => setLocalPincode(e.target.value)}
                className="text-center text-lg h-12"
              />
               <p className="text-xs text-muted-foreground">This helps us estimate delivery times and costs.</p>
            </div>

          <Tabs defaultValue="buyer" onValueChange={setRole} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer">{t('buyerTab')}</TabsTrigger>
              <TabsTrigger value="artisan">{t('artisanTab')}</TabsTrigger>
            </TabsList>
            <form onSubmit={handleLogin}>
              <TabsContent value="buyer">
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="font-headline">{t('buyerTitle')}</CardTitle>
                    <CardDescription>
                      {t('buyerDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-buyer">{t('emailLabel')}</Label>
                      <Input id="email-buyer" type="email" placeholder="m@example.com" defaultValue="buyer@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-buyer">{t('passwordLabel')}</Label>
                      <Input id="password-buyer" type="password" defaultValue="password" required />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">{t('buyerButton')}</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="artisan">
                 <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="font-headline">{t('artisanTitle')}</CardTitle>
                    <CardDescription>
                      {t('artisanDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-artisan">{t('emailLabel')}</Label>
                      <Input id="email-artisan" type="email" placeholder="m@example.com" defaultValue="artisan@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-artisan">{t('passwordLabel')}</Label>
                      <Input id="password-artisan" type="password" defaultValue="password" required />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">{t('artisanButton')}</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {coverImage && (
          <Image
            src={coverImage.imageUrl}
            alt={coverImage.description}
            width="1280"
            height="800"
            data-ai-hint={coverImage.imageHint}
            className="h-full w-full object-cover dark:brightness-[0.3]"
          />
        )}
      </div>
    </div>
  );
}
