# Tata Surya 3D — Three.js Deep Dive

## Identitas
- Nama : Luther Famohouni Gea
- NIM : 2305010027
- Mata Kuliah : Pengembangan Game dan Teknologi Immersive

## Tema Scene
Tata Surya 3D interaktif dengan 5 planet (Merkurius, Venus, Bumi, Mars, Jupiter)
yang berputar mengelilingi Matahari dengan animasi orbit real-time.

## Fitur
- 5 planet dengan ukuran berbeda mengorbit Matahari
- Tekstur foto Bumi (TextureLoader)
- 2000 bintang di background
- Cincin pada Jupiter
- Hover planet = nama dan info muncul di layar
- Klik planet = membesar dan terpilih, klik lagi = deselect
- OrbitControls (putar, zoom, pan dengan mouse)
- Shadow aktif (DirectionalLight + PCFSoftShadowMap)

## Cara Menjalankan
Buka link berikut di browser:
https://luthergea.github.io/tata-surya-3d

## Screenshot

### Tampilan Normal
Tata Surya 3D (screenshot1.png)

### Saat Planet Diklik
Planet Dipilih (screenshot2.png)

## Teknologi
- Three.js r160 via ES Modules (esm.sh CDN)
- OrbitControls
- Raycasting (hover + klik)
- TextureLoader
- Shadow (DirectionalLight + PCFSoftShadowMap)
- setAnimationLoop
