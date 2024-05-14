import React, { useState } from "react";
import { Box, Typography, Button, TextField, Tooltip } from "@mui/material";
import Scan from "../assets/Scan.gif";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GetAppIcon from "@mui/icons-material/GetApp";
import axios from "axios";

function UrlUploader() {
  const [imageUrl, setImageUrl] = useState("");
  const [detectedText, setDetectedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showDownloadTooltip, setShowDownloadTooltip] = useState(false);

  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(detectedText);
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000); 
  };

  const downloadText = () => {
    if (!detectedText) return;

    const element = document.createElement("a");
    const file = new Blob([detectedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "detected_text.txt";
    document.body.appendChild(element);
    element.click();
    setShowDownloadTooltip(true);
    setTimeout(() => setShowDownloadTooltip(false), 2000); // Hide download tooltip after 2 seconds
  };

  const detectText = async () => {
    if (!imageUrl) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://api.ocr.space/parse/imageurl?apikey=K87292502288957&url=${encodeURIComponent(imageUrl)}&language=eng&OCREngine=2`
      );

      if (
        response.data &&
        response.data.ParsedResults &&
        response.data.ParsedResults.length > 0
      ) {
        const text = response.data.ParsedResults[0].ParsedText;
        setDetectedText(text);
      } else {
        setError("No text detected in the image");
      }
    } catch (error) {
      console.error("Error detecting text:", error);
      setError("Error detecting text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} width="100vw">
      <Box
        display="flex"
        justifyContent="center"
        sx={{ width: "100%", marginTop: "3rem" }}
      >
        <Box sx={{ width: "70%" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "700" }}
            textAlign="center"
          >
            Explore Handwriting Recognition: Scan, Convert, Copy &{" "}
            <span style={{ color: "#5CABF3" }}>Download Text!</span>
          </Typography>
        </Box>
      </Box>
      <Box
        maxHeight="400px"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="flex"
          gap={1}
          width="70%"
          sx={{ maxHeight: "100%", flexDirection: "column" }}
        >
          <Box
            sx={{
              width: "100%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={Scan}
              alt="Load Fail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box
            sx={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <TextField
              id="image-url"
              label="Paste Image URL"
              variant="outlined"
              value={imageUrl}
              onChange={handleUrlChange}
              sx={{ width: "100%", marginBottom: "1rem" }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<DocumentScannerIcon />}
              onClick={detectText}
              disabled={loading}
            >
              Detect Text
            </Button>
          </Box>
        </Box>
      </Box>

      {detectedText && (
        <Box
          sx={{
            mt: 4,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            width="75%"
            sx={{
              p: 3,
              backgroundColor: "#ddd",
              position: "relative",
              borderRadius: 2,
              marginBottom: "3rem",
            }}
          >
            <Typography variant="h6">{detectedText}</Typography>
            <Box
              display="flex"
              gap={2}
              sx={{
                position: "absolute",
                top: "-65px",
                right: "-24px",
                backgroundColor: "#ddd",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Tooltip title="Copied" open={showCopyTooltip}>
                <ContentCopyIcon
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#eee",
                    },
                  }}
                  onClick={copyToClipboard}
                />
              </Tooltip>
              <Tooltip title="Download" open={showDownloadTooltip}>
                <GetAppIcon
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#eee",
                    },
                  }}
                  onClick={downloadText}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default UrlUploader;
