import styled, { css } from "styled-components";

Tab.defaultProps = {
  currTab: "Track",
  onClick: () => {},
};

// ini yang ditambahin

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e2e4;
  width: 100%;
  margin-bottom: 16px;
`;


const EactTab = styled.p`
  font-size: 14px;
  line-height: 22px;
  color: #151618;
  padding: 8px;

  + p {
    margin-left: 16px;
  }

  ${(props) =>
    props.active &&
    css`
      color: #524fa1;
      font-weight: bold;
      background: rgba(230, 230, 230, 0.0001);
      box-shadow: inset 0px -4px 0px #524fa1;
    `}
`;

const tabs = ["Rere", "Ghalda"];

export default function Tab({ currTab, onClick }) {
    // ini yang ditambahin
  return  (
      <Container>
      {tabs.map((tab, i) => {
        return (
          <EactTab
            key={`${tab}-${i}`}
            active={currTab === tab}
            onClick={() => onClick(tab)}
          >
            {tab}
          </EactTab>
        );
      })}
    </Container>
  );  
}