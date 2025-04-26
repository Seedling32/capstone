import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'Learn how Pedal Pact collects, uses, and protects your personal information.',
};

const PrivacyPolicyPage = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

      <p className="mb-6 text-sm text-muted-foreground text-center">
        Effective Date: 24 April 2025
      </p>

      <div className="space-y-8 text-base leading-relaxed">
        <div>
          <h2 className="h2-bold mb-2">Information We Collect</h2>
          <p>
            We collect personal information such as your name, email address,
            and ride activity when you use Pedal Pact.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">How We Use Your Information</h2>
          <p>
            Your information is used to manage your account, display rides,
            communicate updates, and improve our services.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share limited data
            with trusted service providers to operate our platform.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Cookies and Tracking</h2>
          <p>
            We use cookies to enhance your experience, such as maintaining your
            login session. You can adjust cookie settings in your browser.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Data Security</h2>
          <p>
            We implement reasonable security measures to protect your
            information, but no system can be guaranteed completely secure.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. To make a request, please contact us at [Insert support
            email].
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Changes to this Privacy Policy</h2>
          <p>
            We may update this policy. Updates will be posted on this page with
            the new effective date.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
