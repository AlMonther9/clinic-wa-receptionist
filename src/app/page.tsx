import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  MessageSquare,
  Keyboard,
  ArrowLeft,
  HeartPulse,
  CheckCircle2
} from 'lucide-react'

export default function Home() {
  return (
    <div className="flex-1 bg-[#FAFAFC] text-slate-dark font-sans selection:bg-sky-200/60 flex flex-col min-h-screen relative overflow-hidden">

      {/* Subtle & Elegant Ambient Baby Blue Corner Spotlights */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top-Right Corner Spotlight */}
        <div 
          className="absolute -top-[200px] -right-[200px] w-[750px] h-[750px] rounded-full pointer-events-none" 
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(186,230,253,0.08) 45%, transparent 70%)'
          }}
        />
        {/* Top-Left Corner Spotlight */}
        <div 
          className="absolute -top-[200px] -left-[200px] w-[750px] h-[750px] rounded-full pointer-events-none" 
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(186,230,253,0.08) 45%, transparent 70%)'
          }}
        />
        {/* Mid-Hero Center Spotlight */}
        <div 
          className="absolute top-[50px] left-1/2 -translate-x-1/2 w-[850px] h-[450px] rounded-full pointer-events-none" 
          style={{
            background: 'radial-gradient(ellipse, rgba(56,189,248,0.15) 0%, rgba(186,230,253,0.06) 50%, transparent 70%)'
          }}
        />
      </div>

      {/* Top Navbar: Transparent & Seamless with Hero Canvas */}
      <header className="w-full relative z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between" dir="rtl">
          {/* Brand Logo: Clean Line Art Icon without Container */}
          <div className="flex items-center gap-2.5">
            <HeartPulse className="w-6 h-6 text-sky-500 stroke-[1.5]" />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-dark leading-tight">
                منظومة العيادة الذكية
              </span>
              <span className="text-[10px] font-bold tracking-wider text-sky-700 uppercase">
                Clinic Agent MVP
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-bold text-slate-dark/80">
            <a href="#hero" className="hover:text-sky-600 transition-colors">الرئيسية</a>
            <a href="#features" className="hover:text-sky-600 transition-colors">المميزات والخدمات</a>
          </nav>

          {/* Action Button: Clean Slate Bordered Style */}
          <div>
            <Link
              href="/dashboard"
              className="border border-slate-dark/30 hover:border-slate-dark text-slate-dark hover:bg-slate-dark/5 text-xs font-bold px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>لوحة الاستقبال</span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-dark" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Vanilla White Canvas with Radial Baby Blue Spotlight */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-10 pb-16 w-full relative z-10" dir="rtl">

        {/* Main 3-Column Grid Layout: Right Text - Center Art (Larger) - Left CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[500px]">

          {/* Right Column: Headline & Key Highlights */}
          <div className="lg:col-span-4 space-y-6 text-right flex flex-col justify-center order-1">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-dark leading-[1.25]">
              منصة إدارة العيادة ومجيب الاستقبال الذكي
            </h1>

            <div className="space-y-3 pt-1 text-xs sm:text-sm font-bold text-slate-dark">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>لوحة تحكم واحدة لمتابعة مواعيد العيادات والأطباء</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>مساعد واتساب ذكي يخدم المرضى والمراجعين ويجيب على استفساراتهم تلقائياً</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>تسجيل حضور وانصراف الأطباء واحتساب الأيام تلقائياً</span>
              </div>
            </div>
          </div>

          {/* Center Column: Cute Young Boy Receptionist at Platform Monitor (Larger Image Scale) */}
          <div className="lg:col-span-4 flex justify-center items-center relative order-2 py-4 lg:py-0">
            {/* Central Larger Line Art Container */}
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
              <Image
                src="/happy_receptionist_transparent.png?v=2"
                alt="Clinic Platform Monitor with AI Assistant Line Art"
                fill
                priority
                unoptimized
                className="object-contain"
                sizes="450px"
              />
            </div>
          </div>

          {/* Left Column: Subtitle Description & Bordered CTA Button */}
          <div className="lg:col-span-4 space-y-6 text-right flex flex-col justify-center order-3">
            <p className="text-sm sm:text-base text-slate-dark/85 leading-relaxed font-bold">
              منظومة متكاملة تدمج شاشة استقبال العيادة مع مجيب واتساب الذكي لخدمة المراجعين، تزويدهم بمواعيد الأطباء وتسهيل التواصل السلس.
            </p>

            {/* Action Buttons: Clean Slate Bordered Style */}
            <div className="space-y-3 pt-2">
              <Link
                href="/dashboard"
                className="group flex h-11 sm:h-12 items-center justify-center gap-2.5 rounded-full border border-slate-dark/40 hover:border-slate-dark bg-white/70 hover:bg-white text-slate-dark font-bold px-6 text-xs sm:text-sm transition-all w-full text-center shadow-2xs hover:shadow-xs cursor-pointer"
              >
                <span>الدخول للوحة الاستقبال</span>
                <ArrowLeft className="w-4 h-4 text-slate-dark group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* Unified Single Section: Features & Capabilities */}
        <div id="features" className="mt-16 pt-12 border-t border-slate-200/70">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-right">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-dark">
                مميزات المنظومة
              </h2>
              <p className="text-xs sm:text-sm text-slate-dark/70 font-bold">
                تجربة عيادة حديثة تجمع بين الذكاء الاصطناعي وسلاسة الإدارة في مكان واحد.
              </p>
            </div>
          </div>

          {/* 3 Unified Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-sky-500/5 hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-50 mb-5">
                <Image
                  src="/clinic_card_whatsapp_fluid.png"
                  alt="WhatsApp Automated Booking"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
              </div>
              <div className="px-2 pb-2 space-y-2 text-right">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-dark">مساعد المراجعين عبر واتساب</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-dark/75 leading-relaxed font-bold">
                  خدمة فورية للمرضى للاستفسار عن مواعيد الأطباء، العيادات المتاحة، والإجابة عن التساؤلات بلهجة عامية ودودة على مدار الساعة.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-sky-500/5 hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-50 mb-5">
                <Image
                  src="/clinic_card_doctor_fluid.png"
                  alt="Doctor Schedule Spotlight"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
              </div>
              <div className="px-2 pb-2 space-y-2 text-right">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                    <Keyboard className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-dark">لوحة تحكم الاستقبال بـ Spotlight</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-dark/75 leading-relaxed font-bold">
                  واجهة فورية لموظف الاستقبال لفلترة العيادات ومراجعة مواعيد الأطباء بضغطة مفاتيح سريع (Ctrl+K).
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-slate-200/80 rounded-[2rem] p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-sky-500/5 hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-50 mb-5">
                <Image
                  src="/clinic_card_reception_fluid.png"
                  alt="Hijabi Receptionist & Harvest"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
              </div>
              <div className="px-2 pb-2 space-y-2 text-right">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-dark">دفتر الحضور والحصاد الرقمي</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-dark/75 leading-relaxed font-bold">
                  تسجيل حضور وانصراف الأطباء يومياً واحتساب إجمالي أيام الحضور شهرياً تلقائياً بنقرة واحدة.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200/70 text-center text-xs text-slate-dark/70 bg-white/50 w-full mt-auto font-bold">
        <p dir="rtl">تم التطوير بجودة إنتاجية عالية • Clinic WhatsApp Agent MVP • 2026</p>
      </footer>
    </div>
  )
}
