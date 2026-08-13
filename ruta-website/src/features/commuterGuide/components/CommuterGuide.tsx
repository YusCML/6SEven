export default function CommuterGuide() {
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

  const safetyTips = [
    "Keep your valuables secure and close to you.",
    "Avoid using your phone in crowded areas.",
    "Wait only at designated loading and unloading zones.",
    "Travel with enough battery on your phone.",
    "Be aware of your surroundings at all times.",
  ];

  const etiquette = [
    "Give priority seats to seniors, pregnant women, and PWDs.",
    "Queue properly when boarding.",
    "Keep noise to a minimum.",
    "Do not litter inside vehicles or terminals.",
    "Respect fellow commuters and drivers.",
  ];

  const beforeTravel = [
    "Plan your route before leaving.",
    "Prepare your fare or transport card.",
    "Check the weather forecast.",
    "Bring water and necessary belongings.",
    "Leave early to avoid rush-hour delays.",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white py-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold">Commuter Guide</h1>
          <p className="mt-2 text-blue-100">
            Everything you need for a safe and hassle-free journey.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            🚶 Before You Travel
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            {beforeTravel.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-5">
            🚍 Transportation Guide
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {transportOptions.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">
            💰 Estimated Fare
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Transportation</th>
                <th className="p-3 text-left">Estimated Fare</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">Jeepney</td>
                <td className="p-3">₱13 – ₱20</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Bus</td>
                <td className="p-3">₱15 – ₱40</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Grab</td>
                <td className="p-3">Metered Fare</td>
              </tr>

              <tr>
                <td className="p-3">Taxi</td>
                <td className="p-3">Metered Fare</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            🛡 Safety Tips
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            {safetyTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            🤝 Commuting Etiquette
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            {etiquette.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-700">
            🚨 Emergency Contacts
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>📞 National Emergency Hotline: <strong>911</strong></p>
            <p>👮 Police Assistance: <strong>911</strong></p>
            <p>🚑 Ambulance: <strong>911</strong></p>
            <p>🚒 Fire Department: <strong>911</strong></p>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-5">
            ❓ Frequently Asked Questions
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold">
                How do I know which jeepney to ride?
              </h3>
              <p className="text-gray-600">
                Look at the route displayed on the front or side of the
                jeepney and compare it with your destination.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                What if I lose my belongings?
              </h3>
              <p className="text-gray-600">
                Report it immediately to the nearest transport terminal,
                station personnel, or local authorities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                What is the best time to travel?
              </h3>
              <p className="text-gray-600">
                Traveling outside rush hours generally provides a faster and
                more comfortable commute.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}