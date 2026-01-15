import { prisma } from "@/lib/prisma";
import { LoginForm } from "./LoginForm";
import { auth } from "@/auth";

export default async function LoginPage() {
  const [session, logoSetting] = await Promise.all([
    auth(),
    prisma.systemSetting.findUnique({
      where: { key: 'logo_url' },
    }),
  ]);

  const logoUrl = logoSetting?.value;

  let logoHref = "/";
  if (session?.user) {
    logoHref = session.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
  }

  return <LoginForm logoUrl={logoUrl} logoHref={logoHref} />;
}
