import axios from 'axios';
import React, {Component} from 'react';

export default class Editor extends Component{
    constructor() {
        super();
        this.state = {
            pageList: [],
            newPageName: ""
        }
    }


    render() {
        return (
            <>
                <input type="text"/>
                <button> Створити сторінку </button>
            </>
        )
    }
}