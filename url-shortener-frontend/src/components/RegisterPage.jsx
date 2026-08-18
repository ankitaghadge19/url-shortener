import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import FormInput from "./FormInput";

const RegisterPage = () => {
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
      email: "",
      role: ["ROLE_USER"],
      password: "",
    },
    mode: "onTouched",
  });

  const registerHandler = async (data) => {
    setLoader(true);
    console.log(data);

    try {
      const response = await api.post("/api/auth/register", data);
      console.log(response);
      
      toast.success("Registration Sucessful!");
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Registration Failed!");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(registerHandler)}
        className="w-full max-w-[450px] shadow-custom py-8 px-6 sm:px-8 rounded-md"
      >
        {/* Heading */}
        <h1 className="text-center text-btnColor font-bold text-2xl lg:text-3xl">
          Register Here
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
            label="Email"
            id="email"
            type="email"
            required
            message="Email is required"
            placeholder="Type your email"
            register={register}
            errors={errors}
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

        {/* Register Button */}
        <button
          type="submit"
          disabled={loader}
          className=" w-full bg-custom-gradient rounded-md text-white font-semibold py-2 mt-5 hover:opacity-80 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loader ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an Account?{" "}
          <Link
            to="/login"
            className="font-semibold text-btnColor hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
