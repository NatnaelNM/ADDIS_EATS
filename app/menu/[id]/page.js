import Image from "next/image";
import { notFound } from "next/navigation";
import { dishes, getDish } from "@/lib/dishes";
import { formatETB } from "@/lib/format";
import DishPurchase from "./DishPurchase";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDish(id);

  if (!dish) {
    return {
      title: "Dish not found",
      description: "This dish could not be found on the Addis Eats menu.",
    };
  }

  const description = `${dish.name} — ${dish.price} ETB. ${dish.description} Order from Addis Eats in Addis Ababa.`;

  return {
    title: dish.name,
    description: description.slice(0, 160),
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: {
      type: "website",
      title: `${dish.name} | Addis Eats`,
      description,
      url: `/menu/${dish.id}`,
      images: [
        {
          url: `/menu/${dish.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${dish.name} from Addis Eats`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dish.name} | Addis Eats`,
      description,
      images: [`/menu/${dish.id}/opengraph-image`],
    },
  };
}

export function generateStaticParams() {
  return dishes.map(({ id }) => ({ id }));
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = getDish(id);

  if (!dish) {
    notFound();
  }

  const dishJsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: dish.image,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
      availability: "https://schema.org/InStock",
      url: `${(process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et").replace(/\/$/, "")}/menu/${dish.id}`,
    },
    ...(dish.category === "Vegetarian"
      ? { suitableForDiet: "https://schema.org/VegetarianDiet" }
      : {}),
  };

  return (
    <main className="container detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dishJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="detail-image">
        <Image
          src={dish.image}
          alt={`Traditional Ethiopian ${dish.name}`}
          width={900}
          height={600}
          sizes="(max-width: 760px) 100vw, 50vw"
          className="detail-photo"
        />
      </div>

      <div className="detail-copy">
        <span className="eyebrow">ADDIS EATS</span>
        <h1>{dish.name}</h1>
        <p className="price-large">{formatETB(dish.price)}</p>
        <p>{dish.description}</p>
        <DishPurchase dish={dish} />
      </div>
    </main>
  );
}
