import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
// import parse2Markdown from "remark-parse";
// import remark2rehype from "remark-rehype";
// import highlight from "rehype-highlight";
// import rehype2react from "rehype-react";
import { TextField } from "@material-ui/core";
import MaterialCard from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { grey } from "@material-ui/core/colors";
import Fab from "@material-ui/core/Fab";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
//import "highlight.js/styles/default.css";
import { useRecoilState } from "recoil";

//import State from "../state";
import { cardState } from "../state/model";

interface Props {
  cardId: number;
  cardIndex: number;
  onClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

// const processor = unified()
//   .use(parse2Markdown)
//   .use(remark2rehype)
//   .use(highlight)
//   .use(rehype2react, { createElement: React.createElement });

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      //zIndex: theme.zIndex.drawer + 1,
    },
    card: {
      backgroundColor: "#fff",
      padding: "0px",
      margin: "8px 16px",
    },
    cardContent: {
      width: "100%",
      minHeight: "72px",
      whiteSpace: "pre-line",
    },
    toolbar: {
      marginBottom: "16px",
      ...theme.mixins.toolbar,
    },
    styledButtonArea: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "16px",
      marginBottom: "16px",
    },
  });
});

const Card: React.FC<Props> = (props) => {
  const { cardId, cardIndex } = props;
  const classes = useStyles();
  const [isInputArea, setIsInputArea] = useState(false);
  const [cards, setCards] = useRecoilState(cardState);
  const card = cards.find((cardData) => cardData.id === cardId);
  const cardText = card?.text || "";
  const [text, setValue] = useState(cardText);
  const editorColor = "vs";

  useEffect(() => {
    const { onClicked } = props;
    onClicked(isInputArea);
  }, [isInputArea]);

  const onCardDeleted = (cardId: number) => {
    const newCards = cards.filter((card) => card.id !== cardId);
    setCards(newCards);
  };

  const onCardTextChanged = (cardId: number, text: string) => {
    if (card) {
      setCards(
        cards.map((c) => (c.id === cardId ? { ...card, text: text } : c))
      );
    }
  };

  const handleIsInputAreaChange = () => {
    if (isInputArea) {
      onCardTextChanged(cardId, text);
    }
    setIsInputArea(!isInputArea);
  };

  const handleValueChanged = (value: string) => {
    setValue(value);
  };

  const handleDeleteButtonClicked = () => {
    onCardDeleted(cardId);
  };

  return (
    <>
      {isInputArea ? (
        <>
          <TextField
            id="standard-basic"
            label="Standard"
            value={text}
            onChange={(event) => handleValueChanged(event.target.value)}
            multiline
            rows={3}
          />
          <div className={classes.styledButtonArea}>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="DONE"
              onClick={handleIsInputAreaChange}
            >
              <CheckIcon />
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="Delete this card"
              onClick={handleDeleteButtonClicked}
            >
              <DeleteIcon />
            </Fab>
          </div>
        </>
      ) : (
        <Draggable draggableId={`cardId-${cardId}`} index={cardIndex}>
          {(provided) => (
            <MaterialCard
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className={classes.card}
            >
              <CardContent>
                <div
                  className={classes.cardContent}
                  onClick={handleIsInputAreaChange}
                >
                  {/* {processor.processSync(text).contents} */}
                  {/* text */}
                  {text}
                </div>
              </CardContent>
            </MaterialCard>
          )}
        </Draggable>
      )}
    </>
  );
};

export default Card;
