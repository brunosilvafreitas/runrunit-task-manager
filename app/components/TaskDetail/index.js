import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TaskDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="list-group mt-1 mb-1">
        <li className="list-group-item list-group-item-light">
          <strong>Responsible:</strong> {this.props.task.responsible_name}
        </li>
        <li className="list-group-item list-group-item-light">
          <strong>Type:</strong> {this.props.task.type_name}
        </li>
        <li className="list-group-item list-group-item-light">
          <strong>Client > Project:</strong> {this.props.task.client_name} > {this.props.task.project_name}
        </li>
        <li className="list-group-item list-group-item-light">
          <strong>Tags:</strong> {this.props.task.task_tags.map((tag, index) => (
            <span key={index} className="badge badge-secondary mr-1">{tag}</span>
          ))}
        </li>
        <li className="list-group-item list-group-item-light">
          <div className="row">
            <div className="col">
              <strong>Started:</strong> {moment(this.props.task.start_date).format("MMM DD, hh:mm A")}
            </div>
            {(this.props.task.is_closed) ? (
              <div className="col">
                <strong>Completed:</strong> {moment(this.props.task.close_date).format("MMM DD, hh:mm A")}
              </div>
            ) : ''}
          </div>
        </li>
      </ul>
    );
  }
}

TaskDetail.propTypes = {
  task: PropTypes.object.isRequired
};

export default TaskDetail;