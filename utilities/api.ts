import axios from "axios";
import { TopicData } from "./interfaces";

const getBaseUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:8000"
  );
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchTopicsApi = async (topic: string): Promise<TopicData[]> => {
  const response = await apiClient.post<TopicData[]>("/get-topics", {
    topic: topic.trim(),
  });
  return response.data;
};

export const addTopicApi = async (data: TopicData): Promise<{ status: number; message: string }> => {
  const response = await apiClient.post("/add-topic", {
    topic: data.topic.trim(),
    book: data.book,
    section: data.section,
  });
  return { status: response.status, message: "Topic added successfully" };
};

export const getApiBaseUrl = getBaseUrl;
