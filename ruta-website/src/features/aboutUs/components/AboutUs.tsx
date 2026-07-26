import Image from "next/image";
import bryan from "@/assets/team/bryan.jpg";
import denver from "@/assets/team/denver.jpg";
import joe from "@/assets/team/joe.jpg";
import zephaniah from "@/assets/team/zephaniah.jpg";
import novie from "@/assets/team/novie.jpg";
import nherf from "@/assets/team/nherf.jpg";

export default function About() {
  const features = [
    {
      title: "🗺 Smart Route Finder",
      description:
        "Find the fastest and most convenient public transportation routes to your destination.",
    },
    {
      title: "📍 Real-Time Navigation",
      description:
        "Navigate confidently with accurate route guidance and location assistance.",
    },
    {
      title: "❤️ Favorite Routes",
      description:
        "Save your frequently used routes for quick access anytime.",
    },
    {
      title: "📖 Commuter Guide",
      description:
        "Learn transportation tips, fare information, and commuting safety.",
    },
  ];

  const teamMembers = [
    {
      name: "Bryan Del Rosario",
      role: "Project Manager",
      image: bryan,
    },
    {
      name: "Denver Neil Alejandro",
      role: "Lead Developer (Frontend & Backend)",
      image: denver,
    },
    {
      name: "Joe Steven Bandong",
      role: "Lead Backend Developer",
      image: joe,
    },
    {
      name: "Zephaniah Raye D. Belmis",
      role: "Frontend Developer",
      image: zephaniah,
    },
    {
      name: "Novie Glynn Farrol",
      role: "Frontend Developer",
      image: novie,
    },
    {
      name: "Nherf Rossel Gempasao",
      role: "QA Tester",
      image: nherf,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Hero */}
        <section className="bg-blue-700 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-4">About RUTA</h1>

            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              RUTA is a commuter assistance platform that helps travelers
              discover the best public transportation routes, making every
              journey safer, faster, and more convenient.
            </p>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
          {/* Mission */}
          <section className="bg-white rounded-xl shadow p-8">
            <h2 className="text-3xl font-bold mb-4">🎯 Our Mission</h2>

            <p className="text-gray-600 leading-7">
              Our mission is to simplify daily commuting by providing reliable
              route recommendations, travel guidance, and commuter-friendly
              information that helps people travel efficiently and safely.
            </p>
          </section>

          {/* Vision */}
          <section className="bg-white rounded-xl shadow p-8">
            <h2 className="text-3xl font-bold mb-4">🌎 Our Vision</h2>

            <p className="text-gray-600 leading-7">
              We envision a future where every commuter can easily navigate
              public transportation with confidence using modern technology.
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              ✨ What RUTA Offers
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="bg-white rounded-xl shadow p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              👨‍💻 Meet the Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
                >
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="rounded-full object-cover border-4 border-blue-600"
                    />
                  </div>

                  <h3 className="text-xl font-bold">
                    {member.name}
                  </h3>

                  <p className="text-blue-600 font-medium mt-2">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="bg-blue-700 text-white rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-3">
              📩 Contact Us
            </h2>

            <p className="mb-2">
              Email: ruta.support@email.com
            </p>

            <p>
              Phone: +63 912 345 6789
            </p>
          </section>
        </main>
      </div>
    </>
  );
}