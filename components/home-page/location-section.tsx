import React from 'react';

const LocationSection = () => {
  return (
    <section className="py-12 flex flex-col items-center">
      <h2 className="text-5xl font-light mb-6">Our Location</h2>
      <div className="w-full h-[500px] overflow-hidden">
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.013123456789!2d153.0123456!3d-27.4856789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b915a123456789%3A0xabcdef123456789!2sWest%20End%2C%20Brisbane%20QLD%2C%20Australia!5e0!3m2!1sen!2sau!4v1710000000000!5m2!1sen!2sau"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default LocationSection;