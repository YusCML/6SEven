import Link from "next/link";
import { useState } from "react"

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
      name: "Your Name",
      role: "Project Manager",
    },
    {
      name: "Member 2",
      role: "Frontend Developer",
    },
    {
      name: "Member 3",
      role: "Backend Developer",
    },
    {
      name: "Member 4",
      role: "UI/UX Designer",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            About RUTA
          </h1>

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
          <h2 className="text-3xl font-bold mb-4">
            🎯 Our Mission
          </h2>

          <p className="text-gray-600 leading-7">
            Our mission is to simplify daily commuting by providing
            reliable route recommendations, travel guidance,
            and commuter-friendly information that helps people
            travel efficiently and safely.
          </p>
        </section>

        {/* Vision */}
        <section className="bg-white rounded-xl shadow p-8">
          <h2 className="text-3xl font-bold mb-4">
            🌎 Our Vision
          </h2>

          <p className="text-gray-600 leading-7">
            We envision a future where every commuter can easily
            navigate public transportation with confidence using
            modern technology.
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
          <h2 className="text-3xl font-bold mb-6">
            👨‍💻 Meet the Team
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full bg-blue-200 mx-auto mb-4 flex items-center justify-center text-3xl">
                  👤
                </div>

                <h3 className="font-bold">
                  {member.name}
                </h3>

                <p className="text-gray-500">
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

          <p className="mb-6">
            Phone: +63 912 345 6789
          </p>
        </section>

      </main>
    </div>
  );
}