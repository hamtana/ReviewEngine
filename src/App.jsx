import { useState } from "react";
import StarRating from "./components/StarRating";
import FeedbackModal from "./components/FeedbackModal";

export default function App() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRate = (rating) => {
    setSelectedRating(rating);
    if (rating >= 1 && rating <= 3) {
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl items-center font-bold mb-6">Rate your experience</h1>

      <StarRating onRate={handleRate} />

      {selectedRating > 0 && (
        <p className="mt-4 text-lg">
          You rated: <span className="font-semibold">{selectedRating}</span> star
          {selectedRating > 1 ? "s" : ""}
        </p>
      )}

      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rating={selectedRating}
      />
    </div>
  );
}
