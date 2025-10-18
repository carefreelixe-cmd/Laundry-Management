import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Shirt, Sparkles, Wind, Building2, Droplets, Package, TrendingUp, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function LandingPage() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      title: 'Wash & Fold',
      description: 'Professional washing, drying, and folding service with attention to detail',
      price: 'From $25',
      icon: Shirt
    },
    {
      title: 'Dry Cleaning',
      description: 'Expert dry cleaning for delicate garments and formal wear',
      price: 'From $15',
      icon: Sparkles
    },
    {
      title: 'Ironing Service',
      description: 'Crisp and professional ironing for shirts, pants, and more',
      price: 'From $20',
      icon: Wind
    },
    {
      title: 'Commercial Laundry',
      description: 'Bulk laundry solutions for businesses, hotels, and restaurants',
      price: 'Custom Quote',
      icon: Building2
    }
  ];

  const features = [
    { icon: Clock, title: 'Fast Turnaround', description: '24-48 hour service available' },
    { icon: Shield, title: 'Quality Guaranteed', description: '100% satisfaction or money back' },
    { icon: Users, title: 'Expert Staff', description: 'Trained professionals handle your items' },
    { icon: Check, title: 'Eco-Friendly', description: 'Environmentally responsible cleaning' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Owner',
      text: 'Clienty has been handling our restaurant linens for 2 years. Always on time, always perfect!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Homeowner',
      text: 'The convenience of pickup and delivery service is unmatched. Highly recommend!',
      rating: 5
    },
    {
      name: 'Emma Wilson',
      role: 'Hotel Manager',
      text: 'Professional service at competitive prices. They handle our high volume needs perfectly.',
      rating: 5
    }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/contact`, contactForm);
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-20 ">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/assets/logo.png"
                alt="Infinite Laundry Solutions Logo"
                className="h-20  w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="#services" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">Services</a>
              <a href="#about" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">About</a>
              <a href="#contact" className="text-sm xl:text-base text-gray-700 hover:text-teal-500 transition-colors font-medium">Contact</a>
              <div className='space-x-3'>
                <Button 
                  onClick={() => navigate('/signup')} 
                  variant="outline"
                  className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 rounded-full px-4 py-2 xl:px-6 text-sm xl:text-base"
                  data-testid="nav-signup-btn"
                >
                  Sign Up
                </Button>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-full px-4 xl:px-6 text-sm xl:text-base"
                  data-testid="nav-login-btn"
                >
                  Login
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="p-2"
                data-testid="mobile-menu-btn"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t animate-fade-in" data-testid="mobile-menu">
              <div className="flex flex-col space-y-3">
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50"
                >
                  Services
                </a>
                <a 
                  href="#about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50"
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-teal-500 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-teal-50"
                >
                  Contact
                </a>
                <Button 
                  onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} 
                  variant="outline"
                  className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 rounded-full w-full"
                >
                  Sign Up
                </Button>
                <Button 
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} 
                  className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-full"
                >
                  Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 mt-4 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
                Professional Laundry
                <span className="block text-teal-500 mt-1 sm:mt-2">Delivered to Your Door</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 leading-relaxed px-2 sm:px-0">
                Experience Australia's finest laundry and dry cleaning service. We pickup, clean, and deliver with care.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0">
                <Button 
                  size="lg" 
                  className="bg-teal-500 hover:bg-teal-600 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                  onClick={() => navigate('/login')}
                  data-testid="hero-book-pickup-btn"
                >
                  Book Laundry Pickup
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full w-full sm:w-auto"
                  onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                >
                  View Services
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 mt-6 sm:mt-8">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">
                  <span className="font-semibold text-gray-900">4.9/5</span> from 500+ reviews
                </p>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0 px-4 sm:px-0">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1627564359646-5972788cec65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGZvbGRlZCUyMGNsb3RoZXN8ZW58MHx8fHwxNzYwMzc1NjMwfDA&ixlib=rb-4.1.0&q=85"
                  alt="Clean folded laundry"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-6 bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 max-w-[180px] sm:max-w-[220px] md:max-w-xs">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="bg-teal-100 rounded-full p-2 sm:p-2.5 md:p-3 flex-shrink-0">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base leading-tight">Same Day Service</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight mt-0.5">Available in metro areas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Clienty?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Quality service you can trust</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-5 sm:p-6 md:p-8 rounded-2xl hover:bg-teal-50 transition-all card-hover">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-teal-100 rounded-full mb-3 sm:mb-4">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Services</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Comprehensive laundry solutions for every need</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg card-hover">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{service.description}</p>
                  <p className="text-xl sm:text-2xl font-bold text-teal-500">{service.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Simple, fast, and convenient</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            <div className="text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Schedule Pickup</h3>
              <p className="text-sm sm:text-base text-gray-600">Book online or call us to schedule a convenient pickup time</p>
            </div>
            <div className="text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">We Clean</h3>
              <p className="text-sm sm:text-base text-gray-600">Our experts clean your items with care and attention to detail</p>
            </div>
            <div className="text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Delivery</h3>
              <p className="text-sm sm:text-base text-gray-600">Fresh, clean items delivered right to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What Our Customers Say</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Join thousands of satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-5 sm:mb-6">About Clienty</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
            Clienty is Australia's premier laundry and dry cleaning service provider. With over 10 years of experience, 
            we've been serving homes and businesses across the country with dedication and expertise. Our commitment to 
            quality, convenience, and customer satisfaction sets us apart.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
            We use eco-friendly cleaning products and modern equipment to ensure your items receive the best care possible. 
            Our team of trained professionals treats every item with attention and respect.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get In Touch</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">We'd love to hear from you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            <div>
              <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Contact Information</h3>
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">1800 LAUNDRY</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base break-all">info@clienty.com.au</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Sydney, Melbourne, Brisbane</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-teal-500 rounded-2xl p-6 sm:p-7 md:p-8 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base"><span className="font-semibold">Monday - Friday:</span> 7:00 AM - 8:00 PM</p>
                  <p className="text-sm sm:text-base"><span className="font-semibold">Saturday:</span> 8:00 AM - 6:00 PM</p>
                  <p className="text-sm sm:text-base"><span className="font-semibold">Sunday:</span> 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Send Us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full text-sm sm:text-base py-5 sm:py-6"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full text-sm sm:text-base py-5 sm:py-6"
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Your Phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                    className="w-full text-sm sm:text-base py-5 sm:py-6"
                    data-testid="contact-phone-input"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    className="w-full text-sm sm:text-base"
                    data-testid="contact-message-input"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-5 sm:py-6 text-base sm:text-lg"
                  data-testid="contact-submit-btn"
                >
                  Send Message
                </Button>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-center text-sm sm:text-base">Message sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-center text-sm sm:text-base">Failed to send message. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8">
            <div className="text-center sm:text-left">
              <img 
                src="https://customer-assets.emergentagent.com/job_washdash-1/artifacts/ed664txa_Screenshot%202025-10-14%20121020.png"
                alt="Infinite Laundry Solutions Logo"
                className="h-10 sm:h-12 w-auto mb-4 mx-auto sm:mx-0"
              />
              <p className="text-sm sm:text-base text-gray-400">Australia's trusted laundry service provider</p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Services</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Wash & Fold</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Dry Cleaning</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Ironing</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Commercial</a></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Connect</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2025 Clienty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;