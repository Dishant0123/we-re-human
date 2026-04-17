import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is We're Human?",
      answer: "We're Human is a centralized platform designed to connect passionate volunteers with Non-Governmental Organizations (NGOs) for community initiatives and urgent blood donations."
    },
    {
      question: "Is it free to register?",
      answer: "Yes! Registration is 100% free for both volunteers and NGOs. Our mission is impact, not profit."
    },
    {
      question: "How do urgent blood requests work?",
      answer: "When a blood request is posted, it is instantly visible on the community feed. Volunteers with matching blood types can immediately register to coordinate the donation directly through our real-time chat."
    },
    {
      question: "How are NGOs verified?",
      answer: "Currently, NGO accounts are monitored by our admin team. In the future, we will roll out a verified badge system requiring official documentation to ensure maximum platform trust."
    }
  ];

  return (
    <div className="min-h-screen pt-32 px-4 max-w-3xl mx-auto pb-20">
      <h1 className="text-4xl md:text-5xl font-semibold text-theme-black tracking-tight mb-4 text-center dark:text-white">Frequently Asked Questions</h1>
      <p className="text-theme-grey text-lg text-center mb-12">Everything you need to know about the platform.</p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-theme-border dark:border-gray-700 rounded-[20px] overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
            >
              <span className="font-medium text-lg text-theme-black dark:text-white">{faq.question}</span>
              {openIndex === index ? <ChevronUp className="text-theme-teal" /> : <ChevronDown className="text-theme-grey" />}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-6 text-theme-grey dark:text-gray-300 animate-in fade-in duration-200 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;