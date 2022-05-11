
import React, { useRef, useEffect, useState } from 'react'

const Canvas = props => {
    const canvasRef = useRef(null)
    const [largestIndex, setLargestIndex] = useState(0);
    let canvas, ctx;

    useEffect(() => {
        canvas = canvasRef.current
        ctx = canvas.getContext('2d')
        initCanvas()
    }, [])

    // useEffect(() => {
    //     setInterval(() => {
    //         fetch("http://localhost:6923/largest").then(response => {
    //             return response.text();
    //         }).then(largestIndex => {
    //             setLargestIndex(largestIndex);
    //         }).catch(err => {
    //             console.log(err);
    //         });
    //     }, 100);
    // }, []);

    let canvasOffset, offsetX, offsetY, canvasx, canvasy;
    let startX, startY;

    let isDrawing = false, mousedown = false;
    let last_mousex = 0, last_mousey = 0, mousex = 0, mousey = 0;

    const initCanvas = () => {
        if (!canvasRef.current) { return }
        canvasOffset = canvasRef.current.offset;
        offsetX = canvasRef.current.offsetLeft;
        offsetY = canvasRef.current.offsetTop;
        canvasx = canvasRef.current.offsetLeft;
        canvasy = canvasRef.current.offsetTop;
        drawBackgroundImage();
    }

    const drawBackgroundImage = () => {
        if (!canvasRef.current) { return }
        const image = new Image();
        image.src = 'http://51.222.12.76:4000/0.jpg';
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }

    //Mousedown
    const onMouseDownHandler = (e) => {
        last_mousex = parseInt(e.clientX - canvasx);
        last_mousey = parseInt(e.clientY - canvasy);
        mousedown = true;
    };

    //Mouseup
    const onMouseUpHandler = () => {
        mousedown = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackgroundImage();
    }

    //Mousemove
    const onMouseMoveHandler = (e) => {
        mousex = parseInt(e.clientX - canvasx);
        mousey = parseInt(e.clientY - canvasy);
        if (mousedown) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
            drawBackgroundImage();
            ctx.beginPath();
            var width = mousex - last_mousex;
            var height = mousey - last_mousey;
            ctx.rect(last_mousex, last_mousey, width, height);
            //ctx.fillStyle = "#8ED6FF";
            ctx.fillStyle = 'rgba(164, 221, 249, 0.3)'
            ctx.fill();
            ctx.strokeStyle = '#1B9AFF';
            ctx.lineWidth = 1;
            ctx.fillRect(last_mousex, last_mousey, width, height)
            ctx.stroke();
        }
        //Output
        document.getElementById('output').innerHTML = `Current: ${mousex}, ${mousey}<br/>Last: ${last_mousex}, ${last_mousey}<br/>Drawing: ${mousedown}`;
    }

    const handleMouseDown = (e) => {
        mousex = parseInt(e.clientX - offsetX);
        mousey = parseInt(e.clientY - offsetY);

        //document.getElementById("downlog").innerHTML = `First: ${mousex} / ${mousey}`;

        // Put your mousedown stuff here
        if (isDrawing) {
            isDrawing = false;
            ctx.beginPath();
            ctx.rect(startX, startY, mousex - startX, mousey - startY);
            ctx.fill();
            drawBackgroundImage();
            canvas.style.cursor = "default";
        } else {
            isDrawing = true;
            startX = mousex;
            startY = mousey;
            canvas.style.cursor = "crosshair";
        }

    }

    return <>
        <canvas
            ref={canvasRef}
            onMouseDown={(e) => {
                onMouseDownHandler(e);
                handleMouseDown(e);
            }}
            onMouseUp={onMouseUpHandler}
            onMouseMove={onMouseMoveHandler}
            {...props} />
        <div id="output"></div>
        <div id="downlog"></div>
    </>
}

export default Canvas