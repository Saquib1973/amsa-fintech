import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/secondary-button'
import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'

const page = () => {
  return (
    <AnimateWrapper>
      <div className="w-full">
        <OffWhiteHeadingContainer>
          <div className='flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto'>
          <h1 className="font-light text-7xl">Learn about crypto and get rewarded</h1>
          <p className='text-xl font-light'>
            Build your blockchain knowledge, complete quizzes, and earn free
            crypto.
          </p>
          <div className='flex justify-center items-center my-4'>
          <PrimaryButton className='w-fit'>Get started</PrimaryButton>
          </div>
        </div>
      </OffWhiteHeadingContainer>
      <div className='w-full'>
        <div className='flex flex-col translate-y-[-50px] p-10 rounded bg-gray-50 b-200 text-black items-center justify-center gap-8 max-w-3xl mx-auto'>
          <h1 className="font-light text-7xl">How it works</h1>
          <div className='py-4 flex justify-between relative'>
            <div className='absolute top-[45px] left-0 w-full h-0.5 border-b dashed border-dashed bg-gray-50 border-black' />
            <div className='z-10 flex items-center flex-col justify-center text-center gap-2'>
              <h2 className='bg-yellow-400 rounded-full p-2 w-16 h-16 flex items-center justify-center text-3xl font-light text-black'>1.</h2>
              <p className='text-xl font-light'>
                Learn about crypto and blockchain technology.
              </p>
            </div>
            <div className='z-10 flex items-center flex-col justify-center text-center gap-2'>
              <h2 className='bg-yellow-400 rounded-full p-2 w-16 h-16 flex items-center justify-center text-3xl font-light text-black'>2.</h2>
              <p className='text-xl font-light'>
                Complete quizzes to test your knowledge.
              </p>
            </div>
            <div className='z-10 flex items-center flex-col justify-center text-center gap-2'>
              <h2 className='bg-yellow-400 rounded-full p-2 w-16 h-16 flex items-center justify-center text-3xl font-light text-black'>3.</h2>
              <p className='text-xl font-light'>
                Earn free crypto for your knowledge.
              </p>
            </div>
          </div>
        </div>
        <Courses />
      </div>
    </div>
    </AnimateWrapper>
  )
}

export default page

const Courses = () => {
  const courses = [
    {
      name: 'Blockchain 101',
      description: 'Learn the basics of blockchain technology.',
    },
    {
      name: "Blockchain 102",
      description: "Learn the basics of blockchain technology.",
    },
    {
      name: "Blockchain 103",
      description: "Learn the basics of blockchain technology.",
    },

  ]
  return (
    <div className='width-1600 max-w-3xl py-20'>
      <h1 className='text-5xl font-light my-10'>Courses</h1>

      <div className='flex flex-col gap-4'>
        {courses.map((course) => (
          <div key={course.name} className='flex flex-col gap-4 p-6 rounded-xl b-200'>
            <h2 className='text-2xl font-light'>
              {course.name}
            </h2>
            <p className='text-xl font-light'>
              {course.description}
            </p>
            <div className='flex gap-4 justify-end'>
              <PrimaryButton>Start course</PrimaryButton>
              <SecondaryButton>View course</SecondaryButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
