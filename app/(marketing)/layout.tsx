import Footer from './_components/Footer'
import Navbar from './_components/Navbar'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="bg-slate-100 pt-40 pb-20"></main>
      {children}
      <Footer />
    </div>
  )
}
export default MarketingLayout
