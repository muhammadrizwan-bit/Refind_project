
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const countries = [
  { name: "Pakistan", code: "+92", iso: "PK", digits: 11 },
  { name: "India", code: "+91", iso: "IN", digits: 10 },
  { name: "USA", code: "+1", iso: "US", digits: 10 },
  { name: "UK", code: "+44", iso: "GB", digits: 10 },
  { name: "UAE", code: "+971", iso: "AE", digits: 9 },
  { name: "Saudi Arabia", code: "+966", iso: "SA", digits: 9 },
];

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= selectedCountry.digits) {
      setContactNumber(value);
    }
  };

  const handleCountryChange = (e) => {
    const country = countries.find(
      (item) => item.iso === e.target.value
    );

    setSelectedCountry(country);
    setContactNumber("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (contactNumber.length !== selectedCountry.digits) {
      setError(
        `Enter exactly ${selectedCountry.digits} digits for ${selectedCountry.name}.`
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    let formattedNumber = contactNumber;

    // Pakistan local number: 03001234567
    // International number: +923001234567
    if (selectedCountry.iso === "PK") {
      if (!contactNumber.startsWith("0")) {
        setError("Pakistani mobile numbers must start with 0.");
        return;
      }

      formattedNumber = contactNumber.replace(/^0/, "");
    }

    const signupData = {
      ...formData,
      contact: `${selectedCountry.code}${formattedNumber}`,
    };

    try {
      setLoading(true);

      await register(signupData);
      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <Link to="/" className="block text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            ReFind
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Find what matters. Return what belongs.
          </p>
        </Link>

        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create Account
        </h2>

        <p className="text-gray-500 text-center mt-2 mb-7">
          Join ReFind and help reconnect lost items
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>

            <div className="flex gap-2">
              <select
                value={selectedCountry.iso}
                onChange={handleCountryChange}
                className="w-2/5 px-2 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.map((country) => (
                  <option key={country.iso} value={country.iso}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={contactNumber}
                onChange={handleContactChange}
                placeholder={
                  selectedCountry.iso === "PK"
                    ? "03001234567"
                    : `Enter ${selectedCountry.digits} digits`
                }
                inputMode="numeric"
                maxLength={selectedCountry.digits}
                required
                className="w-3/5 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Enter exactly {selectedCountry.digits} digits.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        <div className="text-center mt-5">
          <Link to="/" className="text-sm text-gray-500 hover:text-blue-600">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;
