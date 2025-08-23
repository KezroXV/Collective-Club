"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plus, Edit2, Copy, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const COLOR_PRESETS = [
  "#3B82F6",
  "#06B6D4",
  "#10B981",
  "#84CC16",
  "#EF4444",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
];

const FONTS = [
  { name: "Inter", value: "font-inter" },
  { name: "Poppins", value: "font-poppins" },
  { name: "Arial", value: "font-arial" },
  { name: "Helvetica", value: "font-helvetica" },
  { name: "Roboto", value: "font-roboto" },
];

const CATEGORY_PREVIEW = [
  { label: "Conseil", color: "#C9C9C9" },
  { label: "Artisanat", color: "#FF9AA2" },
  { label: "Voyage", color: "#4EA7FF" },
];

// Couleurs utilitaires
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let normalized = hex.replace("#", "").trim();
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const bigint = parseInt(normalized || "000000", 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  h = clamp(h, 0, 360) / 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    const hex = ((1 << 24) + (gray << 16) + (gray << 8) + gray)
      .toString(16)
      .slice(1);
    return `#${hex}`;
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  const toHex = (x: number) => {
    const v = Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
    return v;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function isValidHex(value: string): boolean {
  return /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value.trim());
}

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizationModal({
  isOpen,
  onClose,
}: CustomizationModalProps) {
  const [activeColorTab, setActiveColorTab] = useState("Posts");
  const [colors, setColors] = useState({
    Posts: "#3B82F6",
    Bordures: "#E5E7EB",
    Fond: "#F9FAFB",
    Police: "#111827",
  });
  const [presets, setPresets] = useState(COLOR_PRESETS);
  const [hexInput, setHexInput] = useState(colors.Posts);

  const [hsl, setHsl] = useState(() => hexToHsl(colors.Posts));
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [coverImage, setCoverImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAddBadgeModalOpen, setIsAddBadgeModalOpen] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState("");
  const [newBadgeImage, setNewBadgeImage] = useState("");
  const [badgeCount, setBadgeCount] = useState(5);
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
  const badgeImageInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (color: string) => {
    setColors((prev) => ({
      ...prev,
      [activeColorTab]: color,
    }));
    setHexInput(color);
    setHsl(hexToHsl(color));
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

  // Synchroniser sliders quand on change d’onglet couleur
  useEffect(() => {
    const current = colors[activeColorTab as keyof typeof colors] as string;
    setHexInput(current);
    setHsl(hexToHsl(current));
  }, [activeColorTab, colors]);

  const updateFromHsl = (
    next: Partial<{ h: number; s: number; l: number }>
  ) => {
    const nextHsl = { ...hsl, ...next };
    setHsl(nextHsl);
    const nextHex = hslToHex(nextHsl.h, nextHsl.s, nextHsl.l);
    handleColorChange(nextHex);
  };

  const handleHexInput = (value: string) => {
    setHexInput(value);
    if (isValidHex(value)) {
      const normalized = value.startsWith("#") ? value : `#${value}`;
      handleColorChange(normalized.toUpperCase());
    }
  };

  const handleCopyHex = async () => {
    try {
      await navigator.clipboard.writeText(hexInput.toUpperCase());
      toast.success("Couleur copiée dans le presse-papiers");
    } catch {
      toast.error("Impossible de copier la couleur");
    }
  };

  const handleAddPreset = () => {
    if (!isValidHex(hexInput)) return;
    const normalized = hexInput.startsWith("#")
      ? hexInput.toUpperCase()
      : `#${hexInput.toUpperCase()}`;
    if (!presets.includes(normalized)) {
      setPresets((p) => [...p, normalized].slice(-12));
      toast.success("Couleur ajoutée aux presets");
    }
  };

  const handleColorPickerMove = (e: React.MouseEvent, rect: DOMRect) => {
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(
      0,
      Math.min(1, 1 - (e.clientY - rect.top) / rect.height)
    );
    const newS = Math.round(x * 100);
    const newL = Math.round(y * 100);
    updateFromHsl({ s: newS, l: newL });
  };

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
    // Ici on ajouterait le badge à la liste
    toast.success(`Badge "${newBadgeName}" ajouté !`);
    setIsAddBadgeModalOpen(false);
    setNewBadgeName("");
    setNewBadgeImage("");
  };

  const handleCancelAddBadge = () => {
    setIsAddBadgeModalOpen(false);
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

  const handleSave = () => {
    // Sauvegarder les paramètres
    toast.success("Personnalisation enregistrée !");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Personnalisation du forum
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 py-4">
          {/* Contenu principal */}
          <div className="lg:col-span-4 space-y-4">
            {/* Section Couleurs */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Couleurs
              </h3>

              {/* Tabs pour les couleurs */}
              <Tabs value={activeColorTab} onValueChange={setActiveColorTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="Posts">Posts</TabsTrigger>
                  <TabsTrigger value="Bordures">Bordures</TabsTrigger>
                  <TabsTrigger value="Fond">Fond</TabsTrigger>
                  <TabsTrigger value="Police">Police</TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  {/* Layout horizontal: Sélecteur 2D + Couleurs */}
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {/* Sélecteur 2D à gauche */}
                    <div className="col-span-2">
                      <div
                        className="relative w-full h-32 rounded-xl border overflow-hidden cursor-crosshair"
                        style={{ borderColor: colors.Bordures }}
                        onMouseDown={(e) => {
                          setIsDragging(true);
                          const rect = e.currentTarget.getBoundingClientRect();
                          handleColorPickerMove(e, rect);
                        }}
                        onMouseMove={(e) => {
                          if (!isDragging) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          handleColorPickerMove(e, rect);
                        }}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                      >
                        {/* Fond de couleur pure basé sur HUE */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `hsl(${hsl.h}, 100%, 50%)`,
                          }}
                        />
                        {/* Overlay saturation (blanc à transparent) */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to right, white, transparent)",
                          }}
                        />
                        {/* Overlay luminosité (transparent à noir) */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, black, transparent)",
                          }}
                        />
                        {/* Curseur de sélection */}
                        <div
                          className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
                          style={{
                            left: `${hsl.s}%`,
                            bottom: `${hsl.l}%`,
                            transform: "translate(-50%, 50%)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Couleurs enregistrées à droite */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Couleurs enregistrées
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {presets.slice(0, 9).map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className={`w-8 h-8 rounded-full border-2 ${
                              colors[activeColorTab as keyof typeof colors] ===
                              color
                                ? "border-gray-900 scale-110"
                                : "border-gray-200"
                            } transition-all`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleAddPreset}
                        className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                        title="Ajouter la couleur actuelle"
                      >
                        <Plus className="h-3 w-3" />
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Slider HUE */}
                  <div
                    className="relative h-3 rounded-full overflow-hidden mb-3"
                    style={{
                      background:
                        "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                    }}
                  >
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={1}
                      value={hsl.h}
                      onChange={(e) =>
                        updateFromHsl({ h: Number(e.target.value) })
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-gray-300 rounded-full -mt-0.5 shadow-sm pointer-events-none"
                      style={{
                        left: `${(hsl.h / 360) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>

                  {/* Ligne Hex / Pourcentage / Color Picker */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-gray-700">Hex</Label>
                      <Input
                        value={hexInput}
                        onChange={(e) => handleHexInput(e.target.value)}
                        className="h-8 w-24 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-gray-700">100%</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colors[activeColorTab as keyof typeof colors]}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="h-8 w-10 p-0 border rounded cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={handleCopyHex}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                      title="Copier"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
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
            <div className="sticky top-4">
              <h4 className="font-semibold text-gray-900 mb-4">Aperçu</h4>

              {/* Preview du post */}
              <div
                className="rounded-2xl p-5 mb-6 shadow-sm"
                style={{
                  backgroundColor: colors.Fond,
                  border: `1px solid ${colors.Bordures}`,
                  fontFamily: selectedFont,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.Posts}20` }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{ color: colors.Posts }}
                    >
                      TA
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Tester A.
                    </p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap mb-3">
                  {CATEGORY_PREVIEW.map((c) => (
                    <div
                      key={c.label}
                      className="flex items-center gap-3 rounded-full border px-4 py-2 bg-white/60 backdrop-blur-sm"
                      style={{ borderColor: colors.Bordures }}
                    >
                      <span
                        className="inline-block rounded-full"
                        style={{
                          width: 18,
                          height: 18,
                          backgroundColor: c.color,
                        }}
                      />
                      <span className="text-gray-900 text-sm font-medium">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p
                  className="text-[15px] mb-3 font-medium"
                  style={{ color: colors.Police }}
                >
                  Vous connaissez un bon site qui vends des marques vintage ?
                </p>
                <div
                  className="rounded-xl overflow-hidden border mb-4"
                  style={{ borderColor: colors.Bordures }}
                >
                  <Image
                    src="/Post-picture.png"
                    alt="Exemple de post"
                    width={800}
                    height={420}
                    className="w-full h-52 object-cover"
                  />
                </div>
                <p className="text-[13px] leading-6 mb-4 text-gray-700">
                  Hello à tous,
                  <br /> En ce moment, je suis grave dans une phase “retro” et
                  j’ai vraiment envie de refaire un peu ma garde-robe avec des
                  vêtements vintage. J’ai déjà fait quelques friperies en ville
                  mais j’aimerais tester des sites e-commerce pour avoir plus de
                  choix et dénicher des marques stylées (genre Levi’s vintage,
                  Adidas old school, Nike années 90, ou même des petites marques
                  moins connues mais avec du vrai style). Le problème, c’est que
                  sur le net, il y a un peu de tout : des sites hyper chers, des
                  arnaques, et parfois des sélections qui sentent la fast
                  fashion… Du coup, je me tourne vers vous pour avoir vos
                  recommandations de boutiques en ligne fiables, avec une vraie
                  sélection de pièces vintage ! Ça peut être des plateformes
                  spécialisées, des shops indépendants ou même des comptes
                  Insta/Depop/Vinted si vous avez eu de vraies bonnes
                  expériences. Je suis surtout preneur de sites où :
                  <ul>
                    <li>
                      La qualité est au rendez-vous (pas des fringues qui
                      tombent en morceaux après 2 lavages…)
                    </li>
                    <li>
                      {" "}
                      L’authenticité est garantie (vraies marques, pas de copies
                      ni de faux vintage)
                    </li>
                    <li>
                      Les descriptions/taille sont fiables (c’est chaud
                      d’acheter en ligne sans pouvoir essayer)
                    </li>
                  </ul>
                  Bref, n’hésitez pas à balancer vos meilleures adresses, vos
                  avis, ou même vos achats coup de cœur récents (avec photos si
                  vous voulez montrer vos trouvailles !). Si vous avez eu des
                  mauvaises surprises aussi, je veux bien vos mises en garde
                  pour éviter de tomber dans les mêmes pièges. Merci d’avance
                  pour tous vos retours!
                </p>
                <div className="flex items-center gap-5 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">24</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">10</span>
                  </div>
                </div>
              </div>

              {/* Aperçu avec image de couverture si présente */}
              {coverImage && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <Image
                    src={coverImage}
                    alt="Preview"
                    width={1200}
                    height={200}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h5 className="font-medium text-sm">
                      Avec photo de couverture
                    </h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Aperçu de votre forum
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>

      {/* Modal d'ajout de badge */}
      <Dialog open={isAddBadgeModalOpen} onOpenChange={setIsAddBadgeModalOpen}>
        <DialogContent className="max-w-[280px] p-6">
          <DialogHeader className="relative">
            <DialogTitle className="text-center text-gray-600 text-sm">
              ajouter
            </DialogTitle>
            <button
              onClick={handleCancelAddBadge}
              className="absolute -top-2 -right-2 text-gray-600 hover:text-gray-800 text-xl"
            >
              ×
            </button>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Sélecteur de nombre */}
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

            {/* Zone d'upload d'image */}
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

            {/* Champ nom */}
            <div className="text-center">
              <Input
                value={newBadgeName}
                onChange={(e) => setNewBadgeName(e.target.value)}
                placeholder="Nom..."
                className="text-center border-0 border-b border-gray-200 rounded-none focus:border-gray-400 text-sm text-gray-400 bg-transparent p-1"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleCancelAddBadge}
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
    </Dialog>
  );
}
