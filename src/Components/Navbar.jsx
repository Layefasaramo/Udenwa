import { appleImg, bagImg, searchImg } from "../Utils";
import { navLists } from "../Constant";
const Navbar = () => {
  return (
    <header className="site-header">
      <nav className="flex w-full screen-max-width">
        <img src={appleImg} alt="Apple" width={16} height={20} />
        <div className="flex flex-1 justify-center max-sm:hidden gap-5">
          {navLists.map((nav) => (
            <div
              key={nav}
              className="px-5 text-xs cursor-pointer text-gray hover:text-white transition-colors"
            >
              {nav}
            </div>
          ))}
        </div>
        <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
          <img src={searchImg} alt="Search" height={18} width={18} />
          <img src={bagImg} alt="Bag" height={18} width={18} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
