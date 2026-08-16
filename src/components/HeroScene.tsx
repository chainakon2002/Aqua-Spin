import { motion } from 'framer-motion';

export default function HeroScene() {
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-gradient-to-b from-sky-300 to-blue-200">
      {/* Animated Clouds */}
      <motion.div 
        animate={{ x: [0, -1000] }} 
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        className="absolute top-10 left-0 flex gap-32 whitespace-nowrap opacity-70"
      >
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="inline-block">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="white">
              <path d="M20 40 Q0 40 0 20 Q0 0 20 0 Q30 0 35 10 Q50 -10 70 5 Q85 -5 100 10 Q120 10 120 25 Q120 40 100 40 Z" />
            </svg>
          </div>
        ))}
      </motion.div>

      {/* Sun */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full blur-[2px] shadow-[0_0_60px_rgba(253,224,71,0.8)]"
      >
         <div className="absolute inset-0 border-[16px] border-yellow-400 border-dashed rounded-full opacity-50"></div>
      </motion.div>

      {/* Background Mountains */}
      <div className="absolute bottom-16 left-0 right-0 h-40 flex items-end opacity-40">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 100">
           <path d="M0,100 L0,50 Q100,10 200,60 T400,30 T600,70 T850,20 L1000,80 L1000,100 Z" fill="#3b82f6" />
        </svg>
      </div>

      {/* Water and Water Wheel */}
      <div className="absolute bottom-0 right-0 w-[40%] h-32 bg-blue-500 rounded-tl-[100px] border-t-8 border-l-8 border-blue-400 flex items-center justify-center">
         {/* Spinning Water Wheel */}
         <motion.div
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
           className="absolute -top-16 right-16 w-32 h-32 rounded-full border-[12px] border-amber-800 flex items-center justify-center"
         >
            {/* Wheel Spokes */}
            {[0, 45, 90, 135].map(deg => (
               <div key={deg} className="absolute w-full h-2 bg-amber-700" style={{ transform: `rotate(${deg}deg)` }}>
                  {/* Paddles */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-6 bg-amber-600 rounded-sm"></div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-6 bg-amber-600 rounded-sm"></div>
               </div>
            ))}
            <div className="w-6 h-6 rounded-full bg-slate-800 z-10"></div>
         </motion.div>
         {/* Splash */}
         <motion.div 
           animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
           transition={{ repeat: Infinity, duration: 0.5 }}
           className="absolute top-4 right-20 text-blue-200 font-black text-2xl"
         >
           💦
         </motion.div>
      </div>

      {/* Grassy Hill (Foreground) */}
      <div className="absolute bottom-0 left-0 w-[70%] h-40 bg-green-400 rounded-tr-[150px] border-t-8 border-r-8 border-green-500 z-10 shadow-[20px_0_30px_rgba(0,0,0,0.1)]">
        
        {/* Teacher Owl / Mascot */}
        <div className="absolute bottom-12 right-12 flex flex-col items-center">
           {/* Blackboard */}
           <div className="absolute -top-24 -left-16 w-24 h-20 bg-slate-800 border-4 border-amber-700 rounded-lg shadow-lg flex items-center justify-center">
             <span className="text-3xl">💧</span>
             <div className="absolute -bottom-10 left-4 w-1 h-12 bg-amber-700"></div>
             <div className="absolute -bottom-10 right-4 w-1 h-12 bg-amber-700"></div>
           </div>
           
           {/* Teacher Character (Owl) */}
           <motion.div
             animate={{ y: [0, -4, 0] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="relative w-20 h-24 bg-teal-500 rounded-full border-4 border-teal-600 shadow-md flex flex-col items-center justify-center z-10"
           >
              {/* Glasses/Eyes */}
              <div className="flex gap-1 -mt-4">
                 <div className="w-6 h-6 bg-white rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                 </div>
                 <div className="w-6 h-6 bg-white rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                 </div>
              </div>
              {/* Beak */}
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-orange-400 mt-1"></div>
              {/* Belly */}
              <div className="w-12 h-10 bg-teal-300 rounded-t-full mt-2 opacity-50"></div>
              {/* Pointer Stick */}
              <motion.div 
                animate={{ rotate: [-20, 0, -20] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute top-10 -left-6 w-12 h-1 bg-amber-200 origin-right rounded-full border border-amber-400"
              ></motion.div>
           </motion.div>
        </div>

        {/* Students sitting on the floor facing right */}
        <div className="absolute bottom-10 right-56 flex gap-4 sm:gap-6 items-end z-20">
           {/* Student 1: Boy */}
           <div className="relative group flex flex-col items-center">
             <div className="relative flex flex-col items-center z-10">
               {/* Head Profile */}
               <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4 }} className="relative -mr-2">
                 <div className="w-12 h-12 bg-orange-200 rounded-full border-2 border-slate-700 z-10 relative">
                   <div className="absolute top-0 left-0 w-10 h-6 bg-slate-800 rounded-tl-full rounded-tr-full rounded-bl-full"></div>
                   <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full"></div> {/* One eye on right */}
                   <div className="absolute top-7 right-1 w-2 h-1 border-b-2 border-slate-700 rounded-b-full"></div> {/* Smile */}
                 </div>
               </motion.div>
               {/* Body Sitting Profile */}
               <div className="relative flex -mt-1">
                 {/* Torso */}
                 <div className="w-10 h-12 bg-white border-2 border-slate-700 rounded-t-xl z-0 relative">
                   <div className="absolute top-1 right-0 w-2 h-4 bg-sky-800 border-l border-slate-400"></div> {/* Collar */}
                   <div className="absolute top-4 right-1 w-4 h-6 bg-white border-2 border-slate-700 rounded-full rotate-45 origin-top-left"></div> {/* Arm */}
                 </div>
                 {/* Legs extended forward (right) */}
                 <div className="w-10 h-6 bg-sky-800 border-2 border-slate-700 absolute bottom-0 right-[-24px] rounded-r-md"></div>
                 {/* Feet */}
                 <div className="w-4 h-3 bg-slate-800 absolute -bottom-1 right-[-26px] rounded-r-md"></div>
               </div>
             </div>
           </div>

           {/* Student 2: Girl */}
           <div className="relative group flex flex-col items-center">
             <div className="relative flex flex-col items-center z-10">
               {/* Head Profile */}
               <motion.div animate={{ rotate: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 3.5 }} className="relative -mr-2">
                 <div className="w-12 h-12 bg-orange-200 rounded-full border-2 border-slate-700 z-10 relative">
                   <div className="absolute top-0 left-0 w-11 h-6 bg-slate-800 rounded-t-full"></div>
                   <div className="absolute top-2 -left-2 w-4 h-6 bg-slate-800 rounded-full"></div> {/* Pigtail back */}
                   <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full"></div> {/* One eye */}
                   <div className="absolute top-7 right-1 w-2 h-1 border-b-2 border-slate-700 rounded-b-full"></div> {/* Smile */}
                 </div>
               </motion.div>
               {/* Body Sitting Profile */}
               <div className="relative flex -mt-1">
                 {/* Torso */}
                 <div className="w-10 h-12 bg-white border-2 border-slate-700 rounded-t-xl z-0 relative">
                   <div className="absolute top-0 right-1 w-4 h-2 border-b-2 border-slate-700 rounded-b-full"></div> {/* Collar */}
                   <div className="absolute top-4 right-1 w-4 h-6 bg-white border-2 border-slate-700 rounded-full rotate-45 origin-top-left"></div> {/* Arm */}
                 </div>
                 {/* Skirt sitting (right) */}
                 <div className="w-10 h-7 bg-sky-900 border-2 border-slate-700 absolute bottom-0 right-[-24px] rounded-r-lg clip-path-polygon"></div>
                 {/* Legs/Feet */}
                 <div className="w-8 h-3 bg-orange-200 border-t-2 border-b-2 border-r-2 border-slate-700 absolute bottom-0 right-[-32px] rounded-r-sm"></div>
                 <div className="w-4 h-3 bg-slate-800 absolute -bottom-1 right-[-32px] rounded-r-md"></div>
               </div>
             </div>
             {/* Floating thought bubble */}
             <motion.div 
               animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
               transition={{ repeat: Infinity, duration: 3, delay: 1 }}
               className="absolute -top-6 right-2 text-xl z-30"
             >
               💡
             </motion.div>
           </div>
           
           {/* Student 3: Boy */}
           <div className="relative group flex flex-col items-center hidden sm:flex">
             <div className="relative flex flex-col items-center z-10">
               {/* Head Profile */}
               <motion.div animate={{ rotate: [-1, 3, -1] }} transition={{ repeat: Infinity, duration: 4.5 }} className="relative -mr-2">
                 <div className="w-12 h-12 bg-orange-200 rounded-full border-2 border-slate-700 z-10 relative">
                   <div className="absolute top-0 left-0 w-9 h-5 bg-slate-800 rounded-tl-full rounded-tr-full rounded-bl-full"></div>
                   <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                   <div className="absolute top-7 right-1 w-3 h-1 border-b-2 border-slate-700 rounded-b-full"></div>
                 </div>
               </motion.div>
               {/* Body Sitting Profile */}
               <div className="relative flex -mt-1">
                 {/* Torso */}
                 <div className="w-10 h-12 bg-white border-2 border-slate-700 rounded-t-xl z-0 relative">
                   <div className="absolute top-1 right-0 w-2 h-4 bg-sky-800 border-l border-slate-400"></div>
                   <div className="absolute top-4 right-1 w-4 h-6 bg-white border-2 border-slate-700 rounded-full rotate-45 origin-top-left"></div>
                 </div>
                 {/* Legs extended forward */}
                 <div className="w-10 h-6 bg-sky-800 border-2 border-slate-700 absolute bottom-0 right-[-24px] rounded-r-md"></div>
                 {/* Feet */}
                 <div className="w-4 h-3 bg-slate-800 absolute -bottom-1 right-[-26px] rounded-r-md"></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
