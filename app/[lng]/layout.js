import './globals.scss'
import { Inter, ZCOOL_KuaiLe, Yaldevi, Poppins } from 'next/font/google'
import Providers from "@/lib/redux/provider";


import Polynav from '@/components/navbars/Polynav'
import FlashModal from '@/components/flashes/FlashesModal';

// const inter = Inter({ subsets: ['latin'] })
const zCool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: ["400"] });
const yaldevi = Yaldevi({ subsets: ["latin"], weight: ["400", "500", "600"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: 'YQM',
  description: 'Get goods from China',
}

export default function RootLayout({ children, params: { lng } }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <Polynav lng={lng} />
          {children}
          {/* // ? FOOTER HERE */}
          <FlashModal />
        </Providers>
      </body>
    </html>
  );
}
