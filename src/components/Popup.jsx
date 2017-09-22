import React, { Component } from 'react';

class Popup extends Component {
  constructor() {
    super();
    this.state = {
      link: ''
    };
  }

  handleChange(event) {
    this.setState({ link: event.target.value });
  }

  componentWillMount() {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      this.setState({ link: tabs[0].url });
    });
  }

  render() {
    return (
      <div>
        <textarea
          className="form-control"
          rows="3"
          style={{ width: '300px' }}
          value={this.state.link}
          onChange={event => this.handleChange(event)}
        />
        <div className="float-right m-1">
          <button type="submit" className="btn btn-secondary">
            SendToKodi
          </button>
        </div>
      </div>
    );
  }
}

export default Popup;
