import React from "react";

const MissionSection = () => {
  return (
    <div className="bg-beige py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            Let's Imagine <span className="text-red">Worlds Worth Building</span>
          </h2>
          <p className="text-lg text-dark/80">
            At the core of our work is a commitment to imagine and build
            worlds that reflect our values and inspire change.
            We believe in creating projects that matter, making a positive
            impact to our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-cream rounded-lg p-8 shadow-sm">
            <div className="w-12 h-12 bg-red/10 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
                <path d="M20 7h-9"></path>
                <path d="M14 17H5"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">Possibility</h3>
            <p className="text-dark/80">
              We explore the frontiers of what's possible. We embrace
              change and use our imagination to envision new futures that
              break from the status quo.
            </p>
          </div>

          <div className="bg-cream rounded-lg p-8 shadow-sm">
            <div className="w-12 h-12 bg-red/10 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                <path d="m8 11 3 3 5-5"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">Radical Honesty</h3>
            <p className="text-dark/80">
              We tell the truth, even when it's hard. We believe
              that radical honesty is the foundation of trust, and
              trust is essential for building meaningful relationships.
            </p>
          </div>

          <div className="bg-cream rounded-lg p-8 shadow-sm">
            <div className="w-12 h-12 bg-red/10 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">Capacity Building</h3>
            <p className="text-dark/80">
              We build our collective capacity to learn, grow, and
              adapt. We invest in our people and communities, knowing
              that our strength comes from our shared knowledge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;
