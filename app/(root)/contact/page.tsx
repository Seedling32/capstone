import { Metadata } from 'next';
import ContactForm from './contact-form';

export const metadata: Metadata = {
  title: 'Contact',
};

const ContactPage = () => {
  return (
    <div>
      <section className="flex flex-col justify-center items-center mb-4 min-h-96 text-white text-center bg-crank-hero bg-center relative">
        <div className="absolute top-10 flex justify-center items-center mx-auto md:top-[180px] md:left-20">
          <h1 className="text-left text-5xl font-bold pr-2 text-shadow uppercase max-w-[475px]">
            Get in touch
          </h1>
        </div>
      </section>
      <section className="bg-muted bg-gradient-to-t from-transparent to-background shadow-xl rounded-xl pt-16 my-16 max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="h2-bold capitalize mb-6">Send us a message</h2>
          <p className="mt-4 text-lg font-semibold">
            We&apos;d love to hear from you — whether it&apos;s feedback,
            questions, or just to say hi!
          </p>
          <p className="text-lg">
            Fill out the form below, and we&apos;ll get back to you soon!
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
