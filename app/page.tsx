"use client";

import { useEffect, useState, useMemo } from "react";
import { bloggerVariant, bloggerSrcSet } from "@/lib/image";

type Media = {
  id: string;
  filename: string;
  title: string;
  blogger_url: string;
  blogger_url_s1600?: string;
  metadata?: {
    program?: string;
    tanggal?: string;
    lokasi?: string;
    organisasi?: string;
  };
  created_at: string;
};

type Program = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

function formatDisplayDate(manualDate?: string, fallbackCreatedAt?: string, full = false): string {
  if (manualDate) {
    const parts = String(manualDate).split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: full ? "long" : "short",
          year: "numeric",
        });
      }
    }
    const d = new Date(manualDate);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: full ? "long" : "short",
        year: "numeric",
      });
    }
  }

  if (fallbackCreatedAt) {
    const d = new Date(fallbackCreatedAt);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: full ? "long" : "short",
        year: "numeric",
      });
    }
  }

  return "—";
}

export default function AlbumHomePage() {
  const [items, setItems] = useState<Media[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeProg, setActiveProg] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalMedia, setTotalMedia] = useState<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  async function fetchGallery(progId = "", search = "", pageNum = 1, append = false) {
    if (pageNum === 1 && !append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: "24",
      });
      if (progId) params.set("prog", progId);
      if (search) params.set("q", search);

      const res = await fetch(`/api/gallery?${params.toString()}`);
      const json = await res.json();

      if (json.programs) {
        setPrograms(json.programs);
      }
      if (json.total_media !== undefined) {
        setTotalMedia(json.total_media);
      }

      if (append) {
        setItems((prev) => [...prev, ...(json.data || [])]);
      } else {
        setItems(json.data || []);
      }

      setPage(pageNum);
      setHasMore(json.pagination?.has_more || false);
    } catch (err) {
      console.error("Gagal memuat galeri:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchGallery(activeProg, searchQuery, 1, false);
  }, [activeProg]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchGallery(activeProg, searchQuery, 1, false);
  }

  function handleSelectProgram(progId: string) {
    setActiveProg(progId);
    setSearchQuery("");
  }

  function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    fetchGallery(activeProg, searchQuery, page + 1, true);
  }

  function handleShareWhatsApp(photo: Media) {
    const title = photo.title || photo.filename;
    const prog = photo.metadata?.program || "Dokumentasi";
    const date = formatDisplayDate(photo.metadata?.tanggal, photo.created_at, true);
    const text = `*${title}*\nProgram: ${prog}\nTanggal: ${date}\nLihat foto: ${photo.blogger_url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  const activeProgramName = useMemo(() => {
    if (!activeProg) return "Semua Koleksi Foto";
    const found = programs.find((p) => p.id === activeProg);
    return found ? found.name : "Koleksi Program";
  }, [activeProg, programs]);

  return (
    <div className="page-shell">
      {/* 1. Top Ecosystem Nav */}
      <div className="mdh-topbar">
        <div className="mdh-topbar-inner">
          <div className="mdh-topbar-left">
            <span>🕌 <strong>Masjid Darul Hidayah</strong></span>
            <span className="mdh-tagline">— Titik Nol Tanah Merah, Boven Digoel</span>
          </div>
          <nav className="mdh-topbar-links">
            <a href="https://mdh.or.id" target="_blank" rel="noreferrer">Beranda MDH</a>
            <a href="https://news.mdh.or.id" target="_blank" rel="noreferrer">Kabar Berita</a>
            <a href="https://mdh.or.id/#pricing-wrapper" target="_blank" rel="noreferrer">Donasi / Rekening</a>
            <a href="https://mdh.or.id/p/about.html" target="_blank" rel="noreferrer">Tentang Kami</a>
          </nav>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="header-main">
        <div className="header-inner">
          <div className="brand-group">
            <img src="/logo.png" alt="Logo Darul Hidayah" className="brand-logo" />
            <div className="brand-text">
              <h1>ALBUM DARUL HIDAYAH</h1>
              <span>Arsip Visual & Dokumentasi Kegiatan Umat</span>
            </div>
          </div>
          <div className="header-nav">
            <a href="https://mdh.or.id/#pricing-wrapper" target="_blank" rel="noreferrer" className="header-btn">
              <span>💚</span> Donasi Masjid
            </a>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">DOKUMENTASI RESMI</div>
          <h2 className="hero-title">Galeri Dokumentasi & Arsip Visual</h2>
          <p className="hero-desc">
            Menyajikan rekaman visual perjalanan dakwah, santunan anak yatim, pembinaan generasi Qur'ani (TPQ), dan pembangunan Masjid Darul Hidayah.
          </p>
          <form className="hero-search-box" onSubmit={handleSearchSubmit}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Cari foto, kegiatan, atau tahun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearchQuery("");
                  fetchGallery(activeProg, "", 1, false);
                }}
              >
                ×
              </button>
            )}
          </form>
        </div>
      </section>

      {/* 4. Main Gallery Section */}
      <main className="main-wrap">
        {/* Program Filter Pills */}
        <div className="filter-bar" role="tablist">
          <button
            type="button"
            className={`filter-pill ${!activeProg ? "active" : ""}`}
            onClick={() => handleSelectProgram("")}
          >
            <span>Semua Foto</span>
            <span className="filter-count">{totalMedia}</span>
          </button>
          {programs.map((prog) => (
            <button
              key={prog.id}
              type="button"
              className={`filter-pill ${activeProg === prog.id ? "active" : ""}`}
              onClick={() => handleSelectProgram(prog.id)}
            >
              <span>{prog.name}</span>
              <span className="filter-count">{prog.count}</span>
            </button>
          ))}
        </div>

        {/* Gallery Heading Row */}
        <div className="gallery-meta-row">
          <div>
            <strong>{activeProgramName}</strong>
            {searchQuery && <span> • Hasil pencarian "{searchQuery}"</span>}
          </div>
          <div>
            Menampilkan {items.length} foto
          </div>
        </div>

        {/* Grid Photos */}
        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏳</div>
            <p>Memuat koleksi foto Darul Hidayah...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", border: "1px dashed var(--line)", borderRadius: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
            <h3 style={{ margin: "0 0 4px" }}>Belum Ada Foto</h3>
            <p style={{ color: "var(--muted)", fontSize: "12px", margin: 0 }}>
              Tidak ada dokumentasi foto yang sesuai dengan pilihan atau pencarian ini.
            </p>
          </div>
        ) : (
          <div className="gallery-grid">
            {items.map((photo) => {
              const thumbSmall = bloggerVariant(photo.blogger_url, "thumb");
              const thumbCard = bloggerVariant(photo.blogger_url, "card");
              return (
                <article
                  key={photo.id}
                  className="photo-card"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="photo-thumb-wrap">
                    <img
                      src={thumbSmall}
                      srcSet={`${thumbSmall} 240w, ${thumbCard} 480w`}
                      sizes="(max-width: 620px) 180px, 320px"
                      alt={photo.title || photo.filename}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="photo-overlay">
                      <span>Buka detail ↗</span>
                    </div>
                  </div>
                  <div className="photo-meta">
                    <span className="photo-program-tag">
                      {photo.metadata?.program || "Darul Hidayah"}
                    </span>
                    <h3 className="photo-title">
                      {photo.title || photo.filename}
                    </h3>
                    <div className="photo-sub-row">
                      <span>📍 {photo.metadata?.lokasi || "Tanah Merah"}</span>
                      <span>{formatDisplayDate(photo.metadata?.tanggal, photo.created_at)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="load-more-wrap">
            <button
              type="button"
              className="load-more-btn"
              disabled={loadingMore}
              onClick={handleLoadMore}
            >
              {loadingMore ? "Memuat foto berikutnya..." : "⬇️ Muat Lebih Banyak Foto"}
            </button>
          </div>
        )}
      </main>

      {/* 5. Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-side">
              <img
                src={bloggerVariant(selectedPhoto.blogger_url, "medium")}
                srcSet={bloggerSrcSet(selectedPhoto.blogger_url)}
                sizes="(max-width: 768px) 100vw, 700px"
                alt={selectedPhoto.title || selectedPhoto.filename}
              />
            </div>
            <div className="lightbox-content-side">
              <div className="lightbox-header">
                <div>
                  <span style={{ fontSize: "10px", color: "var(--primary)", fontWeight: 800 }}>DOKUMENTASI FOTO</span>
                  <h3>{selectedPhoto.title || selectedPhoto.filename}</h3>
                </div>
                <button
                  type="button"
                  className="lightbox-close-btn"
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>

              <dl className="lightbox-dl">
                <div>
                  <dt>Program / Kegiatan</dt>
                  <dd>{selectedPhoto.metadata?.program || "Darul Hidayah"}</dd>
                </div>
                <div>
                  <dt>Tanggal Kegiatan</dt>
                  <dd>{formatDisplayDate(selectedPhoto.metadata?.tanggal, selectedPhoto.created_at, true)}</dd>
                </div>
                <div>
                  <dt>Lokasi</dt>
                  <dd>{selectedPhoto.metadata?.lokasi || "Tanah Merah, Boven Digoel"}</dd>
                </div>
                <div>
                  <dt>Kode Arsip</dt>
                  <dd style={{ fontFamily: "monospace", fontSize: "11px" }}>{selectedPhoto.id}</dd>
                </div>
              </dl>

              <div className="lightbox-actions">
                <a
                  href={selectedPhoto.blogger_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-original-btn"
                >
                  <span>⬇️</span> Unduh Foto Resolusi Asli (s0)
                </a>
                <button
                  type="button"
                  className="share-wa-btn"
                  onClick={() => handleShareWhatsApp(selectedPhoto)}
                >
                  <span>💬</span> Bagikan ke WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer */}
      <footer className="footer-main">
        <div className="footer-inner">
          <div className="footer-col">
            <h4>MASJID DARUL HIDAYAH</h4>
            <p style={{ margin: "0 0 8px" }}>
              Jl. Ampera, Kampung Persatuan, Distrik Mandobo — Titik Nol Tanah Merah, Kabupaten Boven Digoel, Papua Selatan.
            </p>
            <p style={{ margin: 0, color: "#a5c9b4" }}>
              ID SIMAS KEMENAG: <code>01.4.32.16.01.000003</code>
            </p>
          </div>

          <div className="footer-col">
            <h4>LINK EKOSISTEM</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "6px" }}>
              <li><a href="https://mdh.or.id" target="_blank" rel="noreferrer">Website Utama (mdh.or.id)</a></li>
              <li><a href="https://news.mdh.or.id" target="_blank" rel="noreferrer">Portal Berita (news.mdh.or.id)</a></li>
              <li><a href="https://mdh.or.id/#pricing-wrapper" target="_blank" rel="noreferrer">Donasi Pembangunan & Yatim</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>REKENING INFAQ & YATIM</h4>
            <p style={{ margin: "0 0 4px" }}><strong>Peduli Anak Yatim:</strong></p>
            <p style={{ margin: "0 0 8px", color: "#e3f2ea" }}>BRI: <code>2156-0100-0215-563</code></p>
            <p style={{ margin: "0 0 4px" }}><strong>Kas Pembangunan Masjid:</strong></p>
            <p style={{ margin: 0, color: "#e3f2ea" }}>BRI: <code>2156-0100-0796-535</code></p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Masjid Darul Hidayah Boven Digoel. Terhubung ke Arsip Visual Media Vault.
        </div>
      </footer>
    </div>
  );
}
