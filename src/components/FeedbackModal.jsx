import { X } from "lucide-react";
import { useState } from "react";

export default function FeedbackModal({ open, onClose, rating }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          message: e.target.feedback.value,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Feedback submitted ✅");
        onClose();
      } else {
        alert(`Failed to submit feedback: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong sending feedback");
    } finally {
      setLoading(false);
    }
  };


 return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Sorry your experience was {rating} star{rating > 1 ? "s" : ""}
        </h2>
        <p className="mb-4 text-gray-600">Please tell us how we can improve:</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Your name..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Email */}
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Your email..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Feedback */}
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700"
          >
            Feedback
          </label>
          <textarea
            id="feedback"
            name="feedback"
            required
            placeholder="Your feedback..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
