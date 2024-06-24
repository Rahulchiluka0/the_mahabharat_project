"use client";

import InstaGrid from "@/components/InstaGrid/InstaGrid";
import { InstaItem } from "@/types/InstaFeed";
import { useEffect, useState } from "react";

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Home() {
  const [instaItems, setInstaItems] = useState<InstaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();

  const userId = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;
  const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

  const instaUrl = `https://graph.instagram.com/${userId}/media?access_token=${accessToken}`;

  useEffect(() => {
    const fetchMedia = async (id: string) => {
      const mediaUrl = `https://graph.instagram.com/${id}?access_token=${accessToken}&fields=media_url,permalink,caption`;

      const res = await fetch(mediaUrl);
      const json = await res.json();
      console.log("jsonone", json);
      const instaItem: InstaItem = {
        permalink: json.permalink,
        mediaUrl: json.media_url,
        caption: json.caption,
      };

      return instaItem;
    };

    const doFetch = async () => {
      if (!userId || !accessToken) {
        console.log("userId or accessToken is undefined: ", {
          userId,
          accessToken,
        });
        return;
      }

      try {
        const res = await fetch(instaUrl);
        const json = await res.json();
        console.log("Instagram Media Response:", json);

        const fetchedItems: InstaItem[] = [];

        for (let i = 0; i < json.data.length; i++) {
          const item = json.data[i];
          const itemId = item.id;

          const instaItem = await fetchMedia(itemId);
          fetchedItems.push(instaItem);
        }
        setInstaItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching Instagram media:", error);
      }
    };

    doFetch();
  }, [userId, accessToken, instaUrl]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredInstaItems = instaItems.filter((item) =>
    item.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              THE MAHABHARAT PROJECT
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </Search>
            <button
              onClick={logout}
              className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </Toolbar>
        </AppBar>
      </Box>
      <InstaGrid items={filteredInstaItems} />
    </>
  );
}
