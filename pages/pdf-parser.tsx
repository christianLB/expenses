import { Container, Title, Paper } from "@mantine/core";
import PDFUploader from "../components/PDFUploader";

export default function PDFParser() {
  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">
        PDF Text Extractor
      </Title>
      <Paper shadow="xs" p="md">
        <PDFUploader />
      </Paper>
    </Container>
  );
}
