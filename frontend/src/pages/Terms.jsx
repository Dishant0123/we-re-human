const Terms = () => {
  return (
    <div className="min-h-screen pt-32 px-4 max-w-4xl mx-auto pb-20">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-theme-border dark:border-gray-700 rounded-[32px] p-8 md:p-12 shadow-theme-glass">
        <h1 className="text-4xl font-semibold text-theme-black dark:text-white mb-8 border-b border-theme-border dark:border-gray-700 pb-6">Terms and Conditions</h1>
        
        <div className="space-y-8 text-theme-grey dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-theme-black dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using "We're Human", you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-theme-black dark:text-white mb-3">2. Medical Disclaimer</h2>
            <p>The urgent blood request feature is a communication tool, not a medical service. "We're Human" does not verify the medical history of donors or the medical necessity of requests. All medical procedures must be conducted by certified healthcare professionals at registered medical facilities.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-theme-black dark:text-white mb-3">3. User Conduct</h2>
            <p>Users agree to use the platform solely for lawful purposes. Harassment, spam, or posting fraudulent initiatives will result in immediate account termination.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-theme-black dark:text-white mb-3">4. Limitation of Liability</h2>
            <p>"We're Human" and its developers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform or any interactions between volunteers and NGOs.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;