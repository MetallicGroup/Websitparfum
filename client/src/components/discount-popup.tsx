import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const POPUP_STORAGE_KEY = "luxe_parfum_popup_shown";

export function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(POPUP_STORAGE_KEY);
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(POPUP_STORAGE_KEY, "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phoneNumber: phoneNumber.trim() }),
      });
      handleClose();
    } catch (error) {
      console.error("Failed to save lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          data-testid="button-close-popup"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold px-4 py-1 rounded-full mb-4">
            OFERTĂ EXCLUSIVĂ
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Profitați de ofertele noastre cu discount
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Înscrie-te acum pentru a primi notificări despre cele mai bune oferte!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Numele tău"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 text-base border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              data-testid="input-lead-name"
              required
            />
          </div>
          <div>
            <Input
              type="tel"
              placeholder="Număr de telefon"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-12 text-base border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              data-testid="input-lead-phone"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-base rounded-lg transition-all duration-200"
            data-testid="button-submit-lead"
          >
            {isSubmitting ? "Se trimite..." : "VREAU OFERTELE"}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Datele tale sunt în siguranță și nu vor fi partajate cu terți.
        </p>
      </div>
    </div>
  );
}
