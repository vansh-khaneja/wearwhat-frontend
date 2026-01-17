import { Header } from "@/components/Header/header";
import { HeroSection } from "@/components/home/hero-section";
import { ScrollingLogos } from "@/components/home/scrolling-logos";
import { FeaturesSection } from "@/components/home/features-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/Footer/footer";
import { HeroImageCarousel } from "@/components/home/HeroImageCarousel";

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, #f8f8f8 0%, #eeeeee 30%, #e5ddd3 70%, #d9c9b5 100%)
          `,
        }}
      ></div>
      <div className="relative z-10">
        <Header />
        <main className="min-h-screen overflow-x-hidden w-full pt-20">
          <div className="flex min-h-[calc(100vh-80px)] w-full relative">
            <div className="w-1/2 flex items-center justify-start pl-8 lg:pl-12 pr-0 relative z-30">
              <HeroSection />
            </div>
            <div className="w-1/2 hidden lg:flex items-center justify-center px-8 lg:px-16 overflow-visible relative z-10">
              <HeroImageCarousel />
            </div>
          </div>
        </main>
        <ScrollingLogos />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
