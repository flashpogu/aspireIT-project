import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = handleSubmit(async (Formdata) => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: Formdata.username,
          email: Formdata.email,
          password: Formdata.password,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      setLoading(false);
    }
  });

  return (
    <div className="container mx-auto py-10 flex-1 px-4">
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <h2 className="text-3xl font-bold">Register for Aspireit</h2>
        <TextField
          disabled={loading}
          label="Username"
          variant="filled"
          type="text"
          {...register("username", { required: "This field is required" })}
          error={errors.username ? true : false}
        />
        <TextField
          disabled={loading}
          label="Email"
          variant="filled"
          type="email"
          {...register("email", { required: "This field is required" })}
          error={errors.email ? true : false}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
        <TextField
          disabled={loading}
          label="Password"
          variant="filled"
          type="text"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password ? true : false}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
        <TextField
          disabled={loading}
          type="text"
          label="Confirm Password"
          variant="filled"
          {...register("confirmPassword", {
            required: "This field is required",
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your password do not match";
              }
            },
          })}
          error={errors.confirmPassword ? true : false}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
        <span className="flex items-center justify-between">
          <span className="text-sm">
            Already Registered?{" "}
            <Link className="underline" to="/login">
              Login here
            </Link>
          </span>
          <Button disabled={loading} variant="contained" type="submit">
            Register
          </Button>
        </span>
        {errorMessage && (
          <Alert className="mt-5" variant="filled" severity="error">
            {errorMessage}
          </Alert>
        )}
      </form>
    </div>
  );
}
