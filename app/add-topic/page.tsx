"use client";
import { BOOKS, SECTIONS } from "@/utilities/constants";
import { TopicData } from "@/utilities/interfaces";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [topicData, setTopicData] = useState<TopicData>({
    topic: "",
    book: "",
    section: "",
  });
  const [message, setMessage] = useState<{
    text: string;
    status: "success" | "error";
  }>({
    text: "",
    status: "error",
  });

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    setTopicData({ ...topicData, [event.target.name]: event.target.value });
  };

  const addTopic = async () => {
    const { topic, book, section } = topicData;
    if (topic && book && section) {
      setMessage({ text: "", status: "error" });
      await axios({
        method: "POST",
        url: `${process.env.API_URL}/add-topic`,
        data: {
          ...topicData,
        },
      })
        .then((response) => {
          if (response.status === 201) {
            setMessage({ text: "Topic added successfully", status: "success" });
            setTopicData({ topic: "", book: "", section: "" });
          }
        })
        .catch((error) => console.log(error));
    } else {
      setMessage({ text: "Please fill all fields", status: "error" });
    }
  };
  return (
    <Box className="w-full h-screen flex items-center justify-center">
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Topic"
                name="topic"
                fullWidth
                value={topicData.topic}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Book</InputLabel>
                <Select
                  value={topicData.book}
                  label="Book"
                  name="book"
                  onChange={handleChange}
                >
                  {BOOKS.map((book, index) => (
                    <MenuItem key={book.value + index} value={book.value}>
                      {book.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Section</InputLabel>
                <Select
                  value={topicData.section}
                  label="Section"
                  name="section"
                  onChange={handleChange}
                >
                  {SECTIONS.map((section, index) => (
                    <MenuItem key={section.value + index} value={section.value}>
                      {section.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Typography className={message.status}>{message.text}</Typography>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={addTopic}
              >
                Add Topic
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
