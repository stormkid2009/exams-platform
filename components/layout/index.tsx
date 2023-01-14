import "tailwindcss/tailwind.css"
import Header from "./header"
import Footer from "./footer"



type LayoutProps = {
    children: React.ReactNode;
  }
function Layout({children}:LayoutProps) {
  return (
    <div className='bg-sky-400 text-white w-screen h-screen  flex flex-col '>
        <Header />
        {children}
        <Footer />
        
    </div>
  )
}

export default Layout