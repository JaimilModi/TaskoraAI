import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 mt-20 bg-white">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div className="md:max-w-96">
          <img className="h-18" src={assets.logo} alt="TaskoraAI logo" />
          <p className="mt-6 text-sm leading-relaxed">
            Experience the power of AI with <b>TaskoraAI</b>. <br />
            Transform your content creation with our suite of premium AI tools —
            write articles, generate images, and enhance your workflow.
          </p>
        </div>

        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-5">
              Subscribe to our newsletter
            </h2>
            <div className="text-sm space-y-2">
              <p className="max-w-72">
                The latest news, articles, and resources — sent to your inbox
                weekly.
              </p>
              <form className="flex items-center gap-2 pt-4">
                <input
                  className="border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-[#FF5E00] outline-none w-full max-w-64 h-9 rounded px-2"
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email for newsletter subscription"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#FF5E00] hover:bg-orange-600 transition w-24 h-9 text-white rounded cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright © 2025{" "}
        <a href="#" className="hover:text-primary transition">
          TaskoraAI
        </a>
        . All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
