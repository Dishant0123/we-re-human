import { Heart, Globe, Users, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Image1 from '../assets/image-1.jpg';
import Image2 from '../assets/image-2.jpg';

const About = () => {
  return (
    <div className="min-h-screen pt-32 px-4 max-w-6xl mx-auto pb-20">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
        <div className="flex-1 lg:pr-10 text-center lg:text-left">
          <span className="text-theme-teal font-bold tracking-widest uppercase text-sm mb-4 block">Our Mission</span>
          <h1 className="text-6xl font-semibold text-theme-black tracking-tight mb-6 leading-[1.2]">
            Technology designed for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-teal to-theme-teal-dark">empathy.</span>
          </h1>
          <p className="text-lg text-theme-grey leading-relaxed mb-8">
            In a world moving faster than ever, the desire to help often gets lost in the noise of <em>how</em> to help. <strong>We're Human</strong> was built to eliminate the friction between a good intention and a real-world impact.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-theme-teal text-white rounded-xl shadow-md hover:bg-theme-teal-dark hover:shadow-lg transition-all duration-300 font-medium">
            Join the Initiative <ArrowRight size={18} />
          </Link>
        </div>
        
        {/* Hero CDN Image Grid */}
        <div className="flex-1 relative w-full max-w-lg">
          <div className="absolute inset-0 bg-theme-teal-pale blur-3xl opacity-40 rounded-full"></div>
          <div className="relative grid grid-cols-2 gap-4">
            <img 
              src={Image1} 
              alt="Community volunteering" 
              className="rounded-3xl shadow-lg w-full h-64 object-cover transform translate-y-8"
            />
            <img 
              src= {Image2} 
              alt="Hands joining" 
              className="rounded-3xl shadow-lg w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>

      {/* The Story Section */}
      <div className="bg-white/70 backdrop-blur-md border border-theme-border rounded-[32px] p-8 md:p-16 shadow-theme-glass mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-theme-teal-light rounded-bl-full opacity-50 -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-theme-black mb-6">Bridging the Gap</h2>
          <p className="text-theme-grey text-lg leading-relaxed mb-6">
            Whether it is an urgent call for life-saving blood or a weekend beach cleanup, we believe that when the right people are connected at the exact right moment, miracles happen. 
          </p>
          <p className="text-theme-grey text-lg leading-relaxed">
            Our platform equips Non-Governmental Organizations (NGOs) with the tools they need to mobilize volunteers instantly, while giving citizens a beautifully simple interface to discover where their help is needed most. No bureaucracy, no endless email chains. Just humans helping humans.
          </p>
        </div>
      </div>

      {/* Core Values / Pillars */}
      <div className="mb-24">
        <h2 className="text-3xl font-semibold text-theme-black text-center mb-12">Our Core Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {[
            { icon: <Heart size={28}/>, title: "Compassion First", desc: "Every line of code is written with the goal of fostering human connection." },
            { icon: <Globe size={28}/>, title: "Local Impact", desc: "Global change starts in your own city. We prioritize community-level initiatives." },
            { icon: <Users size={28}/>, title: "Seamless Unity", desc: "Breaking down the walls between established organizations and eager volunteers." },
            { icon: <Shield size={28}/>, title: "Secure & Safe", desc: "Verified NGOs and secure real-time communications ensure trust on the platform." }
          ].map((pillar, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-sm border border-theme-border rounded-[24px] p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-theme-teal-light text-theme-teal rounded-2xl flex items-center justify-center mb-6">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-semibold text-theme-black mb-3">{pillar.title}</h3>
              <p className="text-theme-grey text-sm leading-relaxed">{pillar.desc}</p>
            </div>
          ))}

        </div>
      </div>

      {/* Developer Note */}
      <div className="flex flex-col md:flex-row items-center gap-10 bg-theme-light text-white rounded-[24px] p-8 md:p-12 shadow-2xl">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-theme-teal to-theme-teal-dark rounded-full flex items-center justify-center border-4 border-theme-light shadow-[0_0_0_4px_rgba(41,149,120,0.3)]">
            <span className="text-4xl font-bold text-white">D</span>
          </div>
        </div>
        <div>
          <h3 className="text-black text-2xl font-semibold mb-2">The Architecture of Care</h3>
          <p className="text-gray-900 text-sm mb-4 uppercase tracking-wider font-medium">A note from the developer</p>
          <p className="text-gray-800 leading-relaxed italic">
            "I built this platform because I realized that the barrier to volunteering isn't a lack of empathy; it's a lack of infrastructure. 'We're Human' was engineered to be the missing bridge. By combining real-time WebSockets, secure data layers, and an intuitive interface, we are proving that technology can be a profound force for social good."
          </p>
          <p className="mt-4 font-semibold text-theme-teal">— Dishant, 252302037</p>
        </div>
      </div>

    </div>
  );
};

export default About;