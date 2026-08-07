import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Vote, ShieldCheck, BarChart3, Users, Share2, Loader2 } from 'lucide-react';
import SystemStatus from '../components/SystemStatus';

export default function Home() {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;

    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: 'IndiaVotes - Digital Democracy',
          text: 'Join the digital democracy and make your voice heard with IndiaVotes!',
          url: window.location.origin,
        });
      } catch (err: any) {
        // Only log if it's not a user cancellation
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
          // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.origin);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mesh-bg min-h-screen">
      {/* Hero Section */}
       <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-24 px-4 text-center lg:py-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl z-10"
        >
          <div className="mb-8 inline-flex items-center rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 text-sm font-bold text-orange-600 shadow-sm">
            <span className="mr-2 flex h-2.5 w-2.5 animate-pulse rounded-full bg-orange-600"></span>
            Digital Democracy for 1.4 Billion People
          </div>
          <h1 className="mb-8 text-6xl font-extrabold tracking-tight text-slate-900 sm:text-8xl font-display">
            Your Vote <br />
            <span className="gradient-text">Your Power</span>
          </h1>
          <p className="mb-12 text-xl text-slate-600 sm:text-2xl max-w-2xl mx-auto leading-relaxed">
            Experience the most secure, transparent, and user-friendly online voting platform designed exclusively for India.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto px-12">Register to Vote</Button>
            </Link>
            <Link to="/candidates">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-12">Explore Candidates</Button>
            </Link>
            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full sm:w-auto px-8 flex items-center space-x-2 text-slate-600 hover:text-orange-600"
              onClick={handleShare}
               disabled={isSharing}
            >
               {isSharing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Share2 className="h-5 w-5" />
              )}
              <span>{isSharing ? 'Sharing...' : 'Share App'}</span>
            </Button>
          </div>

          {/* Backend Connection Display */}
          <SystemStatus />
        </motion.div>

        {/* Decorative Mesh Gradients */}
        <div className="absolute -left-40 top-0 h-125 w-125 rounded-full bg-orange-200/40 blur-[120px]"></div>
        <div className="absolute -right-40 bottom-0 h-125 w-125 rounded-full bg-green-200/30 blur-[120px]"></div>
      </section>

      {/* Bento Grid Features */}
      <section className="w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-display">Revolutionizing Elections</h2>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">Our platform combines military-grade security with a seamless user experience.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
          <motion.div 
             whileHover={{ y: -8 }}
            className="md:col-span-2 md:row-span-1 rounded-3xl bg-linear-to-br from-orange-600 to-amber-500 p-10 text-white shadow-2xl overflow-hidden relative group"
          >
            <ShieldCheck className="absolute -right-10 -bottom-10 h-64 w-64 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              <ShieldCheck className="h-12 w-12 mb-6" />
              <h3 className="text-3xl font-bold mb-4">End-to-End Encryption</h3>
              <p className="text-orange-50 text-lg max-w-md">Your identity and your vote are protected by advanced cryptographic protocols, ensuring complete anonymity and security.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="rounded-3xl bg-white border border-slate-100 p-10 shadow-xl"
          >
            <BarChart3 className="h-12 w-12 mb-6 text-orange-600" />
            <h3 className="text-2xl font-bold mb-4">Live Analytics</h3>
            <p className="text-slate-600">Real-time data visualization of voting trends across constituencies, providing instant transparency.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl"
          >
            <Users className="h-12 w-12 mb-6 text-orange-500" />
            <h3 className="text-2xl font-bold mb-4">Verified Voters</h3>
            <p className="text-slate-400">Identity verification via Aadhaar and secure login with DigiLocker ensures the integrity of every single vote cast.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="md:col-span-2 rounded-3xl bg-linear-to-br from-green-600 to-emerald-500 p-10 text-white shadow-2xl relative overflow-hidden group"
          >
            <Vote className="absolute -right-10 -bottom-10 h-64 w-64 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              <Vote className="h-12 w-12 mb-6" />
              <h3 className="text-3xl font-bold mb-4">Universal Accessibility</h3>
              <p className="text-green-50 text-lg max-w-lg">Whether you're in a bustling city or a remote village, our platform is optimized for all devices and network conditions.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 india-gradient opacity-10"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 text-center sm:grid-cols-3">
            <div className="glass-card p-10 rounded-3xl">
              <div className="text-6xl font-black text-orange-600 mb-2">100%</div>
              <div className="text-lg font-bold text-slate-700 uppercase tracking-widest">Tamper Proof</div>
            </div>
            <div className="glass-card p-10 rounded-3xl">
              <div className="text-6xl font-black text-green-600 mb-2">Zero</div>
              <div className="text-lg font-bold text-slate-700 uppercase tracking-widest">Wait Time</div>
            </div>
            <div className="glass-card p-10 rounded-3xl">
                      <div className="text-6xl font-black text-navy-600 mb-2">24/7</div>
              <div className="text-lg font-bold text-slate-700 uppercase tracking-widest">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-32 text-center">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mx-auto max-w-5xl rounded-[40px] bg-slate-950 p-16 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-64 w-64 bg-orange-600/20 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-green-600/20 blur-[100px]"></div>
          
          <h2 className="mb-8 text-4xl font-bold sm:text-6xl font-display">Shape the Future of India.</h2>
          <p className="mb-12 text-xl opacity-70 max-w-2xl mx-auto">Your participation is the heartbeat of our democracy. Join the digital revolution today.</p>
          <Link to="/signup">
            <Button variant="secondary" size="lg" className="bg-white text-slate-950 hover:bg-orange-50 hover:text-orange-600 px-16">Get Your Voter ID</Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">INDIA<span className="text-orange-600">VOTES</span></span>
          </div>
          <div className="flex justify-center space-x-8 mb-8 text-slate-500 font-medium">
            <a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Help Center</a>
          </div>
          <p className="text-slate-400">© 2026 IndiaVotes Digital Democracy Initiative. Empowering every citizen.</p>
        </div>
      </footer>
    </div>
  );
}
