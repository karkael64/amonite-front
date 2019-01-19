const DEFINES = {};
const DEFINED = [];

function define (nodeName, builder) {
  if (typeof nodeName !== "string")
    throw new Error("First parameter should be a string (to select items by node name in dom tree)");
  if (typeof builder !== "function")
    throw new Error("Second parameter should be a class or a function (to construct item)");
  DEFINES[nodeName.toUpperCase()] = builder;
  [...document.querySelectorAll(nodeName.toUpperCase())].forEach(test);
}

function getCustomChildren(node) {
    return [...node.querySelectorAll(Object.keys(DEFINES).join(",").toUpperCase())];
}

function test (node) {
  let def;
  if (DEFINED.indexOf(node) !== -1) {
    return;
  }

  else if (def = DEFINES[node.nodeName.toUpperCase()]) {
    new def(node);
    let children = getCustomChildren(node);
    if (children.length) {
      children.forEach(function (child) {
        child.addEventListener("load", function () {
          if( !children.filter(function (child) { return DEFINED.indexOf(child) === -1; }).length ) {
            DEFINED.push(node);
            node.dispatchEvent(new Event("load"));
          }
        });
      });
    }
    else {
      DEFINED.push(node);
      node.dispatchEvent(new Event("load"));
    }
  }

  if (node.childNodes.length) {
    node.childNodes.forEach(test);
  }
}

function onload() {
  let mo = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(test);
    });
  });

  var cnf = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  mo.observe(document.querySelector("html"), cnf);
}

window.addEventListener("load", onload);
if(window.document.readyState === "complete") {
  onload();
}

class CustomHTMLElement {
}

export { define as default, define, CustomHTMLElement };
