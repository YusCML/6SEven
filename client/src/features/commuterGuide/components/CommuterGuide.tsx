import commuterHero from "@/assets/commuterPage/modern_bus.jpg";
import commuterPlanningRoute from "@/assets/commuterPage/commuter_planning_route.jpg";
import busRouteMap from "@/assets/commuterPage/busRouteMap.jpg";
import railwayMap from "@/assets/commuterPage/railway.jpg";

const transportOptions = [
  {
    Icon: RouteIcon,
    title: "Getting Started",
    text: "New to RUTA? Learn the basics of riding with us.",
    tone: "bg-blue-50 text-blue-600",
  },
  {
    Icon: TicketIcon,
    title: "Fare Info",
    text: "Pricing passes, and contactless payment options.",
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Safety Tips",
    text: "How we keep you safe during your journey.",
    tone: "bg-amber-50 text-amber-600",
  },
  {
    Icon: MapIcon,
    title: "Route Maps",
    text: "Detailed system maps and station directories.",
    tone: "bg-violet-50 text-violet-600",
  },
];

const fares = [
  {
    Icon: TapPhoneIcon,
    title: "Tap & Go",
    fare: "$2.50",
    label: "per ride",
    text: "The easiest way to pay. Simply tap your contactless credit card or mobile wallet at any reader.",
  },
  {
    Icon: RutaPassIcon,
    title: "RUTA Pass",
    fare: "$75.00",
    label: "monthly",
    text: "For frequent riders. Purchase a digital or physical RUTA pass for unlimited rides within zones.",
  },
  {
    Icon: StudentFareIcon,
    title: "Reduced Fares",
    fare: "$1.25",
    label: "per ride",
    text: "Available for students, seniors (65+), and persons with disabilities upon verification.",
  },
];

export default function CommuterGuide() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 font-sans text-slate-900 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="relative min-h-64 overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
          <img
            src={commuterHero.src}
            alt="Bus at the terminal"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/25 to-transparent" />

          <div className="relative flex min-h-64 max-w-md flex-col justify-center p-7 text-white sm:p-10">
            <span className="mb-3 w-fit rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold tracking-widest">
              OFFICIAL GUIDE
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Master the RUTA Network
            </h1>

            <p className="mt-3 text-base leading-6 text-slate-100">
              Everything you need to know about fares, routes, safety, and
              navigating the city with confidence.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {transportOptions.map((item) => (
            <article
              key={item.title}
              className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-100"
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-md ${item.tone}`}
              >
                <item.Icon className="h-5 w-5" />
              </span>

              <h2 className="mt-4 text-base font-bold">{item.title}</h2>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                {item.text}
              </p>
            </article>
          ))}
        </section>

        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="mb-3 border-l-4 border-blue-600 pl-2 text-sm font-bold uppercase tracking-wider text-blue-700">
              Getting Started
            </p>

            <div className="mt-5 space-y-5">
              <GuideStep
                number="1"
                title="Plan Your Trip"
                text="Use our real-time trip planner or mobile app to find the quickest route to your destination. Enter your starting point and goal to see available transport options."
              />
              <GuideStep
                number="2"
                title="Arrive Early"
                text="We recommend arriving at your stop or station at least 5 minutes before the scheduled departure. Real-time updates are available on every platform display."
              />
              <GuideStep
                number="3"
                title="Boarding & Exiting"
                text="Please allow passengers to exit before boarding. Once inside, move to the center of the vehicle to make room for others. Tap off when exiting to ensure correct fare calculation."
              />
            </div>
          </div>

          <img
            src={commuterPlanningRoute.src}
            alt="Commuters planning a route"
            className="h-64 w-full rounded-xl object-cover shadow-sm lg:h-72"
          />
        </section>

        <section className="rounded-2xl bg-[#10182b] p-7 text-white shadow-sm sm:p-9">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Simple, Fair Fares
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {fares.map((fare, index) => (
              <article
                key={fare.title}
                className={`flex min-h-[290px] flex-col rounded-[24px] border border-slate-500/70 p-8 ${
                  index === 2
                    ? "bg-gradient-to-br from-[#2d374d] to-[#314f92]"
                    : "bg-gradient-to-br from-[#293348] to-[#202a3d]"
                }`}
              >
                <fare.Icon className="h-9 w-9 text-[#3b82f6]" />

                <h3 className="mt-6 text-[22px] font-extrabold tracking-tight">
                  {fare.title}
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-slate-300">
                  {fare.text}
                </p>

                <div className="mt-auto flex items-baseline gap-2 pt-6">
                  <span className="text-[27px] font-extrabold tracking-tight">
                    {fare.fare}
                  </span>
                  <span className="text-sm text-slate-400">{fare.label}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Network Maps</h2>
              <p className="mt-1 text-sm text-slate-500">
                Explore our interconnected rail and bus networks across the
                city.
              </p>
            </div>

            <button className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm">
              <DownloadIcon className="h-4 w-4" />
              Download PDF Maps
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <figure className="relative overflow-hidden rounded-lg">
              <img
                src={railwayMap.src}
                alt="System rail map"
                className="h-60 w-full object-cover"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow">
                System Rail Map
              </figcaption>
            </figure>

            <figure className="relative overflow-hidden rounded-lg">
              <img
                src={busRouteMap.src}
                alt="Metro bus network map"
                className="h-60 w-full object-cover"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow">
                Metro Bus Network
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="grid gap-7 md:grid-cols-[1.1fr_2fr]">
            <div>
              <h2 className="text-xl font-bold">Your Safety is Our Priority</h2>

              <div className="mt-4 flex gap-3 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  We maintain a fleet-wide surveillance system and 24/7
                  security dispatch to ensure every journey is safe.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-900">
                  <PhoneIcon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Emergency Line
                  </p>
                  <p className="mt-0.5 text-lg font-extrabold tracking-tight text-slate-900">
                    1-800-RUTA-SEC
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Safety
                title="CCTV Monitoring"
                text="All stations and vehicles are equipped with high-definition cameras monitored 24/7."
              />
              <Safety
                title="Well-Lit Areas"
                text="We maintain high-intensity lighting in all boarding zones and walkway areas."
              />
              <Safety
                title="Trained Police"
                text="Uniformed and plainclothes officers patrol our network at all times."
              />
              <Safety
                title="Passenger Assistance"
                text="Yellow call boxes are located on every platform for immediate assistance."
              />
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-8 text-center">
          <p className="text-sm text-slate-400">Was this guide helpful?</p>

          <div className="mt-3 flex justify-center gap-3">
            <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm">
              Yes, it was
            </button>
            <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm">
              Needs more info
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}

function GuideStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
        {number}
      </span>

      <div>
        <h3 className="text-base font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function Safety({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
        {title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

type IconProps = { className?: string };

function IconFrame({
  children,
  className,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function RouteIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M5 19V5l14 7-14 7Z" />
    </IconFrame>
  );
}

function TicketIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M5 7a2 2 0 0 0 0 4v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0 0-4V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2Z" />
      <path d="M9 7v10" />
    </IconFrame>
  );
}

function ShieldCheckIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M12 3 5 6v5c0 5 3.1 8.3 7 10 3.9-1.7 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </IconFrame>
  );
}

function MapIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15M15 6v15" />
    </IconFrame>
  );
}

function DownloadIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
    </IconFrame>
  );
}

function AlertIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M12 3 2.8 20h18.4L12 3Z" />
      <path d="M12 9v4m0 3h.01" />
    </IconFrame>
  );
}

function PhoneIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M5 4h3l2 5-2 1.5a14 14 0 0 0 5.5 5.5L15 14l5 2v3c0 1.1-.9 2-2 2C10.8 21 3 13.2 3 6c0-1.1.9-2 2-2Z" />
    </IconFrame>
  );
}

function TapPhoneIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <path d="M10 18.5h4" />
    </IconFrame>
  );
}

function RutaPassIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="8" cy="11" r="1.5" />
      <path d="M5.5 15c.7-1.5 4.3-1.5 5 0M14 10h4m-4 3h4" />
    </IconFrame>
  );
}

function StudentFareIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="m3 8.5 9-4 9 4-9 4-9-4Z" />
      <path d="M7 10.3V15c2.4 2.1 7.6 2.1 10 0v-4.7" />
      <path d="M20 10v5" />
    </IconFrame>
  );
}