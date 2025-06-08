import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#" },
    { icon: <Twitter className="w-5 h-5" />, href: "#" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { icon: <Instagram className="w-5 h-5" />, href: "#" },
  ];

  const footerLinks = [
    { label: t("overview"), href: "#overview" },
    { label: t("features"), href: "#features" },
    { label: t("hotels"), href: "#hotels" },
    { label: t("user_actions.contact"), href: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              {t("landing.footer.stay_sync")}
            </h3>
            <p className="text-gray-400">
              {t(
                "landing.footer.modern_hotel_management_solution_for_modern_hoteliers"
              )}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("landing.footer.links")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("landing.footer.contact")}
            </h4>
            <address className="text-gray-400 not-italic">
              <p>{t("landing.footer.address")}</p>
              <p>{t("landing.footer.city")}</p>
              <p>{t("landing.footer.email")}</p>
            </address>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("landing.footer.social")}
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} StaySync. {t("landing.footer.all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
