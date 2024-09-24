import Image from "next/image";
import logo from "@/assets/images/YOUfun_logo.png";

interface LogoProps {
  onClick: () => void;
}

const Logo = ({ onClick }: LogoProps) => (
  <div
    style={{ position: "relative", width: "110px", height: "55px" }}
    className="block mx-auto mb-[20px] transition-transform duration-300 hover:scale-110 cursor-pointer"
  >
    <Image src={logo.src} alt="Logo" layout="fill" onClick={onClick} />
  </div>
);

export default Logo;
