import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";

export type EditorProps = {
  fileType: string;
  contents: string;
  readOnly: boolean;
  onChange?: (content: string) => void;
  theme?: string;
};

const MIN_LINE = 10;
const MAX_LINE = 50;

const DEFAULT_THEME = "monokai";

const text = "";

const TextEditContent = (props: EditorProps) => {
  const theme = props.theme || DEFAULT_THEME;

  // load theme
  React.useMemo(() => {
    try {
      require(`ace-builds/src-noconflict/theme-${theme}`);
    } catch (e) {
      console.log(`error new theme(${theme}): ${e}`);
    }
  }, [props.theme]);

  // load mode
  React.useMemo(() => {
    if (props.fileType == null) {
      return;
    }
    try {
      require(`ace-builds/src-noconflict/mode-${props.fileType}`);
    } catch (e) {
      console.log(`error new mode(${props.fileType}): ${e}`);
    }
  }, [props.fileType]);

  const onChange: (str: string) => void = props.onChange
    ? props.onChange
    : () => {};

  if (props.readOnly) {
    return (
      <AceEditor
        mode={props.fileType}
        theme={theme}
        value={props.contents}
        //width={undefined} // nullにしておくとwidthを外から変えられる
        width="100%"
        height="600px"
        minLines={MIN_LINE}
        maxLines={MAX_LINE}
        readOnly={true}
        focus={false}
        highlightActiveLine={false}
        enableBasicAutocompletion={false}
        onLoad={(editor) => {
          // readOnlyでも表示されるカーソルを消す
          //editor.renderer.$cursorLayer.element.style.opacity = 0;
        }}
      />
    );
  } else {
    return (
      <AceEditor
        mode={props.fileType}
        theme={theme}
        value={props.contents}
        //width={undefined}
        width="100%"
        height="600px"
        minLines={MIN_LINE}
        maxLines={MAX_LINE}
        readOnly={props.readOnly}
        enableBasicAutocompletion={true}
        onChange={onChange}
      />
    );
  }
};

export default TextEditContent;
