import AvatarSVG from "../assets/AvatarSVG";
import HamburgerSVG from "../assets/HamburgerSVG";
import StarLogoSVG from "../assets/StarLogoSVG";
const Navbar = () => {
  return (
    <nav className="bg-gray-50 flex w-dvw items-center justify-between p-4 outline outline-gray-200">
      <div className="flex items-center gap-1 text-gray-600">
        <a className="flex items-center font-bold" href={"/"}>
          <div>
            <StarLogoSVG />
          </div>
          <p>KeyMap</p>
        </a>
      </div>
      <div className="ffont-semibold text-[#6b7280] ">
        {/* this should be an icon that shows a dropdown when tapped on */}
        <ul className="flex items-center gap-1 my-4">
          <li className="">
            <a href="/chats">
              <HamburgerSVG />
            </a>
          </li>
          <li className="">
            <a href={"/profile"}>
              <AvatarSVG />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
