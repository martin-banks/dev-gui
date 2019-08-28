import React, { Component } from 'react';
import { thisExpression } from '@babel/types';
import Styled from 'styled-components'


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
    this.previewProd = this.previewProd.bind(this)
    this.nodeInstall = this.nodeInstall.bind(this)

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
  previewProd () {
    ipcRenderer.send('cli-preview-prod', { dir: `${this.state.dir}` })
  }
  nodeInstall () {
    ipcRenderer.send('cli-node-install', { dir: `${this.state.dir}` })

  }


  render () {
    return <App>
      {/* <h1>Project builder</h1> */}
      <h4>{ this.state.dir ? `Directory: ${this.state.dir}` : '-- Choose a directory to begin --' }</h4>
      <Button
        onClick={ this.chooseDir }
        className={ !this.state.dir ? 'active' : 'innactive' }
      >Choose a directory</Button>
      {
        this.state.dir &&
          <Button
            onClick={ this.build }
            className={ this.state.dir ? 'active' : 'innactive' }
          >Build PROD</Button>
      }
      {
        this.state.dir &&
          <Button
            onClick={ this.nodeInstall }
            className={ this.state.dir ? 'active' : 'innactive' }
          >Node-install</Button>
      }
      {
        this.state.dir &&
          <Button
            onClick={ this.previewProd }
            className={ this.state.dir ? 'active' : 'innactive' }
          >Preview build</Button>
      }

      <hr/>
      <h4>Status:</h4>
      <Pre>{ JSON.stringify(this.state.status, 'utf8', 2) }</Pre>

    </App>
  }

}



const Pre = Styled.pre`
  display: block;
  // padding: 2rem;
  // background #222;
  // color: #bada55;
  // border-radius: 4px;
  // overflow: auto;
`

const App = Styled.div`
  // background #111;
  // color: white;
  padding: 1rem;
  // min-height: 100vh;
`

const Button = Styled.button`
  // padding: 0.5rem 1rem;
  // border: solid 1px rgba(255,255,255, 0.5);
  // border-radius: 100px;
  // color: white;
  // background: rgba(0,0,0, 0.6);
  // margin-bottom: 24px;
  // margin-right: 12px;
  &.active {
    // background: powderblue;
    // color: black;
  }
  &.innactive {
    // opacity: 0.4;
  }
  &:focus {
    // outline: none;
  }
`
