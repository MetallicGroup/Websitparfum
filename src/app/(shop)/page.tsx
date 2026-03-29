import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Clock } from "lucide-react";
import styles from "./page.module.css";
import { getProducts } from "@/actions/product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acasă | KiddyShop - Magazin de Haine și Jucării pentru Copii",
  description: "Cea mai variată gamă de haine și jucării pentru copii și bebeluși. Calitate premium și livrare rapidă.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: popularProductsRaw } = await getProducts({ isPopular: true, take: 4 });
  
  // Fallback to latest products if no popular products are found
  let popularProducts = popularProductsRaw;
  if (!popularProducts || popularProducts.length === 0) {
    const { data: latestProducts } = await getProducts({ take: 4 });
    popularProducts = latestProducts;
  }

  return (
    <div className={styles.homeContainer}>
      
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <span className={styles.heroBadge}>Noua Colecție de Primăvară 🌸</span>
            <h1 className={styles.heroTitle}>Bucurie în culori pentru <span className={styles.textHighlight}>Cei Mici!</span></h1>
            <p className={styles.heroDescription}>
              Descoperă haine confortabile, jucării educative și accesorii premium create cu grijă și dragoste pentru copilul tău.
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop" className="btn btn-primary">
                Descoperă Magazinul
              </Link>
              <Link href="/shop?category=jucarii" className={`btn btn-secondary ${styles.btnLight}`}>
                Vezi Jucării
              </Link>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <div className={styles.blobShape}></div>
            {/* Visual placeholder for Hero Image */}
            <div className={styles.heroImagePlaceholder}>
              <span className={styles.emojiDisplay}>🧸👕🎈</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className={styles.features}>
        <div className={`container ${styles.featuresGrid}`}>
          <div className={styles.featureItem}>
            <div className={styles.featureIconWrap}><Truck size={28} /></div>
            <div>
              <h4 className={styles.featureTitle}>Livrare Rapidă</h4>
              <p className={styles.featureDesc}>În 24-48 de ore, oriunde în țară.</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIconWrap}><ShieldCheck size={28} /></div>
            <div>
              <h4 className={styles.featureTitle}>Plăți Sigure</h4>
              <p className={styles.featureDesc}>Tranzacții protejate 100%.</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIconWrap}><Clock size={28} /></div>
            <div>
              <h4 className={styles.featureTitle}>Suport 24/7</h4>
              <p className={styles.featureDesc}>Suntem aici pentru tine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Alege categoria</h2>
          <Link href="/shop" className={styles.shopAllLink}>
            Vezi toate <ArrowRight size={18} />
          </Link>
        </div>
        <div className={styles.categoryGrid}>
          <Link href="/shop?category=haine" className={`${styles.categoryCard} ${styles.catBg1}`}>
            <span className={styles.catEmoji}>👗</span>
            <h3>Haine Copii</h3>
            <div className={styles.playfulDecoration}></div>
          </Link>
          <Link href="/shop?category=bebe" className={`${styles.categoryCard} ${styles.catBg2}`}>
            <span className={styles.catEmoji}>🍼</span>
            <h3>Bebe (0-2 ani)</h3>
            <div className={styles.playfulDecoration}></div>
          </Link>
          <Link href="/shop?category=jucarii" className={`${styles.categoryCard} ${styles.catBg3}`}>
            <span className={styles.catEmoji}>🚂</span>
            <h3>Jucării</h3>
            <div className={styles.playfulDecoration}></div>
          </Link>
          <Link href="/shop?category=accesorii" className={`${styles.categoryCard} ${styles.catBg4}`}>
            <span className={styles.catEmoji}>🎒</span>
            <h3>Accesorii</h3>
            <div className={styles.playfulDecoration}></div>
          </Link>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Cele mai apreciate ❤️</h2>
        </div>
        <div className={styles.productGrid}>
          {popularProducts && popularProducts.length > 0 ? (
            popularProducts.map((product) => {
              const images = JSON.parse(product.images || "[]");
              return (
                <div key={product.id} className={styles.productCard}>
                  <Link href={`/product/${product.id}`} className={styles.productImgWrap}>
                    <div className={styles.productPlaceholderImg} style={{ backgroundImage: `url(${images[0]})` }}>
                      {!images[0] && "📷 Imagine Produs"}
                    </div>
                    {product.isNew && <span className={styles.badgeNew}>Nou</span>}
                  </Link>
                  <div className={styles.productInfo}>
                    <p className={styles.productCat}>{product.category?.name || "Categorie"}</p>
                    <Link href={`/product/${product.id}`} className={styles.productName}>
                      {product.name}
                    </Link>
                    <div className={styles.productPriceRow}>
                      <span className={styles.productPrice}>{product.price.toFixed(2)} Lei</span>
                      <button className={styles.addToCartSmall} aria-label="Adaugă în coș">+</button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noProducts}>
              <p>Momentan nu există produse recomandate. Explorează magazinul nostru!</p>
              <Link href="/shop" className="btn btn-secondary mt-2">Vezi toate produsele</Link>
            </div>
          )}
        </div>
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className={`container ${styles.section}`}>
        <div className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <h2>Reducere 20% la Cadouri!</h2>
            <p>Pentru zile de naștere și surprize, descoperă colecția noastră de cadouri speciale.</p>
            <Link href="/shop?category=cadouri" className="btn btn-secondary">
              Vezi Cadouri
            </Link>
          </div>
          <div className={styles.promoDecor}>🎁</div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={`container ${styles.section} ${styles.testimonialsSection}`}>
        <h2 className={styles.sectionTitle}>Părinții ne recomandă</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.rating}><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /></div>
            <p className={styles.testimonialText}>&quot;Materiale de excepție! Fetița mea adoră hainele, iar livrarea a fost incredibil de rapidă. Sigur voi reveni.&quot;</p>
            <p className={styles.testimonialAuthor}>- Ana Maria D.</p>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.rating}><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /></div>
            <p className={styles.testimonialText}>&quot;Am luat o tricicletă și niște haine. Totul premium, arată fix ca în poze. Recomand cu drag magazinul!&quot;</p>
            <p className={styles.testimonialAuthor}>- Bogdan C.</p>
          </div>
          <div className={styles.testimonialCard}>
             <div className={styles.rating}><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /><Star fill="#FBBF24" color="#FBBF24" /></div>
            <p className={styles.testimonialText}>&quot;Mi-au depășit așteptările. Ambajajul este jucăuș, iar calitatea hainuțelor e formidabilă.&quot;</p>
            <p className={styles.testimonialAuthor}>- Elena S.</p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className={styles.newsletterSection}>
        <div className={`container ${styles.newsletterWrapper}`}>
          <div className={styles.newsletterContent}>
            <h2>Vrei surprize pe email?</h2>
            <p>Abonează-te la newsletter și primești 10% reducere la prima comandă!</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Adresa ta de email..." className={styles.newsletterInput} required />
              <button type="submit" className={`btn btn-primary ${styles.newsletterBtn}`}>Abonare</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
