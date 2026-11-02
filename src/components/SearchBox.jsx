import { Component } from 'react';
import PropTypes from 'prop-types';

export default class SearchBox extends Component {
  handleClear = () => {
    this.refs.input.value = '';
    this.props.onChange('');
    this.refs.input.focus();
  };

  render() {
    return (
      <div className="search">
        <input
          ref="input"
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

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SearchBox.defaultProps = {
  placeholder: 'Search by title or #id',
};
