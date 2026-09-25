import React, { useState } from 'react';
import { ChatThread, ChatMessage, User } from '../types/marketplace';
import { 
  X, 
  Send, 
  Check, 
  CheckCheck, 
  Clock, 
  ShieldAlert, 
  DollarSign, 
  Repeat, 
  Gift, 
  CheckCircle, 
  XCircle,
  Cpu
} from 'lucide-react';

interface MessagingDrawerProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
  onAcceptOffer: (threadId: string) => void;
  onRejectOffer: (threadId: string) => void;
  currentUser: User;
  onClose: () => void;
}

export const MessagingDrawer: React.FC<MessagingDrawerProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  onAcceptOffer,
  onRejectOffer,
  currentUser,
  onClose
}) => {
  const [inputText, setInputText] = useState('');

  const currentThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentThread) return;
    onSendMessage(currentThread.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-neutral-900 border-l border-neutral-800 w-full max-w-xl h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-display">Mensajería y Negociaciones</h2>
            <p className="text-xs text-neutral-400">Coordinación de pruebas, ofertas y entregas seguras.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout: Thread selector bar + Active Chat */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Thread List Sidebar */}
          <div className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r border-neutral-800 bg-neutral-950/70 overflow-y-auto shrink-0">
            <div className="p-2 space-y-1">
              {threads.length === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500">
                  No hay conversaciones activas aún.
                </div>
              ) : (
                threads.map(thread => {
                  const isActive = currentThread && currentThread.id === thread.id;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => onSelectThread(thread.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                        isActive 
                          ? 'bg-neutral-800/90 border border-neutral-700' 
                          : 'hover:bg-neutral-900 text-neutral-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 shrink-0 mt-0.5">
                        <img 
                          src={thread.otherUser.avatar} 
                          alt={thread.otherUser.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white truncate">{thread.otherUser.name}</p>
                          {thread.unreadCount > 0 && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-400 truncate mt-0.5">{thread.listingTitle}</p>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">{thread.lastMessage}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          {currentThread ? (
            <div className="flex-1 flex flex-col bg-neutral-900 overflow-hidden">
              {/* Context bar about the hardware listing */}
              <div className="px-4 py-2.5 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold text-neutral-200 truncate">{currentThread.listingTitle}</span>
                    <span className="text-neutral-500 ml-2">
                      {currentThread.listingModality === 'donacion' ? 'Donación ($0)' :
                       currentThread.listingModality === 'intercambio' ? 'Trueque' :
                       `$${currentThread.listingPrice} USD`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety notice for retro hardware */}
              <div className="px-4 py-2 bg-amber-950/30 border-b border-amber-900/30 text-[11px] text-amber-300/90 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Consejo de seguridad: Acuerden puntos públicos de encuentro y verifiquen componentes con fuente regulada.</span>
              </div>

              {/* Messages container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {currentThread.messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      {/* Special offer card notification inside chat */}
                      {msg.isOfferNotification && msg.offerDetails ? (
                        <div className="max-w-md w-full p-3.5 rounded-xl bg-neutral-950 border border-emerald-500/30 shadow-md space-y-2 my-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">
                              {msg.offerDetails.type === 'contraoferta' ? 'Contraoferta Recibida' :
                               msg.offerDetails.type === 'propuesta_trueque' ? 'Propuesta de Trueque' :
                               msg.offerDetails.type === 'solicitud_donacion' ? 'Solicitud de Donación Reciclaje' : 'Oferta Directa'}
                            </span>
                            <span className="text-[10px] text-neutral-500">{msg.timestamp}</span>
                          </div>

                          <p className="text-xs text-neutral-200">{msg.text}</p>

                          {/* Action buttons if not mine and still pending */}
                          {!isMine && msg.offerDetails.status === 'pendiente' && (
                            <div className="flex items-center gap-2 pt-1 border-t border-neutral-800">
                              <button
                                onClick={() => onAcceptOffer(currentThread.id)}
                                className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-neutral-950 transition-colors flex items-center justify-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Aceptar Oferta</span>
                              </button>
                              <button
                                onClick={() => onRejectOffer(currentThread.id)}
                                className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center justify-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Declinar</span>
                              </button>
                            </div>
                          )}

                          {msg.offerDetails.status === 'aceptada' && (
                            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 pt-1 border-t border-neutral-800">
                              <CheckCircle className="w-3 h-3" />
                              <span>Oferta aceptada. Coordinando entrega física.</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`max-w-xs sm:max-w-md px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                            isMine
                              ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-br-none'
                              : 'bg-neutral-800 text-neutral-200 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className={`block text-[10px] mt-1 text-right ${isMine ? 'text-emerald-400/70' : 'text-neutral-500'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Escribir a ${currentThread.otherUser.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-neutral-950 rounded-xl transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-neutral-500 text-xs">
              Selecciona una conversación para ver los mensajes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
