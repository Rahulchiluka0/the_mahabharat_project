"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import Link from "@mui/material/Link";
import RouterLink from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schema = zod.object({
  username: zod.string().min(1, { message: "Username is required" }),
  email: zod.string().min(1, { message: "Email is required" }).email(),
  password: zod
    .string()
    .min(6, { message: "Password should be at least 6 characters" }),
  terms: zod
    .boolean()
    .refine((value) => value, "You must accept the terms and conditions"),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  username: "",
  email: "",
  password: "",
  terms: false,
} satisfies Values;

export default function SignupPage() {
  const router = useRouter();
  // const [user, setUser] = React.useState({
  //   email: "",
  //   password: "",
  //   username: "",
  // });
  // const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSignup = async (data: Values) => {
    let progressInterval: NodeJS.Timeout | undefined; // Declare progressInterval here

    try {
      setLoading(true);
      setProgress(0);

      // Estimated total loading time in milliseconds
      const estimatedLoadingTime = 5000;

      // Update the progress value every 100 milliseconds
      const interval = 100;
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const nextProgress =
            prevProgress + 100 / (estimatedLoadingTime / interval);
          return nextProgress >= 100 ? 100 : nextProgress;
        });
      }, interval);

      const response = await axios.post("/api/users/signup", data);
      console.log("Signup success", response.data);
      toast.success("Successfully Signed up");
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        router.push("/login");
      }, 500); // Slight delay to show 100% progress
    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast.error(error.response.data.error);
      clearInterval(progressInterval);
      setLoading(false);
      setProgress(0); // Reset progress on error
    }
  };
  useEffect(() => {
    if (!loading) {
      setProgress(0); // Reset progress when loading stops
    }
  }, [loading]);
  // useEffect(() => {
  //   if (
  //     user.email.length > 0 &&
  //     user.password.length > 0 &&
  //     user.username.length > 0
  //   ) {
  //     setButtonDisabled(false);
  //   } else {
  //     setButtonDisabled(true);
  //   }
  // }, [user]);

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen py-2">
    //   <h1>{loading ? "Processing" : "Signup"}</h1>
    <Stack
      spacing={3}
      sx={{ maxWidth: "400px", margin: "auto", padding: "20px" }}
    >
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{" "}
          <Link
            component={RouterLink}
            href="/login"
            underline="hover"
            variant="subtitle2"
          >
            Sign in
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSignup)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <FormControl error={Boolean(errors.username)}>
                <InputLabel>Username</InputLabel>
                <OutlinedInput {...field} label="Username" />
                {errors.username ? (
                  <FormHelperText>{errors.username.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      I have read the <Link>terms and conditions</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? (
                  <FormHelperText error>{errors.terms.message}</FormHelperText>
                ) : null}
              </div>
            )}
          />
          {errors.root ? (
            <Alert color="error">{errors.root.message}</Alert>
          ) : null}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {loading ? (
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  size={50}
                  variant="determinate"
                  value={progress}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                  >
                    {`${Math.round(progress)}%`}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Button
                fullWidth
                disabled={loading}
                type="submit"
                variant="contained"
              >
                Sign up
              </Button>
            )}
          </Box>
        </Stack>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
      <hr />
      {/* <label htmlFor="username">username</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="username"
      />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />
      <button
        onClick={onSignup}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        {buttonDisabled ? "No signup" : "Signup"}
      </button>
      <Link href="/login">Visit login page</Link> */}
      {/* </div> */}
    </Stack>
  );
}
