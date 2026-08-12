export default function CommuterGuide() {
  const beforeTravel = [
    "Plan your route before leaving.",
    "Prepare your fare or transport card.",
    "Check the weather forecast.",
    "Bring water and necessary belongings.",
    "Leave early to avoid rush-hour delays.",
  ];

  const fares = [
    { type: "Jeepney", fare: "₱13 – ₱20" },
    { type: "Bus", fare: "₱15 – ₱40" },
    { type: "Metered Fare", fare: "₱13.25" },
  ];

  const safetyTips = [
    {
      title: "RUTA Monitoring",
      description: "Real-time monitoring and security presence across the network.",
    },
    {
      title: "24/7 Assistance",
      description: "Always have support when you need it most.",
    },
    {
      title: "Safety Protocols",
      description: "Trained personnel and established emergency procedures.",
    },
  ];

  const etiquette = [
    "Give priority seats to seniors, pregnant women, and PWDs.",
    "Queue properly when boarding.",
    "Keep noise to a minimum.",
    "Do not litter inside vehicles or terminals.",
    "Respect fellow commuters and drivers.",
  ];

  const transportOptions = [
    {
      title: "🚍 Jeepney",
      description:
        "The most affordable public transportation. Check the route sign before boarding and prepare exact fare.",
    },
    {
      title: "🚌 Bus",
      description:
        "Suitable for longer trips. Some buses accept cashless payment while others accept cash.",
    },
    {
      title: "🚗 Grab",
      description:
        "Provides safe and reliable passenger transport with upfront pricing.",
    },
    {
      title: "🚖 Taxi",
      description:
        "Comfortable and direct transportation. Always ensure the meter is running.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">Master the RUTA Network</h1>
              <p className="text-blue-100 text-lg">
                Everything you need to know for a safe, smooth, and affordable commute
              </p>
            </div>
            <div className="relative h-64 md:h-72 bg-blue-700 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center">
                <div className="text-6xl">🚌</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* Getting Started */}
        <section>
          <h2 className="text-4xl font-bold mb-12">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {beforeTravel.map((tip, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Simple, Fair Fares */}
        <section>
          <h2 className="text-4xl font-bold mb-12">Simple, Fair Fares</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {fares.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold mb-4">{item.type}</h3>
                <div className="text-3xl font-bold">{item.fare}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Transportation Guide */}
        <section>
          <h2 className="text-4xl font-bold mb-12">🚍 Transportation Guide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {transportOptions.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-600"
              >
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Network Maps */}
        <section>
          <h2 className="text-4xl font-bold mb-12">Network Maps</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg overflow-hidden h-72 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-2">🗺️</div>
                <p className="text-lg font-semibold">Route Map</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg overflow-hidden h-72 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-2">📍</div>
                <p className="text-lg font-semibold">Station Locations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Safety is Our Priority */}
        <section className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-10">
          <h2 className="text-4xl font-bold mb-12">Your Safety is Our Priority</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {safetyTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-4xl mb-4">
                  {index === 0 ? "🎥" : index === 1 ? "📞" : "✅"}
                </div>
                <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white rounded-lg p-6 border-l-4 border-blue-600">
            <p className="text-gray-700 font-semibold">
              📞 Emergency Hotline: <strong>911</strong>
            </p>
          </div>
        </section>

        {/* Commuting Etiquette */}
        <section>
          <h2 className="text-4xl font-bold mb-12">🤝 Commuting Etiquette</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {etiquette.map((tip, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="text-blue-600 text-2xl">✓</div>
                <p className="text-gray-700 mt-1">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-4xl font-bold mb-12">❓ Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="font-bold text-lg mb-2">How do I know which jeepney to ride?</h3>
              <p className="text-gray-600">
                Look at the route displayed on the front or side of the jeepney and compare it with your destination.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="font-bold text-lg mb-2">What if I lose my belongings?</h3>
              <p className="text-gray-600">
                Report it immediately to the nearest transport terminal, station personnel, or local authorities.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="font-bold text-lg mb-2">What is the best time to travel?</h3>
              <p className="text-gray-600">
                Traveling outside rush hours generally provides a faster and more comfortable commute.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}