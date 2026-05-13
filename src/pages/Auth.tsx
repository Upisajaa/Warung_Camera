import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, User, Github } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      
      toast.success('Welcome to LensCraft!');
      navigate('/');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Log in successful');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email,
          displayName: name,
          role: 'user',
          createdAt: new Date().toISOString()
        });
        toast.success('Account created successfully');
      }
      navigate('/');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-dark-card border border-white/10 p-10 relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl font-light font-serif italic tracking-tighter text-white mb-2 uppercase">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">
            {isLogin ? 'Access your professional vault' : 'Join the elite creator network'}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-gold transition-all text-white"
                placeholder="Augustus Gloop"
              />
            </div>
          )}
          
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-gold transition-all text-white"
              placeholder="curator@lenscraft.pro"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 ml-1">Secure Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-gold transition-all text-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-4 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Enter Portal' : 'Authorize Membership'}
          </button>
        </form>

        <div className="relative my-10 text-center text-[9px] font-bold uppercase tracking-widest text-white/20">
          <span className="bg-dark-card px-4 relative z-10">Verification</span>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            Google
          </button>
          <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest">
            GitHub
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">
            {isLogin ? "New to the collective?" : "Already a member?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-gold font-bold hover:text-white transition-colors"
            >
              {isLogin ? 'Secure Membership' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
