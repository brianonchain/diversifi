import Link from "next/link";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
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
      id: "about",
      title: "About",
      link: "/about",
      external: false,
    },
    {
      id: "news",
      title: "News",
      link: "https://www.medium.com",
      external: true,
    },
  ];

  return (
    <div className="flex justify-between items-center px-[16px] w-full h-[56px] bg-blue1">
      <div className="ml-[2px] text-sm text-slate-400">&copy; 2024 DiversiFi</div>
      <div className="flex items-center space-x-[20px] mr-[16px]">
        {footerLinks.map((i, index) => (
          <Link href={i.link} target={i.external ? "_blank" : "_self"} className="text-sm font-medium hover:text-blue-500 cursor-pointer">
            {i.title}
          </Link>
        ))}
        {socials.map((i, index) => (
          <Link href={i.link} target="_blank">
            <FontAwesomeIcon icon={i.fa} className="text-xl pt-1 hover:text-blue-500 cursor-pointer" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
