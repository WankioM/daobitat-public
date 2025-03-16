"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"

const FaqSection = () => {
  const faqs = [
    {
      question: "What do you want to radically reimagine?",
      answer: "We want to radically reimagine the way people interact with technology and with each other. We believe in creating experiences that bring people together, foster connection, and inspire positive change in the world."
    },
    {
      question: "How do you approach new projects?",
      answer: "Each project begins with deep listening and understanding. We take time to understand your vision, goals, and challenges. Then we collaborate closely with you to develop innovative solutions that align with your objectives while pushing the boundaries of what's possible."
    },
    {
      question: "What industries do you work with?",
      answer: "We work across a diverse range of industries including technology, education, healthcare, and social impact. Our team brings experience from various sectors, allowing us to approach problems from multiple perspectives and create truly innovative solutions."
    },
    {
      question: "How do you measure success?",
      answer: "Success for us goes beyond traditional metrics. While we value efficiency and effectiveness, we also measure success by the positive impact our work has on people's lives, the sustainability of our solutions, and the learning and growth that happens throughout the process."
    },
    {
      question: "Do you offer ongoing support for your projects?",
      answer: "Yes, we believe in building lasting relationships. We offer various levels of ongoing support and maintenance to ensure your project continues to thrive long after the initial launch. Our team is committed to your long-term success."
    },
    {
      question: "How can we start working together?",
      answer: "Starting a collaboration is simple. Reach out to us through our contact form or email, and we'll schedule an initial consultation to discuss your project. From there, we'll develop a tailored approach that meets your specific needs and objectives."
    }
  ];

  return (
    <div className="bg-beige py-16 md:py-24" id="faq">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            Frequently Asked <span className="text-red">Questions</span>
          </h2>
          <p className="text-lg text-dark/80">
            Find answers to common questions about our work, process, and values.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-beige rounded-lg overflow-hidden bg-cream">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium text-dark hover:text-red hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-dark/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-dark/80 mb-6">
            Still have questions? We're here to help!
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-red hover:bg-red/90 text-cream px-6 py-3 rounded-md font-medium transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
