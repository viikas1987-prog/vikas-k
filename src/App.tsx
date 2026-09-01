import React, { useState, useEffect } from 'react';
import { PhotoNavbar } from './components/layout/PhotoNavbar';
import { PhotoHeroSection } from './components/sections/PhotoHeroSection';
import { ToonhubCarouselSection } from './components/sections/ToonhubCarouselSection';
import { NewestProductsSection } from './components/shop/NewestProductsSection';

import { CustomEmbroideryStudio } from './components/interactive/CustomEmbroideryStudio';
import { BuildCuddleBox } from './components/interactive/BuildCuddleBox';
import { SoftnessMeter } from './components/interactive/SoftnessMeter';
import { BubblePopGame } from './components/interactive/BubblePopGame';
import { MilestoneQuiz } from './components/interactive/MilestoneQuiz';
import { ProjectGallery } from './components/gallery/ProjectGallery';

import { FounderStory } from './components/sections/FounderStory';
import { AmazonReviewsSection } from './components/sections/AmazonReviewsSection';
import { TrustBadges } from './components/sections/TrustBadges';
import { ThankYouEndSection } from './components/sections/ThankYouEndSection';
import { Footer } from './components/layout/Footer';

import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { CartDrawer } from './components/shop/CartDrawer';
import { CheckoutOrderModal } from './components/shop/CheckoutOrderModal';
import { OrderTrackingModal } from './components/shop/OrderTrackingModal';
import { FloatingSoundBar } from './components/layout/FloatingSoundBar';
import { AdminStandalonePage } from './components/admin/AdminStandalonePage';
import { Truck } from 'lucide-react';
import { cozyAudio } from './utils/audioSynth';

import { Product } from './types';

export const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(() => {
    return (
      window.location.hash.toLowerCase().includes('track') ||
      window.location.search.toLowerCase().includes('track')
    );
  });
  const [trackingInitialOrderId, setTrackingInitialOrderId] = useState('');

  const [isAdminPage, setIsAdminPage] = useState<boolean>(() => {
    return (
      window.location.hash.toLowerCase().includes('admin') ||
      window.location.search.toLowerCase().includes('admin') ||
      window.location.pathname.toLowerCase().includes('admin')
    );
  });

  useEffect(() => {
    const handleHashChange = () => {
      const isNowAdmin =
        window.location.hash.toLowerCase().includes('admin') ||
        window.location.search.toLowerCase().includes('admin') ||
        window.location.pathname.toLowerCase().includes('admin');
      setIsAdminPage(isNowAdmin);

      if (window.location.hash.toLowerCase().includes('track') || window.location.search.toLowerCase().includes('track')) {
        setIsTrackingModalOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // 1. IF ADMIN PORTAL URL: Render Dedicated Isolated Admin Page
  if (isAdminPage) {
    return (
      <AdminStandalonePage
        onReturnToStore={() => {
          window.location.hash = '';
          setIsAdminPage(false);
        }}
      />
    );
  }

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 2. STANDARD CLEAN CUSTOMER STOREFRONT
  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#1F2937] font-inter selection:bg-[#FF6B6B] selection:text-white">
      
      {/* Top Clean Customer Navbar */}
      <PhotoNavbar
        onNavigate={scrollToSection}
        onOpenTracking={() => {
          setTrackingInitialOrderId('');
          setIsTrackingModalOpen(true);
        }}
      />

      {/* 1. TOONHUB 3D Character Figurine Carousel */}
      <div id="toonhub" className="pt-2">
        <ToonhubCarouselSection />
      </div>

      {/* 2. Main Photo Promo Hero Section */}
      <PhotoHeroSection
        onShopNow={() => scrollToSection('catalog')}
        onExploreBags={() => scrollToSection('catalog')}
      />

      {/* 3. Newest Products in Indian Rupees (₹) */}
      <NewestProductsSection
        onOpenQuickView={(p) => setSelectedProduct(p)}
      />

      {/* 4. Interactive 3D Customizer Studio */}
      <div id="customizer">
        <CustomEmbroideryStudio />
      </div>

      {/* 5. Build Cuddle Gift Box */}
      <div id="gift-studio">
        <BuildCuddleBox />
      </div>

      {/* 6. Softness & Sensorial Meter */}
      <SoftnessMeter />

      {/* 7. Bubble Pop Mini Delight */}
      <BubblePopGame />

      {/* 8. Nursery Milestone Quiz */}
      <MilestoneQuiz />

      {/* 9. Live Moments Project Gallery */}
      <div id="gallery">
        <ProjectGallery />
      </div>

      {/* 10. Amazon India Verified Customer Reviews */}
      <AmazonReviewsSection />

      {/* 11. Founder Story */}
      <div id="about">
        <FounderStory />
      </div>

      {/* 12. Trust Badges */}
      <TrustBadges />

      {/* 13. Thank You End Section */}
      <ThankYouEndSection />

      {/* 14. Footer */}
      <Footer />

      {/* FLOATING ACTION: 🚚 TRACK YOUR ORDER (ALWAYS VISIBLE) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => {
            cozyAudio.playSoftTap();
            setTrackingInitialOrderId('');
            setIsTrackingModalOpen(true);
          }}
          className="px-4 py-3 rounded-full bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs shadow-2xl flex items-center gap-2 cursor-pointer transition transform hover:scale-105 active:scale-95 border-2 border-white/60"
          title="Track Live Shipment Status"
        >
          <Truck className="w-4 h-4" />
          <span>🚚 Track Order</span>
        </button>
      </div>

      {/* MODALS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer />

      <CheckoutOrderModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenTracking={(ordId) => {
          setTrackingInitialOrderId(ordId);
          setIsTrackingModalOpen(true);
        }}
      />

      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        initialOrderId={trackingInitialOrderId}
      />

      <FloatingSoundBar />

    </div>
  );
};

export default App;
