export const MODAL_TIMEOUT_LENGTH = 350;

export const FlowBodyItemType = {
  HTML: 'html',
  // example:
  // body: ""

  NUMBER: 'number',
  // example:
  // name: ""
  // unit: ""
  
  TEXT: 'text',
  // example:
  // name: ""
  // unit: ""

  BOOL: 'bool',
  // example:
  // name: ""
  
  DERIVED: 'derived',
  // example:
  // dependencies: {
  //   formula: 'Weight / (Height ^ 2)',
  //   fields: ['Weight', 'Height'],
  // },

  DROPDOWN: 'dropdown',
  // choices: [
  //   "Name of Choice 1",
  //   "Name of Choice 2",
  //   "Name of Choice 3",
  // ],

  DATE: 'date',
  // example:
  // startDate: 'November 8, 1986'
  // minDate: 'November 8, 1918'
  // maxDate: 'November 8, 2018'
};