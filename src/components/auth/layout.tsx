import * as React from "react";
// import RouterLink from 'next/link';
import Box from "@mui/material/Box";
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

// import { paths } from '@/paths';
// import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // Set minHeight to 100vh for full viewport height
      }}
    >
      <Box sx={{ maxWidth: "450px", width: "100%" }}>{children}</Box>
    </Box>
  );
}
