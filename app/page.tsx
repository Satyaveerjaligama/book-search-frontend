import { Box, Card, CardContent } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box className="w-full h-screen flex items-center justify-center">
      <Card>
        <CardContent>
          <Link href={"/add-topic"} className="underline text-sky-700">
            Add Topic
          </Link>
          <br></br>
          <Link href={"/search-topic"} className="underline text-sky-700">
            Search Topic
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}
