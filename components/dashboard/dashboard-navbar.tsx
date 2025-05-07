import UserOptions from './user-options'
import AnimateWrapper from './../wrapper/animate-wrapper'

const DashboardNavbar = () => {
  return (
    <div className="sticky top-0 right-0 w-full z-50 border-b border-gray-200 max-md:hidden bg-white p-3">
      <AnimateWrapper>
        <div className="flex justify-end w-full items-center">
          <UserOptions />
        </div>
      </AnimateWrapper>
    </div>
  )
}

export default DashboardNavbar
