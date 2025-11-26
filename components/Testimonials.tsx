
import React from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

const testimonials = [
    {
        quote: "The AI writer is a game-changer. It turned my boring job descriptions into powerful achievement statements.",
        name: "Michael R.",
        role: "Marketing Manager",
        avatar: "https://i.pravatar.cc/150?u=michael",
        company: "Spotify"
    },
    {
        quote: "I've always struggled with formatting. This tool made it so easy to create something that looks professional.",
        name: "Jessica L.",
        role: "UX/UI Designer",
        avatar: "https://i.pravatar.cc/150?u=jessica",
        company: "Airbnb"
    },
    {
        quote: "The job tracker is incredible. Visualizing my pipeline helped me stay organized and confident.",
        name: "David C.",
        role: "Junior Developer",
        avatar: "https://i.pravatar.cc/150?u=david",
        company: "StartUp Inc"
    },
    {
        quote: "I got three interviews in my first week using the 'Monarch' template. Highly recommended.",
        name: "Sarah K.",
        role: "Product Owner",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        company: "TechFlow"
    },
    {
        quote: "Simply the best resume builder I've used. And I've tried them all.",
        name: "James P.",
        role: "Sales Director",
        avatar: "https://i.pravatar.cc/150?u=james",
        company: "Salesforce"
    },
    {
        quote: "The keyword matching feature helped me get past the ATS bots finally.",
        name: "Emily W.",
        role: "Data Scientist",
        avatar: "https://i.pravatar.cc/150?u=emily",
        company: "Netflix"
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-24 sm:py-32 bg-[#F2F1ED]" id="testimonials">
            <motion.div
                className="container mx-auto px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-display font-bold text-slate-900 sm:text-4xl">
                        Loved by Professionals
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Join thousands of job seekers who have accelerated their careers.
                    </p>
                </motion.div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="break-inside-avoid bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-slate-500">{testimonial.role} at {testimonial.company}</p>
                                </div>
                            </div>
                            <blockquote className="text-slate-600 leading-relaxed text-sm">
                                "{testimonial.quote}"
                            </blockquote>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Testimonials;
