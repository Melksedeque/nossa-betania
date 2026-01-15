import { prisma } from "@/lib/prisma";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const logoSetting = await prisma.systemSetting.findUnique({
    where: { key: 'logo_url' },
  });
  const logoUrl = logoSetting?.value;

  return <RegisterForm logoUrl={logoUrl} />;
}
