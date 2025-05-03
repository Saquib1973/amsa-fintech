'use client'

import OffWhiteHeadingContainer from '@/components/containers/offwhite-heading-container'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import Link from 'next/link'
import { courses } from '@/content/courses'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/secondary-button'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const CoursesPage = () => {
  const [lastWatchedLecture, setLastWatchedLecture] = useState<{
    courseSlug: string;
    lectureId: string;
    lectureTitle: string;
  } | null>(null);

  useEffect(() => {
    const lastWatched = localStorage.getItem('lastWatchedLecture');
    if (lastWatched) {
      setLastWatchedLecture(JSON.parse(lastWatched));
    }
  }, []);

  const courseList = Object.entries(courses).map(([id, course]) => ({
    id,
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    thumbnail: course.thumbnail,
  }));

  return (
    <AnimateWrapper>
      <div className="page-container">
        <OffWhiteHeadingContainer>Courses</OffWhiteHeadingContainer>
        <div className="width-1600 py-20 p-10 flex flex-col gap-10">
          <h1 className="text-xl font-light">
            <span className="underline underline-offset-4">Home</span>
            {` / Courses`}
          </h1>

          {lastWatchedLecture && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h2 className="text-xl font-light mb-2">Continue Learning</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    width={96}
                    height={96}
                    src={courses[lastWatchedLecture.courseSlug].thumbnail}
                    alt={courses[lastWatchedLecture.courseSlug].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-light">{courses[lastWatchedLecture.courseSlug].title}</h3>
                  <p className="text-gray-600">{lastWatchedLecture.lectureTitle}</p>
                  <Link
                    href={`/courses/${lastWatchedLecture.courseSlug}?lecture=${lastWatchedLecture.lectureId}`}
                    className="text-blue-600 hover:underline"
                  >
                    Continue watching →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {courseList.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                instructor={course.instructor}
                thumbnail={course.thumbnail}
                link={`/courses/${course.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimateWrapper>
  )
}

export default CoursesPage

interface CourseCardProps {
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  link: string;
}

const CourseCard = ({ title, description, instructor, thumbnail, link }: CourseCardProps) => {
  return (
    <div className='flex flex-col gap-4 p-6 rounded-xl b-200'>
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
          <Image
            width={128}
            height={128}
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className='text-2xl font-light'>{title}</h2>
          <p className='text-xl font-light text-gray-600'>{instructor}</p>
          <p className='text-xl font-light'>{description}</p>
        </div>
      </div>
      <div className='flex gap-4 justify-end'>
        <Link href={link}>
          <PrimaryButton>Start course</PrimaryButton>
        </Link>
        <Link href={link}>
          <SecondaryButton>View course</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}