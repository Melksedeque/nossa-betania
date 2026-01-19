import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FaqAccordion } from "@/components/FaqAccordion";

export default async function FaqsPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const logoSetting = await prisma.systemSetting.findUnique({ where: { key: 'logo_url' } });
  const logoUrl = logoSetting?.value;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <SiteHeader isLoggedIn={isLoggedIn} logoUrl={logoUrl} />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
           <h1 className="text-4xl font-bold text-white text-center mb-8">Perguntas <span className="text-orange-400">Frequentes</span></h1>
           <p className="text-slate-400 text-center mb-12">Dúvidas que tiram o sono mais que deploy de sexta-feira.</p>
           <FaqAccordion />
        </div>
      </main>
      <SiteFooter logoUrl={logoUrl} />
    </div>
  );
}
