import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/contexts/AuthContext";
import { Mail, Lock } from "lucide-react";
import { encryptData } from "@/lib/crypto-js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Step1() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const { t } = useTranslation();

  if (!auth) throw new Error("AuthContext must be used within an AuthProvider");

  const { login } = auth;
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const { password, mail } = Object.fromEntries(formData);

    const response = await login({
      email: String(mail),
      password: String(password),
    });
    if (response && response.status === 202 && response.data) {
      const encryptedData = encryptData({ step: 2 });
      navigate(`/login?d=${encryptedData}`);
      // @ts-ignore
    } else setErrorMessage(t(response?.error) || "אירעה שגיאה, נסה שוב.");
  };

  return (
    <>
      <form
        className="flex flex-col items-center gap-6 w-full"
        onSubmit={handleSubmit}
        data-cy="login-step1-form"
      >
        <h1 className="font-medium text-3xl">{t("login_welcome")}</h1>
        <div className="w-3/4 flex flex-col gap-4">
          <Input
            name="mail"
            placeholder="מייל"
            icon={<Mail className="text-[#606876]" />}
            data-cy="login-email"
          />
          <Input
            name="password"
            placeholder="סיסמה"
            type="password"
            icon={<Lock className="text-[#606876]" />}
            data-cy="login-password"
          />
          {errorMessage && (
            <p className="text-red-500 text-center font-normal" data-cy="login-error-message">
              {t(errorMessage)}
            </p>
          )}
          <Button
            type="submit"
            className="bg-black hover:bg-opacity-25 text-white"
            data-cy="login-submit"
          >
            {t("continue")}
          </Button>
        </div>
      </form>
    </>
  );
}

export default Step1;
