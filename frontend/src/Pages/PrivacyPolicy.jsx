import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-md p-10 border border-gray-200">

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>

          <p className="text-gray-500 mb-8">
            Last Updated: 11 March 2026
          </p>

          {/* 1 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
            1. Introduction
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to Nirveena Realty Pvt Ltd ("Company", "we", "our", or "us").
            We respect your privacy and are committed to protecting the
            personal information you share with us.
          </p>

          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you interact with our
            services including:
          </p>

          <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-2">
            <li>Our website</li>
            <li>Property inquiries</li>
            <li>Lead forms</li>
            <li>WhatsApp / phone communication</li>
            <li>Property booking assistance</li>
            <li>Marketing campaigns</li>
          </ul>

          <p className="text-gray-700 mt-4">
            By using our services, you agree to the collection and use of
            information in accordance with this policy.
          </p>

          {/* 2 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            2. Information We Collect
          </h2>

          <p className="font-semibold text-gray-800 mt-4">
            Personal Identification Information
          </p>

          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>City / location</li>
            <li>Property preferences</li>
          </ul>

          <p className="font-semibold text-gray-800 mt-6">
            Property Inquiry Information
          </p>

          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
            <li>Budget range</li>
            <li>Preferred project or builder</li>
            <li>Property type (apartment, villa, plot, commercial)</li>
          </ul>

          <p className="font-semibold text-gray-800 mt-6">
            Technical Information
          </p>

          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Website usage data</li>
            <li>Cookies</li>
          </ul>

          {/* 3 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            3. How We Use Your Information
          </h2>

          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>To respond to property inquiries</li>
            <li>To share property details, pricing, brochures, and availability</li>
            <li>To schedule site visits</li>
            <li>To assist in property booking with developers/builders</li>
            <li>To provide updates on new real estate projects</li>
            <li>To send marketing communications via email, SMS, or WhatsApp</li>
            <li>To improve our services and website experience</li>
          </ul>

          {/* 4 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            4. Sharing of Information
          </h2>

          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Real Estate Developers / Builders for property inquiries or bookings</li>
            <li>CRM and marketing service providers</li>
            <li>Legal or regulatory authorities if required by law</li>
          </ul>

          <p className="text-gray-700 mt-4">
            We do not sell or rent your personal information to third parties.
          </p>

          {/* 5 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            5. Data Security
          </h2>

          <p className="text-gray-700 leading-relaxed">
            We implement reasonable security measures to protect your personal
            information from unauthorized access, disclosure, or misuse.
            However, no method of transmission over the internet is completely
            secure and we cannot guarantee absolute security.
          </p>

          {/* 6 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            6. Cookies and Tracking Technologies
          </h2>

          <p className="text-gray-700">
            Our website may use cookies and similar technologies to:
          </p>

          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
            <li>Improve user experience</li>
            <li>Analyze website traffic</li>
            <li>Remember user preferences</li>
          </ul>

          <p className="text-gray-700 mt-4">
            You may disable cookies through your browser settings.
          </p>

          {/* 7 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            7. Your Rights
          </h2>

          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>

          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us.
          </p>

          {/* 8 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            8. Third-Party Links
          </h2>

          <p className="text-gray-700">
            Our website or communications may contain links to third-party
            websites such as developers’ websites. We are not responsible for
            the privacy practices of those websites.
          </p>

          {/* 9 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            9. Changes to This Privacy Policy
          </h2>

          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date.
          </p>

          {/* 10 */}
          <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">
            10. Contact Us
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Nirveena Realty Pvt Ltd
            <br />
            Address: #202, Share Space, Palm Meadows, Borewell Road,
            Whitefield, Bangalore – 560066
            <br />
            Phone: 9900468686
            <br />
            Email: info@nirveena.com
          </p>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;