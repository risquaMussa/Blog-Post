import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Adjust if the path is different

const SignIn = () => {
  const navigate = useNavigate();
  const { signInUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await signInUser(data.email, data.password);
    if (result.success) {
      navigate("/"); // ✅ Redirect to home
    } else {
      alert("Login failed: " + result.error); // ✅ Show error message
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side */}
      <div className="hidden md:flex w-full md:w-1/2 bg-blue-600 items-center justify-center">
        <div className="text-white text-center">
          <div className="rounded-full w-20 h-20 bg-blue-400 mb-6"></div>
          <h1 className="text-3xl font-bold">Welcome</h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-sky-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don’t have an account yet?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 mt-2"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
