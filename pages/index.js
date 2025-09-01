
import { useState, useEffect } from 'react';
import Head from 'next/head';
import LanguageSelector from '../components/LanguageSelector';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [translated, setTranslated] = useState({});
  const [translating, setTranslating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section (mobile-optimized)
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = isMobile ? 80 : 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const sampleQuestions = [
    translated.sampleQ1 || "How to increase rice yield?",
    translated.sampleQ2 || "Best time to plant coconut?",
    translated.sampleQ3 || "Organic fertilizers for vegetables?",
    translated.sampleQ4 || "How to control pests naturally?",
    translated.sampleQ5 || "Soil preparation for pepper farming?"
  ];

  useEffect(() => {
    console.log('Language changed to:', language);
    if (language === 'en') {
      setTranslated({});
      return;
    }

    const translatePage = async () => {
      console.log('Starting translation for language:', language);
      setTranslating(true);
      try {
        const textsToTranslate = {
          heroTitle: "Kerala Farmers' AI Assistant",
          heroDesc: 'Get instant, intelligent farming advice powered by AI. Ask questions in your preferred language and receive personalized solutions for Kerala\'s unique agricultural conditions.',
          cta: 'Start Asking Questions →',
          learnMore: 'Learn More',
          whyTitle: 'Why Choose Kera Farm Mitra?',
          whyDesc: 'Advanced AI technology meets traditional Kerala farming wisdom to provide you with the best agricultural guidance.',
          multiLang: 'Multi-Language Support',
          askTitle: 'Ask Your Farming Question',
          askDesc: 'Our AI assistant is ready to help you with any agriculture-related query',
          aiAnswer: 'AI Answer:',
          techTitle: 'Empowering Kerala Farmers with AI',
          techDesc: "Our AI assistant combines cutting-edge technology with deep knowledge of Kerala's agricultural practices. From traditional farming methods to modern techniques, we provide comprehensive support for all your farming needs.",
          cropGuidance: "Crop-specific guidance for Kerala's climate",
          support: "24/7 AI-powered support",
          multiLangFeature: "Multi-language communication",
          built: 'Built for Kerala farmers with 💚 | Hackathon 2024',
          empower: 'Empowering agriculture through artificial intelligence',
          copyright: '© 2024 Kera Farm Mitra. All rights reserved.',
          
          // Stats section
          keralaDistricts: "Kerala Districts",
          cropVarieties: "Crop Varieties", 
          languages: "Languages",
          
          // Feature cards
          aiPoweredTitle: "AI-Powered Intelligence",
          aiPoweredDesc: "Advanced machine learning algorithms specifically trained on Kerala's agricultural patterns, providing intelligent solutions for local farming challenges from Wayanad to Kuttanad.",
          keralaSpecificTitle: "Kerala-Specific Expertise",
          keralaSpecificDesc: "Deep knowledge of spice cultivation, coconut farming, rice paddies, and traditional Kerala agriculture integrated with modern sustainable practices.",
          multiLangDesc: "Communicate seamlessly in Malayalam, Hindi, Tamil, Telugu, and English - connecting Kerala's diverse farming communities through technology.",
          
          // Tech features
          realTimeWeather: "Real-time weather integration",
          marketPrices: "Market price updates",
          
          // Sample questions
          sampleQ1: "How to increase rice yield?",
          sampleQ2: "Best time to plant coconut?",
          sampleQ3: "Organic fertilizers for vegetables?",
          sampleQ4: "How to control pests naturally?",
          sampleQ5: "Soil preparation for pepper farming?",
          
          // Form elements
          questionPlaceholder: "Type your farming question here... (e.g., How to increase rice yield?)",
          features: "Features",
          askAI: "Ask AI"
        };

        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: textsToTranslate, target: language })
        });

        console.log('Translation response:', response.status);
        const data = await response.json();
        console.log('Translation data:', data);
        if (data.translations) {
          setTranslated(data.translations);
          console.log('Translations set successfully');
        }
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setTranslating(false);
      }
    };

    translatePage();
  }, [language]);

  // Add scroll progress bar functionality
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
      }
    };

    const handleScroll = () => {
      updateScrollProgress();
      
      // Header scroll effect
      const header = document.getElementById('header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer('Error getting answer.');
    }
    setLoading(false);
    setQuestion('');
  };

  return (
    <>
      <Head>
        <title>Kera Farm Mitra - AI Assistant for Kerala Farmers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="/styles/kerala-modern.css" />
      </Head>
      
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress" 
        id="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      ></div>
      
      <header id="header">
        <div className="header-content">
          <div className="logo" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
            <img src="/kerala-logo.svg" alt="Kera Farm Mitra" />
            <div>
              <h1>Kera <span>Farm</span></h1>
              <h2>Mitra</h2>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobile && (
            <div className="mobile-nav">
              <button 
                className="nav-button"
                onClick={() => scrollToSection('features')}
                style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#7cb342', fontSize: '0.9rem' }}
              >
                {translated.features || "Features"}
              </button>
              <button 
                className="nav-button"
                onClick={() => scrollToSection('ask-question')}
                style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#7cb342', fontSize: '0.9rem' }}
              >
                {translated.askAI || "Ask AI"}
              </button>
            </div>
          )}
          
          <LanguageSelector selected={language} onChange={setLanguage} />
        </div>
      </header>
      
      <main>
        {/* Modern Hero Section */}
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="hero-badge">🌾 Kerala's Smart Farming Revolution</div>
            <h2>
              <span className="highlight">God's Own Country's</span><br />
              {translated.heroTitle || "AI Farm Assistant"}
            </h2>
            <p>{translated.heroDesc || 'Experience the future of Kerala farming with AI-powered guidance. From Malabar\'s spice gardens to Kuttanad\'s rice fields, get intelligent solutions for sustainable agriculture in Malayalam, Hindi, Tamil, Telugu, and English.'}</p>
            
            <div className="hero-cta">
              <div className="cta-buttons">
                <button 
                  className="cta-button"
                  onClick={() => scrollToSection('ask-question')}
                  style={{ 
                    background: 'linear-gradient(135deg, #7cb342 0%, #689f38 100%)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    padding: isMobile ? '1rem 2rem' : '1.2rem 2.5rem'
                  }}
                >
                  {translated.cta || 'Start Asking Questions'} →
                </button>
                <button 
                  className="cta-button secondary"
                  onClick={() => scrollToSection('features')}
                  style={{ 
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    padding: isMobile ? '1rem 2rem' : '1.2rem 2.5rem'
                  }}
                >
                  {translated.learnMore || 'Learn More'}
                </button>
              </div>
            </div>

            <div className="stats">
              <div className="stat-item">
                <h3>14</h3>
                <p>{translated.keralaDistricts || "Kerala Districts"}</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>{translated.cropVarieties || "Crop Varieties"}</p>
              </div>
              <div className="stat-item">
                <h3>5</h3>
                <p>{translated.languages || "Languages"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider"></div>

        {/* Features Section */}
        <section className="features" id="features">
          <div className="section-header">
            <h2 className="section-title">{translated.whyTitle || 'Why Choose Kera Farm Mitra?'}</h2>
            <p className="section-subtitle">{translated.whyDesc || 'Advanced AI technology meets traditional Kerala farming wisdom to provide you with the best agricultural guidance.'}</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-brain"></i></div>
              <h3>{translated.aiPoweredTitle || "AI-Powered Intelligence"}</h3>
              <p>{translated.aiPoweredDesc || "Advanced machine learning algorithms specifically trained on Kerala's agricultural patterns, providing intelligent solutions for local farming challenges from Wayanad to Kuttanad."}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-globe"></i></div>
              <h3>{translated.multiLang || 'Multi-Language Support'}</h3>
              <p>{translated.multiLangDesc || "Communicate seamlessly in Malayalam, Hindi, Tamil, Telugu, and English - connecting Kerala's diverse farming communities through technology."}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-leaf"></i></div>
              <h3>{translated.keralaSpecificTitle || "Kerala-Specific Expertise"}</h3>
              <p>{translated.keralaSpecificDesc || "Deep knowledge of spice cultivation, coconut farming, rice paddies, and traditional Kerala agriculture integrated with modern sustainable practices."}</p>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider"></div>

        {/* Question Section */}
        <section id="ask-question" className="question-section">
          <div className="question-container">
            <div className="question-box">
              <div className="section-header">
                <h2 className="section-title">{translated.askTitle || 'Ask Your Farming Question'}</h2>
                <p className="section-subtitle">{translated.askDesc || 'Our AI assistant is ready to help you with any agriculture-related query'}</p>
              </div>
              
              <div className="chip-list">
                {sampleQuestions.map((q, i) => (
                  <div className="chip" key={i} onClick={() => setQuestion(q)}>
                    {q}
                  </div>
                ))}
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder={translated.questionPlaceholder || "Type your farming question here... (e.g., How to increase rice yield?)"}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={e => { 
                    if (e.key === 'Enter' && !loading && question.trim()) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  disabled={loading}
                />
                <button onClick={handleAsk} disabled={loading || !question.trim()}>
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                </button>
              </div>
              
              {answer && (
                <div className="answer-box">
                  <strong>{translated.aiAnswer || 'AI Answer:'}</strong> {answer}
                </div>
              )}
              
              {translating && (
                <div className="translating">
                  Translating page...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider"></div>

        {/* Technology Section */}
        <section className="technology" id="technology">
          <div className="section-header">
            <h2 className="section-title">{translated.techTitle || 'Empowering Kerala Farmers with AI'}</h2>
          </div>
          
          <div className="tech-content">
            <div className="tech-image">
              <i className="fas fa-tractor"></i>
            </div>
            <div className="tech-text">
              <p>{translated.techDesc || "Our AI assistant combines cutting-edge technology with deep knowledge of Kerala's agricultural practices. From traditional farming methods to modern techniques, we provide comprehensive support for all your farming needs."}</p>
              <ul className="tech-features">
                <li><i className="fas fa-check-circle"></i> {translated.cropGuidance || "Crop-specific guidance for Kerala's climate"}</li>
                <li><i className="fas fa-check-circle"></i> {translated.support || "24/7 AI-powered support"}</li>
                <li><i className="fas fa-check-circle"></i> {translated.multiLangFeature || "Multi-language communication"}</li>
                <li><i className="fas fa-check-circle"></i> {translated.realTimeWeather || "Real-time weather integration"}</li>
                <li><i className="fas fa-check-circle"></i> {translated.marketPrices || "Market price updates"}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <button 
          className="fab"
          onClick={() => scrollToSection('ask-question')}
          title="Ask a Question"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #7cb342 0%, #689f38 100%)',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(124, 179, 66, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="fas fa-question"></i>
        </button>
      )}

      <footer>
        <div className="footer-content">
          <div className="footer-logo">Kera Farm Mitra</div>
          <p className="footer-text">{translated.built || 'Built with 💚 for God\'s Own Country | Empowering Kerala Farmers 2024'}</p>
          <p className="footer-text">{translated.empower || 'From Malabar\'s spice gardens to Kuttanad\'s rice fields - AI for sustainable agriculture'}</p>
          <div className="copyright">
            <p>{translated.copyright || '© 2024 Kera Farm Mitra. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
