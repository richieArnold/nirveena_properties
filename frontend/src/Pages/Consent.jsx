import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Consent = () => {
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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-10 border border-gray-200">

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Consent for Property Inquiry
          </h1>

          <p className="text-gray-500 mb-8">
            Last Updated: 11 March 2026
          </p>

          <p className="text-gray-700 leading-relaxed">
            By submitting your contact details on this website, you authorize
            Nirveena Realty Pvt Ltd to contact you regarding property updates,
            project launches, and real estate consultation.
          </p>

          <p className="text-gray-700 mt-4">
            You agree that we may reach you through the following communication channels:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Phone call</li>
            <li>WhatsApp</li>
            <li>SMS</li>
            <li>Email</li>
          </ul>

          <p className="text-gray-700 mt-6">
            These communications may include information about:
          </p>

          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-2">
            <li>Property availability</li>
            <li>New project launches</li>
            <li>Special offers or schemes</li>
            <li>Real estate consultation</li>
          </ul>

          <p className="text-gray-700 mt-6">
            You may opt out of these communications at any time by contacting us.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">
            Contact Information
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Nirveena Realty Pvt Ltd <br/>
            Address: #202, Share Space, Borewell Road, Whitefield,
            Bangalore – 560066 <br/>
            Phone: 9900468686<br/>
            Email: info@nirveena.com
          </p>

        </div>
      </div>
    </div>
  );
};

export default Consent;