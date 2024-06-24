"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import RouterLink from "next/link";
import Link from "@mui/material/Link";

const schema = zod.object({
  email: zod.string().min(1, { message: "Email is required" }).email(),
  password: zod
    .string()
    .min(6, { message: "Password should be at least 6 characters" }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  email: "",
  password: "",
} satisfies Values;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onLogin = async (data: Values) => {
    try {
      setLoading(true);
      setProgress(0);

      console.log("Form data:", data);

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

      const response = await axios.post("/api/users/login", data);
      console.log("Login success", response.data);
      toast.success("Login success");
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        router.push("/");
      }, 500);
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error(error.message);
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

  return (
    <Stack
      spacing={3}
      sx={{ maxWidth: "400px", margin: "auto", padding: "20px" }}
    >
      <Stack spacing={1}>
        <Typography variant="h4">Log in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{" "}
          <Link
            component={RouterLink}
            href="/signup"
            underline="hover"
            variant="subtitle2"
          >
            Sign up
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onLogin)}>
        <Stack spacing={2}>
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
                Log in
              </Button>
            )}
          </Box>
        </Stack>
      </form>
    </Stack>
  );
}
