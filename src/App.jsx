import { useState, useEffect } from "react";
import StarRating from "./components/StarRating";
import FeedbackModal from "./components/FeedbackModal";

export default function App() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(6);

  const GOOGLE_REVIEW_URL =
    "https://www.google.com/search?sca_esv=e2c71ab81425b6e6&hl=en-NZ&gl=nz&si=AMgyJEuzsz2NflaaWzrzdpjxXXRaJ2hfdMsbe_mSWso6src8s0oo0lIk-gPcXlXgrSKJbAzrLvXKC7TLiy860OCvJcqAkA8g9Vp6u9OeZ1uthF8zTHfx1V2aRXa4qy7HP5KVOZtgO0VPNNID6R6VPVKBI8vhT1-gOw%3D%3D&q=Nichol%27s+Garden+Centre+Dunedin+Reviews&sa=X&ved=2ahUKEwjP4NHLh_OPAxUrha8BHf0XFr8Q0bkNegQIJhAE&cshid=1758773997179312&biw=2560&bih=1294&dpr=1#lrd=0xa82eae9fa765ab2b:0x2cb8cc170efb2fff,3,,,";

  const handleRate = (rating) => {
    setSelectedRating(rating);
    if (rating >= 1 && rating <= 3) {
      setModalOpen(true);
    } else if (rating >= 4) {
      setThankYouOpen(true);
      setRedirectCountdown(10);
    }
  };

  // Countdown & redirect for high ratings
  useEffect(() => {
    if (!thankYouOpen) return;

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.parent.postMessage(
            {action: "redirect", url: GOOGLE_REVIEW_URL},
            "https://nichols.co.nz/"
          );
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [thankYouOpen]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <StarRating onRate={handleRate} />

      <p className="p-4 items-center text-lg">Select a Rating</p>

      {selectedRating > 0 && (
        <p className="mt-4 text-lg">
          You rated: <span className="font-semibold">{selectedRating}</span> star
          {selectedRating > 1 ? "s" : ""}
        </p>
      )}

      {/* Existing feedback modal for 1–3 stars */}
      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rating={selectedRating}
      />

      {/* Thank-you modal for 4–5 stars */}
      {thankYouOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-bold mb-2">Thank you for your review!</h2>
            <p>We need your help, please share your review on Google. Redirecting you to Google Reviews in {redirectCountdown} seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}
