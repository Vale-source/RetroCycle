import React from 'react';
import { User, Review } from '../types/marketplace';
import { X, Star, ShieldCheck, Award, Recycle, CheckCircle2, Calendar, MapPin, MessageSquare } from 'lucide-react';
import { MOCK_REVIEWS } from '../data/mockHardware';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onContactUser: (user: User) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onContactUser
}) => {
  // Find reviews targeting this user or sample reviews
  const userReviews = MOCK_REVIEWS.filter(r => r.toUserId === user.id);
  const reviewsToDisplay = userReviews.length > 0 ? userReviews : MOCK_REVIEWS;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
            Perfil de Usuario en RetroCycle
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-800 border-2 border-emerald-500/40 shrink-0">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-white font-display">{user.name}</h2>
                {user.isVerified && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/60">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verificado</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-emerald-300 font-medium capitalize">
                Rol: {user.role} {user.badge && `· ${user.badge}`}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-neutral-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{user.city}, {user.country}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Miembro desde {user.memberSince}</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onContactUser(user);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar Mensaje</span>
            </button>
          </div>

          {/* User Bio */}
          {user.bio && (
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
              {user.bio}
            </div>
          )}

          {/* User Metrics & Reputation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-base font-mono">{user.rating.toFixed(1)}</span>
              </div>
              <p className="text-[11px] text-neutral-400">Calificación Promedio</p>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <p className="font-bold text-base font-mono text-white mb-1">{user.completedDeals}</p>
              <p className="text-[11px] text-neutral-400">Tratos Completados</p>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <p className="font-bold text-base font-mono text-emerald-400 mb-1">{user.eWasteDivertedKg} kg</p>
              <p className="text-[11px] text-neutral-400">E-Waste Gestionado</p>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <p className="font-bold text-base font-mono text-sky-400 mb-1">{user.reviewCount}</p>
              <p className="text-[11px] text-neutral-400">Valoraciones Recibidas</p>
            </div>
          </div>

          {/* Reviews & Feedback List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                Historial de Opiniones y Valoraciones
              </h3>
              <span className="text-xs text-neutral-500 font-mono">{reviewsToDisplay.length} reseñas</span>
            </div>

            <div className="space-y-2.5">
              {reviewsToDisplay.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-800">
                        <img src={rev.fromUserAvatar} alt={rev.fromUserName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-semibold text-neutral-200">{rev.fromUserName}</span>
                      <span className="text-neutral-500 text-[10px]">({rev.roleContext})</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-900">
                    <span>Componente: {rev.listingTitle}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
