import { prisma } from "@/lib/prisma";
import { RegisterForm } from "./RegisterForm";
import { auth } from "@/auth";

export default async function RegisterPage() {
  const [session, logoSetting] = await Promise.all([
    auth(),
    prisma.systemSetting.findUnique({
      where: { key: 'logo_url' },
    }),
  ]);

  const logoUrl = logoSetting?.value;

  const logoHref = "/";

  return <RegisterForm logoUrl={logoUrl} logoHref={logoHref} />;
}
