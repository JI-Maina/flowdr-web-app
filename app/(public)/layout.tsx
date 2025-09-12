import React from "react";

import SiteHeader from "@/components/site/site-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SiteHeader />
      {children}
    </div>
  );
}
