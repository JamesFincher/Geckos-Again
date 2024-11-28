import Navbar from '../../components/Navbar/Navbar'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default MainLayout
