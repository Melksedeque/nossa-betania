import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/Card";
import { ContactForm } from "./ContactForm";
import Image from "next/image";

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
        <div className="container mx-auto px-4 flex items-center justify-between max-w-6xl">
          <Card className="p-8 md:p-10 bg-slate-900/80 border-slate-800 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Fale com o <span className="text-orange-400">Dono da Banca</span>
            </h1>
            <p className="text-slate-400 mb-6">
              Tem uma ideia de mercado genial, um bug bizarro ou só quer desabafar
              sobre a última reunião interminável? Manda aqui que a mensagem chega
              direto no e-mail do Dono da Banca.
            </p>

            <ContactForm />
          </Card>
          <Image
            src="/mascote3.png"
            alt="Ilustração de contato"
            width={360}
            height={390}
            className="animate-float-slow"
          />
        </div>
      </main>

      <SiteFooter logoUrl={logoUrl} />
    </div>
  );
}

