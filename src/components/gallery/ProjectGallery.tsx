import React, { useState } from 'react';
import { galleryItems } from '../../data/galleryItems';
import { GalleryItem } from '../../types';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { Camera, Heart, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const ProjectGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'clothes' | 'nursery' | 'milestones' | 'atelier'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [customPhotos, setCustomPhotos] = useState<GalleryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const filters = [
    { id: 'all', label: 'All Photos' },
    { id: 'clothes', label: '👶 Baby Clothes' },
    { id: 'nursery', label: '🌿 Nursery Moments' },
    { id: 'milestones', label: '⭐ Milestones' },
    { id: 'atelier', label: '🧵 Vikas’s Atelier' },
  ];

  const allItems = [...galleryItems, ...customPhotos];

  const filteredItems = allItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const handleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    cozyAudio.playCelebration();
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const newPhoto: GalleryItem = {
        id: `user-photo-${Date.now()}`,
        title: 'Our Sweet Cuddle Miracle',
        category: 'milestones',
        image: reader.result as string,
        caption: 'Shared with love by a happy parent for the Cozy Cuddle community gallery.',
        photographer: 'Cuddle Family Moment',
        tags: ['BabyJoy', 'CozyCuddle', 'ParentLove'],
        likes: 12,
      };

      setCustomPhotos((prev) => [newPhoto, ...prev]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="gallery" className="w-full py-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-cozy-blush/60 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-accent inline-flex items-center gap-2">
          <Camera className="w-4 h-4 text-cozy-rose" /> Curated Moments & Project Showcase
        </span>
        <h2 className="text-3xl md:text-5xl font-black mt-3 text-[#3E2723] dark:text-white font-serif">
          Cozy Cuddle Moments Gallery
        </h2>
        <p className="text-sm md:text-base text-cozy-warmBrown/80 dark:text-cozy-night-textMuted max-w-2xl mx-auto mt-2 font-medium">
          A heart-melting gallery of handcrafted creations by Vikas Kumar, precious newborn slumbers, and smiling parent milestones.
        </p>
      </div>

      {/* Filter Tabs & Upload Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                cozyAudio.playSoftTap();
                setActiveFilter(f.id as any);
              }}
              className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition ${
                activeFilter === f.id
                  ? 'bg-cozy-rose text-white shadow-soft-glow scale-105'
                  : 'bg-white/80 dark:bg-cozy-night-card/80 text-cozy-warmBrown dark:text-cozy-night-textMuted border border-cozy-blush/40 dark:border-cozy-night-border'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Upload Customer Baby Photo Slot */}
        <label className="px-4 py-2 rounded-2xl bg-white/90 dark:bg-cozy-night-card border-2 border-dashed border-cozy-rose text-cozy-rose text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-cozy-blush/30 transition shadow-sm self-stretch sm:self-auto justify-center">
          <Plus className="w-4 h-4" />
          <span>{isUploading ? 'Adding Photo...' : '+ Share Your Baby’s Moment'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleSimulatedUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Masonry / Grid Photo Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isLiked = !!likedMap[item.id];
          return (
            <div
              key={item.id}
              onClick={() => {
                cozyAudio.playSoftTap();
                setSelectedPhoto(item);
              }}
              className="group relative rounded-4xl overflow-hidden bg-white/70 dark:bg-cozy-night-card/70 border border-cozy-blush/40 dark:border-cozy-night-border shadow-soft-clay cursor-pointer transform hover:-translate-y-1.5 transition-all duration-500"
            >
              <div className="aspect-4/3 overflow-hidden bg-cozy-cream dark:bg-cozy-night-cardHover">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700"
                />
              </div>

              {/* Hover overlay with story and heart */}
              <div className="p-5 flex flex-col justify-between bg-white/95 dark:bg-cozy-night-card/95 border-t border-cozy-blush/30 dark:border-cozy-night-border">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cozy-rose flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-cozy-gold" /> {item.photographer}
                  </span>
                  <h3 className="text-base font-bold text-[#3E2723] dark:text-white group-hover:text-cozy-rose transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-cozy-warmBrown/75 dark:text-cozy-night-textMuted line-clamp-2 mt-1">
                    {item.caption}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-cozy-blush/20 dark:border-cozy-night-border text-xs">
                  <div className="flex items-center gap-1.5">
                    {item.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cozy-blush/50 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-textMuted"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cozyAudio.playSparkle();
                      handleLike(item.id);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                      isLiked
                        ? 'bg-cozy-rose text-white'
                        : 'bg-cozy-cream dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-textMuted hover:text-cozy-rose'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{item.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightboxModal
        item={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onLike={handleLike}
        liked={selectedPhoto ? !!likedMap[selectedPhoto.id] : false}
      />
    </section>
  );
};