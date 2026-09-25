import React from 'react';
import { User } from '../types/marketplace';
import { 
  Cpu, 
  PlusCircle, 
  MessageSquare, 
  MapPin, 
  Leaf, 
  HelpCircle,
  ChevronDown,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onOpenPublish: () => void;
  onOpenMessages: () => void;
  onOpenMap: () => void;
  onOpenEco: () => void;
  onOpenHowItWorks: () => void;
  unreadCount: number;
  activeSection: string;
  onNavigateSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenPublish,
  onOpenMessages,
  onOpenMap,
  onOpenEco,
  onOpenHowItWorks,
  unreadCount,
  activeSection,
  onNavigateSection
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigateSection('catalog'); }}
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white hover:text-emerald-400 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-display">RetroCycle</span>
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onNavigateSection('catalog')}
            className={`transition-colors hover:text-white ${activeSection === 'catalog' ? 'text-emerald-400' : ''}`}
          >
            Explorar Catálogo
          </button>
          <button
            onClick={onOpenMap}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>Mapa de Cercanía</span>
          </button>
          <button
            onClick={onOpenEco}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Calculadora Eco</span>
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cómo Funciona</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions + Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Chat Messages button */}
          <button
            onClick={onOpenMessages}
            className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-900"
            title="Bandeja de mensajes"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-neutral-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User profile / role switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 text-xs font-medium text-neutral-200 transition-colors"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center shrink-0">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to initial
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="max-w-[100px] truncate text-left">{currentUser.name}</span>
              <span className="text-[10px] uppercase text-emerald-400 tracking-wider font-semibold">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-neutral-800/80 mb-1">
                  <p className="text-xs text-neutral-400">Simular sesión como:</p>
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-800 transition-colors ${
                      u.id === currentUser.id ? 'bg-neutral-800/50 text-emerald-400' : 'text-neutral-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-neutral-100">{u.name}</p>
                      <p className="text-[11px] text-neutral-400 capitalize">{u.role} · {u.city}</p>
                    </div>
                    {u.id === currentUser.id && <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary CTA: Publicar Componente */}
          <button
            onClick={onOpenPublish}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
