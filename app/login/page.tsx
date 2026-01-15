import { prisma } from "@/lib/prisma";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const logoSetting = await prisma.systemSetting.findUnique({
    where: { key: 'logo_url' },
  });
  const logoUrl = logoSetting?.value;

  return <LoginForm logoUrl={logoUrl} />;
}
