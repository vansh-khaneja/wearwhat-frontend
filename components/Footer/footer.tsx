import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2">
          <div className="px-12 py-16 flex flex-col justify-between bg-cover bg-center" style={{ backgroundImage: "url('/clothes-hanging.jpeg')" }}>
            <div>
              {/* <div className="w-16 h-16 mb-8">
                <Image 
                  src="/logo1.png" 
                  alt="WearWhat Logo" 
                  width={64} 
                  height={64} 
                  className="object-contain"
                />
              </div> */}
              <h2 className="text-5xl font-light leading-tight max-w-sm">
                Find out about the sales at your local shop
              </h2>
            </div>
            <button className="mt-8 border border-white px-8 py-3 text-sm font-semibold tracking-widest hover:bg-white hover:text-black transition-colors w-fit">
              FIND SHOPS
            </button>
          </div>
          <div className="px-12 py-16">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold tracking-widest mb-6">CATEGORIES</h3>
                <ul className="space-y-3 text-gray-400 font-light">
                  <li><a href="#" className="hover:text-white transition-colors">Hoodies</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Sweatshirts</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Shirts</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">T-Shirts</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Jackets</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold tracking-widest mb-6">COMPANY</h3>
                <ul className="space-y-3 text-gray-400 font-light">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Guarantee</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold tracking-widest mb-6">SUPPORT</h3>
                <ul className="space-y-3 text-gray-400 font-light">
                  <li><a href="#" className="hover:text-white transition-colors">Style Guide</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Licensing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Change log</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Instructions</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-16 flex justify-end space-x-6">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Youtube size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

