(function(){
  function addPopup(container,selector,handler){
    let popup = Popup(handler);
    if (container instanceof Element && typeof selector == "string" && typeof handler == "function") {
      container.addEventListener("contextmenu",e=>{
        let closest = e.target.closest(selector);
        if (closest && container.contains(closest)) {
          e.preventDefault();
          popup.show(e.clientX,e.clientY);
        }
      })
      container.addEventListener("selectstart",e=>{
        let closest = e.target.parentNode.closest(selector)
        if (closest && container.contains(closest)) {
          e.preventDefault()
        }
      })
    } else {
      throw new Error("Invalid arguments: required 3 arguments of types: Element, string, function.");
    }
    return popup
  }
  function Popup(handler){
    let elem = document.createElement("div");
    let sh = elem.attachShadow({mode:"closed"})
    console.log(sh)
    let sections = [];
    sh.innerHTML = `
      <style>
        :host {
          position: fixed;
          top:0;
          left:0;
          min-width:100%;
          min-height:100%;
          background-color:#0003;
          outline:0px solid orange;
          outline-offset: -2px
        }
        #popup {
          position: absolute;
          left:0;
          top:0;
        }
        
        #popup .item {
          display: block;
          min-width: 150px;
          padding: 8px;
          font-size: 18px;
          transition: background-color 0.1s;
          user-select:none;
        }
        #popup .item:active {
          background-color: #0002;
        }
        #popup section {
          background-color: #fff;
          box-shadow: 0 0 8px 3px #0003;
          border-radius: 7px;
          overflow: auto;
        }
        #popup section:not(:first-child) {
          margin-top: 8px;
        }
        #popup section[title]:not([title=""]){
          
        }
        #popup section[title]:not([title=""]):before {
          content:attr(title);
          font-weight: 500;
          color: grey;
          font-size: 12px;
          margin: 5px 0 0 5px;
        }
      </style>
      <div id="popup"></div>
    `;
    sh.addEventListener("click",e=>{
      if(e.target.tagName=="SECTION") {
        e.preventDefault()
        e.stopPropagation()
      }
      if(e.target.classList.contains("item")){
        handler(e, e.target.name)
      }
    })
    elem.addEventListener("click",e=>{
      r.hide()
    })
    let r = {
      show(x,y){
        let popup = sh.querySelector("#popup")
        popup.style.left = x + "px"
        popup.style.top = y + "px"
        document.body.appendChild(elem);
        elem.animate([
          {
            opacity:0
          },{
            opacity:1
          }
          ],{
            duration:200,
            easing:"ease-in-out"
          })
          popup.animate([
            {
              transform:"scale(0.8)"
            },{
              transform:"scale(1)"
            }],{
              duration:200,
              easing:"ease-in-out"
            })
      },
      hide(){
        elem.remove();
      },
      addItem(item){
        item = String(item)
        let sec = this.getSection(-1)
        sec.addItem(item)
      },
      getSection(n){
        if(typeof n != "number")return null;
        if(n<0){
          n = sections.length - 1
          if(n == -1){
            this.addSection("");
            n = 0
          }
        }
        return sections[n]
      },
      addSection(name,sec){
        sec = sections.push(PopupSection(name,sec,sh.querySelector("#popup")))
        return sections[sec-1]
      }
    }
    
    return r;
  }
  function PopupItem(name,sec){
    let children = [];
    let elem = document.createElement("span")
    elem.name = sec.name + "." + name
    elem.className = "item"
    elem.innerText = name
    sec.appendChild(elem)
  }
  function PopupSection(name,sec,popup){
    let elem = document.createElement("section")
    elem.name = name
    if(name.length){
      elem.setAttribute("title",name)
    }
    popup.appendChild(elem)
    let items = []
    
    return {
      addItem(name){
        let item = items.push(PopupItem(name,elem))
        return items[item]
      }
    }
  }
  window.addPopup = addPopup
  
})();