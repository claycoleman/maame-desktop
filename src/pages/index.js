import React from 'react';
import Container from 'react-bootstrap/Container';
import { CONTAINER_WIDTHS } from '../constants/values';

export default function BasePage(pageTitle, pageBody, width = CONTAINER_WIDTHS.NORMAL) {
  document.title = "MAAME | " + pageTitle;
  return (
    <Container fluid={width === CONTAINER_WIDTHS.FLUID} style={{ textAlign: 'center', maxWidth: width === CONTAINER_WIDTHS.WIDE ? 1200 : 'inherit' }}>
      <h1 style={{ marginTop: 24, marginBottom: 24 }}>{pageTitle}</h1>
      {pageBody}
    </Container>
  );
}
