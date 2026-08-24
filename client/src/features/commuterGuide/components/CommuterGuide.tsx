import { useState } from "react";
import { jsPDF } from "jspdf";
import Image from "next/image";

import commuterHero from "@/assets/commuterPage/modern_bus.jpg";
import commuterPlanningRoute from "@/assets/commuterPage/commuter_planning_route.jpg";
import busRouteMap from "@/assets/commuterPage/busRouteMap.jpg";
import railwayMap from "@/assets/commuterPage/railway.jpg";

const transportOptions = [
  {
    Icon: RouteIcon,
    title: "Getting Started",
    text: "New to Iloilo routes? Start with how to read a jeepney signboard.",
    tone: "bg-slate-100 text-slate-900",
  },
  { 
    Icon: TicketIcon,
    title: "Fare Info",
    text: "Current jeepney, tricycle and taxi rates, plus who gets a discount.",
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Safety Tips",
    text: "Practical habits for terminals, night rides and rainy season.",
    tone: "bg-amber-50 text-amber-600",
  },
  {
    Icon: MapIcon,
    title: "Route Maps",
    text: "Which route code goes where, and where the main terminals are.",
    tone: "bg-violet-50 text-violet-600",
  },
];

const hotlines = [
  { label: "National Emergency", number: "911" },
  { label: "Iloilo City Police", number: "(033) 337 3801" },
  { label: "City Disaster Office", number: "(033) 336 8888" },
  { label: "LTFRB Region VI", number: "(033) 320 4747" },
  { label: "Iloilo City Hall Trunkline", number: "(033) 337 1122" },
];

const fares = [
  {
    Icon: TapPhoneIcon,
    title: "Jeepney",
    fare: "₱13",
    label: "first 4 km",
    text: "The backbone of the city. Add roughly ₱1.80 per kilometre after the first four. Cash only — bring small bills.",
  },
  {
    Icon: EBusIcon,
    title: "Modern PUV",
    fare: "₱15",
    label: "first 4 km",
    text: "Air-conditioned e-jeepneys on the modernised routes. Slightly higher base fare, fixed stops, and you board at the rear.",
  },
  {
    Icon: BusIcon,
    title: "Provincial Bus",
    fare: "₱50+",
    label: "varies by town",
    text: "Leaves from Tagbak and Molo terminals for towns outside the city. Fare depends on distance; pay the conductor on board.",
  },
  {
    Icon: RutaPassIcon,
    title: "Tricycle",
    fare: "₱25",
    label: "short trip",
    text: "Best for short hops inside a district or the last stretch home. Agree on the fare before boarding, especially off the usual loop.",
  },
  {
    Icon: TaxiIcon,
    title: "Taxi",
    fare: "₱45",
    label: "flagdown",
    text: "Metered after flagdown. Ride-hailing apps cover the city too and usually quote the fare upfront.",
  },
  {
    Icon: StudentFareIcon,
    title: "Discounted",
    fare: "20% off",
    label: "students, seniors, PWD",
    text: "Mandated by law for students, senior citizens (60+) and persons with disabilities. Carry a valid ID and present it as you board.",
  },
];
export default function CommuterGuide() {
  const [selectedMap, setSelectedMap] = useState<"rail" | "bus" | null>(
    null
  );

  const downloadMapsAsPDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const addMapToPDF = async (
        imageSrc: string,
        title: string,
        isFirstPage: boolean
      ) => {
        if (!isFirstPage) {
          pdf.addPage();
        }

        const image = new window.Image();

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Unable to load map image."));
          image.src = imageSrc;
        });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to create canvas.");
        }

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        context.drawImage(image, 0, 0);

        const imageData = canvas.toDataURL("image/jpeg", 0.95);

        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, 15, 15);

        const margin = 10;
        const titleSpace = 15;

        const availableWidth = pageWidth - margin * 2;
        const availableHeight =
          pageHeight - margin * 2 - titleSpace;

        const imageRatio = canvas.width / canvas.height;

        let imageWidth = availableWidth;
        let imageHeight = imageWidth / imageRatio;

        if (imageHeight > availableHeight) {
          imageHeight = availableHeight;
          imageWidth = imageHeight * imageRatio;
        }

        const x = (pageWidth - imageWidth) / 2;
        const y = margin + titleSpace;

        pdf.addImage(
          imageData,
          "JPEG",
          x,
          y,
          imageWidth,
          imageHeight
        );
      };

      await addMapToPDF(
        railwayMap.src,
        "System Rail Map",
        true
      );

      await addMapToPDF(
        busRouteMap.src,
        "Metro Bus Network",
        false
      );

      pdf.save("RUTA-Network-Maps.pdf");
    } catch (error) {
      console.error("Error creating PDF:", error);
      alert("Unable to download the maps. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 font-sans text-slate-900 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="relative min-h-64 overflow-hidden rounded-2xl bg-ink shadow-sm">
          <Image
            src={commuterHero}
            alt="Bus at the terminal"
            fill
            className="absolute inset-0 h-full w-full object-cover opacity-75"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />

          <div className="relative flex min-h-64 max-w-md flex-col justify-center p-7 text-paper sm:p-10">
            <span className="mb-3 w-fit rounded-full bg-paper/15 px-3 py-1 text-[11px] font-bold tracking-widest ring-1 ring-paper/25 backdrop-blur">
              OFFICIAL GUIDE
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Master the RUTA Network
            </h1>

            <p className="mt-3 text-base leading-6 text-paper/80">
              Everything you need to know about fares, routes, safety, and
              navigating the city with confidence.
            </p>
          </div>
        </section>

        {/* Transport Options */}
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

              <h2 className="mt-4 text-base font-bold">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                {item.text}
              </p>
            </article>
          ))}
        </section>

        {/* Getting Started */}
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="mb-3 border-l-4 border-slate-900 pl-2 text-sm font-bold uppercase tracking-wider text-slate-900">
              Getting Started
            </p>

            <div className="mt-5 space-y-5">
              <GuideStep
                number="1"
                title="Read the signboard"
                text="Jeepneys show their route code and end points on the windshield — for example Jaro–CPU or Ungka–SM. The code tells you the corridor it follows, not every street it passes, so check the plan in RUTA if you are unsure."
              />

              <GuideStep
                number="2"
                title="Wait where they actually stop"
                text="Most stops are informal. Wait near a corner, terminal or an existing queue rather than mid-block, and raise a hand as the jeepney approaches so the driver sees you in time."
              />

              <GuideStep
                number="3"
                title="Pay and pass it forward"
                text="Board, sit, then hand your fare toward the driver — passengers pass it along for you. Say your destination when you pay so the driver can work out the distance, and say bayad po when handing money over."
              />
              <GuideStep
                number="4"
                title="Signal before your stop"
                text="Say para when you want to get off, or knock once on the handrail. Do it about a block early; drivers cannot stop instantly in traffic."
              />
              <GuideStep
                number="5"
                title="Plan transfers ahead"
                text="Few routes cross the city end to end. Expect one transfer between districts, and budget the second fare — RUTA shows both legs and the combined cost before you leave."
              />
            </div>
          </div>

          <Image
            src={commuterPlanningRoute}
            alt="Commuters planning a route"
            width={800}
            height={288}
            className="h-64 w-full rounded-xl object-cover shadow-sm lg:h-72"
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-100 p-7 text-slate-900 sm:p-9">
          <h2 className="text-3xl font-extrabold tracking-tight">
            What a Ride Costs
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {fares.map((fare, index) => (
              <article
                key={fare.title}
                className={`flex min-h-[290px] flex-col rounded-lg border border-slate-200 bg-white p-8 ${
                  index === 2 ? "ring-1 ring-amber-300" : ""
                }`}
              >
                <fare.Icon className="h-9 w-9 text-slate-500" />

                <h3 className="mt-6 text-[22px] font-extrabold tracking-tight">
                  {fare.title}
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-slate-500">
                  {fare.text}
                </p>

                <div className="mt-auto flex items-baseline gap-2 pt-6">
                  <span className="text-[27px] font-extrabold tracking-tight">
                    {fare.fare}
                  </span>

                  <span className="text-sm text-slate-400">
                    {fare.label}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Network Maps */}
        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Network Maps
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explore our interconnected rail and bus networks across the
                city.
              </p>
            </div>

            <button
              onClick={downloadMapsAsPDF}
              className="inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <DownloadIcon className="h-4 w-4" />
              Download PDF Maps
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* System Rail Map */}
            <figure
              className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100"
              onClick={() => setSelectedMap("rail")}
            >
              <Image
                src={railwayMap}
                alt="System rail map"
                width={1200}
                height={700}
                className="h-auto max-h-[500px] w-full object-contain transition duration-300 group-hover:scale-[1.02]"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink shadow">
                System Rail Map
              </figcaption>
            </figure>

            {/* Metro Bus Network */}
            <figure
              className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-100"
              onClick={() => setSelectedMap("bus")}
            >
              <Image
                src={busRouteMap}
                alt="Metro bus network map"
                width={1200}
                height={700}
                className="h-auto max-h-[500px] w-full object-contain transition duration-300 group-hover:scale-[1.02]"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink shadow">
                Metro Bus Network
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Safety */}
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="grid gap-7 md:grid-cols-[1.1fr_2fr]">
            <div>
              <h2 className="text-xl font-bold">Riding Safely</h2>

              <div className="mt-4 flex gap-3 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />

                <p>
                  RUTA plans routes — it does not operate vehicles or terminals.
                  These are habits that help on Iloilo roads, not guarantees.
                </p>
              </div>

              <ul className="mt-5 space-y-3">
                {hotlines.map((line) => (
                  <li key={line.label} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-900">
                      <PhoneIcon className="h-4 w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        {line.label}
                      </span>
                      <span className="block text-sm font-extrabold tracking-tight text-slate-900">
                        {line.number}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Safety
                title="Keep your phone out of sight"
                text="Snatching happens most at open windows and while boarding. Check directions before you get on, not mid-ride."
              />

              <Safety
                title="Sit where you can get out"
                text="Near the door is easier to leave from at night, and you can hand your fare forward without turning your back to the aisle."
              />

              <Safety
                title="Carry small bills"
                text="Counting a large note in public draws attention, and drivers often cannot break ₱500 during a busy run."
              />

              <Safety
                title="Rainy season routes flood"
                text="Low sections near the river and along Diversion can become impassable in heavy rain. Allow extra time or reroute."
              />
              <Safety
                title="Agree tricycle fares first"
                text="Settle the price before boarding for any trip outside the usual loop, so there is no dispute when you arrive."
              />
              <Safety
                title="Note the plate number"
                text="If something feels wrong, the body number is painted on the side and rear. It is what any report will ask for first."
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8 text-center">
          <p className="text-sm text-slate-400">
            Was this guide helpful?
          </p>

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

      {/* Large Map Viewer */}
      {selectedMap && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedMap(null)}
        >
          <div
            className="relative flex max-h-[95vh] max-w-7xl items-center justify-center overflow-auto rounded-xl bg-white p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMap(null)}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-2xl font-bold text-slate-700 shadow-md transition hover:bg-slate-100"
              aria-label="Close map"
            >
              ×
            </button>

            <Image
              src={
                selectedMap === "rail"
                  ? railwayMap
                  : busRouteMap
              }
              alt={
                selectedMap === "rail"
                  ? "System rail map"
                  : "Metro bus network map"
              }
              className="max-h-[90vh] w-auto max-w-full object-contain"
              width={1600}
              height={1000}
            />
          </div>
        </div>
      )}
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
        <h3 className="text-base font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function Safety({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <ShieldCheckIcon className="h-5 w-5 text-slate-900" />
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

type IconProps = {
  className?: string;
};

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

function EBusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 17V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11" />
      <path d="M4 11h16" />
      <path d="M6 17v2" />
      <path d="M18 17v2" />
      <circle cx="8" cy="14.5" r="1" />
      <circle cx="16" cy="14.5" r="1" />
      <path d="m13 6-2 3h2l-2 3" />
    </svg>
  );
}

function BusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 17V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10" />
      <path d="M3 12h18" />
      <path d="M6 17v2" />
      <path d="M18 17v2" />
      <circle cx="7" cy="14.5" r="1" />
      <circle cx="17" cy="14.5" r="1" />
    </svg>
  );
}

function TaxiIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 3h6" />
      <path d="M12 3v3" />
      <path d="M5 17V13l2-5h10l2 5v4" />
      <path d="M5 13h14" />
      <path d="M7 17v2" />
      <path d="M17 17v2" />
    </svg>
  );
}
