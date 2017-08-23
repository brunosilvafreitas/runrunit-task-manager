import React from 'react';

import style from './App.css';

class App extends React.Component{
	constructor(props) {
    super(props);
	}

	render() {
		return (
      <div className="app">
				{this.props.children}
			</div>
		);
	}
}

export default App;