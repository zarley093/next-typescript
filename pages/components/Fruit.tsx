import React from 'react'

export default class Fruit extends React.Component <{}, {name: any, texture: any, taste: any,}> {
  constructor(props: any) {
    super(props);

    this.state = {
      name: "Tomato",
      texture: "Juicy",
      taste: "Sour"
    };

    // this.setState({
    //   name: "Tomato",
    //   texture: "Juicy",
    //   taste: "Sour",
    // })
  }
  public parentRender (color: any) {
    const design = `m-2 ml-6 p-2 rounded-lg bg-${color}-300`
    return (
      <div className={design}>
        <div>This is a child class.</div>
        <div>
          <p>Fruit: {this.state.name}</p>
          <p>Texture: {this.state.texture}</p>
          <p>Taste: {this.state.taste}</p>
        </div>
        
      </div>
    )
  }

  public render () {
    return (
      <div className="m-2 p-2 rounded-lg bg-red-300">
        <div>This is a parent class.</div>
        <p>Fruit: {this.state.name}</p>
        <p>Texture: {this.state.texture}</p>
        <p>Taste: {this.state.taste}</p>
      </div>
    )
  }
}




