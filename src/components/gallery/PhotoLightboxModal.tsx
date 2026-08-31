import React from 'react';
import { GalleryItem } from '../../types';
import { X, Heart, Sparkles, Camera } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface PhotoLightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onLike: (id: string) => void;
  liked: boolean;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  item,
  onClose,
  onLike,
  liked,
}) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FFFDF9] dark:bg-cozy-night-card rounded-5xl overflow-hidden shadow-2xl border border-cozy-blush/60 dark:border-cozy-night-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 dark:bg-cozy-night-cardHover flex items-center justify-center text-cozy-warmBrown dark:text-white hover:bg-cozy-rose hover:text-white transition shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Photo */}
          <div className="md:col-span-7 bg-black flex items-center justify-center max-h-[460px]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover max-h-[460px]"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cozy-rose uppercase tracking-wider mb-1">
                <Camera className="w-3.5 h-3.5" /> {item.photographer}
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] dark:text-white font-serif">
                {item.title}
              </h3>
              <p className="text-xs text-cozy-warmBrown/80 dark:text-cozy-night-textMuted mt-2 leading-relaxed">
                {item.caption}
              </p>

              {item.featuredStory && (
                <div className="mt-4 p-3 rounded-2xl bg-cozy-cream dark:bg-cozy-night-cardHover border border-cozy-blush/40 dark:border-cozy-night-border">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cozy-rose block mb-0.5">
                    Memorable Story:
                  </span>
                  <p className="text-xs italic text-cozy-warmBrown dark:text-cozy-night-accent leading-snug">
                    "{item.featuredStory}"
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mt-4">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-cozy-blush/50 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-textMuted"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-cozy-blush/30 dark:border-cozy-night-border flex items-center justify-between mt-4">
              <button
                onClick={() => {
                  cozyAudio.playSparkle();
                  onLike(item.id);
                }}
                className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition ${
                  liked
                    ? 'bg-cozy-rose text-white shadow-soft-glow'
                    : 'bg-cozy-cream dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-white hover:bg-cozy-rose hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{item.likes + (liked ? 1 : 0)} Cuddles</span>
              </button>

              <span className="text-[10px] text-cozy-warmBrown/60 dark:text-cozy-night-textMuted">
                ✨ Verified Cuddle Moment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};