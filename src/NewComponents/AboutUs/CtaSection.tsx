import React from "react";
import { Button } from "./UI/button";

const CtaSection = () => {
  return (
    <div className="bg-dark py-16 md:py-24" id="contact">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-6">
            Ready to <span className="text-red">Get Started</span>?
          </h2>
          <p className="text-lg text-beige mb-8 md:mb-10">
          Let’s Build Something Great Together.
          We’re here to help turn your real estate vision into reality.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-red hover:bg-red/90 text-cream px-8 py-6">
              Contact Us
            </Button>
            <Button className="bg-transparent border border-beige hover:bg-beige/10 text-cream px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
