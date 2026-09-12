import React,{useEffect,useRef,useState}from'react';
import{useNavigate}from'react-router-dom';
import bg2 from'../assets/Backgoundimages/bg2.png';
import lightBg from'../assets/Backgoundimages/backgroundlight.jpeg';
import logo from'../assets/Backgoundimages/logo2.svg';
import{useThemeStore}from'../store/themeStore';
import{signupUser,ApiError}from'../services/authService';
import ReCAPTCHA from'react-google-recaptcha';
import{toast}from'../store/toastStore';
import{useGlobalLoader,GLOBAL_SIGNUP_MESSAGES}from'../store/globalLoader';

const BG_W=1672,BG_H=941,PLANET={cx:929,cy:1575,r:1413};

const HorizonGlow=({imgRef}:{imgRef:React.RefObject<HTMLImageElement|null>})=>{
 const[box,setBox]=useState<{left:number;top:number;width:number;height:number}|null>(null);
 useEffect(()=>{
  const img=imgRef.current;if(!img)return;let raf=0;
  const update=()=>{
   raf=0;const r=img.getBoundingClientRect();if(!r.width||!r.height)return;
   const scale=Math.max(r.width/BG_W,r.height/BG_H),cw=BG_W*scale,ch=BG_H*scale;
   const p=getComputedStyle(img).objectPosition.match(/-?[\d.]+%/g)||[];
   const px=p.length?parseFloat(p[0]!)/100:0,py=p.length>1?parseFloat(p[1]!)/100:.5;
   setBox({left:r.left+(r.width-cw)*px,top:r.top+(r.height-ch)*py,width:cw,height:ch});
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
  schedule();window.addEventListener('resize',schedule);
  const ro=new ResizeObserver(schedule);ro.observe(img);
  return()=>{window.removeEventListener('resize',schedule);ro.disconnect();if(raf)cancelAnimationFrame(raf)};
 },[imgRef]);
 if(!box)return null;
 return <svg aria-hidden="true" className="pointer-events-none" style={{position:'fixed',left:box.left,top:box.top,width:box.width,height:box.height,zIndex:2}} viewBox={`0 0 ${BG_W} ${BG_H}`}>
  <defs>
   <linearGradient id="horizonFade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset=".22" stopColor="#fff" stopOpacity=".4"/>
    <stop offset=".5" stopColor="#fff" stopOpacity="1"/><stop offset=".78" stopColor="#fff" stopOpacity=".4"/><stop offset="1" stopColor="#fff" stopOpacity="0"/>
   </linearGradient>
   <mask id="horizonMask"><rect width={BG_W} height={BG_H} fill="url(#horizonFade)"/></mask>
   {[
    ['glowHalo',55],['glowOuter',24],['glowMid',9],['glowRim',3]
   ].map(([id,std])=><filter key={id} id={id as string} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation={std}/></filter>)}
  </defs>
  <g mask="url(#horizonMask)">
   {[
    [360,'rgba(70,150,255,.30)','glowHalo'],
    [150,'rgba(110,185,255,.55)','glowOuter'],
    [50,'rgba(160,215,255,.80)','glowMid'],
    [11,'rgba(232,246,255,.95)','glowRim']
   ].map(([strokeWidth,stroke,filter])=>
    <circle key={filter as string} cx={PLANET.cx} cy={PLANET.cy} r={PLANET.r} fill="none" stroke={stroke as string} strokeWidth={strokeWidth as number} filter={`url(#${filter})`}/>
   )}
  </g>
 </svg>
};

const RegisterPage=()=>{
 const navigate=useNavigate(),{theme}=useThemeStore(),{showLoader,hideLoader}=useGlobalLoader();
 const bgRef=useRef<HTMLImageElement>(null),submitLock=useRef(false);
 const[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState('');
 const[showPassword,setShowPassword]=useState(false),[showConfirmPassword,setShowConfirmPassword]=useState(false);
 const[captchaToken,setCaptchaToken]=useState<string|null>(null),[isSubmitting,setIsSubmitting]=useState(false);
 const isLight=theme==='light';
 const RECAPTCHA_SITE_KEY=import.meta.env.VITE_RECAPTCHA_SITE_KEY as string|undefined;

 const taglineWords=['Smart','journeys.','Seamless','experiences.','Every','time.'];
 const typingPhrases=['Travel with confidence.','Your journey, simplified.','Fly beyond boundaries.'];
 const[visibleWords,setVisibleWords]=useState(0),[fadePhase,setFadePhase]=useState<'in'|'out'>('in'),[phraseIndex,setPhraseIndex]=useState(0);
 const WORD_DELAY=300,HOLD_DURATION=2000,FADE_OUT_DURATION=600;

 useEffect(()=>{
  if(isLight)return;
  let active=true;const phrase=typingPhrases[phraseIndex],words=phrase.split(' '),timers:ReturnType<typeof setTimeout>[]=[];
  setVisibleWords(0);setFadePhase('in');
  words.forEach((_,i)=>timers.push(setTimeout(()=>active&&setVisibleWords(i+1),(i+1)*WORD_DELAY)));
  const total=words.length*WORD_DELAY;
  timers.push(setTimeout(()=>active&&setFadePhase('out'),total+HOLD_DURATION));
  timers.push(setTimeout(()=>active&&setPhraseIndex(p=>(p+1)%typingPhrases.length),total+HOLD_DURATION+FADE_OUT_DURATION));
  return()=>{active=false;timers.forEach(clearTimeout)};
 },[phraseIndex,isLight]);

 useEffect(()=>{
  if(!isLight)return;
  let active=true;const timers:ReturnType<typeof setTimeout>[]=[];
  const run=()=>{
   if(!active)return;setVisibleWords(0);setFadePhase('in');
   taglineWords.forEach((_,i)=>timers.push(setTimeout(()=>active&&setVisibleWords(i+1),(i+1)*300)));
   const total=taglineWords.length*300+800;
   timers.push(setTimeout(()=>active&&setFadePhase('out'),total));
   timers.push(setTimeout(()=>active&&run(),total+600));
  };
  run();return()=>{active=false;timers.forEach(clearTimeout)};
 },[isLight]);

 const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();if(isSubmitting||submitLock.current)return;
  if(!captchaToken){
   toast({kind:'error',code:403,title:'CAPTCHA Required',message:'Please verify you are not a robot first.'});return;
  }
  submitLock.current=true;const trimmedName=name.trim(),trimmedEmail=email.trim();setIsSubmitting(true);showLoader(GLOBAL_SIGNUP_MESSAGES);
  try{
   const res=await signupUser({name:trimmedName,email:trimmedEmail,password,confirmPassword,captcha:captchaToken});
   if(res.success){
    hideLoader();toast({kind:'success',code:201,title:'Created',message:res.message||'Account created! Redirecting…'});navigate('/login');
   }else{
    hideLoader();toast({kind:'error',code:400,title:'Signup Failed',message:res.message||'Could not create account.'});
   }
  }catch(err:unknown){
   hideLoader();
   const x=err instanceof ApiError?{
    message:err.message,
    title:err.status===0?'Network Error':err.status===408?'Request Timed Out':err.status===400?'Bad Request':err.status===401||err.status===403?'Unauthorized':err.status===409?'Conflict':'Server Error',
    code:err.status===0?0:[400,401,403,409].includes(err.status)?err.status:500
   }:{message:'Something went wrong. Please try again.',title:'Server Error',code:500};
   toast({kind:'error',code:x.code,title:x.title,message:x.message});
  }finally{submitLock.current=false;setIsSubmitting(false)}
 };

 const goldenDots=[
  ['14%','32%',0,'2.2s'],['16%','34%','.3s','2.5s'],['13%','33%','.6s','2.3s'],['18%','32%','.9s','2.7s'],['15%','35%','1.2s','2.1s'],['17%','31%','.2s','2.6s'],['12%','34%','1.5s','2.4s'],['19%','33%','.4s','2.8s'],['20%','35%','.7s','2.2s'],['11%','32%','1.1s','2.5s'],
  ['29%','24%','.8s','2.4s'],['30%','22%','.1s','2.7s'],['28%','23%','1.4s','2.3s'],['31%','25%','.5s','2.6s'],['27%','21%','1s','2.2s'],['32%','23%','.3s','2.5s'],
  ['41%','32%','.2s','2.3s'],['43%','31%','.6s','2.6s'],['40%','33%','1.1s','2.4s'],['44%','32%','.4s','2.7s'],['42%','30%','.8s','2.2s'],['45%','33%','1.3s','2.5s'],['39%','31%','.7s','2.8s'],['44%','34%','1s','2.3s'],
  ['43%','25%','.5s','2.5s'],['44%','23%','.9s','2.3s'],['42%','24%','1.3s','2.6s'],['45%','22%','.2s','2.4s'],['41%','26%','.7s','2.2s'],
  ['48%','28%','.4s','2.7s'],['49%','27%','1.2s','2.3s'],['47%','29%','.8s','2.5s'],
  ['54%','24%','.1s','2.4s'],['55%','22%','1.5s','2.6s'],['53%','23%','.6s','2.3s'],['56%','21%','1.1s','2.5s'],['52%','25%','.3s','2.7s'],
  ['61%','28%','.5s','2.2s'],['63%','27%','.9s','2.6s'],['60%','29%','1.3s','2.4s'],['64%','28%','.2s','2.7s'],['62%','26%','.7s','2.3s'],['65%','29%','1s','2.5s'],['59%','27%','.4s','2.8s'],['66%','28%','1.4s','2.2s'],
  ['67%','24%','.3s','2.5s'],['68%','23%','1.6s','2.7s'],['66%','25%','.8s','2.3s'],
  ['71%','21%','.4s','2.6s'],['72%','20%','1s','2.4s'],['70%','22%','1.5s','2.2s'],
  ['22%','36%','.5s','2.5s'],['35%','27%','1.3s','2.8s'],['48%','30%','.8s','2.3s'],['53%','26%','.2s','2.6s'],['59%','25%','1.5s','2.4s'],['38%','26%','.9s','2.7s'],['46%','27%','1.7s','2.2s']
 ];

 const fieldClass=`h-full flex-1 bg-transparent text-[14px] font-inherit leading-[32px] outline-none ${isLight?'text-[#1e293b] placeholder:text-[#94a3b8]':'text-[#dde6f0] placeholder:text-[rgba(140,170,210,0.4)]'}`;
 const labelClass=`mb-1 block text-[12px] font-medium ${isLight?'text-[#475569]':'text-[rgba(200,215,235,.7)]'}`;
 const iconClass=`mr-3 h-[18px] w-[18px] shrink-0 ${isLight?'text-[#94a3b8]':'text-[rgba(140,170,210,.45)]'}`;

 const Eye=({show,setShow}:{show:boolean;setShow:(v:boolean)=>void})=><button type="button" onClick={()=>setShow(!show)} className={`absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 transition-colors duration-200 ${isLight?'text-[#94a3b8] hover:text-[#475569]':'text-[rgba(140,170,210,.45)] hover:text-[rgba(170,200,240,.8)]'}`} aria-label={show?'Hide password':'Show password'}>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">{show?<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>:<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="m14.12 14.12-4.24-4.24"/><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}</svg>
 </button>;

 const fields=[
  {label:'Name',value:name,set:setName,type:'text',placeholder:'Enter your name',icon:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>},
  {label:'Email address',value:email,set:setEmail,type:'email',placeholder:'Enter your email',icon:<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></>}
 ];

 return <>
 <style>{`
 @keyframes goldenSpin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
 @keyframes dotPulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
 .input-golden-wrapper{position:relative;border-radius:10px;padding:1.5px;overflow:hidden;background:rgba(80,130,200,.18);transition:box-shadow .3s}
 .input-golden-wrapper:focus-within{background:rgba(80,150,240,.35);box-shadow:0 0 0 3px rgba(50,120,220,.1)}
 .input-golden-inner{position:relative;z-index:1;display:flex;align-items:center;height:32px;background:#0c1630;border-radius:9px;padding:0 14px}
 .light-theme .input-golden-inner{background:#f1f5f9}
 .light-theme .input-golden-wrapper{background:rgba(37,99,235,.1);border:1px solid rgba(0,0,0,.1)}
 .card-golden-wrapper{position:relative;border-radius:18px;padding:1.5px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.4),0 0 6px rgba(218,165,32,.3),0 0 16px rgba(218,165,32,.16),0 0 32px rgba(218,165,32,.06)}
 .card-golden-wrapper:before{content:'';position:absolute;inset:-50%;z-index:0;background:conic-gradient(from 0deg,transparent 0deg,transparent 55deg,#b8860b 75deg,#d4af37 95deg,#ffd700 120deg,#fff1a8 145deg,#ffd700 165deg,#d4af37 190deg,#b8860b 210deg,#8b6914 230deg,transparent 250deg,transparent 360deg);animation:goldenSpin 4s linear infinite;pointer-events:none}
 .card-golden-inner{position:relative;z-index:1;border-radius:17px;background:rgba(10,20,45,.95);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:inset 0 0 6px rgba(218,165,32,.2),inset 0 0 14px rgba(218,165,32,.1)}
 .light-theme .card-golden-inner{background:rgba(255,255,255,.97);box-shadow:inset 0 0 6px rgba(218,165,32,.1),inset 0 0 14px rgba(218,165,32,.05)}
 .light-theme .card-golden-wrapper{box-shadow:0 20px 60px rgba(0,0,0,.1),0 0 6px rgba(218,165,32,.2),0 0 16px rgba(218,165,32,.1)}
 .earth-dot{position:absolute;border-radius:50%;pointer-events:none;animation:dotPulse var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s)}
 .light-theme .earth-dot{opacity:.3}
 @media(prefers-reduced-motion:reduce){.card-golden-wrapper:before,.earth-dot{animation:none}.earth-dot{opacity:.5}}
 `}</style>

 <div className={`relative flex flex-col lg:flex-row h-auto min-h-screen lg:h-screen w-full overflow-y-auto lg:overflow-hidden font-[Segoe_UI,Roboto,Helvetica_Neue,Arial,sans-serif] ${isLight?'bg-transparent':'bg-[#060d1a]'}`}>
  <img ref={bgRef} src={bg2} alt="" className={`pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-full w-full object-cover object-center lg:object-left ${isLight?'hidden':''}`}/>
  <img src={lightBg} alt="" className={`pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-full w-full object-cover object-center lg:object-left ${isLight?'':'hidden'}`}/>
  {!isLight&&<HorizonGlow imgRef={bgRef}/>}
  {!isLight&&<div className="pointer-events-none absolute inset-0 z-[3]">{goldenDots.map((d,i)=><div key={i} className="earth-dot" style={{left:d[0],bottom:d[1],width:'2px',height:'2px',background:'radial-gradient(circle,rgba(255,223,100,1) 0%,rgba(255,200,50,.9) 25%,rgba(255,180,0,.5) 55%,transparent 80%)',boxShadow:'0 0 4px rgba(255,223,100,.9),0 0 8px rgba(255,200,50,.6),0 0 12px rgba(255,180,0,.3)','--delay':d[2] as string,'--dur':d[3] as string} as React.CSSProperties}/>)}</div>}

 

  <div className="relative z-[5] flex min-h-[auto] lg:min-h-screen flex-1 flex-col px-6 lg:px-[50px] pb-10 lg:pb-[50px] pt-8 lg:pt-10">
   <div className="relative z-10 flex flex-col items-start">
    <div className="relative flex h-[54px] w-[54px] items-center justify-center">
     <div className="absolute inset-[-4px] rounded-full border-[2px] border-[rgba(40,140,255,.6)] shadow-[0_0_16px_rgba(40,140,255,.3),0_0_32px_rgba(40,140,255,.15),inset_0_0_14px_rgba(40,140,255,.1)]"/>
     <div className="absolute inset-[-10px] z-0 rounded-full bg-[radial-gradient(circle,rgba(40,140,255,.12)_0%,transparent_70%)]"/>
     <img src={logo} alt="Akbar Bizvoy Logo" className="h-[44px] w-auto"/>
    </div>
    <p className={`m-0 mt-1 text-[10px] font-semibold tracking-[5px] uppercase ${isLight?'text-[#64748b]':'text-[rgba(200,215,235,.65)]'}`}>AKBAR BIZVOY</p>
   </div>

   <div className={`relative z-10 max-w-[520px] pl-2 ${isLight?'flex-1 flex flex-col justify-end pb-18':'mt-6'}`}>
    {isLight&&<div className="flex items-center gap-1.5 mb-3"><span className="h-[3px] w-6 rounded-full bg-[#2563eb]"/><span className="h-[3px] w-3 rounded-full bg-[#f59e0b]"/></div>}
    {isLight?<h2 className="m-0 text-[28px] lg:text-[40px] font-bold leading-[1.2] text-[#1e293b]">
     {taglineWords.map((word,i)=><span key={i}><span style={{opacity:fadePhase==='out'?0:i<visibleWords?1:0,transition:`opacity ${fadePhase==='out'?.5:.3}s ease-in-out`,color:word==='Seamless'?'#2563eb':undefined}}>{word}</span>{word==='Seamless'&&<br/>}{i<taglineWords.length-1&&word!=='Seamless'&&' '}</span>)}
    </h2>:<div className="relative z-10 mt-4 max-w-[500px]">
     <div className="flex flex-wrap items-center" style={{minHeight:50}}>
      {typingPhrases[phraseIndex].split(' ').map((word,i)=><span key={`${phraseIndex}-${i}`} className="text-[24px] lg:text-[36px] font-bold leading-[1.15]" style={{color:word.endsWith('.')?'#3b9cff':'#fff',opacity:fadePhase==='out'?0:i<visibleWords?1:0,transition:`opacity ${fadePhase==='out'?FADE_OUT_DURATION:300}ms ease-in-out`,marginRight:10}}>{word}</span>)}
     </div>
     <div className="mt-[14px] flex items-center gap-[3px]">{['#00AEEF','#8CC63F','#F5821F','#E4007F'].map(c=><span key={c} className="h-[3px] w-9 rounded-full lg:w-10" style={{background:c}}/>)}</div>
     <p className="m-0 mt-[14px] text-[14px] lg:text-[16px] leading-[1.65] text-[rgba(170,195,225,.6)]">Smart journeys. Seamless<br/>experiences. Every time.</p>
    </div>}
   </div>

   {!isLight&&<div className="flex-1"/>}

   <div className="relative z-10 flex flex-wrap gap-4 lg:gap-9 pb-2 mt-2">
    {[
     ['Trusted','Since 1987','bg-[#e0edff]','text-[#2563eb]',<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></>],
     ['Global','Presence','bg-[#e0edff]','text-[#2563eb]',<><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" y1="12" x2="22" y2="12"/></>],
     ['Seamless','Journeys','bg-[#fff3e0]','text-[#f59e0b]',<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>],
     ['24/7','Support','bg-[#fff3e0]','text-[#f59e0b]',<><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></>]
    ].map(([title,sub,bg,ic,icon],i)=><div key={i} className="flex items-center gap-3">
     <div className={`flex items-center gap-[3.5px] rounded-[12px] border ${isLight?'border-[rgba(0,0,0,.06)]':'border-[rgba(50,120,220,.12)]'} ${isLight?bg as string:i<2?'bg-[rgba(50,120,220,.15)]':'bg-[rgba(212,175,55,.15)]'}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`m-[10px] h-[22px] w-[22px] ${isLight?ic as string:i<2?'text-[#4aa3ff]':'text-[#f0c265]'}`}>{icon}</svg>
     </div>
     <div className="flex flex-col"><span className={`text-[13px] font-semibold leading-[1.2] ${isLight?'text-[#1e293b]':'text-white'}`}>{title}</span><span className={`text-[12px] leading-[1.3] ${isLight?'text-[#64748b]':'text-[rgba(170,195,225,.5)]'}`}>{sub}</span></div>
    </div>)}
   </div>
  </div>

  <div className="relative z-10 flex w-full lg:w-[500px] min-w-0 lg:min-w-[440px] translate-x-0 lg:-translate-x-10 items-center justify-center px-6 lg:px-11 py-8 lg:py-10">
   <div className="card-golden-wrapper relative w-full max-w-[400px]">
    <div className="card-golden-inner px-5 lg:px-8 py-[10px] pb-[8px] text-center">
     <div className="mb-0.5 flex justify-center"><div className="relative flex h-[48px] w-[48px] items-center justify-center">
      <div className="absolute inset-[-5px] rounded-full border-[2.5px] border-[rgba(40,140,255,.6)] shadow-[0_0_20px_rgba(40,140,255,.3),0_0_40px_rgba(40,140,255,.15),inset_0_0_20px_rgba(40,140,255,.1)]"/>
      <div className="absolute inset-[-12px] z-0 rounded-full bg-[radial-gradient(circle,rgba(40,140,255,.12)_0%,transparent_70%)]"/>
      <img src={logo} alt="Akbar Bizvoy Logo" className="h-[38px] w-auto"/>
     </div></div>

     <p className={`m-0 mb-0.5 text-center text-[12px] font-semibold tracking-[6px] uppercase ${isLight?'text-[#64748b]':'text-[rgba(200,215,235,.65)]'}`}>AKBAR BIZVOY</p>
     <h1 className={`m-0 text-[22px] font-bold ${isLight?'text-[#1e293b]':'text-white'}`}>Create <span className="text-[#2563eb]">account.</span></h1>
     <p className={`m-0 mb-2 text-[12px] ${isLight?'text-[#64748b]':'text-[rgba(170,195,225,.55)]'}`}>Sign up to continue to your account.</p>

     <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 text-left">
      {fields.map((f)=><div key={f.label}>
       <label className={labelClass}>{f.label}</label>
       <div className="input-golden-wrapper"><div className="input-golden-inner">
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
        <input type={f.type} value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} required className={fieldClass}/>
       </div></div>
      </div>)}

      {[
       ['Password',password,setPassword,showPassword,setShowPassword,'Create a password',<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>],
       ['Confirm Password',confirmPassword,setConfirmPassword,showConfirmPassword,setShowConfirmPassword,'Re-enter your password',<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><path d="M12 15v3"/></>]
      ].map(([label,value,set,show,setShow,placeholder,icon])=><div key={label as string}>
       <label className={labelClass}>{label as string}</label>
       <div className="input-golden-wrapper"><div className="input-golden-inner relative">
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icon as React.ReactNode}</svg>
        <input type={show?'text':'password'} value={value as string} onChange={e=>(set as React.Dispatch<React.SetStateAction<string>>)(e.target.value)} placeholder={placeholder as string} required className={fieldClass}/>
        <Eye show={show as boolean} setShow={setShow as (v:boolean)=>void}/>
       </div></div>
      </div>)}

      <div className="flex w-full justify-center overflow-hidden">
       {RECAPTCHA_SITE_KEY?<ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} theme={isLight?'light':'dark'} onChange={setCaptchaToken} onExpired={()=>setCaptchaToken(null)} onErrored={()=>setCaptchaToken(null)}/>:<span className="text-[12px] text-[#dc2626]">reCAPTCHA is not configured.</span>}
      </div>

      <button type="submit" disabled={isSubmitting} className="mt-0.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none bg-gradient-to-br from-[#1565e0] via-[#1d7bf5] to-[#2b8df8] py-[9px] text-[14px] font-semibold tracking-[.3px] font-inherit text-white shadow-[0_4px_20px_rgba(25,100,230,.3),0_1px_3px_rgba(25,100,230,.2)] transition-all duration-250 hover:-translate-y-px hover:from-[#1d75f0] hover:via-[#2588ff] hover:to-[#3598ff] hover:shadow-[0_6px_28px_rgba(25,100,230,.4),0_2px_6px_rgba(25,100,230,.25)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[16px] w-[16px]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>
       {isSubmitting?'Creating Account…':'Create Account'}
      </button>

      <p className={`m-0 mt-1 text-center text-[13px] ${isLight?'text-[#64748b]':'text-[rgba(170,195,225,.5)]'}`}>
       Already have an account? <button type="button" onClick={()=>navigate('/login')} className={`font-semibold no-underline cursor-pointer border-none bg-transparent p-0 text-[13px] transition-colors duration-200 hover:underline ${isLight?'text-[#2563eb] hover:text-[#1d4ed8]':'text-[#3b9cff] hover:text-[#6bb3ff]'}`}>Sign in</button>
      </p>
     </form>
    </div>
   </div>
  </div>
 </div>
 </>;
};

export default RegisterPage;