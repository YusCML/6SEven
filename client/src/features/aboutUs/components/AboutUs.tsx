import Image from "next/image";
import bryan from "@/assets/team/bryan.jpg";
import denver from "@/assets/team/denver.jpg";
import joe from "@/assets/team/joe.jpg";
import zephaniah from "@/assets/team/zephaniah.jpg";
import novie from "@/assets/team/novie.jpg";
import nherf from "@/assets/team/nherf.jpg";
import iloilo from "@/assets/aboutUs/iloilo.png";
import transit from "@/assets/aboutUs/rapidTransit.jpg";

const teamMembers = [
  { name: "Bryan Del Rosario", role: "Project Manager", image: bryan },
  { name: "Denver Neil Alejandro", role: "Lead Developer", image: denver },
  { name: "Joe Steven Bandong", role: "Lead Backend Developer", image: joe },
  {
    name: "Zephaniah Raye D. Belmis",
    role: "Frontend Developer",
    image: zephaniah,
  },
  { name: "Novie Glynn Farrol", role: "Frontend Developer", image: novie },
  { name: "Nherf Rossel Gempasao", role: "QA Tester", image: nherf },
];

const footerGroups = [
  {
    title: "RUTA",
    links: ["About Us", "Features", "Community", "Incident Report"],
  },
  { title: "Company", links: ["About Us", "Careers", "Contact"] },
  { title: "Help", links: ["Safety tips", "Privacy policy", "Terms of service"] },
];

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <section className="relative h-52 overflow-hidden bg-slate-900 text-center text-white sm:h-60">
        <Image
          src={iloilo}
          alt="Iloilo City skyline"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/45 to-slate-950/80" />

        <div className="relative mx-auto flex h-full max-w-3xl flex-col justify-center px-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Empowering the Filipino Commuter
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-200">
            We are building the future of transportation in the Philippines
            through technology, data, and community.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-600">
            Our Mission
          </p>

          <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight">
            Redefining how millions move across the metro.
          </h2>

          <p className="mt-3 text-base leading-5 text-slate-500">
            Commuting in the Philippines should not be a daily struggle. RUTA
            was born out of the frustration of unpredictable wait times, lack
            of transit information, and fragmented travel networks.
          </p>

          <p className="mt-3 text-base leading-5 text-slate-500">
            Our mission is to provide every Filipino with real-time, accurate
            transit data that makes commuting predictable, efficient, and
            dignified. By leveraging community-sourced incident reporting and
            advanced route planning, we&apos;re putting the power back in the hands
            of the commuter.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-5 border-t border-slate-100 pt-5">
            <div>
              <CheckIcon className="h-5 w-5 text-emerald-500" />

              <h3 className="mt-2 text-sm font-bold">Transparency</h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Accurate information at your fingertips.
              </p>
            </div>

            <div>
              <AlertIcon className="h-5 w-5 text-amber-500" />

              <h3 className="mt-2 text-sm font-bold">Reliability</h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Built with commuters in mind, always.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-2xl bg-slate-100 shadow-sm sm:h-80">
          <Image
            src={transit}
            alt="Modern public transit interior"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Meet the Innovators
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              A diverse team of designers, developers, and urban enthusiasts
              driven to change.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="flex min-h-[220px] flex-col items-center justify-center rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-100"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={92}
                  height={92}
                  className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-slate-200"
                />

                <h3 className="mt-3 max-w-[12rem] text-base font-bold leading-5 text-slate-800">
                  {member.name}
                </h3>

                <p className="mt-1 max-w-[12rem] text-xs leading-5 text-blue-600">
                  {member.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
        <div className="grid overflow-hidden rounded-2xl bg-[#102246] text-white shadow-sm lg:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <h2 className="max-w-xs text-2xl font-extrabold leading-tight">
              Have questions or want to partner?
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              We&apos;re always looking for ways to improve RUTA and collaborate
              with LGUs and transit operators.
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-200">
              <p className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-blue-300" />
                hello@ruta.com
              </p>

              <p className="flex items-center gap-2">
                <PinIcon className="h-4 w-4 text-blue-300" />
                Iloilo City, Philippines
              </p>
            </div>
          </div>

          <form
            className="m-4 rounded-xl bg-white p-5 text-slate-900 shadow-lg sm:m-6"
            onSubmit={(event) => event.preventDefault()}
          >
            <h3 className="text-base font-bold">Send us a message</h3>

            <label className="mt-4 block text-xs font-semibold">
              Full name
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                placeholder="Juan Dela Cruz"
              />
            </label>

            <label className="mt-3 block text-xs font-semibold">
              Email address
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                placeholder="juan@email.com"
              />
            </label>

            <label className="mt-3 block text-xs font-semibold">
              Message
              <textarea
                className="mt-1 min-h-20 w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                placeholder="How can we help?"
              />
            </label>

            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Legal & Information */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <h2 className="text-base font-extrabold">
              Legal &amp; Information
            </h2>

            <p className="mt-3 max-w-sm text-xs leading-5 text-slate-500">
              RUTA is a registered trademark of SakaySense Technologies Inc.
              Transit data is provided by official LTFRB/DOTr matrices
              supplemented by verified community reports.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              App Details
            </h3>

            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Version:</dt>
                <dd className="font-semibold">2.4.1-stable</dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Last Updated:</dt>
                <dd className="font-semibold">Oct 12, 2023</dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Data Source:</dt>
                <dd className="font-semibold">OpenStreetMap + R-DOTr</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Compliance
            </h3>

            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                NPC Privacy Compliant
              </li>

              <li className="flex items-center gap-2">
                <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                ISO 27001 Certified
              </li>

              <li className="flex items-center gap-2">
                <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                LTFRB Data License
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-extrabold text-blue-700">
              <span className="grid h-5 w-5 place-items-center rounded bg-blue-600 text-[10px] text-white">
                R
              </span>
              RUTA
            </div>

            <p className="mt-3 max-w-xs text-xs leading-5 text-slate-500">
              Navigating a smarter, more inclusive transportation network that
              puts commuters first.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {group.title}
              </h3>

              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-blue-600"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
          © 2026 RUTA. All rights reserved.
        </div>
      </footer>
    </main>
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

function CheckIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </IconFrame>
  );
}

function AlertIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M12 3 3 20h18L12 3Z" />
      <path d="M12 9v4m0 3h.01" />
    </IconFrame>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </IconFrame>
  );
}

function PinIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconFrame>
  );
}