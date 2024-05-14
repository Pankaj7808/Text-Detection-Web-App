import React, { useState } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import Scan from "../assets/Scan.gif";
import Upload from "../assets/upload.png";
import DeleteIcon from "@mui/icons-material/Delete";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GetAppIcon from "@mui/icons-material/GetApp";
import axios from "axios";

function ImageUploader(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedText, setDetectedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showDownloadTooltip, setShowDownloadTooltip] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setDetectedText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(detectedText);
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000); // Hide copy tooltip after 2 seconds
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
    if (!selectedImage) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("apikey", "YOUR_API_KEY");

    formData.append("language", "eng");
    formData.append("OCREngine", "2");

    try {
      const response = await axios.post(
        "https://api.ocr.space/parse/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
    <Box display="flex" flexDirection="column" gap={3} width="100vw" marginTop="1rem">
      <Box display="flex" justifyContent="Center" sx={{ width: "100%", height:"content-fit" }}>
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
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="center"
        alignItems="center"
        marginTop="4rem"
      >
        <Box
          display="flex"
          gap={4}
          width="70%"
          sx={{ maxHeight: "100%", flexDirection: { xs: "column", sm: "row" } }}
        >
          <Box
            sx={{ width: "100%", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <img
              src={Scan}
              alt="Load Fail"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
            }}
          >
            <Box
              sx={{
                p: "10px",
                border: "4px dashed #333",
                width: "80%",
                textAlign: "center",
                marginBottom:"2.5rem"
              }}
            >
              <label htmlFor="upload-input">
                <img
                  src={Upload}
                  alt="Upload Here"
                  style={{ width: "95%", marginBottom: "10px" }}
                />
              </label>
              <input
                type="file"
                id="upload-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Typography variant="h5">Upload Image Here</Typography>
              <Typography variant="body2">
                (Please Make sure image is under 1MB.)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {selectedImage && (
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
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded"
            style={{
              maxWidth: "70%",
              maxHeight: "100%",
              border: "4px solid #5CABF3",
              padding: "1rem",
            }}
          />
          <Box display="flex" gap={3}>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteImage}
              sx={{ mt: 3, mb: 3 }}
            >
              Delete Image
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<DocumentScannerIcon />}
              onClick={detectText}
              sx={{ mt: 3, mb: 3 }}
              disabled={loading}
            >
              Detect Text
            </Button>
          </Box>
          <Box
            width="75%"
            sx={{
              p: 3,
              backgroundColor: "#ddd",
              position: "relative",
              borderRadius: 2,
              marginTop:"3rem",
              marginBottom: "3rem",
            }}
          >
            {detectedText ? (
              <Box sx={{ position: "relative" }}>
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
            ) : loading ? (
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Scanning...
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                {error ? "Facing Error" : "Detected text will display here."}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ImageUploader;
