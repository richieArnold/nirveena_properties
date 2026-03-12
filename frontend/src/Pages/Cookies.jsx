import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Cookies = () => {
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
            Cookie Policy
          </h1>

          <p className="text-gray-500 mb-8">
            Last Updated: 11 March 2026
          </p>

          {/* 1 */}
          <h2 className="text-xl font-semibold mt-8 mb-3">
            1. Introduction
          </h2>

          <p className="text-gray-700 leading-relaxed">
            This Cookie Policy explains how Nirveena Realty Pvt Ltd (“we”,
            “our”, or “us”) uses cookies and similar tracking technologies
            when you visit our website https://www.nirveena.com/.
          </p>

          <p className="text-gray-700 mt-4">
            Cookies help us improve your browsing experience and understand
            how users interact with our website.
          </p>

          <p className="text-gray-700 mt-4">
            By continuing to browse or use our website, you agree to our
            use of cookies in accordance with this policy.
          </p>

          {/* 2 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            2. What Are Cookies
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Cookies are small text files stored on your device
            (computer, tablet, or mobile phone) when you visit a website.
          </p>

          <p className="text-gray-700 mt-4">
            They help websites function properly, remember user preferences,
            and provide insights into website performance.
          </p>

          {/* 3 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            3. Types of Cookies We Use
          </h2>

          <p className="font-semibold text-gray-800 mt-4">
            Essential Cookies
          </p>

          <p className="text-gray-700 mt-2">
            These cookies are necessary for the website to function properly.
            They enable basic features such as page navigation and secure
            access to certain areas of the website.
          </p>

          <p className="font-semibold text-gray-800 mt-6">
            Performance and Analytics Cookies
          </p>

          <p className="text-gray-700 mt-2">
            These cookies collect information about how visitors use our
            website, such as:
          </p>

          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-2">
            <li>Pages visited</li>
            <li>Time spent on the site</li>
            <li>Traffic sources</li>
          </ul>

          <p className="text-gray-700 mt-4">
            This helps us improve website performance and user experience.
            Examples include tools such as Google Analytics.
          </p>

          <p className="font-semibold text-gray-800 mt-6">
            Marketing and Advertising Cookies
          </p>

          <p className="text-gray-700 mt-2">
            These cookies may be used to:
          </p>

          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-2">
            <li>Show relevant property advertisements</li>
            <li>Measure advertising campaign performance</li>
            <li>Retarget visitors through platforms like Google Ads or social media</li>
          </ul>

          <p className="font-semibold text-gray-800 mt-6">
            Functional Cookies
          </p>

          <p className="text-gray-700 mt-2">
            These cookies allow the website to remember choices you make,
            such as:
          </p>

          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-2">
            <li>Preferred location</li>
            <li>Property preferences</li>
            <li>Language settings</li>
          </ul>

          <p className="text-gray-700 mt-4">
            This helps provide a more personalized experience.
          </p>

          {/* 4 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            4. Third-Party Cookies
          </h2>

          <p className="text-gray-700">
            Some cookies may be placed by third-party services we use,
            such as:
          </p>

          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-2">
            <li>Analytics providers</li>
            <li>Advertising platforms</li>
            <li>CRM and marketing tools</li>
          </ul>

          <p className="text-gray-700 mt-4">
            These third parties may collect information about your online
            activities over time and across different websites.
          </p>

          {/* 5 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            5. Managing Cookies
          </h2>

          <p className="text-gray-700">
            You can control or disable cookies through your browser settings.
          </p>

          <p className="text-gray-700 mt-3">
            Most browsers allow you to:
          </p>

          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-2">
            <li>View stored cookies</li>
            <li>Delete cookies</li>
            <li>Block cookies from specific websites</li>
            <li>Block all cookies</li>
          </ul>

          <p className="text-gray-700 mt-4">
            Please note that disabling cookies may affect certain
            functionalities of our website.
          </p>

          {/* 6 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            6. Updates to This Cookie Policy
          </h2>

          <p className="text-gray-700">
            We may update this Cookie Policy periodically to reflect
            changes in technology, legal requirements, or our business
            practices.
          </p>

          <p className="text-gray-700 mt-4">
            Any updates will be posted on this page with a revised date.
          </p>

          {/* 7 */}
          <h2 className="text-xl font-semibold mt-10 mb-3">
            7. Contact Us
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Nirveena Realty Pvt Ltd <br />
            Address: #202, Sharespace, Borewell Road, Whitefield,
            Bangalore – 560066 <br />
            Phone: 9731658272 <br />
            Email: info@nirveena.com
          </p>

        </div>
      </div>
    </div>
  );
};

export default Cookies;