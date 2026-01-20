import axios from "axios";
import { useEffect, useState } from "react";

const BASE_SERVER_URL = import.meta.env.VITE_BASE_SERVER_URL;

export default function PreferencePage() {
  const [products, setProducts] = useState([]);
  const [preferredProducts, setPreferredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -----------------------------
     Fetch Products
  -------------------------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_SERVER_URL}/api/products`);
        setProducts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);
  

  /* -----------------------------
     Toggle Product
  -------------------------------- */
  const toggleProduct = (productId) => {
    setPreferredProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId] // added as lowest priority
    );
  };

  /* -----------------------------
     Priority Controls
  -------------------------------- */
  const moveUp = (index) => {
    if (index === 0) return;
    setPreferredProducts((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index) => {
    setPreferredProducts((prev) => {
      if (index === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      return arr;
    });
  };

  /* -----------------------------
     Save Preferences
  -------------------------------- */
  const savePreferences = async () => {
    if (preferredProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_SERVER_URL}/api/preferences`, {
        preferences: preferredProducts.map((id, index) => ({
          product_id: id,
          priority: index + 1,
        })),
      });

      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Failed to save preferences", error);
      alert("Error saving preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Product Preferences
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const index = preferredProducts.indexOf(product.id);
          const isSelected = index !== -1;

          return (
            <div
              key={product.id}
              className={`rounded-xl border p-4 ${
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() => toggleProduct(product.id)}
              >
                <div className="h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                  {product.images?.length ? (
                    <img
                      src={`${BASE_SERVER_URL}${product.images[0]}`}
                      alt={product.name}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </div>

                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  Category: {product.category}
                </p>

                {isSelected && (
                  <p className="text-sm text-blue-600 mt-1">
                    Priority #{index + 1}
                  </p>
                )}
              </div>

              {isSelected && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => moveUp(index)}
                    className="px-3 py-1 text-xs border rounded"
                  >
                    ↑ Up
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    className="px-3 py-1 text-xs border rounded"
                  >
                    ↓ Down
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={savePreferences}
          disabled={loading}
          className="px-8 py-3 rounded-full bg-blue-600 text-white"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </section>
  );
}