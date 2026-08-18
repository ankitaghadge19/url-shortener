const InputForm = ({
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
      {/* Label */}
      <label htmlFor={id} className="font-semibold text-sm text-slate-700">
        {label}
      </label>

      {/* Input */}
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
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                }
              : undefined,
        })}
        className={`w-full px-3 py-2 border rounded-md outline-none text-slate-700
          focus:ring-2 focus:ring-blue-400
          ${errors[id] ? "border-red-500" : "border-slate-300"}`}
      />

      {/* Error message */}
      <div className="h-2">
        {errors[id] && (
          <p className="text-sm text-red-600">{errors[id].message}</p>
        )}
      </div>
    </div>
  );
};

export default InputForm;
