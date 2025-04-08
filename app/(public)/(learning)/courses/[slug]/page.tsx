'use client'

import { notFound, useParams } from 'next/navigation'
import AnimateWrapper from '@/components/wrapper/animate-wrapper'
import Link from 'next/link'
import { courses } from '@/content/courses'
import YouTubePlayer from '@/components/youtube-player'
import { useState } from 'react'
import Image from 'next/image'
import { moveToTop } from '@/lib/utils'
interface Lecture {
  videoId: string
  title: string
  description: string
}
export default function CoursePage() {
  const params = useParams()
  const course = courses[params.slug as string]
  if (!course) {
    notFound()
  }
  const [selectedLecture, setSelectedLecture] = useState(course.lectures[0])
  const handleLessonChange = (lecture: Lecture) => {
    setSelectedLecture(lecture)
    moveToTop(100)
  }
  return (
    <AnimateWrapper>
      <div className="width-1240 p-10 flex flex-col gap-10">
        <div className="flex items-center gap-2 text-xl font-light">
          <Link href="/courses" className="underline underline-offset-4">
            Courses
          </Link>
          <span>/</span>
          <span className="line-clamp-1">{course.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <YouTubePlayer
                videoId={selectedLecture.videoId}
                title={selectedLecture.title}
              />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-light">{selectedLecture.title}</h3>
              <p className="text-gray-600 mt-2">
                {selectedLecture.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-light mb-6">Course Lectures</h2>

          <div className="lg:hidden flex flex-col gap-2">
            {course.lectures.map((lecture, index) => (
              <button
                key={lecture.videoId}
                className={`flex items-center border-2 gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedLecture.videoId === lecture.videoId
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => setSelectedLecture(lecture)}
              >
                <div className="w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    width={96}
                    height={96}
                    src={`https://img.youtube.com/vi/${lecture.videoId}/maxresdefault.jpg`}
                    alt={lecture.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-light truncate">
                    {index + 1}. {lecture.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {lecture.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-6">
            {course.lectures.map((lecture, index) => (
              <button
                key={lecture.videoId}
                className={`flex flex-col border-2 gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                  selectedLecture.videoId === lecture.videoId
                    ? 'bg-blue-50  border-blue-400'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => handleLessonChange(lecture)}
              >
                <div className="aspect-video rounded-lg overflow-hidden">
                  <Image
                    width={144}
                    height={144}
                    src={`https://img.youtube.com/vi/${lecture.videoId}/maxresdefault.jpg`}
                    alt={lecture.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-light">
                    {index + 1}. {lecture.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{lecture.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-gray-400">Instructor: {course.instructor}</div>
          <p className="text-gray-500">{course.description}</p>
        </div>
      </div>
    </AnimateWrapper>
  )
}
