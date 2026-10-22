import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FormInput from "./FormInput";

const LoginPage = () => {
  // Tracks whether the login request is in progress.
  // Used to disable the submit button and display a loading message.
  const [loader, setLoader] = useState(false);

  // Provides programmatic navigation after successful login.
  const navigate = useNavigate();

  // Access the login function defined in the authentication context.
  const { login } = useAuth();

  // Initialize React Hook Form to manage form values, validation, and errors.
  const {
    register, // Connects input fields to React Hook Form and applies validation rules.
    handleSubmit, // Validates the form before calling the login handler.
    reset, // Resets the form fields to their default values.
    formState: { errors }, // Contains validation errors for individual fields.
  } = useForm({
    // Set the initial values of the login form.
    defaultValues: {
      username: "",
      password: "",
    },

    // Validate fields when they have been touched and subsequently changed.
    mode: "onTouched",
  });

  // Handles form submission after React Hook Form validation succeeds.
  const loginHandler = async (data) => {
    // Show the loading state while the authentication request is running.
    setLoader(true);

    try {
      // Send the username and password to the authentication logic.
      // Wait for the login request to complete before proceeding.
      await login(data);

      // Notify the user that authentication was successful.
      toast.success("Login Successful!");

      // Clear the form fields after successful login.
      reset();

      // Navigate to the dashboard after a short delay so the user has time to see the success notification.
      setTimeout(() => {
        void navigate("/dashboard");
      }, 1000);
    } catch {
      // Display a user-friendly message if authentication fails.
      // This also handles errors thrown by the login function.
      toast.error("Unable to log in. Check your username and password.");
    } finally {
      // Always clear the loading state, whether login succeeds or fails.
      setLoader(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex justify-center items-center">
      <form
        // handleSubmit validates the form before executing loginHandler.
        onSubmit={handleSubmit(loginHandler)}
        className="w-full max-w-112.5 shadow-custom py-8 px-6 sm:px-8 rounded-md"
      >
        {/* Display the login page heading */}
        <h1 className="text-center text-btnColor font-bold text-2xl lg:text-3xl">
          Login Here
        </h1>
        <hr className="mt-2 mb-5 border-slate-300" />

        {/* Reusable input components with field-specific validation */}
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

        {/* Prevent repeated submissions while login is in progress */}
        <button
          type="submit"
          disabled={loader}
          className=" w-full bg-custom-gradient rounded-md text-white font-semibold py-2 mt-5 hover:opacity-80 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Update the button text according to the loading state */}
          {loader ? "Logging in..." : "Login"}
        </button>

        {/* Provide navigation to the registration page for new users */}
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
