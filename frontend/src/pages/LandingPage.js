import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Check, Star, Clock, Shield, Users, Shirt, Sparkles, Wind, Building2, Droplets, Package, TrendingUp } from 'lucide-react';
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
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">Clienty</span>
                <p className="text-xs text-teal-600 font-medium">Laundry Solutions</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-teal-500 transition-colors font-medium">Services</a>
              <a href="#about" className="text-gray-700 hover:text-teal-500 transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-teal-500 transition-colors font-medium">Contact</a>
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-6"
                data-testid="nav-login-btn"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Professional Laundry
                <span className="block text-teal-500">Delivered to Your Door</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience Australia's finest laundry and dry cleaning service. We pickup, clean, and deliver with care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate('/login')}
                  data-testid="hero-book-pickup-btn"
                >
                  Book Laundry Pickup
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 text-lg px-8 py-6 rounded-full"
                  onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                >
                  View Services
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">4.9/5</span> from 500+ reviews
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1627564359646-5972788cec65?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGZvbGRlZCUyMGNsb3RoZXN8ZW58MHx8fHwxNzYwMzc1NjMwfDA&ixlib=rb-4.1.0&q=85"
                  alt="Clean folded laundry"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="bg-teal-100 rounded-full p-3">
                    <Check className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Same Day Service</p>
                    <p className="text-sm text-gray-600">Available in metro areas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Clienty?</h2>
            <p className="text-xl text-gray-600">Quality service you can trust</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-teal-50 transition-all card-hover">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive laundry solutions for every need</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg card-hover">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                    <IconComponent className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-2xl font-bold text-teal-500">{service.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and convenient</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Schedule Pickup</h3>
              <p className="text-gray-600">Book online or call us to schedule a convenient pickup time</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">We Clean</h3>
              <p className="text-gray-600">Our experts clean your items with care and attention to detail</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Delivery</h3>
              <p className="text-gray-600">Fresh, clean items delivered right to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">About Clienty</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Clienty is Australia's premier laundry and dry cleaning service provider. With over 10 years of experience, 
            we've been serving homes and businesses across the country with dedication and expertise. Our commitment to 
            quality, convenience, and customer satisfaction sets us apart.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We use eco-friendly cleaning products and modern equipment to ensure your items receive the best care possible. 
            Our team of trained professionals treats every item with attention and respect.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">1800 LAUNDRY</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">info@clienty.com.au</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-900">Sydney, Melbourne, Brisbane</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-teal-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">Monday - Friday:</span> 7:00 AM - 8:00 PM</p>
                  <p><span className="font-semibold">Saturday:</span> 8:00 AM - 6:00 PM</p>
                  <p><span className="font-semibold">Sunday:</span> 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full"
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
                    className="w-full"
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Your Phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                    className="w-full"
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
                    className="w-full"
                    data-testid="contact-message-input"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg"
                  data-testid="contact-submit-btn"
                >
                  Send Message
                </Button>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-center">Message sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-center">Failed to send message. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl text-white font-bold">∞</span>
                </div>
                <span className="text-xl font-bold">Clienty</span>
              </div>
              <p className="text-gray-400">Australia's trusted laundry service provider</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Wash & Fold</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Dry Cleaning</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Ironing</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Commercial</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Clienty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;