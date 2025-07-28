import React from 'react';
import {
    Users,
    Target,
    Award,
    Globe,
    Heart,
    Zap,
    Shield,
    Car,
    Home,
    Waves,
    Scissors,
    Mail,
    MapPin,
    Phone
} from 'lucide-react';

const AboutUs: React.FC = () => {
    const contactInfo = {
        phone: '+297 569 4343',
        email: 'info@cardealership.com',
        address: 'Oranjestad Santa Cruz 38, Aruba'
    };

    const handleContactUs = () => {
        // Primary action: Call the phone number
        window.location.href = `tel:${contactInfo.phone}`;
    };

    const handleGetStarted = () => {
        // You can customize this action based on your needs
        window.location.href = '/';
    };

    const handlePhoneClick = () => {
        window.location.href = `tel:${contactInfo.phone}`;
    };

    const handleEmailClick = () => {
        window.location.href = `mailto:${contactInfo.email}`;
    };

    const handleAddressClick = () => {
        // Open Google Maps with the address
        const encodedAddress = encodeURIComponent(contactInfo.address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };

    const stats = [
        { number: '50K+', label: 'Active Users', icon: Users },
        { number: '5+', label: 'Platform Services', icon: Globe },
        { number: '99.9%', label: 'Uptime', icon: Shield },
        { number: '4.8/5', label: 'User Rating', icon: Award }
    ];

    const values = [
        {
            icon: Target,
            title: 'Our Mission',
            description: 'To create a unified marketplace that connects people with essential services - from finding their dream car to booking the perfect stay.',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: Heart,
            title: 'Our Values',
            description: 'Trust, transparency, and customer satisfaction drive everything we do. We believe in building lasting relationships.',
            bgColor: 'bg-pink-50',
            iconColor: 'text-pink-600'
        },
        {
            icon: Zap,
            title: 'Our Vision',
            description: 'To become the leading multi-platform marketplace in Aruba, making essential services accessible to everyone.',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        }
    ];

    const services = [
        {
            icon: Car,
            title: 'Cars',
            description: 'Browse and buy from thousands of verified car listings',
            link: 'https://cars.arudeal.com',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Home,
            title: 'Real Estate',
            description: 'Find your perfect home or investment property',
            link: 'https://realestate.arudeal.com',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: Home,
            title: 'Stays',
            description: 'Book comfortable accommodations for your travels',
            link: 'https://stays.arudeal.com',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: Waves,
            title: 'Water Sports',
            description: 'Dive into exciting water sports and activities',
            link: 'https://watersport.arudeal.com',
            color: 'from-cyan-500 to-cyan-600'
        },
        {
            icon: Scissors,
            title: 'Nail Services',
            description: 'Professional nail care and beauty services',
            link: 'https://nails.arudeal.com',
            color: 'from-pink-500 to-pink-600'
        }
    ];

    const team = [
        {
            name: 'Elvin Croes',
            role: 'CEO & Founder',
            image: 'https://picsum.photos/300/300?random=1',
            bio: 'Visionary leader with 10+ years in tech and marketplace development.'
        },
        {
            name: 'Mehthab Alam',
            role: 'CTO',
            image: 'https://picsum.photos/300/300?random=2',
            bio: 'Tech enthusiast driving innovation across our platform ecosystem.'
        },
        {
            name: 'Akhtar Ali',
            role: 'Software developer',
            image: 'https://picsum.photos/300/300?random=3',
            bio: 'Operations expert ensuring seamless user experiences across all services.'
        },
        {
            name: 'Ayesha',
            role: 'Software developer',
            image: 'https://picsum.photos/300/300?random=4',
            bio: 'Creative strategist building our brand presence across Aruba.'
        }
    ];

    const timeline = [
        {
            year: '2020',
            title: 'The Beginning',
            description: 'AruDeal was founded with a vision to simplify online marketplace experiences in Aruba.'
        },
        {
            year: '2021',
            title: 'Cars Platform Launch',
            description: 'Launched our first platform focusing on automobile marketplace with verified listings.'
        },
        {
            year: '2022',
            title: 'Real Estate Expansion',
            description: 'Expanded into real estate, helping thousands find their dream homes.'
        },
        {
            year: '2023',
            title: 'Service Diversification',
            description: 'Added Stays, Water Sports, and Nail Services to our platform ecosystem.'
        },
        {
            year: '2024',
            title: 'Market Leadership',
            description: 'Became one of Aruba\'s leading multi-platform marketplace solutions.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
                            About <span className="text-white">AruDeal</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto mb-8">
                            Connecting Aruba through innovative marketplace solutions across cars, real estate, stays, water sports, and beauty services.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleGetStarted}
                                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                            >
                                Our Story
                            </button>
                            <button
                                onClick={handleContactUs}
                                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                                    <stat.icon className="h-8 w-8 text-yellow-600" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Drives Us
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our core principles guide every decision we make and every service we provide.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`inline-flex items-center justify-center w-16 h-16 ${value.bgColor} rounded-2xl mb-6`}>
                                    <value.icon className={`h-8 w-8 ${value.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Services */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Platform Ecosystem
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Five specialized platforms designed to meet your diverse needs.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-200"
                            >
                                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${service.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                    <service.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-gray-600 mb-4">{service.description}</p>
                                <button
                                    onClick={() => window.open(service.link, '_blank')}
                                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm group-hover:underline"
                                >
                                    Explore Platform →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            The passionate individuals behind AruDeal's success story.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-4">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-48 h-48 rounded-3xl mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-yellow-600 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Ready to Join Our Journey?
                    </h2>
                    <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
                        Whether you're looking to buy, sell, or explore our services, we're here to help you every step of the way.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button
                            onClick={handleGetStarted}
                            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={handleContactUs}
                            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Contact Us
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center text-black">
                        <button
                            onClick={handleAddressClick}
                            className="flex items-center justify-center gap-2 hover:text-gray-800 transition-colors"
                        >
                            <MapPin className="h-5 w-5" />
                            <span>{contactInfo.address}</span>
                        </button>
                        <button
                            onClick={handlePhoneClick}
                            className="flex items-center justify-center gap-2 hover:text-gray-800 transition-colors"
                        >
                            <Phone className="h-5 w-5" />
                            <span>{contactInfo.phone}</span>
                        </button>
                        <button
                            onClick={handleEmailClick}
                            className="flex items-center justify-center gap-2 hover:text-gray-800 transition-colors"
                        >
                            <Mail className="h-5 w-5" />
                            <span>{contactInfo.email}</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;