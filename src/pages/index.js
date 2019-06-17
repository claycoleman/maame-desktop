import React from 'react';
import Container from 'react-bootstrap/Container';

export default function BasePage(pageTitle, pageBody) {
  return (
    <Container style={{ textAlign: 'center' }}>
      <h1 style={{ marginTop: 24, marginBottom: 24 }}>{pageTitle}</h1>
      {pageBody}
    </Container>
  );
}