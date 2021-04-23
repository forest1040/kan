import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { grey } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import { css } from "@emotion/react";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ListTitleArea from "./ListTitleArea";
import Card from "./Card";
//import State from "../state";
import { useRecoilState, useRecoilValue } from "recoil";
import { listState, cardState, CardTable } from "../state/model";

interface Props {
  listId: number;
  listIndex: number;
}

const List: React.FC<Props> = (props) => {
  const isInitialMount = useRef(true);
  const history = useHistory();
  const { listId, listIndex } = props;
  const [lists, setLists] = useRecoilState(listState);
  const [cards, setCards] = useRecoilState(cardState);
  const [isDragDisabled, setIsDragDisabled] = useState(false);

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   }
  // }, [cards]);

  const OnCardAdded = (listId: number) => {
    const id = cards.length + 1;
    const index = cards.filter((card) => card.listId === listId).length;
    setCards((prevState) => [
      ...prevState,
      {
        id,
        listId,
        index: index,
        text: "",
      },
    ]);
  };

  const OnListDeleted = (listId: number) => {
    const cardPromiseArray: Promise<void>[] = [];
    const newCards = cards.filter((card) => card.listId !== listId);
    setCards(newCards);
    const newLists = lists.filter((list) => list.id !== listId);
    setLists(newLists);
  };

  const onAddButtonClicked = () => {
    OnCardAdded(listId);
  };

  const onEditButtonClicked = () => {
    history.push("/edit");
  };

  const onDeleteButtonClicked = () => {
    OnListDeleted(listId);
  };

  const RenderCards = () => {
    const result = cards
      .filter((card) => card.listId === listId)
      .sort((a, b) => a.index - b.index)
      .map((card, cardIndex) => {
        if (!card.id) {
          return <></>;
        }
        return (
          <Card
            key={card.id}
            cardId={card.id}
            cardIndex={cardIndex}
            onClicked={setIsDragDisabled}
          />
        );
      });
    return result;
  };

  return (
    <Draggable
      draggableId={`listId-${listId}`}
      index={listIndex}
      isDragDisabled={isDragDisabled}
    >
      {(provided) => (
        <Paper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
          css={paper}
        >
          <ListTitleArea listId={listId} />
          <Droppable droppableId={`listId-${listId}`} type="Card">
            {(cardProvided) => (
              <div
                css={container}
                {...cardProvided.droppableProps}
                ref={cardProvided.innerRef}
              >
                {RenderCards()}
                {cardProvided.placeholder}
              </div>
            )}
          </Droppable>
          <div css={buttonArea}>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="Add new card"
              onClick={onAddButtonClicked}
            >
              <AddIcon />
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="Edit List"
              onClick={onEditButtonClicked}
            >
              <EditIcon />
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="Delete this list"
              onClick={onDeleteButtonClicked}
            >
              <DeleteIcon />
            </Fab>
          </div>
        </Paper>
      )}
    </Draggable>
  );
};

const paper = css`
  backgroundcolor: #fff;
  flex: 0 0 400px;
  width: 400px;
  height: fit-content;
  margin: 16px;
`;
const container = css`
  paddingbottom: 5px;
`;
const buttonArea = css`
  display: flex;
  justify-content: space-around;
  margin-top: 4px;
  margin-bottom: 10px;
`;

export default List;
