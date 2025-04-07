"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function SearchTopic() {
  const [topic, setTopic] = useState<string>("");
  const [tableData, setTableData] = useState<
    { topic: string; book: string; section: string }[]
  >([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };
  const searchTopic = async () => {
    axios({
      method: "POST",
      url: `${process.env.API_URL}/get-topics`,
      data: {
        topic,
      },
    })
      .then((response) => setTableData(response.data))
      .catch((error) => console.log(error));
  };

  return (
    <Box className="w-full flex flex-col items-center justify-center">
      <Grid container spacing={2} alignItems={"center"}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems={"center"}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Topic"
                    value={topic}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={searchTopic}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Table className="topics-table">
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.topic}</TableCell>
                  <TableCell>{row.book}</TableCell>
                  <TableCell>{row.section}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Box>
  );
}
