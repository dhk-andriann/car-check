import Konva from 'konva';

const konvaContainer = document.querySelector('#konva-container');

export const stage = new Konva.Stage({
    container: 'konva-container',
    width: konvaContainer.offsetWidth,
    height: konvaContainer.offsetHeight,
});

// Rend le stage responsive en largeur
window.addEventListener('resize', () => {
    stage.width(konvaContainer.offsetWidth);
    stage.height(konvaContainer.offsetHeight);
    stage.draw();
});


const backgroundLayer = new Konva.Layer();
const drawingLayer = new Konva.Layer();
stage.add(backgroundLayer);
stage.add(drawingLayer);

let isPaint = false;
let mode = 'brush';
let brushColor = '#df4b26';
let brushSize = 5;
let lastLine;

stage.on('mousedown touchstart', () => {
    isPaint = true;
    const pos = stage.getPointerPosition();
    lastLine = new Konva.Line({
        stroke: brushColor,
        strokeWidth: brushSize,
        globalCompositeOperation: mode === 'brush' ? 'source-over' : 'destination-out',
        lineCap: 'round',
        lineJoin: 'round',
        points: [pos.x, pos.y, pos.x, pos.y],
    });
    drawingLayer.add(lastLine);
});

stage.on('mouseup touchend', () => {
    isPaint = false;
});

stage.on('mousemove touchmove', (e) => {
    if (!isPaint) return;
    e.evt.preventDefault();
    const pos = stage.getPointerPosition();
    const newPoints = lastLine.points().concat([pos.x, pos.y]);
    lastLine.points(newPoints);
});

const imageObj = new Image();
imageObj.onload = () => {
    const background = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: stage.width(),
        height: stage.height(),
        listening: false,
    });
    backgroundLayer.add(background);
    background.moveToBottom();
    backgroundLayer.draw();
};

imageObj.crossOrigin = 'anonymous'
imageObj.src = 'pov-car-outline.png';

document.getElementById('brush')?.addEventListener('change', () => {
    if (document.getElementById('brush').checked) {
        mode = 'brush';
    }
});

document.getElementById('eraser')?.addEventListener('change', () => {
    if (document.getElementById('eraser').checked) {
        mode = 'eraser';
    }
});

document.getElementById('colorPicker')?.addEventListener('input', (e) => {
    brushColor = e.target.value;
});

const sizePicker = document.getElementById('sizePicker');
const sizeValue = document.getElementById('sizeValue');

sizePicker?.addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value, 10);
    sizeValue.textContent = brushSize;
});

document.getElementById('clearButton')?.addEventListener('click', (ev) => {
    ev.preventDefault()
    drawingLayer.destroyChildren();  // clears only the drawing layer
    drawingLayer.draw();
});
