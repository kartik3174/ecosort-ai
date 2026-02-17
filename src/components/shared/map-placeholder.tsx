import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';

export function MapPlaceholder({ showHeatmap = false }: { showHeatmap?: boolean }) {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-placeholder');

  if (!mapImage) {
    return (
      <Card className="aspect-video w-full flex items-center justify-center bg-muted">
        <p>Map could not be loaded.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden relative shadow-lg">
      <div className="aspect-video relative">
        <Image
          src={mapImage.imageUrl}
          alt={mapImage.description}
          layout="fill"
          objectFit="cover"
          data-ai-hint={mapImage.imageHint}
        />
        {showHeatmap && (
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 20% 30%, hsla(0, 100%, 50%, 0.4), transparent 30%), radial-gradient(circle at 75% 60%, hsla(0, 100%, 50%, 0.5), transparent 40%), radial-gradient(circle at 50% 80%, hsla(48, 100%, 50%, 0.4), transparent 25%)',
              mixBlendMode: 'multiply'
            }}
          />
        )}
      </div>
    </Card>
  );
}
