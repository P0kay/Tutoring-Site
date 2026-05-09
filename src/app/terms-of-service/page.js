export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Terms and Conditions</h1>

        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">§1. General provisions</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>The service [SERVICE NAME] is available at [URL].</li>
              <li>The owner of the service is [FULL NAME / COMPANY NAME].</li>
              <li>Contact with the service: [EMAIL].</li>
              <li>The service is intended to enable contact between students and tutors providing remote lessons.</li>
              <li>Using the service means accepting these Terms and Conditions.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§2. Definitions</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li><strong>Service</strong> – an online platform enabling contact between users.</li>
              <li><strong>User</strong> – a person using the service.</li>
              <li><strong>Student</strong> – a user looking for tutoring lessons.</li>
              <li><strong>Tutor</strong> – a user offering educational services.</li>
              <li><strong>Account</strong> – an individual user account in the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§3. Registration and account</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>Creating an account requires providing true and accurate data.</li>
              <li>The user is responsible for the security of their account and password.</li>
              <li>Sharing an account with third parties is prohibited.</li>
              <li>A user may have only one account, unless the service explicitly allows otherwise.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§4. User age</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>The service may be used by persons who are at least 16 years old.</li>
              <li>Persons under the age of 16 may use the service only with the consent of a parent or legal guardian.</li>
              <li>Only a person who is at least 18 years old and has full legal capacity may become a tutor.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§5. Rules of service operation</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>The service enables contact between students and tutors.</li>
              <li>The service is not a party to any agreement concluded between users.</li>
              <li>All arrangements regarding tutoring lessons are made directly between users.</li>
              <li>The service does not guarantee tutor availability or learning outcomes.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§6. User obligations</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>The user undertakes to provide true and accurate data.</li>
              <li>The user undertakes to use the service in accordance with the law and good practices.</li>
              <li>Publishing unlawful content is prohibited.</li>
              <li>Impersonating other persons is prohibited.</li>
              <li>Using the service for fraud or actions that infringe the rights of others is prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§7. Payments</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>Payments for tutoring lessons may be made only by adults or their legal guardians.</li>
              <li>The service may intermediate in payments, but it is not a party to the agreement between users.</li>
              <li>The service is not responsible for payments made by unauthorized persons.</li>
              <li>Payment details may be processed through external payment operators.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§8. Liability</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>The service is not responsible for the quality of services provided by tutors.</li>
              <li>The service is not responsible for the non-performance or improper performance of tutoring lessons.</li>
              <li>The service is not responsible for the actions of users.</li>
              <li>The service is not responsible for technical interruptions, failures, or problems resulting from the operation of the Internet or external services.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§9. Account deletion</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>The user may delete their account at any time.</li>
              <li>The service has the right to delete an account or restrict access to an account in the event of a violation of these Terms and Conditions.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§10. Personal data</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>Users’ personal data is processed in accordance with the Privacy Policy.</li>
              <li>The scope and purposes of data processing are described in a separate Privacy Policy available in the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§11. Changes to the Terms and Conditions</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>The service reserves the right to change these Terms and Conditions.</li>
              <li>Users will be informed about changes through the service or by e-mail.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">§12. Contact</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7">
              <li>Contact with the service: [EMAIL].</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}