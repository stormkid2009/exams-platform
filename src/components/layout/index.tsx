//import "tailwindcss/tailwind.css"
import Header from "./header"
import Footer from "./footer"



type LayoutProps = {
    children: React.ReactNode;
  }
function Layout({children}:LayoutProps) {
  return (
    <div className='bg-slate-300  w-screen h-screen  flex flex-col '>
        <Header />
        {children}
        <Footer />
        
    </div>
  )
}

export default Layout