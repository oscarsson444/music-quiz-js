import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSaveQuiz } from "../api/quiz";
import { useNavigate } from "react-router-dom";
import { QuestionItems } from "../types/quizTypes";

export const SaveQuizModal = ({
  isOpen,
  onClose,
  questions,
}: {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItems[];
}) => {
  const { saveQuiz } = useSaveQuiz();
  const [quizName, setQuizName] = useState<string>("");
  const navigate = useNavigate();

  const handleSave = async () => {
    const resp = await saveQuiz(questions, quizName);
    onClose();
    navigate("/singleplayer");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save quiz</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Input
            placeholder="Enter name of the quiz..."
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
          />
          <Button mt="10px" colorScheme="green" onClick={handleSave}>
            Save
          </Button>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
