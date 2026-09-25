import React, { useState, useEffect, useRef, useMemo } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { HardwareListing, User } from '../types/marketplace';
import { 
  X, 
  MapPin, 
  Navigation, 
  LocateFixed, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { calculateDistanceKm } from '../utils/distance';
import { GOOGLE_MAPS_API_KEY, DARK_MAP_STYLES, PRESET_LOCATIONS } from '../utils/googleMapsConfig';

interface MapLocatorModalProps {
  listings: HardwareListing[];
  currentUser: User;
  onClose: () => void;
  onSelectListing: (listing: HardwareListing) => void;
  onUpdateLocation?: (coords: { lat: number; lng: number }, cityName?: string) => void;
}

export const MapLocatorModal: React.FC<MapLocatorModalProps> = ({
  listings,
  currentUser,
  onClose,
  onSelectListing,
  onUpdateLocation
}) => {
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(50);
  const [selectedItem, setSelectedItem] = useState<HardwareListing | null>(null);

  // User location state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: currentUser.coordinates?.lat || -32.8895,
    lng: currentUser.coordinates?.lng || -68.8458
  });
  const [locationName, setLocationName] = useState<string>(currentUser.city || 'Mendoza (Capital)');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Google Maps instances
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const itemMarkersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);

  // Compute distances relative to current user coordinates
  const listingsWithDistance = useMemo(() => {
    return listings.map(l => {
      const distance = calculateDistanceKm(
        userCoords.lat,
        userCoords.lng,
        l.location.coordinates.lat,
        l.location.coordinates.lng
      );
      return {
        ...l,
        distanceKm: distance
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [listings, userCoords]);

  const filteredItems = useMemo(() => {
    return listingsWithDistance.filter(l => l.distanceKm <= maxRadiusKm);
  }, [listingsWithDistance, maxRadiusKm]);

  // Request real browser geolocation
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('La geolocalización no está soportada en tu navegador.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: Number(position.coords.latitude.toFixed(5)),
          lng: Number(position.coords.longitude.toFixed(5))
        };
        setUserCoords(coords);
        setIsGpsActive(true);
        setIsLocating(false);
        const name = 'Tu Ubicación GPS Actual';
        setLocationName(name);

        if (onUpdateLocation) {
          onUpdateLocation(coords, name);
        }

        // Center map on user's live position
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(coords);
          mapInstanceRef.current.setZoom(12);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Permiso de ubicación denegado. Puedes seleccionar una ciudad de la lista.');
        } else {
          setGpsError('No se pudo determinar tu posición exacta. Utilizando ubicación aproximada.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Switch location from presets
  const handleSelectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    const coords = { lat: preset.lat, lng: preset.lng };
    setUserCoords(coords);
    setLocationName(preset.name);
    setIsGpsActive(false);
    setGpsError(null);

    if (onUpdateLocation) {
      onUpdateLocation(coords, preset.name);
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(coords);
      mapInstanceRef.current.setZoom(11);
    }
  };

  // 1. Initialize Google Maps via @googlemaps/js-api-loader
  useEffect(() => {
    let isMounted = true;

    setOptions({
      key: GOOGLE_MAPS_API_KEY,
      v: 'weekly',
      libraries: ['places']
    });

    importLibrary('maps')
      .then((mapsLib) => {
        if (!isMounted || !mapContainerRef.current) return;

        const map = new mapsLib.Map(mapContainerRef.current, {
          center: userCoords,
          zoom: 11,
          styles: DARK_MAP_STYLES,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          backgroundColor: '#0a0a0a'
        });

        infoWindowRef.current = new mapsLib.InfoWindow();
        mapInstanceRef.current = map;
        setIsMapReady(true);
      })
      .catch((err: unknown) => {
        console.error('Error loading Google Maps API:', err);
        if (isMounted) {
          setMapLoadError('No se pudo inicializar Google Maps. Verificando clave API.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Update User Marker and Search Radius Circle
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // User pin icon (emerald target with pulse)
    const userIcon: google.maps.Symbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: '#10b981',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    };

    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(userCoords);
      userMarkerRef.current.setTitle(locationName);
    } else {
      userMarkerRef.current = new google.maps.Marker({
        position: userCoords,
        map,
        title: locationName,
        icon: userIcon,
        zIndex: 999
      });
    }

    // Radius circle
    if (circleRef.current) {
      circleRef.current.setCenter(userCoords);
      circleRef.current.setRadius(maxRadiusKm * 1000);
    } else {
      circleRef.current = new google.maps.Circle({
        strokeColor: '#10b981',
        strokeOpacity: 0.6,
        strokeWeight: 1.5,
        fillColor: '#10b981',
        fillOpacity: 0.08,
        map,
        center: userCoords,
        radius: maxRadiusKm * 1000
      });
    }
  }, [isMapReady, userCoords, maxRadiusKm, locationName]);

  // 3. Render Listing Markers
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear old markers
    itemMarkersRef.current.forEach(m => m.setMap(null));
    itemMarkersRef.current = [];

    // Add markers for filtered listings
    filteredItems.forEach((item) => {
      const isRecycling = item.category === 'lotes_reciclaje' || item.condition === 'para_reciclaje';
      const markerColor = isRecycling ? '#a855f7' : '#38bdf8';

      const pinIcon: google.maps.Symbol = {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: markerColor,
        fillOpacity: 1,
        strokeColor: '#0a0a0a',
        strokeWeight: 1.5,
        scale: 1
      };

      const marker = new google.maps.Marker({
        position: {
          lat: item.location.coordinates.lat,
          lng: item.location.coordinates.lng
        },
        map,
        title: item.title,
        icon: pinIcon
      });

      marker.addListener('click', () => {
        setSelectedItem(item);

        if (infoWindowRef.current) {
          const contentString = `
            <div style="background:#171717; color:#fff; font-family:sans-serif; padding:10px; border-radius:10px; max-width:240px;">
              <div style="font-size:10px; text-transform:uppercase; color:${markerColor}; font-weight:bold; letter-spacing:0.5px;">
                ${item.brand} · ${item.category.replace('_', ' ')}
              </div>
              <div style="font-size:13px; font-weight:bold; margin-top:4px; line-height:1.2;">
                ${item.title}
              </div>
              <div style="margin-top:6px; font-size:12px; color:#10b981; font-weight:bold;">
                ${item.modality === 'donacion' ? 'Donación ($0)' : item.modality === 'intercambio' ? 'Trueque' : '$' + item.price + ' USD'}
                <span style="font-size:11px; color:#a3a3a3; font-weight:normal; margin-left:6px;">(${item.distanceKm} km)</span>
              </div>
              <div style="font-size:11px; color:#9ca3af; margin-top:4px;">
                ${item.location.neighborhood || item.location.city}
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(map, marker);
        }
      });

      itemMarkersRef.current.push(marker);
    });
  }, [isMapReady, filteredItems]);

  // Center on an item when selected in list
  const handleFocusItemOnMap = (item: HardwareListing & { distanceKm: number }) => {
    setSelectedItem(item);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({
        lat: item.location.coordinates.lat,
        lng: item.location.coordinates.lng
      });
      mapInstanceRef.current.setZoom(13);

      const targetMarker = itemMarkersRef.current.find(
        m => m.getTitle() === item.title
      );
      if (targetMarker && infoWindowRef.current) {
        google.maps.event.trigger(targetMarker, 'click');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <span>Mapa de Cercanía con Google Maps</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Google Maps API
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Geolocalización activa para encontrar hardware retro y puntos limpios cerca de ti.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Detection Toolbar */}
        <div className="px-6 py-3 bg-neutral-950/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Live GPS Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDetectLiveLocation}
              disabled={isLocating}
              className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                isGpsActive
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm shadow-emerald-500/20'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detectando GPS...' : isGpsActive ? 'Ubicación GPS Activa' : 'Detectar Mi Ubicación GPS'}</span>
            </button>

            <div className="text-neutral-400 hidden sm:block">
              Centro: <strong className="text-white">{locationName}</strong>
              <span className="font-mono text-[11px] text-neutral-500 ml-1.5">
                ({userCoords.lat.toFixed(3)}, {userCoords.lng.toFixed(3)})
              </span>
            </div>
          </div>

          {/* Preset Cities Selector for quick teleport testing */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-neutral-500 text-[11px] hidden md:inline">O cambiar a:</span>
            {PRESET_LOCATIONS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  locationName === preset.name
                    ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                    : 'text-neutral-400 hover:text-white bg-neutral-900'
                }`}
              >
                {preset.name.replace(' (Capital Centro)', '')}
              </button>
            ))}
          </div>
        </div>

        {/* GPS Error alert if any */}
        {gpsError && (
          <div className="px-6 py-2 bg-amber-950/40 border-b border-amber-900/40 text-[11px] text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Content: Map + List */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Canvas: Real Google Map */}
          <div className="lg:col-span-8 p-4 bg-neutral-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800 relative">
            {/* Search Radius Controls */}
            <div className="flex items-center justify-between gap-4 mb-3 text-xs z-10">
              <span className="text-neutral-400">Radio de búsqueda alrededor de tu ubicación:</span>
              <div className="flex items-center gap-1.5">
                {[5, 15, 50, 150, 300].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => setMaxRadiusKm(radius)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
                      maxRadiusKm === radius
                        ? 'bg-emerald-400 text-neutral-950 font-bold shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {radius} km
                  </button>
                ))}
              </div>
            </div>

            {/* Real Google Map Container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
              <div ref={mapContainerRef} className="w-full h-full" />

              {!isMapReady && !mapLoadError && (
                <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center text-xs text-neutral-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                  <span>Cargando Google Maps Platform API...</span>
                </div>
              )}

              {mapLoadError && (
                <div className="absolute inset-0 bg-neutral-950 p-6 flex flex-col items-center justify-center text-center text-xs text-neutral-400 space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-neutral-200 font-semibold">{mapLoadError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Map Legend Overlay */}
              <div className="absolute bottom-3 left-3 px-3 py-2 rounded-xl bg-neutral-950/90 backdrop-blur-md border border-neutral-800 text-[10px] space-y-1.5 pointer-events-none shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
                  <span className="text-neutral-200 font-semibold">Tu Ubicación ({locationName})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-neutral-300">Hardware Vintage Funcionando</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-neutral-300">Chatarra RAEE / Para Piezas</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 mt-2">
              Haz clic sobre cualquier marcador en el mapa para previsualizar el componente o abrir su ficha de negociación.
            </p>
          </div>

          {/* Right Sidebar: Items in Radius */}
          <div className="lg:col-span-4 p-4 overflow-y-auto max-h-[500px] space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
              <span className="font-semibold text-white font-display">
                {filteredItems.length} componente(s) en radio
              </span>
              <span className="text-emerald-400 font-mono font-bold">≤ {maxRadiusKm} km de ti</span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
                <p>No se encontraron componentes en un radio de {maxRadiusKm} km de {locationName}.</p>
                <button
                  onClick={() => setMaxRadiusKm(300)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs"
                >
                  Ampliar a 300 km
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleFocusItemOnMap(item)}
                    className={`p-3 rounded-xl border text-left text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-neutral-800/90 border-emerald-500/60 shadow-md'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-neutral-100 line-clamp-1">{item.title}</p>
                      <span className="font-mono text-emerald-400 font-bold shrink-0">
                        {item.distanceKm} km
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                      <span>{item.location.city} ({item.location.neighborhood || 'Centro'})</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-300 font-mono font-semibold">
                        {item.modality === 'donacion' ? 'Donación ($0)' :
                         item.modality === 'intercambio' ? 'Trueque' : `$${item.price} USD`}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 capitalize">
                        {item.condition.replace('_', ' ')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectListing(item);
                          onClose();
                        }}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <span>Ver Ficha</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
