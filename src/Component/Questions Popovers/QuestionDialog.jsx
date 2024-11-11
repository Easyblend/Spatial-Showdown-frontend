import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

function decodeHtmlEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

export default function QuestionDialog({
  open,
  conqueredCountries,
  setConqueredCountries,
  questions, setOpen, opponent,
  countries,
  client,
  setOwnedCountries,
  OwnedCountries,
}) {
  const [randomQuestion, setRandomQuestion] = React.useState(null);
  const [shuffledAnswers, setShuffledAnswers] = React.useState([]);

  useEffect(() => {
    if (questions.length > 0) {
      const question = questions[Math.floor(Math.random() * questions.length)];
      setRandomQuestion(question);
    }
  }, [questions, open]); // Update when questions or open changes

  useEffect(() => {
    if (randomQuestion) {
      const allAnswers = [...randomQuestion.incorrect_answers, randomQuestion.correct_answer];
      setShuffledAnswers(shuffleArray(allAnswers));
    }
  }, [randomQuestion]);

  const handleClose = (answer) => {
    if (answer === randomQuestion?.correct_answer) {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      if (client && client.connected) {
        const messageToSend = {
          countryName: randomCountry?.name,
          username: opponent,
          flag: randomCountry?.flags,
          area: randomCountry?.area,
        };
        client.send('/app/countries', {}, JSON.stringify(messageToSend));
        setOwnedCountries([...OwnedCountries, randomCountry]);
      } else {
        toast.info('You are not connected to the server');
      }
      toast.success('Correct answer! Defence successful 🛡️');
    } else {
      toast.error('Wrong answer! Defend failed💥. Lost a City');
      // Handle removing the last country
      if (OwnedCountries.length > 0) {
        const lastCountry = OwnedCountries[OwnedCountries.length - 1]; // Get the last country
        const updatedCountries = OwnedCountries.slice(0, OwnedCountries.length - 1);
        setOwnedCountries(updatedCountries);

        if (client && client.connected) {
          const messageToSend = {
            countryName: lastCountry?.name,
            username: opponent,
            flag: lastCountry?.flags,
            area: lastCountry?.area,
            action: 'remove',
          };
          client.send('/app/countries/remove', {}, JSON.stringify(messageToSend)); // Send the correct message
        }
      }
    }
    setOpen(false);
  };

  if (!randomQuestion) {
    return null; // No question to display
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle color="error" fontWeight={700}>INCOMING ENEMY ATTACK !! ⚔️</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {decodeHtmlEntities(randomQuestion.question)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {shuffledAnswers.map((answer) => {
          const isCorrect = answer === randomQuestion.correct_answer;

          const buttonStyle = {
            backgroundColor: isCorrect
            && 'rgba(0, 255, 0, 0.2)', // Green background for correct answer
          };

          return (
            <Button
              key={answer}
              onClick={() => handleClose(decodeHtmlEntities(answer))}
              style={buttonStyle}
            >
              {decodeHtmlEntities(answer)}
            </Button>
          );
        })}
      </DialogActions>
    </Dialog>
  );
}
