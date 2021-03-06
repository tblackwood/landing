import "../../helpers/iframeLoader.js";
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
        this.iframe = document.querySelector('iframe');
        this.open(page);
        this.loadPageList();
    }

    open(page){
        this.carentPage = `../${page}`;

        axios.get(`../${page}`)
            .then( res=> this.parseStrToDom(res.data))
            .then(this.wrapTextNodes)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(this.serializeDomToString)
            .then(html => axios.post("./api/saveTempPage.php", {html}))
            .then(() => this.iframe.load("../temp.html"))
            .then(() => this.enableEditing())

    }

    enableEditing(){
        this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach(element =>{
            element.contentEditable = "true";
            element.addEventListener("input", ()=>{
                this.onTextEdit(element);
            })
        });

    }

    onTextEdit(element){
        const id = element.getAttribute("nodeid");
        this.virtualDom.body.querySelector(`[nodeid="${id}"]`).innerHTML = element.innerHTML;
    }

    parseStrToDom(str){
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    }

    wrapTextNodes(dom){
        const body = dom.body;

        let texNodes = [];

        function recursy(element){
            element.childNodes.forEach(node => {

                if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0){
                    texNodes.push(node);
                }else{
                    recursy(node);
                }
            })
        }

        recursy(body)

        texNodes.forEach( (node, i) =>{
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.setAttribute("nodeid", i);

        });

        return dom;
    }

    serializeDomToString(dom){
       const serializer = new XMLSerializer();
       return serializer.serializeToString(dom);
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