import UserOptions from './user-options'
import AnimateWrapper from './../wrapper/animate-wrapper'
import NotificationBell from '../notifications/notification-bell'

const DashboardNavbar = () => {
  return (
    <div className="sticky top-0 right-0 w-full z-50 border-b border-gray-200 max-lg:hidden bg-white p-3">
      <AnimateWrapper>
        <div className="flex justify-end w-full items-center gap-4">
          <NotificationBell />
          <UserOptions />
        </div>
      </AnimateWrapper>
    </div>
  )
}

export default DashboardNavbar
