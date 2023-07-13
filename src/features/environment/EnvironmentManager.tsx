import React from 'react'; // useRef

type EnvironmentManagerProps = {
  children?: React.ReactNode

};

export function EnvironmentManager(props: EnvironmentManagerProps) {
  const {
    children,
  } = props;

  return (
    <>
      { children }
    </>
  );
}
