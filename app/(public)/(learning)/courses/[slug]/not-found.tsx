import Link from 'next/link';
import AnimateWrapper from '@/components/wrapper/animate-wrapper';

export default function NotFound() {
  return (
    <AnimateWrapper>
      <div className="page-container">
        <div className="width-1600 py-20 p-10 flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-light text-gray-900">Course Not Found</h1>
          <p className="text-gray-600 text-lg">The course you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/courses"
            className="text-blue-600 hover:underline underline-offset-4"
          >
            Return to Courses
          </Link>
        </div>
      </div>
    </AnimateWrapper>
  );
}