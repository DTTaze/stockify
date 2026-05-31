import { TrendingUp } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center space-x-3 md:mb-0">
            <TrendingUp className="hover:text-accent-500 h-8 w-8" />
            <span className="text-2xl font-light text-white">
              DRAGON PREDICT
            </span>
          </div>
          <div className="text-sm text-blue-100">
            © 2026 Dragon Predict. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
