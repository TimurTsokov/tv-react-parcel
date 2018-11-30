import React, {Component} from 'react';
import './app.scss';
// import img from './images/BMW.jpg'

export default class App extends Component {
    render() {
        return (
            <div className="todo-app">
                {/*<img src="" alt=""/>*/}
                <h1>
                    <ul>
                        <li>Lorem ipsum dolor.</li>
                        <li>Lorem ipsum dolor.</li>
                        <li>Lorem ipsum dolor.</li>
                        <li>Lorem ipsum dolor.</li>
                    </ul>
                </h1>
                <img src="./images/BMW.jpg" alt=""/>
            </div>
        );
    }
}

