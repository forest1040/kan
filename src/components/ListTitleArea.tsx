import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core/styles";
//import State from "../state";
import { useRecoilState } from "recoil";
import { listState } from "../state/model";

interface Props {
  boardId: number;
  listId: number;
}

const useStyles = makeStyles(() => {
  return createStyles({
    listTitleArea: {
      display: "flex",
      alignItems: "center",
      marginTop: "8px",
    },
    listTitleForm: {
      flexBasis: "80%",
      marginLeft: "8px",
    },
    listTitleTextField: {
      width: "100%",
    },
    listTitle: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: "72px",
      padding: "0 16px",
      cursor: "pointer",
    },
    listTitleTypography: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    editIconArea: {
      flexBasis: "20%",
      margin: "0 16px",
      textAlign: "center",
    },
  });
});

const ListTitleArea: React.FC<Props> = (props) => {
  const { boardId, listId } = props;
  const classes = useStyles();

  const [isInputArea, setIsInputArea] = useState(false);
  const [lists, setLists] = useRecoilState(listState);

  const list = lists.find((listData) => listData.id === listId);
  const ListTitle = list?.title || "";
  const [title, setTitle] = useState(ListTitle);

  const onListTitleChanged = (boardId: number, listId: number) => {
    if (list) {
      setLists(
        lists.map((l) => (l.id === list.id ? { ...list, title: title } : l))
      );
    }
  };

  const handleisInputAreaChange = () => {
    onListTitleChanged(boardId, listId);
    setIsInputArea(!isInputArea);
  };

  const handleListTitleChanged = (
    event: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setTitle(event.target.value);
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleisInputAreaChange();
    }
  };

  return (
    <div className={classes.listTitleArea}>
      {isInputArea ? (
        <div className={classes.listTitleForm}>
          <TextField
            className={classes.listTitleTextField}
            id="list-name"
            label="List Title"
            value={title}
            margin="normal"
            autoFocus
            onChange={handleListTitleChanged}
            onKeyPress={handleKeyPressed}
            onBlur={handleisInputAreaChange}
          />
        </div>
      ) : (
        <div className={classes.listTitle} onClick={handleisInputAreaChange}>
          <Typography
            className={classes.listTitleTypography}
            variant="h6"
            gutterBottom
          >
            {title || "The title is empty"}
          </Typography>
        </div>
      )}
      {isInputArea && (
        <div className={classes.editIconArea}>
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="DONE"
            onClick={handleisInputAreaChange}
          >
            <CheckIcon />
          </Fab>
        </div>
      )}
    </div>
  );
};

export default ListTitleArea;
