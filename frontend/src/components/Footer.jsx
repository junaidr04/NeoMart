import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleCategory = (cat) => {
    navigate(`/products?category=${cat}`);
  };

  return (
    <footer className="bg-gray-950 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4 block">
              NeoMart
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Bangladesh's #1 online store for Electronics and Fashion. Quality products at unbeatable prices.
            </p>
            <div className="flex gap-3">
              {["📘", "🐦", "📸", "▶️"].map((icon, i) => (
                <button key={i} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-black mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[["Home", "/"], ["Products", "/products"], ["Cart", "/cart"], ["Register", "/register"]].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="hover:text-blue-400 transition-colors flex items-center gap-2">
                    <span className="text-blue-600">→</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black mb-4">Categories</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["⚡ Electronics", "Electronics"],
                ["👗 Fashion", "Fashion"],
                ["📱 Mobiles", "Mobiles"],
                ["💻 Laptops", "Laptops"],
                ["🎧 Headphones", "Headphones"],
                ["🖱️ Mouse", "Mouse"],
                ["⌨️ Keyboard", "Keyboard"]
              ].map(([label, cat]) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategory(cat)}
                    className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><span>📧</span> support@neomart.com</li>
              <li className="flex items-center gap-2"><span>📞</span> +880 1635-126797</li>
              <li className="flex items-center gap-2"><span>📍</span> Chittagong, Bangladesh</li>
              <li className="flex items-center gap-2"><span>⏰</span> 24/7 Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 NeoMart. All rights reserved.</p>
          <p className="text-sm text-gray-500">Made with ❤️ by <span className="text-blue-400 font-bold">Jack</span></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;