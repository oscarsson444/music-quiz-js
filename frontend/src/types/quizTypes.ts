export type CreateSongSelectorCard = {
  title: string;
  url: string;
  thumbnail: string;
};

export interface QuestionItems {
  question: string;
  answer: string;
  image: string;
  song: string;
}

export interface Quiz {
  _id: string;
  title: string;
  image: string;
  owner: string;
  rating?: number;
}
