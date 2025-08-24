"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plus, Edit2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import ColorPicker from "./ColorPicker";
import BadgeModal from "./BadgeModal";
import PostPreview from "./PostPreview";
import { useTheme } from "@/contexts/ThemeContext";

const FONTS = [
  { name: "Inter", value: "font-inter" },
  { name: "Poppins", value: "font-poppins" },
  { name: "Arial", value: "font-arial" },
  { name: "Helvetica", value: "font-helvetica" },
  { name: "Roboto", value: "font-roboto" },
];

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export default function CustomizationModal({
  isOpen,
  onClose,
  userId,
}: CustomizationModalProps) {
  const { colors: globalColors, selectedFont: globalFont, coverImageUrl: globalCoverImage, updateTheme } = useTheme();
  
  const [activeColorTab, setActiveColorTab] = useState("Posts");
  const [colors, setColors] = useState(globalColors);
  const [selectedFont, setSelectedFont] = useState(globalFont);
  const [coverImage, setCoverImage] = useState(globalCoverImage || "");
  const [isAddBadgeModalOpen, setIsAddBadgeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skillLevels] = useState([
    {
      id: "nouveau",
      name: "Nouveau",
      image: "/Badge-nouveau.svg",
      count: 60,
      editable: false,
    },
    {
      id: "novice",
      name: "Novice",
      image: "/Badge-bronze.svg",
      count: 50,
      editable: false,
    },
    {
      id: "intermediaire",
      name: "Intermédiaire",
      image: "/Badge-argent.svg",
      count: 100,
      editable: false,
    },
    {
      id: "expert",
      name: "Expert",
      image: "/Badge-or.svg",
      count: 30,
      editable: false,
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchroniser avec le contexte global au moment de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setColors(globalColors);
      setSelectedFont(globalFont);
      setCoverImage(globalCoverImage || "");
    }
  }, [isOpen, globalColors, globalFont, globalCoverImage]);

  const handleColorChange = (color: string) => {
    setColors((prev) => ({
      ...prev,
      [activeColorTab]: color,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("Utilisateur non connecté");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/customization", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          colorPosts: colors.Posts,
          colorBorders: colors.Bordures,
          colorBg: colors.Fond,
          colorText: colors.Police,
          selectedFont,
          coverImageUrl: coverImage || null,
        }),
      });

      if (response.ok) {
        // Mettre à jour le contexte global
        updateTheme(colors, selectedFont, coverImage || null);
        toast.success("Personnalisation enregistrée !");
        onClose();
      } else {
        throw new Error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Impossible de sauvegarder les paramètres");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Personnalisation du forum
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 py-4 flex-1 overflow-y-auto">
            {/* Contenu principal */}
            <div className="lg:col-span-4 space-y-4">
              {/* Section Couleurs */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Couleurs
                </h3>

                <Tabs value={activeColorTab} onValueChange={setActiveColorTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="Posts">Posts</TabsTrigger>
                    <TabsTrigger value="Bordures">Bordures</TabsTrigger>
                    <TabsTrigger value="Fond">Fond</TabsTrigger>
                    <TabsTrigger value="Police">Police</TabsTrigger>
                  </TabsList>

                  <ColorPicker
                    color={colors[activeColorTab as keyof typeof colors]}
                    onChange={handleColorChange}
                    borderColor={colors.Bordures}
                  />
                </Tabs>
              </div>

              {/* Section Police */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Police
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {FONTS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSelectedFont(font.name)}
                      className={`px-3 py-0.5 rounded-4xl border text-center transition-all ${
                        selectedFont === font.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ fontFamily: font.name }}
                    >
                      <span className="font-medium text-xs">{font.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Photo de couverture */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Photo de couverture
                </h3>

                {coverImage ? (
                  <div className="relative">
                    <Image
                      src={coverImage}
                      alt="Cover"
                      width={1200}
                      height={300}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setCoverImage("")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-gray-500 font-medium text-xs">
                      Télécharger une image
                    </span>
                    <span className="text-gray-400 text-xs">
                      PNG, JPG jusqu&apos;à 5MB
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Section Paliers */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Paliers
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {skillLevels.map((level) => (
                    <div key={level.id} className="text-center">
                      <div
                        className="relative mx-auto mb-1.5 drop-shadow-sm"
                        style={{ width: 56, height: 56 }}
                      >
                        <Image
                          src={level.image}
                          alt={level.name}
                          width={56}
                          height={56}
                          className="rounded-full"
                        />
                        <span
                          className="absolute -top-1.5 -right-1.5 text-[9px] px-1 py-0.5 rounded bg-white shadow"
                          style={{ border: `1px solid ${colors.Bordures}` }}
                        >
                          {level.count}
                        </span>
                      </div>
                      <p className="font-medium text-xs text-gray-900">
                        {level.name}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-1 text-gray-500 hover:text-gray-700 transition-colors">
                        <Edit2 className="h-2.5 w-2.5" />
                        <span className="text-[10px]">Modifier</span>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <button
                      onClick={() => setIsAddBadgeModalOpen(true)}
                      className="w-14 h-14 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mx-auto mb-1.5 hover:border-gray-400 transition-colors bg-white/60"
                    >
                      <Plus className="h-5 w-5 text-gray-400" />
                    </button>
                    <p className="font-medium text-xs text-gray-500">Ajouter</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview à droite */}
            <div className="lg:col-span-6">
              <PostPreview
                colors={colors}
                selectedFont={selectedFont}
                coverImage={coverImage}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-4 flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BadgeModal
        isOpen={isAddBadgeModalOpen}
        onClose={() => setIsAddBadgeModalOpen(false)}
      />
    </>
  );
}