import UserOptions from './user-options'
import AnimateWrapper from '../../wrapper/animate-wrapper'
import SearchBar from './search-bar'
import NotificationBell from './notifications/notification-bell'

const DashboardNavbar = () => {
  return (
    <div className="sticky top-0 right-0 w-full z-50 border-b border-gray-200 max-lg:hidden bg-white p-3">
      <AnimateWrapper>
        <div className="flex justify-between w-full items-center">
          <SearchBar />
          <div className="flex justify-end items-center gap-4">
            <NotificationBell />
            <UserOptions />
          </div>
        </div>
      </AnimateWrapper>
    </div>
  )
}

export default DashboardNavbar
