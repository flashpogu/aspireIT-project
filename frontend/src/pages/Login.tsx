import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Login() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = handleSubmit(async (formdata) => {
    try {
      dispatch(signInStart());
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.success));
        return setErrorMessage(data.message);
      } else {
        dispatch(signInSuccess(data));
      }
      setLoading(false);
      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error));
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
        <h2 className="text-3xl font-bold">Login for Aspireit</h2>
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
        <span className="flex items-center justify-between">
          <span className="text-sm">
            Didnt Registered?{" "}
            <Link className="underline" to="/register">
              register here
            </Link>
          </span>
          <Button disabled={loading} variant="contained" type="submit">
            Login
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
