import Link from "next/link";

import Container from "@/components/container";
import NavbarActions from "@/components/navbar-actions";

const Navbar = () => {
  return (
    <div className="border-b">
      <Container>
        <div className="relative px-2 md:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">CRYPTO FASHION</p>
          </Link>
          

          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
