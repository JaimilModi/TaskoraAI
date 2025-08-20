import React from "react";
import { assets } from "../assets/assets";
import { Mail, Phone } from "lucide-react";

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
            <h2 className="font-semibold text-gray-800 mb-5 text-lg">
              Get in touch
            </h2>
            <div className="text-sm space-y-3">
              <a
                href="tel:+12124567890"
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
              >
                <Phone size={18} className="text-primary" />
                +1-212-456-7890
              </a>
              <a
                href="mailto:contact@example.com"
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
              >
                <Mail size={18} className="text-primary" />
                taskoraai@mail.com
              </a>
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
