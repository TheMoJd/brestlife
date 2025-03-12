import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, Loader2 } from "lucide-react";
import { authenticateUser, AuthenticateUserData } from "../gen/openapi";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthenticateUserData>();

  const onSubmit = async (data: AuthenticateUserData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await authenticateUser( {body: data.body } );

      if (response.data) {
        login(response.data?.user, response.data?.token);
        navigate("/admin"); // Redirection après connexion
      } else {
        setErrorMessage("Email ou mot de passe incorrect");
      }
    } catch (err) {
      setErrorMessage("Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Connexion à votre compte
        </h2>

        {errorMessage && (
          <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">
            {errorMessage}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute inset-y-0 left-3 h-5 w-5 text-gray-400" />
              <input
                {...register("body.email", {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Adresse email invalide",
                  },
                })}
                type="email"
                className="block w-full pl-10 border border-gray-300 rounded-md"
                placeholder="vous@exemple.com"
              />
            </div>
            {errors.body?.email && <p className="text-sm text-red-600">{errors.body.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute inset-y-0 left-3 h-5 w-5 text-gray-400" />
              <input
                {...register("body.password", {
                  required: "Le mot de passe est requis",
                  minLength: {
                    value: 6,
                    message: "Au moins 6 caractères",
                  },
                })}
                type="password"
                className="block w-full pl-10 border border-gray-300 rounded-md"
                placeholder="••••••••"
              />
            </div>
            {errors.body?.password && <p className="text-sm text-red-600">{errors.body.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-blue-600 text-white"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
