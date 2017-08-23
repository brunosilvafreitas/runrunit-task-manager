import React from 'react';

import style from './App.css';

class App extends React.Component{
	constructor(props) {
    super(props);
	}

	render() {
		return (
			<div className={`container`}>
				<div className="content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default App;