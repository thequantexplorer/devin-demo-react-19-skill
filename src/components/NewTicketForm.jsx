import { Component } from 'react';
import PropTypes from 'prop-types';
import { PRIORITIES } from '../data.js';

export default class NewTicketForm extends Component {
  componentDidMount() {
    this.refs.title.focus();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const title = this.refs.title.value.trim();
    if (!title) return;
    this.props.onCreate({ title, priority: this.refs.priority.value });
    this.refs.title.value = '';
    this.refs.title.focus();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} aria-label="New ticket">
        <label>
          Title
          <input ref="title" name="title" />
        </label>
        <label>
          Priority
          <select ref="priority" name="priority" defaultValue="normal">
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Create ticket</button>
      </form>
    );
  }
}

NewTicketForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
};
