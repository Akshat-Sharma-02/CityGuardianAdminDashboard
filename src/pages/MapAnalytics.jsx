import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import api from '../api/api';
import config from '../config';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { IconButton } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Icon for Pothole Markers based on severity
const createCustomIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-pothole-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Custom Icon for User Location
const createUserLocationIcon = () => {
  return new L.DivIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        font-size: 32px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    popupAnchor: [0, -32]
  });
};

const RecenterMap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 16, { animate: true, duration: 1.5 });
    }
  }, [location, map]);
  return null;
};

export default function MapAnalytics() {
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  
  // Track hovered markers
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const [hoveredLocMarker, setHoveredLocMarker] = useState(false);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res.data.success) {
          setReports(res.data.data.filter(r => 
            r.location?.latitude && 
            r.location?.longitude && 
            r.status === 'Verified'
          ));
        }
      } catch (err) {
        setError('Failed to load map data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();

    // Get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setCenter(loc);
        },
        (error) => {
          console.error("Error obtaining location", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleLocateMe = () => {
    if (userLocation) {
      setCenter([...userLocation]);
    } else if ("geolocation" in navigator) {
       navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setCenter(loc);
        }
      );
    }
  };

  const getMarkerColor = (severity) => {
    switch(severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#eab308';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
          Geospatial Map Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Live overview of all <strong>Verified</strong> incidents and infrastructure reports
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Paper elevation={0} sx={{ 
        flexGrow: 1, 
        borderRadius: 4, 
        overflow: 'hidden', 
        border: '1px solid #F1F5F9',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        <MapContainer key={center.join(',')} center={center} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          <RecenterMap location={center} />
          <TileLayer
            attribution={config.MAP_ATTRIBUTION}
            url={config.MAP_TILE_PROVIDER}
            maxZoom={20}
            detectRetina={true}
            tileSize={512}
            zoomOffset={-1}
          />
          <style>
            {`
              .leaflet-popup-content-wrapper { padding: 0; overflow: hidden; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
              .leaflet-popup-content { margin: 0; width: 280px !important; }
              .leaflet-popup-tip { box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
            `}
          </style>
          
          {reports.map((r, index) => {
            const markerColor = getMarkerColor(r.severity);
            const isHovered = hoveredMarkerId === (r._id || index);
            
            return (
              <Marker 
                key={r._id || index} 
                position={[r.location.latitude, r.location.longitude]}
                icon={createCustomIcon(markerColor)}
                eventHandlers={{
                  mouseover: (e) => {
                    setHoveredMarkerId(r._id || index);
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    setHoveredMarkerId(null);
                    e.target.closePopup();
                  }
                }}
              >
                <Popup closeButton={false} autoPan={false}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ bgcolor: markerColor, color: 'white', py: 1.5, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                        {r.severity} Severity
                      </Typography>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', px: 1, py: 0.25, borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                          Verified
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', minHeight: 40 }}>
                        {r.imageUrl && (
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%',
                            overflow: 'hidden',
                            bgcolor: '#f1f5f9',
                            flexShrink: 0,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <img 
                              src={r.imageUrl} 
                              alt="Pothole" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </Box>
                        )}
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.primary', 
                            fontWeight: 500, 
                            lineHeight: 1.4, 
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          "{r.description}"
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
                        <Box>
                           <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                            Reported By
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            @{r.reportedBy?.username || 'user'}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                            Date
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                             {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Popup>
              </Marker>
            );
          })}
          
          {userLocation && (
            <Marker 
              position={userLocation}
              icon={createUserLocationIcon()}
              zIndexOffset={1000}
              eventHandlers={{
                mouseover: (e) => {
                  setHoveredLocMarker(true);
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  setHoveredLocMarker(false);
                  e.target.closePopup();
                }
              }}
            >
              <Popup closeButton={false} autoPan={false}>
                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ bgcolor: '#2563eb', color: 'white', py: 1.5, px: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                      Current Location
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, lineHeight: 1.5 }}>
                      This marker represents your device's current GPS coordinates on the map.
                    </Typography>
                  </Box>
                </Box>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        
        <Box sx={{ position: 'absolute', bottom: 24, right: 24, zIndex: 1000 }}>
          <IconButton 
            onClick={handleLocateMe}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': { bgcolor: '#f8fafc' },
              p: 1.5
            }}
          >
            <MyLocationIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
