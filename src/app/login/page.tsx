"use client";

import { useTranslations } from "next-intl";
import {
  LoginForm,
  RegisterForm,
  AuthenticationLanguageDropdown,
} from "@/modules/authentication/components";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/shared/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthentication } from "@/modules/authentication/hooks";

export default function LoginPage() {
  const queryClient = new QueryClient();
  const { register, login } = useAuthentication();
  const t = useTranslations("authentication");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <div className="flex justify-end p-4">
          <AuthenticationLanguageDropdown />
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <Tabs defaultValue="login" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="login">{t("login")}</TabsTrigger>
              <TabsTrigger value="register">{t("register")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm login={login} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm register={register} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </QueryClientProvider>
  );
}
