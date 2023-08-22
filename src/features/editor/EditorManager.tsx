import React from 'react';

type EditorManagerProps = {
  children?: React.ReactNode
};

export function EditorManager(props: EditorManagerProps) {
  return (
    <div>{ props.children }</div>
  );
}
