import './globals.scss'
import { Inter, ZCOOL_KuaiLe } from 'next/font/google'
import Providers from "@/lib/redux/provider";


import Polynav from '@/components/navbar/Polynav'

// const inter = Inter({ subsets: ['latin'] })
const zCool = ZCOOL_KuaiLe({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: 'YQM',
  description: 'Get goods from China',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={zCool.className}>
        <Providers>
          {/* <Polynav /> */}

          {children}

        </Providers>
      </body>
    </html>
  );
}
