import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import FormInput from "./FormInput";

const LoginPage = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });

  const loginHandler = async (data) => {
    setLoader(true);
    console.log(data);

    try {
      const response = await api.post("/api/auth/login", data);
      console.log("Login Sucessful: ", response.data);

      toast.success("Login Sucessful!");
      reset();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Invalid username or password!",
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(loginHandler)}
        className="w-full max-w-[450px] shadow-custom py-8 px-6 sm:px-8 rounded-md"
      >
        {/* Heading */}
        <h1 className="text-center text-btnColor font-bold text-2xl lg:text-3xl">
          Login Here
        </h1>
        <hr className="mt-2 mb-5 border-slate-300" />

        {/* Input Fields */}
        <div className="flex flex-col gap-4">
          <FormInput
            label="Username"
            id="username"
            type="text"
            placeholder="Type your username"
            register={register}
            errors={errors}
            required
            message="Username is required"
          />

          <FormInput
            label="Password"
            id="password"
            type="password"
            required
            min={6}
            message="Password is required"
            placeholder="Type your password"
            register={register}
            errors={errors}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loader}
          className=" w-full bg-custom-gradient rounded-md text-white font-semibold py-2 mt-5 hover:opacity-80 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loader ? "Logging in..." : "Login"}
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an Account?{" "}
          <Link
            to="/register"
            className="font-semibold text-btnColor hover:underline"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
