import Image from "next/image";
import bryan from "@/assets/team/bryan.jpg";
import denver from "@/assets/team/denver.jpg";
import joe from "@/assets/team/joe.jpg";
import zephaniah from "@/assets/team/zephaniah.jpg";
import novie from "@/assets/team/novie.jpg";
import nherf from "@/assets/team/nherf.jpg";

export default function About() {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Empowering the Filipino Commuter
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            RUTA is a commuter assistance platform that helps travelers discover the best public transportation routes, making every journey safer, faster, and more convenient.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* Mission & Vision Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Redefining how millions move across the metro.
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">🎯 Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our mission is to simplify daily commuting by providing reliable route recommendations, travel guidance, and commuter-friendly information that helps people travel efficiently and safely.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">🌎 Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  We envision a future where every commuter can easily navigate public transportation with confidence using modern technology.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg overflow-hidden h-80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl">🚌</div>
              <p className="text-lg font-semibold mt-4">Commuter First</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center">
            ✨ What RUTA Offers
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition border-l-4 border-blue-600"
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-gray-50 rounded-lg p-12">
          <h2 className="text-4xl font-bold text-center mb-12">
            👨‍💻 Meet the Innovators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition"
              >
                <div className="w-40 h-40 mx-auto mb-4 relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={160}
                    height={160}
                    className="rounded-full object-cover border-4 border-blue-600"
                  />
                </div>
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-blue-600 font-medium mt-2 text-sm">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Partnership Section */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Have positions or want to partner?
              </h2>
              <p className="text-gray-300 mb-6">
                We're always looking for talented individuals and strategic partners to help us revolutionize commuting in the Philippines.
              </p>
              <div className="space-y-2 text-sm">
                <p>📧 Email: ruta.support@email.com</p>
                <p>📞 Phone: +63 912 345 6789</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                  Get in Touch
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Legal Footer */}
        <section className="border-t border-gray-200 pt-12">
          <div className="grid md:grid-cols-4 gap-8 text-sm text-gray-600">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about-us" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/routes" className="hover:text-blue-600">Routes</a></li>
                <li><a href="/commuter-guide" className="hover:text-blue-600">Guide</a></li>
                <li><a href="/dashboard" className="hover:text-blue-600">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:ruta.support@email.com" className="hover:text-blue-600">Email</a></li>
                <li><a href="tel:+639123456789" className="hover:text-blue-600">Phone</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>&copy; 2024 RUTA. All rights reserved.</p>
          </div>
        </section>
      </main>
    </div>
  );
}