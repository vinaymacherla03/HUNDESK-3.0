
import React from 'react';

const logos = [
    { name: 'Google', url: 'https://logo.clearbit.com/google.com' },
    { name: 'Microsoft', url: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Spotify', url: 'https://logo.clearbit.com/spotify.com' },
    { name: 'Amazon', url: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Netflix', url: 'https://logo.clearbit.com/netflix.com' },
    { name: 'Airbnb', url: 'https://logo.clearbit.com/airbnb.com' },
    { name: 'Uber', url: 'https://logo.clearbit.com/uber.com' },
    { name: 'Stripe', url: 'https://logo.clearbit.com/stripe.com' },
    { name: 'Slack', url: 'https://logo.clearbit.com/slack.com' },
    { name: 'Meta', url: 'https://logo.clearbit.com/meta.com' },
    { name: 'Apple', url: 'https://logo.clearbit.com/apple.com' },
    { name: 'Notion', url: 'https://logo.clearbit.com/notion.so' },
];

const LogoTicker = ({ direction = 'left' }: { direction?: 'left' | 'right' }) => (
    <div className="relative flex overflow-hidden group">
        <div className={`flex gap-8 py-4 animate-scroll-${direction} group-hover:[animation-play-state:paused]`}>
            {/* Triple duplication for smooth infinite scroll */}
            {[...logos, ...logos, ...logos].map((logo, idx) => (
                <div 
                    key={`${logo.name}-${idx}-${direction}`}
                    className="relative w-32 h-16 flex-shrink-0 flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-slate-200 hover:-translate-y-1 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 cursor-default group/card"
                >
                    <img 
                        src={logo.url} 
                        alt={logo.name} 
                        className="h-8 w-auto object-contain max-w-[70%] transition-transform duration-300 group-hover/card:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            ))}
        </div>
    </div>
);

const SocialProof: React.FC = () => {
    return (
        <section className="py-24 bg-[#f2f1ed] relative overflow-hidden border-b border-slate-200/50">
            <div className="container mx-auto px-4 text-center mb-16">
                <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 shadow-sm">
                    Trusted by Top Talent
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight max-w-2xl mx-auto">
                    Helping candidates land offers at the world's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">most innovative</span> companies.
                </h3>
            </div>

            <div className="relative flex flex-col gap-8">
                {/* Fade Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-60 bg-gradient-to-r from-[#f2f1ed] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-60 bg-gradient-to-l from-[#f2f1ed] to-transparent z-10 pointer-events-none" />

                <LogoTicker direction="left" />
                <LogoTicker direction="right" />
            </div>
        </section>
    );
};

export default SocialProof;
