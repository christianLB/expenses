import { useState, useMemo } from "react";
import {
  FileInput,
  Button,
  TextInput,
  Paper,
  Text,
  Loader,
  CopyButton,
  Group,
  Stack,
  Select,
} from "@mantine/core";
import BBVAMonthlyList from "./BBVAMonthlyList";
import BBVAIncomesList from "./BBVAIncomesList";
function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("72298830D");
  const [extractedText, setExtractedText] = useState<any>(null);
  const [documentType, setDocumentType] = useState<string | null>("RAW");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setExtractedText(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result?.toString().split(",")[1];

        try {
          const response = await fetch(`./api/parse?type=${documentType}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pdfData: base64Data,
              password: password,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
          }

          const data = await response.json();
          // For RAW type, data contains text field, for others it contains parsed data
          setExtractedText(documentType === "RAW" ? data.text : data);
        } catch (error: any) {
          let errorMessage = "Failed to parse PDF. Please try again.";

          if (error.message.includes("Password required")) {
            errorMessage =
              "This PDF is password protected. Please enter the password.";
          } else if (error.message.includes("Incorrect password")) {
            errorMessage = "Incorrect password. Please try again.";
          } else if (error.message.includes("corrupted")) {
            errorMessage =
              "Failed to parse PDF. The file might be corrupted or in an unsupported format.";
          }

          setError(errorMessage);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setError("Error processing file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPassword("");
    setExtractedText(null);
    setError(null);
  };

  return (
    <Stack gap={16}>
      <FileInput
        placeholder="Select PDF file"
        label="PDF File"
        accept="application/pdf"
        value={file}
        onChange={setFile}
        error={error}
      />

      <Group grow>
        <TextInput
          placeholder="Enter password if PDF is encrypted"
          label="Password (optional)"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          type="password"
        />
        <Select
          label="Document Type"
          placeholder="Select document type"
          value={documentType}
          onChange={setDocumentType}
          data={[
            { value: "RAW", label: "Raw Text (No Parser)" },
            { value: "bbva", label: "BBVA Document" },
            { value: "mercadonga", label: "Mercadonga Receipt" },
            { value: "bbva_monthly", label: "BBVA Monthly Report" }, // <-- Nuevo
          ]}
        />
      </Group>

      <Group justify="space-between">
        <Button onClick={handleUpload} disabled={!file || loading}>
          {loading ? <Loader size="sm" /> : "Extract Text"}
        </Button>
        {(extractedText || error) && (
          <Button variant="subtle" color="gray" onClick={handleClear}>
            Clear
          </Button>
        )}
      </Group>

      {extractedText && documentType === "bbva_monthly" ? (
        <>
          <BBVAMonthlyList data={extractedText} />
          <BBVAIncomesList data={extractedText} />
        </>
      ) : (
        extractedText && (
          <Paper withBorder p="md">
            <Group justify="space-between" mb="sm">
              <Text size="sm" fw={500}>
                Extracted Text
              </Text>
              <CopyButton value={extractedText}>
                {({ copied, copy }) => (
                  <Button
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    size="xs"
                  >
                    {copied ? "Copied!" : "Copy text"}
                  </Button>
                )}
              </CopyButton>
            </Group>
            <Text
              component="pre"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "400px",
                overflowY: "auto",
                padding: "8px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
              }}
            >
              {JSON.stringify(extractedText, null, 2)}
            </Text>
          </Paper>
        )
      )}
    </Stack>
  );
}

export default PDFUploader;
