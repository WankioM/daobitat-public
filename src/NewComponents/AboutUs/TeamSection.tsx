import React from "react";

const TeamSection = () => {
  const team = [
    {
      name: "Jane Smith",
      role: "Founder & CEO",
      bio: "Jane has over 15 years of experience in the industry and is passionate about creating a positive impact.",
      image: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=389&q=80"
    },
    {
      name: "John Doe",
      role: "Chief Operations Officer",
      bio: "John brings a wealth of operational knowledge and has been with the company since its founding days.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
    },
    {
      name: "Sarah Johnson",
      role: "Creative Director",
      bio: "Sarah's innovative approach to design has helped shape our brand identity and creative direction.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
    },
    {
      name: "Michael Chen",
      role: "Lead Developer",
      bio: "Michael is an expert in creating seamless digital experiences with a focus on performance and accessibility.",
      image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
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
            Our diverse team of creative professionals is dedicated to
            delivering exceptional experiences and innovative solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-beige/30 rounded-lg overflow-hidden shadow-sm group">
              <div className="h-64 relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark">{member.name}</h3>
                <p className="text-red font-medium mb-3">{member.role}</p>
                <p className="text-dark/80">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
