import styled from 'styled-components'

const Row = styled.div`
    display:flex;
    flex-direction:row;
`;

const Col = styled.div`
    display:flex;
    flex-direction:column;
`;

const Separator = styled.div`
    width=${(width) => width ? width : 0}px;
    height=${(height) => height ? height : 0}px;
`;

const CenterHV = styled(Row)`
    justify-content:center;
    align-items:center;
`;

export { Row, Col, Separator, CenterHV }