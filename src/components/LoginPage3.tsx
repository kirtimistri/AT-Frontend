import React, { useState } from 'react';
import bg3 from '../assets/bg3.png';
import logo from '../assets/logo.jpeg';

const LoginPage3 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRobotChecked, setIsRobotChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Sign in attempted with:', { email, password, isRobotChecked });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#040b18] font-[Segoe_UI,Roboto,Helvetica_Neue,Arial,sans-serif]">
      {/* Background image */}
      <img src={bg3} alt="" className="pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-full w-full object-cover" />

      {/* Card */}
      <div className="relative z-10 w-[92%] max-w-[400px] rounded-[18px] border border-[rgba(80,140,220,0.15)] bg-[rgba(10,20,45,0.7)] px-5 py-[22px] pb-[18px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-[20px] sm:px-8">
        {/* Logo */}
        <div className="mb-3 flex justify-center">
          <div className="relative flex h-[85px] w-[85px] items-center justify-center">
            <div className="absolute inset-[-5px] rounded-full border-[2.5px] border-[rgba(40,140,255,0.6)] shadow-[0_0_20px_rgba(40,140,255,0.3),0_0_40px_rgba(40,140,255,0.15),inset_0_0_20px_rgba(40,140,255,0.1)]" />
            <div className="absolute inset-[-12px] -z-10 rounded-full bg-[radial-gradient(circle,rgba(40,140,255,0.12)_0%,transparent_70%)]" />
            <img src={logo} alt="Akbar Travels Logo" className="h-[70px] w-[70px] rounded-full border-2 border-[rgba(40,120,240,0.3)] object-cover" />
          </div>
        </div>

        {/* Brand name */}
        <p className="m-0 mb-1 text-center text-[13px] font-semibold tracking-[6px] uppercase text-[rgba(200,215,235,0.65)]">AKBAR TRAVELS</p>

        {/* Title */}
        <h1 className="m-0 mb-[20px] text-[24px] font-bold text-white">Welcome back.</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
          {/* Email */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[rgba(200,215,235,0.7)]">Email address</label>
            <div className="flex h-[40px] items-center rounded-[10px] border border-[rgba(80,130,200,0.18)] bg-[rgba(12,22,48,0.85)] px-3.5 transition-[border-color,box-shadow] duration-200 focus-within:border-[rgba(80,150,240,0.35)] focus-within:shadow-[0_0_0_3px_rgba(50,120,220,0.1)]">
              <svg className="mr-3 h-[18px] w-[18px] shrink-0 text-[rgba(140,170,210,0.45)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-full flex-1 bg-transparent text-[14px] font-inherit leading-[40px] text-[#dde6f0] outline-none placeholder:text-[rgba(140,170,210,0.4)]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[rgba(200,215,235,0.7)]">Password</label>
            <div className="relative flex h-[40px] items-center rounded-[10px] border border-[rgba(80,130,200,0.18)] bg-[rgba(12,22,48,0.85)] px-3.5 transition-[border-color,box-shadow] duration-200 focus-within:border-[rgba(80,150,240,0.35)] focus-within:shadow-[0_0_0_3px_rgba(50,120,220,0.1)]">
              <svg className="mr-3 h-[18px] w-[18px] shrink-0 text-[rgba(140,170,210,0.45)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-full flex-1 bg-transparent text-[14px] font-inherit leading-[40px] text-[#dde6f0] outline-none placeholder:text-[rgba(140,170,210,0.4)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-[rgba(140,170,210,0.45)] transition-colors duration-200 hover:text-[rgba(170,200,240,0.8)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                  {showPassword ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="mt-[-3px] text-right">
            <a href="#" className="text-[12.5px] font-medium text-[#3b9cff] no-underline transition-colors duration-200 hover:text-[#6bb3ff] hover:underline">Forgot password?</a>
          </div>

          {/* reCAPTCHA */}
          <div className="mt-0 flex items-center justify-between rounded-[4px] border border-[rgba(180,180,180,0.12)] bg-[rgba(240,240,240,0.04)] px-3.5 py-2.5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRobotChecked(!isRobotChecked)}
                className={`flex h-[28px] w-[28px] min-w-[28px] cursor-pointer items-center justify-center rounded-[3px] border-2 bg-[rgba(25,35,55,0.6)] p-0 transition-colors duration-200 hover:border-[rgba(180,180,180,0.5)] ${isRobotChecked ? 'border-[rgba(66,133,244,0.5)]' : 'border-[rgba(180,180,180,0.35)]'}`}
              >
                {isRobotChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="font-[Roboto,Segoe_UI,sans-serif] text-[13px] text-[rgba(210,215,225,0.75)]">I'm not a robot</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <svg width="26" height="26" viewBox="0 0 48 48" className="mb-0.5">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z" fill="none" />
                <path d="M36 14.5A16 16 0 0 0 24 8c-8.84 0-16 7.16-16 16s7.16 16 16 16c7.46 0 13.68-5.1 15.46-12" stroke="#4285f4" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M24 16v8l6 6" stroke="#ea4335" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <polygon points="24,12 26.5,15.5 24,18 21.5,15.5" fill="#4285f4" />
              </svg>
              <span className="font-[Roboto,sans-serif] text-[9px] font-medium tracking-[0.3px] text-[rgba(170,175,185,0.7)]">reCAPTCHA</span>
              <span className="font-[Roboto,sans-serif] text-[7px] text-[rgba(140,145,155,0.6)]">Privacy · Terms</span>
            </div>
          </div>

          {/* Sign In button */}
          <button type="submit" className="mt-0.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none bg-gradient-to-br from-[#1565e0] via-[#1d7bf5] to-[#2b8df8] py-[11px] text-[15px] font-semibold tracking-[0.3px] font-inherit text-white shadow-[0_4px_20px_rgba(25,100,230,0.3),0_1px_3px_rgba(25,100,230,0.2)] transition-all duration-250 hover:-translate-y-px hover:from-[#1d75f0] hover:via-[#2588ff] hover:to-[#3598ff] hover:shadow-[0_6px_28px_rgba(25,100,230,0.4),0_2px_6px_rgba(25,100,230,0.25)] active:translate-y-0">
            Sign In
          </button>

          {/* Create account */}
          <p className="m-0 mt-1.5 text-center text-[13px] text-[rgba(170,195,225,0.5)]">
            Don't have an account? <a href="#" className="font-semibold text-[#3b9cff] no-underline transition-colors duration-200 hover:text-[#6bb3ff] hover:underline">Create account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage3;
