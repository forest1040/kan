import React, { useState } from "react";
import { Fab } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useRecoilState, useRecoilCallback } from "recoil";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import List from "./List";
import { listState, cardState } from "../state/model";
import { Lists, Cards } from "../state/model";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    dragDropRoot: {
      display: "flex",
    },
    container: {
      display: "flex",
    },
    addbuttonArea: {
      flex: "0 0 360px",
      marginTop: "32px",
    },
  });
});

interface Props {
  viewId: number;
}

const BoardContent: React.FC = () => {
  const [lists, setLists] = useRecoilState(listState);
  const [cards, setCards] = useRecoilState(cardState);

  // TODO: boardIdの採番
  const viewId = 1;
  // const viewIdNumber = () => {
  //   return viewId;
  // };

  const classes = useStyles();
  const handleAddButtonClicked = useRecoilCallback(
    ({ snapshot }) => async () => {
      const lists = await snapshot.getPromise(listState);
      onListAdded(viewId, lists);
    }
  );

  const onListAdded = (viewId: number, lists: Lists) => {
    const id = lists.length + 1;
    const index = lists.filter((list) => list.viewId === viewId).length;
    setLists((prevState) => [
      ...prevState,
      {
        id: id,
        viewId: viewId,
        index: index,
        title: "",
        tag: "",
      },
    ]);
  };

  const handleDragEnded = (result: DropResult) => {
    onDragEnded(viewId, result);
  };

  const onDragEnded = (viewId: number, dropResult: DropResult) => {
    const { destination, draggableId, source, type } = dropResult;

    if (destination === undefined || !destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    switch (type) {
      case "List": {
        const dragListId = parseInt(draggableId.replace("listId-", ""), 10);
        SwapLists(dragListId, source.index, destination.index);
        break;
      }
      case "Card": {
        const dragCardtId = parseInt(draggableId.replace("cardId-", ""), 10);
        const sourceId = parseInt(
          source.droppableId.replace("listId-", ""),
          10
        );
        const destinationId = parseInt(
          destination.droppableId.replace("listId-", ""),
          10
        );
        swapCards(
          dragCardtId,
          sourceId,
          source.index,
          destinationId,
          destination.index
        );
        break;
      }
      default:
        break;
    }
  };

  const SwapLists = (
    draglistId: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const lowerIndex = Math.min(sourceIndex, destinationIndex);
    const upperIndex = Math.max(sourceIndex, destinationIndex);
    const sourceList = lists
      .filter((list) => list.viewId === viewId)
      .sort((a, b) => a.index - b.index);
    const targetList = sourceList.slice(lowerIndex, upperIndex + 1);
    const lowerList = sourceList.slice(0, lowerIndex);
    const upperList = sourceList.slice(upperIndex + 1);
    const dragList = targetList.find((list) => list.id === draglistId);
    if (dragList) {
      if (dragList.index === lowerIndex) {
        targetList.splice(0, 1);
        targetList.splice(targetList.length, 0, dragList);
      } else {
        targetList.splice(targetList.length - 1, 1);
        targetList.splice(0, 0, dragList);
      }
      let index = lowerIndex - 1;
      const newLists = targetList.map((x) => {
        return { ...x, index: (index += 1) };
      });
      setLists([...lowerList, ...newLists, ...upperList]);
    }
  };

  const SwapCardsInTheSameList = (
    dragCardtId: number,
    sourceIndex: number,
    destinationId: number,
    destinationIndex: number
  ) => {
    const lowerIndex = Math.min(destinationIndex, sourceIndex);
    const upperIndex = Math.max(destinationIndex, sourceIndex);
    // 対象リストのカード
    const listCards = cards
      .filter((card) => card.listId === destinationId)
      .sort((a, b) => a.index - b.index);
    // index振り直しのカード
    const targetCards = listCards.slice(lowerIndex, upperIndex + 1);
    const lowerCards = listCards.slice(0, lowerIndex);
    const upperCards = listCards.slice(upperIndex + 1);
    const other = cards
      .filter((card) => card.listId !== destinationId)
      .sort((a, b) => a.index - b.index);
    const dragCard = targetCards.find((card) => card.id === dragCardtId);
    if (dragCard) {
      // 入れ替え作業
      if (dragCard.index === lowerIndex) {
        targetCards.splice(0, 1);
        targetCards.splice(targetCards.length, 0, dragCard);
      } else {
        targetCards.splice(targetCards.length - 1, 1);
        targetCards.splice(0, 0, dragCard);
      }
      // indexの振り直し
      let index = lowerIndex - 1;
      const newCards = targetCards.map((x) => {
        return { ...x, index: (index += 1) };
      });
      setCards([...lowerCards, ...newCards, ...upperCards, ...other]);
    }
  };

  const SwapCardsInDifferentList = (
    dragCardtId: number,
    sourceListId: number,
    sourceIndex: number,
    destinationListId: number,
    destinationIndex: number
  ) => {
    // 移動元リスト
    const sourceList = cards.filter((card) => card.listId === sourceListId);
    const sourceOther = sourceList.slice(0, sourceIndex);
    const sourceTargets = sourceList.slice(sourceIndex);
    // 移動先リスト
    const destList = cards.filter((card) => card.listId === destinationListId);
    const destOther = destList.slice(0, destinationIndex);
    const destTargets = destList.slice(destinationIndex);
    // 関係ないリスト
    const other = cards.filter(
      (card) =>
        card.listId !== sourceListId && card.listId !== destinationListId
    );
    const dragCard = cards.find((card) => card.id === dragCardtId);
    if (dragCard) {
      // 移動するカードを除く
      sourceTargets.splice(0, 1);
      // 移動するカードをつける
      destTargets.splice(0, 0, dragCard);
      // indexの振り直し
      let index = sourceIndex - 1;
      const newSourceCards = sourceTargets.map((x) => {
        return { ...x, index: (index += 1) };
      });
      // indexの振り直し
      index = destinationIndex - 1;
      const newDistCards = destTargets.map((x) => {
        return { ...x, index: (index += 1), listId: destinationListId };
      });
      setCards([
        ...sourceOther,
        ...newSourceCards,
        ...destOther,
        ...newDistCards,
        ...other,
      ]);
    }
  };

  const swapCards = (
    dragCardtId: number,
    sourceId: number,
    sourceIndex: number,
    destinationId: number,
    destinationIndex: number
  ) => {
    if (sourceId === destinationId) {
      SwapCardsInTheSameList(
        dragCardtId,
        sourceIndex,
        destinationId,
        destinationIndex
      );
    } else {
      SwapCardsInDifferentList(
        dragCardtId,
        sourceId,
        sourceIndex,
        destinationId,
        destinationIndex
      );
    }
  };

  const RenderLists = () => {
    const id = viewId;
    const result = lists
      .filter((list) => list.viewId === id)
      .sort((a, b) => a.index - b.index)
      .map((list, listIndex) => {
        console.log("list.id:" + list.id);
        console.log("listIndex:" + listIndex);
        if (!list.id) {
          return <></>;
        }
        return <List key={list.id} listId={list.id} listIndex={listIndex} />;
      });
    return result;
  };

  return (
    <div className={classes.dragDropRoot}>
      <DragDropContext onDragEnd={handleDragEnded}>
        <Droppable droppableId={`${viewId}`} direction="horizontal" type="List">
          {(provided) => (
            <div
              className={classes.container}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {RenderLists()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className={classes.addbuttonArea}>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="Add new list"
          onClick={handleAddButtonClicked}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default BoardContent;
