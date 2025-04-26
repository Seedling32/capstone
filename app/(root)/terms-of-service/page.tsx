import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of service',
  description: 'Read the terms of service for using Pedal-Pact',
};

const TermsOfServicePage = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>

      <p className="mb-6 text-sm text-muted-foreground text-center">
        Effective Date: 24 April 2025
      </p>

      <div className="space-y-8 text-base leading-relaxed">
        <div>
          <h2 className="h2-bold mb-2">Use of Site</h2>
          <p>
            Pedal Pact provides a platform for cyclists to discover, create, and
            join group rides. You agree to use our site for lawful purposes only
            and in accordance with these terms.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and password, and for all activities under your account.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Content and Ride Listings</h2>
          <p>
            By submitting rides or content, you grant Pedal Pact a license to
            display and distribute your content within our platform.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Safety and Conduct</h2>
          <p>
            Participation in rides is voluntary and at your own risk. You agree
            to ride safely and respect others in the community.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Intellectual Property</h2>
          <p>
            All site content, excluding user-generated content, is owned by
            Pedal Pact and protected by copyright laws.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate these Terms of Service.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">
            Disclaimer and Limitation of Liability
          </h2>
          <p>
            The site is provided &quot;as is&quot; without warranties. Pedal
            Pact is not responsible for any damages arising from use of the site
            or participation in rides.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            site constitutes acceptance of the updated terms.
          </p>
        </div>

        <div>
          <h2 className="h2-bold mb-2">Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of North Carolina,
            USA.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsOfServicePage;
