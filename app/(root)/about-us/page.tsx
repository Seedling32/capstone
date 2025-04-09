import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us',
};

const AboutUsPage = () => {
  return (
    <div className="wrapper flex flex-col items-center text-center mb-16">
      <h2 className="h2-bold">Please excuse the construction</h2>
      <p className="mb-16">About page coming soon</p>
      <Image
        src="/images/portrait-home.png"
        width={387}
        height={643}
        alt="Sunrise bike ride with friends."
      />
    </div>
  );
};

export default AboutUsPage;
