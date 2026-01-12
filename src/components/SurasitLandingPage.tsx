"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';

// Custom hook for scroll animations
const useInView = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Reset when leaving viewport, trigger when entering
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
};


// Animation wrapper component
const AnimateIn = ({
  children,
  animation = 'fadeUp',
  delay = 0,
  className = ''
}: {
  children: ReactNode;
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'flip';
  delay?: number;
  className?: string;
}) => {
  const { ref, isInView } = useInView();

  const animations: Record<string, string> = {
    fadeUp: 'translate-y-16 opacity-0',
    fadeLeft: '-translate-x-16 opacity-0',
    fadeRight: 'translate-x-16 opacity-0',
    scale: 'scale-75 opacity-0',
    flip: 'rotateY-90 opacity-0',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isInView ? 'translate-y-0 translate-x-0 scale-100 opacity-100 rotate-0' : animations[animation]
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};


// Landing Page สุรสิทธิ์ - พร้อม Navbar และปุ่ม Back to Top
const SurasitLandingPagePro = () => {
  const [count, setCount] = useState(0);
  const [activePolicy, setActivePolicy] = useState<number | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [videoClicked, setVideoClicked] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const prevSectionRef = useRef('hero');


  const navItems = [
    { id: 'hero', label: 'หน้าแรก' },
    { id: 'credentials', label: 'ประวัติ' },
    { id: 'gallery', label: 'รูปภาพ' },
    { id: 'solutions', label: 'นโยบาย' },
    { id: 'track-record', label: 'ผลงาน' },
    { id: 'vote', label: 'เลือกตั้ง' },
    { id: 'area', label: 'พื้นที่' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev + 1) % 360);
    }, 50);

    const electionDate = new Date('2026-02-08');
    const today = new Date();
    const diffTime = electionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays > 0 ? diffDays : 0);

    // Show/hide back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);

      // Update active section
      const sections = ['hero', 'credentials', 'gallery', 'solutions', 'track-record', 'vote', 'area'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Trigger hero animation after mount
    setTimeout(() => setHeroLoaded(true), 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto scroll nav menu to center active item (mobile only)
  useEffect(() => {
    // ตรวจสอบว่าเป็นมือถือไหม (width < 768px)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      if (navRef.current && navItemRefs.current[activeSection]) {
        const navContainer = navRef.current;
        const activeItem = navItemRefs.current[activeSection];

        if (!activeItem) return;

        const containerWidth = navContainer.clientWidth;
        const itemLeft = activeItem.offsetLeft;
        const itemWidth = activeItem.offsetWidth;

        // เลื่อนให้ active item อยู่ตรงกลาง container
        const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);

        navContainer.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }

    // อัพเดท previous section
    prevSectionRef.current = activeSection;
  }, [activeSection]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const district6Areas = [
    { num: '01', name: 'ต.บางพระ' },
    { num: '02', name: 'ต.ศรีราชา' },
    { num: '03', name: 'ต.สุรศักดิ์' },
    { num: '04', name: 'ต.ทุ่งสุขลา' },
    { num: '05', name: 'อ.เกาะสีชัง' },
  ];

  const solutions = [
    { num: '01', title: 'คนตัวเล็กตัวน้อย', desc: 'แก้เศรษฐกิจปากท้อง เติมชีวิตให้คนตัวเล็ก', result: 'ลดรายจ่าย เพิ่มรายได้ ชีวิตดีขึ้นทันที' },
    { num: '02', title: 'ผู้สูงวัย พลัส+', desc: 'ทักษะดี มีงาน มีเงิน มีคนดูแล', result: 'ผู้สูงอายุมีคุณค่า มีรายได้ มีความสุข' },
    { num: '03', title: 'ชุมชน พลัส+', desc: 'ผลิตของที่ใช่ ขายของที่ชอบ ตอบโจทย์ทุกคน', result: 'ชุมชนเข้มแข็ง พึ่งพาตนเองได้' },
    { num: '04', title: 'การศึกษาเท่าเทียม', desc: 'เรียนฟรีมีจริง เรียนฟรีมีงาน เรียนฟรีทุกที่ ทุกเวลา', result: 'ลูกหลานมีอนาคต ไม่ต้องเป็นหนี้การศึกษา' },
    { num: '05', title: 'SMEs ไทย พลัส+', desc: 'SME ไทย เติมทุนให้ ค้ำประกันไว้ สู้ได้ทุกแก็ก', result: 'ธุรกิจเติบโต สร้างงาน สร้างเงิน' },
    { num: '06', title: 'ลงทุน พลัส+', desc: 'เพิ่มการลงทุน รัฐร่วมทุน กระตุ้นโตยาว', result: 'เศรษฐกิจโต มีงานทำ รายได้เพิ่ม' },
    { num: '07', title: 'เศรษฐกิจสีเขียว', desc: 'รักษ์โลก คือทางรอด และทางรวยยั่งยืน', result: 'สิ่งแวดล้อมดี สุขภาพดี รายได้ยั่งยืน' },
    { num: '08', title: 'AI พลัส+', desc: 'AI ถึงมือ งานถึงตัว เงินถึงบ้าน', result: 'ก้าวทันโลก มีทักษะใหม่ รายได้เพิ่ม' },
    { num: '09', title: 'Trade พลัส+', desc: 'ค้าขายฉลาด อัปเกรดการผลิต ยึดตลาดโลก', result: 'สินค้าไทยไปทั่วโลก รายได้เข้าประเทศ' },
    { num: '10', title: 'ไทยแลนด์ พลัส+', desc: 'รัฐฉับไว อนุมัติไว ไม่มีกัก', result: 'ทำธุรกิจง่าย ไม่ต้องรอนาน' },
  ];

  const credentials = [
    { title: 'เนติบัณฑิตไทย', desc: 'สำนักอบรมกฎหมายแห่งเนติบัณฑิตยสภาฯ' },
    { title: 'ปริญญาโท', desc: 'บริหารการศึกษา ม.บูรพา' },
    { title: 'นิติศาสตรบัณฑิต', desc: 'มหาวิทยาลัยรามคำแหง' },
  ];

  const experiences = [
    { years: '12 ปี', role: 'สมาชิกสภาจังหวัดชลบุรี', period: '2523-2535' },
    { years: '4 สมัย', role: 'สมาชิกสภาผู้แทนราษฎร จังหวัดชลบุรี', period: '2538-2549' },
    { years: '4 ปี', role: 'สมาชิกสภาผู้แทนราษฎร แบบบัญชีรายชื่อ', period: '2562-2566' },
    { years: '1 ปี', role: 'กรรมการจริยธรรมสภาผู้แทนราษฎร', period: '2565-2566' },
  ];

  const trackRecords = [
    { num: '01', title: 'พัฒนาโครงสร้างพื้นฐาน', desc: 'ผลักดันถนน ไฟฟ้า ประปา เข้าถึงทุกหมู่บ้าน' },
    { num: '02', title: 'ส่งเสริมสาธารณสุข', desc: 'สนับสนุนโรงพยาบาล สถานีอนามัย' },
    { num: '03', title: 'ยกระดับการศึกษา', desc: 'ผลักดันทุนการศึกษา โรงเรียนมีคุณภาพ' },
    { num: '04', title: 'สร้างงาน สร้างอาชีพ', desc: 'ดึงการลงทุน สร้างโอกาสให้คนท้องถิ่น' },
  ];

  const areas = [
    { name: 'อำเภอเกาะสีชัง', tambons: ['ทั้งอำเภอ'] },
    { name: 'อำเภอศรีราชา', tambons: ['ต.บางพระ', 'ต.ศรีราชา', 'ต.สุรศักดิ์', 'ต.ทุ่งสุขลา'] },
  ];

  return (
    <div className="min-h-screen bg-blue-950 text-white overflow-hidden" style={{ fontFamily: "'Prompt', sans-serif" }}>
      {/* Animated Background - Diagonal Lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Moving gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${count}deg, transparent 0%, rgba(59, 130, 246, 0.05) 25%, transparent 50%, rgba(16, 185, 129, 0.05) 75%, transparent 100%)`,
          }}
        />
        {/* Diagonal lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[200vh] w-[2px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
            style={{
              left: `${15 + i * 15}%`,
              top: '-50%',
              transform: `rotate(${20 + i * 5}deg)`,
              animation: `slideDown ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
        {/* Floating squares */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`sq-${i}`}
            className="absolute"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${10 + i * 20}%`,
              top: `${15 + (i % 3) * 25}%`,
              border: '1px solid rgba(59, 130, 246, 0.15)',
              transform: `rotate(${45 + i * 10}deg)`,
              animation: `floatRotate ${6 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* ==================== */}
      {/* NAVBAR */}
      {/* ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-2 md:py-3">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <div className="flex items-center px-3 md:px-4 py-2 md:py-3 gap-2">
              {/* Logo - Left */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  onClick={() => scrollToSection('hero')}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                >
                  <Image src="/logo.jpg" alt="พรรคภูมิใจไทย" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs text-blue-300">พรรคภูมิใจไทย</div>
                  <div className="font-semibold text-sm">ชลบุรี เขต 6</div>
                </div>
              </div>

              {/* Navigation Menu - Center */}
              <div className="flex-1 min-w-0">
                {/* Mobile: scrollable */}
                <div className="block md:hidden relative">
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/10 to-transparent pointer-events-none z-10" />
                  <div
                    ref={navRef}
                    className="overflow-x-auto scrollbar-hide touch-pan-x"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    <div className="flex gap-2 px-1 py-1">
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          ref={(el) => { navItemRefs.current[item.id] = el; }}
                          onClick={() => scrollToSection(item.id)}
                          className={`px-4 py-2.5 rounded-full text-sm whitespace-nowrap transition-all flex-shrink-0 min-h-[40px] ${
                            activeSection === item.id
                              ? 'bg-white/25 text-white font-semibold'
                              : 'text-blue-200 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop: centered */}
                <div className="hidden md:block">
                  <div className="flex gap-1 justify-center">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                          activeSection === item.id
                            ? 'bg-white/25 text-white font-medium'
                            : 'text-blue-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vote Button - Right */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />
                  <button
                    onClick={() => scrollToSection('vote')}
                    className="relative px-3 md:px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                  >
                    เบอร์ 8
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== */}
      {/* HERO SECTION */}
      {/* ==================== */}
      <section id="hero" className="min-h-screen flex items-center pt-24 md:pt-24 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              {/* Call out audience */}
              <div className={`inline-block mb-4 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
                <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-sm md:text-base animate-bounce inline-block">
                  ชาวชลบุรี เขต 6 อ่านตรงนี้ก่อน
                </span>
              </div>

              {/* Main Message */}
              <h1 className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight transition-all duration-700 delay-100 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-cyan-400">ความมั่นคงของประเทศ</span>
                <br />
                การแก้ปัญหาประเทศ
              </h1>

              <p className={`text-xl md:text-3xl lg:text-4xl text-blue-200 mb-6 leading-relaxed transition-all duration-700 delay-200 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-white font-bold">อยู่ที่การเลือกพรรค</span>
              </p>

              <p className={`text-base md:text-lg lg:text-xl text-blue-300 mb-8 transition-all duration-700 delay-300 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-green-400 font-bold">อดีต สส. สว.</span> และผมรู้ว่า <span className="text-white font-semibold">ปัญหาจริงๆ ของคนชลบุรีคืออะไร...</span>
              </p>

              {/* Quick Stats with Counter Animation */}
              <div className={`flex flex-wrap justify-center lg:justify-start gap-4 mb-6 transition-all duration-700 delay-400 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="group px-5 py-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-green-500/50 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-4xl md:text-5xl font-black text-green-400 group-hover:animate-bounce">8</div>
                  <div className="text-sm md:text-base text-blue-300">กาเบอร์</div>
                </div>
                <div className="group px-5 py-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-sky-500/50 hover:scale-105 transition-all cursor-pointer">
                  <div className="text-4xl md:text-5xl font-black text-sky-400">{daysLeft}</div>
                  <div className="text-sm md:text-base text-blue-300">วันที่เหลือ</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className={`transition-all duration-700 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button
                  onClick={() => scrollToSection('credentials')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
                >
                  <span>ดูว่าผมจะช่วยคุณได้ยังไง</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile Card */}
            <div className={`flex justify-center transition-all duration-1000 delay-300 ${heroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="relative">
                {/* Orbiting Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 md:w-96 h-72 md:h-96 border-2 border-blue-500/30 rounded-full" style={{ animation: 'spin 20s linear infinite' }} />
                  <div className="absolute w-64 md:w-80 h-64 md:h-80 border border-green-500/20 rounded-full" style={{ animation: 'spin 15s linear infinite reverse' }} />
                </div>

                {/* Main Card */}
                <div className="relative w-80 md:w-[28rem] h-96 md:h-[34rem] overflow-hidden hover:scale-105 transition-transform">
                  <Image
                    src="/baner.png"
                    alt="สุรสิทธิ์ นิธิวุฒิวรรักษ์"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 288px, 384px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== */}
      {/* CREDENTIALS SECTION */}
      {/* ==================== */}
      <section id="credentials" className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-blue-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <AnimateIn animation="fadeUp" className="text-center mb-12">
            <span className="inline-block px-6 py-3 md:px-8 md:py-4 bg-cyan-500/30 border-2 border-cyan-400/50 rounded-full text-cyan-300 text-lg md:text-2xl font-bold mb-6 shadow-lg shadow-cyan-500/20">
              รู้จักพี่นิ่ม &quot;สุรสิทธิ์&quot;?
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              <span className="text-cyan-400">คนศรีราชา</span> ที่รับฟังรับรู้ปัญหา
            </h2>
            <p className="text-blue-300 text-base md:text-lg">
              <span className="text-white font-semibold">เข้าถึง เป็นคนทำงาน พึ่งพาได้</span>
            </p>
          </AnimateIn>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Education */}
            <AnimateIn animation="fadeLeft">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  การศึกษา
                </h3>
                <div className="space-y-4">
                  {credentials.map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                      <div className="font-semibold text-base md:text-lg text-cyan-400">{item.title}</div>
                      <div className="text-sm md:text-base text-blue-200">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            {/* Experience */}
            <AnimateIn animation="fadeRight">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  ประสบการณ์ทำงาน
                </h3>
                <div className="space-y-4">
                  {experiences.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                      <div className="text-2xl md:text-3xl font-black text-green-400 w-16 md:w-20">{item.years}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-base md:text-lg">{item.role}</div>
                        <div className="text-sm md:text-base text-blue-300">พ.ศ. {item.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* GALLERY SECTION */}
      {/* ==================== */}
      <section id="gallery" className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-blue-900/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <AnimateIn animation="fadeUp" className="text-center mb-12">
            <span className="inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-lg font-semibold mb-4">
              พบกับผู้สมัคร
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-cyan-400">สุรสิทธิ์</span> นิธิวุฒิวรรักษ์
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {['/sura1.png', '/sura2.png', '/sura3.png', '/sura4.png'].map((src, i) => (
              <AnimateIn key={i} animation="scale" delay={i * 120}>
                <div
                  onClick={() => setLightboxImage(src)}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 hover:border-cyan-500/50 transition-all hover:scale-105 cursor-pointer"
                >
                  <Image
                    src={src}
                    alt={`สุรสิทธิ์ นิธิวุฒิวรรักษ์ ${i + 1}`}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {/* Zoom Icon Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn animation="fadeUp" delay={300}>
            <div className="text-center mt-8">
              <p className="text-blue-300 text-base md:text-lg">
                <span className="text-cyan-400 font-bold">&quot;อดีต สส. นิ่ม&quot;</span> ประสบการณ์กว่า 40 ปี พร้อมทำงานเพื่อชาวชลบุรี
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SOLUTIONS SECTION */}
      {/* ==================== */}
      <section id="solutions" className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn animation="fadeUp" className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm md:text-base mb-4">
              ทางออกที่คุณรอคอย
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
              นโยบาย<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">เศรษฐกิจ 10 พลัส+</span>
            </h2>
            <p className="text-blue-300 text-base md:text-xl">แก้ตรงจุด <span className="text-green-400 font-semibold">เห็นผลจริง!</span></p>
            <p className="text-white mt-2 text-sm md:text-lg">5 ทั่วถึง + 5 คุณภาพ = ชีวิตดีขึ้นแน่นอน</p>
          </AnimateIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {solutions.map((item, i) => (
              <AnimateIn key={i} animation="fadeUp" delay={i * 80}>
                <div
                  onClick={() => setActivePolicy(activePolicy === i ? null : i)}
                  className={`group relative p-5 md:p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden h-full ${
                    activePolicy === i
                      ? 'bg-green-600/30 border-green-400/50 scale-105'
                      : 'bg-white/5 border-white/10 hover:border-green-500/30 hover:bg-white/10'
                  }`}
                >
                  <h4 className="font-bold text-base md:text-lg mb-2">{item.title}</h4>
                  <p className="text-sm md:text-base text-blue-200/80 mb-3">{item.desc}</p>
                  <div className={`text-sm p-2 rounded-lg transition-all ${activePolicy === i ? 'bg-green-500/20 text-green-300 opacity-100' : 'opacity-0 h-0 overflow-hidden sm:opacity-100 sm:h-auto bg-green-500/10 text-green-400'}`}>
                    <span className="font-semibold">ผลลัพธ์:</span> {item.result}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* TRACK RECORD SECTION */}
      {/* ==================== */}
      <section id="track-record" className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn animation="fadeUp" className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-sky-500/20 border border-sky-500/30 rounded-full text-sky-400 text-sm md:text-base mb-4">
              ผลงานที่ผ่านมา
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              <span className="text-sky-400">&quot;พูดแล้วทำ&quot;</span> <span className="text-green-400">พลัส</span>
            </h2>
            <p className="text-blue-300 text-base md:text-lg">
              <span className="text-white font-semibold">คนพื้นที่ เข้าใจ พร้อมรับฟัง และทำทันที</span>
            </p>
          </AnimateIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trackRecords.map((item, i) => (
              <AnimateIn key={i} animation="scale" delay={i * 150}>
                <div className="group p-6 bg-gradient-to-br from-sky-900/30 to-blue-900/30 rounded-2xl border border-sky-500/20 hover:border-sky-500/50 transition-all hover:-translate-y-2 h-full">
                  <h4 className="font-bold text-lg md:text-xl mb-2">{item.title}</h4>
                  <p className="text-sm md:text-base text-blue-200/70">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn animation="fadeUp" delay={200}>
            <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
              <div className="text-5xl font-serif text-white/20 mb-4">&quot;</div>
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-white mb-4 leading-relaxed">
                เรามาร่วม<span className="text-cyan-400">สร้างศรีราชา</span> <span className="text-green-400">ไปด้วยกันครับ</span>
              </blockquote>
              <cite className="text-blue-300 text-base md:text-lg">— สุรสิทธิ์ นิธิวุฒิวรรักษ์</cite>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ==================== */}
      {/* VOTE SECTION */}
      {/* ==================== */}
      <section id="vote" className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-green-900/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          <AnimateIn animation="scale">
            <div className="relative p-8 md:p-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-[2rem] overflow-hidden">
            {/* Animated Shapes */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Diagonal lines */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`line-${i}`}
                  className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"
                  style={{
                    left: `${10 + i * 12}%`,
                    transform: 'rotate(15deg)',
                    animation: `slideDown ${5 + i}s linear infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
              {/* Floating diamonds */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`diamond-${i}`}
                  className="absolute w-4 h-4 border border-white/20"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    transform: 'rotate(45deg)',
                    animation: `floatRotate ${4 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center">
              {/* Scarcity */}
              <div className="inline-block px-6 py-3 bg-red-500 rounded-full text-white font-bold mb-6 animate-pulse">
                เหลือเวลาอีกแค่ {daysLeft} วัน
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
                วันอาทิตย์ที่ 8 กุมภาพันธ์ 2569
              </h2>
              <p className="text-lg md:text-xl text-green-100 mb-2">เวลา 08.00 - 17.00 น.</p>
              <p className="text-base md:text-lg text-green-200 mb-8">
                เลือก สส.เขต (สส.แบบแบ่งเขต) <span className="font-bold">บัตรสีเขียว</span>
              </p>

              {/* CTA */}
              <div className="text-2xl md:text-3xl font-bold mb-4">
                8 กุมภา กาเบอร์ <span className="text-cyan-300">8</span>
              </div>

              <div className="inline-flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-2xl shadow-2xl">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-5xl md:text-6xl font-black text-green-600">8</span>
                </div>
                <div className="w-20 h-20 md:w-24 md:h-24 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-5xl md:text-6xl font-black text-red-500">✗</span>
                </div>
              </div>
            </div>
          </div>
          </AnimateIn>
        </div>
      </section>

      {/* ==================== */}
      {/* AREA SECTION */}
      {/* ==================== */}
      <section id="area" className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn animation="fadeUp" className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm md:text-base mb-4">
              พื้นที่เขตเลือกตั้ง
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ชลบุรี เขต 6 <span className="text-blue-400">คือบ้านของเรา</span>
            </h2>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-6">
            {areas.map((area, i) => (
              <AnimateIn key={i} animation={i === 0 ? "fadeLeft" : "fadeRight"}>
                <div className="group p-6 md:p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all h-full">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{area.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {area.tambons.map((tambon, j) => (
                      <span key={j} className="px-3 py-1.5 bg-blue-500/20 rounded-full text-blue-300 text-sm md:text-base border border-blue-500/30">
                        {tambon}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>


      {/* ==================== */}
      {/* SHARE SECTION */}
      {/* ==================== */}
      <section className="py-12 px-4 md:px-6 bg-gradient-to-b from-blue-950 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateIn animation="fadeUp">
            <h3 className="text-lg md:text-2xl font-bold mb-4">
              ช่วยกันแชร์ให้เพื่อน<span className="text-cyan-400">ชาวชลบุรี</span>รู้จัก
            </h3>
            <p className="text-blue-300 text-sm md:text-base mb-6">บอกต่อเพื่อน ครอบครัว และคนที่คุณรัก</p>

            <div className="flex flex-wrap justify-center gap-4">
              {/* Facebook Share */}
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://surasit-landing.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#1877F2] hover:bg-[#1877F2]/80 rounded-full font-bold transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>แชร์ Facebook</span>
              </a>

              {/* LINE Share */}
              <a
                href="https://social-plugins.line.me/lineit/share?url=https://surasit-landing.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#06C755] hover:bg-[#06C755]/80 rounded-full font-bold transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                <span>แชร์ LINE</span>
              </a>

              {/* Copy Link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://surasit-landing.vercel.app');
                  alert('คัดลอกลิงก์แล้ว!');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold transition-all hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>คัดลอกลิงก์</span>
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ==================== */}
      {/* FOOTER */}
      {/* ==================== */}
      <footer className="py-12 px-4 md:px-6 border-t border-white/10 bg-blue-950">
        <div className="max-w-7xl mx-auto">
          {/* Footer Info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image src="/logo.jpg" alt="พรรคภูมิใจไทย" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-lg">พรรคภูมิใจไทย</div>
                <div className="text-sm md:text-base text-blue-300">ชลบุรี เขต 6</div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-cyan-400 font-bold text-lg mb-1">พูดแล้วทำ พลัส+</div>
              <div className="text-blue-400 text-sm md:text-base">เคียงข้างประชาชน • ก้าวไปด้วยกันทุก Generation</div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-blue-400/50 text-sm">
            © 2569 สุรสิทธิ์ นิธิวุฒิวรรักษ์ • ผู้สมัคร สส. ชลบุรี เขต 6 พรรคภูมิใจไทย
          </div>
        </div>
      </footer>

      {/* ==================== */}
      {/* FLOATING BUTTONS */}
      {/* ==================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all shadow-lg ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="กลับด้านบน"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* LINE Button with QR */}
        <div className="group relative">
          {/* QR Popup */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-white rounded-2xl p-4 shadow-2xl">
              <div className="text-center mb-2">
                <span className="text-gray-800 font-bold text-sm">แอดไลน์ได้เลย!</span>
              </div>
              <Image src="/qr.jpg" alt="LINE QR Code" width={150} height={150} className="rounded-lg" />
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">สแกน QR หรือกดปุ่มด้านล่าง</span>
              </div>
            </div>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
          </div>

          {/* LINE Button */}
          <a
            href="https://lin.ee/BYCBPU5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 bg-[#06C755] rounded-full font-bold shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            <span className="text-sm font-bold">แอดไลน์</span>
          </a>
        </div>

        {/* Report Problem Button */}
        <a
          href="https://liff.line.me/2008779589-fus8Kpmp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-[#06C755] rounded-full font-bold shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          <span className="text-sm font-bold">แจ้งปัญหา</span>
        </a>

        {/* Vote Button */}
        <button
          onClick={() => scrollToSection('vote')}
          className="w-16 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform"
        >
          <Image
            src="/baner.png"
            alt="กาเบอร์ 8"
            width={64}
            height={80}
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* ==================== */}
      {/* LIGHTBOX MODAL */}
      {/* ==================== */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage}
              alt="สุรสิทธิ์ นิธิวุฒิวรรักษ์"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Navigation Arrows */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            {['/sura1.png', '/sura2.png', '/sura3.png', '/sura4.png'].map((src, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(src);
                }}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  lightboxImage === src ? 'border-cyan-400 scale-110' : 'border-white/30 hover:border-white/60'
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes slideDown {
          0% { transform: translateY(-100%) rotate(15deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%) rotate(15deg); opacity: 0; }
        }

        @keyframes floatRotate {
          0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.3; }
          50% { transform: rotate(45deg) translateY(-15px); opacity: 0.6; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 10s linear infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0f172a;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #10b981);
          border-radius: 4px;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SurasitLandingPagePro;
