import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/contexts/AuthContext";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { encryptData } from "@/lib/crypto-js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.svg";

function Step1() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
    <Card className="w-full h-full border-0 shadow-none">
      <CardHeader className="text-center pb-2 justify-center items-center">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 w-16 h-16 shadow-md shadow-primary/10 rounded-2xl border border-border/20"
        />
        <CardTitle className="text-2xl font-bold text-primary">
          {t("login_welcome")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <form
          data-cy="login-step1-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Email field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              כתובת מייל
            </label>
            <div className="relative">
              <Input
                icon={<Mail className="text-muted-foreground my-1" />}
                name="mail"
                type="email"
                placeholder="הקלד כתובת מייל"
                data-cy="login-email"
                required
                id="mail"
                className="h-12"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">סיסמה</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="הקלד סיסמה"
                data-cy="login-password"
                name="password"
                id="password"
                icon={<Lock className="text-muted-foreground my-1" />}
                required
                className="h-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-muted-foreground hover:text-foreground duration-150"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {errorMessage && (
            <p
              className="text-red-500 font-normal"
              data-cy="login-error-message"
            >
              {t(errorMessage)}
            </p>
          )}
          {/* forgot password */}
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              שכחתי סיסמה
            </a>
          </div>

          {/* Sign in button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            data-cy="login-submit"
          >
            {t("continue")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default Step1;
