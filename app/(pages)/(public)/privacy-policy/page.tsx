import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | AMSA Fintech and IT solutions',
  description: 'Privacy Policy of AMSA Fintech and IT Solutions Pty Ltd',
  keywords: 'privacy policy, AMSA Fintech and IT solutions',
}

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-5xl mb-8">
        Privacy Policy of AMSA Fintech and IT Solutions Pty Ltd{' '}
      </h1>

      <div className="space-y-6">
        <section>
          <p className="mb-4">
            Amsa Fintech and IT Solutions Pty Ltd (ABN 19 671 931 776),
            operating as &quot;AMSA,&quot; along with any affiliated entities or related
            corporate bodies (referred to here as &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), is
            committed to protecting your privacy and respecting your personal
            information.
          </p>
          <p className="mb-4">
            This Privacy Policy outlines how we gather, use, store, and share
            your personal information. We comply with the Australian Privacy
            Principles in the Privacy Act. By providing us with your personal
            information, you agree to our collection, use, and disclosure
            practices as described in this Privacy Policy, as well as any
            related policies.
          </p>
          <p>
            We may update our Privacy Policy from time to time by posting
            changes on our website without prior notice. We recommend reviewing
            the Privacy Policy on our website regularly to stay informed.
          </p>
        </section>

        <section>
          <h2 className="text-3xl mb-4">
            What Personal Information Do We Collect?
          </h2>
          <p className="mb-4">
            Personal information includes any data that can be used to identify
            you, either directly or indirectly. We may collect such information
            to facilitate your use of www.amsafintech.com (the &quot;Site&quot;) and to
            provide our services to you.
          </p>
          <p className="mb-4">
            You may choose not to share certain personal information, but this
            could restrict or prevent us from providing our services.
          </p>
          <p className="mb-4">
            We may collect the following personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name</li>
            <li>Date of birth</li>
            <li>Mailing and residential address</li>
            <li>Email address</li>
            <li>Phone number and other contact details</li>
            <li>
              Photographic identification, including driver&apos;s license or
              passport
            </li>
            <li>
              Banking information, such as account numbers for processing
              transfers
            </li>
            <li>Transaction details</li>
            <li>
              Device ID, type, geo-location, computer and connection
              information, page views, traffic data, ad data, IP address, and
              standard web log information
            </li>
            <li>
              For businesses, Australian Business Number (ABN), registration
              details, shareholder, director, and secretary information, trust
              deeds, and documents required for enterprise KYC
            </li>
            <li>
              Details about the services we provide to you or that you have
              inquired about
            </li>
            <li>Information you provide through customer surveys</li>
            <li>
              Any other personal information needed to facilitate our business
              with you
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl mb-4">
            How Do We Use Your Personal Information?
          </h2>
          <p className="mb-4">
            We may collect and use your personal information for purposes
            including, but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Enabling you to access and use the Site and our services</li>
            <li>Opening and managing your account</li>
            <li>Providing you with unique transfer details</li>
            <li>Verifying your identity via a third-party provider</li>
            <li>
              Sending you service updates, reminders, support and administrative
              messages
            </li>
            <li>Sending you marketing and promotional information</li>
            <li>
              Administering rewards, surveys, contests, or other promotional
              events
            </li>
            <li>
              Operating, protecting, improving, and optimizing our Site and
              services
            </li>
            <li>Meeting legal obligations and resolving disputes</li>
            <li>Reviewing your application for employment</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl mb-4">
            Storage and Security of Your Personal Information
          </h2>
          <p className="mb-4">
            We implement several physical, administrative, and technical
            measures to protect your personal information from unauthorized
            access, misuse, interference, or loss. Security practices include
            SSL encryption, pseudonymization, data access restrictions, and
            strict building and file access controls.
          </p>
          <p className="mb-4">
            However, we cannot guarantee complete security over the Internet or
            in electronic storage. We encourage you to take your own safety
            precautions to protect your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-3xl mb-4">Contact Us</h2>
          <p className="mb-4">
            To lock your account, make a complaint, or access or correct your
            personal information, contact us by email at{' '}
            <a
              href="mailto:support@amsafintech.com"
              className="text-blue-600 hover:underline"
            >
              support@amsafintech.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy