import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value.replaceAll('"', "") || "es";

  return {
    locale,
    messages: (await import(`../dictionaries/${locale}.json`)).default,
  };
});
