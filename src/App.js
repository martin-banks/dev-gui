import React, { Component } from 'react';
import { thisExpression } from '@babel/types';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

const { ipcRenderer } = window.require('electron')

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dir: null,
      status: [],
    }

    this.chooseDir = this.chooseDir.bind(this)
    this.build = this.build.bind(this)

    ipcRenderer.on('chosen-folder', (e, dir) => {
      console.log('Recieved dir', { dir })
      this.setState({ dir })
    })
    ipcRenderer.on('status', (err, status) => {
      const update = this.state.status
      update.push(status)
      this.setState({ status: update })
    })
  }

  chooseDir () {
    console.log('Click!')
    ipcRenderer.send('open-choose-folder')
  }
  build () {
    console.log('Sending build PROD request')
    ipcRenderer.send('cli-build-prod', { dir: this.state.dir })
  }


  render () {
    return <div>
      <pre>{ this.state.dir ? `Directory: ${this.state.dir}` : '-- Choose a directory to begin --' }</pre>
      <button onClick={ this.chooseDir }>Choose a directory</button>
      {
        this.state.dir &&
          <button onClick={ this.build }>Build PROD</button>
      }

      <hr/>
      <h4>Status:</h4>
      <pre>{ JSON.stringify(this.state.status, 'utf8', 2) }</pre>

    </div>
  }

}
