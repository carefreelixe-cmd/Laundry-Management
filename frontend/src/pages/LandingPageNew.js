// import React, { useState } from 'react';
// import { Phone, Mail, MapPin, Menu, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';

// // Import local images
// import homeWelcome from '@/assets/Home-Welcome-1.jpg';
// import homeAbout from '@/assets/Home-About-1.jpg';
// import heroImage from '@/assets/post-ai-image-3221.png';
// import valuesImage from '@/assets/ChatGPT Image May 28 2025 10_12_28 AM_edited.png';
// import serviceImage1 from '@/assets/ChatGPT Image May 28 2025 10_12_28 AM_edited.png';
// import serviceImage2 from '@/assets/ChatGPT Image May 28 2025 10_40_35 AM.png';
// import serviceImage3 from '@/assets/ChatGPT Image May 28 2025 10_42_23 AM.png';
// import serviceImage4 from '@/assets/ChatGPT Image May 28 2025 10_44_20 AM.png';
// import serviceImage5 from '@/assets/ChatGPT Image May 28 2025 10_45_19 AM.png';
// import industryHospitality from '@/assets/ChatGPT Image May 29 2025 11_31_24 AM.png';
// import industryHealthcare from '@/assets/ChatGPT Image May 29 2025 11_31_36 AM.png';
// import priceLinenRental from '@/assets/ChatGPT Image Jun 11 2025 02_40_32 PM.png';
// import priceCOG from '@/assets/ChatGPT Image Jun 11 2025 02_48_15 PM.png';
// import towelsImage from '@/assets/post-ai-image-3219.png';
// import cleanLinenImage from '@/assets/post-ai-image-3221.png';

// function LandingPageNew() {
//   const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '', company: '', address: '' });
//   const [submitStatus, setSubmitStatus] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const scrollToSection = (id) => {
//     const el = document.getElementById(id);
//     if(el) {
//       setMobileMenuOpen(false); 
//       const y = el.getBoundingClientRect().top + window.pageYOffset - 96;
//       window.scrollTo({ top: y, behavior: 'smooth' });
//     }
//   };

//   const handleContactSubmit = (e) => {
//     e.preventDefault();
//     setSubmitStatus('success');
//     setContactForm({ name: '', email: '', phone: '', message: '', company: '', address: '' });
//     setTimeout(() => setSubmitStatus(''), 3000);
//   };

//   const handleLoginClick = () => {
//     window.location.href = 'https://portal.infinitelaundrysolutions.com.au/login';
//   };

//   const pricingRental = [
//     { product: 'King Sheets', price: 'from $2.25' },
//     { product: 'Queen Sheets', price: 'from $2.05' },
//     { product: 'Single Sheets', price: 'from $1.95' },
//     { product: 'Bath Towels', price: 'from $1.50' },
//     { product: 'Tea Towels', price: 'from $1.10' },
//     { product: 'Pillowcases', price: 'from $1.05' },
//     { product: 'Bath Mats', price: 'from $0.90' },
//     { product: 'Hand Towels', price: 'from $0.80' },
//     { product: 'Face Washers', price: 'from $0.75' }
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-8">
//           <div className="flex justify-between items-center h-24">
//             {/* Logo */}
//             <div className="flex items-center gap-3">
//               <img src="/assets/logo.png" alt="ILS Logo" className="h-16 sm:h-20" />
//               <div className="hidden sm:block">
//                 <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">Infinite</div>
//                 <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">Laundry</div>
//                 <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">Solutions</div>
//               </div>
//             </div>
            
//             {/* Desktop Menu */}
//             <div className="hidden lg:flex items-center gap-8">
//               <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-teal-600 cursor-pointer font-medium transition-colors">Home</a>
//               <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-teal-600 cursor-pointer font-medium transition-colors">About</a>
//               <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-teal-600 cursor-pointer font-medium transition-colors">Services</a>
//               <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-teal-600 cursor-pointer font-medium transition-colors">Industries we Serve</a>
//               <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-teal-600 cursor-pointer font-medium transition-colors">Our Prices</a>
//               <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-teal-600 cursor-pointer font-medium transition-colors">Why Us?</a>
//               <a onClick={() => scrollToSection('quote')} className="text-gray-700 hover:text-teal-600 cursor-pointer font-medium transition-colors">More</a>
              
//               {/* Login Button */}
//               <Button 
//                 onClick={handleLoginClick}
//                 className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//               >
//                 Login
//               </Button>
//             </div>
            
//             {/* Mobile Menu Button */}
//             <div className="lg:hidden">
//               <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="sm">
//                 {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="fixed top-24 left-0 w-full bg-white shadow-lg z-40 lg:hidden">
//           <div className="flex flex-col p-4 space-y-3">
//             <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-teal-600 font-medium py-2 cursor-pointer">Home</a>
//             <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-teal-600 font-medium py-2 cursor-pointer">About</a>
//             <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-teal-600 font-medium py-2 cursor-pointer">Services</a>
//             <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-teal-600 font-medium py-2 cursor-pointer">Industries</a>
//             <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-teal-600 font-medium py-2 cursor-pointer">Prices</a>
//             <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-teal-600 font-medium py-2 cursor-pointer">Why Us</a>
//             <a onClick={() => scrollToSection('quote')} className="text-gray-700 hover:text-teal-600 font-medium py-2 cursor-pointer">Contact</a>
//             <Button 
//               onClick={handleLoginClick}
//               className="bg-teal-500 hover:bg-teal-600 text-white w-full py-2 rounded-lg font-medium"
//             >
//               Login
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Hero Section */}
//       <section id="home" className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 px-4 sm:px-8 min-h-[500px]">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0">
//           <img 
//             src={heroImage} 
//             alt="Laundry Background" 
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-teal-100/90 via-teal-100/80 to-transparent"></div>
//         </div>
        
//         {/* Content */}
//         <div className="relative z-10 max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             {/* Left Side - Text Content */}
//             <div>
//               <div className="flex flex-wrap gap-3 mb-8">
//                 <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium shadow-sm">Professional Laundry Services</span>
//                 <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium shadow-sm">Professional Laundry Services</span>
//               </div>
              
//               <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
//                 Exceptional<br/>Laundry Care
//               </h1>
//             </div>
            
//             {/* Right Side - Description & Button */}
//             <div className="bg-teal-100/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
//               <p className="text-lg text-gray-900 mb-6 leading-relaxed">
//                 Your premium laundry solution for hospitality and healthcare industries.
//               </p>
//               <Button 
//                 onClick={() => scrollToSection('about')}
//                 className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-full text-base font-semibold border-2 border-gray-900 shadow-md transition-all"
//               >
//                 Discover More
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* About & Mission Section */}
//       <section id="about" className="py-16 sm:py-20 px-4 sm:px-8 bg-teal-100">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-12 sm:gap-16">
//             {/* About ILS */}
//             <div>
//               <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//                 <span className="border-b-8 border-gray-900 pb-3 inline-block">About ILS</span>
//               </h2>
//               <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-8">
//                 Born from the success of Infinite Asset Solutions, Infinite Laundry Solutions was created to solve a growing need we saw firsthand—dependable, quality-driven laundry services for the hospitality and healthcare sectors. As long-time operators in motel and commercial venue management, we understand what's at stake when it comes to clean, timely linen delivery.
//               </p>
//               <div className="rounded-2xl overflow-hidden shadow-lg">
//                 <img src={homeAbout} alt="About Infinite Laundry Solutions" className="w-full h-auto object-cover" />
//               </div>
//             </div>
            
//             {/* Our Mission & Values */}
//             <div>
//               <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//                 <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Mission</span>
//               </h2>
//               <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-12">
//                 To deliver commercial laundry solutions with precision, reliability, and care—helping our clients focus on what they do best.
//               </p>
              
//               <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
//                 <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Values</span>
//               </h3>
//               <div className="mb-8">
//                 <img src={valuesImage} alt="Our Values" className="w-full h-32 object-cover rounded-2xl shadow-lg" />
//               </div>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 <div className="text-center bg-white rounded-xl p-3 shadow-md">
//                   <p className="text-sm font-bold text-gray-900">Quality</p>
//                 </div>
//                 <div className="text-center bg-white rounded-xl p-3 shadow-md">
//                   <p className="text-sm font-bold text-gray-900">Transparency</p>
//                 </div>
//                 <div className="text-center bg-white rounded-xl p-3 shadow-md">
//                   <p className="text-sm font-bold text-gray-900">Reliability</p>
//                 </div>
//                 <div className="text-center bg-white rounded-xl p-3 shadow-md">
//                   <p className="text-sm font-bold text-gray-900">Innovation</p>
//                 </div>
//                 <div className="text-center bg-white rounded-xl p-3 shadow-md">
//                   <p className="text-sm font-bold text-gray-900">Care</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section id="services" className="py-16 sm:py-20 px-4 sm:px-8 bg-teal-100">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Services</span>
//           </h2>
//           <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-5xl">
//             Clean linen shouldn't be a luxury—it should be the standard. At Infinite Laundry Solutions, we offer a range of services designed to meet the specific demands of busy venues across Queensland. From small boutique stays to large medical facilities, we provide scalable, stress-free laundry and linen solutions.
//           </p>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//             {/* Service 1 */}
//             <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
//               <div className="mb-6">
//                 <img src={serviceImage1} alt="Commercial Laundry Services" className="w-20 h-20 mx-auto rounded-full object-cover shadow-md" />
//               </div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide text-gray-900">COMMERCIAL LAUNDRY SERVICES</h3>
//               <p className="text-xs text-gray-700 leading-relaxed">High-volume, fast-turnaround service for hotels, motels, resorts, and more</p>
//             </div>
            
//             {/* Service 2 */}
//             <div className="bg-gray-600 rounded-2xl p-8 text-center shadow-lg text-white hover:shadow-xl transition-shadow">
//               <div className="mb-6">
//                 <img src={serviceImage2} alt="Linen Hire & Rental" className="w-20 h-20 mx-auto rounded-full object-cover shadow-md" />
//               </div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide">LINEN HIRE & RENTAL</h3>
//               <p className="text-xs text-gray-200 leading-relaxed">Clean, pressed linen delivered on your schedule</p>
//             </div>
            
//             {/* Service 3 */}
//             <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
//               <div className="mb-6">
//                 <img src={serviceImage3} alt="Uniform & Apparel Cleaning" className="w-20 h-20 mx-auto rounded-full object-cover shadow-md" />
//               </div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide text-gray-900">UNIFORM & APPAREL CLEANING</h3>
//               <p className="text-xs text-gray-700 leading-relaxed">For corporate, industrial, and healthcare staff</p>
//             </div>
            
//             {/* Service 4 */}
//             <div className="bg-gray-600 rounded-2xl p-8 text-center shadow-lg text-white hover:shadow-xl transition-shadow">
//               <div className="mb-6">
//                 <img src={serviceImage4} alt="Customer-Owned Goods" className="w-20 h-20 mx-auto rounded-full object-cover shadow-md" />
//               </div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide">CUSTOMER-OWNED GOODS (COG)</h3>
//               <p className="text-xs text-gray-200 leading-relaxed">We clean what you own—professionally and precisely</p>
//             </div>
            
//             {/* Service 5 */}
//             <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
//               <div className="mb-6">
//                 <img src={serviceImage5} alt="Specialty & Event Linen" className="w-20 h-20 mx-auto rounded-full object-cover shadow-md" />
//               </div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide text-gray-900">SPECIALTY & EVENT LINEN</h3>
//               <p className="text-xs text-gray-700 leading-relaxed">Towels, napkins, tablecloths, bedding and more</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Industries We Serve */}
//       <section id="industries" className="py-16 sm:py-20 px-4 sm:px-8 bg-teal-100">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Industries we Serve</span>
//           </h2>
//           <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-4xl">
//             We understand the unique needs of every industry we serve. Whether you're welcoming guests, caring for patients, or feeding the masses, you need clean, dependable linen—and fast.
//           </p>
          
//           <div className="grid md:grid-cols-2 gap-8 mb-16">
//             {/* Hospitality */}
//             <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
//               <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center p-4">
//                 <img src={industryHospitality} alt="Hospitality" className="w-full h-full object-contain" />
//               </div>
//               <h3 className="text-3xl font-black text-gray-900 mb-4">Hospitality</h3>
//               <p className="text-gray-800 text-lg">Hotels, Motels, Resorts, Short-Term Rentals</p>
//             </div>
            
//             {/* Healthcare */}
//             <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
//               <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center p-4">
//                 <img src={industryHealthcare} alt="Healthcare" className="w-full h-full object-contain" />
//               </div>
//               <h3 className="text-3xl font-black text-gray-900 mb-4">Healthcare</h3>
//               <p className="text-gray-800 text-lg">Clinics, Medical Centres, Aged Care Homes</p>
//             </div>
//           </div>
          
//           <div className="bg-gray-200 rounded-2xl p-10 text-center max-w-3xl mx-auto shadow-lg">
//             <p className="text-gray-900 font-black text-xl mb-3">Don't see your industry?</p>
//             <p className="text-gray-800 text-lg mb-6">Let's chat – we tailor our services to you.</p>
//             <Button 
//               onClick={() => scrollToSection('quote')}
//               className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
//             >
//               Contact Us
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Our Prices */}
//       <section id="prices" className="py-16 sm:py-20 px-4 sm:px-8 bg-teal-100">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Prices</span>
//           </h2>
//           <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-5xl">
//             At Infinite Laundry Solutions, we believe in transparent, tailored pricing that suits the unique needs of your business. Whether you're renting fresh, high-quality linen or entrusting us with your own inventory, our pricing structure is designed to offer flexibility and value.
//           </p>
          
//           <div className="grid md:grid-cols-2 gap-12">
//             {/* Linen Rental Services */}
//             <div className="bg-white rounded-2xl p-10 shadow-lg">
//               <div className="mb-6 flex justify-center">
//                 <img src={priceLinenRental} alt="Linen Rental Services" className="w-32 h-32 object-contain rounded-xl shadow-md" />
//               </div>
//               <h3 className="text-xl font-black text-gray-900 uppercase mb-4 text-center">LINEN RENTAL SERVICES</h3>
//               <p className="text-gray-700 text-base mb-8 leading-relaxed">
//                 Perfect for businesses looking for a hassle-free solution. Our pricing includes laundering, drying and replacement of worn items—ideal for hospitality and healthcare settings that require consistent quality and supply.
//               </p>
//               <div className="space-y-1">
//                 <div className="grid grid-cols-2 gap-4 pb-3 border-b-4 border-gray-900 font-black text-sm">
//                   <div>Product</div>
//                   <div className="text-right">Pricing (exc. GST)</div>
//                 </div>
//                 {pricingRental.map((item, index) => (
//                   <div key={index} className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                     <div className="text-gray-700">{item.product}</div>
//                     <div className="text-right font-bold italic text-gray-900">{item.price}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             {/* COG Services */}
//             <div className="bg-white rounded-2xl p-10 shadow-lg">
//               <div className="mb-6 flex justify-center">
//                 <img src={priceCOG} alt="Customer-Owned Goods Services" className="w-32 h-32 object-contain rounded-xl shadow-md" />
//               </div>
//               <h3 className="text-xl font-black text-gray-900 uppercase mb-4 text-center">CUSTOMER-OWNED GOODS (COG) SERVICES</h3>
//               <p className="text-gray-700 text-base mb-8 leading-relaxed">
//                 Already have your own linen? No problem. We offer competitive per-kilo or per-piece pricing for cleaning and return of your linen, with options for express turnaround and volume discounts.
//               </p>
//               <div className="bg-teal-50 rounded-xl p-6 mb-8">
//                 <h4 className="font-black text-gray-900 text-lg mb-4">What's Included:</h4>
//                 <ul className="space-y-3 text-gray-700">
//                   <li className="flex items-start gap-2">
//                     <span className="text-teal-600 font-bold">✓</span>
//                     <span><span className="font-bold">Competitive Per-Kilo Pricing</span><br/><span className="text-sm">Best rates for bulk laundry</span></span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-teal-600 font-bold">✓</span>
//                     <span><span className="font-bold">Per-Piece Pricing Available</span><br/><span className="text-sm">Perfect for specialized items</span></span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-teal-600 font-bold">✓</span>
//                     <span><span className="font-bold">Express Turnaround Options</span><br/><span className="text-sm">When you need it fast</span></span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-teal-600 font-bold">✓</span>
//                     <span><span className="font-bold">Volume Discounts</span><br/><span className="text-sm">Save more with higher volumes</span></span>
//                   </li>
//                 </ul>
//               </div>
//               <Button 
//                 onClick={() => scrollToSection('quote')}
//                 className="w-full bg-gray-600 hover:bg-gray-700 text-white py-5 rounded-lg font-bold text-lg transition-colors"
//               >
//                 Request Custom Quote
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Why ILS */}
//       <section id="why" className="py-16 sm:py-20 px-4 sm:px-8 bg-teal-100">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
//             <div>
//               <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//                 <span className="border-b-8 border-gray-900 pb-3 inline-block">Why ILS?</span>
//               </h2>
//               <p className="text-gray-800 text-base sm:text-lg mb-12 leading-relaxed">
//                 We've built Infinite Laundry Solutions on a foundation of industry knowledge, operational excellence, and next-generation technology. With premium Electrolux machines and sustainable practices at our core, we deliver more than clean linen—we deliver peace of mind.
//               </p>
              
//               <div className="space-y-8">
//                 <div className="border-b-4 border-gray-400 pb-6">
//                   <h3 className="text-2xl font-black text-gray-900 mb-4">Electrolux Machinery</h3>
//                   <p className="text-gray-700 text-base">Our state-of-the-art European machines provide best-in-class performance with exceptional water and energy efficiency.</p>
//                 </div>
                
//                 <div className="border-b-4 border-gray-400 pb-6">
//                   <h3 className="text-2xl font-black text-gray-900 mb-4">Experience-Driven</h3>
//                   <p className="text-gray-700 text-base">We know the industry inside-out because we're part of it.</p>
//                 </div>
                
//                 <div className="border-b-4 border-gray-400 pb-6">
//                   <h3 className="text-2xl font-black text-gray-900 mb-4">Flexible Service Models</h3>
//                   <p className="text-gray-700 text-base">Linen hire or COG, on-demand or scheduled—we work your way.</p>
//                 </div>
                
//                 <div className="pb-6">
//                   <h3 className="text-2xl font-black text-gray-900 mb-4">Trial & Sample Pickups Available</h3>
//                   <p className="text-gray-700 text-base">Try us before you commit.</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="relative">
//               <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
//                 <img 
//                   src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=srgb&fm=jpg&q=85" 
//                   alt="Clean stacked towels" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Service Areas with Map */}
//       <section className="py-16 sm:py-20 px-4 sm:px-8 bg-teal-50">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-16">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Service Areas</span>
//           </h2>
//           <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-12 max-w-4xl">
//             We're proud to support businesses across Queensland with reliable, efficient linen and laundry services. From bustling city hotels to coastal clinics, our reach is growing fast.
//           </p>
          
//           <div className="grid md:grid-cols-2 gap-12 mb-12">
//             <div>
//               <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Currently Serving:</h3>
//               <p className="text-lg sm:text-xl font-bold text-gray-900">Brisbane | Gold Coast | Sunshine Coast & Surrounding Suburbs</p>
//             </div>
//             <div>
//               <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Expanding Soon to:</h3>
//               <p className="text-lg sm:text-xl font-bold text-gray-900">Sydney | Newcastle | Hunter Region</p>
//             </div>
//           </div>
          
//           <p className="text-gray-800 text-base sm:text-lg mb-8">
//             Explore the map below to see if we service your area—or click the button for clean linen!!
//           </p>
          
//           {/* Map */}
//           <div className="bg-white rounded-2xl p-4 h-96 flex items-center justify-center mb-10 shadow-lg border-2 border-teal-500 overflow-hidden">
//             <iframe 
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.1159799028533!2d152.92012437514364!3d-27.62092442316589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b914955d9951729%3A0xb16876b4fb2bb3a!2s3%2F76%20Mica%20St%2C%20Carole%20Park%20QLD%204300%2C%20Australia!5e0!3m2!1sen!2sin!4v1761402560116!5m2!1sen!2sin" 
//               width="100%" 
//               height="100%" 
//               style={{ border: 0 }} 
//               allowFullScreen="" 
//               loading="lazy" 
//               referrerPolicy="no-referrer-when-downgrade"
//               title="ILS Location Map"
//             />
//           </div>
          
//           <div className="text-center">
//             <Button 
//               onClick={() => scrollToSection('quote')}
//               className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-5 rounded-lg font-black text-lg sm:text-xl border-4 border-gray-900 shadow-md transition-colors"
//             >
//               Get Clean Linen Now!
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Get a Quote Section */}
//       <section id="quote" className="py-16 sm:py-20 px-4 sm:px-8 bg-teal-50">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-12">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">GET A QUOTE</span>
//           </h2>
//           <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-12">
//             Try Us Today. We offer trial services and sample pickups for eligible businesses. Let's show you what premium laundry service feels like. With Infinite Laundry Solutions, you're not just choosing a provider—you're choosing a partner in cleanliness, care, and operational excellence.
//           </p>
          
//           <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg border-t-8 border-gray-900">
//             <form onSubmit={handleContactSubmit} className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-bold mb-2 text-gray-900">Full Name <span className="text-red-500">*</span></label>
//                   <Input 
//                     value={contactForm.name} 
//                     onChange={(e) => setContactForm({...contactForm, name: e.target.value})} 
//                     required 
//                     className="bg-teal-50/70 border-none h-12" 
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2 text-gray-900">Phone <span className="text-red-500">*</span></label>
//                   <Input 
//                     value={contactForm.phone} 
//                     onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} 
//                     required 
//                     className="bg-teal-50/70 border-none h-12" 
//                   />
//                 </div>
//               </div>
              
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-bold mb-2 text-gray-900">Company name</label>
//                   <Input 
//                     value={contactForm.company} 
//                     onChange={(e) => setContactForm({...contactForm, company: e.target.value})} 
//                     className="bg-teal-50/70 border-none h-12" 
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2 text-gray-900">Property Address</label>
//                   <Input 
//                     value={contactForm.address} 
//                     onChange={(e) => setContactForm({...contactForm, address: e.target.value})} 
//                     className="bg-teal-50/70 border-none h-12" 
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-bold mb-2 text-gray-900">Email <span className="text-red-500">*</span></label>
//                 <Input 
//                   type="email" 
//                   value={contactForm.email} 
//                   onChange={(e) => setContactForm({...contactForm, email: e.target.value})} 
//                   required 
//                   className="bg-teal-50/70 border-none h-12" 
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-bold mb-2 text-gray-900">Services Required / Message</label>
//                 <Textarea 
//                   rows={5} 
//                   value={contactForm.message} 
//                   onChange={(e) => setContactForm({...contactForm, message: e.target.value})} 
//                   className="bg-teal-50/70 border-none" 
//                 />
//               </div>
              
//               <Button 
//                 type="submit" 
//                 className="w-full bg-gray-600 hover:bg-gray-700 text-white py-5 rounded-lg font-bold text-lg shadow-md transition-colors"
//               >
//                 Submit Quote Request
//               </Button>
              
//               {submitStatus === 'success' && (
//                 <p className="text-green-600 text-center font-bold text-lg">Message sent successfully! We'll be in touch soon.</p>
//               )}
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-teal-100 py-16 px-4 sm:px-8 border-t-8 border-teal-500">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
//             {/* Logo and Navigation */}
//             <div className="flex flex-col sm:flex-row items-start gap-8">
//               <div className="w-24 sm:w-32 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg p-4 border border-gray-300">
//                 <img src="/assets/logo.png" alt="ILS Logo" className="w-full h-full object-contain" />
//               </div>
//               <div>
//                 <h3 className="text-2xl font-black text-gray-900 mb-6">
//                   Infinite Laundry Solutions
//                 </h3>
//                 <div className="space-y-2">
//                   <a onClick={() => scrollToSection('home')} className="block text-gray-800 hover:text-teal-600 cursor-pointer font-medium text-base">Home</a>
//                   <a onClick={() => scrollToSection('services')} className="block text-gray-800 hover:text-teal-600 cursor-pointer font-medium text-base">Services</a>
//                   <a onClick={() => scrollToSection('about')} className="block text-gray-800 hover:text-teal-600 cursor-pointer font-medium text-base">About Us</a>
//                   <a onClick={handleLoginClick} className="block text-gray-800 hover:text-teal-600 cursor-pointer font-medium text-base">Book Online / Login</a>
//                   <a href="#" className="block text-gray-800 hover:text-teal-600 cursor-pointer font-medium text-base">Blog</a>
//                 </div>
//               </div>
//             </div>
            
//             {/* Contact Info */}
//             <div className="text-left md:text-center lg:text-left">
//               <h3 className="text-2xl font-black text-gray-900 mb-6">Contact Us</h3>
//               <div className="space-y-3">
//                 <p className="text-lg font-black text-gray-900 flex items-center gap-3">
//                   <Phone className="w-5 h-5 text-teal-500"/> +61426159286
//                 </p>
//                 <p className="text-base text-gray-800 font-medium flex items-center gap-3">
//                   <Mail className="w-5 h-5 text-teal-500"/> info@infinitelaundrysolutions.com.au
//                 </p>
//                 <p className="text-base text-gray-800 font-medium flex items-start gap-3">
//                   <MapPin className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1"/> 3/76 Mica Street, Carole Park, QLD, 4300
//                 </p>
//               </div>
//               <Button 
//                 onClick={() => scrollToSection('quote')}
//                 className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-black text-lg mt-8 border-4 border-gray-900 shadow-md transition-colors"
//               >
//                 LETS CHAT!!
//               </Button>
//             </div>
            
//             {/* Business Hours */}
//             <div>
//               <h3 className="text-2xl font-black text-gray-900 mb-6">Business Hours</h3>
//               <div className="space-y-2 text-lg text-gray-800">
//                 <p><span className="font-semibold">Monday - Friday:</span> 7:00 AM - 8:00 PM</p>
//                 <p><span className="font-semibold">Saturday:</span> 8:00 AM - 6:00 PM</p>
//                 <p><span className="font-semibold">Sunday:</span> 9:00 AM - 5:00 PM</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default LandingPageNew;




import React, { useState } from 'react';
import { Phone, Mail, MapPin, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Define color palette
const MINT_BG = '#BBE7D0';
const DEEP_CHARCOAL = 'rgb(17, 24, 39)';
const GREY_LIGHT = '#E8E6E6';
const MINT_ACCENT_LIGHT = '#D5EEE0';

// Import images - CORRECTED PATHS
const heroImage = '/assets/hero section img.png';
const valuesImage = '/assets/reliability innovation care img.png';
const serviceImage1 = '/assets/commercial laundry service.png';
const serviceImage2 = '/assets/linen hire and rental for services section.png';
const serviceImage3 = '/assets/uniform apparel.png';
const serviceImage4 = '/assets/customer owned goods for services section.png';
const serviceImage5 = '/assets/speciality and event.png';
const industryHospitality = '/assets/hospitality img.png';
const industryHealthcare = '/assets/healthcare img.png';
const priceLinenRental = '/assets/linen rental service.png';
const priceCOG = '/assets/COG services under prices section.png';
const whyIlsImage = '/assets/Home-About-1.jpg';

const servicesData = [
  { title: 'COMMERCIAL LAUNDRY SERVICES', description: 'High-volume, fast-turnaround for hotels, motels, resorts.', image: serviceImage1 },
  { title: 'LINEN HIRE & RENTAL', description: 'Clean, pressed linen delivered on your schedule; replacement of worn items included.', image: serviceImage2 },
  { title: 'UNIFORM & APPAREL CLEANING', description: 'Corporate/industrial/healthcare staff garments; tagging & segregation.', image: serviceImage3 },
  { title: 'CUSTOMER-OWNED GOODS (COG)', description: 'Per-kilo or per-piece cleaning of your own inventory; express options.', image: serviceImage4 },
  { title: 'SPECIALTY & EVENT LINEN', description: 'Napery, tablecloths, bedding packages for events.', image: serviceImage5 }
];

const pricingRental = [
  { product: 'King Sheets', price: 'from $2.25' },
  { product: 'Queen Sheets', price: 'from $2.05' },
  { product: 'Single Sheets', price: 'from $1.95' },
  { product: 'Bath Towels', price: 'from $1.50' },
  { product: 'Tea Towels', price: 'from $1.10' },
  { product: 'Pillowcases', price: 'from $1.05' },
  { product: 'Bath Mats', price: 'from $0.90' },
  { product: 'Hand Towels', price: 'from $0.80' },
  { product: 'Face Washers', price: 'from $0.75' }
];

const whyIlsFeatures = [
  { title: 'Electrolux Machinery', microcopy: 'Our state-of-the-art European machines provide best-in-class performance with exceptional water and energy efficiency.' },
  { title: 'Experience-Driven', microcopy: 'We know the industry inside-out because we\'re part of it.' },
  { title: 'Flexible Service Models', microcopy: 'Linen hire or COG, on-demand or scheduled – we work your way.' },
  { title: 'Trial & Sample Pickups Available', microcopy: 'Try us before you commit.' },
  { title: 'Sustainability-Focused', microcopy: 'Our machines and processes are designed to reduce consumption and environmental impact.' }
];

function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '', company: '', address: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if(el) {
      setMobileMenuOpen(false);
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('success');
    setContactForm({ name: '', email: '', phone: '', message: '', company: '', address: '' });
    setTimeout(() => setSubmitStatus(''), 3000);
  };

  const handleLoginClick = () => {
    window.location.href = 'https://portal.infinitelaundrysolutions.com.au/login';
  };

  const HeadingStyle = ({ children, style = {} }) => (
    <span style={{ color: DEEP_CHARCOAL, borderBottom: `8px solid ${DEEP_CHARCOAL}`, paddingBottom: '0.75rem', ...style }} className="inline-block">
      {children}
    </span>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24">
            <div className="flex items-center gap-2 sm:gap-4">
              <img src="/assets/logo.png" alt="Infinite Laundry Solutions" className="h-14 sm:h-20 w-auto" />
            </div>
            
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-gray-900 cursor-pointer font-medium text-sm xl:text-base">Home</a>
              <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-gray-900 cursor-pointer font-medium text-sm xl:text-base">About</a>
              <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-gray-900 cursor-pointer font-medium text-sm xl:text-base">Services</a>
              <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-gray-900 cursor-pointer font-medium text-sm xl:text-base">Industries we Serve</a>
              <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-gray-900 cursor-pointer font-medium text-sm xl:text-base">Our Prices</a>
              <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-gray-900 cursor-pointer font-medium text-sm xl:text-base">Why Us?</a>
              <a onClick={() => scrollToSection('quote')} className="text-gray-700 hover:text-gray-900 cursor-pointer font-medium text-sm xl:text-base">Contact Us</a>
              
              <Button onClick={handleLoginClick} className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-full px-4 xl:px-6 text-sm xl:text-base font-medium shadow-md transition-colors">
                Login
              </Button>
            </div>
            
            <div className="lg:hidden flex items-center gap-2">
              <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="sm">
                {mobileMenuOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
              </Button>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-20 sm:top-24 left-0 w-full bg-white shadow-lg py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 px-4 sm:px-8">
                <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-gray-900 font-medium py-2">Home</a>
                <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-gray-900 font-medium py-2">About</a>
                <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-gray-900 font-medium py-2">Services</a>
                <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-gray-900 font-medium py-2">Industries we Serve</a>
                <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-gray-900 font-medium py-2">Our Prices</a>
                <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-gray-900 font-medium py-2">Why Us?</a>
                <a onClick={() => scrollToSection('quote')} className="text-gray-700 hover:text-gray-900 font-medium py-2">Contact Us</a>
                <Button onClick={handleLoginClick} className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-full mt-4">Login</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {/* <section id="home" style={{backgroundColor: MINT_BG}} className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-8 relative overflow-hidden min-h-[500px] sm:min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Clean stacked laundry" className="w-full h-full object-cover opacity-30" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div style={{backgroundColor: MINT_ACCENT_LIGHT}} className="rounded-xl p-6 sm:p-12 text-center max-w-5xl mx-auto shadow-xl">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800 hidden sm:inline">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800 hidden md:inline">Professional Laundry Services</span>
            </div>

            <div className="grid lg:grid-cols-2 items-center text-left gap-6 sm:gap-8">
              <div>
                <h1 style={{color: DEEP_CHARCOAL}} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-none mb-4">
                  Exceptional<br/>Laundry Care
                </h1>
              </div>
              <div className="lg:text-right text-sm sm:text-base md:text-lg leading-relaxed space-y-4">
                <p style={{color: DEEP_CHARCOAL}}>
                  Your premium laundry solution for hospitality and healthcare industries.
                </p>
                <Button onClick={() => scrollToSection('services')} className="bg-white hover:bg-gray-100 text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-md transition-colors border-2 border-gray-800">
                  Discover More <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-1"/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section> */}
{/* Hero Section */}
      {/* <section id="home" style={{backgroundColor: MINT_BG}} className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-8 relative overflow-hidden min-h-[500px] sm:min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Clean stacked laundry" className="w-full h-full object-cover opacity-30" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div style={{backgroundColor: MINT_ACCENT_LIGHT}} className="rounded-xl p-6 sm:p-12 text-center max-w-5xl mx-auto shadow-xl">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800 hidden sm:inline">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800 hidden md:inline">Professional Laundry Services</span>
            </div>

            <div className="grid lg:grid-cols-2 items-center text-left gap-6 sm:gap-8">
              <div>
                <h1 style={{color: DEEP_CHARCOAL}} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4">
                  Exceptional<br/>Laundry Care
                </h1>
              </div>
              <div className="lg:text-right text-sm sm:text-base md:text-lg leading-relaxed space-y-4">
                <p style={{color: DEEP_CHARCOAL}} className="mb-6">
                  Your premium laundry solution for hospitality and healthcare industries.
                </p>
                <Button onClick={() => scrollToSection('services')} className="bg-white hover:bg-gray-100 text-gray-800 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold shadow-md transition-colors border-2 border-gray-800">
                  Discover More <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-1"/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section id="home" style={{backgroundColor: MINT_BG}} className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-8 relative overflow-hidden min-h-[500px] sm:min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Clean stacked laundry" className="w-full h-full object-cover opacity-30" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div style={{backgroundColor: MINT_ACCENT_LIGHT}} className="rounded-xl p-6 sm:p-12 text-center max-w-5xl mx-auto shadow-xl">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800 hidden sm:inline">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800 hidden md:inline">Professional Laundry Services</span>
            </div>

            <div className="grid lg:grid-cols-2 items-center text-left gap-6 sm:gap-8">
              <div>
                <h1 style={{color: DEEP_CHARCOAL}} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4">
                  Exceptional<br/>Laundry Care
                </h1>
              </div>
              <div className="lg:text-right text-sm sm:text-base md:text-lg leading-relaxed space-y-4">
                <p style={{color: DEEP_CHARCOAL}} className="mb-6">
                  Your premium laundry solution for hospitality and healthcare industries.
                </p>
                <Button onClick={() => scrollToSection('services')} className="bg-white hover:bg-gray-100 text-gray-800 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold shadow-md transition-colors border-2 border-gray-800">
                  Discover More <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-1"/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
     {/* Hero Section */}
      {/* <section id="home" style={{backgroundColor: MINT_BG}} className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-8 relative overflow-hidden min-h-[500px] sm:min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Clean stacked laundry" className="w-full h-full object-cover opacity-30" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div style={{backgroundColor: MINT_ACCENT_LIGHT}} className="rounded-xl p-6 sm:p-12 text-center max-w-5xl mx-auto shadow-xl">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800 hidden sm:inline">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-800 hidden md:inline">Professional Laundry Services</span>
            </div>

            <div className="grid lg:grid-cols-2 items-center text-left gap-6 sm:gap-8">
              <div>
                <h1 style={{color: DEEP_CHARCOAL}} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4">
                  Exceptional<br/>Laundry<br/>Care
                </h1>
              </div>
              <div className="lg:text-right text-sm sm:text-base md:text-lg leading-relaxed space-y-4">
                <p style={{color: DEEP_CHARCOAL}} className="mb-6">
                  Your premium laundry solution for hospitality and healthcare industries.
                </p>
                <Button onClick={() => scrollToSection('services')} className="bg-white hover:bg-gray-100 text-gray-800 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold shadow-md transition-colors border-2 border-gray-800">
                  Discover More <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-1"/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      
      {/* About Section */}
      <section id="about" style={{backgroundColor: MINT_BG}} className="py-12 sm:py-20 px-4 sm:px-8 border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-16">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8">
                <HeadingStyle>About ILS</HeadingStyle>
              </h2>
              <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed">
                Born from the success of Infinite Asset Solutions, Infinite Laundry Solutions was created to solve a growing need we saw firsthand—dependable, quality-driven laundry services for the hospitality and healthcare sectors. As long-time operators in motel and commercial venue management, we understand what's at stake when it comes to clean, timely linen delivery.
              </p>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8">
                <HeadingStyle>Our Mission</HeadingStyle>
              </h2>
              <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-12">
                To deliver commercial laundry solutions with precision, reliability, and care—helping our clients focus on what they do best.
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8">
                <HeadingStyle>Our Values</HeadingStyle>
              </h3>
              <div className="flex flex-col items-center">
                <div className="w-full max-w-lg">
                  <img src={valuesImage} alt="Value Icons Strip" className="w-full h-auto object-contain" />
                </div>
                <div style={{color: DEEP_CHARCOAL}} className="w-full max-w-lg flex justify-between mt-2 text-center text-xs font-bold">
                  <p className="w-[20%]">Quality</p>
                  <p className="w-[20%]">Transparency</p>
                  <p className="w-[20%]">Reliability</p>
                  <p className="w-[20%]">Innovation</p>
                  <p className="w-[20%]">Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{backgroundColor: MINT_BG}} className="py-12 sm:py-20 px-4 sm:px-8 border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8">
            <HeadingStyle>Services</HeadingStyle>
          </h2>
          <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed mb-12 sm:mb-16 max-w-5xl">
            Clean linen shouldn't be a luxury—it should be the standard. At Infinite Laundry Solutions, we offer a range of services designed to meet the specific demands of busy venues across Queensland. From small boutique stays to large medical facilities, we provide scalable, stress-free laundry and linen solutions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {servicesData.map((service, index) => (
              <div 
                key={index} 
                className={`${index % 2 === 1 ? 'bg-gray-600 text-white' : 'bg-white'} rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="mb-4 sm:mb-6">
                  <img src={service.image} alt={`${service.title} Icon`} className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full object-cover shadow-md" />
                </div>
                <h3 className={`text-xs sm:text-sm font-black uppercase mb-3 sm:mb-4 tracking-wide ${index % 2 === 1 ? 'text-white' : 'text-gray-900'}`}>
                  {service.title}
                </h3>
                <p className={`text-xs leading-relaxed ${index % 2 === 1 ? 'text-gray-200' : 'text-gray-700'}`}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" style={{backgroundColor: MINT_BG}} className="py-12 sm:py-20 px-4 sm:px-8 border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8">
            <HeadingStyle>Industries We Serve</HeadingStyle>
          </h2>
          <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed mb-12 sm:mb-16 max-w-4xl">
            We understand the unique needs of every industry we serve. Whether you're welcoming guests, caring for patients, or feeding the masses, you need clean, dependable linen—and fast.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-lg transition-shadow border-t-4 border-white/0 hover:border-gray-800">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-6 flex items-center justify-center">
                <img src={industryHospitality} alt="Hospitality Icon" className="w-full h-full object-contain"/>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Hospitality</h3>
              <p className="text-base sm:text-lg text-gray-800">Hotels, Motels, Resorts, Short-Term Rentals</p>
            </div>
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-lg transition-shadow border-t-4 border-white/0 hover:border-gray-800">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-6 flex items-center justify-center">
                <img src={industryHealthcare} alt="Healthcare Icon" className="w-full h-full object-contain"/>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Healthcare</h3>
              <p className="text-base sm:text-lg text-gray-800">Clinics, Medical Centres, Aged Care Homes</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 text-center max-w-3xl mx-auto shadow-lg border-2 border-gray-800">
            <p className="text-gray-900 font-black text-lg sm:text-xl mb-3">Don't see your industry?</p>
            <p className="text-gray-800 text-base sm:text-lg mb-6">Let's chat – we tailor our services to you.</p>
            <Button className="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-md transition-colors" onClick={() => scrollToSection('quote')}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Prices Section */}
      <section id="prices" style={{backgroundColor: MINT_BG}} className="py-12 sm:py-20 px-4 sm:px-8 border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8">
            <HeadingStyle>Our Prices</HeadingStyle>
          </h2>
          <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed mb-12 sm:mb-16 max-w-5xl">
            At Infinite Laundry Solutions, we believe in transparent, tailored pricing that suits the unique needs of your business.
          </p>
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border-t-8 border-gray-800">
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <img src={priceLinenRental} alt="Linen Rental Icon" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900 uppercase">Linen Rental Services</h3>
              </div>
              <p className="text-gray-700 text-xs sm:text-sm lg:text-base mb-6 sm:mb-8 leading-relaxed">
                Perfect for businesses looking for a hassle-free solution. Our pricing includes laundering, drying and replacement of worn items—ideal for hospitality and healthcare settings.
              </p>
              <div className="space-y-1">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b-4 border-gray-900 font-black text-xs sm:text-sm">
                  <div className='text-gray-900'>Product</div>
                  <div className="text-right text-gray-900">Pricing (ex. GST)</div>
                </div>
                {pricingRental.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300 last:border-b-0">
                    <div className="text-gray-700 text-xs sm:text-sm">{item.product}</div>
                    <div className="text-right font-bold italic text-xs sm:text-sm" style={{color: DEEP_CHARCOAL, opacity: 0.75}}>{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border-t-8 border-gray-800">
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <img src={priceCOG} alt="COG Icon" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base sm:text-xl lg:text-2xl font-black text-gray-900 uppercase">Customer-Owned Goods (COG) Services</h3>
              </div>
              <p className="text-gray-700 text-xs sm:text-sm lg:text-base mb-8 sm:mb-10 leading-relaxed">
                Already have your own linen? No problem. We offer competitive per-kilo or per-piece pricing for cleaning and return of your linen, with options for express turnaround and volume discounts.
              </p>
              <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-800 shadow-md">
                <p className="text-gray-900 font-black text-base sm:text-lg mb-5">For a custom quote based on your needs, please click here. We tailor to your needs!!</p>
                <Button className="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-md transition-colors" onClick={() => scrollToSection('quote')}>
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ILS Section */}
      <section id="why" style={{backgroundColor: MINT_BG}} className="py-12 sm:py-20 px-4 sm:px-8 border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-12 sm:mb-16">
            <HeadingStyle>Why ILS?</HeadingStyle>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16 items-start">
            <div className="space-y-4">
              <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed">
                We've built Infinite Laundry Solutions on a foundation of industry knowledge, operational excellence, and next-generation technology. With premium Electrolux machines and sustainable practices at our core, we deliver more than clean linen—we deliver peace of mind.
              </p>
              <div className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-800">
                <p className="text-gray-900 font-semibold text-sm">Sustainability Footnote:</p>
                <p className="text-xs text-gray-700 mt-1">We prioritize water and energy efficiency in our machinery and use environmentally friendly detergents, actively supporting linen reuse programs.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-800">
              <img src={whyIlsImage} alt="Stacked towels" className="w-full h-56 sm:h-64 lg:h-80 object-cover" />
            </div>
          </div>
          <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
            {whyIlsFeatures.map((feature, index) => (
              <div key={index} className="border-b-2 border-gray-400 pb-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-800 text-sm sm:text-base lg:text-lg">
                    {feature.microcopy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-8" style={{backgroundColor: MINT_BG}}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8">
            <HeadingStyle>Our Service Areas</HeadingStyle>
          </h2>
          <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-12 max-w-4xl">
            We're proud to support businesses across Queensland with reliable, efficient linen and laundry services. From bustling city hotels to coastal clinics, our reach is growing fast.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-4 sm:mb-6">Currently Serving:</h3>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Brisbane | Gold Coast | Sunshine Coast & Surrounding Suburbs</p>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-4 sm:mb-6">Expanding Soon to:</h3>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Sydney | Newcastle | Hunter Region</p>
            </div>
          </div>
          <p className="text-gray-800 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
            Explore the map below to see if we service your area—or click the button for clean linen!!
          </p>
          
          <div className="bg-white rounded-2xl p-2 sm:p-4 h-64 sm:h-80 lg:h-96 flex items-center justify-center mb-8 sm:mb-10 shadow-lg border-2 border-gray-800 overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.1159799028533!2d152.92012437514364!3d-27.62092442316589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b914955d9951729%3A0xb16876b4fb2bb3a!2s3%2F76%20Mica%20St%2C%20Carole%20Park%20QLD%204300%2C%20Australia!5e0!3m2!1sen!2sin!4v1761402560116!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="ILS Location Map"
            />
          </div>
          
          <div className="text-center">
            <Button className="bg-white hover:bg-gray-100 text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-lg font-black text-base sm:text-lg lg:text-xl border-4 border-gray-900 shadow-md transition-colors" onClick={() => scrollToSection('quote')}>
              Get Clean Linen Now!
            </Button>
          </div>
        </div>
      </section>

      {/* Get a Quote Section */}
      <section id="quote" style={{backgroundColor: MINT_BG}} className="py-12 sm:py-20 px-4 sm:px-8 border-t border-gray-300">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-8 sm:mb-12">
            <HeadingStyle>GET A QUOTE</HeadingStyle>
          </h2>
          <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-12">
            Try Us Today. We offer trial services and sample pickups for eligible businesses. Let's show you what premium laundry service feels like. Whether you're a hotelier seeking consistent quality, a clinic in need of hygienic linen turnover, or a venue requiring last-minute support, we're ready to step in. With Infinite Laundry Solutions, you're not just choosing a provider—you're choosing a partner in cleanliness, care, and operational excellence.
          </p>
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-lg border-t-8 border-gray-900">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900">Full Name <span className="text-red-500">*</span></label>
                  <Input value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} required style={{backgroundColor: GREY_LIGHT}} className="border-none h-12" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900">Phone <span className="text-red-500">*</span></label>
                  <Input value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} required style={{backgroundColor: GREY_LIGHT}} className="border-none h-12" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900">Company name</label>
                  <Input value={contactForm.company} onChange={(e) => setContactForm({...contactForm, company: e.target.value})} style={{backgroundColor: GREY_LIGHT}} className="border-none h-12" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900">Property Address</label>
                  <Input value={contactForm.address} onChange={(e) => setContactForm({...contactForm, address: e.target.value})} style={{backgroundColor: GREY_LIGHT}} className="border-none h-12" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900">Email <span className="text-red-500">*</span></label>
                <Input type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} required style={{backgroundColor: GREY_LIGHT}} className="border-none h-12" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900">Services Required / Message</label>
                <Textarea rows={5} value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} style={{backgroundColor: GREY_LIGHT}} className="border-none" />
              </div>
              <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 sm:py-5 rounded-lg font-bold text-base sm:text-lg shadow-md transition-colors">
                Submit Quote Request
              </Button>
              {submitStatus === 'success' && <p className="text-green-600 text-center font-bold text-base sm:text-lg">Message sent successfully! We'll be in touch soon.</p>}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: MINT_BG}} className="py-12 sm:py-16 px-4 sm:px-8 border-t-8 border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="flex flex-col items-start gap-4">
              <img src="/assets/logo.png" alt="ILS Logo" className="h-14 sm:h-16 w-auto" />
              <p className="text-base sm:text-lg font-black text-gray-900">Infinite Laundry Solutions</p>
            </div>

            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className='space-y-2 pt-1'>
                <a onClick={() => scrollToSection('home')} className="block text-gray-800 hover:text-gray-900 cursor-pointer text-sm sm:text-base">Home</a>
                <a onClick={() => scrollToSection('about')} className="block text-gray-800 hover:text-gray-900 cursor-pointer text-sm sm:text-base">About</a>
                <a onClick={() => scrollToSection('services')} className="block text-gray-800 hover:text-gray-900 cursor-pointer text-sm sm:text-base">Services</a>
                <a onClick={() => scrollToSection('industries')} className="block text-gray-800 hover:text-gray-900 cursor-pointer text-sm sm:text-base">Industries We Serve</a>
                <a onClick={() => scrollToSection('prices')} className="block text-gray-800 hover:text-gray-900 cursor-pointer text-sm sm:text-base">Our Prices</a>
                <a onClick={() => scrollToSection('why')} className="block text-gray-800 hover:text-gray-900 cursor-pointer text-sm sm:text-base">Why Us?</a>
                <a onClick={() => scrollToSection('quote')} className="block text-gray-800 hover:text-gray-900 cursor-pointer text-sm sm:text-base">Contact Us</a>
              </div>

              <div style={{ backgroundColor: GREY_LIGHT }} className='space-y-3 p-4 rounded-lg'>
                <a href="tel:+61426159286" className="text-sm sm:text-base font-black text-gray-900 block hover:text-gray-700">+61426159286</a>
                <a href="mailto:info@infinitelaundrysolutions.com.au" className="text-sm sm:text-base text-gray-800 block hover:text-gray-700 break-words">info@infinitelaundrysolutions.com.au</a>
                <p className="text-sm sm:text-base text-gray-800">3/76 Mica Street, Carole Park, QLD, 4300</p>
                <Button className="bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-black text-xs sm:text-sm border-2 border-gray-900 shadow-md transition-colors mt-4 w-full sm:w-auto" onClick={() => scrollToSection('quote')}>
                  LETS CHAT!!
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-400 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-700">
            <p className="text-xs sm:text-sm lg:text-base">© 2025 Infinite Laundry Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;