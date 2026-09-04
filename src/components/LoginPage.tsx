import React, { useState } from 'react';
import logo from '../assets/logo.jpeg';
import bg1 from '../assets/bg1.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRobotChecked, setIsRobotChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Sign in attempted with:', { email, password, isRobotChecked });
  };

  const planePath = "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-gradient-to-b from-[#060e1f] via-[#0b1d35] via-[#0d2240] via-[#0a1a30] to-[#081428] font-[Segoe_UI,Roboto,Helvetica_Neue,Arial,sans-serif]">
      {/* Background image */}
      <img src={bg1} alt="" className="pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-full w-full object-cover" />

      {/* Earth atmosphere glow */}
      <div className="pointer-events-none absolute bottom-[-60px] left-1/2 z-[1] h-[280px] w-[160%] -translate-x-1/2 bg-[radial-gradient(ellipse_70%_100%_at_center_bottom,rgba(30,120,220,0.4)_0%,rgba(20,80,180,0.2)_40%,rgba(10,40,100,0.05)_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[120px] w-full bg-gradient-to-t from-[rgba(50,140,240,0.25)] via-[rgba(40,120,220,0.2)] via-[rgba(30,100,200,0.15)] via-[rgba(20,80,160,0.08)] to-transparent" />

      {/* Decorative arc lines */}
      <svg className="pointer-events-none absolute top-[-5%] left-1/2 z-[2] w-[70%] max-w-[900px] -translate-x-1/2" viewBox="0 0 800 600" fill="none">
        <ellipse cx="400" cy="350" rx="380" ry="300" stroke="rgba(80,130,200,0.12)" strokeWidth="1.2" strokeDasharray="10 8" />
      </svg>
      <svg className="pointer-events-none absolute top-[5%] left-1/2 z-[2] w-[60%] max-w-[780px] -translate-x-1/2" viewBox="0 0 800 600" fill="none">
        <ellipse cx="400" cy="380" rx="340" ry="260" stroke="rgba(80,130,200,0.08)" strokeWidth="1.2" strokeDasharray="10 8" />
      </svg>

      {/* Plane decorations */}
      <svg className="pointer-events-none absolute z-[2] h-9 w-9 top-[10%] left-[8%]" viewBox="0 0 24 24" fill="none"><path d={planePath} fill="rgba(120,155,200,0.35)" /></svg>
      <svg className="pointer-events-none absolute z-[2] h-7 w-7 top-[32%] left-[5%]" viewBox="0 0 24 24" fill="none"><path d={planePath} fill="rgba(120,155,200,0.25)" /></svg>
      <svg className="pointer-events-none absolute z-[2] h-8 w-8 top-[14%] right-[10%]" viewBox="0 0 24 24" fill="none"><path d={planePath} fill="rgba(120,155,200,0.3)" /></svg>
      <svg className="pointer-events-none absolute z-[2] h-6 w-6 top-[38%] right-[7%]" viewBox="0 0 24 24" fill="none"><path d={planePath} fill="rgba(120,155,200,0.22)" /></svg>
      <svg className="pointer-events-none absolute z-[2] h-6.5 w-6.5 top-[58%] left-[14%]" viewBox="0 0 24 24" fill="none"><path d={planePath} fill="rgba(120,155,200,0.28)" /></svg>

      {/* Main card */}
      <div className="relative z-10 w-[92%] max-w-[440px] rounded-[18px] border border-[rgba(80,140,220,0.12)] bg-[rgba(12,22,45,0.82)] px-6 py-7 pb-6 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(20,60,140,0.08),inset_0_1px_0_rgba(100,160,240,0.06)] backdrop-blur-2xl sm:px-10">
        {/* Logo */}
        <div className="mb-3 flex justify-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle,rgba(40,100,220,0.15)_0%,transparent_70%)]" />
            <img src={logo} alt="Akbar Travels Logo" className="h-20 w-20 rounded-full border-2 border-[rgba(80,150,240,0.45)] object-cover" />
          </div>
        </div>

        <h1 className="m-0 mb-1 text-[28px] font-bold tracking-[0.3px] text-white">Akbar Travels</h1>
        <p className="m-0 mb-[22px] text-[15px] text-[rgba(170,195,225,0.65)]">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Email input */}
          <div className="w-full">
            <div className="flex h-11 items-center rounded-[10px] border border-[rgba(80,130,200,0.18)] bg-[rgba(16,30,58,0.9)] px-3.5 transition-[border-color,box-shadow] duration-200 focus-within:border-[rgba(80,150,240,0.35)] focus-within:shadow-[0_0_0_3px_rgba(50,120,220,0.1)]">
              <svg className="mr-3 h-5 w-5 shrink-0 text-[rgba(140,170,210,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4l-10 8L2 4" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="h-full flex-1 bg-transparent text-[15px] font-inherit text-[#dde6f0] outline-none placeholder:text-[rgba(140,170,210,0.45)]"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="w-full">
            <div className="flex h-11 items-center rounded-[10px] border border-[rgba(80,130,200,0.18)] bg-[rgba(16,30,58,0.9)] px-3.5 transition-[border-color,box-shadow] duration-200 focus-within:border-[rgba(80,150,240,0.35)] focus-within:shadow-[0_0_0_3px_rgba(50,120,220,0.1)]">
              <svg className="mr-3 h-5 w-5 shrink-0 text-[rgba(140,170,210,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="h-full flex-1 bg-transparent text-[15px] font-inherit text-[#dde6f0] outline-none placeholder:text-[rgba(140,170,210,0.45)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-[rgba(140,170,210,0.5)] transition-colors duration-200 hover:text-[rgba(170,200,240,0.8)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
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
          <div className="text-right">
            <a href="#" className="text-[13.5px] font-medium text-[#4a9eff] no-underline transition-colors duration-200 hover:text-[#6bb3ff] hover:underline">Forgot password?</a>
          </div>

          {/* reCAPTCHA */}
          <div className="flex items-center justify-between rounded-[4px] border border-[rgba(180,180,180,0.12)] bg-[rgba(240,240,240,0.04)] px-3.5 py-2.5">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsRobotChecked(!isRobotChecked)}
                className={`flex h-[30px] w-[30px] min-w-[30px] cursor-pointer items-center justify-center rounded-[3px] border-2 bg-[rgba(25,35,55,0.6)] p-0 transition-colors duration-200 hover:border-[rgba(180,180,180,0.5)] ${isRobotChecked ? 'border-[rgba(66,133,244,0.5)]' : 'border-[rgba(180,180,180,0.35)]'}`}
              >
                {isRobotChecked && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="font-[Roboto,Segoe_UI,sans-serif] text-[14px] tracking-[0.1px] text-[rgba(210,215,225,0.75)]">I'm not a robot</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <svg width="30" height="30" viewBox="0 0 48 48" className="mb-0.5">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z" fill="none" />
                <path d="M36 14.5A16 16 0 0 0 24 8c-8.84 0-16 7.16-16 16s7.16 16 16 16c7.46 0 13.68-5.1 15.46-12" stroke="#4285f4" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M24 16v8l6 6" stroke="#ea4335" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <polygon points="24,12 26.5,15.5 24,18 21.5,15.5" fill="#4285f4" />
              </svg>
              <span className="font-[Roboto,sans-serif] text-[10px] font-medium tracking-[0.3px] text-[rgba(170,175,185,0.7)]">reCAPTCHA</span>
              <span className="font-[Roboto,sans-serif] text-[8px] text-[rgba(140,145,155,0.6)]">Privacy · Terms</span>
            </div>
          </div>

          {/* Sign In button */}
          <button type="submit" className="mt-0.5 w-full cursor-pointer rounded-[10px] border-none bg-gradient-to-br from-[#1d6de8] via-[#2b82f6] to-[#3b8df7] px-0 py-3 text-[16px] font-semibold tracking-[0.3px] font-inherit text-white shadow-[0_4px_20px_rgba(30,100,230,0.3),0_1px_3px_rgba(30,100,230,0.2)] transition-all duration-250 hover:-translate-y-px hover:from-[#2578f0] hover:via-[#3590ff] hover:to-[#4598ff] hover:shadow-[0_6px_28px_rgba(30,100,230,0.4),0_2px_6px_rgba(30,100,230,0.25)] active:translate-y-0 active:shadow-[0_2px_12px_rgba(30,100,230,0.25),0_1px_3px_rgba(30,100,230,0.15)]">
            Sign In
          </button>

          {/* Create account */}
          <p className="m-0 mt-2.5 text-[14px] text-[rgba(170,195,225,0.55)]">
            Don't have an account? <a href="#" className="font-semibold text-[#4a9eff] no-underline transition-colors duration-200 hover:text-[#6bb3ff] hover:underline">Create account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
