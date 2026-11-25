
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ReportLost() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Detect whether the user wants to report a lost or found item
  const type = searchParams.get("type") === "found" ? "found" : "lost";

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    reporterName: user?.name || "",
    reporterContact: user?.contact || "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const imageInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0] || null;

    setError("");

    if (selectedImage && !selectedImage.type.startsWith("image/")) {
      setError("Please choose an image file.");
      e.target.value = "";
      setImage(null);
      setImagePreview("");
      return;
    }

    if (selectedImage && selectedImage.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or smaller.");
      e.target.value = "";
      setImage(null);
      setImagePreview("");
      return;
    }

    setImage(selectedImage);
    setImagePreview(selectedImage ? URL.createObjectURL(selectedImage) : "");
  };

  // Submit report to backend

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const report = new FormData();
      Object.entries({ ...formData, type }).forEach(([key, value]) => {
        report.append(key, value);
      });
      if (image) {
        report.append("image", image);
      }

      const response = await api.post("/items/create", report);

      setSuccess(response.data.message || "Report submitted successfully!");

      // Clear form after successful submission
      setFormData({
        title: "",
        category: "",
        description: "",
        location: "",
        date: "",
        reporterName: user?.name || "",
        reporterContact: user?.contact || "",
      });
      setImage(null);
      setImagePreview("");
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Report Submission Error:", err);

      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">

          <Link
            to="/"
            className="text-blue-100 hover:text-white"
          >
            ← Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mt-5">
            Report {type === "lost" ? "Lost" : "Found"} Item
          </h1>

          <p className="mt-3 text-blue-100">
            Provide accurate information to help reunite items
            with their owners.
          </p>

        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 md:p-10"
        >

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Item Information
          </h2>

          <p className="text-gray-500 mb-8">
            Please complete all required fields.
          </p>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Item Name */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Item Name *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Black leather wallet"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Item Category *
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Documents">Documents / ID Cards</option>
              <option value="Bags">Bags</option>
              <option value="Books">Books</option>
              <option value="Wallets">Wallets</option>
              <option value="Keys">Keys</option>
              <option value="Accessories">Accessories</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Item Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your item, including its color, brand, and unique features..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />
          </div>

          {/* Item Image */}
          <div className="mb-6">
            <label htmlFor="item-image" className="block font-semibold text-gray-700 mb-2">
              Item Photo <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <input
              ref={imageInputRef}
              id="item-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
            <p className="text-sm text-gray-500 mt-2">
              Add a clear photo to help identify the item. Maximum size: 5 MB.
            </p>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Selected item preview"
                  className="max-h-64 rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview("");
                    if (imageInputRef.current) {
                      imageInputRef.current.value = "";
                    }
                  }}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove photo
                </button>
              </div>
            )}
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                {type === "lost" ? "Where did you lose it?" : "Where did you find it?"} *
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. University Library"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                {type === "lost" ? "Date Lost" : "Date Found"} *
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toLocaleDateString("en-CA")}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

          </div>

          {/* Reporter Contact */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Your Contact Information
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              People can use these details to contact you about this report.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="reporter-name" className="block font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  id="reporter-name"
                  type="text"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  maxLength={100}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="reporter-contact" className="block font-semibold text-gray-700 mb-2">
                  Your Contact Number *
                </label>
                <input
                  id="reporter-contact"
                  type="tel"
                  name="reporterContact"
                  value={formData.reporterContact}
                  onChange={handleChange}
                  placeholder="e.g. +923001234567"
                  autoComplete="tel"
                  maxLength={16}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {loading
                ? "Submitting..."
                : `Submit ${type === "lost" ? "Lost" : "Found"} Report`}
            </button>

            <Link
              to="/browse"
              className="flex-1 text-center border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

          </div>

        </form>
      </div>
    </div>
  );
}

export default ReportLost;
