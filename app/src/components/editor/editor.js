import axios from 'axios';
import React, {Component} from 'react';

export default class Editor extends Component{
    constructor() {
        super();
        this.carentPage = "index.html";

        this.state = {
            pageList: [],
            newPageName: ""
        }

        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.init(this.carentPage);
    }

    init(page){
        this.frame = document.querySelector('iframe');
        this.open(page);
        this.loadPageList();
    }

    open(page){
        this.carentPage = `../${page}`;
        console.log(this.carentPage);
    }
    
    loadPageList(){
        axios.get("./api")
            .then( res => this.setState( {pageList: res.data}))

    }

    createNewPage(){
        axios.post("./api/createNewPage.php", {"name":this.state.newPageName})
            .then(this.loadPageList())
            .catch(() => alert("Сторінка вже існує!"));
    }

    deletePage(page){
        axios.post("./api/deletePage.php", {"name": page})
            .then(this.loadPageList())
            .catch(() => alert("Сторінки не існує!"));
    }

    render() {
        // const {pageList} = this.state;
        // const pages = pageList.map( (page, i) => {
        //     return (
        //         <h1 key={i}>{page}
        //             <a
        //                 href="#"
        //                 onClick={() => this.deletePage(page)}
        //             >(x)</a></h1>
        //     )
        // });
        return (

            <iframe src={this.carentPage} frameBorder="0"></iframe>
            
            // <>
            //     <input
            //         onChange={(e) =>{this.setState({newPageName: e.target.value}) }}
            //         type="text"/>
            //     <button onClick={this.createNewPage}> Створити сторінку </button>
            //     {pages}
            // </>
        )
    }
}