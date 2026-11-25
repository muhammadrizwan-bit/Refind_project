
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const statistics = [
    {
      title: "Items Lost",
      value: "—",
      color: "text-blue-600",
      background: "bg-blue-50",
    },
    {
      title: "Items Found",
      value: "—",
      color: "text-green-600",
      background: "bg-green-50",
    },
    {
      title: "Items Returned",
      value: "—",
      color: "text-purple-600",
      background: "bg-purple-50",
    },
    {
      title: "Claims Submitted",
      value: "—",
      color: "text-orange-600",
      background: "bg-orange-50",
    },
  ];

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Not available";

  const initial = user.name?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="max-w-5xl mx-auto">

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account and track your ReFind activity.
          </p>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">

          <div className="flex flex-col sm:flex-row items-center gap-5">

            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-bold">
              {initial}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.name}
              </h2>

              <p className="text-gray-500 mt-1">
                {user.email}
              </p>

              <p className="text-sm text-blue-600 font-medium mt-2">
                ReFind Member
              </p>
            </div>

          </div>

          <hr className="my-6" />

          {/* Personal Details */}
          <h3 className="text-lg font-bold text-gray-800 mb-5">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-400 mb-1">
                Full Name
              </p>

              <p className="font-medium text-gray-800">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">
                Email Address
              </p>

              <p className="font-medium text-gray-800 break-all">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">
                Contact Number
              </p>

              <p className="font-medium text-gray-800">
                {user.contact}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">
                Account Created
              </p>

              <p className="font-medium text-gray-800">
                {joinedDate}
              </p>
            </div>

          </div>

        </div>

        {/* Activity Statistics */}
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          My Activity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {statistics.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-sm p-6"
            >

              <div className={`w-12 h-12 rounded-lg ${item.background} flex items-center justify-center mb-4`}>
                <span className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </span>
              </div>

              <h3 className="text-gray-700 font-semibold">
                {item.title}
              </h3>

            </div>
          ))}

        </div>

        {/* User Activities */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            My ReFind Activities
          </h2>

          <div className="space-y-3">

            <Link
              to="/browse"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
            >
              Browse Items →
            </Link>

            <Link
              to="/report?type=lost"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
            >
              Report a Lost Item →
            </Link>

            <Link
              to="/report?type=found"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
            >
              Report a Found Item →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;
