import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-md p-10 border border-gray-200">

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Terms and Conditions
          </h1>

          <p className="text-gray-500 mb-8">
            Last Updated: 11 March 2026
          </p>

          {/* 1 */}
          <h2 className="text-xl font-semibold mt-8 mb-3">1. Introduction</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to Nirveena Realty Pvt Ltd (“Company”, “we”, “our”, or “us”).
          </p>

          <p className="text-gray-700 leading-relaxed">
            These Terms and Conditions govern your use of our services including:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Website access</li>
            <li>Property inquiries</li>
            <li>Lead submissions</li>
            <li>Marketing communications</li>
            <li>Property consultation and booking assistance</li>
          </ul>

          <p className="text-gray-700 mt-4">
            By accessing our services or submitting your details, you agree to
            comply with these Terms.
          </p>

          {/* 2 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            2. Nature of Services
          </h2>

          <p className="text-gray-700">
            Nirveena Realty Pvt Ltd acts as a Real Estate Channel Partner /
            Property Consultant assisting customers in:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Discovering real estate projects</li>
            <li>Providing project information</li>
            <li>Arranging property site visits</li>
            <li>Facilitating communication between buyers and developers</li>
            <li>Assisting with booking procedures</li>
          </ul>

          <p className="text-gray-700 mt-4">
            We do not own the properties unless explicitly stated.
            All project details, pricing, availability, and offers are
            provided by the respective developers/builders.
          </p>

          {/* 3 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            3. Property Information Disclaimer
          </h2>

          <p className="text-gray-700">
            While we strive to provide accurate information:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Property specifications</li>
            <li>Pricing</li>
            <li>Availability</li>
            <li>Possession timelines</li>
            <li>Offers and schemes</li>
          </ul>

          <p className="text-gray-700 mt-4">
            These may change without prior notice. Users are advised to verify
            all details directly with the developer before making any purchase decision.
          </p>

          {/* 4 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            4. No Guarantee of Investment Returns
          </h2>

          <p className="text-gray-700">
            Any information regarding:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Property appreciation</li>
            <li>Rental returns</li>
            <li>Investment potential</li>
          </ul>

          <p className="text-gray-700 mt-4">
            is indicative only and should not be considered financial advice
            or guaranteed returns.
          </p>

          {/* 5 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            5. User Responsibilities
          </h2>

          <p className="text-gray-700">
            By using our services, you agree that:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>The information you provide is accurate and truthful.</li>
            <li>You will not misuse our website or services.</li>
            <li>You will not attempt unauthorized access to our systems.</li>
          </ul>

          {/* 6 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            6. Site Visits and Bookings
          </h2>

          <p className="text-gray-700">
            We may assist in:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Scheduling property site visits</li>
            <li>Connecting you with developer representatives</li>
            <li>Assisting with booking documentation</li>
          </ul>

          <p className="text-gray-700 mt-4">
            However, the final transaction, agreement, and payment are made
            directly between the buyer and developer.
          </p>

          {/* 7 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            7. Marketing Communication Consent
          </h2>

          <p className="text-gray-700">
            By submitting your contact information, you consent to receive:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Property updates</li>
            <li>Project launches</li>
            <li>Promotional offers</li>
            <li>Marketing messages via phone, SMS, email, or WhatsApp</li>
          </ul>

          <p className="text-gray-700 mt-4">
            You may opt out of such communications at any time.
          </p>

          {/* 8 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            8. Intellectual Property
          </h2>

          <p className="text-gray-700">
            All content on our website including text, images, logos,
            marketing materials, and project information formatting
            belongs to Nirveena Realty Pvt Ltd or respective developers
            and may not be reproduced without permission.
          </p>

          {/* 9 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            9. Limitation of Liability
          </h2>

          <p className="text-gray-700">
            Nirveena Realty Pvt Ltd shall not be held liable for:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Developer delays</li>
            <li>Project cancellations</li>
            <li>Changes in pricing or specifications</li>
            <li>Financial losses related to property investments</li>
          </ul>

          <p className="text-gray-700 mt-4">
            All purchase decisions are made solely at the buyer’s discretion.
          </p>

          {/* 10 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            10. Third-Party Developers
          </h2>

          <p className="text-gray-700">
            Properties listed or marketed may belong to third-party developers.
            We do not control or guarantee the performance, quality,
            or delivery of such projects.
          </p>

          {/* 11 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            11. Privacy
          </h2>

          <p className="text-gray-700">
            Your personal information will be handled according to our Privacy Policy.
          </p>

          {/* 12 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            12. Modification of Terms
          </h2>

          <p className="text-gray-700">
            We reserve the right to modify these Terms at any time.
            Updated terms will be posted on this page with the revised date.
          </p>

          {/* 13 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            13. Governing Law
          </h2>

          <p className="text-gray-700">
            These Terms shall be governed by and interpreted in accordance
            with the laws of India, and disputes fall under the jurisdiction
            of the courts of Bangalore, Karnataka.
          </p>

          {/* 14 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            14. Contact Information
          </h2>

          <p className="text-gray-700">
            Nirveena Realty Pvt Ltd <br/>
            Address: #202, Share Space, Borewell Road, Whitefield,
            Bangalore – 560066 <br/>
            Phone: 9900468686 <br/>
            Email: info@nirveena.com
          </p>

        </div>
      </div>
    </div>
  );
};

export default Terms;