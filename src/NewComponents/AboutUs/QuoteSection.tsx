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
      question: "How secure is the platform?",
      answer: "While I'd love to spare you the countless security measures we have in place, just know that your safety is our top priority. We use advanced encryption and secure authentication to protect your data and transactions, and we regularly audit our systems to keep everything airtight. Plus, we're ACCDDID compliant and follow strict AML and KYC regulations, so every transaction is transparent, secure, and fraud-free."
    },
    {
      question: "How is Daobitat different from other real estate platforms?",
      answer: "While most platforms just show you property listings, we take it a step further. We use blockchain to guarantee transparency and security in every deal, with verified listings, escrow protection to keep your money safe while the fine print gets sorted, and multiple payment options—crypto, mobile money, or traditional banking. So whether you're buying or renting, you can verify ownership and close the deal with confidence, minus the usual headaches."
    },
    {
      question: "How do I benefit as a property developer/owner from Daobitat?",
      answer: "We help you reach serious buyers and renters quickly, with verified listings that make decision-making easier for home searchers. Beyond just giving you visibility, we also reduce fraud risks for your potential customers by verifying ownership and securing transactions through escrow. This creates trust, increases buyer confidence, and ultimately helps more people invest in real estate—maximizing your ROI in the process."
    },
    {
      question: "How do I benefit as a home searcher?",
      answer: "Finding a home should be easy and stress-free, and that's exactly what Daobitat offers. Our verified listings mean you don't waste time on fake or misrepresented properties, and our escrow service ensures your money is safe until everything is finalized. You can search, compare, and even transact using multiple payment options—including crypto, mobile money, and traditional banking—all in one place. Plus, with real-time updates on property availability, you'll never miss out on your dream home."
    },
    {
      question: "I dont want to miss out, How do I get started?",
      answer: <>No More FOMO. <a href="https://daobitat-frontend.vercel.app/login" className="text-red hover:underline">Sign up</a> <a href="https://daobitat-frontend.vercel.app/login" className="text-red hover:underline">now</a> and explore verified properties, hassle-free!.</>
    },
    {
      question: "Can I get financing or mortgage options through Daobitat??",
      answer: "We're working on it! Soon, you'll be able to access financing options through our trusted partners, helping you buy property without paying everything upfront."
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
            Want to have a longer conversation with us?!
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