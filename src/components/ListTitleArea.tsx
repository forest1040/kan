import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import Typography from "@material-ui/core/Typography";
import { css } from "@emotion/react";
//import State from "../state";
import { useRecoilState } from "recoil";
import { listState } from "../state/model";

interface Props {
  listId: number;
}

const ListTitleArea: React.FC<Props> = (props) => {
  const { listId } = props;

  const [isInputArea, setIsInputArea] = useState(false);
  const [lists, setLists] = useRecoilState(listState);

  const list = lists.find((listData) => listData.id === listId);
  const ListTitle = list?.title || "";
  const [title, setTitle] = useState(ListTitle);

  const onListTitleChanged = () => {
    if (list) {
      setLists(
        lists.map((l) => (l.id === list.id ? { ...list, title: title } : l))
      );
    }
  };

  const handleisInputAreaChange = () => {
    onListTitleChanged();
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
    <div css={listTitleArea}>
      {isInputArea ? (
        <div css={listTitleForm}>
          <TextField
            css={listTitleTextField}
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
        <div css={listTitle} onClick={handleisInputAreaChange}>
          <Typography css={listTitleTypography} variant="h6" gutterBottom>
            {title || "The title is empty"}
          </Typography>
        </div>
      )}
      {isInputArea && (
        <div css={editIconArea}>
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

const listTitleArea = css`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;
const listTitleForm = css`
  flex-basis: 80%;
  margin-left: 8px;
`;
const listTitleTextField = css`
  width: 100%;
`;
const listTitle = css`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 72px;
  padding: 0 16px;
  cursor: pointer;
`;
const listTitleTypography = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const editIconArea = css`
  flex-basis: 20%;
  margin: 0 16px;
  text-align: center;
`;

export default ListTitleArea;
