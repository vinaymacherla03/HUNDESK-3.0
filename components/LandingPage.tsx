
import React from 'react';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import SocialProof from './SocialProof';
import Pricing from './Pricing';
import Faq from './Faq';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import InteractiveHero from './InteractiveHero';


interface LandingPageProps {
    onGetStarted: () => void;
    draftExists: boolean;
    onLoadDraft: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, draftExists, onLoadDraft }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#f2f1ed]">
            {/* Using InteractiveHero instead of WelcomeHero as it contains the entry points */}
            <InteractiveHero onGetStarted={onGetStarted} draftExists={draftExists} onLoadDraft={onLoadDraft} />
            <Features />
            <HowItWorks />
            <SocialProof />
            <Testimonials />
            <Pricing />
            <Faq />
            <FinalCTA onGetStarted={onGetStarted} />
            <Footer />
        </div>
    );
};

export default LandingPage;
