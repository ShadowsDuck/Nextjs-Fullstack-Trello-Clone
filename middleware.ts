import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])

export default clerkMiddleware(async (auth, req) => {
  const isPublic = isPublicRoute(req)
  const url = req.nextUrl

  if (!isPublic) {
    await auth.protect() // จะ throw ถ้าไม่ล็อกอิน
  }

  const { userId, orgId } = await auth()

  // 🟡 ถ้าไม่ล็อกอิน และเข้า route ที่ไม่ใช่ public → redirect ไปหน้า sign-in
  if (!userId && !isPublic) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('returnBackUrl', req.url) // เพิ่มการกลับหลังจาก login
    return NextResponse.redirect(signInUrl)
  }

  // 🟢 ถ้าล็อกอินแล้ว แต่เข้าหน้า public → redirect ไป select-org หรือ organization/orgId
  if (userId && isPublic) {
    let path = '/select-org'
    if (orgId) {
      path = `/organization/${orgId}`
    }

    return NextResponse.redirect(new URL(path, req.url))
  }

  // 🔵 ถ้าล็อกอิน แต่ยังไม่ได้เลือก org → บังคับไป select-org
  if (userId && !orgId && url.pathname !== '/select-org') {
    return NextResponse.redirect(new URL('/select-org', req.url))
  }

  // ✅ ปล่อยให้เข้าได้ตามปกติ
  return NextResponse.next()
})

export const config = {
  matcher: [
    // ข้ามไฟล์ static
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // ตรวจสอบ API routes เสมอ
    '/(api|trpc)(.*)',
  ],
}
