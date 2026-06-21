import { CTASection } from "./components/CTASection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HeroSection } from "./components/HeroSection";
import { LandingFooter } from "./components/LandingFooter";
import { LandingNavbar } from "./components/LandingNavbar";
import { StatsSection } from "./components/StatsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-blue-50/30 to-white">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
