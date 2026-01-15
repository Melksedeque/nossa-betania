import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/Card";
import { ContactForm } from "./ContactForm";

export default async function ContatoPage() {
  const [session, logoSetting] = await Promise.all([
    auth(),
    prisma.systemSetting.findUnique({
      where: { key: "logo_url" },
    }),
  ]);

  const isLoggedIn = !!session?.user;
  const logoUrl = logoSetting?.value;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <SiteHeader isLoggedIn={isLoggedIn} logoUrl={logoUrl} />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-8 md:p-10 bg-slate-900/80 border-slate-800">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fale com o Dono da Banca
            </h1>
            <p className="text-slate-400 mb-6">
              Tem uma ideia de mercado genial, um bug bizarro ou só quer desabafar
              sobre a última reunião interminável? Manda aqui que a mensagem chega
              direto no e-mail do Dono da Banca.
            </p>

            <ContactForm />
          </Card>
        </div>
      </main>

      <SiteFooter logoUrl={logoUrl} />
    </div>
  );
}

