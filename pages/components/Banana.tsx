import React from 'react'
import Fruit from './Fruit'

export default class Banana extends Fruit {
  constructor (props: any) {
    super (props)
    this.state = {
      name: "Banana",
      texture: "Starchy",
      taste: "Sweet"
    };
  }

  public render () {
    return this.parentRender('yellow')
  }
}