export default function Privacy() {
  return (
    <div className="bg-dark min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8">Privacy Policy</h1>
        <p className="text-body-dark mb-4">Last Updated: October 2023</p>
        
        <div className="prose prose-invert max-w-none text-body-dark">
          <p className="mb-6">At Liquid Broker, we are committed to protecting your privacy and ensuring the security of your personal information.</p>
          
          <h2 className="text-white text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us, including your name, email address, phone number, date of birth, financial information, and identification documents required for KYC (Know Your Customer) compliance.</p>
          
          <h2 className="text-white text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Process your account application and verify your identity</li>
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions and execute trades</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Comply with legal and regulatory obligations</li>
          </ul>
          
          <h2 className="text-white text-xl font-bold mt-8 mb-4">3. Data Security</h2>
          <p className="mb-4">We implement appropriate technical and organizational security measures designed to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.</p>

          <h2 className="text-white text-xl font-bold mt-8 mb-4">4. Your Rights</h2>
          <p className="mb-4">Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal data. You may also have the right to data portability and to withdraw consent where processing is based on consent.</p>
        </div>
      </div>
    </div>
  );
}
