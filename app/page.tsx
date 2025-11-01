import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="border-b border-red-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✂️</span>
              <h1 className="text-2xl font-bold text-red-900">MB Barbershop</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="/catalogue" className="text-red-800 hover:text-red-600 transition">
                Services
              </Link>
              <Link href="/shop" className="text-red-800 hover:text-red-600 transition">
                Shop
              </Link>
              <Link href="/book" className="text-red-800 hover:text-red-600 transition">
                Book Now
              </Link>
              <Link href="/manage" className="text-red-800 hover:text-red-600 transition">
                My Bookings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center overflow-hidden">
            <img src="/logo.jpg" alt="MB Barbershop Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-black mb-4">
          MB <span className="text-red-600">Barbershop</span>
        </h2>
        <p className="text-xl text-black mb-8">
          Professional grooming services with precision and style. Experience the finest cuts in Addis Ababa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book"
            className="bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition shadow-lg"
          >
            Book Appointment
          </Link>
          <Link
            href="/catalogue"
            className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
          >
            View Services
          </Link>
          <Link
            href="/shop"
            className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition border-2 border-black"
          >
            🛍️ Shop Products
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h3 className="text-3xl font-bold text-black mb-4">About MB Barbershop</h3>
          <p className="text-lg text-black leading-relaxed">
            Professional grooming services in Addis Ababa. We specialize in precision haircuts with a friendly touch.
            Quality service, affordable prices, smooth experience.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-black text-white rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">⏰ Working Hours</h3>
            <p className="text-gray-300">Open every day</p>
          </div>
          <div className="text-center text-3xl font-bold mb-6">
            2:00 AM – 2:00 PM
          </div>
          <div className="text-center text-gray-300">
            <p>📍 Addis Ababa, Ethiopia</p>
            <p>📞 <a href="tel:0920224604" className="hover:text-white">0920224604</a></p>
            <p>✉️ <a href="mailto:belaynehamsal20@gmail.com" className="hover:text-white">belaynehamsal20@gmail.com</a></p>
            <p className="mt-2">
              <a href="https://maps.app.goo.gl/dP2dVWS1uf7tg5Qe7" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                📍 View on Google Maps
              </a>
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2">MB Barbershop</h4>
            <p className="text-gray-300">Addis Ababa, Ethiopia</p>
            <p className="text-gray-300">Hours: 2:00 AM – 2:00 PM (EAT)</p>
            <p className="text-gray-300 mt-2">
              <a href="tel:0920224604" className="hover:text-white">📞 0920224604</a> | 
              <a href="mailto:belaynehamsal20@gmail.com" className="hover:text-white">✉️ belaynehamsal20@gmail.com</a>
            </p>
          </div>
          <p className="text-gray-300 text-sm">
            © 2025 MB Barbershop. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">Made by promo4s</p>
        </div>
      </footer>
    </div>
  );
}
