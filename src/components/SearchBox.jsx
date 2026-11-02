import { Component, createRef } from 'react';

export default class SearchBox extends Component {
  inputRef = createRef();

  handleClear = () => {
    this.inputRef.current.value = '';
    this.props.onChange('');
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div className="search">
        <input
          ref={this.inputRef}
          type="search"
          aria-label="Search tickets"
          placeholder={this.props.placeholder}
          onChange={(e) => this.props.onChange(e.target.value)}
        />
        <button type="button" onClick={this.handleClear}>
          Clear
        </button>
      </div>
    );
  }
}

SearchBox.defaultProps = {
  placeholder: 'Search by title or #id',
};
