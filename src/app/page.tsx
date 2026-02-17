import Image from 'next/image';
import { Hero } from '@/components/landing/hero';
import { Navbar } from '@/components/landing/navbar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroBg = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 relative">
        {heroBg && (
          <Image
            src={heroBg.imageUrl}
            alt={heroBg.description}
            fill
            className="object-cover object-center -z-10"
            data-ai-hint={heroBg.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm -z-10" />
        <Hero />
      </main>
    </div>
  );
}
