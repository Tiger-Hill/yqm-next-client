// To enable auto language detection to translate app in user's language automatically

import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './app/i18n/settings'

acceptLanguage.languages(languages)

// ! THIS COULD BE PROBLEMATIC
const PUBLIC_FILE = /\.(.*)$/;

export const config = {
  // matcher: '/:lng*'
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico).*)",
  ],
};

export function middleware(req) {
  let lng

  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName).value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  // * to take the files from the publisc folder
  if (
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  // * Redirect if lng in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer'))
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  // ! REDIRECTION TO HTTPS DOMAIN
  if (process.env.NODE_ENV === "production") {
    if (req.headers.get("x-forwarded-proto") !== "https") {
      console.log(req);

      return NextResponse.redirect(
        `https://${req.headers.get("host")}ffff${req.nextUrl.pathname}`
      );
    }
  }

  return NextResponse.next()
}
