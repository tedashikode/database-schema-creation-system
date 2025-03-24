import { useState } from "react";
import AvatarSVG from "../assets/AvatarSVG";
import HamburgerSVG from "../assets/HamburgerSVG";
import XSVG from "../assets/XSVG";
import StarLogoSVG from "../assets/StarLogoSVG";
import ProjectListDropdown from "./ProjectListDropdown"; // Import the new component

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="relative bg-gray-50 flex w-dvw items-center justify-between p-4 outline outline-gray-200">
      <div className="flex items-center gap-1 text-gray-600">
        <a className="flex items-center font-bold" href={"/"}>
          <div>
            <StarLogoSVG />
          </div>
          <p>KeyMap</p>
        </a>
      </div>
      <div className="font-semibold text-[#6b7280] ">
        {/* this should be an icon that shows a dropdown when tapped on */}
        <ul className="flex items-center gap-1 my-4">
          <li className="">
            <button onClick={toggleDropdown}>
              {isDropdownOpen ? <XSVG /> : <HamburgerSVG />}
            </button>
          </li>
          <li className="">
            <a href={"/profile"}>
              <AvatarSVG />
            </a>
          </li>
        </ul>
      </div>
      {isDropdownOpen && (
        <ProjectListDropdown isOpen={isDropdownOpen} onClose={toggleDropdown} />
      )}
    </nav>
  );
};

export default Navbar;
