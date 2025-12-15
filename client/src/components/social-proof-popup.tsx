import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ShoppingBag } from "lucide-react";
import { products } from "@/lib/products";

const romanianCities = [
  "București", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", 
  "Brașov", "Galați", "Ploiești", "Oradea", "Brăila", "Arad", "Pitești",
  "Sibiu", "Bacău", "Târgu Mureș", "Baia Mare", "Buzău", "Botoșani",
  "Satu Mare", "Râmnicu Vâlcea", "Drobeta-Turnu Severin", "Suceava", "Piatra Neamț",
  "Târgu Jiu", "Focșani", "Bistrița", "Tulcea", "Reșița", "Călărași"
];

const romanianNames = [
  "Maria", "Elena", "Ana", "Ioana", "Andreea", "Alexandra", "Mihaela", "Cristina",
  "Ion", "Andrei", "Mihai", "Alexandru", "Daniel", "Adrian", "Bogdan", "Florin",
  "Diana", "Raluca", "Simona", "Carmen", "Laura", "Alina", "Roxana", "Monica"
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomMinutesAgo(): number {
  return Math.floor(Math.random() * 30) + 2;
}

export function SocialProofPopup() {
  const [notification, setNotification] = useState<{
    name: string;
    city: string;
    product: string;
    image: string;
    minutesAgo: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const randomProduct = getRandomItem(products);
      setNotification({
        name: getRandomItem(romanianNames),
        city: getRandomItem(romanianCities),
        product: randomProduct.name.length > 30 
          ? randomProduct.name.substring(0, 30) + "..." 
          : randomProduct.name,
        image: randomProduct.image,
        minutesAgo: getRandomMinutesAgo()
      });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    const initialDelay = setTimeout(() => {
      showNotification();
    }, 3000);

    const interval = setInterval(() => {
      showNotification();
    }, 8000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 z-[9999] max-w-xs bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden"
          data-testid="social-proof-popup"
        >
          <div className="flex items-center gap-3 p-3">
            <div className="relative flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg overflow-hidden">
              <img 
                src={notification.image} 
                alt={notification.product}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <ShoppingBag className="h-3 w-3 text-green-500" />
                <span className="font-medium text-green-600">Comandă nouă</span>
              </p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {notification.name} din {notification.city}
              </p>
              <p className="text-xs text-gray-600 truncate">
                a comandat <span className="font-medium">{notification.product}</span>
              </p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="h-2.5 w-2.5" />
                acum {notification.minutesAgo} minute
              </p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
