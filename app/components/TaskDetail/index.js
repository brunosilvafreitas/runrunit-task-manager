import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

class TaskDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="list-group mt-1 mb-1">
        <li className="list-group-item list-group-item-light">
          <FormattedMessage id="tasks.info.responsible">
            {(txt) => (<strong>{txt}:</strong>)}
          </FormattedMessage> {this.props.task.responsible_name}
        </li>
        <li className="list-group-item list-group-item-light">
          <FormattedMessage id="tasks.info.type">
            {(txt) => (<strong>{txt}:</strong>)}
          </FormattedMessage> {this.props.task.type_name}
        </li>
        <li className="list-group-item list-group-item-light">
          <FormattedMessage id="tasks.info.project">
            {(txt) => (<strong>{txt}:</strong>)}
          </FormattedMessage> {this.props.task.client_name} > {this.props.task.project_name}
        </li>
        <li className="list-group-item list-group-item-light">
          <FormattedMessage id="tasks.info.tags">
            {(txt) => (<strong>{txt}:</strong>)}
          </FormattedMessage> {this.props.task.task_tags.map((tag, index) => (
            <span key={index} className="badge badge-secondary mr-1">{tag}</span>
          ))}
        </li>
        <li className="list-group-item list-group-item-light">
          <div className="row">
            <div className="col">
              <FormattedMessage id="tasks.info.started">
                {(txt) => (<strong>{txt}:</strong>)}
              </FormattedMessage> {moment(this.props.task.start_date).format("MMM DD, hh:mm A")}
            </div>
            {(this.props.task.is_closed) ? (
              <div className="col">
                <FormattedMessage id="tasks.info.completed">
                  {(txt) => (<strong>{txt}:</strong>)}
                </FormattedMessage> {moment(this.props.task.close_date).format("MMM DD, hh:mm A")}
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