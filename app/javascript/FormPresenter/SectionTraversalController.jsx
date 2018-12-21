import React from 'react';
import PropTypes from 'prop-types';
import Form from '../Models/Form';

const SectionTraversalContext = React.createContext({
  currentSection: null,
  currentSectionId: null,
  currentSectionIndex: null,
  hasNextSection: false,
  hasPreviousSection: false,
  nextSection: () => {},
  previousSection: () => {},
  sectionCount: 0,
});

export default class SectionTraversalController extends React.Component {
  static Traverser = SectionTraversalContext.Consumer;

  static propTypes = {
    form: Form.propType.isRequired,
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      currentSectionId: props.form.getSections()[0].id,
    };
  }

  getCurrentSectionIndex = () => this.props.form.getSectionIndex(this.state.currentSectionId)

  getCurrentSection = () => this.props.form.getSection(this.state.currentSectionId)

  setCurrentSectionIndex = (newSectionIndex, callback) => {
    this.setState({
      currentSectionId: this.props.form.getSections()[newSectionIndex].id,
    }, callback);
  }

  addToSectionIndex = (offset, limiter, callback) => {
    const currentSectionIndex = this.getCurrentSectionIndex();
    const newSectionIndex = limiter(currentSectionIndex + offset);
    this.setCurrentSectionIndex(newSectionIndex, callback);
  }

  ifSectionIdChanged = (oldSectionId, callback) => {
    if (!callback) {
      return null;
    }

    return () => {
      if (oldSectionId !== this.state.currentSectionId) {
        callback();
      }
    };
  }

  previousSection = (onChange) => {
    const oldSectionId = this.state.currentSectionId;

    this.addToSectionIndex(
      -1,
      newSectionIndex => Math.max(newSectionIndex, 0),
      this.ifSectionIdChanged(oldSectionId, onChange),
    );
  }

  nextSection = (onChange) => {
    const oldSectionId = this.state.currentSectionId;
    const maxSectionIndex = this.props.form.getSections().length - 1;

    this.addToSectionIndex(
      1,
      newSectionIndex => Math.min(newSectionIndex, maxSectionIndex),
      this.ifSectionIdChanged(oldSectionId, onChange),
    );
  }

  render = () => (
    <SectionTraversalContext.Provider
      value={{
        currentSection: this.getCurrentSection(),
        currentSectionId: this.state.currentSectionId,
        currentSectionIndex: this.getCurrentSectionIndex(),
        hasNextSection: this.getCurrentSectionIndex() < this.props.form.getSections().length - 1,
        hasPreviousSection: this.getCurrentSectionIndex() > 0,
        nextSection: this.nextSection,
        previousSection: this.previousSection,
        sectionCount: this.props.form.getSections().length,
      }}
    >
      {this.props.children}
    </SectionTraversalContext.Provider>
  )
}
