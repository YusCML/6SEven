import commuterHero from "@/assets/commuterPage/modern_bus.jpg";
import commuterPlanningRoute from "@/assets/commuterPage/commuter_planning_route.jpg";
import busRouteMap from "@/assets/commuterPage/busRouteMap.jpg";
import railwayMap from "@/assets/commuterPage/railway.jpg";

const transportOptions = [
  { Icon: RouteIcon, title: "Getting Started", text: "How to plan your trip before you go", tone: "bg-blue-50 text-blue-600" },
  { Icon: TicketIcon, title: "Fare Info", text: "Cards, jeepneys, and contactless options", tone: "bg-emerald-50 text-emerald-600" },
  { Icon: ShieldCheckIcon, title: "Safety Tips", text: "Stay alert, stay safe on your journey", tone: "bg-amber-50 text-amber-600" },
  { Icon: MapIcon, title: "Route Maps", text: "Discover routes and connect around the city", tone: "bg-violet-50 text-violet-600" },
];

const fares = [
  { Icon: CardIcon, title: "Tap & Go", fare: "$2.50", text: "Tap on entry with your stored-value card. Transfer discounts may apply." },
  { Icon: TicketIcon, title: "RUTA Pass", fare: "$7.50", text: "For frequent riders. Includes unlimited trips for 24 hours within zones." },
  { Icon: BadgeIcon, title: "Reduced Fares", fare: "$1.25", text: "Available to students, seniors, and people with disabilities. ID verification required." },
];

export default function CommuterGuide() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-3 font-sans text-slate-900 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Replace this with your own hero/rail image. */}
        <section className="relative min-h-64 overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
          <img src={commuterHero.src} alt="Train at a station" className="absolute inset-0 h-full w-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/25 to-transparent" />
          <div className="relative flex min-h-64 max-w-md flex-col justify-center p-6 text-white sm:p-10">
            <span className="mb-3 w-fit rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold tracking-widest">OFFICIAL GUIDE</span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Master the RUTA Network</h1>
            <p className="mt-3 text-sm leading-6 text-slate-100">Everything you need to know about fares, routes, safety, and navigating the city with confidence.</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {transportOptions.map((item) => (
            <article key={item.title} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <span className={`grid h-7 w-7 place-items-center rounded-md ${item.tone}`}><item.Icon className="h-5 w-5" /></span>
              <h2 className="mt-3 text-sm font-bold">{item.title}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="grid items-center gap-7 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="mb-2 border-l-4 border-blue-600 pl-2 text-xs font-bold uppercase tracking-wider text-blue-700">Getting Started</p>
            <h2 className="text-2xl font-bold">Plan Your Trip</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Use our real-time trip planner or mobile app to find the quickest route to your destination. Enter your starting point and goal to see available transport options.</p>
            <div className="mt-5 space-y-4">
              <div className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">1</span><div><h3 className="text-sm font-bold">Arrive Early</h3><p className="mt-1 text-xs leading-5 text-slate-500">We recommend arriving at your stop or station at least 5 minutes before your scheduled departure.</p></div></div>
              <div className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">2</span><div><h3 className="text-sm font-bold">Boarding & Exiting</h3><p className="mt-1 text-xs leading-5 text-slate-500">Please allow passengers to exit before boarding. One inside, move to the center of the vehicle to make room for others.</p></div></div>
            </div>
          </div>
          <img src={commuterPlanningRoute.src} alt="Commuters planning a route" className="h-64 w-full rounded-xl object-cover shadow-sm lg:h-72" />
        </section>

        <section className="rounded-2xl bg-[#102246] p-5 text-white shadow-sm sm:p-7">
          <h2 className="text-xl font-bold">Simple, Fair Fares</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {fares.map((fare) => (
              <article key={fare.title} className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
                <fare.Icon className="h-5 w-5 text-blue-300" /><h3 className="mt-2 text-sm font-bold">{fare.title}</h3>
                <p className="mt-1 min-h-10 text-xs leading-4 text-slate-300">{fare.text}</p>
                <p className="mt-3 text-lg font-bold">{fare.fare}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold">Network Maps</h2><p className="mt-1 text-xs text-slate-500">Explore our interconnected rail and bus networks across the city.</p></div><button className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm"><DownloadIcon className="h-4 w-4" />Download PDF Maps</button></div>
          <div className="grid gap-4 md:grid-cols-2">
            <figure className="relative overflow-hidden rounded-lg"><img src={railwayMap.src} alt="System map" className="h-56 w-full object-cover" /><figcaption className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold shadow">System Rail Map</figcaption></figure>
            <figure className="relative overflow-hidden rounded-lg"><img src={busRouteMap.src} alt="Bus route map" className="h-56 w-full object-cover" /><figcaption className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold shadow">Metro Bus Network</figcaption></figure>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[1.1fr_2fr]"><div><h2 className="text-lg font-bold">Your Safety is Our Priority</h2><div className="mt-4 flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800"><AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />In case of emergency, use the red emergency intercom or contact station staff immediately.</div><p className="mt-4 flex items-center gap-2 text-sm font-bold"><PhoneIcon className="h-5 w-5" />1-800-RUTA-SEC</p></div><div className="grid gap-4 sm:grid-cols-2"><Safety title="CCTV Monitoring" text="All stations and vehicles are equipped with high-definition cameras." /><Safety title="Well-Lit Areas" text="Personal safety lighting is in place during hours and late-night service." /><Safety title="Trained Police" text="Certified staff and police officers are present on weekends and at key locations." /><Safety title="Passenger Assistance" text="Voice call boxes and trained staff are available for immediate assistance." /></div></div>
        </section>

        <footer className="border-t border-slate-200 py-7 text-center"><p className="text-xs text-slate-400">Was this guide helpful?</p><div className="mt-3 flex justify-center gap-2"><button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs">Yes, it was</button><button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs">Needs more info</button></div></footer>
      </div>
    </main>
  );
}

function Safety({ title, text }: { title: string; text: string }) {
  return <div><h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-800"><ShieldCheckIcon className="h-5 w-5 text-blue-600" />{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>;
}

type IconProps = { className?: string };

function IconFrame({ children, className }: IconProps & { children: any }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>;
}
function RouteIcon({ className }: IconProps) { return <IconFrame className={className}><path d="M5 19V5l14 7-14 7Z" /></IconFrame>; }
function TicketIcon({ className }: IconProps) { return <IconFrame className={className}><path d="M5 7a2 2 0 0 0 0 4v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0 0-4V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2Z" /><path d="M9 7v10" /></IconFrame>; }
function ShieldCheckIcon({ className }: IconProps) { return <IconFrame className={className}><path d="M12 3 5 6v5c0 5 3.1 8.3 7 10 3.9-1.7 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></IconFrame>; }
function MapIcon({ className }: IconProps) { return <IconFrame className={className}><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></IconFrame>; }
function CardIcon({ className }: IconProps) { return <IconFrame className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></IconFrame>; }
function BadgeIcon({ className }: IconProps) { return <IconFrame className={className}><path d="M12 3 15 6l4-.3-.3 4 3 3-3 3 .3 4-4-.3-3 3-3-3-4 .3.3-4-3-3 3-3-.3-4 4 .3 3-3Z" /><path d="m9.5 12 1.6 1.6 3.5-3.5" /></IconFrame>; }
function DownloadIcon({ className }: IconProps) { return <IconFrame className={className}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></IconFrame>; }
function AlertIcon({ className }: IconProps) { return <IconFrame className={className}><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v4m0 3h.01" /></IconFrame>; }
function PhoneIcon({ className }: IconProps) { return <IconFrame className={className}><path d="M5 4h3l2 5-2 1.5a14 14 0 0 0 5.5 5.5L15 14l5 2v3c0 1.1-.9 2-2 2C10.8 21 3 13.2 3 6c0-1.1.9-2 2-2Z" /></IconFrame>; }
