"use client";

export default function HeroBanner() {
  return (
    <div className="relative h-40 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 overflow-hidden">
      {/* Formes géométriques diagonales */}
      <div className="absolute inset-0">
        {/* Grande forme diagonale gauche */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-black/20 transform rotate-45"></div>
        {/* Forme diagonale droite */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-black/15 transform rotate-45"></div>
        {/* Forme centrale */}
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-800/20 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        {/* Petites formes d'accent */}
        <div className="absolute top-8 right-32 w-12 h-12 bg-blue-400/20 transform rotate-45"></div>
        <div className="absolute bottom-8 left-32 w-8 h-8 bg-indigo-300/30 transform rotate-45"></div>
      </div>

      {/* Overlay gradient pour plus de profondeur */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>

      {/* Content */}
      <div className="relative container mx-auto px-6 h-full flex items-center">
        <div className="text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Forum Communautaire
          </h1>
          <p className="text-blue-100 text-base opacity-90">
            Partagez vos idées et discutez avec la communauté
          </p>
        </div>
      </div>
    </div>
  );
}
