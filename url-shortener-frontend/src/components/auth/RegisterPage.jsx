import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FormInput from "./FormInput";

const RegisterPage = () => {
  // Tracks whether registration is in progress to prevent repeated submissions.
  const [loader, setLoader] = useState(false);

  // Allows navigation to the login page after successful registration.
  const navigate = useNavigate();

  // Access the registration function from the authentication context.
  const { registerUser } = useAuth();

  // Initialize React Hook Form to manage input values, validation, and errors.
  const {
    register, // Connects input fields to React Hook Form.
    handleSubmit, // Validates the form before calling the registration handler.
    reset, // Resets all fields to their default values.
    formState: { errors }, // Stores validation errors for individual fields.
  } = useForm({
    // Set the initial values of the registration form.
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },

    // Validate fields when first touched and on subsequent changes.
    mode: "onTouched",
  });

  // Handles form submission after client-side validation succeeds.
  const registerHandler = async (data) => {
    // Show the loading state while the registration request is running.
    setLoader(true);

    try {
      // Submit the user's details to the registration logic in AuthContext.
      await registerUser(data);

      // Notify the user that registration was successful.
      toast.success("Registration Successful!");

      // Clear the form after successful registration.
      reset();

      // Delay navigation briefly so the success notification is visible.
      setTimeout(() => {
        void navigate("/login");
      }, 1000);
    } catch {
      // Display a user-friendly message if registration fails.
      toast.error("Unable to register. Check your details and try again.");
    } finally {
      // Always clear the loading state, whether registration succeeds or fails.
      setLoader(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex justify-center items-center">
      <form
        // Validate the form before executing registerHandler.
        onSubmit={handleSubmit(registerHandler)}
        className="w-full max-w-112.5 shadow-custom py-8 px-6 sm:px-8 rounded-md"
      >
        {/* Registration form heading */}
        <h1 className="text-center text-btnColor font-bold text-2xl lg:text-3xl">
          Register Here
        </h1>
        <hr className="mt-2 mb-5 border-slate-300" />

        {/* Reusable input fields with field-specific validation */}
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

        {/* Disable repeated submissions and show progress while registering */}
        <button
          type="submit"
          disabled={loader}
          className=" w-full bg-custom-gradient rounded-md text-white font-semibold py-2 mt-5 hover:opacity-80 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loader ? "Registering..." : "Register"}
        </button>

        {/* Provide navigation to the login page for existing users */}
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
