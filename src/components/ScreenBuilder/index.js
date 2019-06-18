import React, { Component } from 'react';
import { FlowBodyItemType } from '../../constants/values';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import CustomEditor from '../CustomEditor';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './carousel.css';
import { Carousel } from 'react-responsive-carousel';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Modal from 'react-awesome-modal';

const LOCAL_STORAGE_KEY = 'mame-flow-builder-local-storage-key';

function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

function defaultNewPage() {
  return {
    id: guidGenerator(),
    title: 'New Page',
    components: [
      {
        id: guidGenerator(),
        type: FlowBodyItemType.HTML,
        body: `<p>New page created.</p>`,
      },
    ],
  };
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => {
  if (isDragging) {
    return {
      backgroundColor: 'lightgreen',
      // styles we need to apply on draggables
      ...draggableStyle,
    };
  } else {
    return draggableStyle;
  }
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightgray' : 'transparent',
  padding: 16,
  paddingBottom: 200,
  borderRadius: 4,
});

// save to localStorage

export default class ScreenBuilder extends Component {
  constructor(props) {
    super(props);

    const storedStateString = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log('storedStateString');
    console.log(storedStateString);
    this.state = storedStateString
      ? JSON.parse(storedStateString)
      : {
          newComponentType: FlowBodyItemType.HTML,
          pages: [
            {
              id: guidGenerator(),
              title: 'Title',
              components: [
                {
                  id: guidGenerator(),
                  type: FlowBodyItemType.HTML,
                  body: "<p>Default First Component</p><p><br></p><p>Here's another line.</p>",
                },
                {
                  id: guidGenerator(),
                  type: FlowBodyItemType.HTML,
                  body: '<p>Default 2 Component</p>',
                },
                {
                  id: guidGenerator(),
                  type: FlowBodyItemType.HTML,
                  body: '<p>Default 3 Component</p>',
                },
                {
                  id: guidGenerator(),
                  type: FlowBodyItemType.HTML,
                  body: '<p>Default 4 Component</p>',
                },
              ],
            },
            defaultNewPage(),
          ],
          // which page are we editing in the flow?
          currentPage: 0,
          // which component are we editing within a page?
          // currentlyEditing: 'title', // for title
          currentlyEditing: 0,
          showShortcuts: false,
        };

    this.newComponentTypes = [
      { value: FlowBodyItemType.HTML, label: 'HTML' },
      { value: FlowBodyItemType.TEXT, label: 'Text Input' },
      { value: FlowBodyItemType.NUMBER, label: 'Number Input' },
      { value: FlowBodyItemType.BOOL, label: 'Checkbox Input' },
    ];
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = event => {
    // allows for keyboard editing
    // console.log(event);
    // console.log(event.keyCode);
    if (event.shiftKey && (event.metaKey || event.ctrlKey) && event.altKey) {
      switch (event.code) {
        case 'ArrowUp':
          // go up
          if (this.state.currentlyEditing === 'title') {
            // do nothing
          } else if (this.state.currentlyEditing === 0) {
            this.setState({ currentlyEditing: 'title' });
          } else {
            this.setState({ currentlyEditing: this.state.currentlyEditing - 1 });
          }
          break;
        case 'ArrowDown':
          // go down
          if (this.state.currentlyEditing === 'title') {
            if (this.state.pages[this.state.currentPage].components.length >= 1) {
              this.setState({ currentlyEditing: 0 });
            }
          } else if (
            this.state.currentlyEditing >=
            this.state.pages[this.state.currentPage].components.length - 1
          ) {
            // do nothing
          } else {
            this.setState({ currentlyEditing: this.state.currentlyEditing + 1 });
          }
          break;
        case 'ArrowLeft':
          // advance page to left
          this.setState({
            currentPage: Math.max(this.state.currentPage - 1, 0),
            currentlyEditing: 'title',
          });
          break;
        case 'ArrowRight':
          // advance page to right
          this.setState({
            currentPage: Math.min(this.state.currentPage + 1, this.state.pages.length - 1),
            currentlyEditing: 'title',
          });
          break;

        case 'KeyN':
          this.addPage();
          break;
        case 'Backspace':
          this.removePage();
          break;
        case 'KeyC':
          this.addComponent();
          break;
        case 'KeyM':
          this.removeComponent();
          break;
        case 'Digit1':
          this.changeCurrentComponentType(FlowBodyItemType.HTML);
          break;
        case 'Digit2':
          this.changeCurrentComponentType(FlowBodyItemType.TEXT);
          break;
        case 'Digit3':
          this.changeCurrentComponentType(FlowBodyItemType.NUMBER);
          break;
        case 'Digit4':
          this.changeCurrentComponentType(FlowBodyItemType.BOOL);
          break;

        default:
          // do nothing;
          break;
      }
    }
  };

  importPages = event => {
    const pageText = ''; // TODO find a way to import better
    this.setState({ pages: JSON.parse(pageText), currentlyEditing: 'title', currentPage: 0 });
  };

  changeCurrentComponentType = newComponentType => {
    const currentlyEditing = this.state.currentlyEditing;
    this.setState(oldState => {
      const pageObject = oldState.pages[oldState.currentPage];
      pageObject.components[currentlyEditing].type = newComponentType;
      if (!pageObject.components[currentlyEditing].name) {
        pageObject.components[currentlyEditing].name = 'Default Data Name';
      }
      oldState.pages[oldState.currentPage] = pageObject;
      return oldState;
    });
  };

  exportPages = () => {
    const copyToClipboard = text => {
      var el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style = { position: 'absolute', left: '-9999px' };
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    };
    const copiedPages = JSON.parse(JSON.stringify(this.state.pages));
    for (const page of copiedPages) {
      delete page.id;
      for (const component of page.components) {
        delete component.id;
      }
    }
    copyToClipboard(JSON.stringify(copiedPages, null, 2));
    alert('Copied!');
  };

  clearInput = () => {
    if (window.confirm('Are you sure you want to clear your flow data? This cannot be undone.')) {
      this.setState({
        pages: [
          {
            id: guidGenerator(),
            title: 'Title',
            components: [
              {
                id: guidGenerator(),
                type: FlowBodyItemType.HTML,
                body: "<p>Default First Component</p><p><br></p><p>Here's another line.</p>",
              },
            ],
          },
          defaultNewPage(),
        ],
        currentPage: 0,
        currentlyEditing: 0,
      });
    }
  };

  addPage = () => {
    const pages = this.state.pages;
    pages.push(defaultNewPage());
    this.setState({ pages, currentlyEditing: 'title' }, () =>
      this.setState({ currentPage: pages.length - 1 }),
    );
  };

  removePage = () => {
    if (this.state.pages.length === 1) {
      alert("You can't delete the only page of a flow.");
      return;
    }
    if (window.confirm("Are you sure you want to remove this page? This can't be undone.")) {
      this.setState(oldState => {
        oldState.pages.splice(oldState.currentPage, 1);
        if (oldState.currentPage >= oldState.pages.length) {
          oldState.currentPage = oldState.pages.length - 1;
        }
        oldState.currentlyEditing = 'title';
        return oldState;
      });
    }
  };

  addComponent = () => {
    let newComponent;
    switch (this.state.newComponentType) {
      case FlowBodyItemType.HTML:
        newComponent = {
          type: FlowBodyItemType.HTML,
          body: '<p>Sample HTML Body</p>',
        };
        break;
      case FlowBodyItemType.NUMBER:
        newComponent = {
          type: FlowBodyItemType.NUMBER,
          name: 'Number Input',
        };
        break;
      case FlowBodyItemType.TEXT:
        newComponent = {
          type: FlowBodyItemType.TEXT,
          name: 'Text Input',
        };
        break;
      case FlowBodyItemType.BOOL:
        newComponent = {
          type: FlowBodyItemType.BOOL,
          name: 'Bool Input',
        };
        break;
      default:
        break;
    }

    newComponent.id = guidGenerator();

    this.setState(oldState => {
      const pageObject = oldState.pages[oldState.currentPage];
      pageObject.components.push(newComponent);
      // select our newly created component
      oldState.currentlyEditing = pageObject.components.length - 1;
      oldState.pages[oldState.currentPage] = pageObject;
      return oldState;
    });
  };

  removeComponent = () => {
    if (this.state.currentlyEditing === 'title') {
      return;
    }
    if (window.confirm("Are you sure you want to remove this component? This can't be undone.")) {
      this.setState(oldState => {
        const pageObject = oldState.pages[oldState.currentPage];
        const components = pageObject.components;
        let currentlyEditing = oldState.currentlyEditing;

        components.splice(currentlyEditing, 1);

        if (currentlyEditing > components.length - 1) {
          currentlyEditing = currentlyEditing === 0 ? 'title' : currentlyEditing - 1;
        }
        pageObject.components = components;
        oldState.pages[oldState.currentPage] = pageObject;
        oldState.currentlyEditing = currentlyEditing;
        return oldState;
      });
    }
  };

  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const { currentlyEditing, pages, currentPage } = this.state;
    let newCurrentlyEditing = currentlyEditing;
    const currentPageObject = pages[currentPage];

    let components = currentPageObject.components;
    if (currentlyEditing !== 'title') {
      components[currentlyEditing].focus = true;
    }

    components = reorder(components, result.source.index, result.destination.index);

    if (currentlyEditing !== 'title') {
      newCurrentlyEditing = components.findIndex(component => component.focus);
      console.log(components[newCurrentlyEditing]);
      delete components[newCurrentlyEditing].focus;
      console.log(components[newCurrentlyEditing]);
    }

    currentPageObject.components = components;
    pages[this.state.currentPage] = currentPageObject;

    this.setState({
      pages,
      currentlyEditing: newCurrentlyEditing,
    });
  };

  renderComponent = (componentData, index) => {
    let className = 'componentSection';
    if (index === this.state.currentlyEditing) {
      className += ' active';
    }
    const renderBody = (componentData, index, provided, snapshot) => {
      let body = null;
      switch (componentData.type) {
        case FlowBodyItemType.HTML:
          body = (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={className}
              onClick={() => this.setState({ currentlyEditing: index })}
              dangerouslySetInnerHTML={{ __html: componentData.body }}
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            />
          );
          break;
        case FlowBodyItemType.NUMBER:
          body = (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={className}
              onClick={() => this.setState({ currentlyEditing: index })}
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            >
              <h4>{componentData.name || '{ data name here }'} (number)</h4>
              <input type="number" />
            </div>
          );
          break;
        case FlowBodyItemType.TEXT:
          body = (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={className}
              onClick={() => this.setState({ currentlyEditing: index })}
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            >
              <h4>{componentData.name || '{ data name here }'} (text)</h4>
              <input type="text" />
            </div>
          );
          break;
        case FlowBodyItemType.BOOL:
          className += ' checkbox';
          body = (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={className}
              onClick={() => this.setState({ currentlyEditing: index })}
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            >
              <h4>{componentData.name || '{ data name here }'}?</h4>
              <input type="checkbox" />
            </div>
          );
          break;
        default:
          break;
      }
      return body;
    };

    return (
      <Draggable key={componentData.id} draggableId={componentData.id} index={index}>
        {(provided, snapshot) => {
          return renderBody(componentData, index, provided, snapshot);
        }}
      </Draggable>
    );
  };

  changeNewComponentType = newComponentType => {
    this.setState({ newComponentType: newComponentType.value });
  };

  renderCurrentlyEditing = (currentlyEditing, currentPageObject) => {
    let editBody;
    if (currentlyEditing === 'title') {
      editBody = [
        <input
          className={!!currentPageObject.title ? 'hasText' : ''}
          type="text"
          value={currentPageObject.title}
          onChange={e => {
            const newTitle = e.target.value;
            this.setState(oldState => {
              const pageObject = oldState.pages[oldState.currentPage];
              pageObject.title = newTitle;
              oldState.pages[oldState.currentPage] = pageObject;
              return oldState;
            });
          }}
          autoFocus
        />,
        <label>Title</label>,
      ];
    } else {
      const currentSection = currentPageObject.components[currentlyEditing];
      editBody = [
        <Dropdown
          options={this.newComponentTypes}
          onChange={newComponentTypeTuple => {
            this.changeCurrentComponentType(newComponentTypeTuple.value);
          }}
          value={currentSection.type}
        />,
        <label className="upper">Component Type</label>,
      ];
      switch (currentSection.type) {
        case FlowBodyItemType.HTML:
          editBody.push(
            <div style={{ position: 'relative' }}>
              {/* <textarea
              className={!!currentSection.body ? 'hasText' : ''}
              type="text"
              value={currentSection.body}
              onChange={event => {
                const newVal = event.target.value;
                this.setState(oldState => {
                  oldState.components[currentlyEditing].body = newVal;
                  return oldState;
                });
              }}
            /> */}
              <CustomEditor
                key={currentlyEditing}
                body={currentSection.body}
                setBodyState={newBody => {
                  this.setState(oldState => {
                    const pageObject = oldState.pages[oldState.currentPage];
                    pageObject.components[currentlyEditing].body = newBody;
                    oldState.pages[oldState.currentPage] = pageObject;
                    return oldState;
                  });
                }}
                autoFocus
              />
              <label>Body</label>
            </div>,
          );
          break;
        case FlowBodyItemType.NUMBER:
        case FlowBodyItemType.TEXT:
        case FlowBodyItemType.BOOL:
          editBody.push(
            <div style={{ position: 'relative' }}>
              <input
                className={!!currentSection.name ? 'hasText' : ''}
                type="text"
                value={currentSection.name}
                onChange={e => {
                  const newName = e.target.value;
                  this.setState(oldState => {
                    const pageObject = oldState.pages[oldState.currentPage];
                    pageObject.components[currentlyEditing].name = newName;
                    oldState.pages[oldState.currentPage] = pageObject;
                    return oldState;
                  });
                }}
                autoFocus
              />
              <label>Data Name</label>
            </div>,
          );
          break;
        default:
          break;
      }
    }
    return <div className="prettyForm">{editBody}</div>;
  };

  toggleShortcuts = () => {
    this.setState({ showShortcuts: !this.state.showShortcuts });
  };

  render() {
    setImmediate(() => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        console.log('firing timeout for storing');
        if (localStorage.getItem(LOCAL_STORAGE_KEY) !== JSON.stringify(this.state)) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
        }
      }, 400);
    });
    const { pages, currentPage, currentlyEditing, showShortcuts } = this.state;
    const currentPageObject = pages[currentPage] || { components: [] };
    const { title, components } = currentPageObject;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <Carousel
            showThumbs={false}
            transitionTime={150}
            onChange={changedPageNumber =>
              this.setState({ currentPage: changedPageNumber, currentlyEditing: 'title' })
            }
            selectedItem={currentPage}
          >
            {pages.map((page, index) => {
              return (
                <div style={{ background: 'white', height: 40, marginBottom: 16 }}>
                  <p>
                    <b>Current Page:</b> {page.title}{' '}
                    {page.title === defaultNewPage().title && '(#' + (index + 1) + ')'}
                  </p>
                </div>
              );
            })}
          </Carousel>
          <div className="addRowButton standaloneButton" onClick={this.addPage}>
            + Add Page
          </div>
          {pages.length > 0 && (
            <div className="addRowButton standaloneButton danger" onClick={this.removePage}>
              – Remove Page
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
          <div className="app">
            <h2 className="appTitle" style={{ textAlign: 'center' }}>
              Pre-Natal Visit #1
            </h2>
            <h3
              className={'sectionTitle' + (currentlyEditing === 'title' ? ' active' : '')}
              onClick={() => this.setState({ currentlyEditing: 'title' })}
              style={{ textAlign: 'center' }}
            >
              {title || '{ title here }'}
            </h3>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {components.map(this.renderComponent)}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className="edit">
            <h2>Editing</h2>
            {this.renderCurrentlyEditing(currentlyEditing, currentPageObject)}
            {this.state.currentlyEditing !== 'title' && (
              <div className="addRowButton standaloneButton danger" onClick={this.removeComponent}>
                – Remove Component
              </div>
            )}
            <hr />
            <div
              className="addRow"
              style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
            >
              <div className="addRowButton" onClick={this.addComponent}>
                + Add Component
              </div>
              <Dropdown
                containerStyle={{ flex: 1 }}
                options={this.newComponentTypes}
                onChange={this.changeNewComponentType}
                value={this.state.newComponentType}
              />
            </div>
            <hr />
            <div className="addRowButton standaloneButton" onClick={this.toggleShortcuts}>
              {showShortcuts ? 'Hide' : 'Show'} Shortcuts
            </div>
            <div className="modal">
              <Modal visible={showShortcuts} effect="fadeInDown" onClickAway={this.toggleShortcuts}>
                <div style={{ padding: 8, paddingLeft: 24, paddingRight: 24 }}>
                  <h3>Shortcuts</h3>
                  <p>
                    hold <b>command + option + shift</b> and press the below keys:
                  </p>
                  <hr />
                  <h4>Component Shortcuts</h4>
                  <p>
                    <b>up:</b> move up one component
                  </p>
                  <p>
                    <b>down:</b> move down one component
                  </p>
                  <p>
                    <b>c:</b> add component
                  </p>
                  <p>
                    <b>m:</b> delete component
                  </p>
                  <p>
                    <b>1:</b> change component to html
                  </p>
                  <p>
                    <b>2:</b> change component to text
                  </p>
                  <p>
                    <b>3:</b> change component to number
                  </p>
                  <p>
                    <b>4:</b> change component to checkbox
                  </p>
                  <hr />
                  <h4>Page Shortcuts</h4>
                  <p>
                    <b>left:</b> move left one page
                  </p>
                  <p>
                    <b>right:</b> move right one page
                  </p>
                  <p>
                    <b>n:</b> add page
                  </p>
                  <p>
                    <b>delete:</b> delete page
                  </p>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <div>
          <div className="addRowButton standaloneButton" onClick={this.exportPages}>
            Export Data to Clipboard
          </div>
          <div className="addRowButton standaloneButton" onClick={this.importPages}>
            Import Data
          </div>
          <div className="addRowButton standaloneButton danger" onClick={this.clearInput}>
            Delete All Flow Data
          </div>
        </div>
      </div>
    );
  }
}
