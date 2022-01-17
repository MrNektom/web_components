let popup = addPopup(document.body,"#popup",(e, name)=>{
  alert(name)
});
let secOne = popup.addSection("One")
secOne.addItem("One")
secOne.addItem("Two")
let secTwo = popup.addSection("Two")
secTwo.addItem("Three")
secTwo.addItem("Four")

