import React from 'react';
import Container from 'react-bootstrap/Container';
import { CONTAINER_WIDTHS } from '../constants/values';

export default function BasePage(
  pageTitle,
  pageBody,
  { width = CONTAINER_WIDTHS.NORMAL, backButton = null } = {},
) {
  document.title = 'MAAME | ' + pageTitle;
  return (
    <Container
      fluid={width === CONTAINER_WIDTHS.FLUID}
      style={{ textAlign: 'center', maxWidth: width !== CONTAINER_WIDTHS.WIDE ? 1200 : 'inherit' }}
    >
      {backButton}
      <h1 style={{ marginTop: 24, marginBottom: 24 }}>
        {pageTitle.split('\n').map((part, key) => (
          <p style={{ marginBottom: 0 }} key={key}>{part}</p>
        ))}
      </h1>
      {pageBody}
    </Container>
  );
}
