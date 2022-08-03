import styled from 'styled-components';

const StyledApp = styled.div`
  & h1 {
    font-size: 28px;
    color: green;
  }
`;

export function App() {
  return (
    <StyledApp>
      <h1>Hello World React App!</h1>
    </StyledApp>
  );
}

export default App;
