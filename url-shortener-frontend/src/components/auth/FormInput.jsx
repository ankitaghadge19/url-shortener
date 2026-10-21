
const FormInput = ({
  label,
  id,
  type = "text",
  placeholder,
  register,
  errors,
  required = false,
  message,
  min,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Display the input field label */}
      <label htmlFor={id} className="font-semibold text-sm text-slate-700">
        {label}
      </label>

      {/* Register the input with React Hook Form and apply validation rules */}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, {
          required: required
            ? {
                value: true,
                message: message,
              }
            : false,
          minLength: min
            ? {
                value: min,
                message: `Minimum ${min} characters are required`,
              }
            : undefined,
          pattern:
            type === "email"
              ? {
                  value: /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/,
                  message: "Please enter a valid email",
                }
              : undefined,
        })}
        className={`w-full px-3 py-2 border rounded-md outline-none text-slate-700
          focus:ring-2 focus:ring-blue-400
          ${errors[id] ? "border-red-500" : "border-slate-300"}`}
      />

      {/* Display the validation error, if any */}
      <div className="h-2">
        {errors[id] && (
          <p className="text-sm text-red-600">{errors[id].message}</p>
        )}
      </div>
    </div>
  );
};

export default FormInput;