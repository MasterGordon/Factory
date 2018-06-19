$(window).resize(function() {
  style();
})

$(document).ready(function() {
  style();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  $('body').on("contextmenu", function() {
    return false;
  })
  clickEvents()
})

function style() {
  var top = 0
  if (window.innerHeight < 910) {
    top = 43
  }
  var screenMarginTop = window.innerHeight - 912 + top
  var screenMarginLeft = (window.innerWidth - 1200) / 2
  var itemCountMarginTop = screenMarginTop + 624
  var infoMarginLeft = screenMarginLeft + 768

  $('#screen').css('margin-top', screenMarginTop)
  $('#screen').css('margin-left', screenMarginLeft)
  $('#buildselect').css('margin-top', screenMarginTop)
  $('#buildselect').css('margin-left', screenMarginLeft)
  $('#help').css('margin-top', screenMarginTop)
  $('#help').css('margin-left', screenMarginLeft)
  $('#oretiers').css('margin-top', screenMarginTop)
  $('#oretiers').css('margin-left', screenMarginLeft)
  $('#selectFactory').css('margin-top', screenMarginTop)
  $('#selectFactory').css('margin-left', screenMarginLeft)
  $('#selectItem').css('margin-top', screenMarginTop)
  $('#selectItem').css('margin-left', screenMarginLeft)
  $('#inventoryBig').css('margin-top', screenMarginTop)
  $('#inventoryBig').css('margin-left', screenMarginLeft)
  $('#info').css('margin-top', itemCountMarginTop)
  $('#info').css('margin-left', infoMarginLeft)
  $('#infoDesc').css('margin-top', itemCountMarginTop + 51)
  $('#infoDesc').css('margin-left', infoMarginLeft + 5)
  $('#options').css('margin-top', itemCountMarginTop + 51)
  $('#options').css('margin-left', infoMarginLeft + 245)
  $('#itemcount').css('margin-top', itemCountMarginTop)
  $('#itemcount').css('margin-left', screenMarginLeft)
  $('#showmore').css('margin-top', itemCountMarginTop)
  $('#showmore').css('margin-left', screenMarginLeft + 370)
  $('#money').css('margin-top', itemCountMarginTop - 42)
  $('#money').css('margin-left', screenMarginLeft + 3)
  screenleftpos = screenMarginLeft
  screentoppos = screenMarginTop
  infoleftpos = infoMarginLeft
  itemcounttoppos = itemCountMarginTop
}

function pxToInt(px) {
  return parseInt(px.substring(0, px.length - 2))
}

//SELECTION UND BOX TRACKING

var screenleftpos = 0
var screentoppos = 0

var infoleftpos = 0
var itemcounttoppos = 0

var cursorScreenX = -1
var cursorScreenY = -1

var cursorItemCountX = -1
var cursorItemCountY = -1

var cursorInfoX = -1
var cursorInfoY = -1

var isCursorInScreen = true
var isCursorInItemCount = true
var isCursorInInfo = true

var mousedown = false

var tooltip = ""
var buildRotation = "right"

function onDocumentMouseMove(event) {
  //Tooltip POS
  setTooltip()
  if (tooltip) {
    var tooltipX = event.clientX + 3
    var tooltipY = event.clientY - $('#tooltip').height() - 6

    if (tooltipX + $('#tooltip').width() > innerWidth) {
      tooltipX -= ($('#tooltip').width() + 12)
    }

    if (tooltipY < 0) {
      tooltipY += $('#tooltip').height() + 3
    }

    $('#tooltip').css("top", tooltipY)
    $('#tooltip').css("left", tooltipX)
  }

  //Track CursorPos
  var mX = event.clientX - infoleftpos;
  var mY = event.clientY - itemcounttoppos;
  if (mX < 0 || mX > 432 || mY < 0 || mY > 240) {
    cursorInfoX = -1
    cursorInfoY = -1
  } else {
    cursorInfoX = Math.floor(mX / 48);
    cursorInfoY = Math.floor(mY / 48);
  }
  mX = event.clientX - screenleftpos;
  mY = event.clientY - itemcounttoppos;
  if (mX < 0 || mX > 720 || mY < 0 || mY > 240) {
    cursorItemCountX = -1
    cursorItemCountY = -1

  } else {
    cursorItemCountX = Math.floor(mX / 72);
    cursorItemCountY = Math.floor((mY - 24) / 72);
  }
  mX = event.clientX - screenleftpos;
  mY = event.clientY - screentoppos;
  if (mX < 0 || mX > 1200 || mY < 0 || mY > 576) {
    cursorScreenX = -1
    cursorScreenY = -1
  } else {
    cursorScreenX = Math.floor(mX / 48);
    cursorScreenY = Math.floor(mY / 48);
  }
  if (cursorScreenX != -1 && cursorScreenY != -1) {
    isCursorInScreen = true
  } else {
    isCursorInScreen = false
  }

  if (cursorItemCountX != -1 && cursorItemCountY != -1) {
    isCursorInItemCount = true
  } else {
    isCursorInItemCount = false
  }

  if (cursorInfoX != -1 && cursorInfoY != -1) {
    isCursorInInfo = true
  } else {
    isCursorInInfo = false
  }
  if (mousedown && mode == "build" && isCursorInScreen) {
    if (factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] == 0) {
      if (new toBuild().pay()) {
        factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] = new toBuild(cursorScreenX, cursorScreenY, factorys[currentFactory])
        factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].direction = buildRotation
      }
    }
  }
}

function clickEvents() {
  $('#showmore').click(function() {
    if (mode == "none") {
      $('#inventoryBig').fadeIn(200)
      mode = "showmore"
    } else {
      closeUi()
    }
  })
  $('#info').click(function() {
    if (cursorInfoY == 0) {
      switch (cursorInfoX) {
        case 0:
          //BUILD BUTTON
          if (mode == "none") {
            $('#buildselect').fadeIn(200)
            mode = "selectbuilding"
          } else {
            closeUi()
          }
          break
        case 1:
          //MOVE BUTTON
          if (mode == "none") {
            mode = "move"
          } else {
            closeUi()
          }
          break
        case 2:
          //ROTATE BUTTON
          if (mode == "none") {
            mode = "rotate"
          } else {
            closeUi()
          }
          break
        case 3:
          //ROTATE BUTTON
          if (mode == "none") {
            mode = "delete"
          } else {
            closeUi()
          }
          break
        case 5:
          //selectFactory BUTTON
          if (mode == "none") {
            mode = "help"
            $('#help').fadeIn(200)
          } else {
            closeUi()
          }
          break
        case 6:
          //selectFactory BUTTON
          if (mode == "none") {
            mode = "oretiers"
            $('#oretiers').fadeIn(200)
          } else {
            closeUi()
          }
          break
        case 8:
          //selectFactory BUTTON
          if (mode == "none") {
            mode = "selectFactory"
            drawFactorys()
            $('#selectFactory').fadeIn(200)
          } else {
            closeUi()
          }
          break
      }
    }
  })
}

var toBuild = 0
var moveFromX = 0
var moveFromY = 0
var moveFromCX = -1
var moveFromCY = -1

//itemId[]

var hoverTooltip = false

function setTooltip() {
  if (hoverTooltip)
    return
  if (cursorInfoY == 0 && isCursorInInfo) {
    if (lang.infotooltips[cursorInfoX] == "") {
      $('#tooltip').hide()
      tooltip = false
      return
    }
    $('#tooltip').text(lang.infotooltips[cursorInfoX])
    $('#tooltip').show()
    tooltip = true
    return;
  }
  if (isCursorInItemCount) {
    if (cursorItemCountX + cursorItemCountY * 10 < itemId.length) {
      $('#tooltip').text(lang.items[itemId[cursorItemCountX + cursorItemCountY * 10]])
      $('#tooltip').show()
      tooltip = true
      return;
    }
  }

  $('#tooltip').hide()
  tooltip = false
}

var itemId = []
var itemCount = []
var deleteFromX = -1
var deleteFromY = -1

function options() {
  $('#options').empty()
  for (var i = 0; i < selectedTile.options.length; i++) {
    if (selectedTile.options[i].type == "item") {
      $('#options').append("<span class='optionslable'>" + lang.tiles[selectedTile.name].options[selectedTile.options[i].var] + ": </span><img id='option_" + selectedTile.options[i].var+"' src='images/items/" + items[selectedTile[selectedTile.options[i].var]].name + ".png'>")
      $("#option_" + selectedTile.options[i].var).click(function() {
        $('#selectItem').fadeIn(200)
        mode = "selectItem"
        selectItemVal = $(this).attr("id").substr(7)
      })
    } else if (selectedTile.options[i].type == "amount") {
      $('#options').append("<span class='optionslable'>" + lang.tiles[selectedTile.name].options[selectedTile.options[i].var] + ": </span><input id='option_" + selectedTile.options[i].var+"'></input>")
      $("#option_" + selectedTile.options[i].var).spinner({
        min: 0,
        numberFormat: "n",
        change: function(event, ui) {
          $(this).spinner("value", Math.max(0, $(this).spinner("value")))
          selectedTile[$(this).attr("id").substr(7)] = $(this).spinner("value");
        }
      })
      $("#option_" + selectedTile.options[i].var).spinner("value", selectedTile[selectedTile.options[i].var])
    }
    $('#options').append("<br>")
  }
  $('#options').show()
}

function buildEvents() {
  $(window).bind('mousewheel DOMMouseScroll', function(event) {
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
      // scroll up
      switch (buildRotation) {
        case "right":
          buildRotation = "up"
          break;
        case "down":
          buildRotation = "right"
          break;
        case "left":
          buildRotation = "down"
          break;
        case "up":
          buildRotation = "left"
          break;
      }

    } else {
      // scroll down
      switch (buildRotation) {
        case "right":
          buildRotation = "down"
          break;
        case "down":
          buildRotation = "left"
          break;
        case "left":
          buildRotation = "up"
          break;
        case "up":
          buildRotation = "right"
          break;
      }
    }
  });
  $('img').click(function() {
    var id = $(this).attr("id");
    if (id.startsWith("build_")) {
      id = parseInt(id.substr(6))
      toBuild = tileClasses[id]
      buildRotation = "right"
      mode = "build"
      $('#buildselect').fadeOut(200)
    }
  })
  $('#screen').click(function() {
    if (mode == "rotate") {
      if (factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] != 0) {
        factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].rotate()
      }
    }
    if (mode == "move") {
      if (isCursorInScreen) {
        if (factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] != 0) {
          moveFromCX = cursorScreenX
          moveFromCY = cursorScreenY
        } else if (moveFromCX != -1) {
          if (factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] == 0) {
            factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] = factorys[currentFactory].tiles[moveFromCX][moveFromCY]
            factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].x = cursorScreenX
            factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].y = cursorScreenY
            while (factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].input.items.length > 0)
              var item = factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].input.items.pop()
            factorys[currentFactory].tiles[moveFromCX][moveFromCY] = 0
          } else {
            moveFromCX = cursorScreenX
            moveFromCY = cursorScreenY
          }
          moveFromCX = -1
          moveFromCY = -1
        }
      }
    }
    if (mode == "build" && isCursorInScreen) {
      if (factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] == 0) {
        if (new toBuild().pay()) {
          factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] = new toBuild(cursorScreenX, cursorScreenY, factorys[currentFactory])
          factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].direction = buildRotation
        }
      }
    }
    if ((mode == "none") && isCursorInScreen) {
      if (factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] != 0) {
        selectedTile = factorys[currentFactory].tiles[cursorScreenX][cursorScreenY]
        //Click auf Tile
        if (selectedTile.options != undefined) {
          //Has Options
          options()
        } else {
          $('#options').hide()
        }
      } else if (mode != "selectItem") {
        selectedTile = 0
        $('#options').hide()
      }
    } else if (mode != "build") {
      selectedTile = 0
      $('#options').hide()
    }
  })

  $('img').hover(
    function() {
      //ENTER
      var id = $(this).attr("id");
      if (id.startsWith("build_")) {
        id = parseInt(id.substr(6))
        selectedTile = new tileClasses[id]()
      }
    },
    function() {
      //LEAVE
      if (mode == "selectbuilding")
        selectedTile = 0
    }
  );

  $('body').mousedown(function(e) {
    if (e.which == 1)
      mousedown = true
    if (mode == "move") {
      if (isCursorInScreen) {
        moveFromX = cursorScreenX
        moveFromY = cursorScreenY
      }
    }
    if (mode == "delete") {
      deleteFromX = cursorScreenX
      deleteFromY = cursorScreenY
    }
  })

  $('body').mouseup(function(e) {
    if (isCursorInScreen)
      if (mode == "delete") {
        var minX = 0
        var maxX = 0
        var minY = 0
        var maxY = 0
        if (deleteFromX <= cursorScreenX) {
          minX = deleteFromX
          maxX = cursorScreenX
        } else {
          maxX = deleteFromX
          minX = cursorScreenX
        }
        if (deleteFromY <= cursorScreenY) {
          minY = deleteFromY
          maxY = cursorScreenY
        } else {
          maxY = deleteFromY
          minY = cursorScreenY
        }
        for (var x = minX; x <= maxX; x++) {
          for (var y = minY; y <= maxY; y++) {
            if (factorys[currentFactory].tiles[x][y] != 0) {
              factorys[currentFactory].tiles[x][y] = 0
            }
          }
        }
        deleteFromX = -1
        deleteFromY = -1
      }
    if (e.which == 1)
      mousedown = false
    if (mode == "move") {
      if (isCursorInScreen && moveFromX != -1) {
        if (moveFromX != cursorScreenX || moveFromY != cursorScreenY) {
          if (factorys[currentFactory].tiles[moveFromX][moveFromY] != 0 && factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] == 0) {
            factorys[currentFactory].tiles[cursorScreenX][cursorScreenY] = factorys[currentFactory].tiles[moveFromX][moveFromY]
            factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].x = cursorScreenX
            factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].y = cursorScreenY
            while (factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].input.items.length > 0)
              var item = factorys[currentFactory].tiles[cursorScreenX][cursorScreenY].input.items.pop()
            factorys[currentFactory].tiles[moveFromX][moveFromY] = 0
          }
          moveFromX = -1
          moveFromY = -1

        }
      }
    }
  })

  $('body').on("contextmenu", function() {
    closeUi()
  })
}

function closeUi() {
  selectedTile = 0
  $('#options').hide()
  if (mode == "build") {
    mode = "none"
    toBuild = 0
    return false
  }
  if (mode == "selectbuilding") {
    mode = "none"
    $('#buildselect').fadeOut(200)
    return false
  }
  if (mode == "move") {
    mode = "none"
    return false
  }
  if (mode == "rotate") {
    mode = "none"
    return false
  }
  if (mode == "delete") {
    mode = "none"
    return false
  }
  if (mode == "showmore") {
    mode = "none"
    $('#inventoryBig').fadeOut(200)
    return false
  }
  if (mode == "selectItem") {
    mode = "none"
    $('#selectItem').fadeOut(200)
    return false
  }
  if (mode == "selectFactory") {
    mode = "none"
    $('#selectFactory').fadeOut(200)
    return false
  }
  if (mode == "oretiers") {
    mode = "none"
    $('#oretiers').fadeOut(200)
    return false
  }
  if (mode == "help") {
    mode = "none"
    $('#help').fadeOut(200)
    return false
  }
}

function sort() {
  if (itemId.length > 1) {
    var swapped = true
    while (swapped) {
      swapped = false
      for (var i = 0; i < itemId.length - 1; i++) {
        if (itemId[i] > itemId[i + 1]) {
          var id = itemId[i]
          var count = itemCount[i]
          itemId[i] = itemId[i + 1]
          itemCount[i] = itemCount[i + 1]
          itemCount[i + 1] = count
          itemId[i + 1] = id
          swapped = true
        }
      }
    }
  }
}

function drawInventory(inventory, title) {
  itemId = []
  itemCount = []

  if ((inventory instanceof Inventory))
    for (let item of inventory.items) {
      var id = item.id
      var index = itemId.indexOf(item.id)
      if (index == -1) {
        itemId.push(id)
        itemCount.push(1)
      } else {
        itemCount[index]++
      }
    }
  if ((inventory instanceof FactoryInventory)) {
    itemId = inventory.items
    itemCount = inventory.itemcount
  }
  sort()

  inventoryCtx.clearRect(0, 0, innerWidth, innerHeight)
  inventoryCtx.font = "20px Electrolize"
  inventoryCtx.fillStyle = "#a3a3a3"
  inventoryCtx.fillRect(0, 0, 15 * 48, 24);
  inventoryCtx.fillStyle = "black"
  inventoryCtx.fillText(lang.inventory + " - " + title, 2, 18)
  inventoryCtx.fillStyle = "black"
  inventoryCtx.textAlign = "end"
  inventoryCtx.fillText(lang.more, 48 * 15 - 2, 18)
  inventoryCtx.textAlign = "start"
  inventoryCtx.font = "16px Electrolize"
  var currentIndex = 0
  if (currentIndex == itemId.length)
    return true
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 10; x++) {
      inventoryCtx.drawImage(items[itemId[currentIndex]].img, 12 + x * 72, 36 + y * 72, 48, 48)

      var formattedCount = formatItemCount(itemCount[currentIndex])
      inventoryCtx.strokeStyle = "black"
      inventoryCtx.lineWidth = 2
      inventoryCtx.strokeText("x" + formattedCount, 4 + x * 72, 91 + y * 72)
      inventoryCtx.fillStyle = "white"
      inventoryCtx.fillText("x" + formattedCount, 4 + x * 72, 91 + y * 72)

      currentIndex++
      if (currentIndex == itemId.length)
        return true
    }
  }
}

var itembg = new Image
itembg.src = "images/inventorybg.png"

function drawBigInventory(inventory) {
  if (!(inventory instanceof FactoryInventory))
    return false;
  itemId = []
  itemCount = []

  if ((inventory instanceof FactoryInventory)) {
    itemId = inventory.items
    itemCount = inventory.itemcount
  }
  sort()
  for (var i = 0; i < items.length; i++) {
    $('#itemBig_' + i)[0].getContext("2d").clearRect(0, 0, 72, 72)
  }
  var currentIndex = 0
  while (currentIndex != itemId.length) {
    var itemCtx = $('#itemBig_' + currentIndex)[0].getContext("2d")
    itemCtx.clearRect(0, 0, innerWidth, innerHeight)
    itemCtx.font = "16px Electrolize"
    itemCtx.drawImage(itembg, 0, 0, 72, 72)
    itemCtx.drawImage(items[itemId[currentIndex]].img, 12, 12, 48, 48)

    var formattedCount = formatItemCount(itemCount[currentIndex])
    itemCtx.strokeStyle = "black"
    itemCtx.lineWidth = 2
    itemCtx.strokeText("x" + formattedCount, 4, 67)
    itemCtx.fillStyle = "white"
    itemCtx.fillText("x" + formattedCount, 4, 67)

    currentIndex++
  }
}

function drawFactorys() {
  $('#factoryScroll').empty()
  if (factorysToBuy == 0)
    factorysToBuy = gametime
  for (var i = 0; i < factorys.length; i++) {
    $('#factoryScroll').append('<div id="factory' + i + '" class="factory"><h1>Factory ' + i + '</h1><div class="minerals"><br><h2>' + lang.mineralslable + '</h2>' + "<br> - " + lang.minerals[factorys[i].ores[0]] + "<br> - " + lang.minerals[factorys[i].ores[1]] + "<br> - " + lang.minerals[factorys[i].ores[2]] + "<br> - " + lang.minerals[factorys[i].ores[3]] + '</div></div>')
    $('#factory' + i).click(function() {
      var id = $(this).attr("id");
      id = parseInt(id.substr(7))
      factorys[currentFactory].unloadImages()
      factorys[id].loadImages()
      currentFactory = id
      closeUi()
    })
  }
  $('#buyfactory').empty()
  $('#buyfactory').append('<div id="reroll" class="factoryToBuy"><br><h2>' + lang.clickToBuyFactory + '</h2><img src="images/ui/reroll.png"/><span>' + lang.reroll + '<br><span>' + formatCount(factoryRerollPrice) + ' ' + lang.money + '</span></span></div>')
  $('#reroll').click(function() {
    if (money >= factoryRerollPrice) {
      money -= factoryRerollPrice
      factorysToBuy = gametime
      factoryRerollPrice = factoryRerollPrice * 3.5
      drawFactorys()
    }
  })
  var myrng = new Math.seedrandom(factorysToBuy);
  for (var i = 0; i < 4; i++) {
    tier = Math.abs(myrng.int32())
    var rng = new Math.seedrandom(tier);
    $('#buyfactory').append('<div class="factoryToBuy" id="factoryToBuy' + tier + '"><br><p>' + lang.minerals[Math.abs(rng.int32()) % bodenvorkommen.length] + '</p><p>' + lang.minerals[Math.abs(rng.int32()) % bodenvorkommen.length] + '</p><p>' + lang.minerals[Math.abs(rng.int32()) % bodenvorkommen.length] + '</p><p>' + lang.minerals[Math.abs(rng.int32()) % bodenvorkommen.length] + '</p><h1>' + formatCount(factoryPrice) + " " + lang.money + '</h1></div>')
    $('#factoryToBuy' + tier).click(function() {
      var id = $(this).attr("id");
      id = parseInt(id.substr(12))
      if (money >= factoryPrice) {
        money -= factoryPrice
        factoryPrice = factoryPrice * 1.7 + 240000
        factoryRerollPrice = Math.round(factoryRerollPrice / 2 + 1)
        factorys.push(new Factory(id))
        factorysToBuy = gametime
        drawFactorys()
      }
    })
  }
}
