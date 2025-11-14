import Link from "next/link";
import "./globals.css";

import { Poppins } from "next/font/google";
import NavLink from "./components/NavLink";
import Navgations from "./components/Navgations"

const poppins = Poppins({
  subsets: ["latin"],
  variable: '--font-poppins',
  weight: ["200", "400", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <header>
          <Navgations></Navgations>
        </header>

        <main> {children}</main>

      </body>
    </html>
  );
}
