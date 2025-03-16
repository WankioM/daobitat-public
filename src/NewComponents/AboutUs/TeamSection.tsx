import React from "react";

const TeamSection = () => {
  const team = [
    {
      name: "Tracy Wankio",
      role: "Co-Founder ",
      bio: "Tracy is an architect turned Web3 developer and the Technical Lead at Daobitat. She drives tech innovation, designing secure, scalable solutions that integrate real-world assets into DeFi, empowering investors and expanding financial access.",
      image:"https://media.licdn.com/dms/image/v2/D4D03AQE2eIp00MXssA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707396291377?e=1747872000&v=beta&t=zDuBfjAqjkXdRN8r-Sjq4Ut7m4GkBw7k8A78YtY7l28"
    },
    {
      name: "Joyce Njeri",
      role: "Co-Founder ",
      bio: "Njeri is a Business Development powerhouse passionate about scaling real-world businesses with technology. With experience in Web3 and market expansion across East Africa, she specializes in business development, operational strategy, and building platforms that enhance trust and efficiency.",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQHQxzILVusQHw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1698177614176?e=1747872000&v=beta&t=yFZh5YbjXPYKowkUiIVJkP1S0FJw2DkdhV1keAS6Kdk"
    },
  ];

  return (
    <div className="bg-cream py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            Meet Our <span className="text-red">Team</span>
          </h2>
          <p className="text-lg text-dark/80">
          For us, home is more than a place—it’s a feeling.
          And we’re here to help you find yours.
          </p>
        </div>

        {/* Added more padding to bring cards away from edges */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="bg-beige/30 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col">
                  {/* Image container with different aspect ratio */}
                  <div className="relative h-72 overflow-hidden">
                    {/* Background blur effect for image edges */}
                    <div className="absolute inset-0 bg-beige/20 z-0"></div>
                    
                    {/* Centered image with object-position set to focus on face */}
                    <div className="absolute inset-4 overflow-hidden rounded-2xl">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Gradient overlay that appears on hover - adding multiple layers for stronger effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Bio text overlay that appears on hover - removed background color since we have gradient now */}
                    <div className="absolute inset-4 rounded-2xl flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <p className="text-cream text-sm md:text-base leading-relaxed overflow-y-auto max-h-full drop-shadow-md">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                  
                  {/* Card content with decorative element */}
                  <div className="p-8 relative">
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-8 right-8 h-1 bg-red/20 rounded-full"></div>
                    
                    <h3 className="text-2xl font-bold text-dark mb-2">{member.name}</h3>
                    <p className="text-red font-medium mb-4 inline-block pb-1 border-b-2 border-red/30">
                      {member.role}
                    </p>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="w-8 h-8 rounded-full bg-red/10"></div>
                      <div className="w-8 h-8 rounded-full bg-red/20"></div>
                      <div className="w-8 h-8 rounded-full bg-red/30"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;