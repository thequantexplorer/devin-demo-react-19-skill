import { Component, createRef } from 'react';
import { PRIORITIES } from '../data.js';

export default class NewTicketForm extends Component {
  titleRef = createRef();
  priorityRef = createRef();

  componentDidMount() {
    this.titleRef.current.focus();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const title = this.titleRef.current.value.trim();
    if (!title) return;
    this.props.onCreate({ title, priority: this.priorityRef.current.value });
    this.titleRef.current.value = '';
    this.titleRef.current.focus();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} aria-label="New ticket">
        <label>
          Title
          <input ref={this.titleRef} name="title" />
        </label>
        <label>
          Priority
          <select ref={this.priorityRef} name="priority" defaultValue="normal">
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
