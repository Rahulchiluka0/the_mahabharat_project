"use client";
import Skeleton from "@mui/material/Skeleton";
import { InstaItem } from "@/types/InstaFeed";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Backdrop, Box, CardActionArea, Fade, Modal } from "@mui/material";
import Image from "next/image";

interface InstaGridProps {
  items: InstaItem[];
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "16px",
  padding: "16px",
  justifyContent: "center",
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  maxWidth: "345px",
  margin: "auto",
};

const mediaStyle: React.CSSProperties = {
  height: "250px",
  objectFit: "cover",
};

const InstaGrid = ({ items }: InstaGridProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<InstaItem | null>(
    null
  );

  const handleOpen = (item: InstaItem) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  if (items.length === 0) {
    return (
      <div style={gridStyle}>
        {new Array(16).fill(null).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={345}
            height={300}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {items.map((item) => {
        const captionLines = item.caption.split("\n");
        const firstThreeLines = item.caption.split("\n").slice(1, 3).join("\n");

        return (
          <Card style={cardStyle} key={item.caption}>
            <CardActionArea onClick={() => handleOpen(item)}>
              <CardMedia
                component="img"
                alt="Instagram item"
                style={mediaStyle}
                image={item.mediaUrl}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {captionLines[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {firstThreeLines}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small" onClick={() => handleOpen(item)}>
                Learn More
              </Button>
            </CardActions>
          </Card>
        );
      })}
      {selectedItem && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: "20px",
                alignItems: "center",
                justifyContent: "space-between",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                // p: 4,
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <Box
                component="img"
                src={selectedItem.mediaUrl}
                alt="Instagram item"
                sx={{
                  width: { xs: "100%", lg: "40%" },
                  height: "auto",
                }} // Responsive width
              />
              <Box sx={{
                paddingLeft: {xs: "18px"},
                paddingRight: {xs: "18px"}
                }}>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  {selectedItem.caption.split("\n")[0]}
                </Typography>
                <Typography
                  id="transition-modal-description"
                  sx={{ mt: 2, whiteSpace: "pre-wrap" }}
                >
                  {selectedItem.caption.split("\n").slice(1).join("\n")}
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
    </div>
  );
};

export default InstaGrid;
