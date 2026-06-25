import { CTASection } from "./components/CTASection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HeroSection } from "./components/HeroSection";
import { LandingFooter } from "./components/LandingFooter";
import { LandingNavbar } from "./components/LandingNavbar";
import { StatsSection } from "./components/StatsSection";

export default function Home() {
  return (
    <div className="from-background via-brand-100/10 to-background dark:via-brand-950/20 text-foreground min-h-screen bg-linear-to-br">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
