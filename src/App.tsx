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

import { Product } from './types';

export const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
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
      <PhotoNavbar onNavigate={scrollToSection} onOpenTracking={() => { setTrackingInitialOrderId(''); setIsTrackingModalOpen(true); }} />

      {/* 1. TOONHUB 3D Character Figurine Carousel */}
      <div id="toonhub" className="pt-2">
        <ToonhubCarouselSection />
      </div>

      {/* 2. Main Photo Promo Hero Section */}
      <PhotoHeroSection
        onShopNow={() => scrollToSection('catalog')}
        onExploreBags={() => scrollToSection('catalog')}
      />

      {/* 3. Newest Products in Indian Rupees (₹) matching photo */}
      <NewestProductsSection
        onOpenQuickView={(p) => setSelectedProduct(p)}
      />

      {/* 4. Interactive 3D Name Embroidery Customizer */}
      <CustomEmbroideryStudio />

      {/* 5. Build-a-Cuddle Keepsake Box Gift Chest */}
      <BuildCuddleBox />

      {/* 6. Sensory Softness Lab & GOTS Organic Certification */}
      <SoftnessMeter />

      {/* 7. Zen Baby Bubble Relaxation Corner */}
      <BubblePopGame />

      {/* 8. 30-Second Milestone Matcher Quiz */}
      <MilestoneQuiz />

      {/* 9. Curated Moments Photo Gallery */}
      <ProjectGallery />

      {/* 10. Founder's Corner: Vikas Kumar */}
      <FounderStory />

      {/* 11. Customer Reviews Hub & 5-Star Breakdown */}
      <AmazonReviewsSection />

      {/* 12. Trust Badges & Guarantee */}
      <TrustBadges />

      {/* 13. End of Page "THANK YOU" Celebration Finale Animation */}
      <ThankYouEndSection />

      {/* Footer with discreet staff link */}
      <Footer />

      {/* Global Modals & Drawers in Indian Rupees (₹) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigateToCustomizer={() => scrollToSection('customizer')}
      />
      <CartDrawer />
      <CheckoutOrderModal />
      <FloatingSoundBar />
    </div>
  );
};
export default App;
