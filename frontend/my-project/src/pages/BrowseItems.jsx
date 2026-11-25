
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

// Item image component with fallback
function ItemImage({ imageUrl, title }) {
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    return (
      <div className="h-56 w-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
        <span className="text-5xl mb-2">📦</span>
        <span className="text-sm">No image available</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title || "Reported item"}
      onError={() => setImageError(true)}
      className="h-56 w-full object-cover"
      loading="lazy"
    />
  );
}

function BrowseItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/items/all");

      setItems(response.data.items || []);
    } catch (error) {
      console.error("Fetch Items Error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load items. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Search and filter items
  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.title?.toLowerCase().includes(searchText) ||
      item.description?.toLowerCase().includes(searchText) ||
      item.location?.toLowerCase().includes(searchText);

    const matchesType = type === "all" || item.type === type;

    const matchesCategory =
      category === "all" || item.category === category;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      {/* Page Heading */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Find Lost & Found Items
        </h1>

        <p className="text-gray-500 mt-2">
          Search and explore items reported by our community.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto bg-white p-5 rounded-xl shadow-sm mb-8">

        <input
          type="text"
          placeholder="Search by item name, description or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none"
          >
            <option value="all">All Items</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Bags">Bags</option>
            <option value="Books">Books</option>
            <option value="Wallets">Wallets</option>
            <option value="Keys">Keys</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>

        </div>
      </div>

      {/* Items Section */}
      <div className="max-w-7xl mx-auto">

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading items...
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>

            <button
              onClick={fetchItems}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700">
              No Items Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-800">
                Available Reports
              </h2>

              <span className="text-sm text-gray-500">
                {filteredItems.length} Items Found
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition"
                >

                  {/* Item Image */}
                  <ItemImage
                    imageUrl={item.imageUrl}
                    title={item.title}
                  />

                  <div className="p-5">

                    {/* Item Type and Status */}
                    <div className="flex justify-between items-center mb-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          item.type === "lost"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {item.type}
                      </span>

                      <span className="text-xs text-gray-500">
                        {item.status || "active"}
                      </span>

                    </div>

                    {/* Item Information */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">

                      <p>
                        <span className="font-semibold">Category:</span>{" "}
                        {item.category}
                      </p>

                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {item.location}
                      </p>

                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : "Not available"}
                      </p>

                      <p>
                        <span className="font-semibold">Reported by:</span>{" "}
                        {item.reporterName || item.userId?.name || "Unknown User"}
                      </p>

                      {item.reporterContact && (
                        <p>
                          <span className="font-semibold">Contact:</span>{" "}
                          <a
                            href={`tel:${item.reporterContact}`}
                            className="text-blue-600 hover:underline"
                          >
                            {item.reporterContact}
                          </a>
                        </p>
                      )}

                    </div>

                    {/* Details Button */}
                    <div className="border-t mt-5 pt-4">
                      <Link
                        to={`/item/${item._id}`}
                        className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
                      >
                        View Details
                      </Link>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default BrowseItems;
