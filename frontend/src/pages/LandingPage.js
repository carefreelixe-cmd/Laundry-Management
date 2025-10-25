// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Shirt, Sparkles, Wind, Building2, Droplets, Package, TrendingUp, Menu, X } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Textarea } from '@/components/ui/textarea';
// // import axios from 'axios';

// // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// // const API = `${BACKEND_URL}/api`;

// // function LandingPage() {
// //   const navigate = useNavigate();
// //   const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
// //   const [submitStatus, setSubmitStatus] = useState('');
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// //   const services = [
// //     {
// //       title: 'Wash & Fold',
// //       description: 'Professional washing, drying, and folding service with attention to detail',
// //       price: 'From $25',
// //       icon: Shirt
// //     },
// //     {
// //       title: 'Dry Cleaning',
// //       description: 'Expert dry cleaning for delicate garments and formal wear',
// //       price: 'From $15',
// //       icon: Sparkles
// //     },
// //     {
// //       title: 'Ironing Service',
// //       description: 'Crisp and professional ironing for shirts, pants, and more',
// //       price: 'From $20',
// //       icon: Wind
// //     },
// //     {
// //       title: 'Commercial Laundry',
// //       description: 'Bulk laundry solutions for businesses, hotels, and restaurants',
// //       price: 'Custom Quote',
// //       icon: Building2
// //     }
// //   ];

// //   const features = [
// //     { icon: Clock, title: 'Fast Turnaround', description: '24-48 hour service available' },
// //     { icon: Shield, title: 'Quality Guaranteed', description: '100% satisfaction or money back' },
// //     { icon: Users, title: 'Expert Staff', description: 'Trained professionals handle your items' },
// //     { icon: Check, title: 'Eco-Friendly', description: 'Environmentally responsible cleaning' }
// //   ];

// //   const testimonials = [
// //     {
// //       name: 'Sarah Johnson',
// //       role: 'Business Owner',
// //       text: 'Clienty has been handling our restaurant linens for 2 years. Always on time, always perfect!',
// //       rating: 5
// //     },
// //     {
// //       name: 'Michael Chen',
// //       role: 'Homeowner',
// //       text: 'The convenience of pickup and delivery service is unmatched. Highly recommend!',
// //       rating: 5
// //     },
// //     {
// //       name: 'Emma Wilson',
// //       role: 'Hotel Manager',
// //       text: 'Professional service at competitive prices. They handle our high volume needs perfectly.',
// //       rating: 5
// //     }
// //   ];

// //   const handleContactSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(`${API}/contact`, contactForm);
// //       setSubmitStatus('success');
// //       setContactForm({ name: '', email: '', phone: '', message: '' });
// //       setTimeout(() => setSubmitStatus(''), 3000);
// //     } catch (error) {
// //       setSubmitStatus('error');
// //       setTimeout(() => setSubmitStatus(''), 3000);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Navigation */}
// //       <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-20 sm:h-20 ">
// //             {/* Logo */}
// //             <div className="flex items-center">
// //               <img 
// //                 src="/assets/logo.png"
// //                 alt="Infinite Laundry Solutions Logo"
// //                 className="h-20  w-auto"
// //               />
// //             </div>

// //             {/* Desktop Navigation */}
// //             <div className="hidden lg:flex items-center space-x-6">
// //               <a href="#services" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">Services</a>
// //               <a href="#about" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">About</a>
// //               <a href="#contact" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">Contact</a>
// //               <div className='space-x-3'>
// //                 <Button 
// //                   onClick={() => navigate('/signup')} 
// //                   variant="outline"
// //                   className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 rounded-full px-4 py-2 xl:px-6 text-sm xl:text-base"
// //                   data-testid="nav-signup-btn"
// //                 >
// //                   Sign Up
// //                 </Button>
// //                 <Button 
// //                   onClick={() => navigate('/login')} 
// //                   className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-full px-4 xl:px-6 text-sm xl:text-base"
// //                   data-testid="nav-login-btn"
// //                 >
// //                   Login
// //                 </Button>
// //               </div>
// //             </div>

// //             {/* Mobile Menu Button */}
// //             <div className="lg:hidden flex items-center gap-2">
// //               <Button
// //                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //                 variant="ghost"
// //                 size="sm"
// //                 className="p-2"
// //                 data-testid="mobile-menu-btn"
// //               >
// //                 {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
// //               </Button>
// //             </div>
// //           </div>

// //           {/* Mobile Menu */}
// //           {mobileMenuOpen && (
// //             <div className="lg:hidden py-4 border-t animate-fade-in" data-testid="mobile-menu">
// //               <div className="flex flex-col space-y-3">
// //                 <a 
// //                   href="#services" 
// //                   onClick={() => setMobileMenuOpen(false)}
// //                   className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50"
// //                 >
// //                   Services
// //                 </a>
// //                 <a 
// //                   href="#about" 
// //                   onClick={() => setMobileMenuOpen(false)}
// //                   className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50"
// //                 >
// //                   About
// //                 </a>
// //                 <a 
// //                   href="#contact" 
// //                   onClick={() => setMobileMenuOpen(false)}
// //                   className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50"
// //                 >
// //                   Contact
// //                 </a>
// //                 <Button 
// //                   onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} 
// //                   variant="outline"
// //                   className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 rounded-full w-full"
// //                 >
// //                   Sign Up
// //                 </Button>
// //                 <Button 
// //                   onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} 
// //                   className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-full"
// //                 >
// //                   Login
// //                 </Button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </nav>

// //       {/* Hero Section */}
// //       <section className="pt-20 mt-4 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50 to-white">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
// //             <div className="animate-fade-in text-center lg:text-left">
// //               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
// //                 Professional Laundry
// //                 <span className="block text-teal-500 mt-1 sm:mt-2">Delivered to Your Door</span>
// //               </h1>
// //               <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 leading-relaxed px-2 sm:px-0">
// //                 Experience Australia's finest laundry and dry cleaning service. We pickup, clean, and deliver with care.
// //               </p>
// //               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0">
// //                 <Button 
// //                   size="lg" 
// //                   className="bg-teal-500 hover:bg-teal-600 text-white text-base sm:text-lg px-6 sm:px-8 py-7  rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
// //                   onClick={() => navigate('/login')}
// //                   data-testid="hero-book-pickup-btn"
// //                 >
// //                   Book Laundry Pickup
// //                 </Button>
// //                 <Button 
// //                   size="lg" 
// //                   variant="outline" 
// //                   className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 text-base sm:text-lg px-6 sm:px-8 py-7 rounded-full w-full sm:w-auto"
// //                   onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
// //                 >
// //                   View Services
// //                 </Button>
// //               </div>
// //               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 mt-6 sm:mt-8">
// //                 <div className="flex items-center">
// //                   {[...Array(5)].map((_, i) => (
// //                     <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
// //                   ))}
// //                 </div>
// //                 <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">
// //                   <span className="font-semibold text-gray-900">4.9/5</span> from 500+ reviews
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="relative mt-8 lg:mt-0 px-4 sm:px-0">
// //               <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
// //                 <img 
// //                   src="https://images.unsplash.com/photo-1627564359646-5972788cec65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGZvbGRlZCUyMGNsb3RoZXN8ZW58MHx8fHwxNzYwMzc1NjMwfDA&ixlib=rb-4.1.0&q=85"
// //                   alt="Clean folded laundry"
// //                   className="w-full h-full object-cover"
// //                 />
// //               </div>
// //               <div className="absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
// //                 <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
// //                   <div className="bg-teal-100 rounded-full p-2 sm:p-2.5 md:p-3 flex-shrink-0">
// //                     <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-600" />
// //                   </div>
// //                   <div>
// //                     <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base leading-tight">Same Day Service</p>
// //                     <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight mt-0.5">Available in metro areas</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Features Section */}
// //       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Clienty?</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">Quality service you can trust</p>
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
// //             {features.map((feature, index) => (
// //               <div key={index} className="text-center p-5 sm:p-6 md:p-8 rounded-2xl hover:bg-teal-50 transition-all card-hover">
// //                 <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-teal-100 rounded-full mb-3 sm:mb-4">
// //                   <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-600" />
// //                 </div>
// //                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
// //                 <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Services Section */}
// //       <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Services</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">Comprehensive laundry solutions for every need</p>
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
// //             {services.map((service, index) => {
// //               const IconComponent = service.icon;
// //               return (
// //                 <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg card-hover">
// //                   <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
// //                     <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" />
// //                   </div>
// //                   <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
// //                   <p className="text-sm sm:text-base text-gray-600 mb-4">{service.description}</p>
// //                   <p className="text-xl sm:text-2xl font-bold text-teal-500">{service.price}</p>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </section>

// //       {/* How It Works */}
// //       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">Simple, fast, and convenient</p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
// //             <div className="text-center px-4">
// //               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
// //                 <Package className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
// //               </div>
// //               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Schedule Pickup</h3>
// //               <p className="text-sm sm:text-base text-gray-600">Book online or call us to schedule a convenient pickup time</p>
// //             </div>
// //             <div className="text-center px-4">
// //               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
// //                 <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
// //               </div>
// //               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">We Clean</h3>
// //               <p className="text-sm sm:text-base text-gray-600">Our experts clean your items with care and attention to detail</p>
// //             </div>
// //             <div className="text-center px-4">
// //               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
// //                 <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
// //               </div>
// //               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Delivery</h3>
// //               <p className="text-sm sm:text-base text-gray-600">Fresh, clean items delivered right to your doorstep</p>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Testimonials */}
// //       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What Our Customers Say</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">Join thousands of satisfied customers</p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
// //             {testimonials.map((testimonial, index) => (
// //               <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
// //                 <div className="flex mb-4">
// //                   {[...Array(testimonial.rating)].map((_, i) => (
// //                     <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
// //                   ))}
// //                 </div>
// //                 <p className="text-sm sm:text-base text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
// //                 <div>
// //                   <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
// //                   <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* About Section */}
// //       <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
// //         <div className="max-w-4xl mx-auto text-center">
// //           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-5 sm:mb-6">About Clienty</h2>
// //           <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
// //             Clienty is Australia's premier laundry and dry cleaning service provider. With over 10 years of experience, 
// //             we've been serving homes and businesses across the country with dedication and expertise. Our commitment to 
// //             quality, convenience, and customer satisfaction sets us apart.
// //           </p>
// //           <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
// //             We use eco-friendly cleaning products and modern equipment to ensure your items receive the best care possible. 
// //             Our team of trained professionals treats every item with attention and respect.
// //           </p>
// //         </div>
// //       </section>

// //       {/* Contact Section */}
// //       <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get In Touch</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">We'd love to hear from you</p>
// //           </div>
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
// //             <div>
// //               <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg mb-6 sm:mb-8">
// //                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Contact Information</h3>
// //                 <div className="space-y-4 sm:space-y-5">
// //                   <div className="flex items-center gap-3 sm:gap-4">
// //                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
// //                       <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
// //                     </div>
// //                     <div>
// //                       <p className="text-xs sm:text-sm text-gray-600">Phone</p>
// //                       <p className="font-semibold text-gray-900 text-sm sm:text-base">1800 LAUNDRY</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center gap-3 sm:gap-4">
// //                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
// //                       <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
// //                     </div>
// //                     <div>
// //                       <p className="text-xs sm:text-sm text-gray-600">Email</p>
// //                       <p className="font-semibold text-gray-900 text-sm sm:text-base break-all">info@clienty.com.au</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center gap-3 sm:gap-4">
// //                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
// //                       <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
// //                     </div>
// //                     <div>
// //                       <p className="text-xs sm:text-sm text-gray-600">Address</p>
// //                       <p className="font-semibold text-gray-900 text-sm sm:text-base">Sydney, Melbourne, Brisbane</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="bg-teal-500 rounded-2xl p-6 sm:p-7 md:p-8 text-white">
// //                 <h3 className="text-xl sm:text-2xl font-bold mb-4">Business Hours</h3>
// //                 <div className="space-y-2">
// //                   <p className="text-sm sm:text-base"><span className="font-semibold">Monday - Friday:</span> 7:00 AM - 8:00 PM</p>
// //                   <p className="text-sm sm:text-base"><span className="font-semibold">Saturday:</span> 8:00 AM - 6:00 PM</p>
// //                   <p className="text-sm sm:text-base"><span className="font-semibold">Sunday:</span> 9:00 AM - 5:00 PM</p>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
// //               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Send Us a Message</h3>
// //               <form onSubmit={handleContactSubmit} className="space-y-4">
// //                 <div>
// //                   <Input
// //                     placeholder="Your Name"
// //                     value={contactForm.name}
// //                     onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
// //                     required
// //                     className="w-full text-sm sm:text-base py-5 sm:py-6"
// //                     data-testid="contact-name-input"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Input
// //                     type="email"
// //                     placeholder="Your Email"
// //                     value={contactForm.email}
// //                     onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
// //                     required
// //                     className="w-full text-sm sm:text-base py-5 sm:py-6"
// //                     data-testid="contact-email-input"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Input
// //                     placeholder="Your Phone"
// //                     value={contactForm.phone}
// //                     onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
// //                     required
// //                     className="w-full text-sm sm:text-base py-5 sm:py-6"
// //                     data-testid="contact-phone-input"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Textarea
// //                     placeholder="Your Message"
// //                     rows={5}
// //                     value={contactForm.message}
// //                     onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
// //                     required
// //                     className="w-full text-sm sm:text-base"
// //                     data-testid="contact-message-input"
// //                   />
// //                 </div>
// //                 <Button 
// //                   type="submit" 
// //                   className="w-full bg-teal-500 hover:bg-teal-600 text-white py-5 sm:py-6 text-base sm:text-lg"
// //                   data-testid="contact-submit-btn"
// //                 >
// //                   Send Message
// //                 </Button>
// //                 {submitStatus === 'success' && (
// //                   <p className="text-green-600 text-center text-sm sm:text-base">Message sent successfully!</p>
// //                 )}
// //                 {submitStatus === 'error' && (
// //                   <p className="text-red-600 text-center text-sm sm:text-base">Failed to send message. Please try again.</p>
// //                 )}
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Footer */}
// //       <footer className="bg-gray-900 text-white py-10 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8">
// //             <div className="text-center sm:text-left">
// //               <img 
// //                 src="https://customer-assets.emergentagent.com/job_washdash-1/artifacts/ed664txa_Screenshot%202025-10-14%20121020.png"
// //                 alt="Infinite Laundry Solutions Logo"
// //                 className="h-10 sm:h-12 w-auto mb-4 mx-auto sm:mx-0"
// //               />
// //               <p className="text-sm sm:text-base text-gray-400">Australia's trusted laundry service provider</p>
// //             </div>
// //             <div className="text-center sm:text-left">
// //               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Services</h4>
// //               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Wash & Fold</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Dry Cleaning</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Ironing</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Commercial</a></li>
// //               </ul>
// //             </div>
// //             <div className="text-center sm:text-left">
// //               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Company</h4>
// //               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
// //                 <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
// //                 <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
// //               </ul>
// //             </div>
// //             <div className="text-center sm:text-left">
// //               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Connect</h4>
// //               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Facebook</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Instagram</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Twitter</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">LinkedIn</a></li>
// //               </ul>
// //             </div>
// //           </div>
// //           <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400">
// //             <p className="text-sm sm:text-base">&copy; 2025 Clienty. All rights reserved.</p>
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // }

// // export default LandingPage;





// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Shirt, Sparkles, Wind, Building2, Droplets, Package, TrendingUp, Menu, X, Heart, Hotel } from 'lucide-react';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Textarea } from '@/components/ui/textarea';
// // import axios from 'axios';

// // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// // const API = `${BACKEND_URL}/api`;

// // function LandingPage() {
// //   const navigate = useNavigate();
// //   const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
// //   const [submitStatus, setSubmitStatus] = useState('');
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// //   const services = [
// //     { title: 'Commercial Laundry Services', description: 'High-volume, fast-turnaround service for hotels, motels, resorts, and more', price: 'Volume Based', icon: Building2 },
// //     { title: 'Linen Hire & Rental', description: 'Clean, pressed linen delivered on your schedule', price: 'From $0.75', icon: Shirt },
// //     { title: 'Uniform & Apparel Cleaning', description: 'For corporate, industrial, and healthcare staff', price: 'Custom Quote', icon: Sparkles },
// //     { title: 'Customer-Owned Goods (COG)', description: 'We clean what you own—professionally and precisely', price: 'Per Kg/Piece', icon: Package },
// //     { title: 'Specialty & Event Linen', description: 'Towels, napkins, tablecloths, bedding and more', price: 'From $0.75', icon: Droplets }
// //   ];

// //   const industries = [
// //     { title: 'Hospitality', description: 'Hotels, Motels, Resorts, Short-Term Rentals', icon: Hotel },
// //     { title: 'Healthcare', description: 'Clinics, Medical Centres, Aged Care Homes', icon: Heart }
// //   ];

// //   const pricingRental = [
// //     { product: 'King Sheets', price: 'from $2.25' }, { product: 'Queen Sheets', price: 'from $2.05' },
// //     { product: 'Single Sheets', price: 'from $1.95' }, { product: 'Bath Towels', price: 'from $1.50' },
// //     { product: 'Tea Towels', price: 'from $1.10' }, { product: 'Pillowcases', price: 'from $1.05' },
// //     { product: 'Bath Mats', price: 'from $0.90' }, { product: 'Hand Towels', price: 'from $0.80' },
// //     { product: 'Face Washers', price: 'from $0.75' }
// //   ];

// //   const features = [
// //     { icon: Clock, title: 'Fast Turnaround', description: '24-48 hour service available' },
// //     { icon: Shield, title: 'Quality Guaranteed', description: '100% satisfaction or money back' },
// //     { icon: Users, title: 'Expert Staff', description: 'Trained professionals handle your items' },
// //     { icon: Check, title: 'Eco-Friendly', description: 'Environmentally responsible cleaning' }
// //   ];

// //   const testimonials = [
// //     { name: 'Sarah Johnson', role: 'Business Owner', text: 'Infinite Laundry Solutions has been handling our restaurant linens for 2 years. Always on time, always perfect!', rating: 5 },
// //     { name: 'Michael Chen', role: 'Hotel Owner', text: 'The convenience of pickup and delivery service is unmatched. Highly recommend!', rating: 5 },
// //     { name: 'Emma Wilson', role: 'Hotel Manager', text: 'Professional service at competitive prices. They handle our high volume needs perfectly.', rating: 5 }
// //   ];

// //   const handleContactSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(`${API}/contact`, contactForm);
// //       setSubmitStatus('success');
// //       setContactForm({ name: '', email: '', phone: '', message: '' });
// //       setTimeout(() => setSubmitStatus(''), 3000);
// //     } catch (error) {
// //       setSubmitStatus('error');
// //       setTimeout(() => setSubmitStatus(''), 3000);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-white">
// //       <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-20 sm:h-20 ">
// //             <div className="flex items-center">
// //               <img src="/assets/logo.png" alt="Infinite Laundry Solutions Logo" className="h-20  w-auto" />
// //             </div>
// //             <div className="hidden lg:flex items-center space-x-6">
// //               <a href="#services" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">Services</a>
// //               <a href="#about" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">About</a>
// //               <a href="#contact" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">Contact</a>
// //               <div className='space-x-3'>
// //                 <Button onClick={() => navigate('/signup')} variant="outline" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 rounded-full px-4 py-2 xl:px-6 text-sm xl:text-base" data-testid="nav-signup-btn">Sign Up</Button>
// //                 <Button onClick={() => navigate('/login')} className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-full px-4 xl:px-6 text-sm xl:text-base" data-testid="nav-login-btn">Login</Button>
// //               </div>
// //             </div>
// //             <div className="lg:hidden flex items-center gap-2">
// //               <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="sm" className="p-2" data-testid="mobile-menu-btn">
// //                 {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
// //               </Button>
// //             </div>
// //           </div>
// //           {mobileMenuOpen && (
// //             <div className="lg:hidden py-4 border-t animate-fade-in" data-testid="mobile-menu">
// //               <div className="flex flex-col space-y-3">
// //                 <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50">Services</a>
// //                 <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50">About</a>
// //                 <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50">Contact</a>
// //                 <Button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} variant="outline" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 rounded-full w-full">Sign Up</Button>
// //                 <Button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-full">Login</Button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </nav>

// //       <section className="pt-20 mt-4 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50 to-white">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
// //             <div className="animate-fade-in text-center lg:text-left">
// //               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
// //                 Professional Laundry<span className="block text-teal-500 mt-1 sm:mt-2">Delivered to Your Door</span>
// //               </h1>
// //               <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 leading-relaxed px-2 sm:px-0">
// //                 Clean linen shouldn't be a luxury—it should be the standard. Experience Queensland's finest commercial laundry service.
// //               </p>
// //               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0">
// //                 <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white text-base sm:text-lg px-6 sm:px-8 py-7  rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto" onClick={() => navigate('/login')} data-testid="hero-book-pickup-btn">Book Laundry Pickup</Button>
// //                 <Button size="lg" variant="outline" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 text-base sm:text-lg px-6 sm:px-8 py-7 rounded-full w-full sm:w-auto" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>View Services</Button>
// //               </div>
// //               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 mt-6 sm:mt-8">
// //                 <div className="flex items-center">
// //                   {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />))}
// //                 </div>
// //                 <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left"><span className="font-semibold text-gray-900">4.9/5</span> from 500+ reviews</p>
// //               </div>
// //             </div>
// //             <div className="relative mt-8 lg:mt-0 px-4 sm:px-0">
// //               <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
// //                 <img src="https://images.unsplash.com/photo-1627564359646-5972788cec65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGZvbGRlZCUyMGNsb3RoZXN8ZW58MHx8fHwxNzYwMzc1NjMwfDA&ixlib=rb-4.1.0&q=85" alt="Clean folded laundry" className="w-full h-full object-cover" />
// //               </div>
// //               <div className="absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
// //                 <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
// //                   <div className="bg-teal-100 rounded-full p-2 sm:p-2.5 md:p-3 flex-shrink-0"><Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-600" /></div>
// //                   <div>
// //                     <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base leading-tight">Same Day Service</p>
// //                     <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight mt-0.5">Available in metro areas</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Infinite Laundry Solutions?</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">Quality service you can trust</p>
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
// //             {features.map((feature, index) => (
// //               <div key={index} className="text-center p-5 sm:p-6 md:p-8 rounded-2xl hover:bg-teal-50 transition-all card-hover">
// //                 <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-teal-100 rounded-full mb-3 sm:mb-4">
// //                   <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-600" />
// //                 </div>
// //                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
// //                 <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Services</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Clean linen shouldn't be a luxury—it should be the standard. At Infinite Laundry Solutions, we offer a range of services designed to meet the specific demands of busy venues across Queensland.</p>
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
// //             {services.map((service, index) => {
// //               const IconComponent = service.icon;
// //               return (
// //                 <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg card-hover">
// //                   <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
// //                     <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" />
// //                   </div>
// //                   <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
// //                   <p className="text-sm sm:text-base text-gray-600 mb-4">{service.description}</p>
// //                   <p className="text-xl sm:text-2xl font-bold text-teal-500">{service.price}</p>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </section>

// //       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Industries We Serve</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">We understand the unique needs of every industry we serve. Whether you're welcoming guests, caring for patients, or feeding the masses, you need clean, dependable linen—and fast.</p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
// //             {industries.map((industry, index) => {
// //               const IconComponent = industry.icon;
// //               return (
// //                 <div key={index} className="bg-teal-50 rounded-2xl p-6 sm:p-8 md:p-10 text-center hover:bg-teal-100 transition-all card-hover">
// //                   <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-teal-500 rounded-full mb-4 sm:mb-6">
// //                     <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
// //                   </div>
// //                   <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{industry.title}</h3>
// //                   <p className="text-sm sm:text-base text-gray-700">{industry.description}</p>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </section>

// //       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Prices</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">At Infinite Laundry Solutions, we believe in transparent, tailored pricing that suits the unique needs of your business.</p>
// //           </div>
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
// //             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
// //               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Linen Rental Services</h3>
// //               <p className="text-sm sm:text-base text-gray-600 mb-6">Perfect for businesses looking for a hassle-free solution. Our pricing includes laundering, drying and replacement of worn items—ideal for hospitality and healthcare settings.</p>
// //               <div className="space-y-3">
// //                 <div className="grid grid-cols-2 gap-4 pb-3 border-b-2 border-teal-500 font-semibold text-gray-900">
// //                   <div>Product</div><div className="text-right">Pricing (exc. GST)</div>
// //                 </div>
// //                 {pricingRental.map((item, index) => (
// //                   <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
// //                     <div className="text-sm sm:text-base text-gray-700">{item.product}</div>
// //                     <div className="text-sm sm:text-base text-teal-600 font-semibold text-right">{item.price}</div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
// //               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Customer-Owned Goods (COG) Services</h3>
// //               <p className="text-sm sm:text-base text-gray-600 mb-6">Already have your own linen? No problem. We offer competitive per-kilo or per-piece pricing for cleaning and return of your linen, with options for express turnaround and volume discounts.</p>
// //               <div className="bg-teal-50 rounded-xl p-6 sm:p-8">
// //                 <div className="space-y-4">
// //                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Competitive Per-Kilo Pricing</p><p className="text-xs sm:text-sm text-gray-600">Best rates for bulk laundry</p></div></div>
// //                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Per-Piece Pricing Available</p><p className="text-xs sm:text-sm text-gray-600">Perfect for specialized items</p></div></div>
// //                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Express Turnaround Options</p><p className="text-xs sm:text-sm text-gray-600">When you need it fast</p></div></div>
// //                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Volume Discounts</p><p className="text-xs sm:text-sm text-gray-600">Save more with higher volumes</p></div></div>
// //                 </div>
// //               </div>
// //               <div className="mt-6 text-center">
// //                 <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-base sm:text-lg rounded-full" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Request Custom Quote</Button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">Simple, fast, and convenient</p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
// //             <div className="text-center px-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><Package className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Schedule Pickup</h3><p className="text-sm sm:text-base text-gray-600">Book online or call us to schedule a convenient pickup time</p></div>
// //             <div className="text-center px-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">We Clean</h3><p className="text-sm sm:text-base text-gray-600">Our experts clean your items with care and attention to detail</p></div>
// //             <div className="text-center px-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Delivery</h3><p className="text-sm sm:text-base text-gray-600">Fresh, clean items delivered right to your doorstep</p></div>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What Our Customers Say</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">Join thousands of satisfied customers</p>
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
// //             {testimonials.map((testimonial, index) => (
// //               <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
// //                 <div className="flex mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />))}</div>
// //                 <p className="text-sm sm:text-base text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
// //                 <div><p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p><p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p></div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
// //         <div className="max-w-4xl mx-auto text-center">
// //           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-5 sm:mb-6">About Infinite Laundry Solutions</h2>
// //           <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">Infinite Laundry Solutions is Queensland's premier commercial laundry service provider. With over 10 years of experience, we've been serving businesses across the region with dedication and expertise. Our commitment to quality, convenience, and customer satisfaction sets us apart.</p>
// //           <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">We use eco-friendly cleaning products and modern equipment to ensure your items receive the best care possible. Our team of trained professionals treats every item with attention and respect. From small boutique stays to large medical facilities, we provide scalable, stress-free laundry and linen solutions.</p>
// //         </div>
// //       </section>

// //       <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
// //             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get In Touch</h2>
// //             <p className="text-base sm:text-lg md:text-xl text-gray-600">We'd love to hear from you</p>
// //           </div>
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
// //             <div>
// //               <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg mb-6 sm:mb-8">
// //                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Contact Information</h3>
// //                 <div className="space-y-4 sm:space-y-5">
// //                   <div className="flex items-center gap-3 sm:gap-4">
// //                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
// //                     <div><p className="text-xs sm:text-sm text-gray-600">Phone</p><p className="font-semibold text-gray-900 text-sm sm:text-base">1800 LAUNDRY</p></div>
// //                   </div>
// //                   <div className="flex items-center gap-3 sm:gap-4">
// //                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
// //                     <div><p className="text-xs sm:text-sm text-gray-600">Email</p><p className="font-semibold text-gray-900 text-sm sm:text-base break-all">info@infinitelaundry.com.au</p></div>
// //                   </div>
// //                   <div className="flex items-center gap-3 sm:gap-4">
// //                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
// //                     <div><p className="text-xs sm:text-sm text-gray-600">Address</p><p className="font-semibold text-gray-900 text-sm sm:text-base">Serving Queensland</p></div>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="bg-teal-500 rounded-2xl p-6 sm:p-7 md:p-8 text-white">
// //                 <h3 className="text-xl sm:text-2xl font-bold mb-4">Business Hours</h3>
// //                 <div className="space-y-2">
// //                   <p className="text-sm sm:text-base"><span className="font-semibold">Monday - Friday:</span> 7:00 AM - 8:00 PM</p>
// //                   <p className="text-sm sm:text-base"><span className="font-semibold">Saturday:</span> 8:00 AM - 6:00 PM</p>
// //                   <p className="text-sm sm:text-base"><span className="font-semibold">Sunday:</span> 9:00 AM - 5:00 PM</p>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
// //               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Send Us a Message</h3>
// //               <form onSubmit={handleContactSubmit} className="space-y-4">
// //                 <div><Input placeholder="Your Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-name-input" /></div>
// //                 <div><Input type="email" placeholder="Your Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-email-input" /></div>
// //                 <div><Input placeholder="Your Phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-phone-input" /></div>
// //                 <div><Textarea placeholder="Your Message" rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required className="w-full text-sm sm:text-base" data-testid="contact-message-input" /></div>
// //                 <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white py-5 sm:py-6 text-base sm:text-lg" data-testid="contact-submit-btn">Send Message</Button>
// //                 {submitStatus === 'success' && (<p className="text-green-600 text-center text-sm sm:text-base">Message sent successfully!</p>)}
// //                 {submitStatus === 'error' && (<p className="text-red-600 text-center text-sm sm:text-base">Failed to send message. Please try again.</p>)}
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       <footer className="bg-gray-900 text-white py-10 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8">
// //             <div className="text-center sm:text-left">
// //               <img src="https://customer-assets.emergentagent.com/job_washdash-1/artifacts/ed664txa_Screenshot%202025-10-14%20121020.png" alt="Infinite Laundry Solutions Logo" className="h-10 sm:h-12 w-auto mb-4 mx-auto sm:mx-0" />
// //               <p className="text-sm sm:text-base text-gray-400">Queensland's trusted laundry service provider</p>
// //             </div>
// //             <div className="text-center sm:text-left">
// //               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Services</h4>
// //               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
// //                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Commercial Laundry</a></li>
// //                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Linen Rental</a></li>
// //                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Uniform Cleaning</a></li>
// //                 <li><a href="#services" className="hover:text-teal-400 transition-colors">COG Services</a></li>
// //               </ul>
// //             </div>
// //             <div className="text-center sm:text-left">
// //               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Company</h4>
// //               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
// //                 <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
// //                 <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
// //               </ul>
// //             </div>
// //             <div className="text-center sm:text-left">
// //               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Connect</h4>
// //               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Facebook</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Instagram</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">Twitter</a></li>
// //                 <li><a href="#" className="hover:text-teal-400 transition-colors">LinkedIn</a></li>
// //               </ul>
// //             </div>
// //           </div>
// //           <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400">
// //             <p className="text-sm sm:text-base">&copy; 2025 Infinite Laundry Solutions. All rights reserved.</p>
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // }

// // export default LandingPage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Shirt, Sparkles, Wind, Building2, Droplets, Package, TrendingUp, Menu, X, Heart, Hotel, Truck, Zap, Award, Leaf } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import axios from 'axios';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = `${BACKEND_URL}/api`;

// function LandingPage() {
//   const navigate = useNavigate();
//   const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
//   const [submitStatus, setSubmitStatus] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const services = [
//     { title: 'Commercial Laundry Services', description: 'High-volume, fast-turnaround service for hotels, motels, resorts, and more', price: 'Volume Based', icon: Wind },
//     { title: 'Linen Hire & Rental', description: 'Clean, pressed linen delivered on your schedule', price: 'From $0.75', icon: Truck },
//     { title: 'Uniform & Apparel Cleaning', description: 'For corporate, industrial, and healthcare staff', price: 'Custom Quote', icon: Shirt },
//     { title: 'Customer-Owned Goods (COG)', description: 'We clean what you own—professionally and precisely', price: 'Per Kg/Piece', icon: Package },
//     { title: 'Specialty & Event Linen', description: 'Towels, napkins, tablecloths, bedding and more', price: 'From $0.75', icon: Droplets }
//   ];

//   const industries = [
//     { title: 'Hospitality', description: 'Hotels, Motels, Resorts, Short-Term Rentals', icon: Hotel },
//     { title: 'Healthcare', description: 'Clinics, Medical Centres, Aged Care Homes', icon: Heart }
//   ];

//   const pricingRental = [
//     { product: 'King Sheets', price: 'from $2.25' }, { product: 'Queen Sheets', price: 'from $2.05' },
//     { product: 'Single Sheets', price: 'from $1.95' }, { product: 'Bath Towels', price: 'from $1.50' },
//     { product: 'Tea Towels', price: 'from $1.10' }, { product: 'Pillowcases', price: 'from $1.05' },
//     { product: 'Bath Mats', price: 'from $0.90' }, { product: 'Hand Towels', price: 'from $0.80' },
//     { product: 'Face Washers', price: 'from $0.75' }
//   ];

//   const features = [
//     { icon: Clock, title: 'Fast Turnaround', description: '24-48 hour service available' },
//     { icon: Shield, title: 'Quality Guaranteed', description: '100% satisfaction or money back' },
//     { icon: Users, title: 'Expert Staff', description: 'Trained professionals handle your items' },
//     { icon: Leaf, title: 'Eco-Friendly', description: 'Environmentally responsible cleaning' }
//   ];

//   const whyChooseUs = [
//     { 
//       title: 'Electrolux Machinery', 
//       description: 'Our state-of-the-art European machines provide best-in-class performance with exceptional water and energy efficiency.',
//       icon: Zap
//     },
//     { 
//       title: 'Experience-Driven', 
//       description: 'We know the industry inside-out because we\'re part of it.',
//       icon: Award
//     },
//     { 
//       title: 'Flexible Service Options', 
//       description: 'Linen hire or COG, on-demand or scheduled—we adapt to your business model.',
//       icon: Wind
//     }
//   ];

//   const testimonials = [
//     { name: 'Sarah Johnson', role: 'Business Owner', text: 'Infinite Laundry Solutions has been handling our restaurant linens for 2 years. Always on time, always perfect!', rating: 5 },
//     { name: 'Michael Chen', role: 'Hotel Owner', text: 'The convenience of pickup and delivery service is unmatched. Highly recommend!', rating: 5 },
//     { name: 'Emma Wilson', role: 'Hotel Manager', text: 'Professional service at competitive prices. They handle our high volume needs perfectly.', rating: 5 }
//   ];

//   const handleContactSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API}/contact`, contactForm);
//       setSubmitStatus('success');
//       setContactForm({ name: '', email: '', phone: '', message: '' });
//       setTimeout(() => setSubmitStatus(''), 3000);
//     } catch (error) {
//       setSubmitStatus('error');
//       setTimeout(() => setSubmitStatus(''), 3000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-20 sm:h-20 ">
//             <div className="flex items-center">
//               <img src="/assets/logo.png" alt="Infinite Laundry Solutions Logo" className="h-20  w-auto" />
//             </div>
//             <div className="hidden lg:flex items-center space-x-6">
//               <a href="#services" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">Services</a>
//               <a href="#about" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">About</a>
//               <a href="#contact" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">Contact</a>
//               <div className='space-x-3'>
//                 <Button onClick={() => navigate('/signup')} variant="outline" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 rounded-full px-4 py-2 xl:px-6 text-sm xl:text-base" data-testid="nav-signup-btn">Sign Up</Button>
//                 <Button onClick={() => navigate('/login')} className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-full px-4 xl:px-6 text-sm xl:text-base" data-testid="nav-login-btn">Login</Button>
//               </div>
//             </div>
//             <div className="lg:hidden flex items-center gap-2">
//               <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="sm" className="p-2" data-testid="mobile-menu-btn">
//                 {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//               </Button>
//             </div>
//           </div>
//           {mobileMenuOpen && (
//             <div className="lg:hidden py-4 border-t animate-fade-in" data-testid="mobile-menu">
//               <div className="flex flex-col space-y-3">
//                 <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50">Services</a>
//                 <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50">About</a>
//                 <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50">Contact</a>
//                 <Button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} variant="outline" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 rounded-full w-full">Sign Up</Button>
//                 <Button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-full">Login</Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       <section className="pt-20 mt-4 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50 to-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
//             <div className="animate-fade-in text-center lg:text-left">
//               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
//                 Professional Laundry<span className="block text-teal-500 mt-1 sm:mt-2">Delivered to Your Door</span>
//               </h1>
//               <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 leading-relaxed px-2 sm:px-0">
//                 Clean linen shouldn't be a luxury—it should be the standard. Experience Queensland's finest commercial laundry service.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0">
//                 <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white text-base sm:text-lg px-6 sm:px-8 py-7  rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto" onClick={() => navigate('/login')} data-testid="hero-book-pickup-btn">Book Laundry Pickup</Button>
//                 <Button size="lg" variant="outline" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 text-base sm:text-lg px-6 sm:px-8 py-7 rounded-full w-full sm:w-auto" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>View Services</Button>
//               </div>
//               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 mt-6 sm:mt-8">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />))}
//                 </div>
//                 <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left"><span className="font-semibold text-gray-900">4.9/5</span> from 500+ reviews</p>
//               </div>
//             </div>
//             <div className="relative mt-8 lg:mt-0 px-4 sm:px-0">
//               <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
//                 <img src="https://images.unsplash.com/photo-1627564359646-5972788cec65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGZvbGRlZCUyMGNsb3RoZXN8ZW58MHx8fHwxNzYwMzc1NjMwfDA&ixlib=rb-4.1.0&q=85" alt="Clean folded laundry" className="w-full h-full object-cover" />
//               </div>
//               <div className="absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
//                 <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
//                   <div className="bg-teal-100 rounded-full p-2 sm:p-2.5 md:p-3 flex-shrink-0"><Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-600" /></div>
//                   <div>
//                     <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base leading-tight">Same Day Service</p>
//                     <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight mt-0.5">Available in metro areas</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Infinite Laundry Solutions?</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">Quality service you can trust</p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="text-center p-5 sm:p-6 md:p-8 rounded-2xl hover:bg-teal-50 transition-all card-hover">
//                 <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-teal-100 rounded-full mb-3 sm:mb-4">
//                   <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-600" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
//                 <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Services</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Clean linen shouldn't be a luxury—it should be the standard. At Infinite Laundry Solutions, we offer a range of services designed to meet the specific demands of busy venues across Queensland.</p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
//             {services.map((service, index) => {
//               const IconComponent = service.icon;
//               return (
//                 <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg card-hover">
//                   <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
//                     <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" />
//                   </div>
//                   <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
//                   <p className="text-sm sm:text-base text-gray-600 mb-4">{service.description}</p>
//                   <p className="text-xl sm:text-2xl font-bold text-teal-500">{service.price}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Industries We Serve</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">We understand the unique needs of every industry we serve. Whether you're welcoming guests, caring for patients, or feeding the masses, you need clean, dependable linen—and fast.</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
//             {industries.map((industry, index) => {
//               const IconComponent = industry.icon;
//               return (
//                 <div key={index} className="bg-teal-50 rounded-2xl p-6 sm:p-8 md:p-10 text-center hover:bg-teal-100 transition-all card-hover">
//                   <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-teal-500 rounded-full mb-4 sm:mb-6">
//                     <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
//                   </div>
//                   <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{industry.title}</h3>
//                   <p className="text-sm sm:text-base text-gray-700">{industry.description}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Prices</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">At Infinite Laundry Solutions, we believe in transparent, tailored pricing that suits the unique needs of your business.</p>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
//             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
//               <div className="flex items-center justify-center mb-6">
//                 <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center">
//                   <Truck className="w-8 h-8 text-teal-600" />
//                 </div>
//               </div>
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">Linen Rental Services</h3>
//               <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">Perfect for businesses looking for a hassle-free solution. Our pricing includes laundering, drying and replacement of worn items—ideal for hospitality and healthcare settings.</p>
//               <div className="space-y-3">
//                 <div className="grid grid-cols-2 gap-4 pb-3 border-b-2 border-teal-500 font-semibold text-gray-900">
//                   <div>Product</div><div className="text-right">Pricing (exc. GST)</div>
//                 </div>
//                 {pricingRental.map((item, index) => (
//                   <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
//                     <div className="text-sm sm:text-base text-gray-700">{item.product}</div>
//                     <div className="text-sm sm:text-base text-teal-600 font-semibold text-right">{item.price}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
//               <div className="flex items-center justify-center mb-6">
//                 <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center">
//                   <Package className="w-8 h-8 text-teal-600" />
//                 </div>
//               </div>
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">Customer-Owned Goods (COG) Services</h3>
//               <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">Already have your own linen? No problem. We offer competitive per-kilo or per-piece pricing for cleaning and return of your linen, with options for express turnaround and volume discounts.</p>
//               <div className="bg-teal-50 rounded-xl p-6 sm:p-8">
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Competitive Per-Kilo Pricing</p><p className="text-xs sm:text-sm text-gray-600">Best rates for bulk laundry</p></div></div>
//                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Per-Piece Pricing Available</p><p className="text-xs sm:text-sm text-gray-600">Perfect for specialized items</p></div></div>
//                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Express Turnaround Options</p><p className="text-xs sm:text-sm text-gray-600">When you need it fast</p></div></div>
//                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Volume Discounts</p><p className="text-xs sm:text-sm text-gray-600">Save more with higher volumes</p></div></div>
//                 </div>
//               </div>
//               <div className="mt-6 text-center">
//                 <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-base sm:text-lg rounded-full" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Request Custom Quote</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
//             <div>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Why ILS?</h2>
//               <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed">
//                 We've built Infinite Laundry Solutions on a foundation of industry knowledge, operational excellence, and next-generation technology. With premium Electrolux machines and sustainable practices at our core, we deliver more than clean linen—we deliver peace of mind.
//               </p>
//               <div className="space-y-6 sm:space-y-8">
//                 {whyChooseUs.map((item, index) => {
//                   const IconComponent = item.icon;
//                   return (
//                     <div key={index} className="border-b border-gray-200 pb-6">
//                       <div className="flex items-start gap-4">
//                         <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
//                           <IconComponent className="w-6 h-6 text-teal-600" />
//                         </div>
//                         <div>
//                           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
//                           <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             <div className="relative">
//               <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
//                 <img src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHw0fHx0b3dlbHMlMjBzdGFja2VkfGVufDB8fHx8MTcyOTM0NTY3OXww&ixlib=rb-4.1.0&q=85" alt="Clean stacked towels" className="w-full h-full object-cover" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">Simple, fast, and convenient</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
//             <div className="text-center px-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">We Clean</h3><p className="text-sm sm:text-base text-gray-600">Our experts clean your items with care and attention to detail</p></div>
//             <div className="text-center px-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Delivery</h3><p className="text-sm sm:text-base text-gray-600">Fresh, clean items delivered right to your doorstep</p></div>
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What Our Customers Say</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">Join thousands of satisfied customers</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
//             {testimonials.map((testimonial, index) => (
//               <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
//                 <div className="flex mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />))}</div>
//                 <p className="text-sm sm:text-base text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
//                 <div><p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p><p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-5 sm:mb-6">About Infinite Laundry Solutions</h2>
//           <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">Infinite Laundry Solutions is Queensland's premier commercial laundry service provider. With over 10 years of experience, we've been serving businesses across the region with dedication and expertise. Our commitment to quality, convenience, and customer satisfaction sets us apart.</p>
//           <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">We use eco-friendly cleaning products and modern equipment to ensure your items receive the best care possible. Our team of trained professionals treats every item with attention and respect. From small boutique stays to large medical facilities, we provide scalable, stress-free laundry and linen solutions.</p>
//         </div>
//       </section>

//       <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get In Touch</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">We'd love to hear from you</p>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
//             <div>
//               <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg mb-6 sm:mb-8">
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Contact Information</h3>
//                 <div className="space-y-4 sm:space-y-5">
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
//                     <div><p className="text-xs sm:text-sm text-gray-600">Phone</p><p className="font-semibold text-gray-900 text-sm sm:text-base">1800 LAUNDRY</p></div>
//                   </div>
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
//                     <div><p className="text-xs sm:text-sm text-gray-600">Email</p><p className="font-semibold text-gray-900 text-sm sm:text-base break-all">info@infinitelaundry.com.au</p></div>
//                   </div>
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
//                     <div><p className="text-xs sm:text-sm text-gray-600">Address</p><p className="font-semibold text-gray-900 text-sm sm:text-base">Serving Queensland</p></div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-teal-500 rounded-2xl p-6 sm:p-7 md:p-8 text-white">
//                 <h3 className="text-xl sm:text-2xl font-bold mb-4">Business Hours</h3>
//                 <div className="space-y-2">
//                   <p className="text-sm sm:text-base"><span className="font-semibold">Monday - Friday:</span> 7:00 AM - 8:00 PM</p>
//                   <p className="text-sm sm:text-base"><span className="font-semibold">Saturday:</span> 8:00 AM - 6:00 PM</p>
//                   <p className="text-sm sm:text-base"><span className="font-semibold">Sunday:</span> 9:00 AM - 5:00 PM</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Send Us a Message</h3>
//               <form onSubmit={handleContactSubmit} className="space-y-4">
//                 <div><Input placeholder="Your Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-name-input" /></div>
//                 <div><Input type="email" placeholder="Your Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-email-input" /></div>
//                 <div><Input placeholder="Your Phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-phone-input" /></div>
//                 <div><Textarea placeholder="Your Message" rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required className="w-full text-sm sm:text-base" data-testid="contact-message-input" /></div>
//                 <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white py-5 sm:py-6 text-base sm:text-lg" data-testid="contact-submit-btn">Send Message</Button>
//                 {submitStatus === 'success' && (<p className="text-green-600 text-center text-sm sm:text-base">Message sent successfully!</p>)}
//                 {submitStatus === 'error' && (<p className="text-red-600 text-center text-sm sm:text-base">Failed to send message. Please try again.</p>)}
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-gray-900 text-white py-10 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8">
//             <div className="text-center sm:text-left">
//               <img src="https://customer-assets.emergentagent.com/job_washdash-1/artifacts/ed664txa_Screenshot%202025-10-14%20121020.png" alt="Infinite Laundry Solutions Logo" className="h-10 sm:h-12 w-auto mb-4 mx-auto sm:mx-0" />
//               <p className="text-sm sm:text-base text-gray-400">Queensland's trusted laundry service provider</p>
//             </div>
//             <div className="text-center sm:text-left">
//               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Services</h4>
//               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
//                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Commercial Laundry</a></li>
//                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Linen Rental</a></li>
//                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Uniform Cleaning</a></li>
//                 <li><a href="#services" className="hover:text-teal-400 transition-colors">COG Services</a></li>
//               </ul>
//             </div>
//             <div className="text-center sm:text-left">
//               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Company</h4>
//               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
//                 <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
//                 <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
//               </ul>
//             </div>
//             <div className="text-center sm:text-left">
//               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Connect</h4>
//               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Facebook</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Instagram</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Twitter</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">LinkedIn</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400">
//             <p className="text-sm sm:text-base">&copy; 2025 Infinite Laundry Solutions. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default LandingPage;

//UPDATED
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Shirt, Sparkles, Wind, Building2, Droplets, Package, TrendingUp, Menu, X, Heart, Hotel } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import axios from 'axios';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const API = `${BACKEND_URL}/api`;

// function LandingPage() {
//   const navigate = useNavigate();
//   const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
//   const [submitStatus, setSubmitStatus] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const services = [
//     { title: 'Commercial Laundry Services', description: 'High-volume, fast-turnaround service for hotels, motels, resorts, and more', price: 'Volume Based', icon: Building2, emoji: '🧺' },
//     { title: 'Linen Hire & Rental', description: 'Clean, pressed linen delivered on your schedule', price: 'From $0.75', icon: Shirt, emoji: '🛏️' },
//     { title: 'Uniform & Apparel Cleaning', description: 'For corporate, industrial, and healthcare staff', price: 'Custom Quote', icon: Sparkles, emoji: '👔' },
//     { title: 'Customer-Owned Goods (COG)', description: 'We clean what you own—professionally and precisely', price: 'Per Kg/Piece', icon: Package, emoji: '📦' },
//     { title: 'Specialty & Event Linen', description: 'Towels, napkins, tablecloths, bedding and more', price: 'From $0.75', icon: Droplets, emoji: '🎪' }
//   ];

//   const industries = [
//     { title: 'Hospitality', description: 'Hotels, Motels, Resorts, Short-Term Rentals', icon: Hotel },
//     { title: 'Healthcare', description: 'Clinics, Medical Centres, Aged Care Homes', icon: Heart }
//   ];

//   const pricingRental = [
//     { product: 'King Sheets', price: 'from $2.25' }, { product: 'Queen Sheets', price: 'from $2.05' },
//     { product: 'Single Sheets', price: 'from $1.95' }, { product: 'Bath Towels', price: 'from $1.50' },
//     { product: 'Tea Towels', price: 'from $1.10' }, { product: 'Pillowcases', price: 'from $1.05' },
//     { product: 'Bath Mats', price: 'from $0.90' }, { product: 'Hand Towels', price: 'from $0.80' },
//     { product: 'Face Washers', price: 'from $0.75' }
//   ];

//   const features = [
//     { icon: Clock, title: 'Fast Turnaround', description: '24-48 hour service available' },
//     { icon: Shield, title: 'Quality Guaranteed', description: '100% satisfaction or money back' },
//     { icon: Users, title: 'Expert Staff', description: 'Trained professionals handle your items' },
//     { icon: Check, title: 'Eco-Friendly', description: 'Environmentally responsible cleaning' }
//   ];

//   const testimonials = [
//     { name: 'Sarah Johnson', role: 'Business Owner', text: 'Infinite Laundry Solutions has been handling our restaurant linens for 2 years. Always on time, always perfect!', rating: 5 },
//     { name: 'Michael Chen', role: 'Hotel Owner', text: 'The convenience of pickup and delivery service is unmatched. Highly recommend!', rating: 5 },
//     { name: 'Emma Wilson', role: 'Hotel Manager', text: 'Professional service at competitive prices. They handle our high volume needs perfectly.', rating: 5 }
//   ];

//   const handleContactSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API}/contact`, contactForm);
//       setSubmitStatus('success');
//       setContactForm({ name: '', email: '', phone: '', message: '' });
//       setTimeout(() => setSubmitStatus(''), 3000);
//     } catch (error) {
//       setSubmitStatus('error');
//       setTimeout(() => setSubmitStatus(''), 3000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-20 sm:h-20 ">
//             <div className="flex items-center">
//               <img src="/assets/logo.png" alt="Infinite Laundry Solutions Logo" className="h-20  w-auto" />
//             </div>
//             <div className="hidden lg:flex items-center space-x-6">
//               <a 
//                 href="#services" 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   const element = document.getElementById('services');
//                   if (element) {
//                     const yOffset = -80;
//                     const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//                     window.scrollTo({ top: y, behavior: 'smooth' });
//                   }
//                 }}
//                 className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium cursor-pointer"
//               >
//                 Services
//               </a>
//               <a 
//                 href="#about" 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   const element = document.getElementById('about');
//                   if (element) {
//                     const yOffset = -80;
//                     const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//                     window.scrollTo({ top: y, behavior: 'smooth' });
//                   }
//                 }}
//                 className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium cursor-pointer"
//               >
//                 About
//               </a>
//               <a 
//                 href="#contact" 
//                 onClick={(e) => {
//                   e.preventDefault();
//                   const element = document.getElementById('contact');
//                   if (element) {
//                     const yOffset = -80;
//                     const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//                     window.scrollTo({ top: y, behavior: 'smooth' });
//                   }
//                 }}
//                 className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium cursor-pointer"
//               >
//                 Contact
//               </a>
//               <Button onClick={() => navigate('/login')} className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-full px-4 xl:px-6 text-sm xl:text-base" data-testid="nav-login-btn">Login</Button>
//             </div>
//             <div className="lg:hidden flex items-center gap-2">
//               <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost" size="sm" className="p-2" data-testid="mobile-menu-btn">
//                 {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//               </Button>
//             </div>
//           </div>
//           {mobileMenuOpen && (
//             <div className="lg:hidden py-4 border-t animate-fade-in" data-testid="mobile-menu">
//               <div className="flex flex-col space-y-3">
//                 <a 
//                   href="#services" 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setMobileMenuOpen(false);
//                     const element = document.getElementById('services');
//                     if (element) {
//                       const yOffset = -80;
//                       const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//                       window.scrollTo({ top: y, behavior: 'smooth' });
//                     }
//                   }}
//                   className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50 cursor-pointer"
//                 >
//                   Services
//                 </a>
//                 <a 
//                   href="#about" 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setMobileMenuOpen(false);
//                     const element = document.getElementById('about');
//                     if (element) {
//                       const yOffset = -80;
//                       const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//                       window.scrollTo({ top: y, behavior: 'smooth' });
//                     }
//                   }}
//                   className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50 cursor-pointer"
//                 >
//                   About
//                 </a>
//                 <a 
//                   href="#contact" 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setMobileMenuOpen(false);
//                     const element = document.getElementById('contact');
//                     if (element) {
//                       const yOffset = -80;
//                       const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//                       window.scrollTo({ top: y, behavior: 'smooth' });
//                     }
//                   }}
//                   className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50 cursor-pointer"
//                 >
//                   Contact
//                 </a>
//                 <Button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-full">Login</Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       <section className="pt-20 mt-4 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50 to-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
//             <div className="animate-fade-in text-center lg:text-left">
//               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
//                 Professional Laundry<span className="block text-teal-500 mt-1 sm:mt-2">Delivered to Your Door</span>
//               </h1>
//               <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 leading-relaxed px-2 sm:px-0">
//                 Clean linen shouldn't be a luxury—it should be the standard. Experience Queensland's finest commercial laundry service.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0">
//                 <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white text-base sm:text-lg px-6 sm:px-8 py-7  rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto" onClick={() => navigate('/login')} data-testid="hero-book-pickup-btn">Book Laundry Pickup</Button>
//                 <Button size="lg" variant="outline" className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 text-base sm:text-lg px-6 sm:px-8 py-7 rounded-full w-full sm:w-auto" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>View Services</Button>
//               </div>
//               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 mt-6 sm:mt-8">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />))}
//                 </div>
//                 <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left"><span className="font-semibold text-gray-900">4.9/5</span> from 500+ reviews</p>
//               </div>
//             </div>
//             <div className="relative mt-8 lg:mt-0 px-4 sm:px-0">
//               <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
//                 <img src="https://images.unsplash.com/photo-1627564359646-5972788cec65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGZvbGRlZCUyMGNsb3RoZXN8ZW58MHx8fHwxNzYwMzc1NjMwfDA&ixlib=rb-4.1.0&q=85" alt="Clean folded laundry" className="w-full h-full object-cover" />
//               </div>
//               <div className="absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
//                 <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
//                   <div className="bg-teal-100 rounded-full p-2 sm:p-2.5 md:p-3 flex-shrink-0"><Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-600" /></div>
//                   <div>
//                     <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base leading-tight">Same Day Service</p>
//                     <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight mt-0.5">Available in metro areas</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Infinite Laundry Solutions?</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">Quality service you can trust</p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="text-center p-5 sm:p-6 md:p-8 rounded-2xl hover:bg-teal-50 transition-all card-hover">
//                 <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-teal-100 rounded-full mb-3 sm:mb-4">
//                   <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-600" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
//                 <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Services</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Clean linen shouldn't be a luxury—it should be the standard. At Infinite Laundry Solutions, we offer a range of services designed to meet the specific demands of busy venues across Queensland.</p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
//             {services.map((service, index) => {
//               const IconComponent = service.icon;
//               return (
//                 <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg card-hover">
//                   <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
//                     <span className="text-3xl sm:text-4xl">{service.emoji}</span>
//                   </div>
//                   <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
//                   <p className="text-sm sm:text-base text-gray-600 mb-4">{service.description}</p>
//                   {service.price === 'Custom Quote' ? (
//                     <p 
//                       className="text-xl sm:text-2xl font-bold text-teal-500 cursor-pointer hover:text-teal-600 transition-colors"
//                       onClick={() => {
//                         const element = document.getElementById('contact');
//                         if (element) {
//                           const yOffset = -80;
//                           const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//                           window.scrollTo({ top: y, behavior: 'smooth' });
//                         }
//                       }}
//                     >
//                       {service.price}
//                     </p>
//                   ) : (
//                     <p className="text-xl sm:text-2xl font-bold text-teal-500">{service.price}</p>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Industries We Serve</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">We understand the unique needs of every industry we serve. Whether you're welcoming guests, caring for patients, or feeding the masses, you need clean, dependable linen—and fast.</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
//             {industries.map((industry, index) => {
//               const IconComponent = industry.icon;
//               return (
//                 <div key={index} className="bg-teal-50 rounded-2xl p-6 sm:p-8 md:p-10 text-center hover:bg-teal-100 transition-all card-hover">
//                   <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-teal-500 rounded-full mb-4 sm:mb-6">
//                     <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
//                   </div>
//                   <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{industry.title}</h3>
//                   <p className="text-sm sm:text-base text-gray-700">{industry.description}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Prices</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">At Infinite Laundry Solutions, we believe in transparent, tailored pricing that suits the unique needs of your business.</p>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
//             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Linen Rental Services</h3>
//               <p className="text-sm sm:text-base text-gray-600 mb-6">Perfect for businesses looking for a hassle-free solution. Our pricing includes laundering, drying and replacement of worn items—ideal for hospitality and healthcare settings.</p>
//               <div className="space-y-3">
//                 <div className="grid grid-cols-2 gap-4 pb-3 border-b-2 border-teal-500 font-semibold text-gray-900">
//                   <div>Product</div><div className="text-right">Pricing (exc. GST)</div>
//                 </div>
//                 {pricingRental.map((item, index) => (
//                   <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
//                     <div className="text-sm sm:text-base text-gray-700">{item.product}</div>
//                     <div className="text-sm sm:text-base text-teal-600 font-semibold text-right">{item.price}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Customer-Owned Goods (COG) Services</h3>
//               <p className="text-sm sm:text-base text-gray-600 mb-6">Already have your own linen? No problem. We offer competitive per-kilo or per-piece pricing for cleaning and return of your linen, with options for express turnaround and volume discounts.</p>
//               <div className="bg-teal-50 rounded-xl p-6 sm:p-8">
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Competitive Per-Kilo Pricing</p><p className="text-xs sm:text-sm text-gray-600">Best rates for bulk laundry</p></div></div>
//                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Per-Piece Pricing Available</p><p className="text-xs sm:text-sm text-gray-600">Perfect for specialized items</p></div></div>
//                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Express Turnaround Options</p><p className="text-xs sm:text-sm text-gray-600">When you need it fast</p></div></div>
//                   <div className="flex items-start gap-3"><Check className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 flex-shrink-0 mt-1" /><div><p className="font-semibold text-gray-900 text-sm sm:text-base">Volume Discounts</p><p className="text-xs sm:text-sm text-gray-600">Save more with higher volumes</p></div></div>
//                 </div>
//               </div>
//               <div className="mt-6 text-center">
//                 <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-base sm:text-lg rounded-full" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Request Custom Quote</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">Simple, fast, and convenient</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
//             <div className="text-center px-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><Package className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Schedule Pickup</h3><p className="text-sm sm:text-base text-gray-600">Book online or call us to schedule a convenient pickup time</p></div>
//             <div className="text-center px-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">We Clean</h3><p className="text-sm sm:text-base text-gray-600">Our experts clean your items with care and attention to detail</p></div>
//             <div className="text-center px-4"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"><TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Delivery</h3><p className="text-sm sm:text-base text-gray-600">Fresh, clean items delivered right to your doorstep</p></div>
//           </div>
//         </div>
//       </section>

//       <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What Our Customers Say</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">Join thousands of satisfied customers</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
//             {testimonials.map((testimonial, index) => (
//               <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
//                 <div className="flex mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />))}</div>
//                 <p className="text-sm sm:text-base text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
//                 <div><p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p><p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-5 sm:mb-6">About Infinite Laundry Solutions</h2>
//           <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">Infinite Laundry Solutions is Queensland's premier commercial laundry service provider. With over 10 years of experience, we've been serving businesses across the region with dedication and expertise. Our commitment to quality, convenience, and customer satisfaction sets us apart.</p>
//           <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">We use eco-friendly cleaning products and modern equipment to ensure your items receive the best care possible. Our team of trained professionals treats every item with attention and respect. From small boutique stays to large medical facilities, we provide scalable, stress-free laundry and linen solutions.</p>
//         </div>
//       </section>

//       <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get In Touch</h2>
//             <p className="text-base sm:text-lg md:text-xl text-gray-600">We'd love to hear from you</p>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
//             <div>
//               <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg mb-6 sm:mb-8">
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Contact Information</h3>
//                 <div className="space-y-4 sm:space-y-5">
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
//                     <div><p className="text-xs sm:text-sm text-gray-600">Phone</p><p className="font-semibold text-gray-900 text-sm sm:text-base">1800 LAUNDRY</p></div>
//                   </div>
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
//                     <div><p className="text-xs sm:text-sm text-gray-600">Email</p><p className="font-semibold text-gray-900 text-sm sm:text-base break-all">info@infinitelaundry.com.au</p></div>
//                   </div>
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /></div>
//                     <div><p className="text-xs sm:text-sm text-gray-600">Address</p><p className="font-semibold text-gray-900 text-sm sm:text-base">Serving Queensland</p></div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-teal-500 rounded-2xl p-6 sm:p-7 md:p-8 text-white">
//                 <h3 className="text-xl sm:text-2xl font-bold mb-4">Business Hours</h3>
//                 <div className="space-y-2">
//                   <p className="text-sm sm:text-base"><span className="font-semibold">Monday - Friday:</span> 7:00 AM - 8:00 PM</p>
//                   <p className="text-sm sm:text-base"><span className="font-semibold">Saturday:</span> 8:00 AM - 6:00 PM</p>
//                   <p className="text-sm sm:text-base"><span className="font-semibold">Sunday:</span> 9:00 AM - 5:00 PM</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Send Us a Message</h3>
//               <form onSubmit={handleContactSubmit} className="space-y-4">
//                 <div><Input placeholder="Your Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-name-input" /></div>
//                 <div><Input type="email" placeholder="Your Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-email-input" /></div>
//                 <div><Input placeholder="Your Phone" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} required className="w-full text-sm sm:text-base py-5 sm:py-6" data-testid="contact-phone-input" /></div>
//                 <div><Textarea placeholder="Your Message" rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required className="w-full text-sm sm:text-base" data-testid="contact-message-input" /></div>
//                 <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white py-5 sm:py-6 text-base sm:text-lg" data-testid="contact-submit-btn">Send Message</Button>
//                 {submitStatus === 'success' && (<p className="text-green-600 text-center text-sm sm:text-base">Message sent successfully!</p>)}
//                 {submitStatus === 'error' && (<p className="text-red-600 text-center text-sm sm:text-base">Failed to send message. Please try again.</p>)}
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-gray-900 text-white py-10 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8">
//             <div className="text-center sm:text-left">
//               <img src="https://customer-assets.emergentagent.com/job_washdash-1/artifacts/ed664txa_Screenshot%202025-10-14%20121020.png" alt="Infinite Laundry Solutions Logo" className="h-10 sm:h-12 w-auto mb-4 mx-auto sm:mx-0" />
//               <p className="text-sm sm:text-base text-gray-400">Queensland's trusted laundry service provider</p>
//             </div>
//             <div className="text-center sm:text-left">
//               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Services</h4>
//               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
//                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Commercial Laundry</a></li>
//                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Linen Rental</a></li>
//                 <li><a href="#services" className="hover:text-teal-400 transition-colors">Uniform Cleaning</a></li>
//                 <li><a href="#services" className="hover:text-teal-400 transition-colors">COG Services</a></li>
//               </ul>
//             </div>
//             <div className="text-center sm:text-left">
//               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Company</h4>
//               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
//                 <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
//                 <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
//               </ul>
//             </div>
//             <div className="text-center sm:text-left">
//               <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Connect</h4>
//               <ul className="space-y-2 text-sm sm:text-base text-gray-400">
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Facebook</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Instagram</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Twitter</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">LinkedIn</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400">
//             <p className="text-sm sm:text-base">&copy; 2025 Infinite Laundry Solutions. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default LandingPage;



// import React, { useState } from 'react';
// import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Heart, Hotel, Package, Sparkles, TrendingUp, Menu, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';

// function LandingPage() {
//   const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '', company: '', address: '' });
//   const [submitStatus, setSubmitStatus] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const scrollToSection = (id) => {
//     const el = document.getElementById(id);
//     if(el) {
//       const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
//       window.scrollTo({ top: y, behavior: 'smooth' });
//     }
//   };

//   const handleContactSubmit = () => {
//     setSubmitStatus('success');
//     setContactForm({ name: '', email: '', phone: '', message: '', company: '', address: '' });
//     setTimeout(() => setSubmitStatus(''), 3000);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
//         <div className="max-w-7xl mx-auto px-8">
//           <div className="flex justify-between items-center h-24">
//             <div className="flex items-center gap-4">
//               <img src="/assets/logo.png" alt="Infinite Laundry Solutions" className="h-20" />
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">Infinite</div>
//                 <div className="text-2xl font-bold text-gray-900">Laundry</div>
//                 <div className="text-2xl font-bold text-gray-900">Solutions</div>
//               </div>
//             </div>
//             <div className="hidden lg:flex items-center gap-8">
//               <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-[#00BCD4] cursor-pointer font-medium">Home</a>
//               <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-[#00BCD4] cursor-pointer font-medium">About</a>
//               <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-[#00BCD4] cursor-pointer font-medium">Services</a>
//               <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-[#00BCD4] cursor-pointer font-medium">Industries we Serve</a>
//               <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-[#00BCD4] cursor-pointer font-medium">Our Prices</a>
//               <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-[#00BCD4] cursor-pointer font-medium">Why Us?</a>
//               <a className="text-gray-700 hover:text-[#00BCD4] cursor-pointer font-medium">More</a>
//               <div className="relative">
//                 <div className="w-8 h-8 bg-[#00BCD4] rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer">0</div>
//               </div>
//             </div>
//             <div className="lg:hidden">
//               <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost">
//                 {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <section id="home" className="pt-32 pb-20 px-8 bg-gradient-to-b from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA]">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <div className="inline-flex gap-2 mb-6">
//               <span className="bg-white/80 px-3 py-1 rounded-full text-sm">Professional Laundry Services</span>
//               <span className="bg-white/80 px-3 py-1 rounded-full text-sm">Professional Laundry Services</span>
//               <span className="bg-white/80 px-3 py-1 rounded-full text-sm">Professional Laundry Services</span>
//             </div>
//           </div>
//           <div className="bg-[#B2EBF2]/60 backdrop-blur-sm rounded-3xl p-16 text-center max-w-5xl mx-auto border-2 border-white/50">
//             <h1 className="text-7xl font-black text-gray-900 mb-8 leading-tight">
//               Exceptional<br/>Laundry Care
//             </h1>
//             <p className="text-xl text-gray-800 mb-10 max-w-2xl mx-auto leading-relaxed">
//               Your premium laundry solution for hospitality and healthcare industries.
//             </p>
//             <Button className="bg-[#80DEEA] hover:bg-[#4DD0E1] text-gray-900 px-10 py-7 rounded-full text-lg font-semibold border-2 border-white">
//               Discover More
//             </Button>
//           </div>
//         </div>
//       </section>

//       <section id="about" className="py-20 px-8 bg-[#B2EBF2]">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-16">
//             <div>
//               <h2 className="text-5xl font-black text-gray-900 mb-8">
//                 <span className="border-b-8 border-gray-900 pb-3 inline-block">About ILS</span>
//               </h2>
//               <p className="text-gray-800 text-lg leading-relaxed">
//                 Born from the success of Infinite Asset Solutions, Infinite Laundry Solutions was created to solve a growing need we saw firsthand—dependable, quality-driven laundry services for the hospitality and healthcare sectors. As long-time operators in motel and commercial venue management, we understand what's at stake when it comes to clean, timely linen delivery.
//               </p>
//             </div>
//             <div>
//               <h2 className="text-5xl font-black text-gray-900 mb-8">
//                 <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Mission</span>
//               </h2>
//               <p className="text-gray-800 text-lg leading-relaxed mb-12">
//                 To deliver commercial laundry solutions with precision, reliability, and care—helping our clients focus on what they do best.
//               </p>
//               <h3 className="text-4xl font-black text-gray-900 mb-8">
//                 <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Values</span>
//               </h3>
//               <div className="flex gap-6 justify-start">
//                 <div className="text-center">
//                   <div className="w-20 h-20 flex items-center justify-center mb-3">
//                     <div className="text-6xl">⚙️</div>
//                   </div>
//                   <p className="text-sm font-bold">Quality</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-20 h-20 flex items-center justify-center mb-3">
//                     <div className="text-6xl">🛡️</div>
//                   </div>
//                   <p className="text-sm font-bold">Transparency</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-20 h-20 flex items-center justify-center mb-3">
//                     <div className="text-6xl">⚙️</div>
//                   </div>
//                   <p className="text-sm font-bold">Reliability</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-20 h-20 flex items-center justify-center mb-3">
//                     <div className="text-6xl">💡</div>
//                   </div>
//                   <p className="text-sm font-bold">Innovation</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-20 h-20 flex items-center justify-center mb-3">
//                     <div className="text-6xl">🤝</div>
//                   </div>
//                   <p className="text-sm font-bold">Care</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section id="services" className="py-20 px-8 bg-[#B2EBF2]">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Services</span>
//           </h2>
//           <p className="text-gray-800 text-lg leading-relaxed mb-16 max-w-5xl">
//             Clean linen shouldn't be a luxury—it should be the standard. At Infinite Laundry Solutions, we offer a range of services designed to meet the specific demands of busy venues across Queensland. From small boutique stays to large medical facilities, we provide scalable, stress-free laundry and linen solutions.
//           </p>
//           <div className="grid grid-cols-5 gap-6">
//             <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
//               <div className="text-7xl mb-6">🧺</div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide">COMMERCIAL LAUNDRY SERVICES</h3>
//               <p className="text-xs text-gray-700 leading-relaxed">High-volume, fast-turnaround service for hotels, motels, resorts, and more</p>
//             </div>
//             <div className="bg-gray-600 rounded-2xl p-8 text-center shadow-lg text-white">
//               <div className="text-7xl mb-6">📦</div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide">LINEN HIRE & RENTAL</h3>
//               <p className="text-xs text-gray-200 leading-relaxed">Clean, pressed linen delivered on your schedule</p>
//             </div>
//             <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
//               <div className="text-7xl mb-6">👔</div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide">UNIFORM & APPAREL CLEANING</h3>
//               <p className="text-xs text-gray-700 leading-relaxed">For corporate, industrial, and healthcare staff</p>
//             </div>
//             <div className="bg-gray-600 rounded-2xl p-8 text-center shadow-lg text-white">
//               <div className="text-7xl mb-6">📦</div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide">CUSTOMER-OWNED GOODS (COG)</h3>
//               <p className="text-xs text-gray-200 leading-relaxed">We clean what you own—professionally and precisely</p>
//             </div>
//             <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
//               <div className="text-7xl mb-6">🎪</div>
//               <h3 className="text-sm font-black uppercase mb-4 tracking-wide">SPECIALTY & EVENT LINEN</h3>
//               <p className="text-xs text-gray-700 leading-relaxed">Towels, napkins, tablecloths, bedding and more</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section id="industries" className="py-20 px-8 bg-[#B2EBF2]">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Industries we Serve</span>
//           </h2>
//           <p className="text-gray-800 text-lg leading-relaxed mb-16 max-w-4xl">
//             We understand the unique needs of every industry we serve. Whether you're welcoming guests, caring for patients, or feeding the masses, you need clean, dependable linen—and fast.
//           </p>
//           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mb-16">
//             <div className="bg-gray-200 rounded-2xl p-12 text-center shadow-lg">
//               <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
//                 <div className="text-8xl">🏨</div>
//               </div>
//               <h3 className="text-3xl font-black text-gray-900 mb-4">Hospitality</h3>
//               <p className="text-gray-800 text-lg">Hotels, Motels, Resorts, Short-Term Rentals</p>
//             </div>
//             <div className="bg-gray-200 rounded-2xl p-12 text-center shadow-lg">
//               <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
//                 <div className="text-8xl">🏥</div>
//               </div>
//               <h3 className="text-3xl font-black text-gray-900 mb-4">Healthcare</h3>
//               <p className="text-gray-800 text-lg">Clinics, Medical Centres, Aged Care Homes</p>
//             </div>
//           </div>
//           <div className="bg-gray-200 rounded-2xl p-10 text-center max-w-3xl mx-auto shadow-lg">
//             <p className="text-gray-900 font-black text-xl mb-3">Don't see your industry?</p>
//             <p className="text-gray-800 text-lg mb-6">Let's chat – we tailor our services to you.</p>
//             <Button className="bg-[#80DEEA] hover:bg-[#4DD0E1] text-gray-900 px-8 py-4 rounded-lg font-bold text-lg">
//               Contact Us
//             </Button>
//           </div>
//         </div>
//       </section>

//       <section id="prices" className="py-20 px-8 bg-[#B2EBF2]">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Prices</span>
//           </h2>
//           <p className="text-gray-800 text-lg leading-relaxed mb-16 max-w-5xl">
//             At Infinite Laundry Solutions, we believe in transparent, tailored pricing that suits the unique needs of your business. Whether you're renting fresh, high-quality linen or entrusting us with your own inventory, our pricing structure is designed to offer flexibility and value.
//           </p>
//           <div className="grid md:grid-cols-2 gap-12">
//             <div className="bg-white rounded-2xl p-10 shadow-lg">
//               <div className="flex items-center gap-6 mb-8">
//                 <div className="text-7xl">🧺</div>
//                 <h3 className="text-2xl font-black text-gray-900 uppercase">LINEN RENTAL SERVICES</h3>
//               </div>
//               <p className="text-gray-700 text-base mb-8 leading-relaxed">
//                 Perfect for businesses looking for a hassle-free solution. Our pricing includes laundering, drying and replacement of worn items—ideal for hospitality and healthcare settings that require consistent quality and supply.
//               </p>
//               <div className="space-y-1">
//                 <div className="grid grid-cols-2 gap-4 pb-3 border-b-4 border-gray-900 font-black text-sm">
//                   <div>Product</div>
//                   <div className="text-right">Pricing (exc. GST)</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">King Sheets</div>
//                   <div className="text-right font-bold italic">from $2.25</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">Queen Sheets</div>
//                   <div className="text-right font-bold italic">from $2.05</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">Single Sheets</div>
//                   <div className="text-right font-bold italic">from $1.95</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">Bath Towels</div>
//                   <div className="text-right font-bold italic">from $1.50</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">Tea Towels</div>
//                   <div className="text-right font-bold italic">from $1.10</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">Pillowcases</div>
//                   <div className="text-right font-bold italic">from $1.05</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">Bath Mats</div>
//                   <div className="text-right font-bold italic">from $0.90</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">Hand Towels</div>
//                   <div className="text-right font-bold italic">from $0.80</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300">
//                   <div className="text-gray-700">Face Washers</div>
//                   <div className="text-right font-bold italic">from $0.75</div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl p-10 shadow-lg">
//               <div className="flex items-center gap-6 mb-8">
//                 <div className="text-7xl">💼</div>
//                 <h3 className="text-2xl font-black text-gray-900 uppercase">CUSTOMER-OWNED GOODS (COG) SERVICES</h3>
//               </div>
//               <p className="text-gray-700 text-base mb-10 leading-relaxed">
//                 Already have your own linen? No problem. We offer competitive per-kilo or per-piece pricing for cleaning and return of your linen, with options for express turnaround and volume discounts.
//               </p>
//               <div className="space-y-5 mb-10">
//                 <div className="flex items-start gap-4">
//                   <Check className="w-6 h-6 text-[#00BCD4] flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-black text-gray-900">Competitive Per-Kilo Pricing</p>
//                     <p className="text-sm text-gray-600">Best rates for bulk laundry</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <Check className="w-6 h-6 text-[#00BCD4] flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-black text-gray-900">Per-Piece Pricing Available</p>
//                     <p className="text-sm text-gray-600">Perfect for specialized items</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <Check className="w-6 h-6 text-[#00BCD4] flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-black text-gray-900">Express Turnaround Options</p>
//                     <p className="text-sm text-gray-600">When you need it fast</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <Check className="w-6 h-6 text-[#00BCD4] flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-black text-gray-900">Volume Discounts</p>
//                     <p className="text-sm text-gray-600">Save more with higher volumes</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-200 rounded-xl p-8 text-center">
//                 <p className="text-gray-900 font-black text-lg mb-5">For a custom quote based on your needs, please click here. We tailor to your needs!!</p>
//                 <Button className="bg-[#80DEEA] hover:bg-[#4DD0E1] text-gray-900 px-8 py-4 rounded-lg font-bold text-lg">
//                   Contact Us
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section id="why" className="py-20 px-8 bg-[#B2EBF2]">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-5xl font-black text-gray-900 mb-16">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Why ILS?</span>
//           </h2>
//           <div className="grid md:grid-cols-2 gap-12 mb-16">
//             <div>
//               <p className="text-gray-800 text-lg leading-relaxed">
//                 We've built Infinite Laundry Solutions on a foundation of industry knowledge, operational excellence, and next-generation technology. With premium Electrolux machines and sustainable practices at our core, we deliver more than clean linen—we deliver peace of mind.
//               </p>
//             </div>
//             <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
//               <img src="https://images.unsplash.com/photo-1627564359646-5972788cec65?w=800" alt="Stacked towels" className="w-full h-80 object-cover" />
//             </div>
//           </div>
//           <div className="space-y-8">
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex justify-between items-start gap-8">
//                 <h3 className="text-2xl font-black text-gray-900 flex-1">Electrolux Machinery</h3>
//                 <p className="text-gray-800 text-lg flex-1 text-right">Our state-of-the-art European machines provide best-in-class performance with exceptional water and energy efficiency.</p>
//               </div>
//             </div>
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex justify-between items-start gap-8">
//                 <h3 className="text-2xl font-black text-gray-900 flex-1">Experience-Driven</h3>
//                 <p className="text-gray-800 text-lg flex-1 text-right">We know the industry inside-out because we're part of it.</p>
//               </div>
//             </div>
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex justify-between items-start gap-8">
//                 <h3 className="text-2xl font-black text-gray-900 flex-1">Flexible Service Models</h3>
//                 <p className="text-gray-800 text-lg flex-1 text-right">Linen hire or COG, on-demand or scheduled – we work your way.</p>
//               </div>
//             </div>
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex justify-between items-start gap-8">
//                 <h3 className="text-2xl font-black text-gray-900 flex-1">Trial & Sample Pickups Available</h3>
//                 <p className="text-gray-800 text-lg flex-1 text-right">Try us before you commit.</p>
//               </div>
//             </div>
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex justify-between items-start gap-8">
//                 <h3 className="text-2xl font-black text-gray-900 flex-1">Sustainability-Focused</h3>
//                 <p className="text-gray-800 text-lg flex-1 text-right">Our machines and processes are designed to reduce consumption and environmental impact.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-20 px-8 bg-[#B2EBF2]">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-5xl font-black text-gray-900 mb-16">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Service Areas</span>
//           </h2>
//           <p className="text-gray-800 text-lg leading-relaxed mb-12 max-w-4xl">
//             We're proud to support businesses across Queensland with reliable, efficient linen and laundry services. From bustling city hotels to coastal clinics, our reach is growing fast.
//           </p>
//           <div className="grid md:grid-cols-2 gap-12 mb-12">
//             <div>
//               <h3 className="text-3xl font-black text-gray-900 mb-6">Currently Serving-</h3>
//               <p className="text-xl font-bold text-gray-900">Brisbane | Gold Coast | Sunshine Coast & Surrounding Suburbs</p>
//             </div>
//             <div>
//               <h3 className="text-3xl font-black text-gray-900 mb-6">Expanding Soon to-</h3>
//               <p className="text-xl font-bold text-gray-900">Sydney | Newcastle | Hunter Region</p>
//             </div>
//           </div>
//           <p className="text-gray-800 text-lg mb-8">
//             Explore the map below to see if we service your area—or click the button for clean linen!!
//           </p>
//           <div className="bg-white rounded-2xl p-4 h-96 flex items-center justify-center mb-10 shadow-lg">
//             <p className="text-gray-400 text-2xl">[Map Placeholder - Google Maps Integration]</p>
//           </div>
//           <div className="text-center">
//             <Button className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-5 rounded-lg font-black text-xl border-4 border-gray-900">
//               Clean Linen!!
//             </Button>
//           </div>
//         </div>
//       </section>

//       <section id="quote" className="py-20 px-8 bg-[#B2EBF2]">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-5xl font-black text-gray-900 mb-12">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">GET A QUOTE</span>
//           </h2>
//           <p className="text-gray-800 text-lg leading-relaxed mb-12">
//             Try Us Today. We offer trial services and sample pickups for eligible businesses. Let's show you what premium laundry service feels like. Whether you're a hotelier seeking consistent quality, a clinic in need of hygienic linen turnover, or a venue requiring last-minute support, we're ready to step in. With Infinite Laundry Solutions, you're not just choosing a provider—you're choosing a partner in cleanliness, care, and operational excellence.
//           </p>
//           <div className="bg-gray-200 rounded-2xl p-12 shadow-lg">
//             <div className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-bold mb-3">Full Name *</label>
//                   <Input value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="bg-[#B2EBF2] border-none h-12" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-3">Phone *</label>
//                   <Input value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} className="bg-[#B2EBF2] border-none h-12" />
//                 </div>
//               </div>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-bold mb-3">Company name</label>
//                   <Input value={contactForm.company} onChange={(e) => setContactForm({...contactForm, company: e.target.value})} className="bg-[#B2EBF2] border-none h-12" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-3">Property Address</label>
//                   <Input value={contactForm.address} onChange={(e) => setContactForm({...contactForm, address: e.target.value})} className="bg-[#B2EBF2] border-none h-12" />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-bold mb-3">Email *</label>
//                 <Input type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="bg-[#B2EBF2] border-none h-12" />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold mb-3">Services Required</label>
//                 <Textarea rows={5} value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="bg-[#B2EBF2] border-none" />
//               </div>
//               <Button onClick={handleContactSubmit} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-5 rounded-lg font-bold text-lg">
//                 Submit
//               </Button>
//               {submitStatus === 'success' && <p className="text-green-600 text-center font-bold text-lg">Message sent successfully!</p>}
//             </div>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-[#B2EBF2] py-16 px-8 border-t-8 border-[#80DEEA]">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-16">
//             <div className="flex items-start gap-8">
//               <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg p-6">
//                 <img src="/assets/logo.png" alt="ILS Logo" className="w-full h-full object-contain" />
//               </div>
//               <div>
//                 <h3 className="text-3xl font-black text-gray-900 mb-8">
//                   Infinite<br/>Laundry<br/>Solutions
//                 </h3>
//                 <div className="space-y-3">
//                   <a onClick={() => scrollToSection('home')} className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">Home</a>
//                   <a onClick={() => scrollToSection('about')} className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">About</a>
//                   <a onClick={() => scrollToSection('services')} className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">Services</a>
//                   <a onClick={() => scrollToSection('industries')} className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">Industries we Serve</a>
//                   <a onClick={() => scrollToSection('prices')} className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">Our Prices</a>
//                   <a onClick={() => scrollToSection('why')} className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">Why Us?</a>
//                   <a className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">Contact Us</a>
//                   <a className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">Book Online</a>
//                   <a className="block text-gray-800 hover:text-[#00BCD4] cursor-pointer font-medium text-lg">Blog</a>
//                 </div>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="space-y-4 mb-8">
//                 <p className="text-2xl font-black text-gray-900">+61426159286</p>
//                 <p className="text-lg text-gray-800 font-medium">info@infinitelaundrysolutions.com.au</p>
//                 <p className="text-lg text-gray-800 font-medium">3/76 Mica Street, Carole Park, QLD, 4300</p>
//               </div>
//               <Button className="bg-[#B2EBF2] hover:bg-[#80DEEA] text-gray-900 px-10 py-5 rounded-lg font-black text-xl border-4 border-gray-900">
//                 LETS CHAT!!
//               </Button>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default LandingPage;

















// import React, { useState } from 'react'; // <-- FIXED: useState is now imported
// import { useNavigate } from 'react-router-dom'; 
// import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Heart, Hotel, Package, Sparkles, TrendingUp, Menu, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';

// // Using standard Tailwind classes (cyan-100, cyan-500) for color safety.

// function LandingPage() {
//   const navigate = useNavigate();

//   const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '', company: '', address: '' });
//   const [submitStatus, setSubmitStatus] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const scrollToSection = (id) => {
//     const el = document.getElementById(id);
//     if(el) {
//       setMobileMenuOpen(false); 
//       const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
//       window.scrollTo({ top: y, behavior: 'smooth' });
//     }
//   };

//   const handleContactSubmit = (e) => {
//     e.preventDefault();
//     // Placeholder for API call
//     console.log('Contact form submitted:', contactForm);
//     setSubmitStatus('success');
//     setContactForm({ name: '', email: '', phone: '', message: '', company: '', address: '' });
//     setTimeout(() => setSubmitStatus(''), 3000);
//   };
  
//   const pricingRental = [
//     { product: 'King Sheets', price: 'from $2.25' }, { product: 'Queen Sheets', price: 'from $2.05' },
//     { product: 'Single Sheets', price: 'from $1.95' }, { product: 'Bath Towels', price: 'from $1.50' },
//     { product: 'Tea Towels', price: 'from $1.10' }, { product: 'Pillowcases', price: 'from $1.05' },
//     { product: 'Bath Mats', price: 'from $0.90' }, { product: 'Hand Towels', price: 'from $0.80' },
//     { product: 'Face Washers', price: 'from $0.75' }
//   ];

//   // Function to handle login navigation
//   const handleLoginClick = () => {
//     navigate('/login');
//     setMobileMenuOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation Bar (Header) */}
//       <nav className="fixed top-0 w-full bg-white shadow-md z-50">
//         <div className="max-w-7xl mx-auto px-8">
//           <div className="flex justify-between items-center h-24">
//             {/* Logo Section */}
//             <div className="flex items-center gap-4">
//               <img src="/assets/logo.png" alt="Infinite Laundry Solutions" className="h-20" />
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">Infinite</div>
//                 <div className="text-2xl font-bold text-gray-900">Laundry</div>
//                 <div className="text-2xl font-bold text-gray-900">Solutions</div>
//               </div>
//             </div>
            
//             {/* Desktop Navigation Links and Login Button */}
//             <div className="hidden lg:flex items-center gap-8">
//               <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Home</a>
//               <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">About</a>
//               <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Services</a>
//               <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Industries we Serve</a>
//               <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Our Prices</a>
//               <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Why Us?</a>
//               <a onClick={() => scrollToSection('quote')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">More</a>
              
//               {/* Login Button */}
//               <Button 
//                 onClick={handleLoginClick} 
//                 className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-full px-6 text-base font-medium shadow-md transition-colors"
//                 data-testid="nav-login-btn"
//               >
//                 Login
//               </Button>
//             </div>
            
//             {/* Mobile Menu Button */}
//             <div className="lg:hidden flex items-center gap-2">
//               <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost">
//                 {mobileMenuOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
//               </Button>
//             </div>
//           </div>
          
//           {/* Mobile Menu Dropdown */}
//           {mobileMenuOpen && (
//             <div className="lg:hidden absolute top-24 left-0 w-full bg-white shadow-lg py-4 border-t border-gray-200" data-testid="mobile-menu">
//               <div className="flex flex-col space-y-3 px-8">
//                 <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Home</a>
//                 <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">About</a>
//                 <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Services</a>
//                 <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Industries we Serve</a>
//                 <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Our Prices</a>
//                 <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Why Us?</a>
//                 <a onClick={() => scrollToSection('quote')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">More</a>
//                 <Button onClick={handleLoginClick} className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full w-full mt-4">Login</Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* --- */}

//       {/* Hero Section - Light Tint Background */}
//       <section id="home" className="pt-32 pb-20 px-8 bg-gradient-to-b from-cyan-50/70 via-cyan-100 to-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8">
//             <div className="inline-flex flex-wrap gap-2 justify-center mb-6">
//               <span className="bg-white/80 px-3 py-1 rounded-full text-sm border border-gray-300">Professional Laundry Services</span>
//               <span className="bg-white/80 px-3 py-1 rounded-full text-sm border border-gray-300">Hospitality & Healthcare</span>
//             </div>
//           </div>
//           <div className="bg-cyan-100/70 backdrop-blur-sm rounded-3xl p-10 sm:p-16 text-center max-w-5xl mx-auto border-2 border-white/50 shadow-xl">
//             <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
//               Exceptional<br/>Laundry Care
//             </h1>
//             <p className="text-lg sm:text-xl text-gray-800 mb-10 max-w-2xl mx-auto leading-relaxed">
//               Your premium laundry solution for hospitality and healthcare industries across Queensland.
//             </p>
//             <Button 
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-7 rounded-full text-lg font-semibold border-2 border-white shadow-lg transition-colors"
//               onClick={() => scrollToSection('services')}
//             >
//               Discover Our Services
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* --- */}

//       {/* About Section - Mid Tint Background */}
//       <section id="about" className="py-20 px-8 bg-cyan-100">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-16">
//             <div>
//               <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//                 <span className="border-b-8 border-gray-900 pb-3 inline-block">About ILS</span>
//               </h2>
//               <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
//                 Born from the success of Infinite Asset Solutions, Infinite Laundry Solutions was created to solve a growing need we saw firsthand—dependable, quality-driven laundry services for the hospitality and healthcare sectors. As long-time operators in motel and commercial venue management, we understand what's at stake when it comes to clean, timely linen delivery.
//               </p>
//             </div>
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
//               <div className="flex flex-wrap justify-start gap-6">
//                 <div className="text-center">
//                   <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
//                     <div className="text-4xl sm:text-6xl">⚙️</div>
//                   </div>
//                   <p className="text-sm font-bold">Quality</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
//                     <div className="text-4xl sm:text-6xl">🛡️</div>
//                   </div>
//                   <p className="text-sm font-bold">Transparency</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
//                     <div className="text-4xl sm:text-6xl">⏱️</div>
//                   </div>
//                   <p className="text-sm font-bold">Reliability</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
//                     <div className="text-4xl sm:text-6xl">💡</div>
//                   </div>
//                   <p className="text-sm font-bold">Innovation</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
//                     <div className="text-4xl sm:text-6xl">🤝</div>
//                   </div>
//                   <p className="text-sm font-bold">Care</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- */}

//       {/* Services Section - Mid Tint Background */}
//       <section id="services" className="py-20 px-8 bg-cyan-100">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Services</span>
//           </h2>
//           <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-5xl">
//             Clean linen shouldn't be a luxury—it should be the standard. At Infinite Laundry Solutions, we offer a range of services designed to meet the specific demands of busy venues across Queensland.
//           </p>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
//             <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
//               <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🧺</div>
//               <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide text-gray-900">Commercial Laundry Services</h3>
//               <p className="text-xs text-gray-700 leading-snug">High-volume, fast-turnaround service for hotels, motels, resorts, and more.</p>
//             </div>
//             <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow text-white border-t-4 border-white/0 hover:border-cyan-500">
//               <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🛏️</div>
//               <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide">Linen Hire & Rental</h3>
//               <p className="text-xs text-gray-200 leading-snug">Clean, pressed linen delivered on your schedule.</p>
//             </div>
//             <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
//               <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">👔</div>
//               <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide text-gray-900">Uniform & Apparel Cleaning</h3>
//               <p className="text-xs text-gray-700 leading-snug">For corporate, industrial, and healthcare staff.</p>
//             </div>
//             <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow text-white border-t-4 border-white/0 hover:border-cyan-500">
//               <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">📦</div>
//               <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide">Customer-Owned Goods (COG)</h3>
//               <p className="text-xs text-gray-200 leading-snug">We clean what you own—professionally and precisely.</p>
//             </div>
//             <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
//               <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🎪</div>
//               <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide text-gray-900">Specialty & Event Linen</h3>
//               <p className="text-xs text-gray-700 leading-snug">Towels, napkins, tablecloths, bedding and more.</p>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* --- */}

//       {/* Industries Section - Mid Tint Background */}
//       <section id="industries" className="py-20 px-8 bg-cyan-100">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Industries We Serve</span>
//           </h2>
//           <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-4xl">
//             We understand the unique needs of every industry we serve. You need clean, dependable linen—and fast.
//           </p>
//           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
//             <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
//               <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 flex items-center justify-center">
//                 <div className="text-6xl sm:text-8xl">🏨</div>
//               </div>
//               <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Hospitality</h3>
//               <p className="text-base sm:text-lg text-gray-800">Hotels, Motels, Resorts, Short-Term Rentals</p>
//             </div>
//             <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
//               <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 flex items-center justify-center">
//                 <div className="text-6xl sm:text-8xl">🏥</div>
//               </div>
//               <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Healthcare</h3>
//               <p className="text-base sm:text-lg text-gray-800">Clinics, Medical Centres, Aged Care Homes</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-lg border-2 border-cyan-500">
//             <p className="text-gray-900 font-black text-xl mb-3">Don't see your industry?</p>
//             <p className="text-gray-800 text-lg mb-6">Let's chat – we tailor our services to you.</p>
//             <Button 
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-md transition-colors"
//               onClick={() => scrollToSection('quote')}
//             >
//               Contact Us
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* --- */}

//       {/* Prices Section - Mid Tint Background */}
//       <section id="prices" className="py-20 px-8 bg-cyan-100">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Prices</span>
//           </h2>
//           <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-5xl">
//             At Infinite Laundry Solutions, we believe in transparent, tailored pricing that suits the unique needs of your business.
//           </p>
//           <div className="grid md:grid-cols-2 gap-12">
//             <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border-t-8 border-cyan-500">
//               <div className="flex items-center gap-6 mb-8">
//                 <div className="text-5xl sm:text-7xl">🧺</div>
//                 <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase">Linen Rental Services</h3>
//               </div>
//               <p className="text-gray-700 text-sm sm:text-base mb-8 leading-relaxed">
//                 Perfect for businesses looking for a hassle-free solution. Our pricing includes laundering, drying and replacement of worn items.
//               </p>
//               <div className="space-y-1">
//                 <div className="grid grid-cols-2 gap-4 pb-3 border-b-4 border-gray-900 font-black text-sm">
//                   <div>Product</div>
//                   <div className="text-right">Pricing (exc. GST)</div>
//                 </div>
//                 {pricingRental.map((item, index) => (
//                   <div key={index} className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300 last:border-b-0">
//                     <div className="text-gray-700 text-sm">{item.product}</div>
//                     <div className="text-right font-bold italic text-cyan-600 text-sm">{item.price}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border-t-8 border-cyan-500">
//               <div className="flex items-center gap-6 mb-8">
//                 <div className="text-5xl sm:text-7xl">💼</div>
//                 <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase">Customer-Owned Goods (COG) Services</h3>
//               </div>
//               <p className="text-gray-700 text-sm sm:text-base mb-10 leading-relaxed">
//                 Already have your own linen? No problem. We offer competitive per-kilo or per-piece pricing for cleaning and return of your linen, with options for express turnaround and volume discounts.
//               </p>
//               <div className="space-y-5 mb-10">
//                 <div className="flex items-start gap-4">
//                   <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-black text-gray-900 text-base">Competitive Per-Kilo Pricing</p>
//                     <p className="text-sm text-gray-600">Best rates for bulk laundry</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-black text-gray-900 text-base">Per-Piece Pricing Available</p>
//                     <p className="text-sm text-gray-600">Perfect for specialized items</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-black text-gray-900 text-base">Express Turnaround Options</p>
//                     <p className="text-sm text-gray-600">When you need it fast</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-black text-gray-900 text-base">Volume Discounts</p>
//                     <p className="text-sm text-gray-600">Save more with higher volumes</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-cyan-50/70 rounded-xl p-6 sm:p-8 text-center border border-cyan-500">
//                 <p className="text-gray-900 font-black text-lg mb-5">For a custom quote based on your needs, please click here. We tailor to your needs!!</p>
//                 <Button 
//                   className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-md transition-colors"
//                   onClick={() => scrollToSection('quote')}
//                 >
//                   Request Custom Quote
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- */}

//       {/* Why Us Section - Mid Tint Background */}
//       <section id="why" className="py-20 px-8 bg-cyan-100">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-16">
//             <span className="border-b-8 border-gray-900 pb-3 inline-block">Why ILS?</span>
//           </h2>
//           <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
//             <div>
//               <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
//                 We've built Infinite Laundry Solutions on a foundation of industry knowledge, operational excellence, and next-generation technology. With premium **Electrolux machines** and sustainable practices at our core, we deliver more than clean linen—we deliver **peace of mind**.
//               </p>
//             </div>
//             <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-cyan-500">
//               <img src="https://images.unsplash.com/photo-1627564359646-5972788cec65?w=800" alt="Stacked towels" className="w-full h-64 sm:h-80 object-cover" />
//             </div>
//           </div>
//           <div className="space-y-8">
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
//                 <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Electrolux Machinery</h3>
//                 <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">Our state-of-the-art European machines provide best-in-class performance with exceptional water and energy efficiency.</p>
//               </div>
//             </div>
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
//                 <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Experience-Driven</h3>
//                 <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">We know the industry inside-out because we're part of it.</p>
//               </div>
//             </div>
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
//                 <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Flexible Service Models</h3>
//                 <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">Linen hire or COG, on-demand or scheduled – we work your way.</p>
//               </div>
//             </div>
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
//                 <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Trial & Sample Pickups Available</h3>
//                 <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">Try us before you commit.</p>
//               </div>
//             </div>
//             <div className="border-b-2 border-gray-400 pb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
//                 <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Sustainability-Focused</h3>
//                 <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">Our machines and processes are designed to reduce consumption and environmental impact.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- */}

//       {/* Service Areas Section - Mid Tint Background */}
//       <section className="py-20 px-8 bg-cyan-100">
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
//           <div className="bg-white rounded-2xl p-4 h-64 sm:h-96 flex items-center justify-center mb-10 shadow-lg border-2 border-cyan-500">
//             <p className="text-gray-400 text-xl sm:text-2xl">[Map Placeholder - Google Maps Integration]</p>
//           </div>
//           <div className="text-center">
//             <Button 
//               className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-5 rounded-lg font-black text-lg sm:text-xl border-4 border-gray-900 shadow-md transition-colors"
//               onClick={() => scrollToSection('quote')}
//             >
//               Get Clean Linen Now!
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* --- */}

//       {/* Get a Quote / Contact Form Section - Mid Tint Background */}
//       <section id="quote" className="py-20 px-8 bg-cyan-100">
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
//                   <label className="block text-sm font-bold mb-2">Full Name <span className="text-red-500">*</span></label>
//                   <Input 
//                     value={contactForm.name} 
//                     onChange={(e) => setContactForm({...contactForm, name: e.target.value})} 
//                     required 
//                     className="bg-cyan-50/70 border-none h-12" 
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">Phone <span className="text-red-500">*</span></label>
//                   <Input 
//                     value={contactForm.phone} 
//                     onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} 
//                     required 
//                     className="bg-cyan-50/70 border-none h-12" 
//                   />
//                 </div>
//               </div>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">Company name</label>
//                   <Input 
//                     value={contactForm.company} 
//                     onChange={(e) => setContactForm({...contactForm, company: e.target.value})} 
//                     className="bg-cyan-50/70 border-none h-12" 
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">Property Address</label>
//                   <Input 
//                     value={contactForm.address} 
//                     onChange={(e) => setContactForm({...contactForm, address: e.target.value})} 
//                     className="bg-cyan-50/70 border-none h-12" 
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-bold mb-2">Email <span className="text-red-500">*</span></label>
//                 <Input 
//                   type="email" 
//                   value={contactForm.email} 
//                   onChange={(e) => setContactForm({...contactForm, email: e.target.value})} 
//                   required 
//                   className="bg-cyan-50/70 border-none h-12" 
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold mb-2">Services Required / Message</label>
//                 <Textarea 
//                   rows={5} 
//                   value={contactForm.message} 
//                   onChange={(e) => setContactForm({...contactForm, message: e.target.value})} 
//                   className="bg-cyan-50/70 border-none" 
//                 />
//               </div>
//               <Button type="submit" className="w-full bg-gray-600 hover:bg-gray-700 text-white py-5 rounded-lg font-bold text-lg shadow-md transition-colors">
//                 Submit Quote Request
//               </Button>
//               {submitStatus === 'success' && <p className="text-green-600 text-center font-bold text-lg">Message sent successfully! We'll be in touch soon.</p>}
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* --- */}

//       {/* Footer - Mid Tint Background with Teal Border */}
//       <footer className="bg-cyan-100 py-16 px-8 border-t-8 border-cyan-500">
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
//                   <a onClick={() => scrollToSection('home')} className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">Home</a>
//                   <a onClick={() => scrollToSection('services')} className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">Services</a>
//                   <a onClick={() => scrollToSection('about')} className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">About Us</a>
//                   <a onClick={handleLoginClick} className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">Book Online / Login</a>
//                   <a href="#" className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">Blog</a>
//                 </div>
//               </div>
//             </div>
            
//             {/* Contact Info */}
//             <div className="text-left md:text-center lg:text-left">
//               <h3 className="text-2xl font-black text-gray-900 mb-6">Contact Us</h3>
//               <div className="space-y-3">
//                 <p className="text-lg font-black text-gray-900 flex items-center gap-3"><Phone className="w-5 h-5 text-cyan-500"/> +61426159286</p>
//                 <p className="text-base text-gray-800 font-medium flex items-center gap-3"><Mail className="w-5 h-5 text-cyan-500"/> info@infinitelaundrysolutions.com.au</p>
//                 <p className="text-base text-gray-800 font-medium flex items-start gap-3"><MapPin className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1"/> 3/76 Mica Street, Carole Park, QLD, 4300</p>
//               </div>
//               <Button 
//                 className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-black text-lg mt-8 border-4 border-gray-900 shadow-md transition-colors"
//                 onClick={() => scrollToSection('quote')}
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
          
//           {/* <div className="border-t border-gray-400 mt-12 pt-8 text-center text-gray-700">
//             <p className="text-sm sm:text-base">&copy; 2025 Infinite Laundry Solutions. All rights reserved.</p>
//           </div> */}
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default LandingPage;





















import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Heart, Hotel, Package, Sparkles, TrendingUp, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function LandingPage() {
  // Assuming this component is wrapped in a <BrowserRouter> in your App.js
  const navigate = useNavigate();

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '', company: '', address: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if(el) {
      setMobileMenuOpen(false); 
      // Offset for fixed header
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Placeholder for API call
    console.log('Contact form submitted:', contactForm);
    setSubmitStatus('success');
    setContactForm({ name: '', email: '', phone: '', message: '', company: '', address: '' });
    setTimeout(() => setSubmitStatus(''), 3000);
  };
  
  const pricingRental = [
    { product: 'King Sheets', price: 'from $2.25' }, { product: 'Queen Sheets', price: 'from $2.05' },
    { product: 'Single Sheets', price: 'from $1.95' }, { product: 'Bath Towels', price: 'from $1.50' },
    { product: 'Tea Towels', price: 'from $1.10' }, { product: 'Pillowcases', price: 'from $1.05' },
    { product: 'Bath Mats', price: 'from $0.90' }, { product: 'Hand Towels', price: 'from $0.80' },
    { product: 'Face Washers', price: 'from $0.75' }
  ];

  // Function to handle login navigation
  const handleLoginClick = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar (Header) */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <img src="/assets/logo.png" alt="Infinite Laundry Solutions" className="h-20" />
              <div>
                <div className="text-2xl font-bold text-gray-900">Infinite</div>
                <div className="text-2xl font-bold text-gray-900">Laundry</div>
                <div className="text-2xl font-bold text-gray-900">Solutions</div>
              </div>
            </div>
            
            {/* Desktop Navigation Links and Login Button */}
            <div className="hidden lg:flex items-center gap-8">
              <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Home</a>
              <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">About</a>
              <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Services</a>
              <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Industries we Serve</a>
              <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Our Prices</a>
              <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">Why Us?</a>
              <a onClick={() => scrollToSection('quote')} className="text-gray-700 hover:text-cyan-600 cursor-pointer font-medium">More</a>
              
              {/* Login Button */}
              <Button 
                onClick={handleLoginClick} 
                className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-full px-6 text-base font-medium shadow-md transition-colors"
                data-testid="nav-login-btn"
              >
                Login
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} variant="ghost">
                {mobileMenuOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-24 left-0 w-full bg-white shadow-lg py-4 border-t border-gray-200" data-testid="mobile-menu">
              <div className="flex flex-col space-y-3 px-8">
                <a onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Home</a>
                <a onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">About</a>
                <a onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Services</a>
                <a onClick={() => scrollToSection('industries')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Industries we Serve</a>
                <a onClick={() => scrollToSection('prices')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Our Prices</a>
                <a onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">Why Us?</a>
                <a onClick={() => scrollToSection('quote')} className="text-gray-700 hover:text-cyan-600 font-medium py-2">More</a>
                <Button onClick={handleLoginClick} className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full w-full mt-4">Login</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* --- */}

      {/* Hero Section - Light Tint Background */}
      <section id="home" className="pt-32 pb-20 px-8 bg-gradient-to-b from-cyan-50/70 via-cyan-100 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex flex-wrap gap-2 justify-center mb-6">
              <span className="bg-white/80 px-3 py-1 rounded-full text-sm border border-gray-300">Professional Laundry Services</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-sm border border-gray-300">Hospitality & Healthcare</span>
            </div>
          </div>
          <div className="bg-cyan-100/70 backdrop-blur-sm rounded-3xl p-10 sm:p-16 text-center max-w-5xl mx-auto border-2 border-white/50 shadow-xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
              Exceptional<br/>Laundry Care
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your premium laundry solution for hospitality and healthcare industries across Queensland.
            </p>
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-7 rounded-full text-lg font-semibold border-2 border-white shadow-lg transition-colors"
              onClick={() => scrollToSection('services')}
            >
              Discover Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* About Section - Mid Tint Background */}
      <section id="about" className="py-20 px-8 bg-cyan-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
                <span className="border-b-8 border-gray-900 pb-3 inline-block">About ILS</span>
              </h2>
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                Born from the success of Infinite Asset Solutions, **Infinite Laundry Solutions** was created to solve a growing need we saw firsthand—dependable, quality-driven laundry services for the **hospitality and healthcare** sectors. As long-time operators in motel and commercial venue management, we understand what's at stake when it comes to clean, timely linen delivery.
              </p>
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
                <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Mission</span>
              </h2>
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-12">
                To deliver commercial laundry solutions with **precision, reliability, and care**—helping our clients focus on what they do best.
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
                <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Values</span>
              </h3>
              <div className="flex flex-wrap justify-start gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
                    <div className="text-4xl sm:text-6xl">⚙️</div>
                  </div>
                  <p className="text-sm font-bold">Quality</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
                    <div className="text-4xl sm:text-6xl">🛡️</div>
                  </div>
                  <p className="text-sm font-bold">Transparency</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
                    <div className="text-4xl sm:text-6xl">⏱️</div>
                  </div>
                  <p className="text-sm font-bold">Reliability</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
                    <div className="text-4xl sm:text-6xl">💡</div>
                  </div>
                  <p className="text-sm font-bold">Innovation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3">
                    <div className="text-4xl sm:text-6xl">🤝</div>
                  </div>
                  <p className="text-sm font-bold">Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Services Section - Mid Tint Background */}
      <section id="services" className="py-20 px-8 bg-cyan-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
            <span className="border-b-8 border-gray-900 pb-3 inline-block">Services</span>
          </h2>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-5xl">
            Clean linen shouldn't be a luxury—it should be the standard. At Infinite Laundry Solutions, we offer a range of services designed to meet the specific demands of busy venues across Queensland.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🧺</div>
              <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide text-gray-900">Commercial Laundry Services</h3>
              <p className="text-xs text-gray-700 leading-snug">High-volume, fast-turnaround service for hotels, motels, resorts, and more.</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow text-white border-t-4 border-white/0 hover:border-cyan-500">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🛏️</div>
              <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide">Linen Hire & Rental</h3>
              <p className="text-xs text-gray-200 leading-snug">Clean, pressed linen delivered on your schedule.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">👔</div>
              <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide text-gray-900">Uniform & Apparel Cleaning</h3>
              <p className="text-xs text-gray-700 leading-snug">For corporate, industrial, and healthcare staff.</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow text-white border-t-4 border-white/0 hover:border-cyan-500">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">📦</div>
              <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide">Customer-Owned Goods (COG)</h3>
              <p className="text-xs text-gray-200 leading-snug">We clean what you own—professionally and precisely.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🎪</div>
              <h3 className="text-xs sm:text-sm font-black uppercase mb-3 tracking-wide text-gray-900">Specialty & Event Linen</h3>
              <p className="text-xs text-gray-700 leading-snug">Towels, napkins, tablecloths, bedding and more.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- */}

      {/* Industries Section - Mid Tint Background */}
      <section id="industries" className="py-20 px-8 bg-cyan-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
            <span className="border-b-8 border-gray-900 pb-3 inline-block">Industries We Serve</span>
          </h2>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-4xl">
            We understand the unique needs of every industry we serve. You need clean, dependable linen—and fast.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 flex items-center justify-center">
                <div className="text-6xl sm:text-8xl">🏨</div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Hospitality</h3>
              <p className="text-base sm:text-lg text-gray-800">Hotels, Motels, Resorts, Short-Term Rentals</p>
            </div>
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-white/0 hover:border-cyan-500">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 flex items-center justify-center">
                <div className="text-6xl sm:text-8xl">🏥</div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Healthcare</h3>
              <p className="text-base sm:text-lg text-gray-800">Clinics, Medical Centres, Aged Care Homes</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-lg border-2 border-cyan-500">
            <p className="text-gray-900 font-black text-xl mb-3">Don't see your industry?</p>
            <p className="text-gray-800 text-lg mb-6">Let's chat – we tailor our services to you.</p>
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-md transition-colors"
              onClick={() => scrollToSection('quote')}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Prices Section - Mid Tint Background */}
      <section id="prices" className="py-20 px-8 bg-cyan-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-8">
            <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Prices</span>
          </h2>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-16 max-w-5xl">
            At Infinite Laundry Solutions, we believe in transparent, tailored pricing that suits the unique needs of your business.
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border-t-8 border-cyan-500">
              <div className="flex items-center gap-6 mb-8">
                <div className="text-5xl sm:text-7xl">🧺</div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase">Linen Rental Services</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base mb-8 leading-relaxed">
                Perfect for businesses looking for a hassle-free solution. Our pricing includes laundering, drying and replacement of worn items.
              </p>
              <div className="space-y-1">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b-4 border-gray-900 font-black text-sm">
                  <div>Product</div>
                  <div className="text-right">Pricing (exc. GST)</div>
                </div>
                {pricingRental.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 py-3 border-b border-gray-300 last:border-b-0">
                    <div className="text-gray-700 text-sm">{item.product}</div>
                    <div className="text-right font-bold italic text-cyan-600 text-sm">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border-t-8 border-cyan-500">
              <div className="flex items-center gap-6 mb-8">
                <div className="text-5xl sm:text-7xl">💼</div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase">Customer-Owned Goods (COG) Services</h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base mb-10 leading-relaxed">
                Already have your own linen? No problem. We offer competitive per-kilo or per-piece pricing for cleaning and return of your linen, with options for express turnaround and volume discounts.
              </p>
              <div className="space-y-5 mb-10">
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-gray-900 text-base">Competitive Per-Kilo Pricing</p>
                    <p className="text-sm text-gray-600">Best rates for bulk laundry</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-gray-900 text-base">Per-Piece Pricing Available</p>
                    <p className="text-sm text-gray-600">Perfect for specialized items</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-gray-900 text-base">Express Turnaround Options</p>
                    <p className="text-sm text-gray-600">When you need it fast</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-gray-900 text-base">Volume Discounts</p>
                    <p className="text-sm text-gray-600">Save more with higher volumes</p>
                  </div>
                </div>
              </div>
              <div className="bg-cyan-50/70 rounded-xl p-6 sm:p-8 text-center border border-cyan-500">
                <p className="text-gray-900 font-black text-lg mb-5">For a custom quote based on your needs, please click here. We tailor to your needs!!</p>
                <Button 
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-md transition-colors"
                  onClick={() => scrollToSection('quote')}
                >
                  Request Custom Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Why Us Section - Mid Tint Background */}
      <section id="why" className="py-20 px-8 bg-cyan-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-16">
            <span className="border-b-8 border-gray-900 pb-3 inline-block">Why ILS?</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                We've built Infinite Laundry Solutions on a foundation of industry knowledge, operational excellence, and next-generation technology. With premium **Electrolux machines** and sustainable practices at our core, we deliver more than clean linen—we deliver **peace of mind**.
              </p>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-cyan-500">
              <img src="https://images.unsplash.com/photo-1627564359646-5972788cec65?w=800" alt="Stacked towels" className="w-full h-64 sm:h-80 object-cover" />
            </div>
          </div>
          <div className="space-y-8">
            <div className="border-b-2 border-gray-400 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Electrolux Machinery</h3>
                <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">Our state-of-the-art European machines provide best-in-class performance with exceptional water and energy efficiency.</p>
              </div>
            </div>
            <div className="border-b-2 border-gray-400 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Experience-Driven</h3>
                <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">We know the industry inside-out because we're part of it.</p>
              </div>
            </div>
            <div className="border-b-2 border-gray-400 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Flexible Service Models</h3>
                <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">Linen hire or COG, on-demand or scheduled – we work your way.</p>
              </div>
            </div>
            <div className="border-b-2 border-gray-400 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Trial & Sample Pickups Available</h3>
                <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">Try us before you commit.</p>
              </div>
            </div>
            <div className="border-b-2 border-gray-400 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex-1">Sustainability-Focused</h3>
                <p className="text-gray-800 text-base sm:text-lg flex-1 text-left sm:text-right">Our machines and processes are designed to reduce consumption and environmental impact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Service Areas Section - Mid Tint Background */}
      <section className="py-20 px-8 bg-cyan-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-16">
            <span className="border-b-8 border-gray-900 pb-3 inline-block">Our Service Areas</span>
          </h2>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-12 max-w-4xl">
            We're proud to support businesses across Queensland with reliable, efficient linen and laundry services. From bustling city hotels to coastal clinics, our reach is growing fast.
          </p>
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Currently Serving:</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-900">Brisbane | Gold Coast | Sunshine Coast & Surrounding Suburbs</p>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Expanding Soon to:</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-900">Sydney | Newcastle | Hunter Region</p>
            </div>
          </div>
          <p className="text-gray-800 text-base sm:text-lg mb-8">
            Explore the map below to see if we service your area—or click the button for clean linen!!
          </p>
          
          {/* EMBEDDED MAP IFRAME */}
          <div className="bg-white rounded-2xl p-4 h-96 flex items-center justify-center mb-10 shadow-lg border-2 border-cyan-500 overflow-hidden">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.1159799028533!2d152.92012437514364!3d-27.62092442316589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b914955d9951729%3A0xb16876b4fb2bb3a!2s3%2F76%20Mica%20St%2C%20Carole%20Park%20QLD%204300%2C%20Australia!5e0!3m2!1sen!2sin!4v1761402560116!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <div className="text-center">
            <Button 
              className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-5 rounded-lg font-black text-lg sm:text-xl border-4 border-gray-900 shadow-md transition-colors"
              onClick={() => scrollToSection('quote')}
            >
              Get Clean Linen Now!
            </Button>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Get a Quote / Contact Form Section - Mid Tint Background */}
      <section id="quote" className="py-20 px-8 bg-cyan-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-12">
            <span className="border-b-8 border-gray-900 pb-3 inline-block">GET A QUOTE</span>
          </h2>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-12">
            Try Us Today. We offer trial services and sample pickups for eligible businesses. Let's show you what premium laundry service feels like. With **Infinite Laundry Solutions**, you're not just choosing a provider—you're choosing a partner in cleanliness, care, and operational excellence.
          </p>
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg border-t-8 border-gray-900">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Full Name <span className="text-red-500">*</span></label>
                  <Input 
                    value={contactForm.name} 
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})} 
                    required 
                    className="bg-cyan-50/70 border-none h-12" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Phone <span className="text-red-500">*</span></label>
                  <Input 
                    value={contactForm.phone} 
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} 
                    required 
                    className="bg-cyan-50/70 border-none h-12" 
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Company name</label>
                  <Input 
                    value={contactForm.company} 
                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})} 
                    className="bg-cyan-50/70 border-none h-12" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Property Address</label>
                  <Input 
                    value={contactForm.address} 
                    onChange={(e) => setContactForm({...contactForm, address: e.target.value})} 
                    className="bg-cyan-50/70 border-none h-12" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Email <span className="text-red-500">*</span></label>
                <Input 
                  type="email" 
                  value={contactForm.email} 
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})} 
                  required 
                  className="bg-cyan-50/70 border-none h-12" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Services Required / Message</label>
                <Textarea 
                  rows={5} 
                  value={contactForm.message} 
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})} 
                  className="bg-cyan-50/70 border-none" 
                />
              </div>
              <Button type="submit" className="w-full bg-gray-600 hover:bg-gray-700 text-white py-5 rounded-lg font-bold text-lg shadow-md transition-colors">
                Submit Quote Request
              </Button>
              {submitStatus === 'success' && <p className="text-green-600 text-center font-bold text-lg">Message sent successfully! We'll be in touch soon.</p>}
            </form>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Footer - Mid Tint Background with Teal Border */}
      <footer className="bg-cyan-100 py-16 px-8 border-t-8 border-cyan-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Logo and Navigation */}
            <div className="flex flex-col sm:flex-row items-start gap-8">
              <div className="w-24 sm:w-32 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg p-4 border border-gray-300">
                <img src="/assets/logo.png" alt="ILS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  Infinite Laundry Solutions
                </h3>
                <div className="space-y-2">
                  <a onClick={() => scrollToSection('home')} className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">Home</a>
                  <a onClick={() => scrollToSection('services')} className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">Services</a>
                  <a onClick={() => scrollToSection('about')} className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">About Us</a>
                  <a onClick={handleLoginClick} className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">Book Online / Login</a>
                  <a href="#" className="block text-gray-800 hover:text-cyan-600 cursor-pointer font-medium text-base">Blog</a>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="text-left md:text-center lg:text-left">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Contact Us</h3>
              <div className="space-y-3">
                <p className="text-lg font-black text-gray-900 flex items-center gap-3"><Phone className="w-5 h-5 text-cyan-500"/> +61426159286</p>
                <p className="text-base text-gray-800 font-medium flex items-center gap-3"><Mail className="w-5 h-5 text-cyan-500"/> info@infinitelaundrysolutions.com.au</p>
                <p className="text-base text-gray-800 font-medium flex items-start gap-3"><MapPin className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1"/> 3/76 Mica Street, Carole Park, QLD, 4300</p>
              </div>
              <Button 
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-black text-lg mt-8 border-4 border-gray-900 shadow-md transition-colors"
                onClick={() => scrollToSection('quote')}
              >
                LETS CHAT!!
              </Button>
            </div>
            
            {/* Business Hours */}
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">Business Hours</h3>
              <div className="space-y-2 text-lg text-gray-800">
                <p><span className="font-semibold">Monday - Friday:</span> 7:00 AM - 8:00 PM</p>
                <p><span className="font-semibold">Saturday:</span> 8:00 AM - 6:00 PM</p>
                <p><span className="font-semibold">Sunday:</span> 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-400 mt-12 pt-8 text-center text-gray-700">
            <p className="text-sm sm:text-base">&copy; 2025 Infinite Laundry Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;