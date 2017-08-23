import React from 'react';

class OptionsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row justify-content-md-center">
        <div className="col col-md-6"><br /><br />
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <img src="/images/icon_128.png" />
              </div>
              <h1 className="text-center">Runrun.it Settings</h1>
              <form>
                <div className="form-group">
                  <label htmlFor="appkey">App Key</label>
                  <input type="text" className="form-control" name="appkey" required />
                </div>
                <div className="form-group">
                  <label htmlFor="usertoken">User Token</label>
                  <input type="text" className="form-control" name="usertoken" required />
                </div>
                <div className="form-group">
                  <label htmlFor="userid">User Id</label>
                  <input type="text" className="form-control" name="userid" required />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OptionsPage;