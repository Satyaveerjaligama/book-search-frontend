export interface TopicData {
  topic: string;
  book: string;
  section: string;
}

export interface AddTopicPayload extends TopicData {
  adminKey?: string;
}
