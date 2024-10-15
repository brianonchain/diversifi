// nextjs
import Link from "next/link";
// images
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const socials = [
    {
      id: "twitter",
      fa: faTwitter,
      link: "https://www.x.com",
    },
    {
      id: "discord",
      fa: faDiscord,
      link: "https://www.discord.com",
    },
    {
      id: "telegram",
      fa: faTelegram,
      link: "https://www.telegram.com",
    },
  ];

  const footerLinks = [
    {
      text: "About",
      route: "/about",
    },
    {
      text: "Test",
      route: "/test",
    },
  ];

  return (
    <footer className="w-full flex justify-center">
      <div className="sectionSize h-[64px] flex items-center justify-between">
        <div className="ml-[2px] text-sm text-slate-400">&copy; 2024 DiversiFi</div>
        <div className="flex items-center space-x-[24px]">
          {footerLinks.map((i) => (
            <Link key={i.text} href={i.route} className="text-sm font-medium hover:text-blue-500 cursor-pointer">
              {i.text}
            </Link>
          ))}
          {socials.map((i) => (
            <Link key={i.id} href={i.link} target="_blank">
              <FontAwesomeIcon icon={i.fa} className="text-xl pt-1 hover:text-blue-500 cursor-pointer" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
