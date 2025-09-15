'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

const languageNames: { [key: string]: string } = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  bn: 'বাংলা',
  te: 'తెలుగు',
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // This regex replaces the current locale in the path with the new one
    const newPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, `/${newLocale}$1`);
    router.replace(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languageNames).map(([langCode, langName]) => (
          <DropdownMenuItem
            key={langCode}
            onClick={() => handleLanguageChange(langCode)}
            disabled={locale === langCode}
          >
            {langName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
