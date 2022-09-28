const JSON_PATH = "http://localhost:8000/example.json"
class Entity 
{
    constructor(name,imglist,desc)
    {
        this.name = name;
        this.imglist = imglist;
        this.desc = desc;

        this.imagerender = this.imagerender.bind(this);
    }
    imagerender()
    {   
        const event = new Event('myevent');
        event.detail = {'imglist':this.imglist,'desc':this.desc}
        document.dispatchEvent(event);
    }
}
class Main
{
    constructor()
    {
        this.entitylist = [];
        this._parseJson = this._parseJson.bind(this);
        this._rendernames = this._rendernames.bind(this);
        this._renderimages = this._renderimages.bind(this);
        document.addEventListener('myevent',this._renderimages);
    }
    _rendernames()
    {
        const entitycontainer = document.querySelector("#en-bar");
        for(const ent of this.entitylist)
        {
            const para = document.createElement("li");
            para.textContent = ent.name;
            para.addEventListener('click',ent.imagerender);

            entitycontainer.appendChild(para);
        }
    }
    _renderimages(event)
    {
        const imagecontainer = document.querySelector("#img-bar");
        const desccontainer = document.querySelector("#desc-bar");
        imagecontainer.innerHTML = "";
        desccontainer.innerHTML ="";
        const images = event.detail.imglist;
        const descriptions = event.detail.desc;
        for(const src in images)
        {
            const img = document.createElement("img");
            img.src = images[src];
            img.dataset.descriptor = descriptions[src];
            img.addEventListener('click',this._renderdescription)
            imagecontainer.appendChild(img);
        }
    }
    _renderdescription(event)
    {
        const desccontainer = document.querySelector("#desc-bar");
        desccontainer.innerHTML = "";
        const val = event.currentTarget.dataset.descriptor;   
        const para = document.createElement("p");
        para.textContent = val;
        desccontainer.appendChild(para); 
    }
    _parseJson(json)
    {
        const elist = json;
        for(const item of elist)
        {
            const ent = new Entity(item.entity,item.images,item.Desc,this._renderimages);
            this.entitylist.push(ent);
        }
        this._rendernames();
    }
    loadentities()
    {
        fetch(JSON_PATH).then((response)=>response.json()).then(this._parseJson);
    }
}
const main = new Main();
main.loadentities();