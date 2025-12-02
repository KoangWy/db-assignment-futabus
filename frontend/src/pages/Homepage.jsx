import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchForm from '../components/features/SearchForm';
import { FiCheckCircle, FiMap, FiShield } from 'react-icons/fi'; // Requires react-icons
import '../App.css';

export default function Homepage() {
    // Trimmed features list to match student project scope
    const features = [
        {
            icon: <FiMap />,
            title: 'Extensive network',
            desc: 'Connecting more than 20 provinces with hundreds of daily trips.',
        },
        {
            icon: <FiShield />,
            title: 'Safe & reliable',
            desc: 'Trusted bus partners with on-time, on-route commitments.',
        },
        {
            icon: <FiCheckCircle />,
            title: 'Easy booking',
            desc: 'Simple flow that locks seats instantly in just three steps.',
        },
    ];

    return (
        <>
            <Header />
            <main className="homepage">
                {/* === HERO SECTION === */}
                <section className="hero-simple">
                    <div className="hero-overlay">
                        <div className="hero-text">
                            <h1>Online Coach Ticket Booking System</h1>
                        </div>
                        
                        {/* Search form lives here */}
                        <div className="hero-search-container">
                            <SearchForm />
                        </div>
                    </div>
                </section>

                {/* === FEATURE SECTION (Keep to avoid empty space) === */}
                <section className="features-simple">
                    <div className="container">
                        <h2 className="section-title">Why choose us?</h2>
                        <div className="feature-grid-simple">
                            {features.map((f, index) => (
                                <div key={index} className="feature-item">
                                    <div className="feature-icon">{f.icon}</div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}