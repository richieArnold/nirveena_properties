import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ReraDisclosure = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 text-sm sm:text-base"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 border border-gray-200">

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            RERA Disclosure
          </h1>

          <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
            Last Updated: 11 March 2026
          </p>

          {/* Content */}
          <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
            Nirveena Realty Pvt Ltd (Individual RERA Holder – Naveen Yadav)
            acts as a real estate marketing and channel partner for multiple
            real estate developers.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
            Project details displayed on this website are sourced from the
            respective developers.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
            Buyers are advised to verify the RERA registration details of each
            project on the official Karnataka RERA website before making any
            property investment.
          </p>

          {/* Official Website Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-gray-800 font-medium mb-1 text-sm sm:text-base">
              Official Karnataka RERA Website:
            </p>

            <a
              href="https://rera.karnataka.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold break-words text-sm sm:text-base"
            >
              https://rera.karnataka.gov.in
            </a>
          </div>

          <p className="text-gray-700 leading-relaxed mt-6 text-sm sm:text-base">
            Nirveena Realty Pvt Ltd (Individual RERA Holder – Naveen Yadav)
            may receive marketing or referral fees from developers for
            successful bookings.
          </p>

          {/* RERA Number Box */}
          <div className="mt-8 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              RERA Registration Number
            </h2>

            <p className="text-gray-800 font-medium break-words text-sm sm:text-base">
              PRM/KA/RERA/1251/309/AG/251216/006621
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReraDisclosure;