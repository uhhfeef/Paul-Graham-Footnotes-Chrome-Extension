let popup = document.createElement('div');
popup.style.position = 'fixed';
popup.style.backgroundColor = '#F5F5DC'; // beige
popup.style.border = '2px solid #964B00'; // brown
popup.style.padding = '5px';
popup.style.zIndex = '9999';
popup.style.maxWidth = '300px';
popup.style.wordWrap = 'break-word'; 
popup.style.display = 'none';
popup.style.pointerEvents = 'none'; 
popup.style.font = 'inherit'; 
document.body.appendChild(popup);

let currentLink = null;
let isOverLink = false;
let popupTimeout = null;

function showPopup(element, x, y) {
    const hrefName = findHrefName(element);
    const content = getNextContentAfterElement(hrefName);

    popup.innerHTML = content;
    
    // Set display to 'block' temporarily to get dimensions
    popup.style.display = 'block';
    
    // Calculate position
    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;
    
    let leftPosition = x - popupWidth / 2; // Center horizontally on cursor
    let topPosition = y - popupHeight - 10; // 10px above the cursor
    
    const viewportHeight = window.innerHeight;
    if (topPosition + popup.offsetHeight > viewportHeight) {
        topPosition = Math.max(0, viewportHeight - popup.offsetHeight);
    }

    if (topPosition < 0) topPosition = y + 20;
    
    popup.style.left = `${leftPosition}px`;
    popup.style.top = `${topPosition}px`;
}

function hidePopup() {
    popup.style.display = 'none';
    currentLink = null;
}

document.addEventListener('mousemove', function(event) {
    const target = event.target.closest('a');
    
    if (target) {
        if (target !== currentLink) {
            currentLink = target;
            clearTimeout(popupTimeout);
            popupTimeout = setTimeout(() => showPopup(target, event.clientX, event.clientY), 100);
        }
        isOverLink = true;
    } else {
        isOverLink = false;
        if (currentLink) {
            clearTimeout(popupTimeout);
            popupTimeout = setTimeout(hidePopup, 50);
        }
    }
});

function findHrefName(element) {
    const full_href = element.href;
    const regex = /f\d+n/;
    const match = full_href.match(regex);
    return match ? match[0] : null;
}

function getNextContentAfterElement(element) {
    const targetElement = document.querySelector(`[name="${element}"]`);

    let nextNode = targetElement.nextSibling;
    let content = '';

    while (nextNode && nextNode.nodeName !== 'BR') {
        if (nextNode.nodeType === Node.TEXT_NODE) {
            content += nextNode.textContent;
        } else if (nextNode.nodeType === Node.ELEMENT_NODE) {
            content += nextNode.outerHTML;
        }
        nextNode = nextNode.nextSibling;
    }

    return content.trim() || "No content found after the specified element.";
}
