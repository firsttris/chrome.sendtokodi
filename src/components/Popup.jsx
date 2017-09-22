import React, { Component } from 'react';

class Popup extends Component {
  render() {
    return (
      <div>
        <textarea className="form-control" rows="2" id="comment" />
        <button type="submit" className="btn btn-secondary">
          SendToKodi
        </button>
      </div>
    );
  }
}

export default Popup;
