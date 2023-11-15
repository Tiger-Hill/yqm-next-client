import './globals.scss'
import { Inter, ZCOOL_KuaiLe, Yaldevi } from 'next/font/google'
import Providers from "@/lib/redux/provider";


import Polynav from '@/components/navbars/Polynav'

// const inter = Inter({ subsets: ['latin'] })
const zCool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: ["400"] });
const yaldevi = Yaldevi({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: 'YQM',
  description: 'Get goods from China',
}

export default function RootLayout({ children, params: { lng } }) {
  return (
    <html lang="en">
      <body className={yaldevi.className}>
        <Providers>
          <Polynav lng={lng} />

          {children}
        </Providers>
      </body>
    </html>
  );
}
