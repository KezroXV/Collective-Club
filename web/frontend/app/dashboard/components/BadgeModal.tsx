"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgeModal({ isOpen, onClose }: BadgeModalProps) {
  const [newBadgeName, setNewBadgeName] = useState("");
  const [newBadgeImage, setNewBadgeImage] = useState("");
  const [badgeCount, setBadgeCount] = useState(5);
  const badgeImageInputRef = useRef<HTMLInputElement>(null);

  const handleBadgeImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewBadgeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBadge = () => {
    if (!newBadgeName.trim()) {
      toast.error("Veuillez entrer un nom pour le badge");
      return;
    }
    toast.success(`Badge "${newBadgeName}" ajouté !`);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setNewBadgeName("");
    setNewBadgeImage("");
    setBadgeCount(5);
  };

  const incrementBadgeCount = () => {
    setBadgeCount((prev) => prev + 5);
  };

  const decrementBadgeCount = () => {
    setBadgeCount((prev) => Math.max(5, prev - 5));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[200px] p-4">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-gray-600 text-sm">
            ajouter
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex justify-center">
            <div className="flex items-center gap-1 border rounded-full px-3 py-1">
              <span className="text-sm font-medium">{badgeCount}</span>
              <div className="flex flex-col">
                <button
                  onClick={incrementBadgeCount}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-2.5 h-2.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={decrementBadgeCount}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-2.5 h-2.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              onClick={() => badgeImageInputRef.current?.click()}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              {newBadgeImage ? (
                <Image
                  src={newBadgeImage}
                  alt="Badge preview"
                  width={88}
                  height={88}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-[10px] text-gray-500 text-center">
                    Cliquer pour uploader
                  </span>
                </>
              )}
            </div>
            <input
              ref={badgeImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleBadgeImageUpload}
              className="hidden"
            />
          </div>

          <div className="text-center">
            <Input
              value={newBadgeName}
              onChange={(e) => setNewBadgeName(e.target.value)}
              placeholder="Nom..."
              className="text-center border-0 border-b border-gray-200 rounded-none focus:border-gray-400 text-sm text-gray-400 bg-transparent p-1"
            />
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full border-2 border-red-300 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors text-lg"
            >
              ×
            </button>
            <button
              onClick={handleAddBadge}
              className="w-10 h-10 rounded-full border-2 border-green-300 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"
            >
              ✓
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}