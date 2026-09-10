# GeoFiber Maps

Arquitetura da biblioteca SVG

public/geofiber-icons
        │
        ▼
GeoFiberIconRegistry
        │
        ▼
mapIcons.ts
        │
        ▼
Leaflet Icon
        │
        ▼
Marker
        │
        ▼
Mapa

Toda a aplicação deve utilizar apenas o
GeoFiberIconRegistry para localizar SVGs.

Nunca utilizar caminhos absolutos espalhados
pelo código.

Isso garante manutenção simples e troca de
ícones em um único ponto.
