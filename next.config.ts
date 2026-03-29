import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'mlxklmhcfdfrlgcwftuo.supabase.co' },
      { protocol: 'https', hostname: 'zlrdbr7u47nfsswo.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'img.emag.ro' },
      { protocol: 'https', hostname: 'main--ecommerce-haine-copii.vercel.app' },
    ],
  },
};

export default nextConfig;
