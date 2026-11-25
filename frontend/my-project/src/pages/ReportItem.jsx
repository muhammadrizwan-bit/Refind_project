
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function ReportItem() {
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type") === "found" ? "found" : "lost";

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create and clean up image preview URL
  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    setError("");

    if (!selectedImage) {
      setImage(null);
      return;
    }

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      setImage(null);
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(selectedImage);
  };

  // Submit report with image
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const data = new FormData();

      data.append("type", type);
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("date", formData.date);

      // Add image only if selected
      if (image) {
        data.append("image", image);
      }

      const response = await api.post("/items/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        response.data.message || "Report submitted successfully!"
      );

      // Reset form after successful submission
      setFormData({
        title: "",
        category: "",
        description: "",
        location: "",
        date: "",
      });

      setImage(null);

      // Reset file input
      const fileInput = document.getElementById("itemImage");
      if (fileInput) fileInput.value = "";

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

          <Link to="/" className="text-blue-100 hover:text-white">
            ← Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mt-5">
            Report {type === "lost" ? "Lost" : "Found"} Item
          </h1>

          <p className="mt-3 text-blue-100">
            Provide accurate information and upload an image to help
            reunite items with their owners.
          </p>

        </div>
      </div>

      {/* Form */}
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
              placeholder="Describe the color, brand, and unique features..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Upload Item Image
            </label>

            <input
              id="itemImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <p className="text-xs text-gray-500 mt-2">
              Supported image formats. Maximum size: 5 MB.
            </p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Image Preview
                </p>

                <div className="relative w-full max-w-sm">
                  <img
                    src={imagePreview}
                    alt="Selected item preview"
                    className="w-full h-64 object-cover rounded-xl border"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      document.getElementById("itemImage").value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                {type === "lost"
                  ? "Where did you lose it?"
                  : "Where did you find it?"} *
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

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              {loading
                ? "Uploading and Submitting..."
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

export default ReportItem;
